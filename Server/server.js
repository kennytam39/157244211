
var restify = require('restify')
var server = restify.createServer()
// var nano = require('nano')('http://localhost:5984');
var nano = require('nano')('http://218.103.197.91:5984');//my home couchDB
var request = require("request");

// Configure Restify
server.use(restify.fullResponse())
server.use(restify.bodyParser())

// Set up database access
var recipes = nano.db.use('assignment_recipe');// "recipes" database 
var member = nano.db.use('assignment_user');// "member" database 
var favourList = nano.db.use('assignment_favourlist');// "assignment_favourlist" database

// startup server with default port or 10000
var port = process.env.PORT || 10000;
server.listen(port, function (err) {
    if (err) {
        console.error(err);
    }
    else {
        console.log("App is ready at: " + port);
    }
});

// init rest url and link the function
server.post("/user", createUser);
server.get("/user/:name/:password", getUser);
server.get("/user/:name", validateUser);

server.get("/allRecipes/:keyword", searchRecipe);
server.get("/recipes/:id", getRecipe);

server.get("/allFavourList/:user", getAllFavourList);
server.post("/favourList", createFavourList);
server.get("/favourList/:id", getFavourList);
server.del("/favourList/:id", delFavourList);
server.put("/favourList/:id", updateFavourList);


// insert new user
function createUser(req, res, next) {
    if (req.body == undefined) {//process empty request
        res.json({result: false});
        res.send();
        res.end();
    } else {
        member.insert(req.body, req.body.username, function (err, body) {//username will be the user id
            if (!err) {//insert success
                res.json({"result": true});
            } else {//insert failed
                console.log(err)
                res.json({"result": false});
                res.send();
            }
            res.send();
            res.end();
        });
    }
}

//config update function of the favourite list
member.update = function (key, callback) {
    var db = this;
    db.get(key, function (error, existing) {//get user document
        if (!error) {
            existing.validate = true;//change true for validation
            db.insert(existing, key, callback);//instead document
        }
    });
}

//email validate
function validateUser(req, res, next) {
    member.update(req.params.name, function (err, response) {//update a document by id
        if (!err) {//validate success
            res.json({"result": true});
        } else {//validate failed
            console.log(err);
            res.json({"result": false});
        }
        res.send();
    });
}

//confirm user login
function getUser(req, res, next) {
    member.get(req.params.name, function (err, body) {//get a user by user id
        if (!err) {
            if (body.validate)
                res.json({result: (body.password == req.params.password)});//for security, only return true or false
            else
                res.json({result: false});
        } else {//query failed, no this user
            console.log(err)
            res.json({"result": false});
            res.send();
        }
        res.send();
        res.end();
    });
}

//search all of the related keyword, return the reorganized data to user
function searchRecipe(req, res, next) {
    var options = {//config rest request
        url: "http://food2fork.com/api/search?key=8e839d6c221d15a7e8537b6e87a28c2e&q=" + req.params.keyword, //thritd party api rest url
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };

    request.get(options, function (error, response, body) {//request start
        var ret = [];
        if (error) {//request failed
            console.log(err)
            res.json({"result": false, "count": 0, "recipes": ret});
            res.send();
        } else {//request success
            var recipes = JSON.parse(body);
            recipes.recipes.forEach(function (data) {//reorganize data getting from thrid party
                var tmp = {
                    "id": data.recipe_id,
                    "title": data.title,
                    "image_url": data.image_url
                }
                ret.push(tmp);
            });
            res.json({"result": true, "count": recipes.count, "recipes": ret});//return result
        }
        res.send();
        res.end();
    });
}

//get a recipe by recipe id
function getRecipe(req, res, next) {
    var options = {//config rest request
        url: "http://food2fork.com/api/get?key=8e839d6c221d15a7e8537b6e87a28c2e&rId=" + req.params.id,
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };

    request.get(options, function (error, response, body) {//request start
        if (error) {//request failed
            console.log(err)
            res.json({"result": "failed"});
        } else {//request success
            var recipe = JSON.parse(body);
            ret = {//reorganize result data
                "id": recipe.recipe.recipe_id,
                "title": recipe.recipe.title,
                "image_url": recipe.recipe.image_url,
                "ingredients": recipe.recipe.ingredients,
                "source_url": recipe.recipe.source_url,
            }
            res.json({"result": true, "recipe": ret});//return result
        }
        res.send();
        res.end();
    });
}

//create a favourite recipe to favourite list
function createFavourList(req, res, next) {
    if (req.body == undefined) {//process empty request
        res.json({result: "invalid operation"});
        res.send();
        res.end();
    } else {
        favourList.insert(req.body, req.body.recipe_id, function (err, body) {//username+recipe id will be the favourite item id
            if (!err) {//create success
                res.json({"result": true});
            } else {//create failed
                console.log(err)
                res.json({"result": false});
            }
            res.send();
            res.end();
        });
    }
}

//get all favourite recipe according to specific user
function getAllFavourList(req, res, next) {
    var ret = [];// recipe array
    var i = 0;
    favourList.list({include_docs: true}, function (err, body) {//query favourite recipes
        if (!err) {//query success
            body.rows.forEach(function (db) {//config result data
                if (db.doc.user === req.params.user) {
                    ret.push(db.doc);
                    i++;
                }
            });
            res.json({"result": true, "count": i, "favourList": ret});
        } else {//query failed
            console.log(err)
            res.json({"result": false, "count": 0, "favourList": ret});
        }
        res.send();
        res.end();
    });
}

//get a specific favourite recipe
function getFavourList(req, res, next) {
    favourList.get(req.params.id, function (err, body) {//query by favourite recipe id
        if (!err) {//query success
            res.json({"result": true, "count": 1, "favourList": body});//body is the result data
        } else {//query failed
            console.log(err)
            res.json({"result": false, "count": 0, "favourList": []});
        }
        res.send();
        res.end();
    });
}

//delete a specific favourite recipe
function delFavourList(req, res, next) {
    favourList.get(req.params.id, function (err, body) {//get favourite recipe by id because deleting a item must have document 's _rev
        if (!err) {//get success
            favourList.destroy(body._id, body._rev, function (err, body) {//delete the favourite recipe
                if (err) {
                    console.log(err)
                }
            });
            res.json({"result": true});//delete success
            res.send();
        } else {//get failed
            console.log(err)
            res.json({"result": false});
            res.send();
        }
        res.end();
    });
}

//config update function of the favourite list
favourList.update = function (obj, key, callback) {
    var db = this;
    db.get(key, function (error, existing) {
        if (!error) {
            obj._rev = existing._rev;//get document 's rev
            db.insert(obj, key, callback);//instead document
            return true;
        } else {
            return false;
        }
    });
}

//update a specific favourite recipe
function updateFavourList(req, res, next) {
    favourList.update(req.body, req.params.id, function (err, response) {//update a document by id
        if (!err) {//update success
            res.json({"result": true});
        } else {//update failed
            console.log(err);
            res.json({"result": false});
        }
        res.send();
    });
}
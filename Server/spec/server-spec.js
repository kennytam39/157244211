

var frisby = require('frisby')
var server = "https://assignment-kennytam.c9users.io/";

//check rest api of creating user 
frisby.create('Create a new user')
        .post(server + 'user',
                {
                    "username": "debugTest",
                    "password": "debugTest",
                    "email": "test@test.com",
                    "validate": false
                }, {json: true})//user data
        .expectStatus(200)
        .expectJSON({"result": Boolean})
        .expectHeaderContains('content-type', 'application/json')
        .toss()

//check rest api of Email validation
frisby.create('Email validation')
        .get(server + 'user/debugTest')
        .expectStatus(200)
        .expectJSON({"result": Boolean})
        .expectHeaderContains('content-type', 'application/json')
        .toss()

//check rest api of user login function
frisby.create('Validate login function')
        .get(server + 'user/debugTest/debugTest')//this user alread create in test 1
        .expectStatus(200)
        .expectJSON({"result": Boolean})
        .expectHeaderContains('content-type', 'application/json')
        .toss()

//check rest api of recipe searching function
frisby.create('Get recipe list by keyword')
        .get(server + 'allRecipes/fish')
        .expectStatus(200)
        .expectJSON({"result": Boolean, "count": Number, "recipes": Array})
        .expectHeaderContains('content-type', 'application/json')
        .toss()

//check rest api of recipe searching function, but using no keyword
frisby.create('Get recipe list without keyword')
        .get(server + 'allRecipes')
        .expectStatus(404)
        .expectHeaderContains('content-type', 'application/json')
        .toss()

//check rest api of getting recipe function
frisby.create('Get a recipe by id')
        .get(server + 'recipes/35236')
        .expectStatus(200)
        .expectJSON({"result": Boolean, "recipe": {
                "id": String,
                "title": String,
                "image_url": String,
                "ingredients": Array,
                "source_url": String
            }})//response data
        .expectHeaderContains('content-type', 'application/json')
        .toss()

//check rest api of getting recipe function, but without id
frisby.create('Get a recipe without id')
        .get(server + 'recipes')
        .expectStatus(404)
        .toss()

//check rest api of creating favourite recipe
frisby.create('Create a favourite recipe')
        .post(server + 'favourList', {
            "recipe_id": "debugTest123",
            "user": "debugTest",
            "title": "debugTest",
            "directions": "debugTest",
            "ingredients": "debugTest",
            "image_url": "debugTest",
            "source_url": "debugTest",
            "note": ""
        }, {json: true})//favourite recipe data
        .expectStatus(200)
        .expectJSON({"result": Boolean})
        .expectHeaderContains('content-type', 'application/json')
        .toss()

//check rest api of creating favourite recipe without data
frisby.create('Create a favourite recipe without data')
        .post(server + 'favourList')
        .expectStatus(200)
        .expectJSON({"result": Boolean})
        .expectHeaderContains('content-type', 'application/json')
        .toss()

//check rest api of getting all favourite recipe according to username 
frisby.create('Get all favourite recipe list by username')
        .get(server + 'allFavourList/debugTest')
        .expectStatus(200)
        .expectJSON({"result": Boolean, "count": Number, "favourList": Array})
        .expectHeaderContains('content-type', 'application/json')
        .toss()

//check rest api of getting all favourite recipe without username 
frisby.create('Get all favourite recipe list without username')
        .get(server + 'allFavourList')
        .expectStatus(404)
        .expectHeaderContains('content-type', 'application/json')
        .toss()

//check rest api of specific id
frisby.create('Get a favourite recipe by id')
        .get(server + 'favourList/debugTest123')
        .expectStatus(200)
        .expectJSON({"result": Boolean, "count": Number, "favourList": Array})
        .expectHeaderContains('content-type', 'application/json')
        .toss()

//check rest api of without id
frisby.create('Get a favourite recipe without id')
        .get(server + 'favourList')
        .expectStatus(405)
        .expectHeaderContains('content-type', 'application/json')
        .toss()

//check rest api of updating favourite recipe
frisby.create('Update a favourite recipe')
        .put(server + 'favourList/debugTest123', {
            "recipe_id": "debugTest123",
            "user": "debugTest",
            "title": "debugTest",
            "directions": "debugTest",
            "ingredients": "debugTest",
            "image_url": "debugTest",
            "source_url": "debugTest",
            "note": "debugTest2"
        }, {json: true})//new recipe data
        .expectStatus(200)
        .expectJSON({"result": Boolean})
        .expectHeaderContains('content-type', 'application/json')
        .toss()

//check rest api of deleting favourite recipe
frisby.create('Delete a favourite recipe')
        .delete(server + 'favourList/debugTest123')
        .expectStatus(200)
        .expectJSON({"result": Boolean})
        .expectHeaderContains('content-type', 'application/json')
        .toss()

//check rest api of deleting non-exist favourite recipe
frisby.create('Delete a non-exist favourite recipe')
        .delete(server + 'favourList/debugTest123333')
        .expectStatus(200)
        .expectJSON({"result": Boolean})
        .expectHeaderContains('content-type', 'application/json')
        .toss()
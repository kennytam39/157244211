

var frisby = require('frisby')
var server = "https://assignment-kennytam.c9users.io/";

frisby.create('Create a new user')
        .post(server + 'user',
                {
                    "username": "debugTest",
                    "password": "debugTest",
                    "email": "test@test.com",
                    "validate": false
                }, {json: true})
        .expectStatus(200)
        .expectJSON({"result": Boolean})
        .expectHeaderContains('content-type', 'application/json')
        .toss()

frisby.create('Email validation')
        .get(server + 'user/debugTest')
        .expectStatus(200)
        .expectJSON({"result": Boolean})
        .expectHeaderContains('content-type', 'application/json')
        .toss()

frisby.create('Validate login function')
        .get(server + 'user/debugTest/debugTest')
        .expectStatus(200)
        .expectJSON({"result": true})
        .expectHeaderContains('content-type', 'application/json')
        .toss()

frisby.create('Validate login function with password error')
        .get(server + 'user/debugTest/debugTest1')
        .expectStatus(200)
        .expectJSON({"result": false})
        .expectHeaderContains('content-type', 'application/json')
        .toss()

frisby.create('Validate a non-exist user')
        .get(server + 'user/testtest/test')
        .expectStatus(200)
        .expectJSON({"result": false})
        .expectHeaderContains('content-type', 'application/json')
        .toss()

frisby.create('Get recipe list by keyword')
        .get(server + 'allRecipes/fish')
        .expectStatus(200)
        .expectJSON({"result": Boolean, "count": Number, "recipes": Array})
        .expectHeaderContains('content-type', 'application/json')
        .toss()

frisby.create('Get recipe list without keyword')
        .get(server + 'allRecipes')
        .expectStatus(404)
        .expectHeaderContains('content-type', 'application/json')
        .toss()

frisby.create('Get a recipe by id')
        .get(server + 'recipes/35236')
        .expectStatus(200)
        .expectJSON({"result": Boolean, "recipe": {
                "id": String,
                "title": String,
                "image_url": String,
                "ingredients": Array,
                "source_url": String
            }})
        .expectHeaderContains('content-type', 'application/json')
        .toss()

frisby.create('Get a recipe without id')
        .get(server + 'recipes')
        .expectStatus(404)
        .toss()

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
        }, {json: true})
        .expectStatus(200)
        .expectJSON({"result": Boolean})
        .expectHeaderContains('content-type', 'application/json')
        .toss()

frisby.create('Create a favourite recipe without data')
        .post(server + 'favourList')
        .expectStatus(200)
        .expectJSON({"result": Boolean})
        .expectHeaderContains('content-type', 'application/json')
        .toss()

frisby.create('Get all favourite recipe list by username')
        .get(server + 'allFavourList/debugTest')
        .expectStatus(200)
        .expectJSON({"result": Boolean, "count": Number, "favourList": Array})
        .expectHeaderContains('content-type', 'application/json')
        .toss()

frisby.create('Get all favourite recipe list without username')
        .get(server + 'allFavourList')
        .expectStatus(404)
        .expectHeaderContains('content-type', 'application/json')
        .toss()

frisby.create('Get a favourite recipe by id')
        .get(server + 'favourList/debugTest123')
        .expectStatus(200)
        .expectJSON({"result": Boolean, "count": Number, "favourList": Array})
        .expectHeaderContains('content-type', 'application/json')
        .toss()

frisby.create('Get a favourite recipe without id')
        .get(server + 'favourList')
        .expectStatus(405)
        .expectHeaderContains('content-type', 'application/json')
        .toss()

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
        }, {json: true})
        .expectStatus(200)
        .expectJSON({"result": Boolean})
        .expectHeaderContains('content-type', 'application/json')
        .toss()

frisby.create('Update a favourite recipe without data')
        .put(server + 'favourList/debugTest123')
        .expectStatus(500)
        .expectJSON({"result": Boolean})
        .expectHeaderContains('content-type', 'application/json')
        .toss()

frisby.create('Delete a favourite recipe')
        .delete(server + 'favourList/debugTest123')
        .expectStatus(200)
        .expectJSON({"result": Boolean})
        .expectHeaderContains('content-type', 'application/json')
        .toss()

frisby.create('Delete a non-exist favourite recipe')
        .delete(server + 'favourList/debugTest123333')
        .expectStatus(200)
        .expectJSON({"result": Boolean})
        .expectHeaderContains('content-type', 'application/json')
        .toss()

frisby.create('Delete a favourite recipe without id')
        .delete(server + 'favourList')
        .expectStatus(405)
        .expectJSON({"result": Boolean})
        .expectHeaderContains('content-type', 'application/json')
        .toss()
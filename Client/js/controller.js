
var serverUrl = "https://assignment-kennytam.c9users.io/";//rest server url

//a route map table, direct to a correct url
var myRecipe = angular.module("myRecipe", ["ngRoute"]);
myRecipe.config(function ($routeProvider) {
    $routeProvider
    .when("/mainPage", {
                templateUrl: "Template/Main.html"
            })
            .when("/login", {
                templateUrl: "Template/Login.html"
            })
            .when("/register", {
                templateUrl: "Template/Register.html"
            })
            .when("/search", {
                templateUrl: "Template/Search.html"
            })
            .when("/recipeDetails", { 
                templateUrl: "Template/RecipeDetails.html"
            })
            .when("/favourList", {
                templateUrl: "Template/FavourList.html"
            })
            .when("/favourListItem", {
                templateUrl: "Template/FavourListItem.html"
            })
            .otherwise({
                redirectTo: '/mainPage'
            });
});

//process login
myRecipe.controller('loginCtl', ['$location', '$scope', '$http',
    function ($location, $scope, $http) {
        $scope.login = function () {//check login result
            $http({
                url: serverUrl + "user/" + $scope.username + "/" + $scope.password, //config rest url
                method: 'GET'
            }).success(function (data, status, headers, config) {
                if (data.result == true) {//login success
                    alert("Login success!")
                    sessionStorage.setItem("isLogin", true)//set a session to record log status
                    sessionStorage.setItem("username", $scope.username)
                    $location.path('/search');//redirect to search page
                } else {//login failed
                    alert("Wrong username/password or non-validated account!");
                }
            }).error(function (data, status, headers, config) {//server failed
                alert("Server error, fail to connect server!");
            });
        }
    }
]);

//process register
myRecipe.controller('registerCtl', ['$location', '$scope', '$http',
    function ($location, $scope, $http) {
        $scope.register = function () {
            if ($scope.password != $scope.password2) {//check password
                alert("Password not match!");
            } else {//create the account
                var data = {//init rest data
                    "username": $scope.username,
                    "password": $scope.password,
                    "email":$scope.email,
                    "validate":false
                }
                $http({//config request
                    url: serverUrl + "user",
                    method: 'POST',
                    data: data
                }).success(function (data, status, headers, config) {//request success
                    if (data.result) {//register success
                        alert("Registered!");
                        $location.path('/login');
                    } else {//register failed
                        alert("User alread exist!");
                    }
                }).error(function (data, status, headers, config) {//request failed
                    alert(status);
                })
            }
        }
    }
]);

//process search
myRecipe.controller('searchCtl', ['$scope', '$http',
    function ($scope, $http) {
        $scope.search = function (para) {
            var self = this;
            self.recipes = [];
            $http({//config request
                url: serverUrl + "allRecipes/" + para.keyword,
                method: 'GET'
            }).success(function (data, status, headers, config) {//request success
                if (data.result) {//can search data
                    if (data.count == 0)
                        alert("No any result!");
                    $scope.recipes = data.recipes;
                } else {//no any search data
                    alert("Search failed!");
                }
            }).error(function (data, status, headers, config) {//request failed
                alert("Server error, fail to connect server!");
            });
        }
    }
]);

//process recipe details
myRecipe.controller('recipeDetailsCtl', ['$scope', '$http', '$routeParams',
    function ($scope, $http, $routePara) {
        var ret;
        $http({//get a specific recipe
            url: serverUrl + "recipes/" + $routePara.id,
            method: 'GET'
        }).success(function (data, status, headers, config) {//request success
            if (data.result) {//get data success and pass data
                $scope.data = data.recipe;
                ret = data.recipe;
            } else {//get data failed
                alert("No this recipe!");
            }
        }).error(function (data, status, headers, config) {//request failed
            alert("Server error, fail to connect server!");
        });

        $scope.addFavList = function () {//pass a function to webpage
            if (sessionStorage.getItem("username") == undefined) {//check if login
                alert("This function only provide to our member!");
                return;
            } else {
                //add to favourite list
                var data = {//favourite list data
                    "recipe_id": sessionStorage.getItem("username") + $routePara.id,
                    "user": sessionStorage.getItem("username"),
                    "title": ret.title,
                    "directions": "",
                    "ingredients": ret.ingredients,
                    "image_url": ret.image_url,
                    "source_url": ret.source_url,
                    "note": ""
                }
                
                $http({//config request
                    url: serverUrl + "favourList",
                    method: 'POST',
                    data: data
                }).success(function (data, status, headers, confirm) {//request success
                    if (data.result) {
                        alert("Success!");
                    } else {
                        alert("This recipe alread exist in your favourite list!");
                    }
                }).error(function (data, status, headers, config) {//request failed
                    alert("Server error, fail to connect server!");
                })
            }
        }

    }
])

//process favourite recipe list
myRecipe.controller('favListCtl', ['$scope', '$http', '$location',
    function ($scope, $http, $location) {
        if (sessionStorage.getItem("username") == undefined) {//check if login
            alert("This function only provide to our member!");
            $location.path('/login')//redirect to login page
        } else {
            var self = this;
            self.favourItems = [];//favourite recipe array
            $http({//config request
                url: serverUrl + "allFavourList/" + sessionStorage.getItem("username"),
                method: 'GET'
            }).success(function (data, status, headers, config) {//request success
                if (data.result) {
                    if (data.count == 0)//empty favourite list
                        alert("No any favourite recipes!");
                    $scope.favourItems = data.favourList;
                }
            }).error(function (data, status, headers, config) {//request failed
                $scope.favourItems = null;
                alert("Server error, fail to connect server!");
            })
        }
    }
]);

//process favourite recipe
myRecipe.controller('favListItemCtl', ['$scope', '$http', '$routeParams', '$location',
    function ($scope, $http, $routePara, $location) {
        //get the details of recipe & note
        $http({//config requst to get a favourite recipe
            url: serverUrl + "favourList/" + $routePara.id,
            method: 'GET'
        }).success(function (data, status, headers, config) {//request success
            if (data.result) {//get success
                $scope.item = data.favourList;
                $scope.note = data.favourList.note;
            } else {////get failed, no this recipe
                alert("No any result back from database!");
                $location.path('/favourList');
            }
        }).error(function (data, status, headers, config) {//request failed
            $scope.favlist = null;
            alert("Server error, fail to connect server!");
        })

        $scope.delFavourListItem = function () {//pass a delete function to page
            $http({//config request
                url: serverUrl + "favourList/" + $routePara.id,
                method: 'DELETE'
            }).success(function (data, status, headers, config) {//request success
                if (data.result) {//delete success
                    alert("Delete Success!");
                    $location.path('/favourList');
                } else {//delete failed
                    alert("Delete failed, database error");
                }
            }).error(function (data, status, headers, config) {//request failed
                alert("Server error, fail to connect server!");
            })
        }

        $scope.updateFavourListItem = function () {//pass a update function to page
            var data = {//config update data
                "recipe_id": sessionStorage.getItem("username") + $routePara.id,
                "user": sessionStorage.getItem("username"),
                "title": $scope.item.title,
                "directions": "",
                "ingredients": $scope.item.ingredients,
                "image_url": $scope.item.image_url,
                "source_url": $scope.item.source_url,
                "note": $scope.note
            }

            $http({//config request
                url: serverUrl + "favourList/" + $routePara.id,
                method: 'PUT',
                data: data
            }).success(function (data, status, headers, config) {//request success
                if (data.result) {//update success
                    alert("Update success!");
                    $location.path('/favourList');//redirect to favourite list
                } else {//update failed
                    alert("Update failed!");
                }
            }).error(function (data, status, headers, config) {//request failed
                alert("Server error, fail to connect server!");
            })
        }

    }
]);

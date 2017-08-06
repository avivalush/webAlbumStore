"use strict";
var app = angular.module('app',['ngRoute','ui.bootstrap','ngDialog','ngStorage','ngCookies']);


app.config(['$routeProvider','$qProvider','$httpProvider', function($routeProvider,$qProvider,$httpProvider){
  $qProvider.errorOnUnhandledRejections(false);
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
    $httpProvider.defaults.headers.common = 'Content-Type: application/json';
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $routeProvider
    .when('/login', {
      templateUrl: 'components/login/loginView.html',
      controller: 'loginController'
    })
    .when('/register', {
      templateUrl: 'components/register/registerView.html',
      controller: 'registerController'
    })
    .when('/about', {
     templateUrl: 'components/about/about.html'
    })
    .when('/products', {
      templateUrl: 'components/products/productsView.html',
      controller: 'productsController'
    }).when('/cart', {
      templateUrl: 'components/cart/cartView.html',
      controller: 'cartController'
    })
    .when('/home', {
      templateUrl: 'components/home/homeView.html',
      controller: 'homeController'
    })
    .otherwise({
      redirectTo: '/home'
    });


}]);


app.controller('mainController', ['userService','$cookies','$http','$location','$localStorage','$window', function(userService,$cookies,$http,$location,$localStorage,$window){
    var vm = this;
  //  vm.username = userService.userName;
    vm.userService = userService;




    vm.logOut=function() {
        userService.logOut($cookies);
        $window.alert('Thank you for choosing our site');
        $location.path('/home');
    }





}]);

app.factory('cartService',['$window', function ($window) {
    var service = {};
    service.itemInCart = [];
    service.totalPrice = 0;
    service.Item_name ='';
    service.Item_artist ='';
    service.Item_price ='';
    service.Item_stock ='';
    service.Item_Category ='';
    service.buyAmount ='';
    service.datePublish ='';
    service.Item =[];
    service.Order_id ='';
    service.addToCart = function (item) {
        service.totalPrice += item.Item_price;
        var found=true;
        for(var i = 0; i < service.itemInCart.length; i++) {
            if (service.itemInCart[i].Item_name == item.Item_name) {
                $window.alert('The product is already in the cart');
                found=false;
                break;
            }
        }
        if(found){
            service.itemInCart.push(item);
            $window.alert('The product has been added to the shopping cart successfully');
        }

    };
    service.solve = function (item,num) {
        service.totalPrice += item.Item_price*num;
    }
    service.addToOrders=function (orders) {
        service.Order=orders;
        service.Order_id=orders.Order_id;
        service.DateOrder=orders.DateOrder;
        service.dateShip=orders.dateShip;
        service.listItem=orders.listItem[0];



    }
    service.addToItem = function (item) {

        service.Item =item;
        service.Item_name=item.Item_name;
        service.Item_artist=item.Item_artist;
        service.Item_price=item.Item_price;
        service.Item_stock=item.Item_stock;
        service.Item_Category=item.Item_Category;
        service.buyAmount=item.buyAmount;
        service.datePublish=item.datePublish;
        service.photourl=item.photourl;

    };
    service.removeFromCart = function (product) {

            service.totalPrice -= product.Item_price;


        var index = service.itemInCart.indexOf(product);
        service.itemInCart.splice(index, 1);

    };
    service.getProductInCart = function () {
        return service.itemInCart;
    };

    service.getTotalPrice = function () {
        return service.totalPrice;
    };
    return service;
}]);

app.factory('userService', ['$http', function ($http) {
    var service = {};
    var dc = document.cookie;
    if(dc!=""){
        service.userName=dc.substring(0,dc.indexOf("="));
        service.isLoggedIn = true;


    }
    else{
        service.userName= "Guest";
        service.isLoggedIn = false;
        service.lastLogin = "";
    }


    service.login = function (user) {
        return $http.post('http://localhost:3000/users/Login', user)
            .then(function (res) {
                var token = res.data;

                service.lastLogin = "Last Entry: "+token[0].lastDate;
                service.isLoggedIn = true;
                service.userName = user.User_name;
                return Promise.resolve(res);
            })
            .catch(function (e) {
                return Promise.reject(e);
            });
    };

    service.logOut=function($cookies){
        $cookies.remove(service.userName);
        service.userName= "Guest";
        service.isLoggedIn = false;
        service.lastLogin = "";
    };

    service.getLoggedIn = function(){
        return service.isLoggedIn;
    }
    return service;
}]);


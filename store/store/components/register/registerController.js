
'use strict'

app.controller('registerController',['$http','$window','$location',function($http,$window,$location){
    var Url = "http://localhost:3000/users/Register";
  var ctrl = this;
  ctrl.countrylist = [];
  $http.get("countries.xml").then(function (xml) {
    if(xml.data.length > 0){
      var tmp = xml.data.toString().split("<Name>");
      var tmp2 = tmp;
      for (var i = 1; i < tmp2.length; i++) {
        var n = tmp2[i].search("</Name>")
        ctrl.countrylist[i-1] = tmp2[i].slice(0,n);
      }
    }
  });

  ctrl.categories =[];
    var Url1 = "http://localhost:3000/users/getCategoryList";
    $http.get(Url1).then(function (response) {
        var returnData = response.data;
        ctrl.categories = returnData;
        console.log(returnData);
    }, function (errResponse) {
        console.error('Error while fetching products');
    });

  ctrl.registerfunc = function(){
    var uname = ctrl.register.username;
    var pass = ctrl.register.password;
    var fname = ctrl.register.firstname;
    var lname = ctrl.register.lastname;
    var email = ctrl.register.email;
    var address = ctrl.register.address;
    var restore1 = ctrl.register.restore1;
    var restore2 = ctrl.register.restore2;
    var country = ctrl.register.country;
    var cat1 = ctrl.register.catr1;
    var cat2 = ctrl.register.catr2;
    var cat3 = ctrl.register.catr3;
    var cats = [];
      if ((ctrl.categories.indexOf(cat1)>=0)&&(cats.indexOf(cat1)==-1)){
          cats.push(cat1);
      }
      if ((ctrl.categories.indexOf(cat2)>=0)&&(cats.indexOf(cat2)==-1)){
          cats.push(cat2);
      }
      if ((ctrl.categories.indexOf(cat3)>=0)&&(cats.indexOf(cat3)==-1)){
          cats.push(cat3);
      }
      var date = new Date();
      var dateString = date.toString();
      dateString = dateString.substring(0, dateString.indexOf("G"));
      var jsonReg= {
          "User_name":uname,
          "User_firstname":fname,
          "User_lastname":lname,
          "User_email":email,
          "User_adress":address,
          "User_password":pass,
          "User_country": country,
          "User_reqans1": restore1,
          "User_reqans2":restore2,
          "User_Favoritecategories":cats,
          "lastDate": dateString};
      $http.post(Url, jsonReg)
          .then(function (response) {
                  var ans = response.data;
                   ctrl.response= ans;
                  $window.alert("register: You are register");
                  $location.path('/login');
              }, function (reason) {
                   ctrl.response = "error is " + reason.message;
                    $window.alert("register: Something went wrong2");
              }
          )


  };//function is closed




}]);

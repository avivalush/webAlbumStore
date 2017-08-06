
app.controller('loginController',['userService','$cookies','$localStorage','$http','$window','$location',function(userService,$cookies,$localStorage,$http,$window,$location){
  var ctrl = this;
  ctrl.restore=false;
  ctrl.questionrestore1="What is your mother's name?";
  ctrl.questionrestore2="What is the name of your elementry school?";
  ctrl.userService=userService;

  ctrl.reg=function () {
      $location.path('register');
  }
    ctrl.loginfunc = function(valid){
        if(valid){
           var uname = ctrl.user.User_name;
            var pass = ctrl.user.User_password;
            var date = new Date();
            var dateString = date.toString();
            dateString = dateString.substring(0, dateString.indexOf("G"));
            var jsonUser= {
                "User_name":uname,
                "User_password":pass,
                "lastDate": dateString};
                userService.login(jsonUser)
                .then(function (succes){
                        $window.alert('You are logged in!');
                        $location.path('home');
                        ctrl.response= succes.data;

                    cookieSet(uname, pass);
                    },function(error){
                        c.response= error.message;
                        $window.alert('Login failed!');
                    }
                )
        }

    };

    function cookieSet(User_name,User_password){
      var cookie=$cookies.get(User_name);
        if (!cookie){
            $cookies.put(User_name, User_password)
                console.log("cookie good");

        }
        else console.log("cookie already exist");
    }

    ctrl.restorefunc=function () {
        ctrl.restore=true;
    }

    ctrl.checkans = function(valid){
        if(valid){
            var uname = ctrl.login.User_name;
            var ans1 = ctrl.login.qres1;
            var ans2 = ctrl.login.qres2;
            var Url="http://localhost:3000/users/PasswordRec";
            var jsonReg= {
                "User_name":uname,
                "User_reqans1":ans1,
                "User_reqans2":ans2};
            $http.post(Url, jsonReg)
                .then(function (response) {
                        var ans = response.data;
                        ctrl.response= ans;
                        $window.alert("your password is:" +ctrl.response);
                        ctrl.restore=false;
                    }, function (reason) {
                        ctrl.response = "error is " + reason.message;
                        $window.alert("register: Something went wrong2");
                    }
                )
        }



    };//function is closed










}]);

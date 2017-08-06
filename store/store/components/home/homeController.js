console.log("home controller");
app.controller('homeController',['$http','userService','cartService','ngDialog','$window','$location',function($http,userService,cartService,ngDialog,$window,$location){
var ctrl = this;
ctrl.newitems = [];
ctrl.topsellers = [];
ctrl.userService=userService;
    ctrl.image='';
var temp=1;
//------------------------------------------------------------------------------
    ctrl.addprodtocart = function(item){
        cartService.addToCart(item)
    }

    ctrl.show = function (item) {
        ngDialog.open({ template: 'components/productInformation/productInformationView.html', className: 'ngdialog-theme-default', controller:"productsController" });
        cartService.addToItem(item)
    };
    ctrl.getNewitems =function() {
       return new Promise(function (resolve, reject) {
        $http.get("http://localhost:3000/users/getNewItems")
            .then(function (response) {

                    var productArr = response.data;
                    ctrl.newitems = productArr;
                    console.log(productArr);
                for (var i = 0; i < ctrl.newitems.length; i++) {
                    var path="pic/"+ctrl.newitems[i].Item_id+".jpg"
                    ctrl.newitems[i].photourl = path;
                }
                   resolve();
                }, function (reason) {
                    console.log(reason.message)
                   reject();
                }
            )
        });
    };


//------------------------------------------------------------------------------
    ctrl.getTopsellers =function() {
            $http.get("http://localhost:3000/users/getTop5sellersWeek")
                .then(function (response) {
                        var productArr = response.data;
                        ctrl.topsellers = productArr;
                        console.log(productArr);
                    for (var i = 0; i < ctrl.topsellers.length; i++) {
                        var path="pic/"+ctrl.topsellers[i].Item_id+".jpg"
                        ctrl.topsellers[i].photourl = path;
                    }
                    }, function (reason) {
                        console.log(reason.message)
                    }
                )
    };
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
if(userService.isLoggedIn){
    ctrl.getNewitems()
        .then(ctrl.getTopsellers);

}
else {
    ctrl.getTopsellers();
}
}]);

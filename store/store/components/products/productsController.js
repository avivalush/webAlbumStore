
app.controller('productsController',['userService','ngDialog','cartService','$http','$window','$location',function(userService,ngDialog,cartService,$http,$window,$location){
  var ctrl = this;
  var dlg = null;
  ctrl.dialogmodel = false;
  ctrl.dialogitemname ='';
  ctrl.dialogitemartist ='';
  ctrl.dialogitemprice ='';
  ctrl.dialogitemstock ='';
  ctrl.dialogitembuy ='';
  ctrl.dialogitempdate ='';
  ctrl.dialogitemcat ='';
  ctrl.allitems = false;
  ctrl.itembycat = false;
  ctrl.recomend = false;
  ctrl.cattoshow = '';
  ctrl.items = []; //all the items
  ctrl.cart = cartService.getProductInCart(); //items in cart
  ctrl.amountincart = []; //amount of each item in the cart
  ctrl.show = false;
  ctrl.itemsbycategory=[];
  ctrl.recomendeditems = [];
    ctrl.categories =[];
  ctrl.cartService = cartService;
    ctrl.userService=userService;
    ctrl. choosencat=[];
    var jsonReg=   {
        "User_name": ctrl.userService.userName

    };
    if(!userService.isLoggedIn)
    {
        $window.alert("In order to view products on the site, you must login");
        $location.path('/login');
    }
    ctrl.getRecommendation =function() {

            $http.post("http://localhost:3000/users/getRecommendation", jsonReg)
                .then(function (response) {
                        var ans = response.data;
                        ctrl.recomendeditems = ans;
                        for (var i = 0; i < ctrl.recomendeditems.length; i++) {
                            var dateString = ctrl.recomendeditems[i].datePublish;
                            dateString = dateString.substring(0, dateString.indexOf("T"));
                            ctrl.recomendeditems[i].datePublish = dateString;
                        }
                    for (var i = 0; i < ctrl.recomendeditems.length; i++) {
                        var path="pic/"+ctrl.recomendeditems[i].Item_id+".jpg"
                        ctrl.recomendeditems[i].photourl = path;
                    }

                    console.log(ans);
                    }, function (reason) {
                        console.log(reason.message)

                    }
                )

    };

//------------------------------------------------------------------------------
    ctrl.show = function (item) {
        ngDialog.open({ template: 'components/productInformation/productInformationView.html', className: 'ngdialog-theme-default', controller:"productsController" });
        cartService.addToItem(item)
    };

//------------------------------------------------------------------------------


    var Url1 = "http://localhost:3000/users/getCategoryList";
    ctrl.getcategories =function() {
        return new Promise(function (resolve, reject) {
        $http.get(Url1).then(function (response) {
            var returnData = response.data;
            ctrl.categories = returnData;
            console.log(returnData);
            resolve();
        }, function (errResponse) {
            console.error('Error while fetching products');
            reject();
        });
        });
    };

    ctrl.getcategories()
        .then(ctrl.getRecommendation);

    ctrl.showallitmes=function () {
        var url = "http://localhost:3000/users/getItemList";
        $http.get(url).then(function (response) {
            var returnData = response.data;
            ctrl.items = returnData;
            for (var i = 0; i < ctrl.items.length; i++) {
                var dateString = ctrl.items[i].datePublish;
                dateString = dateString.substring(0, dateString.indexOf("T"));
                ctrl.items[i].datePublish = dateString;
            }
            for (var i = 0; i < ctrl.items.length; i++) {
                var path="pic/"+ctrl.items[i].Item_id+".jpg"
                ctrl.items[i].photourl = path;
            }
            ctrl.allitems = true;
            ctrl.itembycat = false;
            console.log(returnData);
        }, function (errResponse) {
            console.error('Error while fetching products');
        });

    }
//------------------------------------------------------------------------------
  ctrl.addprodtocart = function(item){
    cartService.addToCart(item)
  }
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
ctrl.modeldialog = function(item){
  ctrl.dialogmodel = true;
  ctrl.dialogitemname =item.item_name;
  ctrl.dialogitemartist =item.item_artist;
  ctrl.dialogitemprice =item.item_price;
  ctrl.dialogitemstock =item.item_stock;
  ctrl.dialogitembuy =item.buyAmount;
  ctrl.dialogitempdate =item.datePublish;
  ctrl.dialogitemcat =item.item_Category;

}

ctrl.showitemsbycat=function () {
    var cat=ctrl.choosencat;
   var url= "http://localhost:3000/users/getItemSortByCategory?Item_Category="+cat.Category_name;
    $http.get(url).then(function (response) {
        var returnData = response.data;
        ctrl.itemsbycategory = returnData;
        for (var i = 0; i < ctrl.itemsbycategory.length; i++) {
            var dateString = ctrl.itemsbycategory[i].datePublish;
            dateString = dateString.substring(0, dateString.indexOf("T"));
            ctrl.itemsbycategory[i].datePublish = dateString;
        }
        for (var i = 0; i < ctrl.itemsbycategory.length; i++) {
            var path="pic/"+ctrl.itemsbycategory[i].Item_id+".jpg"
            ctrl.itemsbycategory[i].photourl = path;
        }
        ctrl.allitems = false;
        ctrl.itembycat = true;
        console.log(returnData);
    }, function (errResponse) {
        console.error('Error while fetching products');
    });

}
}]);

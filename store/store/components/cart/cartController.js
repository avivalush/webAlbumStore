

app.controller('cartController',['userService','ngDialog','cartService','$http','$window','$location',function(userService,ngDialog,cartService,$http,$window,$location){
    var ctrl = this;
    ctrl.amountincart = [];
    ctrl.passOrdes = [];
    ctrl.detailsOrders=[];
    ctrl.pastordertoogle=false;
    ctrl.allitems = true;
    ctrl.cartService = cartService;
    ctrl.userService=userService;
    ctrl.showpastorder=function () {
        var url="http://localhost:3000/users/previousUserOrders?User_name="+userService.userName;
        $http.get(url).then(function (response) {
            var returnData = response.data;
            ctrl.passOrdes = returnData;
            for (var i = 0; i < ctrl.passOrdes.length; i++) {
                var dateString = ctrl.passOrdes[i].DateOrder;
                dateString = dateString.substring(0, dateString.indexOf("T"));
                ctrl.passOrdes[i].DateOrder = dateString;
            }
            for (var i = 0; i < ctrl.passOrdes.length; i++) {
                var dateString = ctrl.passOrdes[i].dateShip;
                dateString = dateString.substring(0, dateString.indexOf("T"));
                ctrl.passOrdes[i].dateShip = dateString;
            }
            ctrl.allitems = false;
            ctrl.pastordertoogle = true;
            console.log(returnData);
        }, function (errResponse) {
            console.error('Error while fetching products');
        });

    }
    ctrl.choosenAmunt='1';
    ctrl.Range = function() {
        var result = [];
        for (var i = 2; i <= 10; i++) {
            result.push(i);
        }
        return result;
    };

    ctrl.show = function (item) {
        ngDialog.open({ template: 'components/productInformation/productInformationView.html', className: 'ngdialog-theme-default', controller:"productsController" });
        cartService.addToItem(item)
    };
    ctrl.showOrders = function (orders) {
        ngDialog.open({ template: 'components/orderDetaials/orderDetailsView.html', className: 'ngdialog-theme-default', controller:"cartController" });
        cartService.addToOrders(orders)
    };

    ctrl.ordersDe=function (orders) {
        var url="http://localhost:3000/users/orderDetails?Order_id="+orders.Order_id;
        $http.get(url).then(function (response) {
            var returnData = response.data;
            ctrl.detailsOrders = returnData;

                var dateString = ctrl.detailsOrders.DateOrder;
                dateString = dateString.substring(0, dateString.indexOf("T"));
                ctrl.detailsOrders.DateOrder = dateString;
            var dateString1 = ctrl.detailsOrders.dateShip;
            dateString1 = dateString1.substring(0, dateString1.indexOf("T"));
            ctrl.detailsOrders.dateShip = dateString1;

            ctrl.showOrders(ctrl.detailsOrders);
            console.log(returnData);
        }, function (errResponse) {
            console.error('Error while fetching products');
        });
    }

    ctrl.toSolve=function (item,num) {
        cartService.solve(item,num)
    }

    ctrl.removeitem=function (item) {
        cartService.removeFromCart(item)
    }
    ctrl.closee=function () {
        ctrl.allitems = true;
        ctrl.pastordertoogle = false;
    }
}]);

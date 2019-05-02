var mainApp = angular.module("myApp", ['ngRoute']);

//ROUTES
mainApp.config(function($routeProvider) {
  $routeProvider
    .when('/home', {
      templateUrl: 'views/home.html',
      controller: 'HomeController'
    })
    .when('/viewAllProduct', {
      templateUrl: 'views/viewAllProduct.html',
      controller: 'viewAllProduct'
    })
    .when('/viewProductDetail/:id', {
      templateUrl: 'views/viewProductDetail.html',
      // controller: 'productDetail'
      controller: 'viewProductDetail'
    })
    .when('/cart', {
      templateUrl: 'views/cart.html',
      controller: 'CartController'
    })
    .otherwise({
      redirectTo: '/home'
    });
});

//CONTROLLER
//*******************************HOME*********************************//
mainApp.controller('HomeController', function($scope, itemsFactory) {
  itemsFactory.getItems().success(function(data) {
    $scope.products = data;
  });
});
//***************************ALLPRODUCTLIST******************************************//
mainApp.controller('viewAllProduct', function($scope, $routeParams, itemsFactory, productService, cartInfo) {
  // $scope.products = [{
  //     id: 1,
  //     name: "RTX2080",
  //     category: "graphic card",
  //     details: "La carte graphique GeForce RTX 2080 s'appuie sur la toute nouvelle architecture NVIDIA Turing et offre des jeux d'un réalisme époustouflant",
  //     price: 100,
  //     qty: 1,
  //     picture: '/rtx2080.jpg'
  //   },
  //   {
  //     id: 2,
  //     name: "GTX1080",
  //     category: "graphic card",
  //     details: "Attention aux yeux, la MSI GeForce GTX 1080 Gaming X arrive avec des mensurations de haute volée ! La 1080 arrive armée de ses 2560 coeurs CUDA (+25%...)",
  //     price: 90,
  //     qty: 1,
  //     picture: '/gtx1080.jpg'
  //   },
  //   {
  //     id: 3,
  //     name: "GTX980",
  //     category: "graphic card",
  //     details: "La carte GeForce GTX 980 est la carte graphique la plus avancée au monde exploitant l'architecture de nouvelle génération NVIDIA Maxwell.",
  //     price: 80,
  //     qty: 1,
  //     picture: '/gtx980.jpg'
  //   }
  //
  // ];

  itemsFactory.getItems().success(function(data) {
    $scope.products = data;
  });

  // PRIXPARLIGNE calculer le prix par ligne en fonction du prix unitaire et de la qté
  $scope.getCost = function(item) {
    return item.qty * item.price;
  };

  // PRIXTOTAL:
  $scope.getTotal = function() {
    //exemple d'utilisation de underscore.reduce var sum = _.reduce([1, 2, 3], function(memo, num){ return memo + num; }, 0); => 6
    var total = _.reduce($scope.cart, function(sum, item) {
      return sum + $scope.getCost(item);
    }, 0);
    // console.log('total: ' + total);
    $a = total;
    return total;
  };
});
//***************************PRODUCTDETAIL****************************//
mainApp.controller('viewProductDetail', function($scope, $routeParams, itemsFactory, productService, aryCart) {

  itemsFactory.getItems().success(function(data) {
		console.log(data);
    $scope.products = data;
  });

  $scope.id = $routeParams.id
  // count different category of item in cart
  $scope.count = function() {
    nbrItemIncart = $scope.ncart.length;
    return nbrItemIncart;
  };
  //
  var findItemById = function(items, id) {
    // underscorejs : ex var even = _.find([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; }); => 2
    return _.find(items, function(item) {
      return item.id === id;
    });
  };

  //ajout d'un item dans ncart=>(array from service) ou incrementation s'il y existe déjà
  $scope.addItem = function(itemToAdd) {
    // UTILISER ncart qui est un array retourner depuis services via aryCart.getC();
    $scope.ncart = aryCart.getC();
    var found = findItemById($scope.ncart, itemToAdd.id);
    // si un item avec son id correspondant  est déjà dans la cart on rajoute seulement
    if (found) {
      found.qty += itemToAdd.qty;
    }
    // si non on push dans ncart le nouveau élément
    else {
      $scope.ncart.push(angular.copy(itemToAdd));
      // cartInfo.addId(itemToAdd);
      console.log($scope.ncart);
    }
    // ajout de array ncart dans services via productService.addProduct
    productService.addProduct($scope.ncart);
  };
});

//*************************CART***********************************//
mainApp.controller('CartController', function($scope, productService) {
  //Utilisation de l'array from service via productService.getProduct();
  $scope.produits = productService.getProduct();
  //  calculer le prix par ligne en fonction du prix unitaire et de la qté
  $scope.getCost = function(item) {
    return item.qty * item.price;
  };
  // sum use data from factory
  $scope.getSum = function() {
    //exemple d'utilisation de underscore.reduce var sum = _.reduce([1, 2, 3], function(memo, num){ return memo + num; }, 0); => 6
    var somme = _.reduce($scope.produits, function(sum, item) {
      return sum + $scope.getCost(item);
    }, 0);
    // console.log('total: ' + total);
    $a = somme;
    return somme;
  };

  // suppression d'un item dans l'array cart
  $scope.removeItem = function(item) {
    var index = $scope.produits.indexOf(item);
    // splice peut etre utliser ici pusique il s'agit de l'array cart (slice method doesn't change the original array )
    $scope.produits.splice(index, 1);
  };
  //vider le panier
  $scope.clearCart = function() {
    $scope.produits.length = 0;
  };
  // PAYER
  //payer cart
  $scope.payerCart = function() {
    $scope.produits.length = 0;
    // console.log('total is ' + $a);
    if ($a == 0) {
      $scope.successTextAlert = "please add a product!!";
    } else {
      $scope.successTextAlert = "thx to payed : " + " Ariary " + $a;
    }
  };
});

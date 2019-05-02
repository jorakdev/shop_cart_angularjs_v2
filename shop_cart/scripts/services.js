mainApp.factory('itemsFactory', function($http) {
  var factory = {};

  factory.getItems = function() {
    return $http.get('data.json');
  };
  return factory;
});

mainApp.factory('productService', [function() {
  var _source;
  return {
    addProduct: function(source) {
      _source = source;

    },
    getProduct: function() {
      return _source;
    }
  }
}]);

// service pour $scope.cart =[];
mainApp.factory('aryCart', function() {
  var _item = [];

  var addC = function(newObj) {
    _item.push(newObj);
  };

  var getC = function() {
    // console.log(_itemId.length);
    return _item;

  };

  return {
    addC: addC,
    getC: getC,
  };

});

mainApp.factory('cartInfo', function() {
  var _itemId = [];

  var addId = function(newObj) {
    _itemId.push(newObj);
  };

  var getId = function() {
    // console.log(_itemId.length);
    return _itemId.length;

  };

  return {
    addId: addId,
    getId: getId,
  };

});

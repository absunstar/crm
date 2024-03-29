app.controller("maritals_status", function ($scope, $http) {

  $scope.marital_state = {};

  $scope.loadMaritals_Status = function() {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/maritals_status/all",
      data: {
        select : {id:1 , name : 1}
      }
    }).then(
      function(response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.maritals_status = response.data.list;
        }
      },
      function(err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.loadAll = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/maritals_status/all",
      data: {}
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.list = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
      )
  };
  
 
  $scope.newMarital_State = function () {
    $scope.error = '';
    $scope.marital_state = { image_url: '/images/marital_state.png' };
    site.showModal('#addMarital_StateModal');
  };
  
  $scope.add = function () {
    $scope.error = '';
    const v = site.validated();
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/maritals_status/add",
      data: $scope.marital_state
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addMarital_StateModal');
          $scope.loadAll();
        } else {
          $scope.error = '##word.error##';
        }
      },
      function (err) {
        console.log(err);
      }
      )
  };

  $scope.edit = function (marital_state) {
    $scope.error = '';
    $scope.view(marital_state);
    $scope.marital_state = {};
    site.showModal('#updateMarital_StateModal');
  };
  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/maritals_status/update",
      data: $scope.marital_state
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateMarital_StateModal');
          $scope.loadAll();
        } else {
          $scope.error = '##word.error##';
        }
      },
      function (err) {
        console.log(err);
      }
      )
  };

  $scope.remove = function (marital_state) {
    $scope.error = '';
    $scope.view(marital_state);
    $scope.marital_state = {};
    site.showModal('#deleteMarital_StateModal');
  };

  $scope.view = function (marital_state) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/maritals_status/view",
      data: { id: marital_state.id }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.marital_state = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
      )
  };
  $scope.details = function (marital_state) {
    $scope.error = '';
    $scope.view(marital_state);
    $scope.marital_state = {};
    site.showModal('#viewMarital_StateModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/maritals_status/delete",
      data: { id: $scope.marital_state.id, name: $scope.marital_state.name }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteMarital_StateModal');
          $scope.loadAll();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
      )
  };
  $scope.loadAll();    
  $scope.loadMaritals_Status();
});

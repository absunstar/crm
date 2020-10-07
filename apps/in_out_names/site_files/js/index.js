app.controller("in_out_names", function ($scope, $http) {

  $scope.in_out_name = {};

 

  $scope.loadAll = function (where , limit) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/in_out_names/all",
      data: {where : where ,
      limit : limit ||10000000
      }
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

  $scope.searchAll = function () {
    $scope.error = '';
    let where = {};

    
    if ($scope.search.name) {
      where['name'] = $scope.search.name;
    }
    
   
    if ($scope.search.in==true) {
      where['in'] = $scope.search.in;
    }
    
    if ($scope.search.out==true) {
      where['out'] = $scope.search.out;
    }

if ($scope.search.details) {
      where['details'] = $scope.search.details;
    }

    $scope.loadAll(where , $scope.search.limit);
    
  };

  $scope.newIn_Out_Name = function () {
    $scope.error = '';
    $scope.in_out_name = { image_url: '/images/in_out_name.png', date: new Date() };
    site.showModal('#addIn_Out_NameModal');
  };
  $scope.add = function () {
    $scope.error = '';
    let v = site.validated();

    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/in_out_names/add",
      data: $scope.in_out_name
     
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addIn_Out_NameModal');
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

  $scope.edit = function (in_out_name) {
    $scope.error = '';
    $scope.view(in_out_name);
    $scope.in_out_name = {};
    site.showModal('#updateIn_Out_NameModal');
  };
  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/in_out_names/update",
      data: $scope.in_out_name
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateIn_Out_NameModal');
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

  $scope.remove = function (in_out_name) {
    $scope.error = '';
    $scope.view(in_out_name);
    $scope.in_out_name = {};
    site.showModal('#deleteIn_Out_NameModal');
  };

  $scope.view = function (in_out_name) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/in_out_names/view",
      data: { _id: in_out_name._id }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.in_out_name = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
      )
  };
  $scope.details = function (in_out_name) {
    $scope.error = '';
    $scope.view(in_out_name);
    $scope.in_out_name = {};
    site.showModal('#viewIn_Out_NameModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/in_out_names/delete",
      data: { _id: $scope.in_out_name._id, name: $scope.in_out_name.name }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteIn_Out_NameModal');
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
});

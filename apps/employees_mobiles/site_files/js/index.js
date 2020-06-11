app.controller("employees_mobiles", function ($scope, $http) {

  $scope.employee_mobile = {};

  $scope.calc = function () {
   
      
    
       $scope.employee_mobile.total =  
       parseFloat($scope.employee_mobile.discount) +
    
       parseFloat($scope.employee_mobile.emp_discount);

  },

  $scope.loadEmployees = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees/all",
      data: {
        select: { id: 1, name: 1 }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employees = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
      )
  };


  $scope.loadMobiles_Slides = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/mobiles_slides/all",
      data: {
        select: { id: 1, name: 1, number: 1, value: 1, slide_name: 1 }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.mobiles_slides = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
      )
  };

  $scope.loadAll = function (where , limit) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees_mobiles/all",
      data: {where : where,
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
   
    if ($scope.search.number && $scope.search.number.id) {
      where['number.id'] = $scope.search.number.id;
    }


    if ($scope.search.employee && $scope.search.employee.id) {
      where['employee.id'] = $scope.search.employee.id;
    }

    if ($scope.search.discount) {
      where['discount'] = ($scope.search.discount);
    }

    if ($scope.search.total) {
      where['total'] = ($scope.search.total);
    }

    if ($scope.search.notes) {
      where['notes'] = ($scope.search.notes);
    }

    
    $scope.loadAll(where , $scope.search.limit);
  };


  $scope.newEmployee_Mobile = function () {
    $scope.error = '';
    $scope.employee_mobile = { image_url: '/images/mobile_employees.png' };
    site.showModal('#addEmployee_MobileModal');
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
      url: "/api/employees_mobiles/add",
      data: $scope.employee_mobile
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addEmployee_MobileModal');
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

  $scope.edit = function (employee_mobile) {
    $scope.error = '';
    $scope.view(employee_mobile);
    $scope.employee_mobile = {};
    site.showModal('#updateEmployee_MobileModal');
  };
  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees_mobiles/update",
      data: $scope.employee_mobile
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateEmployee_MobileModal');
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

  $scope.remove = function (employee_mobile) {
    $scope.error = '';
    $scope.view(employee_mobile);
    $scope.employee_mobile = {};
    site.showModal('#deleteEmployee_MobileModal');
  };

  $scope.view = function (employee_mobile) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees_mobiles/view",
      data: { _id: employee_mobile._id }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employee_mobile = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
      )
  };
  $scope.details = function (employee_mobile) {
    $scope.error = '';
    $scope.view(employee_mobile);
    $scope.employee_mobile = {};
    site.showModal('#viewEmployee_MobileModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees_mobiles/delete",
      data: { _id: $scope.employee_mobile._id, name: $scope.employee_mobile.name }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteEmployee_MobileModal');
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
  $scope.loadEmployees();
  $scope.loadMobiles_Slides();
});

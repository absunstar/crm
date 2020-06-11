app.controller("employees_advances", function ($scope, $http) {

  $scope.employees_advances = {};
  $scope.search = {};

 

  $scope.addemployee = function () {

         
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees/add",
      data: $scope.employee
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addEmployeeModal');
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
  
  $scope.addCom = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/companies/add",
      data: $scope.company
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addCompanyModal');
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
  $scope.loadGoves = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/goves/all",
      data: {
        select: { id: 1, name: 1 }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.goves = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
      )
  };

  $scope.newCompany = function () {
    $scope.error = '';
    $scope.company = { image_url: '/images/company.png', files: [], mobiles: [], phones: [], hotlines: [], active: false };
    site.showModal('#addCompanyModal');
  };
  $scope.add = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/companies/add",
      data: $scope.company
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addCompanyModal');
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

  $scope.loadEngList = function () {

    
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees/all",
      data: {
        where: {},
        select: {
          id: 1,
          name: 1,
          mobiles: 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.engList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
   

  };


  $scope.loadCompanies = function () {

    

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/Companies/all",
      data: {
        select: {
          id: 1,
          name: 1,
          balance: 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.companies = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
    
  };

  $scope.addCustomer = function () {

    
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/customers/add",
      data: $scope.customer
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addCustomerModal');
          $rootScope.$emit("newCustomerDone", {
            doc: response.data.doc
          });
          if ($scope.parent === undefined) {
            $scope.loadAll();
          }
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.newEmployee = function () {
    $scope.error = '';
    $scope.employee = {
      image_url: '/images/employee.png',
      mobiles: [],
      

      phones: [],
      birth_date: new Date(),
      contract_date: new Date()
    };
    
    site.showModal('#addEmployeeModal');
  };
  $scope.newCustomer = function (customer) {
    customer = customer || {};
    customer.image_url = customer.image_url || '/images/customer.png';
    customer.gov = $scope.goves[0];
    $scope.customer = customer;
    site.showModal('#addCustomerModal');
  };
  

  $scope.loadCustomers = function () {

    
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/customers/all",
      data: {
        where: {},
        select: {
          id: 1,
          name: 1,
          mobiles: 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.customers = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
   

  };

  $scope.loadInOutNames = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/in_out_names/all",
      data: {where : {in : true}}
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.namesList = response.data.list;
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
      url: "/api/employees_advances/all",
      data: {where : where,
        limit : limit ||10000000
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.list = response.data.list;
          
         site.hideModal('#amountsInSearchModal');
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
      )
  };


  $scope.loadSafes = function () {
    $scope.list = {};
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/safes/all",
      data: {}
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.safes = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };




  $scope.newemployees_advances = function () {
    $scope.error = '';
    $scope.employees_advances = { image_url: '/images/discount.png', date: new Date() , from_eng : false , from_company : false };
    site.showModal('#addemployees_advancesModal');
  };


  $scope.searchAll = function () {
    $scope.error = '';
    let where = {};

    
    if ($scope.search.date) {
      where['date'] = $scope.search.date;
    }

    if ($scope.search.dateFrom) {
      where['from_date'] = $scope.search.dateFrom;
    }

    if ($scope.search.dateTo) {
      where['to_date'] = $scope.search.dateTo;
    }


    if ($scope.search.safe && $scope.search.safe.id) {
      where['safe.id'] = $scope.search.safe.id;
    }

    if ($scope.search.source && $scope.search.source.id) {
      where['source.id'] = $scope.search.source.id;
    }

    if ($scope.search.customer && $scope.search.customer.id) {
      where['customer.id'] = $scope.search.customer.id;
    }

    if ($scope.search.eng && $scope.search.eng.id) {
      where['eng.id'] = $scope.search.eng.id;
    }

    if ($scope.search.value) {
      where['value'] = ($scope.search.value);
    }

    if ($scope.search.description) {
      where['description'] = ($scope.search.description);
    }

    
    $scope.loadAll(where , $scope.search.limit);
  };

  $scope.loadCities = function (gov) {
    if ($scope.townBusy == true) {
      return;
    }
    var where = {};

    if (typeof gov === 'string') {
      gov = JSON.parse(gov);
    } else {
      gov = gov || {};
    }
    if (gov && gov.id) {
      where = {
        'gov.id': gov.id
      };
    }

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/cities/all",
      data: {
        where: where,
        select: {
          id: 1,
          name: 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.cities = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };


  $scope.loadTowns = function (city) {
    if ($scope.townBusy == true) {
      return;
    }
    var where = {};

    if (typeof city === 'string') {
      city = JSON.parse(city);
    } else {
      city = city || {};
    }
    if (city && city.id) {
      where = {
        'city.id': city.id
      };
    }

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/towns/all",
      data: {
        where: where,
        select: {},
        limit : 10000
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.towns = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.loadRegions = function () {
    if ($scope.townBusy == true) {
      return;
    }

    var where = {};


    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/regions/all",
      data: {
        where: where,
        select: {
          id: 1,
          name: 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.regions = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
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
      url: "/api/employees_advances/add",
      data: $scope.employees_advances
     
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addemployees_advancesModal');
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



  $scope.edit = function (employees_advances) {
    $scope.error = '';
    $scope.view(employees_advances);
    $scope.employees_advances = {};
    site.showModal('#updateemployees_advancesModal');
  };
  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees_advances/update",
      data: $scope.employees_advances
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateemployees_advancesModal');
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

  $scope.remove = function (employees_advances) {
    $scope.error = '';
    $scope.view(employees_advances);
    $scope.employees_advances = {};
    site.showModal('#deleteemployees_advancesModal');
  };

  $scope.view = function (employees_advances) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees_advances/view",
      data: { _id: employees_advances._id }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employees_advances = response.data.doc;
          $scope.employees_advances.date = new Date($scope.employees_advances.date);
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
      )
  };
  $scope.details = function (employees_advances) {
    $scope.error = '';
    $scope.view(employees_advances);
    $scope.employees_advances = {};
    site.showModal('#viewemployees_advancesModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees_advances/delete",
      data: { _id: $scope.employees_advances._id, name: $scope.employees_advances.name }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteemployees_advancesModal');
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
  
   
  $scope.loadCustomers();
  $scope.loadCompanies();
  $scope.loadEngList();
  $scope.loadSafes();
  $scope.loadInOutNames();
  $scope.loadAll();
});

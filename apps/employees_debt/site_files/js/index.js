app.controller("employees_debt", function ($scope, $http) {
  $scope._search = {};
  $scope.employees_debt = {};
  $scope.search = {};

 
  $scope.addemployee = function () {

    $scope._search = {};
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
    $scope._search = {};
    $scope.error = '';
    $scope.company = { image_url: '/images/company.png', files: [], mobiles: [], phones: [], hotlines: [], active: false };
    site.showModal('#addCompanyModal');
  };

  $scope.add = function () {
    $scope._search = {};
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
    $scope._search = {};
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
    $scope._search = {};
    $http({
      method: "POST",
      url: "/api/employees_debt/all",
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




  $scope.newemployees_debt = function () {
    $scope._search = {};
    $scope.error = '';
    $scope.employees_debt = { image_url: '/images/offer.png', date: new Date() , from_eng : false , from_company : false };
    site.showModal('#addemployees_debtModal');
  };


  $scope.searchAll = function () {
    $scope._search = {};
    $scope.error = '';
    let where = {};
  
    if ($scope.search.ticket_code) {
      where['ticket_code'] = $scope.search.ticket_code;
    }

    if ($scope.search.safe && $scope.search.safe.id) {
      where['safe.id'] = $scope.search.safe.id;
    }

    if ($scope.search.number) {
      where['number'] = $scope.search.number;
    }

    if ($scope.search.date) {
      where['date'] = $scope.search.date;
    }

    if ($scope.search.dateFrom) {
      where['from_date'] = $scope.search.dateFrom;
    }

    if ($scope.search.dateTo) {
      where['to_date'] = $scope.search.dateTo;
    }

    if ($scope.search.company && $scope.search.company.id) {
      where['company.id'] = $scope.search.company.id;
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
      where['value'] = parseInt($scope.search.value);
    }

    if ($scope.search.description) {
      where['description'] = ($scope.search.description);
    }

    site.hideModal('#employees_debtSearchModal')

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
      url: "/api/employees_debt/add",
      data: $scope.employees_debt
     
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addemployees_debtModal');
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

  $scope.edit = function (employees_debt) {
    $scope.error = '';
    $scope.view(employees_debt);
    $scope.employees_debt = {};
    site.showModal('#updateemployees_debtModal');
  };

  $scope.edit_no = function (employees_debt) {
    $scope.error = '';
    $scope._search = {};
    $scope.view(employees_debt);
    $scope.employees_debt = {};
    site.showModal('#updateemployees_notesModal');
  };



  $scope.approved = function () {
    $scope._search = {};
    $scope.busy = true;

      $scope.employees_debt.done = true
    
    
    $http({
      method: "POST",
      url: "/api/employees_debt/approved",
      data: $scope.employees_debt
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateemployees_debtModal');
          site.hideModal('#updateemployees_notesModal');
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

  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees_debt/update",
      data: $scope.employees_debt
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateemployees_debtModal');
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
  $scope.remove = function (employees_debt) {
    $scope.error = '';
    $scope.view(employees_debt);
    $scope.employees_debt = {};
    site.showModal('#deleteemployees_debtModal');
  };

  $scope.view = function (employees_debt) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees_debt/view",
      data: { id: employees_debt.id }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employees_debt = response.data.doc;
          $scope.employees_debt.date = new Date($scope.employees_debt.date);
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
      )
  };
  $scope.details = function (employees_debt) {
    $scope.error = '';
    $scope.view(employees_debt);
    $scope.employees_debt = {};
    site.showModal('#viewemployees_debtModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees_debt/delete",
      data: { id: $scope.employees_debt.id, name: $scope.employees_debt.name }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteemployees_debtModal');
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

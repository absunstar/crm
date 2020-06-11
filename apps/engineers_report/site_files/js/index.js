app.controller("engineers_report", function ($scope, $http) {

  $scope._search = {}
  
  $scope.search = {
  
    engineer: {}
  };

  $scope.showSearch = function () {
    $scope._search = {}
    $scope.error = '';
    site.showModal('#searchModal');

  };

  $scope.showApproved = function () {
    $scope.error = '';
    site.showModal('#approvedEngineers_reportModal');

  };

  $scope.loadEngineerReport = function (where , callback) {
    callback = callback || function(){};

    $scope.busy = true;

    $http({
      method: "POST",
      url: "/api/engineers_report/all",
      data: {
        where: where,
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {

          if (response.data.list.length > 0) {
            $scope.engineer_report = response.data.list[0];
            $scope.engineer_report.dateFrom = new Date($scope.engineer_report.dateFrom);
            $scope.engineer_report.dateTo = new Date($scope.engineer_report.dateTo);
            callback($scope.engineer_report);
          } else {
            $scope.searchAll();
          }


          site.hideModal('#searchModal');
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.approved = function () {
    
      if(!$scope.engineer_report.total_salary){
        $scope.error="عفوا لا يوجد مرتب لهذا الشهر"
        return;
      } 
   
    $scope.busy = true;

    $scope.engineer_report.done = true

    $http({
      method: "POST",
      url: "/api/engineers_report/add",
      data: $scope.engineer_report
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.engineer_report = response.data.doc;
          $scope.engineer_report.dateFrom = new Date($scope.engineer_report.dateFrom);
          $scope.engineer_report.dateTo = new Date($scope.engineer_report.dateTo);
          site.hideModal('#approvedEngineers_reportModal')
        } else {
          $scope.error = '##word.error##';
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.searchEngineerReport = function () {

    let where = {};

    $scope.engineer_report = {};


    if ($scope.search.date) {
      where['year'] = $scope.search.date.getFullYear();
      where['month'] = $scope.search.date.getMonth();
      $scope.engineer_report.date = $scope.search.date;
    }

    if ($scope.search.engineer) {
      where['engineer.id'] = $scope.search.engineer.id;
      $scope.engineer_report.engineer = $scope.search.engineer;
    }


    $scope.loadEngineerReport(where);

  };


  $scope.searchAll = function () {


    $scope.engineer_report = $scope.engineer_report || {};
    $scope.engineer_report.engineer = $scope.search.engineer;
    $scope.engineer_report.date = $scope.search.date;
    $scope.engineer_report.year = $scope.search.date.getFullYear();
    $scope.engineer_report.month = $scope.search.date.getMonth();


    $scope.engineer_report.dateFrom = $scope.search.dateFrom  = new Date($scope.engineer_report.year , $scope.engineer_report.month , 1 );
    $scope.engineer_report.dateTo = $scope.search.dateTo = new Date($scope.engineer_report.year , $scope.engineer_report.month + 1 , 0 );


    if ($scope.search.engineer && $scope.userList && $scope.userList.length > 0) {

      $scope.userList.forEach(user => {
        if (user.employee_id == $scope.search.engineer.id) {
          $scope.engineer_report.user_id = user.id;
        }
      });

    } else {
      return;
    }
    $scope.getEmployeeAdvancesList();
    $scope.getEmployeeMobileList();
    $scope.getEmployeeInsuranceList();
    $scope.getEngineerDebtList();
    $scope.getTicketList();
    $scope.getAssignTicketList();
    $scope.getEngineerOfferList();
    $scope.getEngineerDiscountList();
    site.hideModal('#searchModal');
  };

  $scope.clearAll = function () {
    $scope.search = {
   
      engineer: {}
    }
  };

  $scope.loadUsers = function () {
    if ($scope.userList) {
      return
    }
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/users/all",
      data: {
        select: {
          id: 1,
          employee_id: 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.userList = response.data.users;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )

  };

  $scope.getEngineerList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees/all",
      data:{
        where : {'role.name': 'eng'}
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.engineerList = response.data.list;
          $scope.calc();
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.calc = function () {


    if(!$scope.engineer_report){
      return;
    }
    
    $scope.engineer_report.total_advances = 0;
    $scope.engineer_report.total_mobile_discount = 0;
    $scope.engineer_report.total_debts=0;
    $scope.engineer_report.total_insurance = 0;
    $scope.engineer_report.total_offers = 0;
    $scope.engineer_report.total_discounts = 0;
    $scope.engineer_report.total_salary = 0;
    $scope.engineer_report.total_tickets_cost = 0;
    $scope.engineer_report.total_salary2 = 0;
    $scope.engineer_report.total_salary3 = 0;
    
    if ($scope.engineer_report.engineerOfferList) {
      $scope.engineer_report.engineerOfferList.forEach(offer => {
        $scope.engineer_report.total_offers = $scope.engineer_report.total_offers + offer.value;
      });
    }


    if ($scope.engineer_report.engineerDiscountList) {
      $scope.engineer_report.engineerDiscountList.forEach(discount => {
        $scope.engineer_report.total_discounts = $scope.engineer_report.total_discounts + discount.value;
      });
    }

    if ($scope.engineer_report.employeeinsuranceList) {
      $scope.engineer_report.employeeinsuranceList.forEach(insurance => {
        $scope.engineer_report.total_insurance = parseFloat($scope.engineer_report.total_insurance) + parseFloat(insurance.salary_discount);
      });
    }

    if ($scope.engineer_report.employeeMobileList) {
      $scope.engineer_report.employeeMobileList.forEach(mobile => {
        $scope.engineer_report.total_mobile_discount = parseFloat($scope.engineer_report.total_mobile_discount) + parseFloat(mobile.emp_discount);
      });
    }

    if ($scope.engineer_report.employeeAdvancesList) {
      $scope.engineer_report.employeeAdvancesList.forEach(advance => {
        $scope.engineer_report.total_advances = parseFloat($scope.engineer_report.total_advances) + advance.value;
      });
    }

    if ($scope.engineer_report.engineerDebtList) {
      $scope.engineer_report.engineerDebtList.forEach(debt => {
        if (debt.done != true) {
          $scope.engineer_report.total_debts = $scope.engineer_report.total_debts + debt.value;

        }
      });
    }


    $scope.TicketSlideList.forEach(s => {

      if (s.to >= $scope.engineer_report.total_tickets_amount && s.from <= $scope.engineer_report.total_tickets_amount) {
        s.value2 = parseFloat(s.value) + parseFloat($scope.engineer_report.engineer.extra_ticket || 0);
        
        $scope.engineer_report.ticketSlide = s;
        $scope.engineer_report.total_tickets_cost = parseFloat($scope.engineer_report.total_tickets_amount) * s.value2;

        if (s.salary_calculate) {
          $scope.engineer_report.total_salary2 = parseFloat($scope.engineer_report.engineer.degree.salary) + parseFloat($scope.engineer_report.engineer.extra_salary || 0);
        }
       
        $scope.engineer_report.total_salary3 =parseFloat( $scope.engineer_report.total_offers) - parseFloat($scope.engineer_report.total_discounts) -parseFloat($scope.engineer_report.total_debts)-(parseFloat($scope.engineer_report.total_insurance)) - (parseFloat($scope.engineer_report.total_mobile_discount));
        
       
        $scope.engineer_report.total_salary = $scope.engineer_report.total_tickets_cost + $scope.engineer_report.total_salary2 + $scope.engineer_report.total_salary3 ;
        
      }
     
    })

  }

  $scope.loadSafes = function () {

    $scope.safes = [];
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


  $scope.getTicketList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/get_close1",
      data: {
          'eng.id': $scope.search.engineer.id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.engineer_report.total_tickets = response.data.list.length;
          $scope.engineer_report.total_tickets_amount = 0
          response.data.list.forEach(t => {
            t.eng_list.forEach(e=>{
              if(e.close1_done && e.eng.id == $scope.search.engineer.id){
                $scope.engineer_report.total_tickets_amount = parseFloat($scope.engineer_report.total_tickets_amount)+ e.cost_count
              }
            })
          });
          $scope.engineer_report.ticketList = response.data.list;
          $scope.calc();
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getAssignTicketList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/get_assigned",
      data: {
          'eng.id': $scope.search.engineer.id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.engineer_report.assginTicketList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getTicketSlideList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets_slides/all",
      data: {}
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.TicketSlideList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };



  $scope.getEngineerOfferList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employee_offer/all",
      data: {
        where: {
          'eng.id': $scope.search.engineer.id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo,
        },
        limit: 1
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.engineer_report.engineerOfferList = response.data.list;
          $scope.calc();
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };




  $scope.getEngineerDebtList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees_debt/all",
      data: {
        where: {
          'eng.id': $scope.search.engineer.id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.engineer_report.engineerDebtList = response.data.list;
          $scope.calc();
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };


  $scope.getEmployeeInsuranceList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees_insurances/all",
      data: {
        where: {
          'employee.id': $scope.search.engineer.id,
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.engineer_report.employeeinsuranceList = response.data.list;
          $scope.calc();
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };


  $scope.getEmployeeMobileList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees_mobiles/all",
      data: {
        where: {
          'employee.id': $scope.search.engineer.id,
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.engineer_report.employeeMobileList = response.data.list;
          $scope.calc();
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getEmployeeAdvancesList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees_advances/all",
      data: {
        where: {
          'eng.id': $scope.search.engineer.id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo,
        },
        limit: 1
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.engineer_report.employeeAdvancesList = response.data.list;

        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };


  $scope.getEngineerDiscountList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employee_discount/all",
      data: {
        where: {
          'eng.id': $scope.search.engineer.id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.engineer_report.engineerDiscountList = response.data.list;
          $scope.calc();
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };


  $scope.propertyName = 'date';
  $scope.reverse = true;


  $scope.sortBy = function (propertyName) {
    $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
    $scope.propertyName = propertyName;
  };

  $scope.loadUsers();
  $scope.getEngineerList();
  $scope.getTicketSlideList();
  $scope.loadSafes()
});
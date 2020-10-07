app.controller("employees_report", function ($scope, $http) {


  $scope.search = {
    employee: {}
  };

  $scope.showSearch = function () {
    site.showModal('#searchModal');
  };

  $scope.loadEmployeeReport = function (where, callback) {

    callback = callback || function () {};

    $scope.busy = true;

    $http({
      method: "POST",
      url: "/api/employees_report/all",
      data: {
        where: where,
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {

          if (response.data.list.length > 0) {
            $scope.employee_report = response.data.list[0];
            $scope.employee_report.dateFrom = new Date($scope.employee_report.dateFrom);
            $scope.employee_report.dateTo = new Date($scope.employee_report.dateTo);
            callback($scope.employee_report);
          } else {
            $scope.searchAll(); /* re calc */
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

    $scope.busy = true;

    $scope.employee_report.done = true

    $http({
      method: "POST",
      url: "/api/employees_report/add",
      data: $scope.employee_report
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employee_report = response.data.doc;
          $scope.employee_report.dateFrom = new Date($scope.employee_report.dateFrom);
          $scope.employee_report.dateTo = new Date($scope.employee_report.dateTo);
          site.hideModal('#approvedEmployees_reportModal')
        } else {
          $scope.error = '##word.error##';
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.searchEmployeeReport = function () {

    let where = {};

    $scope.employee_report = {};

    if ($scope.search.date) {
      where['year'] = $scope.search.date.getFullYear();
      where['month'] = $scope.search.date.getMonth();
      $scope.employee_report.date = $scope.search.date;
    }

    if ($scope.search.employee) {
      where['employee.id'] = $scope.search.employee.id;
      $scope.employee_report.employee = $scope.search.employee;
    }

    $scope.loadEmployeeReport(where);

  };


  $scope.searchAll = function () {

    $scope.employee_report = $scope.employee_report || {};
    $scope.employee_report.employee = $scope.search.employee;
    $scope.employee_report.date = $scope.search.date;
    $scope.employee_report.year = $scope.search.date.getFullYear();
    $scope.employee_report.month = $scope.search.date.getMonth();


    $scope.employee_report.dateFrom = $scope.search.dateFrom = new Date($scope.employee_report.year, $scope.employee_report.month, 1);
    $scope.employee_report.dateTo = $scope.search.dateTo = new Date($scope.employee_report.year, $scope.employee_report.month + 1, 0);


    if ($scope.search.employee && $scope.userList && $scope.userList.length > 0) {

      $scope.userList.forEach(user => {
        if (user.employee_id == $scope.search.employee.id) {
          $scope.employee_report.user_id = user.id;
        }
      });

    } else {
      return;
    }




    $scope.getAddedTicketList();
    $scope.getAssignTicketList();
    $scope.getEmployeeOfferList();
    $scope.getclose1TicketList();
    $scope.getBackEngTicketList();
    $scope.getClose2TicketList();
    $scope.getReviewTicketList();

    $scope.getEmployeeAdvancesList()
    $scope.getEmployeeDiscountList();
    $scope.getEmployeeInsuranceList()
    $scope.getEmployeeMobileList();

    site.hideModal('#searchModal');
  };

  $scope.clearAll = function () {
    $scope.search = {
      employee: {}
    }
  };

  $scope.getEmployeeList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees/all",
      data: {
        where: {
          'role.name': {
            $ne: 'eng'
          }
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employeeList = response.data.list;
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

    if (!$scope.employee_report) {
      return;
    }

    $scope.employee_report.total_salary = 0;
    $scope.employee_report.total_advances = 0;
    $scope.employee_report.total_offers = 0;
    $scope.employee_report.total_discounts = 0;
    $scope.employee_report.total_insurance = 0;
    $scope.employee_report.total_mobile_discount = 0;

    if ($scope.employee_report.employeeOfferList) {
      $scope.employee_report.employeeOfferList.forEach(offer => {
        $scope.employee_report.total_offers = parseFloat($scope.employee_report.total_offers) + offer.value;
      });
    }

    if ($scope.employee_report.employeeAdvancesList) {
      $scope.employee_report.employeeAdvancesList.forEach(advance => {
        $scope.employee_report.total_advances = parseFloat($scope.employee_report.total_advances) + advance.value;
      });
    }


    if ($scope.employee_report.employeeMobileList) {
      $scope.employee_report.employeeMobileList.forEach(mobile => {
        $scope.employee_report.total_mobile_discount = parseFloat($scope.employee_report.total_mobile_discount) + parseFloat(mobile.emp_discount);
      });
    }

    if ($scope.employee_report.employeeinsuranceList) {
      $scope.employee_report.employeeinsuranceList.forEach(insurance => {
        $scope.employee_report.total_insurance = parseFloat($scope.employee_report.total_insurance) + parseFloat(insurance.salary_discount);
      });
    }

    if ($scope.employee_report.employeeDiscountList) {
      $scope.employee_report.employeeDiscountList.forEach(discount => {
        $scope.employee_report.total_discounts = $scope.employee_report.total_discounts + discount.value;
      });
    }

    if ($scope.employee_report.employee.degree) {

      $scope.employee_report.employee.total_salary0 = parseFloat($scope.employee_report.employee.degree.salary) + (parseFloat($scope.employee_report.employee.extra_salary || 0) || 0);
    }

    $scope.employee_report.total_salary = parseFloat($scope.employee_report.total_offers) - (parseFloat($scope.employee_report.total_discounts)) - (parseFloat($scope.employee_report.total_insurance)) - (parseFloat($scope.employee_report.total_mobile_discount));

    if ($scope.employee_report.employee.total_salary0 > 0) {
      $scope.employee_report.total_salary = parseFloat($scope.employee_report.total_salary) + (parseFloat($scope.employee_report.employee.total_salary0));
    } else {
      $scope.employee_report.total_salary = 0;
    }

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

  $scope.getAddedTicketList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/all",
      data: {
        where: {
          'add_user_info.id': $scope.employee_report.user_id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
        },
        limit: 1000
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employee_report.total_tickets = response.data.list.length;
          $scope.employee_report.ticketList = response.data.list;
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
      url: "/api/tickets/all",
      data: {
        where: {
          'assign_user_info.id': $scope.employee_report.user_id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
        },
        limit: 1
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employee_report.assginTicketList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getclose1TicketList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/all",
      data: {
        where: {
          'close_eng_user_info.id': $scope.employee_report.user_id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
        },
        limit: 1
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employee_report.close1TicketList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getBackEngTicketList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/all",
      data: {
        where: {
          'back_to_eng_user_info.id': $scope.employee_report.user_id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
        },
        limit: 1
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employee_report.BackEngTicketList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getClose2TicketList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/all",
      data: {
        where: {
          'close2_user_info.id': $scope.employee_report.user_id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
        },
        limit: 1
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employee_report.Close2TicketList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getReviewTicketList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/all",
      data: {
        where: {
          'review_user_info.id': $scope.employee_report.user_id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
        },
        limit: 1
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employee_report.ReviewTicketList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };




  $scope.getEmployeeOfferList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employee_offer/all",
      data: {
        where: {
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo,
          'eng.id': $scope.search.employee.id,
        },
        limit: 1
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employee_report.employeeOfferList = response.data.list;
          $scope.calc();
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };


  $scope.getEmployeeDiscountList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employee_discount/all",
      data: {
        where: {
          'eng.id': $scope.search.employee.id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo,
        },
        limit: 1
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employee_report.employeeDiscountList = response.data.list;
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
          'eng.id': $scope.search.employee.id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo,
        },
        limit: 1
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employee_report.employeeAdvancesList = response.data.list;

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
          'employee.id': $scope.search.employee.id,
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employee_report.employeeinsuranceList = response.data.list;
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
          'employee.id': $scope.search.employee.id,
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employee_report.employeeMobileList = response.data.list;
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


  $scope.getEmployeeList();
  $scope.loadUsers();
  $scope.loadSafes();
});
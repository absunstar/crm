app.controller("month_employees_reports", function ($scope, $http) {

  $scope.search = {
    employee: {}
  };

  $scope.showSearch = function () {
    site.showModal('#searchModal');
  };

  $scope.searchAll = function () {

    if ($scope.search.employee && $scope.userList && $scope.userList.length > 0) {
      $scope.userList.forEach(user => {
        if (user.employee_id == $scope.search.employee.id) {
          $scope.user_id = user.id;
        }
      });
    } else {
      return;
    }

    $scope.loadUsers = function () {
      if ($scope.userList) {
        return
      }
      $scope.busy = true;
      $http({
        method: "POST",
        url: "/api/users/all",
        data: {
         
        }
      }).then(
        function (response) {
          $scope.busy = false;
          if (response.data.done) {
          
            $scope.userList = response.data.list;
          }
        },
        function (err) {
          $scope.busy = false;
          $scope.error = err;
        }
      )
    };

    $scope.employee = $scope.search.employee;
    $scope.getAddedTicketList();
    $scope.getAssignTicketList();

    $scope.getclose1TicketList();
    $scope.getBackEngTicketList();
    $scope.getClose2TicketList();
    $scope.getReviewTicketList();

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
      data: {
        where: {
          'role.name': {
            $ne: 'eng'
          }
        }
      },
      url: "/api/employees/all"
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employeeList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.edit = function (month_employees_reports) {
    $scope.error = '';

    $scope.month_employees_reports = {};
    site.showModal('#approvedmonth_employees_reportsModal');
  };

  $scope.approved = function () {
    $scope.busy = true;
    $scope.month_employees_reports.done = true
    $http({
      method: "POST",
      url: "/api/month_employees_reports/approved",
      data: $scope.month_employees_reports
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#month_employees_reports');
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
          'add_user_info.id': $scope.user_id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
        },
        limit:10000,
     
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.total_tickets = response.data.list.length;
          $scope.ticketList = response.data.list;
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
          'assign_user_info.id': $scope.user_id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
        },
        limit:10000,
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.assginTicketList = response.data.list;
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
          'close_eng_user_info.id': $scope.user_id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
        },
        limit:10000,
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.close1TicketList = response.data.list;
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
          'back_to_eng_user_info.id': $scope.user_id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
        },
        limit:10000,
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.BackEngTicketList = response.data.list;
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
          'close2_user_info.id': $scope.user_id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
        },
        limit:10000,
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.Close2TicketList = response.data.list;
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
          'review_user_info.id': $scope.user_id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
        },
        limit:10000,
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.ReviewTicketList = response.data.list;
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

});
app.controller("month_general_employees_reports", function ($scope, $http) {

  $scope.search = {
    employee: {}
  };
  $scope.list = [];

  $scope.add_count = 0
  $scope.assign_count = 0
  $scope.close1_count = 0
  $scope.BackEng_count = 0
  $scope.Close2_count = 0
  $scope.Review_count = 0


  $scope.showSearch = function () {
    site.showModal('#searchModal');
    $scope.list = [];
    $scope.add_count = 0
  $scope.assign_count = 0
  $scope.close1_count = 0
  $scope.BackEng_count = 0
  $scope.Close2_count = 0
  $scope.Review_count = 0
  };

  $scope.searchAll = function () {

    if ($scope.userList && $scope.userList.length > 0) {
      $scope.userList.forEach(user => {

        $scope.list.push({
          name: user.profile.name || user.email,
          user_id: user.id
        });
        $scope.getAddedTicketList(user.id);
        $scope.getAssignTicketList(user.id);
        $scope.getclose1TicketList(user.id);
        $scope.getBackEngTicketList(user.id);
        $scope.getClose2TicketList(user.id);
        $scope.getReviewTicketList(user.id);
      }
      
      );
    }

    site.hideModal('#searchModal');
   

  };
// $scope.reload=
//   function reload() {
//     window.location.reload(true);
// }

// $scope.show_btn= function(){
//   $scope.show_search = true;
// };

// $scope.hide_btn= function(){
//   $scope.hide_search = true;
// };

  $scope.getEmployeeList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
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


  $scope.edit = function (month_general_employees_reports) {
    $scope.error = '';

    $scope.month_general_employees_reports = {};
    site.showModal('#approvedmonth_general_employees_reportsModal');
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


  $scope.getAddedTicketList = function (user_id) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/all",
      data: {
        where: {
          'add_user_info.id': user_id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
        },
        limit:10000,
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
        

          
          $scope.list.forEach(li => {
            
            if (li.user_id == user_id) {
              li.added_tickets_count = response.data.list.length
             $scope.add_count += li.added_tickets_count
            }
          })

         
        }

      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getAssignTicketList = function (user_id) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/all",
      data: {
        where: {
          'assign_user_info.id': user_id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
        },
        limit:10000,
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.list.forEach(li => {
            if (li.user_id == user_id) {
              li.assign_tickets_count = response.data.list.length
              $scope.assign_count+=li.assign_tickets_count

            }
          })
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getclose1TicketList = function (user_id) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/all",
      data: {
        where: {
          'close_eng_user_info.id': user_id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
        },
        limit:10000,
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.list.forEach(li => {
            if (li.user_id == user_id) {
              li.close1_tickets_count = response.data.list.length
              $scope.close1_count+=li.close1_tickets_count
            }
          })
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getBackEngTicketList = function (user_id) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/all",
      data: {
        where: {
          'back_to_eng_user_info.id': user_id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
        },
        limit:10000,
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.list.forEach(li => {
            if (li.user_id == user_id) {
              li.back_eng_tickets_count = response.data.list.length
              $scope.BackEng_count+=li.back_eng_tickets_count
            }
          })
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getClose2TicketList = function (user_id) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/all",
      data: {
        where: {
          'close2_user_info.id': user_id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
        },
        limit:10000,
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.list.forEach(li => {
            if (li.user_id == user_id) {
              li.close2_tickets_count = response.data.list.length
              $scope.Close2_count+=li.close2_tickets_count
            }
          })
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getReviewTicketList = function (user_id) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/all",
      data: {
        where: {
          'review_user_info.id': user_id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
        },
        limit:10000,
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.list.forEach(li => {
            if (li.user_id == user_id) {
              li.review_tickets_count = response.data.list.length
               $scope.Review_count+=li.review_tickets_count
            }
          })

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
app.controller("month_engineers_report", function ($scope, $http) {

  $scope.search = {

    employee: {}
  };
  document.getElementById('reloadBtn').style.visibility = 'hidden';

  $scope.showSearch = function () {
    site.showModal('#searchModal');
    $scope.ticketList = [];
  };

  $scope.reload =
    function reload() {
      window.location.reload(true);
    }
  $scope.hide_search_btn =
    function hide_search_btn() {
      document.getElementById('searchAllBtn').style.visibility = 'hidden';
    }

  $scope.show_reload_btn =
    function show_reload_btn() {
      document.getElementById('reloadBtn').style.visibility = 'visible';
    }

  $scope.searchAll = function () {


    $scope.employee = $scope.search.employee;
    $scope.getTicketList($scope.search.employee);
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
        select: {
          id: 1,
          name: 1,
          degree: 1,
          department: 1,
          extra_salary: 1,
          extra_ticket: 1,
          job: 1
        },
        where: {
          'role.name': 'eng'
        }
      }
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

  $scope.getTicketList = function (emp) {
    $scope.total = 0;
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/get_assigned",
      data: {
          'eng.id': emp.id,
          from_date: $scope.search.employee.dateFrom,
          to_date: $scope.search.employee.dateTo
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.total_tickets = response.data.list.length;
          $scope.ticketList = response.data.list;


          $scope.ticketList.forEach(t => {
            t.$total_output = 0;
            t.$total_input = 0;
            t.$total_sell = 0;

            t.outputs.forEach((a , i) => {
              if(a.eng.id == emp.id && a.value){
                t.$total_output += parseFloat(a.value);
              }else{
                t.outputs.splice(i , 1);
              }
            });
            t.inputs.forEach((s , i) => {
              if(s.eng.id == emp.id &&s.value){
                t.$total_input += parseFloat(s.value);
              }else{
                t.inputs.splice(i , 1);
              }
            });
            t.item_sell_list.forEach((d , i) => {
              if(d.eng.id == emp.id && d.price){
                t.$total_sell += parseFloat(d.price);
              }else{
                t.item_sell_list.splice(i , 1);
              }
            });

            t.item_needed_list.forEach((d , i) => {
              if(d.eng.id == emp.id && d.price){
              
              }else{
                t.item_needed_list.splice(i , 1);
              }
            });

            t.item_replace_list.forEach((d , i) => {
              if(d.eng.id == emp.id && d.price){
              
              }else{
                t.item_replace_list.splice(i , 1);
              }
            });

            t.$total = t.$total_input  - t.$total_output + t.$total_sell;
          });
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


});
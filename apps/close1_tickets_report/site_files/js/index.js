app.controller("close1_tickets_report", function ($scope, $http) {

  $scope._search = {};

  var Search = function () {
    return {
      employee: {},
      date: new Date()
    }
  };

  $scope.report = {};

  $scope.search = new Search();

  $scope.showSearch = function () {
    $scope._search = {};
    site.showModal('#searchModal');
    $scope.report.list = [];
  };


  $scope.searchAll = function () {
    $scope._search = {};
    $scope.employee = $scope.search.employee;
    $scope.getTicketList($scope.search.employee);

    site.hideModal('#searchModal');
    $scope.clearAll();
  };

  $scope.clearAll = function () {
    $scope.search = new Search();
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

    $scope.report = {
      date: $scope.search.date,
      sell_list: [],
      replace_list: [],
      needed_list: [],
      close_without_items: 0,
      close_with_items: 0,
      close_cancel: 0,
      close_need_items: 0,
      close_need_client: 0,
      total_input: 0,
      total_output: 0,
      total_sell: 0,
      total: 0,
      total_cost_count: 0
    };

    $scope.busy = true;

    $http({
      method: "POST",
      url: "/api/tickets/get_close1",
      data: {
          'eng.id': emp.id,
          date: $scope.search.date
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.report.total_tickets = response.data.list.length;
          $scope.report.list = response.data.list;


          $scope.report.list.forEach(t => {

            if (t.status.id === 2) {
              $scope.report.close_with_items += 1;
            } else if (t.status.id === 3) {
              $scope.report.close_without_items += 1;
            } else if (t.status.id === 5) {
              $scope.report.close_cancel += 1;
            } else if (t.status.id === 6) {
              $scope.report.close_need_items += 1;
            } else if (t.status.id === 7) {
              $scope.report.close_need_client += 1;
            }

            t.cost_count = 0
            t.eng_list.forEach(e=>{
              if(e.eng.id == emp.id){
                t.cost_count += e.cost_count || 0;
              }
            })
            
            $scope.report.total_cost_count += t.cost_count

            t.$total_output = 0;
            t.$total_input = 0;
            t.$total_sell = 0;
            t.$total = 0;

            t.outputs.forEach(a => {
              if (a.eng.id == emp.id && a.value) {
                t.$total_output += parseFloat(a.value);
              }

            });
            t.inputs.forEach(s => {
              if (s.eng.id == emp.id && s.value) {
                t.$total_input += parseFloat(s.value);
              }

            });

            t.item_sell_list.forEach(d => {
              if (d.eng.id == emp.id && d.price) {
                $scope.report.sell_list.push({
                  code: t.code,
                  name: d.name,
                  price: d.price
                });
                t.$total_sell += parseFloat(d.price);
              }
            });

            t.item_replace_list.forEach(d => {
              if (d.eng.id == emp.id) {
                $scope.report.replace_list.push({
                  code: t.code,
                  name: d.name
                });
              }

            });

            t.item_needed_list.forEach(d => {
              if (d.eng.id == emp.id) {
                $scope.report.needed_list.push({
                  code: t.code,
                  name: d.name
                });
              }
            });


            t.$total = t.$total_input - t.$total_output + t.$total_sell;

            $scope.report.total_input += t.$total_input;
            $scope.report.total_output += t.$total_output;
            $scope.report.total_sell += t.$total_sell;
            $scope.report.total += t.$total;

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
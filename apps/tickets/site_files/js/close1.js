$scope.showClose1 = function (t) {
  $scope._search = {};

    $scope.error = '';
    t = site.fromJson(t);
    $scope.view(t);
    $scope.ticket = {};
    site.showModal('#close1Modal');
  };

  
  $scope.updateClose1 = function () {
$scope._search = {};
    if($scope.ticket.device_info.status && $scope.ticket.device_info.status==1 && !$scope.ticket.device_info.serial ){
      $scope.error = "##word.ticket_status_serial##";
      return;
    }

    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/updateClose1",

      data: {
        ticket: $scope.ticket
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateTicketModal');
          site.hideModal('#close1Modal');
          $scope.updateOneTicket($scope.ticket);
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {}
    )
  };
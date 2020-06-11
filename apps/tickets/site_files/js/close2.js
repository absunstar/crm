$scope.showClose2 = function (t) {
  $scope._search = {};
    $scope.error = '';
    t = site.fromJson(t);
    $scope.view(t);
    $scope.ticket = {};
    site.showModal('#close2Modal');
  };

  
  $scope.updateClose2 = function () {
    $scope._search = {};
    if($scope.ticket.status && $scope.ticket.status.id == 1){
      $scope.error = "##word.ticket_status_open##";
      return
    }

    if($scope.ticket.status && $scope.ticket.status.id == 4 ){
      $scope.error = "##word.ticket_status_open_error##"
      return
    }
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/updateClose2",

      data: {
        ticket: $scope.ticket
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateTicketModal');
          site.hideModal('#close2Modal');
          $scope.updateOneTicket($scope.ticket);
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {}
    )
  };
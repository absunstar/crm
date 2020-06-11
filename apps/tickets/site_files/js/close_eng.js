$scope.showOrder = function(){
  site.showModal('#orderModal');
}

$scope.filterOrders = function(){
  $scope.order_list = []
  $http({
    method: "POST",
    url: "/api/tickets/all",
    data: {
      where: { 'status.id':4, 'customer.region.id' : $scope.region.id , 'eng.id':$scope.eng.id , 'assign_user_info.date':$scope.date}
    }
  }).then(
    function (response) {
      if (response.data.done && response.data.list.length > 0) {
        response.data.list.forEach((itm , i)=>{
          itm.index = i+1
        })
        $scope.order_list = response.data.list
      }
    })

}
$scope.showAssignEng = function (id, eng) {
    $scope.error = '';
    $scope.id = id;3
    $scope.eng = eng || {};
    site.showModal('#engSelectModal');
  };

  
  $scope.showcloseEng = function (t) {
    $scope.error = ''; 
    
    t = site.fromJson(t);
    $scope.view(t , (t2)=>{
      t2.close_eng.status = t.close_eng.status || $scope.tickets_status[3];
      $scope.loadEngItemList(t2.eng);
    });
    

    $scope.ticket = { }
    $scope.close_eng_date = new Date()
   
    site.showModal('#closeEngModal');
    
  };

  
  $scope.assignEng = function () {
    $scope._search = {};
    if($scope.eng &&  !$scope.eng.id){
      $scope.error = "##word.choose_eng_warning##";
      return;
    }
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/assignEng",
      data: {
        id: $scope.id,
        eng: $scope.eng
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#engSelectModal');
          $scope.updateOneTicket({id : $scope.id });

        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        $scope.error = err;
      }
    )
  };

  $scope.assignEngAll = function () {
    $scope._search = {};

    if($scope.eng &&  !$scope.eng.id){
      $scope.error = "##word.choose_eng_warning##";
      return;
    }
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/assignEngAll",
      data: {
        eng: $scope.eng,
        ids: $scope.list.filter(t => t.$select == true).map(t => t.id)
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#engSelectAllModal');
          $scope.loadAll();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        $scope.error = err;
      }
    )
  };

  $scope.loadEngList = function () {


    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees/all",
      data: {
        where: {
          'role.name': 'eng'
        },
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
  
  $scope.backToCloseEng = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/BackToCloseEng",
      data: {
        id: $scope.ticket.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#close1Modal');
          $scope.updateOneTicket($scope.ticket);
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        $scope.error = err;
      }
    );
  };

  $scope.updateCloseEng = function () {
    if($scope.ticket.close_eng.device_info){
      $scope.ticket.close_eng.device_info.date = $scope.close_eng_date;
      $scope.ticket.close_eng.date = $scope.close_eng_date;
    }
    if($scope.ticket.close_eng.status && $scope.ticket.close_eng.status.id == 1){
      $scope.error = "##word.ticket_status_open_error##";
      return
    }
    if($scope.ticket.close_eng.status && $scope.ticket.close_eng.status.id == 2){
      $scope.ticket.close_eng.item_sell_list = $scope.ticket.close_eng.item_sell_list|| [];
      $scope.ticket.close_eng.item_replace_list = $scope.ticket.close_eng.item_replace_list || [];
      if($scope.ticket.close_eng.item_sell_list.length == 0 && $scope.ticket.close_eng.item_replace_list.length == 0){
        $scope.error ="##word.ticket_status_choose_items_list##";
        return;
      }
    }
    if( $scope.ticket.close_eng.status && $scope.ticket.close_eng.status.id == 2 && $scope.ticket.files.length == 0 ){
      $scope.error ="##word.ticket_files_error##";
      return;
    }
    if( $scope.ticket.close_eng.status && $scope.ticket.close_eng.status.id == 2 && !$scope.ticket.close_eng.fixes ){
      $scope.error ="##word.ticket_fix_error##";
      return;
    }
    
    
    if($scope.ticket.close_eng.status && $scope.ticket.close_eng.status.id == 2 && !$scope.ticket.close_eng.device_info.status ){
      $scope.error = "##word.ticket_status_error##"
      return
    }
   
  
      
   
     
      if($scope.ticket.close_eng.status && ($scope.ticket.close_eng.status.id ==3 || $scope.ticket.close_eng.status.id ==8 || $scope.ticket.close_eng.status.id ==9 || $scope.ticket.close_eng.status.id ==10 ) && $scope.ticket.files.length == 0){
        $scope.error ="##word.ticket_files_error##";
        return;
      }
      if($scope.ticket.close_eng.status && ($scope.ticket.close_eng.status.id ==3 || $scope.ticket.close_eng.status.id ==8 || $scope.ticket.close_eng.status.id ==9 || $scope.ticket.close_eng.status.id ==10 ) &&!$scope.ticket.close_eng.fixes ){
        $scope.error ="##word.ticket_fixes_error##";
        return;
      }
      if($scope.ticket.close_eng.status && ($scope.ticket.close_eng.status.id ==3 || $scope.ticket.close_eng.status.id ==8 || $scope.ticket.close_eng.status.id ==9 || $scope.ticket.close_eng.status.id ==10 ) &&!$scope.ticket.close_eng.device_info.status ){
        $scope.error = "##word.ticket_status_error##"
        return;
      }
      
    
    if($scope.ticket.close_eng.status && $scope.ticket.close_eng.status.id == 4){
      $scope.error = "##word.ticket_status_open_error##"
      return
    }
    if($scope.ticket.close_eng.status && ($scope.ticket.close_eng.status.id ==5 || $scope.ticket.close_eng.status.id == 7 || $scope.ticket.close_eng.status.id == 11 || $scope.ticket.close_eng.status.id == 12 || $scope.ticket.close_eng.status.id == 13 || $scope.ticket.close_eng.status.id == 14 || $scope.ticket.close_eng.status.id == 15 )){
     
    
      if(!$scope.ticket.close_eng.fixes ){
        $scope.error ="##word.ticket_fixes_error##";
        return;
      }
    
      
    }
    // if( $scope.ticket.close_eng.status && $scope.ticket.close_eng.status.id == 2){
    //   if( !$scope.ticket.close_eng.item_replace_list || $scope.ticket.close_eng.item_replace_list.length == 0 ){
    //     if(!$scope.ticket.close_eng.item_sell_list || $scope.ticket.close_eng.item_sell_list.length == 0){
    //       $scope.error = "##word.ticket_replace_list_error##"
    //       return
    //     }
    //   }
    // }
   
    

    
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/updateCloseEng",

      data: {
        ticket: $scope.ticket
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateTicketModal');
          site.hideModal('#closeEngModal');
          $scope.updateOneTicket($scope.ticket);
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {}
    )
  };
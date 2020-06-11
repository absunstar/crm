$scope.addToCloseEngInput = function () {
  $scope.ticket.close_eng.inputs = $scope.ticket.close_eng.inputs || [];

  if ($scope.input.value) {
    $scope.ticket.close_eng.inputs.push($scope.input);
  }

  $scope.input = null;

};

$scope.deleteCloseEngInput = function (input) {
  $scope.ticket.close_eng.inputs = $scope.ticket.close_eng.inputs || [];
  for (let i = 0; i < $scope.ticket.close_eng.inputs.length; i++) {
    if ($scope.ticket.close_eng.inputs[i].value == input.value && $scope.ticket.close_eng.inputs[i].name == input.name) {
      $scope.ticket.close_eng.inputs.splice(i, 1);
    }
  }
  $scope.ticket.inputs = $scope.ticket.inputs || [];
  for (let i = 0; i < $scope.ticket.inputs.length; i++) {
    if ($scope.ticket.inputs[i].value == input.value && $scope.ticket.inputs[i].name == input.name) {
      $scope.ticket.inputs.splice(i, 1);
    }
  }

};


$scope.addToCloseEngOutput = function () {
  $scope.ticket.close_eng.outputs = $scope.ticket.close_eng.outputs || [];
  if ($scope.output.value) {
    $scope.ticket.close_eng.outputs.push($scope.output);
  }
  $scope.output = null;
};



$scope.deleteCloseEngOutput = function (output) {
  $scope.ticket.close_eng.outputs = $scope.ticket.close_eng.outputs || [];
  for (let i = 0; i < $scope.ticket.close_eng.outputs.length; i++) {
    if ($scope.ticket.close_eng.outputs[i].value == output.value && $scope.ticket.close_eng.outputs[i].name == output.name) {
      $scope.ticket.close_eng.outputs.splice(i, 1);
    }
  }

  $scope.ticket.outputs = $scope.ticket.outputs || [];
  for (let i = 0; i < $scope.ticket.outputs.length; i++) {
    if ($scope.ticket.outputs[i].value == output.value && $scope.ticket.outputs[i].name == output.name) {
      $scope.ticket.outputs.splice(i, 1);
    }
  }

};



$scope.addToCloseEngItemSell = function () {
  $scope.ticket.close_eng.item_sell_list = $scope.ticket.close_eng.item_sell_list || [];

  if ($scope.itemSell && $scope.itemSell.id) {

    $scope.ticket.close_eng.item_sell_list.forEach((itm, i) => {
      if (itm.id === $scope.itemSell.id) {
        $scope.ticket.close_eng.item_sell_list.splice(i, 1);
      }
    })

    $scope.ticket.close_eng.item_sell_list.push($scope.itemSell);

    $scope.engItemList.forEach((itm, i) => {
      if (itm.id === $scope.itemSell.id) {
        $scope.engItemList.splice(i, 1);
      }
    })
  }
  $scope.itemSell = null;
};


$scope.deleteCloseEngItemSell = function (item) {
  $scope.engItemList = $scope.engItemList || []
  for (let i = 0; i < $scope.ticket.close_eng.item_sell_list.length; i++) {
    if ($scope.ticket.close_eng.item_sell_list[i].id == item.id) {
      $scope.engItemList.push(item);
      $scope.ticket.close_eng.item_sell_list.splice(i, 1);
    }
  }
  $scope.ticket.item_sell_list = $scope.ticket.item_sell_list || [];
  for (let i = 0; i < $scope.ticket.item_sell_list.length; i++) {
    if ($scope.ticket.item_sell_list[i].id == item.id) {
      $scope.engItemList.push(item);
      $scope.ticket.item_sell_list.splice(i, 1);
    }
  }

};


$scope.addToCloseEngItemReplace = function () {
  $scope.ticket.close_eng.item_replace_list = $scope.ticket.close_eng.item_replace_list || [];
  if ($scope.itemReplace && $scope.itemReplace.id) {

    $scope.ticket.close_eng.item_replace_list.forEach((itm, i) => {
      if (itm.id === $scope.itemReplace.id) {
        $scope.ticket.close_eng.item_replace_list.splice(i, 1);
      }
    })

    $scope.ticket.close_eng.item_replace_list.push($scope.itemReplace);

    $scope.engItemList.forEach((itm, i) => {
      if (itm.id === $scope.itemReplace.id) {
        $scope.engItemList.splice(i, 1);
      }
    })
  }


  $scope.itemReplace = null;

};


$scope.deleteCloseEngItemReplace = function (item) {
  $scope.engItemList = $scope.engItemList || [];
  for (let i = 0; i < $scope.ticket.close_eng.item_replace_list.length; i++) {
    if ($scope.ticket.close_eng.item_replace_list[i].id == item.id) {
      $scope.engItemList.push(item);
      $scope.ticket.close_eng.item_replace_list.splice(i, 1);
    }
  }
  for (let i = 0; i < $scope.ticket.item_replace_list.length; i++) {
    if ($scope.ticket.item_replace_list[i].id == item.id) {
      $scope.ticket.item_replace_list.splice(i, 1);
    }
  }
  if ($scope.ticket.close_eng.item_replace_list.length == 0) {
    $scope.ticket.close_eng.item_replace_list = [];
  }
};


$scope.addToCloseEngItemNeeded = function () {
  $scope.ticket.close_eng.item_needed_list = $scope.ticket.close_eng.item_needed_list || [];
  if ($scope.itemNeeded) {
    $scope.ticket.close_eng.item_needed_list.push($scope.itemNeeded);
  }

  $scope.itemNeeded = null;

};


$scope.deleteCloseEngItemNeeded = function (item) {
  $scope.ticket.close_eng.item_needed_list = $scope.ticket.close_eng.item_needed_list || [];
  for (let i = 0; i < $scope.ticket.close_eng.item_needed_list.length; i++) {
    if ($scope.ticket.close_eng.item_needed_list[i].name == item.name) {
      $scope.ticket.close_eng.item_needed_list.splice(i, 1);
    }
  }

  $scope.ticket.item_needed_list = $scope.ticket.item_needed_list || [];
  for (let i = 0; i < $scope.ticket.item_needed_list.length; i++) {
    if ($scope.ticket.item_needed_list[i].name == item.name) {
      $scope.ticket.item_needed_list.splice(i, 1);
    }
  }
};
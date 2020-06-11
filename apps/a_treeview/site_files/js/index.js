app.controller("a_treeview", function ($scope, $http) {

  $scope.displayAdd = function (node) {
    $scope.parent = node || $scope.projects;
    $scope.item = {};
    site.showModal('#addItemModal');
  };

  $scope.add = function () {
    $scope.parent.items = $scope.parent.items || [];
    $scope.parent.items.push($scope.item);
  };

  $scope.edit = function (node) {
    console.log('edit');
    console.log(node);
  };

  $scope.delete = function (node) {
    console.log('delete');
    console.log(node);
  };

  $scope.projects = {
    id: 1,
    name: 'شجرة الحسابات',
    items: [{
        id: 2,
        name: 'اﻻصول',
        items: [{
            id: 3,
            name: 'مبانى'
          },
          {
            id: 4,
            name: 'اجهزة',
            items: [{
                id: 5,
                name: 'كمبيوتر',
                items: [{
                    id: 6,
                    name: 'ديل'
                  },
                  {
                    id: 7,
                    name: 'توشيبا'
                  },
                  {
                    id: 8,
                    name: 'ايسر'
                  },
                  {
                    id: 9,
                    name: 'اسزوس'
                  },
                ]
              },
              {
                id: 10,
                name: 'شاشة'
              },
              {
                id: 11,
                name: 'سيرفر'
              },
              {
                id: 12,
                name: 'بروجوكتور'
              },
            ]
          },
          {
            id: 13,
            name: 'مركبات'
          },
          {
            id: 14,
            name: 'اثاث'
          },
        ]
      },
      {
        id: 15,
        name: 'خصوم'
      },
      {
        id: 16,
        name: 'تكاليف'
      },
      {
        id: 17,
        name: 'خسائر'
      },
    ]
  }

});
app.controller("import", function ($scope, $http, $interval) {

    $scope.importResult = function () {

        $http({
            method: "POST",
            url: "/api/import/result"
        }).then(
            function (response) {
                $scope.result = response.data;
            },
            function (err) {
                console.log(err);
            }
        )
    };

    $scope.importResult();
    $interval(() => {
        $scope.importResult();
    }, 3000);

    $scope.resetResult = function () {

        $http({
            method: "POST",
            url: "/api/import/result/reset"
        }).then(
            function (response) {
                $scope.result = response.data;
            },
            function (err) {
                console.log(err);
            }
        )
    };


    $scope.importCore = function () {

        $scope.busy = true;

        $http({
            method: "POST",
            url: "/api/import/core"
        }).then(
            function (response) {
                $scope.busy = false;
            }
        )
    };


    $scope.importLocations = function () {

        $scope.busy = true;

        $http({
            method: "POST",
            url: "/api/import/locations"
        }).then(
            function (response) {
                $scope.busy = false;
            }
        )
    };

    $scope.importDevices = function () {

        $scope.busy = true;

        $http({
            method: "POST",
            url: "/api/import/devices"
        }).then(
            function (response) {
                $scope.busy = false;
            }
        );
    };

    $scope.importEmployees = function () {

        $scope.busy = true;

        $http({
            method: "POST",
            url: "/api/import/employees"
        }).then(
            function (response) {
                $scope.busy = false;
            }
        );
    };

    $scope.importCustomers = function () {

        $scope.busy = true;

        $http({
            method: "POST",
            url: "/api/import/customers"
        }).then(
            function (response) {
                $scope.busy = false;
            }
        );
    };

    $scope.dropAllCustomers = function () {

        $scope.busy = true;

        $http({
            method: "POST",
            url: "/api/drop/customers"
        }).then(
            function (response) {
                $scope.busy = false;
            }
        );
    };

    $scope.importTickets = function () {

        $scope.busy = true;

        $http({
            method: "POST",
            url: "/api/import/tickets",
            data: $scope.ticket
        }).then(
            function (response) {
                $scope.busy = false;
            }
        );
    };

    $scope.dropAllTickets = function () {

        $scope.busy = true;

        $http({
            method: "POST",
            url: "/api/drop/tickets"
        }).then(
            function (response) {
                $scope.busy = false;
            }
        );
    };

    $scope.removeAllTickets = function () {

        $scope.busy = true;

        $http({
            method: "POST",
            url: "/api/remove/tickets"
        }).then(
            function (response) {
                $scope.busy = false;
            }
        );
    };

    $scope.countAllTickets = function () {

        $scope.busy = true;

        $http({
            method: "POST",
            url: "/api/count/tickets"
        }).then(
            function (response) {
                $scope.busy = false;
            }
        );
    };

});
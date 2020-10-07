app.controller("mobiles_slides", function ($scope, $http) {

  $scope.mobile_slide = {};

  $scope.loadmobiles_slides = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/mobiles_slides/all",
      data: {
        select : {id:1 , name : 1}
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.mobiles_slides = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
      )
  };

  $scope.loadAll = function (where , limit) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/mobiles_slides/all",
      data: {where : where,
      limit : limit
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.list = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
      )
  };


  $scope.searchAll = function () {
    $scope.error = '';
    let where = {};
      
    if ($scope.search.slide_name) {
      where['slide_name'] = ($scope.search.slide_name);
    }

    if ($scope.search.number) {
      where['number'] = ($scope.search.number);
    }

    if ($scope.search.value) {
      where['value'] = ($scope.search.value);
    }

    if ($scope.search.tax) {
      where['tax'] = ($scope.search.tax);
    }

    if ($scope.search.vat) {
      where['vat'] = ($scope.search.vat);
    }

    if ($scope.search.minutes_in) {
      where['minutes_in'] = ($scope.search.minutes_in);
    }

    if ($scope.search.minutes_out) {
      where['minutes_out'] = ($scope.search.minutes_out);
    }

    if ($scope.search.sms_in) {
      where['sms_in'] = ($scope.search.sms_in);
    }

    if ($scope.search.sms_out) {
      where['sms_out'] = ($scope.search.sms_out);
    }

    if ($scope.search.mobile_data) {
      where['mobile_data'] = ($scope.search.mobile_data);
    }

    if ($scope.search.description) {
      where['description'] = ($scope.search.description);
    }

    
    $scope.loadAll(where , $scope.search.limit);
  };



  $scope.newMobile_Slide = function () {
    $scope.error = '';
    $scope.mobile_slide = { image_url: '/images/mobile_slides.png' };
    site.showModal('#addMobile_SlideModal');
  };
  $scope.add = function () {
    $scope.error = '';
    let v = site.validated();

    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
   $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/mobiles_slides/add",
      data: $scope.mobile_slide
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addMobile_SlideModal');
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

  $scope.edit = function (mobile_slide) {
    $scope.error = '';
    $scope.view(mobile_slide);
    $scope.mobile_slide = {};
    site.showModal('#updateMobile_SlideModal');
  };
  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/mobiles_slides/update",
      data: $scope.mobile_slide
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateMobile_SlideModal');
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

  $scope.remove = function (mobile_slide) {
    $scope.error = '';
    $scope.view(mobile_slide);
    $scope.mobile_slide = {};
    site.showModal('#deleteMobile_SlideModal');
  };

  $scope.view = function (mobile_slide) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/mobiles_slides/view",
      data: { _id: mobile_slide._id }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.mobile_slide = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
      )
  };
  $scope.details = function (mobile_slide) {
    $scope.error = '';
    $scope.view(mobile_slide);
    $scope.mobile_slide = {};
    site.showModal('#viewMobile_SlideModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/mobiles_slides/delete",
      data: { _id: $scope.mobile_slide._id, name: $scope.mobile_slide.name }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteMobile_SlideModal');
          $scope.loadAll();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
      )
  };
  $scope.loadAll();    
  $scope.loadmobiles_slides();
});

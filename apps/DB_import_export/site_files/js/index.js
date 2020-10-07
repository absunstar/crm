app.controller("DB_import_export", function ($scope, $http) {


  $scope.export_file_amount_in = function () {

    window.location.href="/api/amounts_in/export_file_amount_in"
  };

  $scope.import_file_amount_in = function () {
    $scope.error = '';
    

    $http({
      method: "POST",
      url: "/api/amounts_in/import_file_amount_in",
      data: $scope.amount_in

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
    
    
  };

  $scope.export_file_amount_out = function () {
    window.location.href="/api/amounts_out/export_file_amount_out"
  };

  $scope.import_file_amount_out = function () {
    $scope.error = '';
    

    $http({
      method: "POST",
      url: "/api/amounts_out/import_file_amount_out",
      data: $scope.amount_out

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
    
    
  };

  $scope.export_file_safes = function () {
    window.location.href="/api/safes/export_file_safes"

  };

  $scope.import_file_safes = function () {
    $scope.error = '';
    

    $http({
      method: "POST",
      url: "/api/safes/import_file_safes",
      data: $scope.safes

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
    
    
  };

  $scope.export_file_in_out_names = function () {
    window.location.href="/api/in_out_names/export_file_in_out_names"
  };

  $scope.import_file_in_out_names = function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/in_out_names/import_file_in_out_names",
      data: $scope.in_out_names

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
    
    
  };

  $scope.export_file_employee_offer = function () {
    window.location.href="/api/employee_offer/export_file_employee_offer"
  };

  $scope.import_file_employee_offer = function () {
    $scope.error = '';
    

    $http({
      method: "POST",
      url: "/api/employee_offer/import_file_employee_offer",
      data: $scope.employee_offer

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.export_file_employee_discount = function () {
    window.location.href="/api/employee_discount/export_file_employee_discount"
  };

  $scope.import_file_employee_discount = function () {
    $scope.error = '';
    

    $http({
      method: "POST",
      url: "/api/employee_discount/import_file_employee_discount",
      data: $scope.employee_discount

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.export_file_employees_debt = function () {
    window.location.href="/api/employees_debt/export_file_employees_debt"
  };

  $scope.import_file_employees_debt = function () {
    $scope.error = '';
    

    $http({
      method: "POST",
      url: "/api/employees_debt/import_file_employees_debt",
      data: $scope.employees_debt

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };
  $scope.export_file_employees_advances = function () {
    window.location.href="/api/employees_advances/export_file_employees_advances"
  };

  $scope.import_file_employees_advances = function () {
    $scope.error = '';
    

    $http({
      method: "POST",
      url: "/api/employees_advances/import_file_employees_advances",
      data: $scope.employees_advances

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };
    
  $scope.export_file_employees_insurances = function () {
    window.location.href="/api/employees_insurances/export_file_employees_insurances"

  };

  $scope.import_file_employees_insurances = function () {
    $scope.error = '';
    

    $http({
      method: "POST",
      url: "/api/employees_insurances/import_file_employees_insurances",
      data: $scope.employees_insurances

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.export_file_insurances_slides = function () {

    window.location.href="/api/insurances_slides/export_file_insurances_slides"
  };

  $scope.import_file_insurances_slides = function () {
    $scope.error = '';
    

    $http({
      method: "POST",
      url: "/api/insurances_slides/import_file_insurances_slides",
      data: $scope.insurances_slides

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };
  $scope.export_file_employees_mobiles = function () {

    window.location.href="/api/employees_mobiles/export_file_employees_mobiles"

  };

  $scope.import_file_employees_mobiles = function () {
    $scope.error = '';
    

    $http({
      method: "POST",
      url: "/api/employees_mobiles/import_file_employees_mobiles",
      data: $scope.employees_mobiles

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.export_file_mobiles_slides = function () {

    window.location.href="/api/mobiles_slides/export_file_mobiles_slides"

  };

  $scope.import_file_mobiles_slides = function () {
    $scope.error = '';
    

    $http({
      method: "POST",
      url: "/api/mobiles_slides/import_file_mobiles_slides",
      data: $scope.mobiles_slides

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };
  
  $scope.export_file_customers = function () {

    window.location.href="/api/customers/export_file_customers"

  };

  $scope.import_file_customers = function () {
    $scope.error = '';
    

    $http({
      method: "POST",
      url: "/api/customers/import_file_customers",
      data: $scope.customers

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.export_file_stores = function () {

    window.location.href="/api/stores/export_file_stores"
  };

  $scope.import_file_stores = function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/stores/import_file_stores",
      data: $scope.stores

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.export_file_categories_items = function () {

    window.location.href="/api/categories_items/export_file_categories_items"
  };

  $scope.import_file_categories_items = function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/categories_items/import_file_categories_items",
      data: $scope.categories_items

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.export_file_stores_in = function () {

    window.location.href="/api/stores_in/export_file_stores_in"
  };

  $scope.import_file_stores_in = function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/stores_in/import_file_stores_in",
      data: $scope.stores_in

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.export_file_stores_out = function () {

    window.location.href="/api/stores_out/export_file_stores_out"

  };

  $scope.import_file_stores_out = function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/stores_out/import_file_stores_out",
      data: $scope.stores_out

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.export_file_eng_item_list = function () {

    window.location.href="/api/eng_item_list/export_file_eng_item_list"
  };

  $scope.import_file_eng_item_list = function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/eng_item_list/import_file_eng_item_list",
      data: $scope.eng_item_list

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };    
  
  $scope.export_file_eng_item_debt = function () {

    window.location.href="/api/eng_item_debt/export_file_eng_item_debt"
  };

  $scope.import_file_eng_item_debt = function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/eng_item_debt/import_file_eng_item_debt",
      data: $scope.eng_item_debt

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.export_file_tax_types = function () {

    window.location.href="/api/tax_types/export_file_tax_types"
  };

  $scope.import_file_tax_types= function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/tax_types/import_file_tax_types",
      data: $scope.tax_types

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.export_file_discount_types = function () {

    window.location.href="/api/discount_types/export_file_discount_types"
  };

  $scope.import_file_discount_types= function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/discount_types/import_file_discount_types",
      data: $scope.discount_types

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };
  
 
  
  $scope.export_file_goves = function () {

    window.location.href="/api/goves/export_file_goves"
  };

  $scope.import_file_goves= function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/goves/import_file_goves",
      data: $scope.goves

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };
   
  $scope.export_file_cities = function () {

    window.location.href="/api/cities/export_file_cities"
  };

  $scope.import_file_cities= function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/cities/import_file_cities",
      data: $scope.cities

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.export_file_towns = function () {

    window.location.href="/api/towns/export_file_towns"
  };

  $scope.import_file_towns= function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/towns/import_file_towns",
      data: $scope.towns

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.export_file_regions = function () {

    window.location.href="/api/regions/export_file_regions"
  };

  $scope.import_file_regions= function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/regions/import_file_regions",
      data: $scope.regions

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.regions) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.export_file_companies = function () {

    window.location.href="/api/companies/export_file_companies"
  };

  $scope.import_file_companies= function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/companies/import_file_companies",
      data: $scope.companies

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.companies) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.export_file_companies_employees = function () {

    window.location.href="/api/companies_employees/export_file_companies_employees"
  };

  $scope.import_file_companies_employees= function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/companies_employees/import_file_companies_employees",
      data: $scope.companies_employees

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.companies_employees) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };


  $scope.export_file_companies_categories = function () {

    window.location.href="/api/companies_categories/export_file_companies_categories"
  };

  $scope.import_file_companies_categories= function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/companies_categories/import_file_companies_categories",
      data: $scope.companies_categories

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.companies_categories) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.export_file_companies_devices = function () {

    window.location.href="/api/companies_devices/export_file_companies_devices"
  };

  $scope.import_file_companies_devices= function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/companies_devices/import_file_companies_devices",
      data: $scope.companies_devices

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.companies_devices) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.export_file_damages = function () {

    window.location.href="/api/damages/export_file_damages"
  };

  $scope.import_file_damages= function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/damages/import_file_damages",
      data: $scope.damages

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.damages) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };


  $scope.export_file_categories = function () {

    window.location.href="/api/categories/export_file_categories"
  };

  $scope.import_file_categories= function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/categories/import_file_categories",
      data: $scope.categories

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.categories) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };
  
  $scope.export_file_sub_categories = function () {

    window.location.href="/api/sub_categories/export_file_sub_categories"
  };

  $scope.import_file_sub_categories= function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/sub_categories/import_file_sub_categories",
      data: $scope.sub_categories

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.sub_categories) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };


  $scope.export_file_devices_names = function () {

    window.location.href="/api/devices_names/export_file_devices_names"
  };

  $scope.import_file_devices_names= function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/devices_names/import_file_devices_names",
      data: $scope.devices_names

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.devices_names) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };
  
  $scope.export_file_employees = function () {

    window.location.href="/api/employees/export_file_employees"
  };

  $scope.import_file_employees= function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/employees/import_file_employees",
      data: $scope.employees

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.employees) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };


  $scope.export_file_departments = function () {

    window.location.href="/api/departments/export_file_departments"
  };

  $scope.import_file_departments= function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/departments/import_file_departments",
      data: $scope.departments

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.departments) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };



  $scope.export_file_jobs = function () {

    window.location.href="/api/jobs/export_file_jobs"
  };

  $scope.import_file_jobs= function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/employees/import_file_jobs",
      data: $scope.jobs

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.jobs) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };
  
  $scope.export_file_employees_degrees = function () {

    window.location.href="/api/employees_degrees/export_file_employees_degrees"
  };

  $scope.import_file_employees_degrees= function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/employees_degrees/import_file_employees_degrees",
      data: $scope.employees_degrees

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.jobs) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };
 
  $scope.export_file_militaries_status = function () {

    window.location.href="/api/militaries_status/export_file_militaries_status"
  };

  $scope.import_file_militaries_status= function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/militaries_status/import_file_militaries_status",
      data: $scope.militaries_status

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.jobs) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };
  
  $scope.export_file_maritals_status = function () {

    window.location.href="/api/maritals_status/export_file_maritals_status"
  };

  $scope.import_file_maritals_status= function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/maritals_status/import_file_maritals_status",
      data: $scope.maritals_status

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.maritals_status) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };
  
  $scope.export_file_tickets = function () {

    window.location.href="/api/tickets/export_file_tickets"
  };

  $scope.import_file_tickets= function () {
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/tickets/import_file_tickets",
      data: $scope.tickets

    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.tickets) {
         loadAll()
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  
});
module.exports = function (site) {

    let default_gov = {
        id: 1,
        name: 'منوفية'
    }

    site.onPOST('/api/import/devices', (req, res) => {

      
        setTimeout(() => {
            res.json({
                done: true
            })
        }, 1000 * 3);

        if(!site.security.isUserHasPermission(req, res , 'importDevices')){
            console.log('you not have importDevices permission')
            site.import_result['error'] = 'you not have importDevices permission'
            return
        }

        let $companies = site.connectCollection('companies')
        let $categories = site.connectCollection('categories')
        let $sub_categories = site.connectCollection('sub_categories')
        let $devices_names = site.connectCollection('devices_names')
        let $companies_devices = site.connectCollection('companies_devices')
        let $companies_categories = site.connectCollection('companies_categories')
        let $damages = site.connectCollection('damages')

        let sql = require("mssql");

        sql.connect(site.sql_config, function (err) {
            if (err) {
                console.log(err)
                site.import_result['error'] = err.message
                return
            }
            var request = new sql.Request();

            request.query('SELECT TOP (1000) [ID] ,[Name] FROM [MainDatabase].[dbo].[MainApp_Companies]', function (err, result) {

                if (err) {
                    console.log(err)
                    site.import_result['error'] = err.message
                    return
                }

                let companies = result.recordset


                request.query('SELECT distinct TOP (1000)  [Description] FROM [MainDatabase].[dbo].[MainApp_Devices]', function (err, result) {

                    if (err) {
                        console.log(err)
                        site.import_result['error'] = err.message
                        return
                    }

                    let categories = result.recordset
                    request.query('SELECT TOP (1000) [ID],[Name],[Description] FROM [MainDatabase].[dbo].[MainApp_Devices]', function (err, result) {

                        if (err) {
                            console.log(err)
                            site.import_result['error'] = err.message
                            return
                        }

                        let sub_categories = result.recordset

                        request.query('SELECT TOP (1000) [ID],[CompanyID],[DeviceID] FROM [MainDatabase].[dbo].[MainApp_Device_Companies]', function (err, result) {

                            if (err) {
                                console.log(err)
                                site.import_result['error'] = err.message
                                return
                            }

                            let companies_sub_categories = result.recordset

                            request.query('SELECT TOP (1000) [ID],[Name],[CompanyID],[DeviceID] FROM [MainDatabase].[dbo].[MainApp_Products]', function (err, result) {

                                if (err) {
                                    console.log(err)
                                    site.import_result['error'] = err.message
                                    return
                                }

                                let devices_names = result.recordset


                                request.query('SELECT TOP (1000) [ID],[Name],[DeviceID] FROM [MainDatabase].[dbo].[MainApp_ComplaintsTypes]', function (err, result) {

                                    if (err) {
                                        console.log(err)
                                        site.import_result['error'] = err.message
                                        return
                                    }

                                    let damages = result.recordset



                                    request.query('SELECT TOP (1000000) [ID],[Name],[CompanyID],[DeviceID],[ProductID],[Name2] FROM [MainDatabase].[dbo].[MainApp_Models]', function (err, result) {

                                        if (err) {
                                            console.log(err)
                                            site.import_result['error'] = err.message
                                            return
                                        }

                                        let models = result.recordset
                                        sql.close()


                                        site.import_result['companies_count'] = companies.length
                                        site.import_result['categories_count'] = categories.length
                                        site.import_result['sub_categories_count'] = sub_categories.length
                                        site.import_result['companies_sub_categories_count'] = companies_sub_categories.length
                                        site.import_result['devices_names_count'] = devices_names.length
                                        site.import_result['models_count'] = models.length
                                        site.import_result['damages_count'] = damages.length

                                        console.log('companies count : ' + companies.length)
                                        console.log('categories count : ' + categories.length)
                                        console.log('sub_categories count : ' + sub_categories.length)
                                        console.log('companies_sub_categories count : ' + companies_sub_categories.length)
                                        console.log('devices_names count : ' + devices_names.length)
                                        console.log('models count : ' + models.length)

                                        $companies.drop(() => {
                                            $categories.drop(() => {
                                                $companies_categories.drop(() => {
                                                    $sub_categories.drop(() => {
                                                        $devices_names.drop(() => {
                                                            $companies_devices.drop(() => {

                                                                let company_list = []
                                                                let category_list = []
                                                                let sub_category_list = []
                                                                let company_category_list = []
                                                                let devices_name_list = []

                                                                companies.forEach(company => {
                                                                    if (company.Name) {
                                                                        $companies.add({
                                                                            id: company.ID,
                                                                            is_old_data : true,
                                                                            name: company.Name,
                                                                            active : true
                                                                        }, (err, doc) => {
                                                                            if (!err) {
                                                                                company_list.push(doc)
                                                                                console.log('company added : ' + doc.id)
                                                                                site.import_result['company_id'] = doc.id
                                                                            }
                                                                        })
                                                                    }

                                                                })

                                                                categories.forEach(category => {
                                                                    if (category.Description) {
                                                                        $categories.add({
                                                                            is_old_data : true,
                                                                            name: category.Description,
                                                                            active : true
                                                                        }, (err, doc) => {
                                                                            if (!err) {
                                                                                category_list.push(doc)
                                                                                console.log('category added : ' + doc.id)
                                                                                site.import_result['category_id'] = doc.id
                                                                            }

                                                                        })
                                                                    }

                                                                })

                                                                setTimeout(() => {
                                                                    // [ID],[Name],[Description]
                                                                    sub_categories.forEach(sub_category => {
                                                                        let _sub_category = {
                                                                            id: sub_category.ID,
                                                                            is_old_data : true,
                                                                            name: sub_category.Name,
                                                                            active : true
                                                                        }
                                                                        category_list.forEach(c => {
                                                                            if (c.name == sub_category.Description) {
                                                                                _sub_category.category = {
                                                                                    id: c.id,
                                                                                    name: c.name
                                                                                }
                                                                            }
                                                                        })

                                                                        if (!_sub_category.category) {
                                                                            _sub_category.category = {
                                                                                id: 15,
                                                                                name: 'اجهزه اخرى'
                                                                            }
                                                                        }

                                                                        $sub_categories.add(_sub_category, (err, doc) => {
                                                                            if (!err) {
                                                                                sub_category_list.push(doc)
                                                                                console.log('sub_category added : ' + doc.id)
                                                                                site.import_result['sub_category_id'] = doc.id
                                                                            }

                                                                        })
                                                                    })

                                                                    setTimeout(() => {
                                                                        // [ID],[Name],[DeviceID]
                                                                        $damages.drop(() => {


                                                                            damages.forEach(da => {
                                                                                let _da = {
                                                                                    id: da.ID,
                                                                                    name: da.Name,
                                                                                    active : true
                                                                                }
                                                                                sub_category_list.forEach(sc => {
                                                                                    if (sc.id == da.DeviceID) {
                                                                                        _da.sub_category = {
                                                                                            id: sc.id,
                                                                                            name: sc.name
                                                                                        }
                                                                                        _da.category = {
                                                                                            id: sc.category.id,
                                                                                            name: sc.category.name
                                                                                        }
                                                                                    }
                                                                                })

                                                                                if (_da.name && _da.category && _da.sub_category) {
                                                                                    $damages.add(_da, (err, doc) => {
                                                                                        console.log('damage added : ' + doc.id)
                                                                                        site.import_result['damage_id'] = doc.id
                                                                                    })
                                                                                }

                                                                            })
                                                                        })

                                                                        // [ID],[CompanyID],[DeviceID] as sub_category
                                                                        companies_sub_categories.forEach(csc => {
                                                                            company_list.forEach(co => {
                                                                                if (co.id == csc.CompanyID) {
                                                                                    csc.company = {
                                                                                        id: co.id,
                                                                                        name: co.name
                                                                                    }
                                                                                }
                                                                            })
                                                                            sub_category_list.forEach(sc => {
                                                                                if (sc.category && csc.company && csc.DeviceID == sc.id) {
                                                                                    $companies_categories.add({
                                                                                        category: sc.category,
                                                                                        company: csc.company,
                                                                                        active : true
                                                                                    }, (err, doc) => {
                                                                                        if (!err) {
                                                                                            company_category_list.push(doc)
                                                                                            console.log('company_category added : ' + doc.id)
                                                                                            site.import_result['company_category_id'] = doc.id

                                                                                        }
                                                                                    })
                                                                                }
                                                                            })
                                                                        })

                                                                        setTimeout(() => {


                                                                            // devices_name [ID],[Name],[CompanyID],[DeviceID] as sub_category
                                                                            devices_names.forEach(de => {
                                                                                let _de = {
                                                                                    id: de.ID,
                                                                                    is_old_data : true,
                                                                                    name: de.Name,
                                                                                    active : true
                                                                                }
                                                                                company_list.forEach(co => {
                                                                                    if (co.id == de.CompanyID) {
                                                                                        _de.company = co
                                                                                    }
                                                                                })
                                                                                sub_category_list.forEach(sc => {
                                                                                    if (sc.id == de.DeviceID) {
                                                                                        _de.category = {
                                                                                            id: sc.category.id,
                                                                                            name: sc.category.name,
                                                                                        }
                                                                                        _de.sub_category = {
                                                                                            id: sc.id,
                                                                                            name: sc.name,
                                                                                        }
                                                                                    }
                                                                                })


                                                                                $devices_names.add(_de, (err, doc) => {
                                                                                    if (!err) {
                                                                                        devices_name_list.push(doc)
                                                                                        console.log('devices_name added : ' + doc.id)
                                                                                        site.import_result['device_name_id'] = doc.id
                                                                                        let _cd = {active : true}
                                                                                        _cd.models = []
                                                                                        _cd.device = {
                                                                                            id: doc.id,
                                                                                            name: doc.name
                                                                                        }
                                                                                        if (doc.company) {
                                                                                            _cd.company = {
                                                                                                id: doc.company.id,
                                                                                                name: doc.company.name
                                                                                            }
                                                                                        }

                                                                                        if (doc.category) {
                                                                                            _cd.category = {
                                                                                                id: doc.category.id,
                                                                                                name: doc.category.name
                                                                                            }
                                                                                        }
                                                                                        if (doc.sub_category) {
                                                                                            _cd.sub_category = {
                                                                                                id: doc.sub_category.id,
                                                                                                name: doc.sub_category.name
                                                                                            }
                                                                                        }

                                                                                        models.forEach(mo => {
                                                                                            if (doc.id == mo.ProductID) {
                                                                                                let exists = false
                                                                                                _cd.models.forEach(m => {
                                                                                                    if (m.name == mo.Name) {
                                                                                                        exists = true
                                                                                                    }
                                                                                                })
                                                                                                if (!exists) {
                                                                                                    _cd.models.push({
                                                                                                        name: mo.Name,
                                                                                                        alt: mo.Name2
                                                                                                    })
                                                                                                }

                                                                                            }
                                                                                        })

                                                                                        $companies_devices.add(_cd)
                                                                                        console.log('company_device added : ' + doc.id)
                                                                                        site.import_result['company_device_id'] = doc.id

                                                                                    }
                                                                                })
                                                                            })

                                                                        }, 1000 * 5);

                                                                    }, 1000 * 5);

                                                                }, 1000 * 5);





                                                            })

                                                        })

                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })

                    })
                })

            })
        })

    })
}
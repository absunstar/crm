module.exports = function (site) {

    const $customers = site.connectCollection('customers')


    site.post('/api/import/customers', (req, res) => {

        let default_gov = {
            id: 1,
            name: 'منوفية'
        }

        setTimeout(() => {
            res.json({
                done: true
            })
        }, 1000 * 3);

        if (!site.security.isUserHasPermission(req, res, 'importCustomers')) {
            console.log('you not have importCustomers permission')
            site.import_result['error'] = 'you not have importCustomers permission'
            return
        }

        let sql = require("mssql");

        sql.connect(site.sql_config, function (err) {
            if (err) {
                console.log(err)
                site.import_result['error'] = err.message
                return
            }
            var request = new sql.Request();
            request.query('SELECT top(1000000) [ID],[Name],[Phone],[Mobile1],[Mobile2],[Mobile3],[Address],[CityID],[VillageID],[AreaID] FROM [MainDatabase].[dbo].[MainApp_Customers]', function (err, result) {
                if (err) {
                    console.log(err)
                    site.import_result['error'] = err.message
                    return
                }

                let customers = result.recordset
                sql.close()


                let $cities = site.connectCollection('cities')
                let $towns = site.connectCollection('towns')
                let $regions = site.connectCollection('regions')

                console.log('Customer Count ::' + customers.length)
                site.import_result['customers_count'] = customers.length
                if (customers && customers.length > 0) {


                        customers.forEach(c => {

                            let c2 = {
                                id: parseInt(c.ID),
                                is_old_data : true,
                                name: c.Name,
                                phones: [],
                                mobiles: [],
                                gov: default_gov,
                                city_id: parseInt(c.CityID),
                                town_id: parseInt(c.VillageID),
                                region_id: parseInt(c.AreaID),
                                black_list: false,
                                address: c.Address,
                                created_date : new Date()
                            }
                            if (c.Phone) {
                                c2.phones.push(c.Phone)
                            }
                            if (c.Mobile1) {
                                c2.mobiles.push(c.Mobile1)
                            }
                            if (c.Mobile2) {
                                c2.mobiles.push(c.Mobile2)
                            }
                            if (c.Mobile3) {
                                c2.mobiles.push(c.Mobile3)
                            }

                            $customers.add(c2, (err, doc) => {
                                if (!err) {
                                    console.log('customer added : ' + doc.id)
                                    site.import_result['customer_id'] = doc.id
                                    $cities.find({
                                        id: doc.city_id
                                    }, (err, doc2) => {
                                        if (!err && doc2) {
                                            doc.city = {
                                                id: doc2.id,
                                                name: doc2.name
                                            }
                                            $customers.update(doc)
                                        }

                                    })

                                    $regions.find({
                                        id: doc.region_id
                                    }, (err, doc2) => {
                                        if (!err && doc2) {
                                            doc.region = {
                                                id: doc2.id,
                                                name: doc2.name
                                            }
                                            $customers.update(doc)
                                        }

                                    })

                                    $towns.find({
                                        id: doc.town_id
                                    }, (err, doc2) => {
                                        if (!err && doc2) {
                                            doc.town = {
                                                id: doc2.id,
                                                name: doc2.name
                                            }
                                            $customers.update(doc)
                                        } else {
                                            console.log(err)
                                            site.import_result['error'] = err.message
                                        }

                                    })

                                }
                            })
                        })

                   
                } else {
                    console.log('no customers return ....')
                }
            })
        })
    })

    site.post('/api/drop/customers', (req, res) => {

        $customers.drop(() => {
            site.import_result['info'] = 'Droped Collection Customers'
            setTimeout(() => {
                res.json({
                    done: true
                })
            }, 1000 * 3);
        })
    })
}
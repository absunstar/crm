module.exports = function (site) {

    let default_gov = {
        id: 1,
        name: 'منوفية'
    }

    const $goves = site.connectCollection('goves')
    const $regions = site.connectCollection('regions')
    const $cities = site.connectCollection('cities')
    const $towns = site.connectCollection('towns')

    site.post('/api/import/locations', (req, res) => {

        setTimeout(() => {
            res.json({
                done: true
            })
        }, 1000 * 3);

        if (!site.security.isUserHasPermission(req, res, 'importLocations')) {
            console.log('you not have importLocations permission')
            site.import_result['error'] = 'you not have importLocations permission'
            return
        }



        let sql = require("mssql");

        sql.connect(site.sql_config, function (err) {
            if (err) {
                console.log(err)
                site.import_result['error'] = err.message
                sql.close()
                return
            }
            var request = new sql.Request();

            request.query('SELECT TOP (1000) [ID],[Name] FROM [MainDatabase].[dbo].[MainApp_Areas]', function (err, result) {

                if (err) {
                    console.log(err)
                    site.import_result['error'] = err.message
                    sql.close()
                    return
                }

                let regions = result.recordset


                request.query('SELECT TOP (1000) [ID],[Name] FROM [MainDatabase].[dbo].[MainApp_Cities]', function (err, result) {

                    if (err) {
                        console.log(err)
                        site.import_result['error'] = err.message
                        sql.close()
                        return
                    }

                    let cities = result.recordset
                    request.query('SELECT TOP (10000) [ID],[Name],[CityID],[AreaID] FROM [MainDatabase].[dbo].[MainApp_Villages]', function (err, result) {

                        if (err) {
                            console.log(err)
                            site.import_result['error'] = err.message
                            sql.close()
                            return
                        }

                        let towns = result.recordset

                        sql.close()

                        $goves.drop(() => {
                            $cities.drop(() => {
                                $towns.drop(() => {
                                    $regions.drop(() => {

                                        site.import_result['regions_count'] = regions.length
                                        site.import_result['cities_count'] = cities.length
                                        site.import_result['towns_count'] = towns.length

                                        console.log('Regions Count : ' + regions.length)
                                        console.log('Cities Count : ' + cities.length)
                                        console.log('Towns Count : ' + towns.length)

                                        $goves.add(default_gov, (err, _gov) => {
                                            regions.forEach(region => {
                                                $regions.add({
                                                    id: region.ID,
                                                    active: true,
                                                    is_old_data: true,
                                                    name: region.Name,
                                                    gov: default_gov
                                                }, () => {
                                                    console.log('region added : ' + region.ID)
                                                    site.import_result['region_id'] = region.ID
                                                })
                                            })
                                            cities.forEach(city => {
                                                $cities.add({
                                                    id: city.ID,
                                                    is_old_data: true,
                                                    active: true,
                                                    name: city.Name,
                                                    gov: default_gov
                                                }, () => {
                                                    console.log('city added : ' + city.ID)
                                                    site.import_result['city_id'] = city.ID
                                                })
                                            })

                                            setTimeout(() => {
                                                towns.forEach(town => {
                                                    let _town = {
                                                        id: town.ID,
                                                        is_old_data: true,
                                                        active: true,
                                                        name: town.Name,
                                                        gov: default_gov
                                                    }
                                                    regions.forEach(region => {
                                                        if (region.ID == town.AreaID) {
                                                            _town.region = {
                                                                id: region.ID,
                                                                name: region.Name
                                                            }
                                                        }
                                                    })
                                                    cities.forEach(city => {
                                                        if (city.ID == town.CityID) {
                                                            _town.city = {
                                                                id: city.ID,
                                                                name: city.Name
                                                            }
                                                        }
                                                    })
                                                    $towns.add(_town, () => {
                                                        console.log('town added : ' + town.ID)
                                                        site.import_result['town_id'] = town.ID
                                                    })
                                                })
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
}
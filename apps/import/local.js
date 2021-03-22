module.exports = function(site){
    
    let collections_arr = ['customers', 'goves', 'cities', 'towns', 'regions', 'companies', 'employees', 'jobs', 'maritals_status', 'militaries_status', 'companies_devices', 'companies_categories', 'categories', 'sub_categories', 'devices_names']


    site.onGET('ImportData/:name', (req, res) => {

        res.json({
            done: true
        })

        let dir = site.dir + '/../db/' + req.params.name

        site.log('Importing Data ...')

        collections_arr.forEach(c => {
            let $c = site.connectCollection(c)
            $c.import(dir + '/' + c + '.json', (errs, docs) => {
                if (errs.length > 0) {
                    console.log(errs)
                } else {
                    console.log('Imported ' + c)
                }
            })
        })

    })

    site.onGET('ExportData', (req, res) => {

        res.json({
            done: true
        })

        let dir = site.dir + '/../db/' + site.toDateX(new Date())
        site.makeDir(dir, () => {

            site.log('Exporting Data ...')

            collections_arr.forEach(c => {
                let $c = site.connectCollection(c)
                $c.export({
                    limit: 1000000
                }, dir + '/' + c + '.json', (response) => {
                    if (response.err) {
                        console.log(response.err)
                    } else {
                        console.log('Exported ' + c)
                    }
                })
            })
        })
    })  
}
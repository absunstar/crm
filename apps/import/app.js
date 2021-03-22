module.exports = function (site) {
    
    site.import_result = {}

    site.onPOST('/api/import/result' , (req , res)=>{
        site.import_result['time'] = new Date()
        res.json(site.import_result)
    })

    site.onPOST('/api/import/result/reset' , (req , res)=>{
        site.import_result = {}
        res.json(site.import_result)
    })

    site.onGET({name : 'import' , path : __dirname + '/site_files/html/index.html' , parser:'html css js'})

    site.sql_config = {
        user: 'amr',
        password: 'P@$$w0rd',
        server: '192.168.1.250',
        database: 'MainDatabase',
        encrypt : false,
        pool: {
            max: 100,
            min: 0,
            idleTimeoutMillis: 1000 * 60 * 5
        }
    }


    site.sql_config0 = {
        user: 'sa',
        password: 'P@$$w0rd',
        server: '127.0.0.1',
        database: 'MainDatabase',
        encrypt : false
    }

    require(__dirname + '/local.js')(site)
    require(__dirname + '/core.js')(site)
    require(__dirname + '/customers.js')(site)
    require(__dirname + '/locations.js')(site)
    require(__dirname + '/devices.js')(site)
    require(__dirname + '/employees.js')(site)
    require(__dirname + '/tickets.js')(site)
  

}
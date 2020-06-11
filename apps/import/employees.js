module.exports = function (site) {


    site.post('/api/import/employees', (req, res) => {

        setTimeout(() => {
            res.json({
                done: true
            })
        }, 1000 * 3);

        if(!site.security.isUserHasPermission(req, res , 'importEmployees')){
            console.log('you not have importEmployees permission')
            site.import_result['error'] = 'you not have importEmployees permission'
            return
        }

        const $employees = site.connectCollection("employees")

        let sql = require("mssql");

        sql.connect(site.sql_config, function (err) {

            if (err) {
                console.log(err)
                site.import_result['error'] = err.message
                sql.close()
                return
            }

            var request = new sql.Request();

            request.query('SELECT TOP (1000) [ID],[Name] FROM [MainDatabase].[dbo].[MainApp_Technicians]', function (err, result) {

                if (err) {
                    console.log(err)
                    site.import_result['error'] = err.message
                    sql.close()
                    return
                }

                let employees = result.recordset
                site.import_result['employees_count'] = employees.length
                $employees.drop(() => {
                    employees.forEach(employee => {
                        $employees.add({
                            id: employee.ID,
                            is_old_data : true,
                            name: employee.Name,
                            active : true
                        }, () => {
                            console.log('employee added : ' + employee.ID)
                            site.import_result['employee_id'] = employee.ID
                        })
                    })
                })
                sql.close()
            })
        })
    })

}
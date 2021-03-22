module.exports = function (site) {

    $departments = site.connectCollection('departments')
    $jobs = site.connectCollection('jobs')
    $employees_degrees = site.connectCollection('employees_degrees')
    $militaries_status = site.connectCollection('militaries_status')
    $maritals_status = site.connectCollection('maritals_status')
    $tickets_slides = site.connectCollection('tickets_slides')


    // setInterval(()=>{
    //     $departments.export({} , __dirname + '/db/departments.json')
    //     $jobs.export({} , __dirname + '/db/jobs.json')
    //     $employees_degrees.export({} , __dirname + '/db/employees_degrees.json')
    //     $militaries_status.export({} , __dirname + '/db/militaries_status.json')
    //     $maritals_status.export({} , __dirname + '/db/maritals_status.json')
    //     $tickets_slides.export({} , __dirname + '/db/tickets_slides.json')
    // } , 1000 * 10)

    site.onPOST('/api/import/core', (req, res) => {

        setTimeout(() => {
            res.json({
                done: true
            })
        }, 1000 * 3);
        

        if(!site.security.isUserHasPermission(req, res , 'importCore')){
            console.log('you not have importCore permission')
            site.import_result['error'] = 'you not have importCore permission'
            return
        }


        $departments.import(__dirname + '/db/departments.json')
        $jobs.import(__dirname + '/db/jobs.json')
        $employees_degrees.import(__dirname + '/db/employees_degrees.json')
        $militaries_status.import(__dirname + '/db/militaries_status.json')
        $maritals_status.import(__dirname + '/db/maritals_status.json')
        $tickets_slides.import(__dirname + '/db/tickets_slides.json')

        site.import_result['import_core'] = 'departments , jobs , employees_degrees , militaries_status , maritals_status , tickets_slides'

    })

    site.onGET('exportCore' , (req , res)=>{


        if(!site.security.isUserHasPermission(req, res , 'exportCore')){
            console.log('you not have exportCore permission')
            site.import_result['error'] = 'you not have exportCore permission'
            return
        }

        res.json({
            done: true
        })

        $departments.export({limit : 1000} , __dirname + '/db/departments.json')
        $jobs.export({limit : 1000} , __dirname + '/db/jobs.json')
        $employees_degrees.export({limit : 1000} , __dirname + '/db/employees_degrees.json')
        $militaries_status.export({limit : 1000} , __dirname + '/db/militaries_status.json')
        $maritals_status.export({limit : 1000} , __dirname + '/db/maritals_status.json')
        $tickets_slides.export({limit : 1000} , __dirname + '/db/tickets_slides.json')
    })

}
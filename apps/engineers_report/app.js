module.exports = function init(site) {

  const $engineers_report = site.connectCollection("engineers_report")

  site.onGET({
    name: "engineers_report",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })

  site.onPOST("/api/engineers_report/add", (req, res) => {
    let response = {}
    response.done = false

    if (!req.session.user) {
      response.error = ' not login'
      res.json(response)
      return
    }
    let doc = req.body
    
    doc.$req = req
    doc.$res = res

    delete doc._id
    delete doc.id


    $engineers_report.add(doc, (err, doc2) => {
      if (!err) {
        let obj = {
          value: doc.total_salary || 0,
          safe :doc.safe,
          date:doc.dateTo,
          sourceName:doc.engineer.name,
        }

        let debtObj = {
          eng : doc.engineer,
          value :doc.total_debts
        }
        site.call('[engineers_report][employees_debt]' , debtObj)

          site.call('[engineers_report][safes]' , obj)
        response.done = true
        response.doc = doc2
       }else{
         response.error = err.message
       }
      res.json(response)
    })
  })


  site.onPOST("/api/engineers_report/all", (req, res) => {
    let response = {}
    response.done = false

    let where = req.body.where || {}
    
    $engineers_report.findMany({
      select: req.body.select || {},
      where: where,
      sort : {id : -1},
     
    }, (err, doc) => {
      if (!err) {
        response.done = true
        response.list = doc
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

}
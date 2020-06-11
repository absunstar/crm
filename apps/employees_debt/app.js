module.exports = function init(site) {


  const $employees_debt = site.connectCollection("employees_debt")

  site.on('[tickets][eng_debt]', function (obj) {
    $employees_debt.add({
      ticket_code: obj.ticket_code,
      date: obj.date,
      eng : obj.eng,
      value : obj.value,
      description : obj.description,
      number : obj.receet_number,
    })
  })

  site.on('[engineers_report][employees_debt]', function (debtObj) {
    $employees_debt.findOne({
      where: {
        'eng.id': debtObj.eng.id,
        value : debtObj.value
      }, } , (err,doc) =>{
        if(!err && doc){
          doc.done = true
          $employees_debt.update(doc)
        }
      })
  })


  site.get({
    name: "employees_debt",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })

  site.post("/api/employees_debt/add", (req, res) => {
    let response = {}
    response.done = false
    
    if (!req.session.user) {
      res.json(response)
      return
    }
   

    let doc = req.body
    doc.$req = req
    doc.$res = res
    doc._created = site.security.getUserFinger({$req : req , $res : res})

    doc.date = new Date(doc.date)
    $employees_debt.add(doc, (err, doc) => {
      if (!err) {
       
        response.done = true
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.post("/api/employees_debt/update", (req, res) => {
    let response = {}
    response.done = false
    
    if (!req.session.user) {
      res.json(response)
      return
    }
   
    let doc = req.body
    doc.date = new Date(doc.date)
    if (doc.id) {
      $employees_debt.edit({
        where: {
          id: doc.id
        },
        set: doc,
        $req: req,
        $res: res
      }, err => {
        if (!err) {
          response.done = true
        } else {
          response.error = err.message
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })





  site.post("/api/employees_debt/approved", (req, res) => {

    let response = {}
    response.done = false
    
    if (!req.session.user) {
      res.json(response)
      return
    }
   
    let doc = req.body
    doc.date = new Date(doc.date)

    if (doc.id) {
      $employees_debt.edit({
        where: {
          id: doc.id
        },
        set: doc,
        $req: req,
        $res: res
      }, err => {
        if (!err) {
            site.call('[eng_debt][safes][+]' , {
              value: doc.value,
              safe :doc.safe,
              sourceName:doc.eng.name,
              date:doc.date,
              description : doc.description
            
            })
          

          response.done = true
        } else {
          response.error = err.message
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })





  site.post("/api/employees_debt/delete", (req, res) => {
    let response = {}
    response.done = false
  
    if (!req.session.user) {
      res.json(response)
      return
    }

    let id = req.body.id
    if (id) {
      $employees_debt.delete({
        id: id,
        $req: req,
        $res: res
      }, (err, result) => {
        if (!err) {
        
          response.done = true
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.post("/api/employees_debt/view", (req, res) => {
    let response = {}
    response.done = false
    $employees_debt.find({
      where: {
        id: req.body.id
      }
    }, (err, doc) => {
      if (!err) {
        response.done = true
        response.doc = doc
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.post("/api/employees_debt/all", (req, res) => {
    let response = {}
    response.done = false
 
    if (!req.session.user) {
      res.json(response)
      return
    }

    let where = req.body.where || {}
    
    
    if (where.date) {
      let d1 = site.toDate(where.date)
      let d2 = site.toDate(where.date)
      d2.setDate(d2.getDate() + 1)
      where.date = {
        '$gte': d1,
        '$lt': d2
      }
    }

    if (where  && where.from_date) {
      let d1 = site.toDate(where.from_date)
      let d2 = site.toDate(where.to_date)
      d2.setDate(d2.getDate() + 1);
      where.date = {
        '$gte': d1,
        '$lt': d2
      }
      delete where.from_date
      delete where.to_date
    }



    
    if (where.search && where.search.date) {
      let d1 = site.toDate(where.search.date)
      let d2 = site.toDate(where.search.date)
      d2.setDate(d2.getDate() + 1)
      where.date = {
        '$gte': d1,
        '$lt': d2
      }
    }

    if (where && where.search && where.search.from_date) {
      let d1 = site.toDate(where.search.from_date)
      let d2 = site.toDate(where.search.to_date)
      d2.setDate(d2.getDate() + 1);
      where.date = {
        '$gte': d1,
        '$lt': d2
      }
    }


    if (where.search && where.search.eng) {
    
      where['eng.id'] = where.search.eng.id
    }
     
    if(where['description']) {
      where['description'] = new RegExp(where['description'] , 'i')
    }

    if(where['ticket_code']) {
      where['ticket_code'] = new RegExp(where['ticket_code'] , 'i')
    }

    if(where['number']) {
      where['number'] = new RegExp(where['number'] , 'i')
    }


    if (where.search && where.search.value) {
    
      where['value'] = where.search.value
    }
    
    delete where.search


    $employees_debt.findMany({
      select: req.body.select || {},
      where: where,
      limit: req.body.limit,

      sort : {id : -1},

    }, (err, docs) => {
      if (!err) {
        response.done = true
        response.list = docs
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

 
}
module.exports = function init(site) {



  const $employees_advances = site.connectCollection("employees_advances")

  site.on('[employees_advances_fin][employees_advances][-]', function (obj) {

    $employees_advances.find({
      'eng.id': obj.eng.id
    }, (err, doc) => {
      if (!err && doc) {
        doc.value = doc.value || 0
        doc.value = parseFloat(doc.value) - parseFloat(obj.value)
        $employees_advances.update(doc)
          }
        })
      })

  
  site.onGET({
    name: "employees_advances",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })


  site.onPOST("/api/employees_advances/add", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let employees_advances_doc = req.body
    employees_advances_doc.$req = req
    employees_advances_doc.$res = res
    employees_advances_doc._created = site.security.getUserFinger({$req : req , $res : res})

    employees_advances_doc.date = new Date(employees_advances_doc.date)
    $employees_advances.add(employees_advances_doc, (err, doc) => {
      if (!err && doc) {
      
      

          let Obj = {
            value: doc.value,
            safe :doc.safe,
            date:doc.date,
            sourceName:doc.eng.name,
            description:doc.description
          }
          if( Obj.value && Obj.safe && Obj.date && Obj.sourceName ){
            site.call('[employees_advances][safes][+]' , Obj)
          }
         
          site.call('[employees_advances][employees_advances_fin][+]' , doc)


        response.done = true
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.onPOST("/api/employees_advances/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let employees_advances_doc = req.body
    employees_advances_doc.date = new Date(employees_advances_doc.date)
    if (employees_advances_doc._id) {
      $employees_advances.edit({
        where: {
          _id: employees_advances_doc._id
        },
        set: employees_advances_doc,
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

  site.onPOST("/api/employees_advances/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id
    if (_id) {
      $employees_advances.delete({
        _id: $employees_advances.ObjectID(_id),
        $req: req,
        $res: res
      }, (err, result) => {
        if (!err && result.ok) {

          let Obj = {
            value: result.doc.value,
            safe :result.doc.safe,
            date:result.doc.date,
            sourceName:result.doc.eng.name,
            description:doc.description

          }
          if( Obj.value && Obj.safe && Obj.date && Obj.sourceName ){
            site.call('[employees_advances][safes][-]' , Obj)
          }

          response.done = true
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.onPOST("/api/employees_advances/view", (req, res) => {
    let response = {}
    response.done = false
    $employees_advances.findOne({
      where: {
        _id: site.mongodb.ObjectID(req.body._id)
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

  site.onPOST("/api/employees_advances/all", (req, res) => {
    let response = {}
    response.done = false

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


    if (where.search && where.search.value) {
    
      where['value'] = where.search.value
    }
    
    delete where.search


    $employees_advances.findMany({
      select: req.body.select || {},
      where: where,
      sort : {id : -1},
      limit: req.body.limit,

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

  site.onPOST("/api/employees_advances/upload/image", (req, res) => {
    let response = {
      done: true
    }
    let file = req.files.fileToUpload
    let newName = "employees_advances_doc_" + new Date().getTime() + ".png"
    let newpath = site.dir + "/../../uploads/erp/employees_advances/images/" + newName
    site.mv(file.path, newpath, function (err) {
      if (err) {
        response.error = err
        response.done = false
      }
      response.image_url = "/employees_advances/image/" + newName
      res.json(response)
    })
  })
  site.onGET("/employees_advances/image/:name", (req, res) => {
    res.download(site.dir + "/../../uploads/erp/employees_advances/images/" + req.params.name)
  })
}
module.exports = function init(site) {


  const $employees_insurances = site.connectCollection("employees_insurances")
  
  site.words.addList(__dirname + '/site_files/json/words.json')

  site.onGET({
    name: "employees_insurances",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true
  })


  site.onPOST("/api/employees_insurances/add", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let employees_insurances_doc = req.body
    employees_insurances_doc.$req = req
    employees_insurances_doc.$res = res
    employees_insurances_doc._created = site.security.getUserFinger({$req : req , $res : res})

    $employees_insurances.add(employees_insurances_doc, (err, _id) => {
      if (!err) {
        response.done = true
      }
      res.json(response)
    })
  })

  site.onPOST("/api/employees_insurances/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let employees_insurances_doc = req.body
    employees_insurances_doc._updated = site.security.getUserFinger({$req : req , $res : res})

    if (employees_insurances_doc._id) {
      $employees_insurances.edit({
        where: {
          _id: employees_insurances_doc._id
        },
        set: employees_insurances_doc,
        $req: req,
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

  site.onPOST("/api/employees_insurances/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id


    if (_id) {
      $employees_insurances.delete({ _id: $employees_insurances.ObjectID(_id), $req: req, $res: res }, (err, result) => {
        if (!err) {
          response.done = true
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.onPOST("/api/employees_insurances/view", (req, res) => {
    let response = {}
    response.done = false
    $employees_insurances.findOne({
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

  site.onPOST("/api/employees_insurances/all", (req, res) => {

    let response = {}
    response.done = false
    let where = req.body.where || {}

   
 
    if(where['description']) {
      where['description'] = new RegExp(where['description'] , 'i')
    }
    
    $employees_insurances.findMany({
      select: req.body.select || {},
      where: req.body.where,
      limit: req.body.limit,
      sort : {id : -1}
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

  site.onPOST("/api/employees_insurances/upload/image", (req, res) => {
    let response = {
      done: true
    }
    let file = req.files.fileToUpload
    let newName = "employees_insurances_doc_" + new Date().getTime() + ".png"
    let newpath = site.dir + "/../../uploads/crm/employees_insurances/images/" + newName
    site.mv(file.path, newpath, function (err) {
      if (err) {
        response.error = err
        response.done = false
      }
      response.image_url = "/employees_insurances/image/" + newName
      res.json(response)
    })
  })
  site.onGET("/employees_insurances/image/:name", (req, res) => {
    res.download(site.dir + "/../../uploads/crm/employees_insurances/images/" + req.params.name)
  })
}
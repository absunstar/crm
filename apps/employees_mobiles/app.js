module.exports = function init(site) {


  const $employees_mobiles = site.connectCollection("employees_mobiles")
  site.words.addList(__dirname + '/site_files/json/words.json')


  site.get({
    name: "employees_mobiles",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true
  })


  site.post("/api/employees_mobiles/add", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let employees_mobiles_doc = req.body
    employees_mobiles_doc.$req = req
    employees_mobiles_doc.$res = res
    employees_mobiles_doc._created = site.security.getUserFinger({$req : req , $res : res})

    $employees_mobiles.add(employees_mobiles_doc, (err, _id) => {
      if (!err) {
        response.done = true
      }
      res.json(response)
    })
  })

  site.post("/api/employees_mobiles/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let employees_mobiles_doc = req.body
    employees_mobiles_doc._updated = site.security.getUserFinger({$req : req , $res : res})

    if (employees_mobiles_doc._id) {
      $employees_mobiles.edit({
        where: {
          _id: employees_mobiles_doc._id
        },
        set: employees_mobiles_doc,
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

  site.post("/api/employees_mobiles/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id
    if (_id) {
      $employees_mobiles.delete({ _id: $employees_mobiles.ObjectID(_id), $req: req, $res: res }, (err, result) => {
        if (!err) {
          response.done = true
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.post("/api/employees_mobiles/view", (req, res) => {
    let response = {}
    response.done = false
    $employees_mobiles.findOne({
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

  site.post("/api/employees_mobiles/all", (req, res) => {
    let response = {}
    response.done = false
    let where = req.body.where || {}

    if(where['notes']) {
      where['notes'] = new RegExp(where['notes'] , 'i')
    }
    delete where.search

    $employees_mobiles.findMany({
      select: req.body.select || {},
      where: where,
      limit: req.body.limit,
      sort: { id: -1 }
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

  site.post("/api/employees_mobiles/upload/image", (req, res) => {
    let response = {
      done: true
    }
    let file = req.files.fileToUpload
    let newName = "employees_mobiles_doc_" + new Date().getTime() + ".png"
    let newpath = site.dir + "/../../uploads/crm/employees_mobiles/images/" + newName
    site.mv(file.path, newpath, function (err) {
      if (err) {
        response.error = err
        response.done = false
      }
      response.image_url = "/employees_mobiles/image/" + newName
      res.json(response)
    })
  })
  site.get("/employees_mobiles/image/:name", (req, res) => {
    res.download(site.dir + "/../../uploads/crm/employees_mobiles/images/" + req.params.name)
  })
}
module.exports = function init(site) {

  const $unemployees = site.connectCollection("unemployees")
  site.words.addList(__dirname + '/site_files/json/words.json')

  $unemployees.deleteDuplicate({
    name: 1,
  
    nid: 1
  }, (err, result) => {
    $unemployees.createUnique({
      name: 1,
     
      nid: 1
    }, (err, result) => {

    })
  })

  
  $unemployees.deleteDuplicate({
    name: 1
  }, (err, result) => {
    $unemployees.createUnique({
      name: 1
    }, (err, result) => {

    })
  })


  
  

  site.get({
    name: "unemployees",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true
  })


  site.post("/api/unemployees/add", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let unemployees_doc = req.body
    unemployees_doc.$req = req
    unemployees_doc.$res = res
    unemployees_doc._created = site.security.getUserFinger({$req : req , $res : res})

    $unemployees.add(unemployees_doc, (err, _id) => {
      if (!err) {
        response.done = true
      }
      res.json(response)
    })
  })

  site.post("/api/unemployees/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let unemployees_doc = req.body
    unemployees_doc._updated = site.security.getUserFinger({$req : req , $res : res})

    if (unemployees_doc._id) {
      $unemployees.edit({
        where: {
          _id: unemployees_doc._id
        },
        set: unemployees_doc,
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

  site.post("/api/unemployees/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id
    if (_id) {
      $unemployees.delete({ _id: $unemployees.ObjectID(_id), $req: req, $res: res }, (err, result) => {
        if (!err) {
          response.done = true
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.post("/api/unemployees/view", (req, res) => {
    let response = {}
    response.done = false
    $unemployees.findOne({
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

  site.post("/api/unemployees/all", (req, res) => {
    let response = {}
    response.done = false
    $unemployees.findMany({
      select: req.body.select || {},
      where: req.body.where,
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

  site.post("/api/unemployees/upload/image", (req, res) => {
    let response = {
      done: true
    }
    let file = req.files.fileToUpload
    let newName = "unemployees_doc_" + new Date().getTime() + ".png"
    let newpath = site.dir + "/../../uploads/crm/unemployees/images/" + newName
    site.mv(file.path, newpath, function (err) {
      if (err) {
        response.error = err
        response.done = false
      }
      response.image_url = "/unemployees/image/" + newName
      res.json(response)
    })
  })
  site.get("/unemployees/image/:name", (req, res) => {
    res.download(site.dir + "/../../uploads/crm/unemployees/images/" + req.params.name)
  })
}
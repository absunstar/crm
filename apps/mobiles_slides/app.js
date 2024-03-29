module.exports = function init(site) {



  const $mobiles_slides = site.connectCollection("mobiles_slides")
  site.words.addList(__dirname + '/site_files/json/words.json')

 


  site.onGET({
    name: "mobiles_slides",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true
  })


  site.onPOST("/api/mobiles_slides/add", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let mobiles_slides_doc = req.body
    mobiles_slides_doc.$req = req
    mobiles_slides_doc.$res = res
    mobiles_slides_doc._created = site.security.getUserFinger({$req : req , $res : res})

    $mobiles_slides.add(mobiles_slides_doc, (err, _id) => {
      if (!err) {
        response.done = true
      }
      res.json(response)
    })
  })

  site.onPOST("/api/mobiles_slides/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let mobiles_slides_doc = req.body
    mobiles_slides_doc._updated = site.security.getUserFinger({$req : req , $res : res})

    if (mobiles_slides_doc._id) {
      $mobiles_slides.edit({
        where: {
          _id: mobiles_slides_doc._id
        },
        set: mobiles_slides_doc,
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

  site.onPOST("/api/mobiles_slides/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id
    if (_id) {
      $mobiles_slides.delete({ _id: $mobiles_slides.ObjectID(_id), $req: req, $res: res }, (err, result) => {
        if (!err) {
          response.done = true
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.onPOST("/api/mobiles_slides/view", (req, res) => {
    let response = {}
    response.done = false
    $mobiles_slides.findOne({
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

  site.onPOST("/api/mobiles_slides/all", (req, res) => {
    let response = {}
    response.done = false
    let where = req.body.where || {}

    if(where['description']) {
      where['description'] = new RegExp(where['description'] , 'i')
    }

    if(where['slide_name']) {
      where['slide_name'] = new RegExp(where['slide_name'] , 'i')
    }

    if(where['number']) {
      where['number'] = new RegExp(where['number'] , 'i')
    }
    
    $mobiles_slides.findMany({
      select: req.body.select || {},
      where: req.body.where,
      limit : req.body.limit,
      sort:{id:-1}
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



  site.onPOST("/api/mobiles_slides/upload/image", (req, res) => {
    let response = {
      done: true
    }
    let file = req.files.fileToUpload
    let newName = "mobiles_slides_doc_" + new Date().getTime() + ".png"
    let newpath = site.dir + "/../../uploads/crm/mobiles_slides/images/" + newName
    site.mv(file.path, newpath, function (err) {
      if (err) {
        response.error = err
        response.done = false
      }
      response.image_url = "/mobiles_slides/image/" + newName
      res.json(response)
    })
  })
  site.onGET("/mobiles_slides/image/:name", (req, res) => {
    res.download(site.dir + "/../../uploads/crm/mobiles_slides/images/" + req.params.name)
  })
}
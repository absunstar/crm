module.exports = function init(site) {

 

  const $stores = site.connectCollection("stores")
  site.words.addList(__dirname + '/site_files/json/words.json')

  site.require(__dirname + "/libs/monitor")
  
  site.on('new section added', sections_doc => {
    $stores.add({ name: sections_doc.name, image_url: '/images/store.png' }, (err, _id) => {
        console.log(err)
    })
  })


  $stores.deleteDuplicate({
    name: 1
  }, (err, result) => {
    $stores.createUnique({
      name: 1
    }, (err, result) => {

    })
  })



  
  site.onGET({
    name: "stores",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true
  })


  site.onPOST({
    name: '/api/stores/types/all',
    path: __dirname + '/site_files/json/types.json'
  })

  site.onPOST("/api/stores/add", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let stores_doc = req.body
    stores_doc.$req = req
    stores_doc.$res = res
    stores_doc._created = site.security.getUserFinger({$req : req , $res : res})



    $stores.add(stores_doc, (err, _id) => {
      if (!err) {
        response.done = true
      }else{
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.onPOST("/api/stores/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let stores_doc = req.body
    stores_doc._updated = site.security.getUserFinger({$req : req , $res : res})

    if (stores_doc._id) {
      $stores.edit({
        where: {
          _id: stores_doc._id
        },
        set: stores_doc,
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

  site.onPOST("/api/stores/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id


    if (_id) {
      $stores.delete({ _id: $stores.ObjectID(_id), $req: req, $res: res }, (err, result) => {
        if (!err) {
          response.done = true
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.onPOST("/api/stores/view", (req, res) => {
    let response = {}
    response.done = false
    $stores.findOne({
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

  site.onPOST("/api/stores/all", (req, res) => {
    let response = {}
    let where = req.body.where

    if( where && where.name){
      where['name'] = new RegExp( where['name'],'i');
    }

    if(  where && where.type){
      where['type.ar'] = new RegExp( where['type.ar'],'i');
    }

    if( where && where.note){
      where['note'] = new RegExp( where['note'],'i');
    }
    response.done = false
    $stores.findMany({
      select: req.body.select || {},
      limit: req.body.limit,
      where: req.body.where
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
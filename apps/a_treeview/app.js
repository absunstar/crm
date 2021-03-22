module.exports = function init(site) {

  const $treeview = site.connectCollection("treeview")

  site.onGET({
    name: "treeview",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })


  site.onPOST("/api/treeview/add", (req, res) => {
    let response = {}
    response.done = false
 
    if (!req.session.user) {
      response.error = 'you are not login'
      res.json(response)
      return
    }

    let doc = req.body
    doc.$req = req
    doc.$res = res

    $treeview.add(doc, (err, id) => {
      if (!err) {
        response.done = true
      }
      res.json(response)
    })
  })

  site.onPOST("/api/treeview/update", (req, res) => {
    let response = {}
    response.done = false

    if (!req.session.user) {
      response.error = 'you are not login'
      res.json(response)
      return
    }

    let doc = req.body

    if (doc.id) {
      $treeview.edit({
        where: {
          id: doc.id
        },
        set: doc,
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

  site.onPOST("/api/treeview/delete", (req, res) => {
    let response = {}
    response.done = false

    if (!req.session.user) {
      response.error = 'you are not login'
      res.json(response)
      return
    }

    let id = req.body.id
    if (id) {
      $treeview.delete({
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

  site.onPOST("/api/treeview/view", (req, res) => {
    let response = {}
    response.done = false
    $treeview.find({
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

  site.onPOST("/api/treeview/all", (req, res) => {
    let response = {}
    response.done = false
   
    if (!req.session.user) {
      response.error = 'you are not login'
      res.json(response)
      return
    }

    let where = req.data.where || {}
    
    if (where['name']) {
      where['name'] = new RegExp(where['name'], 'i')
    }

    if (where['notes']) {
      where['notes'] = new RegExp(where['notes'], 'i')
    }
    
    $treeview.findMany({
      select: req.body.select || {},
      where: req.body.where,
      sort : {id:-1}

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
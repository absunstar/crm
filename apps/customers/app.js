module.exports = function init(site) {


  const $customers = site.connectCollection('customers')
  
  // $customers.deleteDuplicate({name: 1}, (err, result) => {
  //   $customers.createUnique({name: 1}, (err, result) => {

  //   })
  // })

  site.on('new ticket added', ticket => {
    $customers.find({
      where: { _id: ticket.customer._id },
      select: { devices: 1 }
    }, (err, doc) => {
      if(doc.devices === undefined){
        doc.devices = []
      }
      if(doc.devices.length === 0){
        doc.devices.push(ticket.device_info)
      }else{
        for (let i = 0; i < doc.devices.length; i++) {
          if(doc.devices[i].device && doc.devices[i].device.id === ticket.device_info.device.id && doc.devices[i].model.name === ticket.device_info.model.name){
            return
          }
        }
        doc.devices.push(ticket.device_info)
      }
      $customers.update(doc , (err , result)=>{
       
      })
    })
  })

  site.get({
    name: "customers",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })


  site.post("/api/customers/add", (req, res) => {
    let response = {}
    response.done = false

    if (req.session.user === undefined) {
      res.json(response)
      return
    }

    let customers_doc = req.body
    customers_doc.$req = req
    customers_doc.$res = res
    customers_doc._created = site.security.getUserFinger({$req : req , $res : res})

    $customers.add(customers_doc, (err, doc) => {
      if (!err) {
        response.done = true
        response.doc = doc
      }
      res.json(response)
    })

  })

  site.post("/api/customers/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let customers_doc = req.body
    customers_doc._updated = site.security.getUserFinger({$req : req , $res : res})

    if (customers_doc._id) {
      $customers.edit({
        where: {
          _id: customers_doc._id
        },
        set: customers_doc,
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

  site.post("/api/customers/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id
    if (_id) {
      $customers.delete({
        _id: _id,
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

  // site.post("/api/customers/viewphone", (req, res) => {
  //   let response = {}
  //   response.docs = []
  //   response.done = false

  //     let phones = req.body.phones
  //     phones.forEach(ph => {
  //       $customers.findOne({
  //         where: {
  //           phones: ph
  //         }
  //       }, (err, doc) => {
  //         if (!err && doc) {
  //           response.done = true
  //           response.docs.push(doc)
  //         } 
          
  //       })
  //     });
      
  //   setTimeout(() => {
  //     res.json(response)
  //   }, 100);
    
 
  // })
  site.post("/api/customers/viewmobile", (req, res) => {
    let response = {}
    response.docs = []
    response.done = false

      let mobiles = req.body.mobiles
      mobiles.forEach(ph => {
        $customers.findOne({
          where: {
            mobiles: ph
          }
        }, (err, doc) => {
          if (!err && doc) {
            response.done = true
            response.docs.push(doc)
          } 
        })
      });
      
    setTimeout(() => {
      res.json(response)
    }, 1000);
    
 
  })


  site.post("/api/customers/view", (req, res) => {
    let response = {}
    response.done = false
    $customers.findOne({
      where: {
        _id: site.mongodb.ObjectID(req.body._id)
      }
    }, (err, doc) => {
      if (!err && doc) {
        response.done = true
        response.doc = doc
      } 
      res.json(response)
    })
  })

  site.post("/api/customers/all", (req, res) => {
    let response = {}
    response.done = false
    let where = req.body.where || {}

    if (req.body.search) {
      where = {
        $or: [{
          name: new RegExp(req.body.search, 'i')
        },
        {
          mobiles: new RegExp(req.body.search, 'i')
        },
        {
          phones: new RegExp(req.body.search, 'i')
        }
        ]
      }
    }

    if(where['name']) {
      where['name'] = new RegExp(where['name'] , 'i')
    }

    if(where['email']) {
      where['email'] = new RegExp(where['email'] , 'i')
    }

    if(where['phones']) {
      where['phones'] = new RegExp(where['phones'] , 'i')
    }

    if(where['mobiles']) {
      where['mobiles'] = new RegExp(where['mobiles'] , 'i')
    }


    if(where['address']) {
      where['address'] = new RegExp(where['address'] , 'i')
    }

    if(where['notes']) {
      where['notes'] = new RegExp(where['notes'] , 'i')
    }

    
    $customers.findMany({
      select: req.body.select || {},
      where: where,
      limit: req.body.limit,

      sort: { id: -1 }
    }, (err, docs , count) => {
      if (!err) {
        response.done = true
        response.list = docs
        response.count = count
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })


}
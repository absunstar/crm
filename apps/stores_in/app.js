module.exports = function init(site) {

  const $stores_in = site.connectCollection("stores_in")
  $stores_in.deleteDuplicate( {number : 1 } , (err , result)=>{
    $stores_in.createUnique({number : 1 } , (err , result)=>{
    })
  })

  $stores_in.busy1 = false;
  site.on('[categories_items][store_in]' , itm => {
    if($stores_in.busy1 == true){
      setTimeout(() => {
        site.call('[categories_items][store_in]' , Object.assign({},itm)  )
      }, 200);
      return
    }
    $stores_in.busy1 = true;
      let obj = {
        items : [],
        total : 0,
        image_url : '/images/store_in.png' ,
        store : itm.store,
        company : itm.company,
        date : new Date(itm.date),
        number : new Date().getTime().toString(),
        total_value : 0,
        net_value : 0 ,
        total_tax : 0 ,
        total_discount : 0,
        price: itm.price,
        cost:itm.cost,
      }
      obj.items.push(itm)

    $stores_in.add(obj,(err,doc)=>{
      if(!err){
        $stores_in.busy1 = false;
      }
    })

  })

  site.on('[stores_transfer][store_in][+]' , doc => {
    doc.items.forEach(itm => {
      let obj = {
        items:[],
        total : 0,
        image_url : '/images/store_in.png' ,
        store : doc.store_to,
        company : doc.company,
        safe : doc.safe,
        date : new Date(doc.date),
        number : new Date().getTime().toString(),
        supply_number : doc.number,
        total_value : 0,
        net_value : 0 ,
        total_tax : 0 ,
        total_discount : 0,
        price: itm.price,
        cost:itm.cost,
        current_status : 'transferred'
      }
      obj.items.push(itm)
      $stores_in.add(obj , (err,doc)=>{
        if(!err){     
          doc.items.forEach(itm => {
           
            delete itm.company
            delete itm.store
            itm.store =  doc.store
            itm.company =  doc.company
            itm.date = doc.date
            itm.transaction_type ='in'
            itm.supply_number = doc.supply_number
            itm.current_status =' '

            let nwitm = itm
            nwitm.current_status = 'transferred'
            let obj = {
             'itm.current_status' : 'transferred',
              name: itm.name,
              company : doc.company,
              store : doc.store,
              date : doc.date,
              item : nwitm,
            }

           
            site.call('[stores_transfer][categories_items]', obj)
            site.call('please track item', Object.assign({} ,itm ) )

           

     
            
          });


        }
      })
    });
    

 

})
  site.on('[eng_item_debt][stores_in][+]' , itm => {

    let sizes = [{
      name : itm.name,
      count : 1,
      total : 0,
      total_value : itm.price,
      net_value : itm.price ,
      size : itm.size,
      price :itm.price,
      name: itm.name}
    ]

    let obj = {
      date : itm.date,
      image_url : '/images/store_in.png' ,
      items : sizes,
      store : itm.store,
      company : itm.company,
      date : new Date(itm.date),
      number : new Date().getTime().toString(),
      total_value : 0,
      net_value : 0 ,
      total_tax : 0 ,
      total_discount : 0,
      count: itm.count
    }
 
    $stores_in.add(obj)

  })
  site.post({
    name: '/api/stores_in/types/all',
    path: __dirname + '/site_files/json/types.json'
  })

  site.get({
    name: "stores_in",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })
  site.post("/api/stores_in/add", (req, res) => {
    let response = {}
    response.done = false
    if (!req.session.user) {
      res.json(response)
      return;
    }

    let stores_in_doc = req.body
    stores_in_doc._created = site.security.getUserFinger({$req : req , $res : res})


    stores_in_doc.$req = req
    stores_in_doc.$res = res
   
    stores_in_doc.date = site.toDateTime(stores_in_doc.date)

    stores_in_doc.items.forEach(itm => {

      itm.current_count = site.toNumber(itm.current_count)
      itm.count = site.toNumber(itm.count)
      itm.cost = site.toNumber(itm.cost)
      itm.price = site.toNumber(itm.price)
      itm.total = site.toNumber(itm.total)

    })


    stores_in_doc.discount = site.toNumber(stores_in_doc.discount)
    stores_in_doc.octazion = site.toNumber(stores_in_doc.octazion)
    stores_in_doc.net_discount = site.toNumber(stores_in_doc.net_discount)
    stores_in_doc.total_value = site.toNumber(stores_in_doc.total_value)
    stores_in_doc.net_value = site.toNumber(stores_in_doc.net_value)

    $stores_in.add(stores_in_doc, (err, doc) => {

      
      if (!err) {
        doc.items.forEach(itm => {
         
          let obj = {
            name: itm.name,
            company : doc.company,
            store : doc.store,
            date : doc.date,
            item : itm
          }
         
          site.call('[stores_in][categories_items][+]' , obj)
          
        });

        response.done = true
        
        let Obj = {
          value: doc.net_value,
          safe :doc.safe,
          date:doc.date,
          number:doc.number,
          notes:doc.notes
        }
        if( Obj.value && Obj.safe && Obj.date && Obj.number ){
          site.call('[stores_in][safes][-]' , Obj)
        }

        site.call('please add to Company balance', {
          id: stores_in_doc.company.id,
          balance: stores_in_doc.net_value
        })
        
        stores_in_doc.items.forEach(itm => {  
          itm.number = stores_in_doc.number
          itm.company = stores_in_doc.company
          itm.date = stores_in_doc.date
          itm.transaction_type ='in'
          itm.current_status = 'storein'
          itm.store = stores_in_doc.store
          site.call('please track item', Object.assign({} ,itm ) )

        })
      }else{
        response.error = err.message
      }
      res.json(response)
    })
  })
  site.post("/api/stores_in/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let stores_in_doc = req.body
    stores_in_doc._updated = site.security.getUserFinger({$req : req , $res : res})

    stores_in_doc.company = site.fromJson(stores_in_doc.company)
    stores_in_doc.seasonName = stores_in_doc.seasonName
    stores_in_doc.type = site.fromJson(stores_in_doc.type)
    stores_in_doc.date = new Date(stores_in_doc.date)

    stores_in_doc.items.forEach(itm => {
      itm.count = site.toNumber(itm.count)
      itm.cost = site.toNumber(itm.cost)
      itm.price = site.toNumber(itm.price)
      itm.total = site.toNumber(itm.total)
    })

    stores_in_doc.discount = site.toNumber(stores_in_doc.discount)
    stores_in_doc.octazion = site.toNumber(stores_in_doc.octazion)
    stores_in_doc.net_discount = site.toNumber(stores_in_doc.net_discount)
    stores_in_doc.total_value = site.toNumber(stores_in_doc.total_value)

    if (stores_in_doc._id) {
      $stores_in.edit({
        where: {
          _id: stores_in_doc._id
        },
        set: stores_in_doc,
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
  site.post("/api/stores_in/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id
    if (_id) {
      $stores_in.delete({ _id: $stores_in.ObjectID(_id), $req: req, $res: res }, (err, result) => {
        if (!err) {
          response.done = true
          let Obj = {
            value: result.doc.net_value,
            safe : result.doc.safe,
            date: result.doc.date,
            number: result.doc.number,
            notes:result.doc.notes
          }
          if( Obj.value && Obj.safe && Obj.date && Obj.number ){
            site.call('[stores_in][safes][+]' , Obj)
          }
         
          result.doc.items.forEach(itm => {

            itm.number = result.doc.number
            itm.company = result.doc.company
            itm.date = result.doc.date
            itm.transaction_type ='out'
            itm.current_status = 'storeout'
            itm.store = result.doc.store

            let delObj = {
              name : itm.name,
              size:itm.size,
              store : result.doc.store,
              company : result.doc.company,
              item : itm

              
            }
          
            site.call('[stores_in][categories_items][-]' , delObj)
            site.call('please out item', Object.assign({date:new Date()}, itm))

           
          });
         

        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })
  site.post("/api/stores_in/view", (req, res) => {
    let response = {}
    response.done = false
    $stores_in.findOne({
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
  site.post("/api/stores_in/all", (req, res) => {
    let response = {}
    response.done = false
    let where = req.body.where


    if (where  &&  where['notes']) {
      where['notes'] = new RegExp(where['notes'], 'i')
    }
    if (where  &&  where['number']) {
      where['number'] = new RegExp(where['number'], 'i')
    }

    if (where  &&  where['supply_number']) {
      where['supply_number'] = new RegExp(where['supply_number'], 'i')
    }

    if (where  &&  where['items.ticket_code']) {
      where['items.ticket_code'] = new RegExp(where['items.ticket_code'], 'i')
    }

    if (where  && where.date) {
      let d1 = site.toDate(where.date)
      let d2 = site.toDate(where.date)
      d2.setDate(d2.getDate() + 1);
      where.date = {
        '$gte': d1,
        '$lt': d2
      }
    }

    if (where  && where.date_from) {
      let d1 = site.toDate(where.date_from)
      let d2 = site.toDate(where.date_to)
      d2.setDate(d2.getDate() + 1);
      where.date = {
        '$gte': d1,
        '$lt': d2
      }
      delete where.date_from
      delete where.date_to
    }
  
    $stores_in.findMany({
      select: req.body.select || {},
      limit : req.body.limit,
      where: where,
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
module.exports = function init(site) {

  var xl = require('excel4node');
  const $eng_item_debt = site.connectCollection("eng_item_debt")
  site.on('[tickets][eng_item_debt]', doc => {
    
        let obj = {}
        obj.date = doc.date
        obj.eng = doc.eng
        obj.name = doc.name
        obj.company = doc.company ||  {}
        obj.cost = site.toNumber(doc.cost)
        obj.count = 1
        obj.size = doc.size
        obj.price = site.toNumber(doc.price)
        obj.ticket_code = doc.ticket_code
        
        obj.status = 'waiting'
        
        $eng_item_debt.add(obj, (err, doc) => {

        }) 
  })
  site.get({
    name: "eng_item_debt",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })

  site.post("/api/export/excel", (req, res) => {

    let response = {}
    response.done = false

    if (req.session.user === undefined) {
      res.json(response)
      return
    }

 
    let data = req.body.data 
  
    if(data){
      let docs = data.data
      let header = data.header
     // site.exportToExcel(data.data , data.header)
      var wb = new xl.Workbook();
      var ws  = wb.addWorksheet('Sheet 1');
      var styleHeader = wb.createStyle({
          alignment: { 
            horizontal: 'center',
            vertical: 'center'
        },
          font: {
            bold:true,
            color: '#ffffff',
            size:14 ,
          },
          fill: { 
            type: 'pattern', 
            patternType: 'darkDown', 
            bgColor: '#000000' 
        },
          numberFormat: '#,##0.00; (#,##0.00);'
        });
      var styleContent = wb.createStyle({
        alignment: { 
        horizontal: 'center',
        vertical: 'center'
        },
        font: {
          color: '#0055cc',
          size: 14,
        },
        numberFormat: '0'
      });
    
        let headerRowCount = 1;
        let headerColCount = 1;
        header.forEach(h => {
          ws.cell(headerRowCount,headerColCount)
          .string(h)
          .style(styleHeader);
          headerColCount = headerColCount + 1
        });
  
  
        let i = 2;
        let j = 1;
        docs.forEach(itm => {
            if(itm && itm.eng.name){
              ws.cell(i, j)
              .string(itm.eng.name)
              .style(styleContent);
            }else{
              ws.cell(i, j)
              .string("No Name")
              .style(styleContent);
            }
             
  
              ws.cell(i, j+1)
              .string(itm.name)
              .style(styleContent);
  
              if(itm && itm.company && itm.company.name){
                ws.cell(i, j+2)
               .string(itm.company.name) 
               .style(styleContent) ||   
               ws.cell(i, j+2)
                .Object(itm.company.name)
               .style(styleContent);
  
               }else{
                ws.cell(i, j+2)
                .string(" No Company")
                .style(styleContent)
                .style({font: {color: '#ff0000'}})
               }
               if(!itm.store){
                ws.cell(i, j+3)
                .string('No Store')
                .style(styleContent)
                .style({font: {color: '#ff0000'}})
  
               }
               if(itm.store){
                ws.cell(i, j+3)
                .string(itm.store.name)
                .style(styleContent);
               }
               
              
  
              if(itm.deliver_status == true){
                ws.cell(i, j+4)
                .string('تم التسليم')
                .style(styleContent)
                .style({font: {color: '#00ff00'}})
              }
              if(itm.deliver_status == false){
                ws.cell(i, j+4)
                .string('لم يتم التسليم')
                
                .style(styleContent)
                .style({font: {color: '#ff0000'}})
              }
              if(itm.deliver_status == null){
                ws.cell(i, j+4)
       
                .string(  'عهدة مع الفنى  ')
                .style(styleContent)
        
              }
             
              var  c = itm.count;
              ws.cell(i, j+5)
                
                .number(1)
                .style(styleContent);
  
  
  
              i = i+1
        });


    
       // let newpathaa = site.dir + "/../../uploads/crm/employees_insurances/images/" + newName
       site.createDir(__dirname + "/../../../Excel/" , ()=>{

        wb.write(__dirname + '/../../../Excel/'  + 'name.xlsx');

      })
    
       
     
         
      response.done = true
      
      }else{
      response.done = false
      }   
    
     res.json(response)
     
  
  })


  site.get("/api/export/excel/download" , (req, res) => {
    let response = {}
    response.done = false

    if (req.session.user === undefined) {
      res.json(response)
      return
    }

    res.download(__dirname + '/../../../Excel/'  + '.xlsx')
    
  })
  
  site.post("/api/eng_item_debt/add", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
      return
    }

    let eng_item_debt_doc = req.body
    eng_item_debt_doc.$req = req
    eng_item_debt_doc.$res = res

    eng_item_debt_doc._created = site.security.getUserFinger({$req : req , $res : res})


    eng_item_debt_doc.date = site.toDateTime(eng_item_debt_doc.date)

    eng_item_debt_doc.items.forEach(itm => {
      itm.count = site.toNumber(itm.count)
      for (let i = 0; i < itm.count; i++) {
        let obj = {}
        obj.date = eng_item_debt_doc.date
        obj.eng = eng_item_debt_doc.eng
        obj.store = eng_item_debt_doc.store
        obj.company = eng_item_debt_doc.company
        obj.name = itm.name
        obj.code = itm.code
        obj.cost = site.toNumber(itm.cost)
        obj.count = 1
        obj.size = itm.size
        obj.price = site.toNumber(itm.price)
        obj.ticket_code = site.toNumber(eng_item_debt_doc.ticket_code)
        obj.deliver_status = eng_item_debt_doc.deliver_status


        obj.status = 'waiting'
        $eng_item_debt.add(obj, (err, doc) => {
          if (!err) {
            response.done = true

            doc.transaction_type = 'out'
            site.call('[eng_item_debt][categories_items][+]', Object.assign({}, doc))

            site.call('[eng_item_debt][item_transaction][+]', Object.assign({}, doc))
            //site.call('please track item', Object.assign({}, doc))
            // site.call('please out item [categories items]', Object.assign({}, doc))

          } else {
            response.error = err.message
          }

        })

      }

      setTimeout(() => {
        res.json(response)
      }, 1000);


    })

  })
  site.post("/api/eng_item_debt/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
      return
    }
    
    let eng_item_debt_doc = req.body
    eng_item_debt_doc.seasonName = eng_item_debt_doc.seasonName
    eng_item_debt_doc.type = site.fromJson(eng_item_debt_doc.type)
    eng_item_debt_doc.date = new Date(eng_item_debt_doc.date)
    
    
    eng_item_debt_doc.count = site.toNumber(eng_item_debt_doc.count)
    eng_item_debt_doc.cost = site.toNumber(eng_item_debt_doc.cost)
    eng_item_debt_doc.price = site.toNumber(eng_item_debt_doc.price)
    eng_item_debt_doc.total = site.toNumber(eng_item_debt_doc.total)
   

    eng_item_debt_doc.discount = site.toNumber(eng_item_debt_doc.discount)
    eng_item_debt_doc.octazion = site.toNumber(eng_item_debt_doc.octazion)
    eng_item_debt_doc.net_discount = site.toNumber(eng_item_debt_doc.net_discount)
    eng_item_debt_doc.total_value = site.toNumber(eng_item_debt_doc.total_value)
    eng_item_debt_doc.deliver_status = eng_item_debt_doc.deliver_status;


    if (eng_item_debt_doc._id) {
      $eng_item_debt.edit({
        where: {
          _id: eng_item_debt_doc._id
        },
        set: eng_item_debt_doc,
        $req: req,
        $res: res
      }, (err , result) => {
        if (!err) {
          response.done = true
          if(result.doc.deliver_status == true){
            let doc = result.doc;
            doc.current_status = 'damaged'
            site.call('[eng_item_debt][categories_items][+]' , doc )
            site.call('please track item' , doc )
            site.call('[eng_item_debt][stores_in][+]' , doc )        
          }
        } else {
          response.error = err.message
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })
  site.post("/api/eng_item_debt/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let id = req.body.id
    if (id) {
      $eng_item_debt.find({
        id: id
      }, (err, doc) => {
        if (!err && doc) {
          $eng_item_debt.delete({
            id: id,
            $req: req,
            $res: res
          }, (err, result) => {
            if (!err) {
              response.done = true
            }
            res.json(response)
          })
        }
      })

    } else {
      res.json(response)
    }
  })
  site.post("/api/eng_item_debt/view", (req, res) => {
    let response = {}
    response.done = false
    $eng_item_debt.findOne({
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
  site.post("/api/eng_item_debt/all", (req, res) => {
    let response = {}
    response.done = false
    let expo = false;
    let header = []

    let where = req.body.where ||  {}
  
   
   
    if (where && where.date_from && where.date_to) {
      let d1 = site.toDate(where.date_from)
      let d2 = site.toDate(where.date_to)
      d2.setDate(d1.getDate() + 1);
      where.date = {
        '$gte': d1,
        '$lt': d2
      }
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

    if (where && where['name']) {
      where['name'] = new RegExp(where['name'], 'i');
    }

    if (where && where['size']) {
      where['size'] = new RegExp(where['size'], 'i');
    }

    if (where && where['notes']) {
      where['notes'] = new RegExp(where['notes'], 'i');
    }

    if (where && where['ticket_code']) {
      where['ticket_code'] = new RegExp(where['ticket_code'], 'i');
    }


    if (where && where.date_from) {
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

    if(where && where['export']){
      expo = true;
     delete where.export
   }
   if(where && where.header){
     header = where.header;
   
    delete where.header
  }

    
    $eng_item_debt.findMany({
      select: req.body.select || {},
      limit: req.body.limit,
      where: where,
      sort: {
        id: -1
      },
      
    }, (err, docs, count) => {
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
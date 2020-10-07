module.exports = function init(site) {

  let collection_name = 'customers'

 let source = {
    name : 'Customers System' ,
    ar : 'نظام العملاء'
  }

  let image_url = '/images/customer.png'
  let add_message = {name : 'New customer Added' , ar : ' تم أضافة عميل جديد'}
  let update_message =  {name : ' Customer updated' , ar : 'تم تعديل بيانات عميل'}
  let delete_message =  {name : ' Customer deleted' , ar : 'تم حذف عميل '}


  site.on('mongodb after insert', function (result) {
      if (result.collection === collection_name) {
        site.call('please monitor action' , { obj : {
          icon: image_url,
          source: source,
          message: add_message ,
          value: { name : result.doc.name , ar : result.doc.name},
          add: result.doc,
          action: 'add'
        }, result : result })
      }
  })

  site.on('mongodb after update', function (result) {
      if (result.collection === collection_name) {
        site.call('please monitor action' , { obj : {
          icon: image_url,
          source : source,
          message: update_message ,
          value: {name : result.old_doc.name , ar : result.old_doc.name},
          update: site.objectDiff(result.update.$set, result.old_doc),
          action: 'update'
        }, result : result })
      }
  })


  site.on('mongodb after delete', function (result) {
      if (result.collection === collection_name) {
        site.call('please monitor action' , { obj : {
          icon: image_url,
          source: source ,
          message: delete_message ,
          value: {name : result.doc.name , ar : result.doc.name},
          delete: result.doc,
          action: 'delete'
        }, result : result })
      }
  })

}
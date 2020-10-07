module.exports = function init(site) {

  let collection_name = 'mobiles_slides'

 let source = {
    name : 'Accounting System' ,
    ar : 'نظام الحسابات'
  }

  let image_url = '/images/mobile_slides.png'
  let add_message = {name : 'New Mobile Added' , ar : ' تم أضافة شريحة موبايل جديد'}
  let update_message =  {name : 'Mobile updated' , ar : 'تم تعديل شريحة موبايل'}
  let delete_message =  {name : 'Mobile deleted' , ar : 'تم حذف شريحة موبايل '}


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
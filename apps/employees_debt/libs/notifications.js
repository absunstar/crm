module.exports = function init(site) {

  let collection_name = 'employees_debt'

 let source = {
    name : 'Accounting System' ,
    ar : 'نظام الحسابات'
  }

  let image_url = '/images/amount_in.png'
  let add_message = {name : 'New Dept Added' , ar : ' تم أضافة مديونية جديدة'}
  let update_message =  {name : ' Dept updated' , ar : 'تم تسليم مديونية '}
  let delete_message =  {name : ' Dept deleted' , ar : 'تم حذف المديونية '}


  site.on('mongodb after insert', function (result) {
      if (result.collection === collection_name) {
        site.call('please monitor action' , { obj : {
          icon: image_url,
          source: source,
          message: add_message ,
          value: { name : result.doc.value , ar : result.doc.value},
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
          value: {name : result.old_doc.value , ar : result.old_doc.value},
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
          value: {name : result.doc.value , ar : result.doc.value},
          delete: result.doc,
          action: 'delete'
        }, result : result })
      }
  })

}
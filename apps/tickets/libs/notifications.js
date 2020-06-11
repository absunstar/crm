module.exports = function init(site) {

  let collection_name = 'tickets'
  let source = {
    name: 'Customers System',
    ar: 'نظام البلاغات'
  }
  let image_url = '/images/ticket.png'
  let add_message = {
    name: 'New Ticket Added',
    ar: 'تم أضافة بلاغ جديد'
  }
  let update_message = {
    name: ' Ticket updated',
    ar: 'تم تعديل بلاغ'
  }
  let delete_message = {
    name: ' Ticket dleteted',
    ar: 'تم حذف بلاغ '
  }
  site.on('mongodb after insert', function (result) {
    if (result.collection === collection_name) {
      site.call('please monitor action', {
        obj: {
          icon: image_url,
          source: source,
          message: add_message,
          value: {
            name: result.doc.name ||  "تم اضافة بلاغ",
            ar: result.doc.name
          },
          add: result.doc,
          action: 'add'
        },
        result: result
      })
    }
  })
  site.on('mongodb after update', function (result) {
    if (result.collection === collection_name) {
      site.call('please monitor action', {
        obj: {
          icon: image_url,
          source: source,
          message: update_message,
          value: {
            name: result.old_doc.name,
            ar: result.old_doc.name
          },
          update: site.objectDiff(result.update.$set, result.old_doc),
          action: 'update'
        },
        result: result
      })
    }
  })
  site.on('mongodb after delete', function (result) {
    if (result.collection === collection_name) {
      site.call('please monitor action', {
        obj: {
          icon: image_url,
          source: source,
          message: delete_message,
          value: {
            name: result.doc.name,
            ar: result.doc.name
          },
          delete: result.doc,
          action: 'delete'
        },
        result: result
      })
    }
  })
}
module.exports = function init(site) {
  var xl = require('excel4node');

  const $tickets = site.connectCollection('tickets')


  $tickets.deleteDuplicate({
    'code': 1
  }, (err, result) => {
    $tickets.createUnique({
      'code': 1
    })
  })


  function addZero(code, number) {
    let c = number - code.toString().length
    for (let i = 0; i < c; i++) {
      code = '0' + code.toString()
    }
    return code
  }

  $tickets.newCode = function () {

    let y = new Date().getFullYear().toString().substr(2, 2)
    let m = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'][new Date().getMonth()].toString()
    let d = new Date().getDate()
    let lastCode = site.storage('ticket_last_code') || 0
    let lastMonth = site.storage('ticket_last_month') || m
    if (lastMonth != m) {
      lastMonth = m
      lastCode = 0
    }
    lastCode++
    site.storage('ticket_last_code', lastCode)
    site.storage('ticket_last_month', lastMonth)
    return y + lastMonth + addZero(d, 2) + addZero(lastCode, 4)
  }

  site.get({
    name: "tickets",
    path: __dirname + "/site_files/html/index.html",
    parser: "html js css"
  })


  site.post("/api/tickets/add", (req, res) => {
    let response = {}
    response.done = false

    if (req.session.user === undefined) {
      response.error = 'you are not login'
      res.json(response)
      return
    }

    let tickets_doc = req.body

    tickets_doc.$req = req
    tickets_doc.$res = res

    tickets_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res
    })

    tickets_doc.code = $tickets.newCode()

    if (tickets_doc.company_code) {
      tickets_doc.company_codes = [tickets_doc.company_code]
      delete tickets_doc.company_code
    }

    tickets_doc.done = false
    tickets_doc.review_done = false
    tickets_doc.close_eng_assign = false
    tickets_doc.close_eng_done = false

    tickets_doc.close_eng = {
      device_info: tickets_doc.device_info
    }

    tickets_doc = ticketHandle(tickets_doc)

    $tickets.add(tickets_doc, (err, doc) => {
      if (!err) {
        response.done = true
        response.doc = doc
        site.call('new ticket added', doc)
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

  function ticketHandle(tickets_doc) {

    tickets_doc.files = tickets_doc.files || []
    tickets_doc.notes = tickets_doc.notes || []
    tickets_doc.eng_list = tickets_doc.eng_list || []
    tickets_doc.item_sell_list = tickets_doc.item_sell_list || []
    tickets_doc.item_replace_list = tickets_doc.item_replace_list || []
    tickets_doc.item_needed_list = tickets_doc.item_needed_list || []
    tickets_doc.inputs = tickets_doc.inputs || []
    tickets_doc.outputs = tickets_doc.outputs || []
    tickets_doc.print_count = tickets_doc.print_count || 0



    tickets_doc.date = new Date(tickets_doc.date)
    tickets_doc.visit_date = new Date(tickets_doc.visit_date)

    if (tickets_doc.add_user_info) {
      tickets_doc.add_user_info.date = new Date(tickets_doc.add_user_info.date)
    }
    if (tickets_doc.close1_user_info) {
      tickets_doc.close1_user_info.date = new Date(tickets_doc.close1_user_info.date)
    }
    if (tickets_doc.close2_user_info) {
      tickets_doc.close2_user_info.date = new Date(tickets_doc.close2_user_info.date)
    }
    if (tickets_doc.close_eng_user_info) {
      tickets_doc.close_eng_user_info.date = new Date(tickets_doc.close_eng_user_info.date)
    }
    if (tickets_doc.assign_user_info) {
      tickets_doc.assign_user_info.date = new Date(tickets_doc.assign_user_info.date)
    }
    if (tickets_doc.close_eng && tickets_doc.close_eng.user_info) {
      tickets_doc.close_eng.user_info.date = new Date(tickets_doc.close_eng.user_info.date)
    }

    return tickets_doc
  }

  site.post("/api/tickets/update", (req, res) => {

    let response = {}
    response.done = false

    if (!req.session.user) {
      response.error = 'You Are Not Login'
      res.json(response)
      return
    }

    let tickets_doc = req.body

    tickets_doc.$req = req
    tickets_doc.$res = res

    tickets_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res
    })

    tickets_doc = ticketHandle(tickets_doc)

    $tickets.update(tickets_doc, err => {
      if (!err) {
        response.done = true
      } else {
        response.error = err.message
      }
      res.json(response)
    })

  })


  site.post("/api/tickets/updatePrint", (req, res) => {

    let response = {}
    response.done = false

    if (req.session.user === undefined) {
      response.error = 'You Are Not Login'
      res.json(response)
      return
    }


    $tickets.findOne({
      id: req.data.id
    }, (err, doc) => {
      if (doc) {

        doc.print_user_info = site.security.getUserFinger({
          $req: req,
          $res: res
        })
        doc.print_count = doc.print_count || 0
        doc.print_count++;
        doc = ticketHandle(doc)
        $tickets.update(doc, err => {
          if (!err) {
            response.done = true
          } else {
            response.error = err.message
          }
          res.json(response)
        })
      }
    })



  })


  site.post("/api/tickets/updateCloseEng", (req, res) => {

    let response = {}
    response.done = false

    if (!req.session.user) {
      response.error = 'You Are Not Login'
      res.json(response)
      return
    }

    let tickets_doc = {
      id: req.body.ticket.id,
      close_eng: req.body.ticket.close_eng,
      close_eng_done: req.body.ticket.close_eng_done,
      files: req.body.ticket.files
    }


    tickets_doc.close_eng.user_info = site.security.getUserFinger({
      $req: req,
      $res: res
    })

    tickets_doc.close_eng_user_info = site.security.getUserFinger({
      $req: req,
      $res: res
    })

    tickets_doc.$req = req
    tickets_doc.$res = res

    if (tickets_doc.id) {
      $tickets.find({
        where: {
          id: tickets_doc.id,
        },
        select: {}
      }, (err, doc) => {
        if (!err && doc) {
          doc.$req = req
          doc.$res = res
          doc.files = tickets_doc.files
          doc.close_eng = tickets_doc.close_eng
          doc.close_eng_done = tickets_doc.close_eng_done
          doc.close_eng_user_info = tickets_doc.close_eng_user_info
          doc.device_info = doc.close_eng.device_info

          doc.eng_list[doc.eng_list.length - 1].date =  new Date()
          doc.eng_list[doc.eng_list.length - 1].close_eng =  tickets_doc.close_eng
          doc.eng_list[doc.eng_list.length - 1].done =  doc.close_eng_done
          doc.eng_list[doc.eng_list.length - 1].close_eng_user_info =  site.security.getUserFinger({
            $req: req,
            $res: res
          })

          if (doc.close_eng_done) {

            doc.fixes = doc.close_eng.fixes

            if (doc.close_eng.inputs) {
              doc.inputs = doc.inputs || []
              doc.close_eng.inputs.forEach(d => {
                d.eng = doc.eng
                doc.inputs.push(d)
              })
            }

            if (doc.close_eng.outputs) {
              doc.outputs = doc.outputs || []
              doc.close_eng.outputs.forEach(d => {
                d.eng = doc.eng
                doc.outputs.push(d)
              })
            }

            if (doc.close_eng.item_sell_list) {
              doc.item_sell_list = doc.item_sell_list || []
              doc.close_eng.item_sell_list.forEach(d => {
                d.eng = doc.eng
                doc.item_sell_list.push(d)
              })
            }

            if (doc.close_eng.item_replace_list) {
              doc.item_replace_list = doc.item_replace_list || []
              doc.close_eng.item_replace_list.forEach(d => {
                d.eng = doc.eng
                doc.item_replace_list.push(d)
              })
            }

            if (doc.close_eng.item_needed_list) {
              doc.item_needed_list = doc.item_needed_list || []
              doc.close_eng.item_needed_list.forEach(d => {
                d.eng = doc.eng
                doc.item_needed_list.push(d)
              })
            }

          }

          doc = ticketHandle(doc)

          $tickets.update(doc, err => {
            if (!err) {
              response.done = true
            } else {
              response.error = err.message
            }
            res.json(response)
          })

        }
      })
    }


  })

  site.post("/api/tickets/updateClose1", (req, res) => {
    let response = {}
    response.done = false

    if (!req.session.user) {
      response.error = 'You Are Not Login'
      res.json(response)
      return
    }

    let tickets_doc = req.body.ticket


    tickets_doc.$req = req
    tickets_doc.$res = res

    tickets_doc.close1_user_info = site.security.getUserFinger({
      $req: req,
      $res: res
    })


    tickets_doc = ticketHandle(tickets_doc)

    $tickets.update(tickets_doc, (err, result) => {
      if (!err) {

        if (tickets_doc.close1_done) {

          tickets_doc.eng_list[tickets_doc.eng_list.length - 1].close1_done = true
          tickets_doc.eng_list[tickets_doc.eng_list.length - 1].close1_user_info = tickets_doc.close1_user_info
          tickets_doc.eng_list[tickets_doc.eng_list.length - 1].cost_count = tickets_doc.cost_count

          let dept_list = [];

          if (tickets_doc.inputs) {
            tickets_doc.inputs.forEach(itm => {

              if (!itm._done) {

                itm._done = true

                let exists = false

                dept_list.forEach(d => {
                  if (d.eng.id == itm.eng.id) {
                    d.value += parseFloat(itm.value)
                    exists = true
                  }
                })

                if (!exists) {
                  dept_list.push({
                    eng: itm.eng,
                    value: parseFloat(itm.value),
                    description: itm.name,
                    receet_number: itm.receet_number
                  })
                }
              }



            })
          }

          if (tickets_doc.outputs) {
            tickets_doc.outputs.forEach(itm => {


              if (!itm._done) {

                itm._done = true

                let exists = false

                dept_list.forEach(d => {
                  if (d.eng.id == itm.eng.id) {
                    d.value -= parseFloat(itm.value)
                    exists = true
                  }
                })

                if (!exists) {
                  dept_list.push({
                    eng: itm.eng,
                    value: 0 - parseFloat(itm.value),
                    description: itm.name,
                    receet_number: itm.receet_numbe
                  })
                }
              }
            })
          }

          if (tickets_doc.item_sell_list) {
            tickets_doc.item_sell_list.forEach(itm => {

              if (!itm._done) {
                itm._done = true
                let exists = false

                dept_list.forEach(d => {
                  if (d.eng.id == itm.eng.id) {
                    d.value += parseFloat(itm.price)
                    exists = true
                  }
                })
                if (!exists) {
                  dept_list.push({
                    eng: itm.eng,
                    value: parseFloat(itm.price),
                    description: itm.name,
                    receet_number: itm.receet_numbe
                  })
                }

              }
            })
          }


          dept_list.forEach(d => {
            d.ticket_code = tickets_doc.code
            d.date = new Date()
            site.call('[tickets][eng_debt]', d)
          })



          if (tickets_doc.item_sell_list) {
            tickets_doc.item_sell_list.forEach(itm => {
              if (!itm._done) {
                itm._done = true

                itm.ticket_code = tickets_doc.code
                itm.current_status = 'sold'

                site.call('change item status', itm)
                site.call('mark eng item as used', itm)
              }
            })
          }

          if (tickets_doc.item_replace_list) {
            tickets_doc.item_replace_list.forEach(itm => {
              if (!itm._done) {
                itm._done = true
                itm.ticket_code = tickets_doc.code
                itm.current_status = 'replaced'

                site.call('change item status', Object.assign({}, itm))
                site.call('mark eng item as used', Object.assign({}, itm))
                site.call('[tickets][eng_item_debt]', Object.assign({}, itm))
              }

            })

          }

        }


        $tickets.update(tickets_doc)

        response.done = true

      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.post("/api/tickets/updateClose2", (req, res) => {
    let response = {}
    response.done = false

    if (!req.session.user) {
      response.error = 'You Are Not Login'
      res.json(response)
      return
    }

    let tickets_doc = req.body.ticket
    tickets_doc.$req = req
    tickets_doc.$res = res

    tickets_doc.close2_user_info = site.security.getUserFinger({
      $req: req,
      $res: res
    })


    tickets_doc = ticketHandle(tickets_doc)

    $tickets.update(tickets_doc, (err, result) => {
      if (!err) {
        response.done = true

        // if (!result.old_doc.done && tickets_doc.done) {

        //   let dept_list = [];

        //   if (tickets_doc.inputs) {
        //     tickets_doc.inputs.forEach(itm => {

        //       if(!itm._done){
        //         itm.done = true

        //         let exists = false

        //         dept_list.forEach(d => {
        //           if (d.eng.id == itm.eng.id) {
        //             d.value += parseFloat(itm.value)
        //             exists = true
        //           }
        //         })

        //         if (!exists) {
        //           dept_list.push({
        //             eng: itm.eng,
        //             value: parseFloat(itm.value),
        //             description: itm.name,
        //             receet_number: itm.receet_number
        //           })
        //         }
        //       }



        //     })
        //   }

        //   if (tickets_doc.outputs) {
        //     tickets_doc.outputs.forEach(itm => {

        //       if(!itm._done){
        //         itm.done = true

        //       let exists = false

        //       dept_list.forEach(d => {
        //         if (d.eng.id == itm.eng.id) {
        //           d.value -= parseFloat(itm.value)
        //           exists = true
        //         }
        //       })
        //       if (!exists) {
        //         dept_list.push({
        //           eng: itm.eng,
        //           value: 0 - parseFloat(itm.value),
        //           description: itm.name,
        //           receet_number: itm.receet_numbe
        //         })
        //       }
        //     }

        //     })
        //   }

        //   if (tickets_doc.item_sell_list) {
        //     tickets_doc.item_sell_list.forEach(itm => {

        //       if(!itm._done){
        //         itm.done = true

        //       let exists = false

        //       dept_list.forEach(d => {
        //         if (d.eng.id == itm.eng.id) {
        //           d.value += parseFloat(itm.price)
        //           exists = true
        //         }
        //       })
        //       if (!exists) {
        //         dept_list.push({
        //           eng: itm.eng,
        //           value: parseFloat(itm.price),
        //           description: itm.name,
        //           receet_number: itm.receet_numbe
        //         })
        //       }

        //     }
        //     })
        //   }


        //   dept_list.forEach(d => {
        //     d.ticket_code = tickets_doc.code
        //     d.date = new Date()
        //     site.call('[tickets][eng_debt]', d)
        //   })



        //   if (tickets_doc.item_sell_list) {
        //     tickets_doc.item_sell_list.forEach(itm => {
        //       if(!itm._done){
        //         itm.done = true

        //       itm.ticket_code = tickets_doc.code
        //       itm.current_status = 'sold'

        //       site.call('change item status', itm)
        //       site.call('mark eng item as used', itm)

        //       }
        //     })
        //   }

        //   if (tickets_doc.item_replace_list) {
        //     tickets_doc.item_replace_list.forEach(itm => {

        //       if(!itm._done){
        //         itm.done = true

        //       itm.ticket_code = tickets_doc.code
        //       itm.current_status = 'replaced'

        //       site.call('change item status', Object.assign({}, itm))
        //       site.call('mark eng item as used', Object.assign({}, itm))
        //       site.call('[tickets][eng_item_debt]', Object.assign({}, itm))
        //       }

        //     })

        //   }

        // }

        // $tickets.update(tickets_doc)

      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })


  site.post("/api/tickets/updateNotes", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      response.error = 'You Are Not Login'
      res.json(response)
      return
    }

    let tickets_doc = req.body
    let doc = {}
    doc.$req = req
    doc.$res = res

    doc.notes = site.fromJson(tickets_doc.notes)

    if (tickets_doc.id) {
      $tickets.edit({
        where: {
          id: tickets_doc.id
        },
        set: doc,
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
      response.error = 'no id'
      res.json(response)
    }
  })



  site.post("/api/tickets/updateReview", (req, res) => {
    let response = {}
    response.done = false

    if (!req.session.user) {
      response.error = 'You Are Not Login'
      res.json(response)
      return
    }


    let doc = req.body
    doc.$req = req
    doc.$res = res
    doc.ticket.review_user_info = site.security.getUserFinger({
      $req: req,
      $res: res
    })


    if (doc.id) {
      $tickets.edit({
        where: {
          id: doc.id
        },
        set: doc.ticket,
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
      response.error = 'no id'
      res.json(response)
    }
  })



  site.post("/api/tickets/updateFiles", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      response.error = 'You Are Not Login'
      res.json(response)
      return
    }

    let tickets_doc = req.body
    let doc = {}
    doc.$req = req
    doc.$res = res

    doc.files = site.fromJson(tickets_doc.files)

    if (tickets_doc.id) {
      $tickets.edit({
        where: {
          id: tickets_doc.id
        },
        set: doc,
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
      response.error = 'no id'
      res.json(response)
    }
  })


  site.post("/api/tickets/BackToCloseEng", (req, res) => {
    let response = {}
    response.done = false

    if (!req.session.user) {
      response.error = 'not login'
      res.json(response)
      return
    }

    let ticket_doc = req.body

    if (ticket_doc) {

      $tickets.find({
        where: {
          id: ticket_doc.id
        }
      }, (err, doc) => {

        if (!err && doc) {

          doc = ticketHandle(doc)

          doc.close_eng_done = false
          doc.close1_done = false
          doc.back_to_eng_user_info = site.security.getUserFinger({
            $req: req,
            $res: res
          })

          doc.inputs.forEach((itm, i) => {
            if (itm.eng.id == doc.eng.id) {
              doc.inputs.splice(i, 1)
            }
          })

          doc.outputs.forEach((itm, i) => {
            if (itm.eng.id == doc.eng.id) {
              doc.outputs.splice(i, 1)
            }
          })

          doc.item_sell_list.forEach((itm, i) => {
            if (itm.eng.id == doc.eng.id) {
              doc.item_sell_list.splice(i, 1)
            }
          })

          doc.item_replace_list.forEach((itm, i) => {
            if (itm.eng.id == doc.eng.id) {
              doc.item_replace_list.splice(i, 1)
            }
          })

          doc.item_needed_list.forEach((itm, i) => {
            if (itm.eng.id == doc.eng.id) {
              doc.item_needed_list.splice(i, 1)
            }
          })

          $tickets.edit(doc, (err, result) => {
            if (!err) {
              response.done = true
              response.count = result.count
            } else {
              response.error = err.message
            }
            res.json(response)
          })

        } else {
          response.error = err.message
          res.json(response)
        }
      })

    } else {
      response.error = 'no id'
      res.json(response)
    }
  })

  site.post("/api/tickets/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let id = req.body.id
    if (id) {
      $tickets.delete({
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

  site.post("/api/tickets/view", (req, res) => {
    let response = {}
    response.done = false
    $tickets.findOne({
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

  site.post("/api/tickets/view/open", (req, res) => {
    let response = {}
    response.done = false
    let doc = req.body
    if (!doc.customer || !doc.device_info || !doc.device_info.company || !doc.device_info.category || !doc.device_info.device) {
      res.json(response)
      return
    }
    $tickets.findMany({
      where: {
        done: false,
        'customer.id': doc.customer.id,
        'device_info.company.id': doc.device_info.company.id,
        'device_info.category.id': doc.device_info.category.id,
        'device_info.device.id': doc.device_info.device.id
      }
    }, (err, docs) => {
      if (!err) {
        response.done = true
        response.docs = docs
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.post("/api/tickets/all", (req, res) => {

    let response = {}
    response.done = false


    if (!req.session.user) {
      response.error = "Must Login First"
      res.json(response)
      return
    }


    let data = req.body.where || {}
    let where = {
      $or: [],
      $and: []
    }



    if (data && data.from_date && data.to_date) {
      let d1 = site.toDate(data.from_date)
      let d2 = site.toDate(data.to_date)
      d2.setDate(d2.getDate() + 1);
      where.date = {
        '$gte': d1,
        '$lt': d2
      }
    }


    if (data['add_user_info.id']) {
      where['add_user_info.id'] = data['add_user_info.id']
    }
    if (data['assign_user_info.id']) {
      where['assign_user_info.id'] = data['assign_user_info.id']
    }

    if (data['close_eng_user_info.id']) {
      where['close_eng_user_info.id'] = data['close_eng_user_info.id']
    }

    if (data && data['assign_user_info.date']) {
      d1 = site.toDate(data['assign_user_info.date'])
      d2 = site.toDate(data['assign_user_info.date'])
      d2.setDate(d2.getDate() + 1)
      where['assign_user_info.date'] = {
        '$gte': d1,
        '$lt': d2
      }
    }

    if (data['back_to_eng_user_info.id']) {
      where['back_to_eng_user_info.id'] = data['back_to_eng_user_info.id']
    }

    if (data['close2_user_info.id']) {
      where['close2_user_info.id'] = data['close2_user_info.id']
    }

    if (data['review_user_info.id']) {
      where['review_user_info.id'] = data['review_user_info.id']
    }


    if (data.print_status && data.print_status.value) {
      if (data.print_status.value == '1') {
        where['print_count'] = {
          '$gte': 1
        }
      } else if (data.print_status.value == '-1') {
        where['print_count'] = 0
      }
    }

    if (data.eng) {
      where['eng.id'] = data.eng.id
    }
    if (data['eng.id']) {
      where['eng.id'] = parseInt(data['eng.id'])
    } else {
      if (req.session.user.roles.length === 1) {
        if (req.session.user.roles[0].name === 'eng') {
          where['eng.id'] = req.session.user.employee_id
          where['close_eng_done'] = false
        }
      }
    }

    if (data.code) {
      if (data.code.split('\n').length > 1) {
        data.code.split('\n').forEach(m => {
          where.$or.push({
            'code': new RegExp(m, 'i')
          })
        })
      } else {
        where.code = new RegExp(data.code, 'i')
      }

    }

    if (data.company_code) {
      if (data.company_code.split('\n').length > 1) {
        data.company_code.split('\n').forEach(m => {
          where.$or.push({
            'company_codes': new RegExp(m, 'i')
          })
        })
      } else {
        where['company_codes'] = new RegExp(data.company_code, 'i')
      }

    }

    if (data.receipt_number) {
      where.$or.push({
        'receipt_number': new RegExp(data.receipt_number, 'i')
      })
      where.$or.push({
        'code': new RegExp(data.receipt_number, 'i')
      })
    }


    if (data.priotry) {
      where['priotry.id'] = site.fromJson(data.priotry).id
    }

    if (data.review_status) {
      where['review_status.id'] = site.fromJson(data.review_status).id
    }

    if (data.review_done == false || data.review_done == true) {
      where['review_done'] = data.review_done
    }

    if (data.status) {
      where['status.id'] = site.fromJson(data.status).id
    }


    if (data.status2) {
      where['status2.id'] = site.fromJson(data.status2).id
    }

    if (data.status3) {
      where['status3.id'] = site.fromJson(data.status3).id
    }
    if (data.device_info) {
      if (data.device_info.company) {
        where['device_info.company.id'] = data.device_info.company.id
      }

      if (data.device_info.serial) {
        where['device_info.serial'] = new RegExp(data.device_info.serial, 'i')
      }

      if (data.device_info.category) {
        where['device_info.category.id'] = data.device_info.category.id
      }
      if (data.device_info.sub_category) {
        where['device_info.sub_category.id'] = data.device_info.sub_category.id
      }
      if (data.device_info.device) {
        where['device_info.device.id'] = data.device_info.device.id
      }
      if (data.device_info.model) {
        where['device_info.model.name'] = new RegExp(data.device_info.model.name, 'i')
      }
      if (data.device_info.status) {
        where['device_info.status'] = parseInt(data.device_info.status.id)
      }

    }

    if (data['device_info.device.id']) {
      where['device_info.device.id'] = parseInt(data['device_info.device.id'])
    }


    if (data.item_need_name) {
      where['close1.item_need_list'] = {
        $all: [{
          name: new RegExp(data.item_need_name, 'i')
        }]

      }
    }

    if (data.lated && data.lated > 0) {
      let d1 = new Date()
      d1.setHours(d1.getHours() - data.lated);
      where.date = {
        '$lte': d1
      }

      where.$or.push({
        'close_eng_done': {
          "$exists": false
        }
      })
      where.$or.push({
        'close_eng_done': false
      })

    }

    if (data.date_type) {
      let d1 = null
      let d2 = null

      delete where.date

      if (data.date) {
        d1 = site.toDate(data.date)
        d2 = site.toDate(data.date)
        d2.setDate(d2.getDate() + 1)
      }

      if (data.from_date) {
        d1 = site.toDate(data.from_date)
        d2 = site.toDate(data.to_date)
        d2.setDate(d2.getDate() + 1)

      }

      if (data.date_type.id == 1) {
        where.date = {
          '$gte': d1,
          '$lt': d2
        }
      } else if (data.date_type.id == 2) {
        where['close_eng_user_info.date'] = {
          '$gte': d1,
          '$lt': d2
        }
      } else if (data.date_type.id == 3) {
        where['close1_user_info.date'] = {
          '$gte': d1,
          '$lt': d2
        }
      } else if (data.date_type.id == 4) {
        where['close2_user_info.date'] = {
          '$gte': d1,
          '$lt': d2
        }
      } else if (data.date_type.id == 5) {
        where['assign_user_info.date'] = {
          '$gte': d1,
          '$lt': d2
        }
      }


    }

    if (data['customer.id']) {
      where['customer.id'] = parseInt(data['customer.id'])
    }

    if (data.customer) {


      if (data.customer.name) {
        where['customer.name'] = new RegExp(data.customer.name, 'i')
      }

      /*  if (data.close_eng.device_info.serial) {
         where['close_eng.device_info.serial'] = new RegExp(data.close_eng.device_info.serial, 'i')
       } */

      if (data['close_eng.device_info.serial']) {
        data['close_eng.device_info.serial'] = new RegExp(data['close_eng.device_info.serial'], 'i')
      }


      if (data.customer.id) {
        where['customer.id'] = parseInt(data.customer.id)
      }

      if (data.customer.mobile) {

        if (data.customer.mobile.split('\n').length > 1) {
          data.customer.mobile.split('\n').forEach(m => {
            m = m.trim()
            where.$or.push({
              'customer.mobiles': new RegExp(m, 'i')
            })
            where.$or.push({
              'customer.phones': new RegExp(m, 'i')
            })
          })
        } else {
          data.customer.mobile = data.customer.mobile.trim()
          where.$or.push({
            'customer.phones': new RegExp(data.customer.mobile, 'i')
          })
          where.$or.push({
            'customer.mobiles': new RegExp(data.customer.mobile, 'i')
          })
          //where['customer.mobiles'] = new RegExp(data.customer.mobile, 'i')
        }

      }
      if (data.customer.phone) {
        where.$or.push({
          'customer.phones': new RegExp(data.customer.phone, 'i')
        })
        where.$or.push({
          'customer.mobiles': new RegExp(data.customer.phone, 'i')
        })
        // where['customer.phones'] = new RegExp(data.customer.phone, 'i')
      }

      if (data.customer.gov) {
        where['customer.gov.id'] = site.fromJson(data.customer.gov).id
      }
      if (data.customer.city) {
        where['customer.city.id'] = site.fromJson(data.customer.city).id
      }
      if (data.customer.town) {
        where['customer.town.id'] = site.fromJson(data.customer.town).id
      }
      if (data.customer.region) {
        where['customer.region.id'] = site.fromJson(data.customer.region).id
      }
    }

    if (data.close_eng_done === true || data.close_eng_done === false) {
      where['close_eng_done'] = data.close_eng_done
    }

    if (data.close1_done === true || data.close1_done === false) {
      where['close1_done'] = data.close1_done
    }



    if (data.done === true || data.done === false) {
      where['done'] = data.done
    }

    if (data.notes) {
      where['notes'] = new RegExp(data.notes, 'i')
    }


    if (data.user_type && data.user_name) {
      if (data.user_type.id == 1) {
        where.$and.push({
          'old_ticket.ReceivedUserName': new RegExp(data.user_name, 'i')
        })
      }
    }


    if (data.user_type && data.user) {
      if (data.user_type.id == 1) {
        where['add_user_info.id'] = data.user.id
        if (data.user_name) {
          where.$and.push({
            'old_ticket.ReceivedUserName': new RegExp(data.user_name, 'i')
          })
        }
      } else if (data.user_type.id == 2) {
        where['close_eng_user_info.id'] = data.user.id
      } else if (data.user_type.id == 3) {
        where['close1_user_info.id'] = data.user.id
      } else if (data.user_type.id == 4) {
        where['close2_user_info.id'] = data.user.id
      } else if (data.user_type.id == 5) {
        where['review_user_info.id'] = data.user.id
      } else if (data.user_type.id == 6) {
        where['assign_user_info.id'] = data.user.id
      }
    } else if (data.user) {
      where['add_user_info.id'] = data.user.id
      where['close_eng_user_info.id'] = data.user.id
    }



    if (data['status.id']) {
      where['status.id'] = data['status.id']
    }

    if (data['customer.region.id']) {
      where['customer.region.id'] = data['customer.region.id']
    }




    if (where.$or.length === 0) {
      delete where.$or
    }

    if (where.$and.length === 0) {
      delete where.$and
    }

    if (data['eng_list.eng.id']) {
      where['eng_list.eng.id'] = data['eng_list.eng.id']
    }

    console.log(where)

    $tickets.findMany({
      select: req.body.select,
      where: where,
      sort: {
        id: -1
      },
      limit: req.body.limit
    }, (err, docs, count) => {
      if (!err) {
        response.done = true
        response.where = where
        response.list = docs
        response.count = count

        if (data.repeats_only) {
          let arr = []
          docs.forEach(d => {
            let exists = false
            arr.forEach(a => {
              if (a.id === d.id) {
                exists = true
              }
            })
            if (d.repeats) {
              exists = true
            }
            if (exists === false) {
              let count2 = 0;
              docs.forEach(d2 => {
                if (d.id !== d2.id && d2.device_info.serial && d2.device_info.serial == d.device_info.serial) {
                  count2++
                  d.repeats = d.repeats || []
                  let exists = false
                  d.repeats.forEach(r => {
                    if (r.id === d2.id) {
                      exists = true
                    }
                  })
                  if (d2.repeats) {
                    exists = true
                  }
                  if (exists === false) {
                    d.repeats.push(d2)
                  }

                }
              })
              if (count2 > 0) {
                let exists = false
                arr.forEach(a => {
                  if (a.id === d.id) {
                    exists = true
                  }
                  a.repeats.forEach(a2 => {
                    if (a2.id === d.id) {
                      exists = true
                    }
                  })
                })
                if (exists === false) {
                  arr.push(d)
                }

              }
            }

          })

          response.list = arr
          response.count = arr.length

        }

      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.post("/api/tickets/get_assigned", (req, res) => {
    let response = {}

    let data = req.data
    let where = {}
    where['eng_list.eng.id'] = data['eng.id']

    if (data && data.from_date && data.to_date) {
      let d1 = site.toDate(data.from_date)
      let d2 = site.toDate(data.to_date)
      d2.setDate(d2.getDate() + 1);
      where['eng_list.assign_user_info.date'] = {
        '$gte': d1,
        '$lt': d2
      }
    }
    response.done = false
    $tickets.findMany({
      limit : 10000 ,
      where: where
    }, (err, docs , count) => {
      if (!err) {
        response.list = []
        docs.forEach(doc=>{
          doc.eng_list.forEach(e=>{
            if(e.eng.id == data['eng.id']){
              doc.assign_user_info = e.assign_user_info
              response.list.push(doc)
            }
          })
        })
        response.done = true
        response.count = response.list.length
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.post("/api/tickets/get_close1", (req, res) => {
    let response = {}

    let data = req.data
    let where = {}
    where['eng_list.eng.id'] = data['eng.id']

    if (data && data.from_date && data.to_date) {
      let d1 = site.toDate(data.from_date)
      let d2 = site.toDate(data.to_date)
      d2.setDate(d2.getDate() + 1);
      where['eng_list.close_eng_user_info.date'] = {
        '$gte': d1,
        '$lt': d2
      }
    }else if (data && data.date ) {
      let d1 = site.toDate(data.date)
      let d2 = site.toDate(data.date)
      d2.setDate(d2.getDate() + 1);
      where['eng_list.close_eng_user_info.date'] = {
        '$gte': d1,
        '$lt': d2
      }
    }
    response.done = false
    $tickets.findMany({
      limit : 10000 ,
      where: where
    }, (err, docs , count) => {
      if (!err) {
        response.list = []
        docs.forEach(doc=>{
          doc.eng_list.forEach(e=>{
            if(e.eng.id == data['eng.id'] && e.close1_done){
              doc.close1_user_info = e.close1_user_info
              response.list.push(doc)
            }
          })
        })
        response.done = true
        response.count = response.list.length
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.post("/api/tickets/assignEng", (req, res) => {
    let response = {}
    response.done = false
    if (!req.session.user) {
      res.json(response)
      return
    }

    let id = req.data.id
    let eng = req.data.eng

    if (id) {
      $tickets.find({
        where: {
          id: id,
        },
        select: {}
      }, (err, doc) => {
        if (!err && doc) {

          doc = ticketHandle(doc)
          doc.close_eng = {
            device_info: doc.device_info
          }


          doc.eng = eng
          doc.close_eng_assign = true
          doc.close_eng_done = false
          doc.close1_done = false
          doc.done = false

          doc.assign_user_info = site.security.getUserFinger({
            $req: req,
            $res: res
          })

          doc.status = {
            id: 4,
            ar: "موزع",
            en: "Assignd"
          }

          doc.eng_list.push({
            eng: eng,
            assign_user_info: doc.assign_user_info,
            close_eng : {
              device_info: doc.device_info
            },
            done: false
          })

          $tickets.edit({
            where: {
              id: id
            },
            set: doc,
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
        }
      })


    } else {
      res.json(response)
    }
  })


  site.post("/api/tickets/assignEngAll", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
      return
    }

    let ids = req.data.ids
    let eng = req.data.eng

    for (let i = 0; i < ids.length; i++) {
      let id = ids[i]

      if (id) {
        $tickets.find({
          where: {
            id: id,
          },
          select: {
            eng: 1,
            eng_list: 1
          }
        }, (err, doc) => {
          if (!err && doc) {

            doc = ticketHandle(doc)
            doc.close_eng = {
              device_info: doc.device_info
            }
            
            doc.eng = eng
            doc.close_eng_assign = true
            doc.close_eng_done = false
            doc.close1_done = false
            doc.done = false

            doc.status = {
              id: 4,
              ar: "موزع",
              en: "Assignd"
            }

            doc.assign_user_info = site.security.getUserFinger({
              $req: req,
              $res: res
            })

            doc.eng_list.push({
              eng: eng,
              assign_user_info: doc.assign_user_info,
              close_eng : {
                device_info: doc.device_info
              },
              done: false
            })

            $tickets.edit({
              where: {
                id: id
              },
              set: doc,
              $req: req,
              $res: res
            }, err => {
              if (!err) {
                response.done = true
              } else {
                response.error = err.message
              }

            })
          }
        })


      }

    }

    setTimeout(() => {
      res.json(response)
    }, 3000);
  })


  site.post({
    name: '/api/ticket/sources/all',
    path: __dirname + '/site_files/json/ticket_sources.json'
  })

  site.post({
    name: '/api/ticket/services/all',
    path: __dirname + '/site_files/json/ticket_services.json'
  })

  site.post({
    name: '/api/ticket/status/all',
    path: __dirname + '/site_files/json/ticket_status.json'
  })

  site.post({
    name: '/api/ticket/status2/all',
    path: __dirname + '/site_files/json/ticket_status2.json'
  })

  site.post({
    name: '/api/ticket/status3/all',
    path: __dirname + '/site_files/json/ticket_status3.json'
  })

  site.post({
    name: '/api/ticket/review_status/all',
    path: __dirname + '/site_files/json/ticket_review_status.json'
  })

  site.post({
    name: '/api/ticket/date_types/all',
    path: __dirname + '/site_files/json/ticket_date_types.json'
  })

  site.post({
    name: '/api/ticket/user_types/all',
    path: __dirname + '/site_files/json/ticket_user_types.json'
  })

  site.post({
    name: '/api/ticket/priorities/all',
    path: __dirname + '/site_files/json/ticket_priorities.json'
  })


  site.post("/api/export_tickets/excel", (req, res) => {

    let response = {}
    response.done = false

    if (req.session.user === undefined) {
      res.json(response)
      return
    }


    let data = req.body.data

    if (data) {
      let docs = data.data
      let header = data.header
      // site.exportToExcel(data.data , data.header)
      var wb = new xl.Workbook();
      var ws = wb.addWorksheet('Sheet 1');
      var styleHeader = wb.createStyle({
        alignment: {
          horizontal: 'center',
          vertical: 'center'
        },
        font: {
          bold: true,
          color: '#ffffff',
          size: 14,
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
        ws.cell(headerRowCount, headerColCount)
          .string(h)
          .style(styleHeader);
        headerColCount = headerColCount + 1
      });


      let i = 2;
      let j = 1;
      docs.forEach(itm => {
        if (itm && itm.code) {
          ws.cell(i, 1)
            .string(itm.code)
            .style(styleContent);
        } else {
          ws.cell(i, 1)
            .string("--------")
            .style(styleContent);
        }

        if (itm && itm.status && itm.status.ar) {
          ws.cell(i, 2)
            .string(itm.status.ar)
            .style(styleContent);
        } else {
          ws.cell(i, 2)
            .string("--------")
            .style(styleContent);
        }
        if (itm && itm.priotry && itm.priotry.ar) {
          ws.cell(i, 3)
            .string(itm.priotry.ar)
            .style(styleContent);
        } else {
          ws.cell(i, 3)
            .string("---------")
            .style(styleContent);
        }
        if (itm && itm.customer && itm.customer.name) {
          ws.cell(i, 4)
            .string(itm.customer.name)
            .style(styleContent);
        } else {
          ws.cell(i, 4)
            .string("---------")
            .style(styleContent);
        }

        if (itm && itm.customer.mobiles && itm.customer.mobiles.length > 0) {
          let mobiles = ''
          if (itm.customer.mobiles.length == 1) {
            mobiles = itm.customer.mobiles[0];
          }
          if (itm.customer.mobiles.length > 1) {
            for (let i = 1; i <= itm.customer.mobiles.length; i++) {
              let mob = itm.customer.mobiles[i].toString()
              if (i < itm.customer.mobiles.length) {
                let mob = itm.customer.mobiles[i].toString()
                mobiles = mobiles + mob + '-'
              }
              if (i == itm.customer.mobiles.length) {
                let mob = itm.customer.mobiles[i].toString()
                mobiles = mobiles + mob
              }

            }
          }

          ws.cell(i, 5)
            .string(mobiles)
            .style(styleContent);
        } else {
          ws.cell(i, 5)
            .string("---------")
            .style(styleContent);
        }

        if (itm && itm.customer && itm.customer.address) {
          ws.cell(i, 6)
            .string(itm.customer.address)
            .style(styleContent);
        } else {
          ws.cell(i, 6)
            .string("---------")
            .style(styleContent);
        }
        if (itm && itm.complain) {
          ws.cell(i, 7)
            .string(itm.complain)
            .style(styleContent);
        } else {
          ws.cell(i, 7)
            .string("---------")
            .style(styleContent);
        }

        if (itm && itm.device_info) {
          let company = ''
          let category = ''
          let sub_category = ''
          let device = ''

          if (itm.device_info.company && itm.device_info.company.name) {
            company = itm.device_info.company.name || ''

          } else {
            company = '---'

          }
          if (itm.device_info.category && itm.device_info.category.name) {
            category = itm.device_info.category.name || ''

          } else {
            category = '---'

          }
          if (itm.device_info.sub_category && itm.device_info.sub_category.name) {
            sub_category = itm.device_info.sub_category.name || ''

          } else {
            sub_category = '---'

          }
          if (itm.device_info.device && itm.device_info.device.name) {
            device = itm.device_info.device.name || ''

          } else {
            device = '---'

          }

          ws.cell(i, 8)
            .string(company + '-' + category + '-' + sub_category + '-' + device)
            .style(styleContent);
        } else {
          ws.cell(i, 8)
            .string("---------")
            .style(styleContent);
        }




        i = i + 1
      });
      // docs.forEach(itm => {
      //     if(itm && itm.eng.name){
      //       ws.cell(i, j)
      //       .string(itm.eng.name)
      //       .style(styleContent);
      //     }else{
      //       ws.cell(i, j)
      //       .string("No Name")
      //       .style(styleContent);
      //     }


      //       ws.cell(i, j+1)
      //       .string(itm.name)
      //       .style(styleContent);

      //       if(itm && itm.company && itm.company.name){
      //         ws.cell(i, j+2)
      //        .string(itm.company.name) 
      //        .style(styleContent) ||   
      //        ws.cell(i, j+2)
      //         .Object(itm.company.name)
      //        .style(styleContent);

      //        }else{
      //         ws.cell(i, j+2)
      //         .string(" No Company")
      //         .style(styleContent)
      //         .style({font: {color: '#ff0000'}})
      //        }
      //        if(!itm.store){
      //         ws.cell(i, j+3)
      //         .string('No Store')
      //         .style(styleContent)
      //         .style({font: {color: '#ff0000'}})

      //        }
      //        if(itm.store){
      //         ws.cell(i, j+3)
      //         .string(itm.store.name)
      //         .style(styleContent);
      //        }



      //       if(itm.deliver_status == true){
      //         ws.cell(i, j+4)
      //         .string('تم التسليم')
      //         .style(styleContent)
      //         .style({font: {color: '#00ff00'}})
      //       }
      //       if(itm.deliver_status == false){
      //         ws.cell(i, j+4)
      //         .string('لم يتم التسليم')

      //         .style(styleContent)
      //         .style({font: {color: '#ff0000'}})
      //       }
      //       if(itm.deliver_status == null){
      //         ws.cell(i, j+4)

      //         .string(  'عهدة مع الفنى  ')
      //         .style(styleContent)

      //       }

      //       var  c = itm.count;
      //       ws.cell(i, j+5)

      //         .number(1)
      //         .style(styleContent);



      //       i = i+1
      // });



      site.createDir(__dirname + "/../../../Excel/", () => {

        wb.write(__dirname + '/../../../Excel/' + 'file.xlsx');

      })




      response.done = true

    } else {
      response.done = false
    }

    res.json(response)


  })


  site.get("/api/export_tickets/excel/download", (req, res) => {
    let response = {}
    response.done = false

    if (req.session.user === undefined) {
      res.json(response)
      return
    }

    res.download(__dirname + '/../../../Excel/' + '.xlsx')

  })



}
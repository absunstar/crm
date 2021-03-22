module.exports = function init(site) {

  const $employees = site.connectCollection("employees")


  site.onGET({
    name: "employees",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true
  })


  site.onPOST("/api/employees/add", (req, res) => {
    let response = {}
    response.done = false

    if (!req.session.user) {
      res.json(response)
      return
    }

    let doc = req.body
    doc.$req = req
    doc.$res = res
    doc._created = site.security.getUserFinger({
      $req: req,
      $res: res
    })

    $employees.add(doc, (err, id) => {
      if (!err) {
        response.done = true
        site.call('please add user', {
          email: doc.email,
          password: doc.password,
          role: doc.role,
          employee_id: doc.id,
          profile : {
            name : doc.name
          }
        })
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.onPOST("/api/employees/update", (req, res) => {
    let response = {}
    response.done = false

    if (!req.session.user) {
      res.json(response)
      return
    }

    let doc = req.body

    doc._updated = site.security.getUserFinger({
      $req: req,
      $res: res
    })

    if (doc.id) {
      $employees.edit({
        where: {
          id: doc.id
        },
        set: doc,
        $req: req,
        $req: req,
        $res: res
      }, (err, result) => {
        if (!err) {
          response.done = true
          site.call('please add user', {
            email: doc.email,
            password: doc.password,
            role: doc.role,
            employee_id: doc.id,
            profile : {
              name : doc.name
            }
          })
        } else {
          response.error = err.message
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.onPOST("/api/employees/delete", (req, res) => {
    let response = {}
    response.done = false

    if (!req.session.user) {
      res.json(response)
      return
    }

    let id = req.body.id


    if (id) {
      $employees.delete({
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

  site.onPOST("/api/employees/view", (req, res) => {
    let response = {}
    response.done = false
    $employees.find({
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

  site.onPOST("/api/employees/all", (req, res) => {
    let response = {}
    response.done = false

    let where = req.data.where || {}

    if (!req.session.user) {
      res.json(response)
      return
    }

    if (where && where.date_from && where.date_to) {
      let d1 = site.toDate(where.date_from)
      let d2 = site.toDate(where.date_to)
      d2.setDate(d2.getDate() + 1);

      where.contract_date = {

        '$gte': d1,
        '$lt': d2
      }
      delete where.date_from
      delete where.date_to
    }

    if (where['name']) {
      where['name'] = new RegExp(where['name'], 'i')
    }

    if (where['notes']) {
      where['notes'] = new RegExp(where['notes'], 'i')
    }

    if (where['active'] !== 'all') {
      where['active'] = true
    } else {
      delete where['active']
    }

    $employees.findMany({
      select: req.body.select || {},
      where: where,
      sort: {
        id: -1
      }
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

  site.onPOST({
    name: '/api/employees/departments/all',
    path: __dirname + '/site_files/json/departments.json'
  })

  site.onPOST({
    name: '/api/employees/jobs/all',
    path: __dirname + '/site_files/json/jobs.json'
  })

}
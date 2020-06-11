var isite = require("../isite")

const site = isite({
  port : 9091,
  name: "crm",
  dir: __dirname + "/site_files",
  saving_time: .2,
  help : true,
  cache: {
    enabled: true
  },
  security: {
    admin: {
      email: "test",
      password: "test"
    }
  },
  mongodb: {
    db: "crm",
    limit : 100,
  }
})


site.var("full-url", "http://crm.egytag.com")

require(__dirname + '/lib/updating')

site.require(__dirname + "/lib/routing")


site.loadLocalApp('client-side')
site.loadLocalApp('security')


site.run([80])

var isite = require('../isite');

const site = isite({
  port: 9091,
  name: 'crm',
  dir: __dirname + '/site_files',
  help: true,
  cache: {
    enabled: true,
  },
  security: {
    admin: {
      email: 'test',
      password: 'test',
    },
  },
  mongodb: {
    db: 'crm',
    limit: 100,
  },
  requires: {
    features: [],
    permissions: [],
  }
});

site.var('full-url', 'http://crm.egytag.com');

//require(__dirname + '/lib/updating')

site.require(__dirname + '/lib/routing');

site.loadLocalApp('client-side');
site.loadLocalApp('security');

site.run([80]);

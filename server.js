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
    keys: ['e698f2679be5ba5c9c0b0031cb5b057c', '9705a3a85c1b21118532fefcee840f99'],
  },
  mongodb: {
    db: 'crm',
    limit: 100,
    identity: {
      enabled: true,
    },
  },
  requires: {
    features: [],
    permissions: [],
  },
});

site.var('full-url', 'http://crm.egytag.com');

site.require(__dirname + '/lib/routing');

site.loadLocalApp('client-side');
site.loadLocalApp('security');

site.run([80]);

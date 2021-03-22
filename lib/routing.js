module.exports = function init(site) {

  site.onGET({
    name: "/css/crm.css",
    parser: "css2",
    compress: true,
    path: [
      site.dir + "/css/layout.css",
      site.dir + "/css/navbar.css",
      site.dir + "/css/form.css",
      site.dir + "/css/modal.css",
      site.dir + "/css/fixed_menu.css",
      site.dir + "/css/color.css",
      site.dir + "/css/effect.css",
      site.dir + "/css/table.css",
      site.dir + "/css/tableExport.css"
    ]
  })

  site.onGET({
    name: "/js",
    path: site.dir + "/js"
  })

  site.onGET({
    name: "/css",
    path: site.dir + "/css"
  })
  site.onGET({
    name: "/fonts",
    path: site.dir + "/fonts"
  })
  site.onGET({
    name: "/images",
    path: site.dir + "/images"
  })
  site.onGET({
    name: "/json",
    path: site.dir + "/json"
  })
  site.onGET({
    name: "/html",
    path: site.dir + "/html"
  })

  site.onGET({
    name: "",
    path: site.dir + "/html/index.html",
    parser: "html",
    compress: true
  })



}
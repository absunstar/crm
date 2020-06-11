module.exports = function init(site) {


  site.get({
    name: "details_engineers_report",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })



}
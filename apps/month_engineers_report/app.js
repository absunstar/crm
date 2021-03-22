module.exports = function init(site) {

 
  site.onGET({
    name: "month_engineers_report",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })



}
module.exports = function init(site) {

 
  site.get({
    name: "month_engineers_report",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })



}
module.exports = function init(site) {

 
  site.onGET({
    name: "close1_tickets_report",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })



}
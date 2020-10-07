module.exports = function init(site) {

 
  site.get({
    name: "close1_tickets_report",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })



}
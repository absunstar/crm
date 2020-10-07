module.exports = function init(site) {
  const $month_employees_reports = site.connectCollection("month_employees_reports")

  site.get({
    name: "month_employees_reports",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })

 
}
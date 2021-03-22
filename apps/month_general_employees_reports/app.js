module.exports = function init(site) {
  const $month_general_employees_reports = site.connectCollection("month_general_employees_reports")

  site.onGET({
    name: "month_general_employees_reports",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })

 
}
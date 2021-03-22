module.exports = function init(site) {
    
      site.words.addList(__dirname + '/site_files/json/words.json')
   
    
      site.onPOST({
        name : '/api/static/gender/all',
        path : __dirname + '/site_files/json/gender.json'
      })

      site.onPOST({
        name : '/api/static/Maritals/all',
        path : __dirname + '/site_files/json/maritals.json'
      })
    
      site.onPOST({
        name : '/api/static/militaries/all',
        path : __dirname + '/site_files/json/militaries.json'
      })
    
    }
var $ = require('jquery'),
    fs = require('fs'),
    ipc = require('ipc')

var Crawler = require("simplecrawler")
var walk = require("walk")

var mediaFolder = ''
var found = []
var local = []
//
// Track display and playback
//

$('#media-button').on('click', function(e){

  ipc.send('select.media')

});

//
// Electron events
//
//
ipc.on('selected.media', function(result) {

  mediaFolder = result
  $('#media-folder-value').html(result)

})

ipc.on('console.log', function() {
  console.log.apply(console, arguments)
})

$('#media-start').on('click', function(e){

  // verify we have a media folder
  // verify we have a website set

  // start crawling and disable all UI
  var count = 0;
  var myCrawler = new Crawler("www.swtor.com", "/");
  myCrawler.interval = 50;
  myCrawler.stripQuerystring = true;
  myCrawler.maxConcurrency = 30;
  myCrawler.maxResourceSize = 200000;
  //myCrawler.downloadUnsupported = false;
  myCrawler.on("fetchcomplete", function(queueItem, responseBuffer, response){
    var mediaTypes = ['image/gif', 'image/png', 'image/jpeg']
    if ($.inArray(response.headers['content-type'], mediaTypes) > -1){
        var url = queueItem.url.replace("http://cdn-www.swtor.com/sites/all/files/","")
        url = url.replace("http://www.swtor.com/sites/all/files/","")
        found.push(url)
    }
    count++
    $("#completed-fetched").html(queueItem.url);
    $("#completed").html(count);
    $("#completed-media").html(found.length);
  });
  myCrawler.on("complete", function(){
    alert("CRAWL DONE!")
    console.log(local.pop())
    console.log(found.pop())
    console.log("all done")

    Array.prototype.diff = function(a) {
        return this.filter(function(i) {return a.indexOf(i) < 0;});
    };
    
    // compare list and extract difs
    // show results
    console.log("HERE ARE THE RESULTS:")
    console.log(local.diff(found).length)
    console.log(found.diff(local).length)

  })

  // after finished crawling get the list of media assets
  // get the list of media assets from local folder
  var walker = walk.walk(mediaFolder, { followLinks: false});
  var localMedia = 0;
  walker.on("file", function(root, fileStat, next){
    var mediaTypes = ['gif', 'png', 'jpg']
    if ($.inArray(fileStat.name.split('.').pop(), mediaTypes) > -1){
      localMedia++;
      $("#local-fetched").html(localMedia);
      local.push(root.replace(mediaFolder+"\\", "").replace("\\","/") + "/" + fileStat.name.replace("\\","/"));
    }
    next();
  });

  walker.on("end", function(){
    myCrawler.start();
    console.log("finished local - started crawling")
  })




})

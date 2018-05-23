const rp = require('request-promise');
const cheerio = require('cheerio');
const DOMParser = require('dom-parser');
const Chess = require('chess.js').Chess;
const sleep = require('system-sleep');
const fs = require('fs');
var numPuzzlesCreated = 440;
var currentPage = 38;
var outputFile = 'C:/Users/sheer/code/webscraper/fen2.txt';



  //make a get request for the current page
  //https://lichess.org/games/search?page=4&ratingMin=2000&hasAi=0&mode=1&turnsMax=50&status=30&sort.field=d&sort.order=desc&_=1522520853596
  var string1 = 'https://lichess.org/games/search?page=';
  var string2 = '&hasAi=0&mode=1&status=30&sort.field=d&sort.order=desc&_=1522981949747';
  //make get request to requestaddress
  var requesturls = [];

function crawl () {
  if (currentPage > 100)
    return;
  sleep(3000);
  if (requesturls.length == 0) {
    makeRequestType1();
    
  }
  else {
    var url = requesturls.pop();
    const newOptions = {
      uri: url,
      transform: function (body) {
        return cheerio.load(body);
      }
    }
    rp(newOptions)
      .then(($) => {
        var pgnString = $('.pgn').html();
        var chess = new Chess();
        chess.load_pgn(pgnString);
        chess.undo();
        chess.undo();
        chess.undo();
        //start Chest-UCI process. 
        var fenstring = chess.fen() + '\n';
        fs.appendFile(outputFile, fenstring, function (err) {
          if (err) throw err;
        
        });
        numPuzzlesCreated++;
        console.log('number of puzzles created : ', numPuzzlesCreated);
        console.log(fenstring);
        crawl();
        
      })  

      .catch((err) => {
        console.log(err);
      });  
  }

}
  


function makeRequestType1(){
  const options = {
      uri: string1 + currentPage + string2,
      transform: function (body) {
        return cheerio.load(body);
      }
    }
    rp(options)
      .then(($) => {
        var res = $(('.game_row.paginated_element a.game_link_overlay'));
        for(var x=0; x<12; x++){
          var gameAddress = 'https://lichess.org' + res[x.toString()].attribs.href;
          requesturls.push(gameAddress);
          //make a new get request to gameAddress
          
          };
        currentPage++;
        crawl();
        
        })

      .catch((err) => {
        console.log(err);
      });
}


crawl();








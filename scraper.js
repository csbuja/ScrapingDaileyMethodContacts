var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var fs = require('fs');

var studioURL = 'http://www.thedaileymethod.com/studios/';
var FILE_PATH = "../TheDaileyMethod.csv";

var appendToFile = function(fpath,line,message){
	if (!message) {
		message = "The file was saved!";
	}
	fs.appendFile(fpath, line, function(err) {
						if(err) {
								console.log(err);
						} else {
								console.log(message);
						}
				}); 
}

var writeStudioInfo = function(url,filepath){
	request(url, function(error, response, html){
		if(!error) {
			console.log('made request to' + url);
			var $ = cheerio.load(html);
			var info = {
				"account" : null,
				"phone": null,
				"website" : url, 
				"address" : ""
			};

			var numCharsDescriptionToRemove = 7;
			info.phone = $(".phone").text().slice(numCharsDescriptionToRemove);
			$(".info-bar-address a ").children().each(function(i,v){info.address+=($(this).text());if(!i){info.address+=" "}});
			info.account =  "The Dailey Method - " + $(".location-title").text();

			//construct line with format : ACCOUNTNAME, Account Phone, WEBSITE, Address
			var CSV_line = "";
			CSV_line += info.account + ", ";
			CSV_line += info.phone + ", ";
			CSV_line += info.website + ", ";
			CSV_line += info.address + "\n";

			//append line
			if (info.account != "The Dailey Method - ") appendToFile(filepath,CSV_line, "Wrote info about " + info.account);
		}
	});
}

//append columns to file
appendToFile(FILE_PATH,'ACCOUNTNAME, Account Phone, WEBSITE, Address\n');

request(studioURL, function(error, response, html){
		if(!error){
				var $ = cheerio.load(html);
				var urlList = [];

				$(".city-studio-link").each(function(i){
					urlList.push($(this).attr("href"));
				});
				
				for (var i=0; i<urlList.length; ++i) 
				{
					writeStudioInfo(urlList[i],FILE_PATH);
				}
					
			}
		}
);


exports = module.exports = app;
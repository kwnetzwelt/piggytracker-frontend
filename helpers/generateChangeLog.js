var TurndownService = require('turndown');
var releaseNotes = require('../ReleaseNotes.json');
var turndownService = new TurndownService();
var fs = require('fs');


var content = "<h1>Changelog</h1>";

for (let index = 0; index < releaseNotes.versions.length; index++) {
    const element = releaseNotes.versions[index];
    content += "<h2>" + element.version + "</h2>" + element.content;
}

var markdown = turndownService.turndown(content);

fs.writeFileSync("CHANGELOG.md", markdown, {encoding:"utf-8"});
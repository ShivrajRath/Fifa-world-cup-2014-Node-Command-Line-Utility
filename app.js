// Creating phantom webpage
var page = require('webpage').create(),
    server = "",
    data = "";

var system = require('system');
var command = system.args[1];

bootstrap();
openPage();

/**
 * Sets the server path to fetch the results
 */
function bootstrap() {
    switch (true) {
        case /matches/.test(command):
            server = "http://worldcup.sfg.io/matches";
            break;

        case /today/.test(command):
            server = "http://worldcup.sfg.io/matches/today";
            break;

        case /current/.test(command):
            server = "http://worldcup.sfg.io/matches/current";
            break;
            //Verify these code    
        case /^(USA|MEX|HON|CRC|COL|ECU|BRA|CHI|URU|ARG|ALG|GHA|NGA|CIV|CMR|ENG|NED|BEL|GER|FRA|SUI|GRO|BIH|ITA|ESP|POR|GRE|IRN|KOR|JPN|AUS)$/.test(command):
            server = "http://worldcup.sfg.io/matches/country?fifa_code=" + command;
            break;
        case /-h/.test(command):
            {
                var conStr = "\nFifa 2014 HELP \n\nFollowing commands are supported at present\n\n";
                conStr += "matches : All match data, updated every minute \n";
                conStr += "today : Today's matches \n";
                conStr += "current : Current matches \n";
                conStr += "COUNTRY_CODE : Matches for any country, by entering their FIFA Code. E.x. USA. Team codes at http://www.fifa.com/worldcup/teams/ \n\n";
                console.log(conStr);
                phantom.exit();
            }
            break;
        default:
            {
                console.log("Sorry, this command could not be recognized. Please try 'fifa14 -h'");
                phantom.exit();
            }
    }
}

/**
 * Fetches the webpage from phantom and sends it to further processing
 */

function openPage() {
    page.open(server, 'get', data, function(status) {
        if (status !== 'success') {
            console.log('Unable to post!');
            phantom.exit();
        } else {
            try {
                processQuery(JSON.parse(page.plainText));
            } catch (err) {
                console.log("Sorry, there is some technical glitch at this time. Please try after sometime!!");
                phantom.exit();
            }
        }
    });
}

/**
 * Based on the query show appropriate results
 */

function processQuery(matches) {
    if (matches.length) {
        var match;
        var conStr = "";
        for (index in matches) {
            match = matches[index];
            // Undecided game
            if (match.home_team_tbd || match.away_team_tbd) {
                conStr = "Match No: " + match.match_number + " " + new Date(match.datetime) + " \t " + "Teams yet to be decided";
            } else if (match.status === "future") {
                conStr = "Match No: " + match.match_number + " " + new Date(match.datetime) + " \t " + match.home_team.country + " vs " + match.away_team.country + "\t To be played";
            } else if (match.status === "completed" || match.status === "in progress") {
                conStr = "Match No: " + match.match_number + " " + new Date(match.datetime) + " \t " + match.home_team.country + "(" + match.home_team.goals + ")" + " vs " + match.away_team.country + "(" + match.away_team.goals + ")" + "\t Winner: " + (match.winner === null? 'In Progress' : match.winner)  ;
            }
            console.log(conStr);
        }
    } else {
        console.log('No matches found for this query');
    }
    phantom.exit();
}

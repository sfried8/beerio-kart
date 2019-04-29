function Player(name1) {
    this.name = name1;
    this.points = 0;
    this.currentRoundPoints = 0;
    this.fromDict = [];
    this.toDistribute = 0;
    this.extraDict = [];
    this.addPoints = function(toAdd, fromWhom, pointNumber) {
        for (var i = 0; i < toAdd; i++) {
            this.currentRoundPoints += 1;
            this.fromDict[this.fromDict.length] = [fromWhom, pointNumber];
            if (
                (this.points + this.currentRoundPoints) % players.length ===
                0
            ) {
                console.log(
                    this.name +
                        "'s point #" +
                        (this.points + this.currentRoundPoints)
                );
                this.toDistribute += 1;
                this.extraDict[this.extraDict.length] =
                    this.points + this.currentRoundPoints;
            }
        }
    };
    this.getOpponents = function() {
        var opponents = [];
        for (var i = 0; i < players.length; i++) {
            if (players[i].name != this.name) {
                opponents[opponents.length] = players[i];
            }
        }
        return opponents;
    };
}
var players = [];
import * as Util from "./Util";
var roundNumber = 1;
function race(points) {
    document.getElementById("roundNumber").innerHTML = "Round " + roundNumber;
    roundNumber += 1;
    for (var i = 0; i < players.length; i++) {
        var p = players[i];
        p.points += p.currentRoundPoints;
        p.currentRoundPoints = 0;
        p.fromDict = [];
        p.addPoints(points[i], "race", 0);
        if ((roundNumber - 1) % 4 == 0) p.addPoints(1, "round", roundNumber);
    }
    while (true) {
        for (var i = 0; i < players.length; i++) {
            if (players[i].toDistribute > 0) {
                var opponents = players[i].getOpponents();
                for (var j = 0; j < opponents.length; j++) {
                    for (var k = 0; k < players[i].toDistribute; k++) {
                        opponents[j].addPoints(
                            1,
                            players[i].name,
                            players[i].extraDict[k]
                        );
                    }
                }
                players[i].toDistribute = 0;
                players[i].extraDict = [];
            }
        }

        if (roundIsOver(players)) {
            printScores(players);
            return;
        }
    }
}

function roundIsOver(players) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].toDistribute > 0) {
            return false;
        }
    }
    return true;
}

function sourceRound(roundNum) {
    var string = "1 point because it's the ";
    string += Util.addNumberEnding(roundNum);
    return string + " race";
}
function sourceRace(pointsArr) {
    var points = pointsArr.length;
    var string = points + " point";
    if (points > 1) {
        string += "s";
    }
    return string + " from the race";
}
function sourceOther(from, list) {
    var string = list.length + " point";
    if (list.length > 1) {
        string += "s";
    }
    string += " from " + from + "'s ";
    string += prettyPrintNumbers(list);
    string += " point";
    if (list.length > 1) {
        string += "s";
    }
    return string;
}
function printPoints(from, points) {
    if (from == "race") {
        return sourceRace(points);
    } else if (from == "round") {
        return sourceRound(points);
    } else {
        return sourceOther(from, points);
    }
}

function tallyUpPoints(player) {
    var opponents = player.getOpponents();
    var e = player.fromDict;
    var consolidated = [];
    var finalx = [];
    for (var i = 0; i < e.length; i++) {
        var entry = e[i];
        var source = consolidated[entry[0]];
        if (!source) {
            source = [];
        }
        source[source.length] = entry[1];
        consolidated[entry[0]] = source;
    }
    var race = consolidated["race"];
    if (race) {
        finalx[finalx.length] = ["race", race];
    }
    var round = consolidated["round"];
    if (round) {
        finalx[finalx.length] = ["round", round];
    }
    for (var i = 0; i < opponents.length; i++) {
        var other = consolidated[opponents[i].name];
        if (other) {
            finalx[finalx.length] = [opponents[i].name, other];
        }
    }
    return finalx;
}

function printAllPoints(player) {
    var finalx = tallyUpPoints(player);
    var string = "";
    for (var i = 0; i < finalx.length; i++) {
        string += printPoints(finalx[i][0], finalx[i][1]) + "<br/>";
    }
    return string;
}
function getPointSources(player) {
    var f = player.fromDict;
    sources = [];
    for (var i = 0; i < f.length; i++) {}
}
function printScores(players) {
    for (var i = 0; i < players.length; i++) {
        var playerDiv = document.getElementById(players[i].name);
        var curRound = playerDiv.getElementsByClassName("curRound")[0];
        var total = playerDiv.getElementsByClassName("total")[0];
        curRound.innerHTML =
            "This Round: " +
            players[i].currentRoundPoints +
            "<br/>" +
            printAllPoints(players[i]);
        total.innerHTML = players[i].currentRoundPoints + players[i].points;
    }
}

function startGame() {
    for (var i = 1; i <= 4; i++) {
        var p = document.getElementById("p" + i);
        if (p.value != "") players[i - 1] = new Player(p.value);
    }
    document.getElementById("initDiv").style.display = "none";
    var template = document.getElementById("playerTemplate").innerHTML;
    var playersContainer = document.getElementById("playersContainer");
    for (var i = 0; i < players.length; i++) {
        var playerDiv = document.createElement("table");
        playerDiv.classList.add("playerDiv");
        var name = players[i].name;
        playerDiv.id = name;
        playerDiv.innerHTML = template.replace("{name}", name);
        playersContainer.appendChild(playerDiv);
        var plusButton = playerDiv.getElementsByClassName("plus")[0];
        var minusButton = playerDiv.getElementsByClassName("minus")[0];
        plusButton.onclick = function() {
            var currentValue = this.parentElement.getElementsByClassName(
                "inPoint"
            )[0];
            currentValue.innerHTML = parseInt(currentValue.innerHTML) + 1;
        };
        minusButton.onclick = function() {
            var currentValue = this.parentElement.getElementsByClassName(
                "inPoint"
            )[0];
            currentValue.innerHTML =
                parseInt(currentValue.innerHTML) > 0
                    ? parseInt(currentValue.innerHTML) - 1
                    : 0;
        };
    }
    document.getElementById("mainDiv").style.display = "block";
}

function raceRound() {
    var points = [];
    for (var i = 0; i < players.length; i++) {
        var playerDiv = document.getElementById(players[i].name);
        var inPoint = playerDiv.getElementsByClassName("inPoint")[0];
        var pointValue = parseInt(inPoint.innerHTML);
        inPoint.innerHTML = "0";
        points[i] = pointValue;
    }
    race(points);
}

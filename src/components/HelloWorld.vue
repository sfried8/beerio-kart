<template>
  <div>
    <div v-if="roundNumber">

      <div>Round {{roundNumber}}</div>

      <div
        v-for="player in players"
        :key="player.name"
      >
        <player-component v-bind.sync="player"></player-component>
      </div>
      <button @click="round">GO</button>
    </div>
    <div v-else>
      <div
        v-for="player in players"
        :key="player.name"
      >
        {{player.name}}
      </div>
      <input
        type="text"
        v-model="pendingName"
        placeholder="Name"
      /><button @click="addPlayer">Add</button>
      <button @click="roundNumber = 1">start</button>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */

  import * as Util from "../Util";
  import PlayerComponent from "./PlayerComponent.vue";

  const sourceRound = roundNum =>
    `1 point because it's the ${Util.addNumberEnding(roundNum)} race`;

  const sourceRace = pointsArr =>
    `${pointsArr.length} ${Util.pluralize(
      "point",
      pointsArr.length
    )} from the race`;

  function sourceOther(from, list) {
    const pointPluralized = Util.pluralize("point", list.length);
    return `${
      list.length
    } ${pointPluralized} from ${from}'s ${Util.prettyPrintNumbers(
      list
    )} ${pointPluralized}`;
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

  function tallyUpPoints(player, opponents) {
    const consolidated = [];
    const finalx = [];
    for (let entry of player.fromDict) {
      const source = consolidated[entry[0]] || [];
      source.push(entry[1]);
      consolidated[entry[0]] = source;
    }
    const sources = ["race", "round", ...opponents.map(o => o.name)];
    for (let s of sources) {
      const source = consolidated[s];
      if (source) {
        finalx.push([s, source]);
      }
    }

    return finalx;
  }

  function printAllPoints(player, opponents) {
    return tallyUpPoints(player, opponents).map(x => printPoints(...x));
  }

  function printScores(players) {
    players.forEach(p => {
      p.messages = printAllPoints(p, players.filter(x => x !== p));
    });
  }

  import Player from "../Player.js";
  export default {
    components: {
      PlayerComponent
    },
    name: "HelloWorld",
    data() {
      return {
        players: [],
        roundNumber: 0,
        pendingName: ""
      };
    },
    methods: {
      addPlayer() {
        this.players.push(new Player(this.pendingName));
        this.pendingName = "";
      },
      round() {
        this.roundNumber += 1;
        for (let p of this.players) {
          const addedPoints = p.pendingPoints;
          p.pendingPoints = 0;
          p.points += p.currentRoundPoints;
          p.currentRoundPoints = 0;
          p.fromDict = [];
          p.addPoints(addedPoints, "race", 0, this.players.length);
          if ((this.roundNumber - 1) % 4 == 0)
            p.addPoints(1, "round", this.roundNumber - 1, this.players.length);
        }
        while (true) {
          for (let p of this.players) {
            if (p.toDistribute === 0) {
              continue;
            }
            this.players
              .filter(x => x !== p)
              .forEach(o => {
                for (let k = 0; k < p.toDistribute; k++) {
                  o.addPoints(1, p.name, p.extraDict[k], this.players.length);
                }
              });
            p.toDistribute = 0;
            p.extraDict = [];
          }

          if (!this.players.some(x => x.toDistribute > 0)) {
            printScores(this.players);
            return;
          }
        }
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

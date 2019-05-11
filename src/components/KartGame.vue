<template>
  <div>
    <div v-if="roundNumber">
      <div>Round {{roundNumber}}</div>

      <div v-for="player in players" :key="player.name">
        <player-component v-bind.sync="player"></player-component>
      </div>
      <button @click="undo" v-if="roundNumber > 1">undo</button>
      <br>
      <button @click="round">GO</button>
      <br>
      <br>
      <br>
      <button @click="newGame">New Game</button>
    </div>
    <div v-else>
      <div v-for="player in players" :key="player.name">{{player.name}}</div>
      <input type="text" @keypress.enter="addPlayer" v-model="pendingName" placeholder="Name">
      <button @click="addPlayer">Add</button>
      <button v-if="players.length" @click="startGame">start</button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

import * as Util from "../Util";
import PlayerComponent from "./PlayerComponent.vue";

function printScores(players) {
  players.forEach(p => {
    p.messages = p.currentRoundPoints.displayStrings();
  });
}

import Player from "../Player.js";
export default {
  components: {
    PlayerComponent
  },
  name: "KartGame",
  data() {
    return {
      // players: [new Player("Sam"), new Player("Aaron"), new Player("Derrick")],
      players: [],
      roundNumber: 0,
      pendingName: ""
    };
  },

  mounted() {
    const existingGameStr = window.localStorage.getItem("game");
    if (existingGameStr) {
      const existingGame = JSON.parse(existingGameStr);
      if (existingGame && existingGame.players && existingGame.roundNumber) {
        this.roundNumber = existingGame.roundNumber;

        existingGame.players.forEach(p => this.players.push(new Player(p)));
      }
    }
  },
  methods: {
    startGame() {
      this.players.forEach(p => (p.numPlayers = this.players.length));
      this.roundNumber = 1;
    },
    addPlayer() {
      this.players.push(new Player(this.pendingName));
      this.pendingName = "";
    },
    round() {
      this.roundNumber += 1;
      for (let p of this.players) {
        p.saveState();
        const addedPoints = p.pendingPoints;
        p.pendingPoints = 0;
        p.points.combineGroup(p.currentRoundPoints);
        p.currentRoundPoints.clear();
        p.addRacePoints(addedPoints);
        if ((this.roundNumber - 1) % 4 === 0) {
          p.addKanpaiPoint(this.roundNumber - 1);
        }
        p.colorLevel = p.extraDict.length;
      }
      while (true) {
        for (let p of this.players) {
          const opponents = this.players.filter(x => x !== p);

          while (p.extraDict.length) {
            const extraPoint = p.extraDict.shift();
            opponents.forEach(o => {
              o.addBonusPoint(p.name, extraPoint);
            });
          }
        }

        if (!this.players.some(x => x.extraDict.length > 0)) {
          printScores(this.players);
          this.saveGame();
          return;
        }
      }
    },
    undo() {
      this.roundNumber -= 1;
      for (let p of this.players) {
        p.undo();
      }
    },
    saveGame() {
      window.localStorage.setItem(
        "game",
        JSON.stringify({ roundNumber: this.roundNumber, players: this.players })
      );
    },
    newGame() {
      this.roundNumber = 0;
      this.pendingName = "";
      this.players = [];
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

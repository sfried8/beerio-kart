<template>
    <div class="home-container">
        <div class="text-center">
            Welcome to Beerio Kart!
        </div>

        <img src="/drunk-mario.png" />
        As the name suggests, Beerio Kart is a game to add some drinking to
        Mario Kart. By entering in your results from a game of Mario Kart, the
        app will apply some rules (outlined below) and each player will earn
        "points" each round.
        <br />
        <br />
        Each point corresponds to one "drink" that you must consume before the
        next race. This amount can be whatever you decide, such as one half-shot
        of liquor or 3 seconds of chugging beer.
        <br />
        <br />
        Keep in mind that for an 8 race game, you can expect to earn anywhere
        from 10 to 20 points, so plan accordingly! Please drink responsibly!
        <br />
        <br />
        <h4>The Rules</h4>
        <ul>
            <li>
                Each race, the player who ended last (among the other players)
                gains a point
            </li>
            <li>
                Any player that comes in 4th, 8th, or 12th place gains a point
            </li>
            <li>
                At the halfway point and after the final race, all players gain
                a point
                <ul>
                    <li>
                        For games of 12 races or more, this will be every 4
                        races
                    </li>
                </ul>
            </li>
            <li>
                After every 4* points a player gains, all other players gain a
                "catch-up" point to help level out the playing field
                <ul>
                    <li>
                        *For a 4 player game. This will trigger every 3 points
                        for a 3 player game, and every other point for a 2
                        player game
                    </li>
                    <li>This rule does not apply for 1 player games</li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: "Home"
});
</script>
<style lang="less">
.home-container {
    margin: 5vh 5vw;
    width: 90vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>

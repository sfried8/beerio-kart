import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: "/",
            name: "home",
            component: Home
        },
        {
            path: "/loadgame",
            name: "loadgame",
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import(/* webpackChunkName: "about" */ "./views/LoadGame.vue"),
            meta: { title: "Load Game" }
        },
        {
            path: "/game/:gameid",
            name: "game",
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import(
                    /* webpackChunkName: "about" */ "./components/KartGame.vue"
                )
        },
        {
            path: "/newgame",
            name: "newgame",
            component: () => import("./views/NewGame.vue"),
            meta: { title: "New Game" }
        },
        {
            path: "/player/:id",
            name: "player",
            component: () => import("./views/PlayerPage.vue")
        },
        {
            path: "/searchplayer",
            name: "searchplayer",
            component: () => import("./views/SearchPlayer.vue"),
            meta: { title: "Search Players" }
        }
    ]
});
router.afterEach((to, from) => {
    Vue.nextTick(() => {
        document.title =
            (to.meta.title ? to.meta.title + " • " : "") + "Beerio Kart";
    });
});
export default router;

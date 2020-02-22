import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
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
                import(/* webpackChunkName: "about" */ "./views/LoadGame.vue")
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
            component: () => import("./views/NewGame.vue")
        }
    ]
});

import Vue from 'vue'
import VueRouter from 'vue-router'
import Signup from '../views/Signup.vue'
import Login from '../views/Login.vue'
import Blackboard from '../views/Blackboard.vue'
import Profile from '../views/Profile.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Signup',
        component: Signup
    },
    {
        path: '/login',
        name: 'Login',
        component: Login

    },
    {
        path: '/blackboard',
        name: 'Blackboard',
        component: Blackboard

    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile

    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/About.vue')
    },

]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router
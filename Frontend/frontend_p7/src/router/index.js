import Vue from 'vue'
import VueRouter from 'vue-router'
import Signup from '../views/Signup.vue'
import Login from '../views/Login.vue'
import Blackboard from '../views/Blackboard.vue'
import Profile from '../views/Profile.vue'
import Logout from '../views/Logout.vue'

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
        path: '/logout',
        name: 'Logout',
        component: Logout

    },

]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        connexion: {
            isConnected: false,
            token: {},
            username: {},
            userRole: {},
        },
        posts: []

    },

    mutations: {
        CONNECTED(state, payload) {
            state.connexion.isConnected = true;
            state.connexion.token = payload.token;
            state.connexion.username = payload.username;
            state.connexion.userRole = payload.userRole;
        },
        DECONNECTED(state) {
            state.connexion.isConnected = false;
            state.connexion.token = {};
            state.connexion.username = {};
            state.connexion.userRole = {};
        }
    },
    actions: {
        connected(context, payload) {
            context.commit('CONNECTED', payload)
        },
        deconnected(context) {
            context.commit('DECONNECTED')
        }
    },
    modules: {}
})
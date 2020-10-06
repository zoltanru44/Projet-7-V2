<template>
  <v-app>
    <div id="app">
    <div id="nav">
      <router-link v-if="(isConnected()==false)" to="/"> Inscription |</router-link>
      <router-link v-if="(isConnected()==false)" to="/login"> Connexion </router-link>
      <router-link v-if="(isConnected()==true)" to="/blackboard"> Blackboard |</router-link>
      <router-link v-if="(isConnected()==true)" to="/profile"> Mon profil |</router-link>
      <router-link v-if="(isConnected()==true)" to="/logout"> Déconnexion </router-link>
     
    </div>
    <router-view/>
  </div>
  </v-app>
</template>
<script>
export default {
  

methods: {
  isConnected (){
    if (sessionStorage.getItem("user")) {
            return true
    }else {
      return false
    }
  }
}
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
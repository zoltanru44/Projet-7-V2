<template>
  <v-app>
    <div id="app">
    <div id="nav">
      <router-link to="/">Inscription</router-link> |
      <router-link to="/login">Connexion</router-link> |
      <router-link to="/blackboard">Blackboard</router-link> |
      <router-link to="/profile">Mon profil</router-link> |
      <router-link to="/logout">Déconnexion</router-link>
     
    </div>
    <router-view/>
  </div>
  </v-app>
</template>
<script>
export default {
  mounted (){
    this.isConnected();
    console.log(this.$store.state.connexion.isConnected);
  },

methods: {
  isConnected (){
    if (localStorage.getItem("user")) {
      let user = localStorage.getItem("user")
      let payload = {'token': user.token,'username': user.username, 'userRole': user.userRole}
            console.log(payload);
            this.$store.dispatch('connected',payload);
            return true
    }else {
      this.$store.dispatch('deconnected');
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
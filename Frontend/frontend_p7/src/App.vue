<template>
  <v-app>
    <div id="app">
      <img src="../public/logo_groupomania.png" id="logo_groupo_head" alt="logo_groupo">
    <div id="nav" class="elevation-10 rounded mx-auto my-5 center col-md-4 col-sm-6 center">
      <router-link v-if="(isConnected()==false)" to="/"> Inscription</router-link>
      <span v-if="(isConnected()==false)"> | </span>
      <router-link v-if="(isConnected()==false)" to="/login"> Connexion </router-link>
      <router-link v-if="(isConnected()==true)" to="/blackboard"> Blackboard</router-link>
      <span v-if="(isConnected()==true)"> | </span>
      <router-link v-if="(isConnected()==true)" to="/profile"> Mon profil</router-link>
      <span v-if="(isConnected()==true)"> | </span>
      <router-link v-if="(isConnected()==true)" to="/logout"> Déconnexion </router-link>
    </div>
    <router-view/>
    <!--FOOTER-->
    <div>
      <v-footer padless class="my-4">
        <v-row justify="center">
          <v-btn v-for="link in links" :key="link" test rounded class="my-2 mx-4">
            {{link}}
          </v-btn>
        </v-row>
      <v-col class="text-center py-4" cols="12">Groupomania - {{ new Date().getFullYear() }}</v-col>
    </v-footer>
    </div>
    
    
  </div>
  </v-app>
</template>
<script>
export default {
  data:()=>({
    links: [
      'PictForum',
      'A propos',
      'FAQ',
      'Mentions légales',
    ]
  }),

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
  padding-right: 1rem;
  padding-left: 1rem;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
#logo_groupo_head{
  max-width: 500px;
  width:50%
}
</style>
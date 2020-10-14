<template>
    <div class="login">
      <v-container class="col-md-8 elevation-10 rounded">
         <img alt="logo-groupomania" src="../assets/icon-above-font.png" class="logo_groupo">
        <h1>Bienvenue sur GroupoNetwork !</h1>
        <h2>Avant de pouvoir partager avec vos collègues, merci de vous connecter.</h2>
        <v-form  class="login__form col-md-4" id="login__form"
        ref="form"
        v-model="valid">
        
        <v-text-field
          v-model="user.username"
          :rules="usernameRules"
          label="Nom d'utilisateur"
          required></v-text-field>

          <v-text-field
          v-model="user.password"
          :rules="passwordRules"
          label="Mot de passe"
          required
          type="password"></v-text-field>


     <!--Btn + Snackbar-->
   <div class="text-center" id="btn_snackbar">
    <v-btn
      :disabled= !valid
      color="success"
      class="mr-4"
      @click="validate_async()"
    >
      Connexion
    </v-btn>

    <v-snackbar
      v-model="snackbar"
      v-bind:color=ClrSnack
      :multi-line="multiLine"
    >
      {{resultMessage}} 

      <template v-slot:action="{ attrs }">
        <v-btn
          v-bind="attrs"
          @click="snackbar = false"
        >
          Fermer
        </v-btn>
      </template>
    </v-snackbar>
  </div>
  </v-form>
        </v-container>
        
    </div>
</template>

<script>
//import User from "../models/user_login";
const axios = require('axios');
export default {
    name:"Login",
    data() {
      return {
      user: {
        username: "",
        password: "",
      },
      valid: false,
      snackbar: false,
      multiLine: true,
      ClrSnack:"grey",
      resultMessage:"",
      usernameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      passwordRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
    }
      },
      mounted (){
        console.log(this.$store.state.isConnected)
      },
    methods: {
      redirection () {
        setTimeout(function(){
                    document.location.href="/blackboard"
                }, 3000);
      },
      validate_async () {
        const newUser = {
          username: this.user.username,
          password: this.user.password,
        }
        const sendPostRequest = async () => {
          try {
            const resp = await axios.post('http://localhost:3000/api/auth/login', newUser);
            this.resultMessage=`Vous êtes connecté sous le nom de ${resp.data.username}`
            if (resp.status == 201) { //If connected
              this.ClrSnack = "success"
            let user= {
                userName : resp.data.username,
                user_id : resp.data.userId,
                user_role: resp.data.userRole,
                email : resp.data.email,
                token : resp.data.token
            }
            let user_string = JSON.stringify(user);
            sessionStorage.setItem("user", user_string);//Save user in sessionstorage
            setTimeout(function(){ //Time out to go to blackboard
                    document.location.href="/blackboard"
                }, 3000);
            return {message:`Vous êtes connecté sous le nom de ${resp.data.username}`}
            }
            if (resp.status ==200) {//Request is ok but can not be connected
              this.resultMessage= resp.data.err;
              this.ClrSnack = "error";
            }
            console.log(this.resultMessage);
          }
          catch (err){
            console.log(err);
          }
        }
        sendPostRequest ();
        this.snackbar = true;
      }
    }
}
</script>

<style lang="scss">

.login__form{
    margin:auto;
    &__group{
        display:flex;
        flex-direction:column;
        justify-content:center;
        margin: 10px;
        &__label{
            font-weight: 10px;
            margin-bottom: 3px;
        }
        &__input{
            text-align: center;
        }
    }
}


</style>
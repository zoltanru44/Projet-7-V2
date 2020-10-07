<template >
    <div class="signup">
        <v-container class="col-md-8 elevation-10 rounded">
        <img alt="logo-groupomania" src="../assets/icon-above-font.png" class="logo_groupo">
        <h1>Bienvenue sur GroupoNetwork !</h1>
        <h2>Avant de pouvoir partager avec vos collègues, merci de créer un compte.</h2>
        <v-form  class="signup__form col-md-4" id="signup__form"
        ref="form"
        v-model="valid"
        >
        <v-text-field
          v-model="user.email"
          :rules="emailRules"
          label="Email"
          required></v-text-field>

        <v-text-field
          v-model="user.username"
          :rules="usernameRules"
          label="Nom d'utilisateur"
          required></v-text-field>

          <v-text-field
          v-model="user.password"
          :rules="passwordRules"
          label="Mot de passe"
          required></v-text-field>
    <!--Btn + Snackbar-->
   <div class="text-center" id="btn_snackbar">
    <v-btn
      :disabled= !valid
      color="success"
      class="mr-4"
      @click="validate_signup()"
    >
      Valider votre inscription
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
//import User from "../models/user";

const axios = require('axios');
export default {
    name:"SignUp",
    data() {
      return {
      user: {
        username: '',
        email:'',
        password:''},
      valid: false,
      snackbar: false,
      multiLine: true,
      ClrSnack:"error",
      resultMessage:"",
      text: "",
      lazy:false,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      
      usernameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length <= 10) || 'Password must be less than 10 characters',
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
                }, 4000);
      },
      validate_signup () {
        const newUser = {
          username: this.user.username,
            email:this.user.email,
            password: this.user.password,
        }
        const sendPostRequest = async () => {
          try {
            const resp = await axios.post('http://localhost:3000/api/auth/signup', newUser);
            this.resultMessage=resp.data.message
            if (resp.status == 201) {
              this.ClrSnack = "success";
              this.login_delay()
            }
            if (resp.status ==200) {
              this.ClrSnack = "error";
            }
            console.log(resp.data.message);
            console.log(this.resultMessage);
          }
          catch (err){
            console.log(err);
          }
        }
        sendPostRequest ();
        this.snackbar = true;
      }, 
      login_delay () {
        const newUser = {
          username: this.user.username,
          password: this.user.password,
        }
        const sendPostRequest = async () => {
          try {
            const resp = await axios.post('http://localhost:3000/api/auth/login', newUser);
            this.resultMessage=`Vous êtes connecté sous le nom de ${resp.data.username}`
            if (resp.status == 201) {
              console.log(`Vous êtes connecté sous le nom de ${resp.data.username}`);
            let user= {
                userName : resp.data.username,
                user_id : resp.data.userId,
                user_role: resp.data.userRole,
                email : resp.data.email,
                token : resp.data.token
            }
            console.log(resp);
            let user_string = JSON.stringify(user);
            sessionStorage.setItem("user", user_string);
            console.log(sessionStorage.getItem("user"));
            let payload = {'token': resp.data.token,'username': resp.data.username, 'userRole': resp.data.userRole}
            console.log(payload);
            this.$store.dispatch('connected',payload);
            console.log(this.$store.state.connexion.isConnected);
            return {message:`Vous êtes connecté sous le nom de ${resp.data.username}`}
            }
            if (resp.status ==200) {
              this.resultMessage= resp.data.err;
              
            }
            console.log(resp.data.message);
            console.log(this.resultMessage);
          }
          catch (err){
            console.log(err);
          }
        }
        setTimeout(function(){
                    sendPostRequest ();
                }, 1000);
                setTimeout(function(){
                    document.location.href="/blackboard";
                }, 4000);
      }
    }
    
}
</script>

<style lang="scss">
.logo_groupo{
  width: 100%;
  max-width: 200px;
}
.signup__form{
    margin:auto;
    &__group{
        display:flex;
        flex-direction:column;
        justify-content:center;
        margin: 10px;
        &__label{
            font: size 10px;
            margin-bottom: 3px;
        }
        &__input{
            text-align: center;
            //border-radius: 25% 10%;
        }
    }
}
.btn_send{
    border-radius: 5%;
}

</style>

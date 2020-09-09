<template>
    <div class="login">
         <img alt="logo-groupomania" src="../assets/icon-above-font.png" class="logo_groupo">
        <h1>Bienvenue sur GroupoNetwork !</h1>
        <h2>Avant de pouvoir partager avec vos collègues, merci de vous connecter.</h2>
        <v-form  class="login__form" id="login__form"
        ref="form"
        v-model="valid"
        lazy-validation>
        <v-container>
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

  <v-btn
      :disabled="!valid"
      color="success"
      class="mr-4"
      @click="validate"
    >
      Validate
    </v-btn>
        </v-container>
        </v-form>
    </div>
</template>

<script>
import User from "../models/user_login";
const axios = require('axios');
export default {
    name:"Login",
    data() {
      return {
      user: new User("",""),
      valid: false,
      usernameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      passwordRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
    }
      }
      ,
    methods: {
        validate: function () {
        console.log(this.user);
        
        axios({
          method: 'post',
          url:'http://localhost:3000/api/auth/login',
          data:{
            username: this.user.username,
            password: this.user.password,
          }
        })
        .then(function(response){
          console.log(response);
          console.log(response.status);
          if (response.status == 201) {
            console.log(`Vous êtes connecté sous le nom de ${response.data.username}`);
            let user= {
                userName : response.data.username,
                user_id : response.data.userId,
                email : response.data.email,
                token : response.data.token
            }
            console.log(user);
            let user_string = JSON.stringify(user);
            localStorage.setItem("user", user_string);
            console.log(localStorage.getItem("user"));
            return {message:`Vous êtes connecté sous le nom de ${response.data.username}`}
          }
        })
        .catch(function(error){
          console.log(error);
          console.log(error.status);
          console.log(error.data.message);
         //TO DO : Afficher la snackbar quand il y a une erreur du server
          return {error: error}
        })
      },
    }
}
</script>

<style lang="scss">
.logo_groupo{
    width: 300px;
}
.login__form{
    width:30%;
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
    padding: 5px 5px;

}

</style>
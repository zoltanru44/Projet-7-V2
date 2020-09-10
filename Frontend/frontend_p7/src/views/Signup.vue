<template >
    <div class="signup">
        <img alt="logo-groupomania" src="../assets/icon-above-font.png" class="logo_groupo">
        <h1>Bienvenue sur GroupoNetwork !</h1>
        <h2>Avant de pouvoir partager avec vos collègues, merci de créer un compte.</h2>
        <v-form  class="signup__form" id="signup__form"
        ref="form"
        v-model="valid"
        lazy-validation>
        <v-container>
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

  <v-btn
      :disabled="!valid"
      color="success"
      class="mr-4"
      @click="validate"
    >
      Validate
    </v-btn>
    <!--Snackbar-->
    

    <v-snackbar
      v-model="snackbar" 
    >
      {{ text }}

        <template v-slot:action="{ attrs }">
        <v-btn
          color="red"
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>

    </v-snackbar>

    <BtnSnackbar buttonText="Valider le formulaire" snackbarText="snackbar ouvert" ClrSnack="success" @CustomEventName="validate"/>
        </v-container>
        </v-form>
    </div>
</template>

<script>
import User from "../models/user";
import BtnSnackbar from "../components/snackbar";
const axios = require('axios');
export default {
    name:"SignUp",
    data() {
      return {
      user: new User("","",""),
      valid: false,
      snackbar: false,
      error:"",
      text: "essai snackbar",
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
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
      components:{
        BtnSnackbar,
      },
    methods: {
        validate: function () {
        console.log(this.user);
        axios({
          method: 'post',
          url:'http://localhost:3000/api/auth/signup',
          data:{
            username: this.user.username,
            email:this.user.email,
            password: this.user.password,
          }
        })
        .then(function(response){
          console.log(response);
          console.log(response.status);
          if (response.status === 201) {
            console.log("utilisateur créé");
            return {message:"Utilisateur crée"}
          }
          else {
            this.error = response.data.message;
            console.log(this.error);
            return {}
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
.signup__form{
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

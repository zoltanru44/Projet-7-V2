<template >
    <div class="signup">
        <img alt="logo-groupomania" src="../assets/icon-above-font.png" class="logo_groupo">
        <h1>Bienvenue sur GroupoNetwork !</h1>
        <h2>Avant de pouvoir partager avec vos collègues, merci de créer un compte.</h2>
        <v-form  class="signup__form" id="signup__form"
        ref="form"
        v-model="valid"
        >
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

 
    <!--Btn + Snackbar-->
   <div class="text-center" id="btn_snackbar">
    <v-btn
      :disabled= !valid
      color="success"
      class="mr-4"
      @click="validate_async"
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

        </v-container>
        </v-form>
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
      components:{
        
      },
      
    methods: {
      validate_async () {
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
      }
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

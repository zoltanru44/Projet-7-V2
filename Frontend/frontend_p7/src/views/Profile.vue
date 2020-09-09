<template>
    <div class="mon_profil">
        <div class="v-container d-flex justify-content-around">
            <v-col cols="6" md="6">
                <v-form ref="form">
                    <v-text-field
                        v-model="user.username"
                        :rules="usernameRules"
                        label="Nom d'utilisateur">
                    </v-text-field>
                    <v-text-field
                        v-model="user.email"
                        :rules="emailRules"
                        label="Adresse mail">
                    </v-text-field>
                    <v-text-field
                        v-model="user.password"
                        :rules="oldPasswordRules"
                        label="Ancien mot de passe">
                    </v-text-field>
                    <v-text-field
                        v-model="user.new_password"
                        :rules="newPasswordRules"
                        label="Nouveau mot de passe">
                    </v-text-field>
                </v-form>
                <v-btn
      :disabled="!valid"
      color="success"
      class="mr-4"
      @click="UpdateUser"
    >
      Validate
    </v-btn>
            </v-col>
            <v-col cols="6" md="6">
                <v-avatar color="teal" size="48">
                    <span class="white--text headline">{{initiales}}</span>
                    <!--<v-icon dark>mdi-account-circle</v-icon>-->
                </v-avatar>
            </v-col>
        </div>
    </div>
</template>

<script>
import User from "../models/user_update";
const axios = require('axios');
export default {
    name: "profile",
    data () {
        return {
            user: new User("email","username","",""),
            initiales : null,
            valid : true,
            emailRules: [
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      usernameRules: [
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      oldPasswordRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
       newPasswordRules: [
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
        }
    },
    created () {
        this.GetUser ();
        this.GetInitiale ();
    },
    methods: {
        //Get two first letters for the avatar
        GetInitiale () {
            this.initiales = this.user.username.charAt(0) + this.user.username.charAt(1)
        },
        //Get user informations
        GetUser (){
            //Get id and token of the user with localstorage
            let localUser_string = localStorage.getItem("user");
            const localUser = JSON.parse(localUser_string);
            //Get asign v-model
            this.user.username = localUser.userName;
            this.user.email = localUser.email;
            console.log(localUser)

        },
        UpdateUser () {
            //Get information with localstorage
            let localUser_string = localStorage.getItem("user");
            const localUser = JSON.parse(localUser_string);
            //Get information from database
            axios({
          method: 'get',
          url:'http://localhost:3000/api/auth/getuser',
          params:{
            id: localUser.user_id,
          }
        })
        .then (function(response) {
            console.log(response)
        })
            //Compare if username/email and/or password are different
            //if (localUser.user_id != )
            //If difference --> Axios request to update SQL Database
            
            
            axios({
          method: 'put',
          url:'http://localhost:3000/api/auth/updateuser',
          data:{
              id : localUser.user_id,
                new_username : this.user.username,
                new_email : this.user.email,
                new_password : this.user.new_password,
                password : this.user.password,
          }
        })
        .then (function() {
            console.log("Utilisateur mis à jour")
            return {message:"utilisateur mis à jour"}
        })
            
        },
        DeleteSensitiveInformations () {
            //Delete informations from local storage
            //Use thi function when destroy
        },
        
    }
}
</script>
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
                @click="UpdateUser(),snackbar = true">
                Validate
                </v-btn>
                <v-btn
                color="error"
                class="mr-4"
                @click="DeleteUser(),snackbar = true">
                Supprimer compte
                </v-btn>
            </v-col>
            <v-col cols="6" md="6">
                <v-avatar color="teal" size="48">
                    <span class="white--text headline">{{initiales}}</span>
                    
                    <!--<v-icon dark>mdi-account-circle</v-icon>-->
                </v-avatar>
                <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="title">Vous êtes connectés sous le nom de {{user.username}}</v-list-item-title>
                            <v-list-item-subtitle>Compte <span v-if="user.role ==3">Utilisateur</span><span v-if="user.role ==2">Modérateur</span><span v-if="user.role ==1">Administrateur</span></v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
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
            user: new User("email","username","","","",""),
            initiales : null,
            valid : true,
            emailRules: [
        v => /.+@.+\..+/.test(v) || 'Merci d\'entrer un email valide',
      ],
      usernameRules: [
        v => (v && v.length <= 10) || 'Le nom d\'utilisateur doit contenir 10 caractères au maximum',
      ],
      oldPasswordRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'L\'ancien mot de passe doit contenir 10 caractères au maximum',
      ],
       newPasswordRules: [
        v => (v && v.length <= 10) || 'Le nouveau mot de passe doit contenir 10 caractères au maximum',
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
            //Get id and token of the user with sessionStorage
            let localUser_string = sessionStorage.getItem("user");
            const localUser = JSON.parse(localUser_string);
            //Get asign v-model
            this.user.username = localUser.userName;
            this.user.email = localUser.email;
            this.user.role = localUser.user_role;
            this.user.id = localUser.user_id;
            console.log(localUser)

        },
        UpdateUser () {
            //Get information with sessionStorage
            let localUser_string = sessionStorage.getItem("user");
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
          headers:{
              'authorization':`${localUser.token}`,
          },
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
        DeleteUser () {
        //Axios request
        const sendPostRequest = async () => {
            try {
                const resp = await axios({
                    method: 'delete',
                    url:'http://localhost:3000/api/auth/deleteUser',
                    headers:{'authorization':`${this.token}`},
                    params: {
                        userId: this.user.id,
                        password: this.user.password,
                    }
                })
                if (resp.status == 201) {
                    this.resultMessage=`Utilisateur supprimé !`;
                    this.dialog= false;
                    this.ClrSnack = "success";
                    console.log(`L'utilisateur a bien été supprimé`);
                    console.log(resp.data.message);
                    console.log(this.resultMessage);
                }else {
                    this.resultMessage="L'utilisateur n'a pas pu être supprimé, merci de recommencer ultérieurement.";
                }
            }
            catch (err){
                this.resultMessage="L'utilisateur n'a pas pu être supprimé, merci de recommencer ultérieurement.";
                console.log(err);
            }
        }
        sendPostRequest ();
        this.snackbar = true;
        setTimeout(function(){
                    document.location.href="/logout"
                }, 3000);
        },
        
    }
}
</script>
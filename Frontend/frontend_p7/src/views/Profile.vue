<template>
    <div class="mon_profil">
        <div class="v-container d-flex justify-content-around">
            <v-row
            align="center" justify="center">
            <v-col cols="10" md="5" order="2">
                <v-form ref="form"
                v-model="valid">
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
                        label="Mot de passe actuel">
                    </v-text-field>
                    <v-checkbox
                    v-model="changePsw"
                    label="Changer le mot de passe"
                    color="orange"></v-checkbox>
                    <v-text-field
                        v-if="changePsw ==true"
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
               
            </v-col>
            <v-col cols="10" md="6"  order="1" >
                <v-avatar color="teal" size="48">
                    <span class="white--text headline">{{initiales}}</span>
                    
                    <!--<v-icon dark>mdi-account-circle</v-icon>-->
                </v-avatar>
                <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="title">Vous êtes connectés sous le nom de <br/> {{user.username}}</v-list-item-title>
                            <v-list-item-subtitle>Compte <span v-if="user.role ==3">Utilisateur</span><span v-if="user.role ==2">Modérateur</span><span v-if="user.role ==1">Administrateur</span></v-list-item-subtitle>
                        <div cols="10" md="10">
                            <v-btn
                            :disabled="!valid"
                            color="error"
                            class="mr-4"
                            @click="dialog_deleteUser= true">
                            Supprimer le compte
                            </v-btn>
                        </div>
                        <!--Dialog box for delete user-->
                    <v-dialog v-model="dialog_deleteUser" max-width="350">
                        <v-card>
                            <v-card-title class="headline">Suppression du compte</v-card-title>
                            <v-card-text>Voulez-vous définitivement supprimer votre compte ?</v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="green darken-1" text @click="DeleteUser()">Oui</v-btn>
                                <v-btn color="red darken-1" text @click="dialog_deleteUser = false">Non</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                        </v-list-item-content>
                    </v-list-item>
            </v-col>
            </v-row>
            <v-snackbar
                      v-model="snackbar"
                      v-bind:color=ClrSnack
                      :multi-line="multiLine"
                    >
                    {{resultMessage}}
                      <span v-if="updateName == true">Nom d'utilisateur mis à jour<br/></span>
                      <span v-if="updateEmail == true">Email mis à jour<br/></span>
                      <span v-if="updatePassword == true">Mot de passe mis à jour</span>

                      <template v-slot:action="{ attrs }">
                        <v-btn
                          v-bind="attrs"
                          @click="snackbar = false, updateName=false, updateEmail=false, updatePassword=false, dialog_deleteUser=false">
                          Fermer
                        </v-btn>
                      </template>
                    </v-snackbar>
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
            changePsw: false,
            dialog_deleteUser: false,
            user: new User("email","username","","","",""),
            currentUser: new User("email","username","","","",""),
            initiales : null,
            snackbar: false,
            ClrSnack: "error",
            multiLine: true,
            valid : false,
            resultMessage:"",
            resultCode: "",
            updateName: false,
            updateEmail: false,
            updatePassword:false,
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
            //Get asign v-model on user and current information to detect changes on currentUser
            this.user.username = localUser.userName;
            this.user.email = localUser.email;
            this.user.role = localUser.user_role;
            this.user.id = localUser.user_id;
            this.currentUser.username = localUser.userName;
            this.currentUser.email = localUser.email;
            this.currentUser.role = localUser.user_role;
            this.currentUser.id = localUser.user_id;
        },
        UpdateUser () {
            //Get information with sessionStorage
            let localUser_string = sessionStorage.getItem("user");
            const localUser = JSON.parse(localUser_string);
            let awaitGetUser;
            let putInformations;
            //Get information from database
            const getUserInformations = async () => {
                return new Promise(resolve => {
                    try {
                        axios({
                          method: 'get',
                          url:'http://localhost:3000/api/auth/getuser',
                          params:{
                            id: localUser.user_id,
                          }
                        }).then(function(resp){
                            resolve(resp.data)
                        })
                    }
                    catch (err){
                        console.log(err)
                    }
                })
            }
            //Compare if username/email and/or password are different
            //if (localUser.user_id != )
            //If difference --> Axios request to update SQL Database
            const putUserInformation = async ()=> {
                return new Promise(resolve => {
                    try{
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
                        .then (function(response) {
                            console.log("Requête OK");
                            console.log(response.status);
                            console.log(response.message);
                            if (response.status==201){
                                sessionStorage.setItem("resultCode","201")
                                sessionStorage.setItem("resultMessage","Les données de l'utilisateur ont été mises à jour.")
                                resolve({message:"utilisateur mis à jour"}) 
                            }
                            else if (response.status == 202){
                                sessionStorage.setItem("resultCode","202")
                                sessionStorage.setItem("resultMessage","Mauvais mot de passe")
                                resolve({message:"Mauvais mot de passe, les données n'ont pas pu être mises à jour"}) 
                            }
                            else{
                                sessionStorage.setItem("resultCode","200")
                                sessionStorage.setItem("resultMessage","Les données de l'utilisateur n'ont pas pu être mises à jour. Merci de vérifier vos informations.")
                                resolve({message:"l'utilisateur n'a pas pu être mis à jour"}) 
                            }
                        })
                        .catch(function(error) {
                        console.log("Erreur lors de l'appel de la fonction" + error);
                        })
                    }
                    catch (err){
                            console.log(err)
                        }
                    })
            };
        
    const getThanPostUser = async function(){
        awaitGetUser = await getUserInformations();
        putInformations = await putUserInformation ();
        console.log(awaitGetUser);
        console.log(putInformations);
        return putInformations;
    }
    //Control if there is change to update
    if (this.user.username !== this.currentUser.username ||this.user.email !== this.currentUser.email || ( this.user.new_password!== "" && this.user.new_password !== this.user.password)){
        getThanPostUser().then(()=> {
            this.resultMessage=sessionStorage.getItem("resultMessage");
            this.resultCode=sessionStorage.getItem("resultCode");
            console.log(this.resultMessage);
            console.log(this.resultCode);
        //sessionStorage.removeItem("resultMessage");
        //Define who properties has been changed
        if (this.resultCode == 201){
            if(this.user.username !== this.currentUser.username){
                this.updateName = true;
                console.log(this.updateName);
                console.log("Changement du nom d'utilisateur");
                this.currentUser.username = this.user.username;
                this.snackbar = true;
                this.ClrSnack = "success";
            }
        if(this.user.email !== this.currentUser.email){
                this.updateEmail = true;
                console.log(this.updateEmail);
                console.log("Changement de l'adresse email");
                this.currentUser.email = this.user.email;
                this.snackbar = true;
                this.ClrSnack = "success";
            }
        if( this.user.new_password!== "" && this.user.new_password !== this.user.password){
                this.updatePassword = true;
                console.log(this.updatePassword);
                console.log("Changement du mot de passe");
                this.snackbar = true;
                this.ClrSnack = "success";
                this.user.new_password = "";
            }
            //Update local storage
            this.getUserDB();
        } else {
            this.snackbar = true;
            this.ClrSnack = "error";
        }
    })
    }else{
        this.resultMessage="Aucune donnée n'a été modifiée"
        console.log("Pas de modification à apporter")
    }
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
                    this.resultCode = 201;
                    this.dialog= false;
                    this.ClrSnack = "success";
                    console.log(`L'utilisateur a bien été supprimé`);
                    console.log(resp.data.message);
                    console.log(this.resultMessage);
                    setTimeout(function(){
                    document.location.href="/logout"
                }, 3000);
                }else {
                    this.resultMessage="L'utilisateur n'a pas pu être supprimé, merci de recommencer ultérieurement.";
                    this.ClrSnack = "error";
                }
            }
            catch (err){
                this.resultMessage="L'utilisateur n'a pas pu être supprimé, merci de recommencer ultérieurement.";
                console.log(err);
            }
        }
        sendPostRequest ();
        this.snackbar = true;
        },
    getUserDB () {
        const newUser = {
          username: this.user.username,
          password: this.user.password,
        }
        const sendPostRequest = async () => {
          try {
            const resp = await axios.post('http://localhost:3000/api/auth/login', newUser);
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
            this.user.password = "";
            return {message:`Mise à jour des données de ${resp.data.username}`}
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
        sendPostRequest ();
        setTimeout(function(){
                    document.location.href="/profile"
                }, 1500);
      }
    }
}
</script>
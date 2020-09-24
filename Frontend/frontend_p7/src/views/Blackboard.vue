<template>
    <div class="blackboard" id="Blackboard">
        <div class="loarding" v-if="loading">
            <h1>Chargement en cours</h1>
        </div>
        <div v-if="load" class="container" id="board">
            <v-form class="post_form elevation-10 rounded ma-6 center" ref="form" v-model="valid" >
                <v-container >
                    <v-text-field
                    v-model="newPost"
                    :rules="newPostRules"
                    label="Nouveau Post"
                    ></v-text-field>
                    <div class="text-center" id="btn_snackbar">
                    <v-btn
                      :disabled= !valid
                      color="success"
                      class="mr-4"
                      @click="sendNewPost"
                    >
                      Poster
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
            <div class="elevation-10 rounded ma-6">
                <div  v-for="item in posts" :key="item.id">
                <p class="body-1" >{{item.text}} </p>
                
               <!-- BTNs "modifier", "supprimer", "commenter" and post informations -->
                <v-row align="center">
                    <v-col cols="12" sm="2">
                        <div class="my-2">
                            <v-btn v-show="item.id_author == user.id" text small color="primary" @click="dialog_modif=true, IDpostToModify = item.id, textToModify=item.text">Modifier</v-btn>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="2">
                        <div class="my-2">
                            <v-btn v-show="item.id_author == user.id" text small color="error" @click.stop="dialog = true, IDpostToDelete = item.id">Supprimer</v-btn>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="2">
                        <div class="my-2">
                            <v-btn text small color="green" @click="dialog_comment = true, IDpostToComment = item.id">Commenter</v-btn>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <div class="my-2 mr-2">
                            <h3 class="text-right subtitle-2">Posté par {{item.username}} le {{item.date}} à {{item.time}}<span v-if="item.modification_date"><br/>modifié le {{item.modification_date}} à {{item.modification_time}}</span></h3> 
                        </div>
                    </v-col>
                    
                </v-row>
                 <div v-if="item.comments ==! undefined">
                     <div v-for="items in item.comments" :key="items.id">
                         <p >
                             {{items.text}}
                         </p>
                     </div>
                 </div>

                 <v-divider key="index"></v-divider>
                </div>
                <!--Dialog box for modify post-->
                    <v-dialog v-model="dialog_modif" max-width="400">
                        <v-card>
                            <v-card-title class="headline">Modification d'un post</v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-text-field label="Voulez-vous modifier ce post ?" v-model="textToModify" required></v-text-field>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="green darken-1" text @click="modifyPost()">Oui</v-btn>
                                <v-btn color="red darken-1" text @click="dialog_modif = false">Non</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                <!--Dialog box for delete post-->
                    <v-dialog v-model="dialog" max-width="290">
                        <v-card>
                            <v-card-title class="headline">Suppression d'un post</v-card-title>
                            <v-card-text>Voulez-vous définitivement supprimer ce post ?</v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="green darken-1" text @click="deletePost()">Oui</v-btn>
                                <v-btn color="red darken-1" text @click="dialog = false">Non</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <!--Dialog box for comment post-->
                    <v-dialog v-model="dialog_comment" max-width="600">
                        <v-card>
                            <v-card-title class="headline">Ajouter un commentaire</v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-text-field label="Ecrivez votre commentaire" v-model="commentToAdd" required></v-text-field>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="green darken-1" text @click="commentPost()">Commenter</v-btn>
                                <v-btn color="red darken-1" text @click="dialog_comment = false">Finalement je n'ai rien à ajouter</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import Post from "../models/post";
import User from "../models/user";
const axios = require('axios');
export default {
    data () {
        return {
            loading : false,
            load : false,
            posts: [],
            error: null,
            valid: false,
            snackbar: false,
            multiLine: true,
            modified_text: false,
            dialog: false,
            dialog_modif: false,
            dialog_comment: false,
            IDpostToDelete: "",
            IDpostToModify:"",
            IDpostToComment:"",
            commentToAdd:"",
            textToModify:"",
            input_modified_post: "",
            ClrSnack:"error",
            user: new User("email","username","id","","",""),
            newPost :"",
            resultMessage:"",
            newPostRules:[
                v => !!v || 'Merci d\'ajouter un texte pour poster un message'
            ],
        }
    },
    created () {
        this.getAllPosts ();
        this.loadPosts ();
        this.getUser();
    },
    methods: {
        //Method to get 5 last posts
        getAllPosts () {
            this.error = this.post = null;
            this.loading = true;
            this.load = false;
            localStorage.removeItem('commentsPost');
            const getPostRequest = async () => {
                try {
                    const resp = await axios.get('http://localhost:3000/api/publication/getPosts', {
                         params: {
                            number_of_posts: 5
                        }
                    })//Utiliser.then
                    if (resp.status == 201) {
                        //console.log(resp.data.allPosts);
                        localStorage.removeItem("posts");
                        console.log(resp.data);
                        for (let item of resp.data.allPosts) {
                        let newPost = new Post (
                            this.date = item.date,
                            this.time = item.time,
                            this.id = item.id,
                            this.id_author = item.id_author,
                            this.username = item.username,
                            this.modification_date = item.modification_date,
                            this.modification_time = item.modification_time,
                            this.text = item.text,
                            this.comments = item.comments
                        );
                        const postArrayString = localStorage.getItem("posts");
                        if (postArrayString) {
                            let postArray= JSON.parse(postArrayString);
                            postArray.push(newPost);
                            localStorage.setItem("posts", JSON.stringify(postArray));
                            console.log(postArray);
                        }
                        else {
                            let postArray = [];
                             postArray.push(newPost);
                            localStorage.setItem("posts", JSON.stringify(postArray));
                        }
                        }
                    }
                                this.loading = false;
                                this.load = true;
                            }
                catch (err){
                    console.log(err);
                }
            }
            /*const getcommentsRequest = async () => {
                try {
                    let posts = JSON.parse(localStorage.getItem("posts"));
                    console.log(posts);
                        for (let item of posts) {
                         const resp = await axios.get('http://localhost:3000/api/publication/getComments', {
                         params: {
                            number: 5,
                            id_post: item.id
                        }
                    })
                    if (resp.status ==201){
                        localStorage.removeItem("postsComs");
                        console.log(resp.data.commentArray);
                        item.comments = resp.data.commentArray;
                        let postComArrayString = localStorage.getItem("postsComs");
                        if (postComArrayString){
                            let postsComsArray= JSON.parse(postComArrayString);
                            postsComsArray.push(item);
                            localStorage.setItem("postsComs", JSON.stringify(postsComsArray));

                        }else {
                            let postsComsArray = [];
                            postsComsArray.push(item);
                            localStorage.setItem("postsComs", JSON.stringify(postsComsArray));
                        }
                    }
                    else{
                        let postComArrayString = localStorage.getItem("postsComs");
                        if (postComArrayString){
                            let postsComsArray= JSON.parse(postComArrayString);
                            postsComsArray.push(item);
                            localStorage.setItem("postsComs", JSON.stringify(postsComsArray));

                        }else {
                            let postsComsArray = [];
                            postsComsArray.push(item);
                            localStorage.setItem("postsComs", JSON.stringify(postsComsArray));
                        }
                    }
                }
                }
                catch (err){
                    console.log(err);
                }
            }*/

            getPostRequest();
           //getcommentsRequest();
           
        },
        /*getAllPostsPromise () {
            const getAllPostsPromises = function () {
                return new Promise(function(resolve, reject){
                    const resp = await axios.get('http://localhost:3000/api/publication/getPosts', {
                         params: {
                            number_of_posts: 5
                        }
                    })
                    if (resp.status == 201) {
                        //console.log(resp.data.allPosts);
                        localStorage.clear("posts");
                        for (let item of resp.data.allPosts) {
                        let newPost = new Post  (
                            this.date = item.date,
                            this.time = item.time,
                            this.id = item.id,
                            this.id_author = item.id_author,
                            this.username = item.username,
                            this.modification_date = item.modification_date,
                            this.modification_time = item.modification_time,
                            this.text = item.text,
                            this.comments = item.comments
                        );
                        const postArrayString = localStorage.getItem("posts");
                        if (postArrayString) {
                            let postArray= JSON.parse(postArrayString);
                            postArray.push(newPost);
                            localStorage.setItem("posts", JSON.stringify(postArray));
                            console.log(postArray);
                            
                        }
                        else {
                            let postArray = [];
                             postArray.push(newPost);
                            localStorage.setItem("posts", JSON.stringify(postArray));
                        }
                        }
                        resolve(resp);
                    }else {
                        reject(resp);
                    }

                })
            }
            getAllPostsPromises ()
            .then {

            }
            .catch {

            }
        },*/
        //METHOD TO LOAD POST FROM LOCALSTORAGE
        loadPosts () {
            console.log(JSON.parse(localStorage.getItem("posts")));
            const postsGetted= localStorage.getItem("posts");
            this.posts =JSON.parse(postsGetted);
            console.log(this.posts);
        },
        //METHOD TO SEND NEW POST 
        sendNewPost () {
        let date = new Date();// New date
        const newPost = {//body request
          id_user: this.user.id,
          text: this.newPost,
          publication_date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
          publication_time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
        };
        console.log(date);
        console.log(newPost)
        //Axios request
        const sendPostRequest = async () => {
            try {
                const resp = await axios.post('http://localhost:3000/api/publication/addPost', newPost);
                if (resp.status == 201) {
                    this.resultMessage=`Nouveau text posté !`;
                    this.ClrSnack = "success";
                    console.log(`nouveau post ajouté`);
                    console.log(resp.data.message);
                    console.log(this.resultMessage);
                }else {
                    this.resultMessage="Le message n'a pas pu être posté, merci de recommencer ultérieurement.";
                }
            }
            catch (err){
                this.resultMessage="Le message n'a pas pu être posté, merci de recommencer ultérieurement.";
                console.log(err);
            }
        }
        sendPostRequest ();
        this.snackbar = true;
        this.getAllPosts ();
        this.loadPosts ();
      },
      getUser (){
            //Get id and token of the user with localstorage
            console.log(localStorage.getItem("user"));
            let localUser_string = localStorage.getItem("user");
            const localUser = JSON.parse(localUser_string);
            //Get asign v-model
            this.user.username = localUser.userName;
            this.user.email = localUser.email;
            this.user.id = `${localUser.user_id}`;
            console.log(localUser);
        },
        modifyPost () {
        let date = new Date();// New date
        const newPost = {//body request
          id_user: this.user.id,
          id_post: this.IDpostToModify,
          new_text: this.textToModify,
          new_publication_date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
          new_publication_time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
        };
      
        console.log(newPost)
        //Axios request
        const sendPostRequest = async () => {
            try {
                const resp = await axios.put('http://localhost:3000/api/publication/updatePost', newPost);
                if (resp.status == 201) {
                    this.resultMessage=`Nouveau text posté !`;
                    this.ClrSnack = "success";
                    console.log(`nouveau post ajouté`);
                    console.log(resp.data.message);
                    console.log(this.resultMessage);
                }else {
                    this.resultMessage="Le message n'a pas pu être posté, merci de recommencer ultérieurement.";
                }
            }
            catch (err){
                this.resultMessage="Le message n'a pas pu être posté, merci de recommencer ultérieurement.";
                console.log(err);
            }
        }
        sendPostRequest ();
        this.dialog_modif = false;
        this.snackbar = true;
        this.getAllPosts ();
        this.loadPosts ();
        },
        deletePost () {
        //Axios request
        const sendPostRequest = async () => {
            try {
                const resp = await axios.delete('http://localhost:3000/api/publication/deletePost', {
                    params: {
                        id_user: this.user.id,
                        id_post: this.IDpostToDelete,
                    }
                });
                if (resp.status == 201) {
                    this.resultMessage=`Post supprimé !`;
                    this.dialog= false;
                    this.ClrSnack = "success";
                    console.log(`Le post a bien été supprimé`);
                    console.log(resp.data.message);
                    console.log(this.resultMessage);
                }else {
                    this.resultMessage="Le message n'a pas pu être supprimé, merci de recommencer ultérieurement.";
                }
            }
            catch (err){
                this.resultMessage="Le message n'a pas pu être supprimé, merci de recommencer ultérieurement.";
                console.log(err);
            }
        }
        sendPostRequest ();
        this.snackbar = true;
        this.getAllPosts ();
        this.loadPosts ();
        },
        commentPost () {
        let date = new Date();// New date
        //Axios request
        const sendPostRequest = async () => {
            try {
                const resp = await axios.post('http://localhost:3000/api/publication/addComment', {
                        id_user: this.user.id,
                        id_post: this.IDpostToComment,
                        text: this.commentToAdd,
                        publication_date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
                        publication_time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
                });
                if (resp.status == 201) {
                    this.resultMessage=`Commentaire ajouté !`;
                    this.dialog_comment= false;
                    this.ClrSnack = "success";
                    console.log(`Le commentaire à bien été ajouté`);
                    console.log(resp.data.message);
                    console.log(this.resultMessage);
                }else {
                    this.resultMessage="Le commentaire n'a pas pu être ajouté, merci de recommencer ultérieurement.";
                }
            }
            catch (err){
                this.resultMessage="Le commentaire n'a pas pu être ajouté, merci de recommencer ultérieurement.";
                console.log(err);
            }
        }
        sendPostRequest ();
        this.snackbar = true;
        this.getAllPosts ();
        this.loadPosts ();
        },

    }
}
</script>
<style>
#board {
    width: 75%;
}

</style>
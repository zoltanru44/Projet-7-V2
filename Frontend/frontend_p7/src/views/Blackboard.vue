<template>

    <div class="blackboard" id="Blackboard">
        <div class="loarding" v-if="loading">
            <h1>Chargement en cours</h1>
        </div>
        <div v-if="load" class="container" id="board">
            <!--Add new post-->
            <v-form class="post_form elevation-10 rounded ma-6 center" ref="form" v-model="valid" >
                <v-container >
                    <v-text-field
                    v-model="newPost"
                    :rules="newPostRules"
                    label="Nouveau Post"
                    class="inputNotRed"
                    ></v-text-field>
                    <div class="text-center" id="btn_snackbar">
                    <v-btn
                      :disabled= !valid
                      color="success"
                      class="mr-4"
                      @click="sendNewPost(),getNumberOfPosts(),getAllPosts(),shuffleArray()">
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
                          @click="snackbar = false">
                          Fermer
                        </v-btn>
                      </template>
                    </v-snackbar>
                    </div>
                </v-container>
            </v-form>
            <!--POSTS part-->
            <div class="elevation-10 rounded ma-6">
                <div v-for="(item, index) in posts" :key="item.id">
                    <v-card
                    class="mx-auto my-5 "
                    :style="[{'background-color':colorArray[index]}]"
                    dark
                    max-width="600">
                        <v-card-text class="headline font-weight-bold">"{{item.text}}"</v-card-text>
                        <v-card-actions>
                            <v-card-text>
                                <v-list-item key="item.id" class="grow">
                                <v-list-item-content>
                                    <v-list-item-title><p class="text-left font-italic info_post">Posté par {{item.username}} <br/>le {{item.date}} à {{item.time}}<span v-if="item.modification_date"><br/>modifié le {{item.modification_date}} à {{item.modification_time}}</span></p> </v-list-item-title>
                                </v-list-item-content>
                                <v-row align="center" justify="end">
                                  <v-icon class="mr-1" v-show="item.id_author == user.id || user.user_role ==1 || user.user_role ==2" @click="dialog_modif=true, IDpostToModify = item.id, textToModify=item.text">mdi-comment-edit-outline</v-icon>
                                  <span class="subheading"> </span>
                                  <v-icon class="mr-1" v-show="item.id_author == user.id || user.user_role ==1 || user.user_role ==2" @click.stop="dialog = true, IDpostToDelete = item.id">mdi-delete-forever-outline</v-icon>
                                  <span class="subheading"> </span>
                                  <v-icon class="mr-1" @click="dialog_comment = true, IDpostToComment = item.id, commentToAdd='' ">mdi-chat-plus-outline</v-icon>
                                  <span class="subheading mr-2"> </span>
                                </v-row>
                            </v-list-item>
                            <v-spacer></v-spacer>
                            <v-btn icon v-if="item.comments.length!==0" @click="commentActive=item.id, show =!show">
                              <v-icon>{{ (commentActive==item.id && show) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                            </v-btn>
                            </v-card-text>
                        </v-card-actions>
                        <!--Comments part -->
                        <v-expand-transition>
                          <div v-if="commentActive==item.id" v-show="show">
                              <div v-for="items in item.comments" :key="items.id">
                                  <v-divider></v-divider>
                            <v-card-text>
                              {{items.text}}
                            </v-card-text>
                            <v-card-text class="caption text-right">
                                <v-row align="center" justify="end">
                                  <v-icon class="mr-1" v-show="items.id_author == user.id || user.user_role ==1 || user.user_role ==2" @click="dialog_modif_com=true, IDcommentToModify = items.id, textToModify=items.text">mdi-comment-edit-outline</v-icon>
                                  <span class="subheading"> </span>
                                  <v-icon class="mr-1" v-show="items.id_author == user.id || user.user_role ==1 || user.user_role ==2" @click.stop="dialog_com = true, IDcommentToDelete = items.id">mdi-delete-forever-outline</v-icon>
                                  <span class="subheading"> </span>
                                </v-row>
                              <p>Commentaire posté par {{items.username}}, le {{items.date}} à {{items.time}}</p>
                            </v-card-text>
                              </div>
                          </div>
                        </v-expand-transition>
                    </v-card>
                    
                </div>
                <div class="text-center">
                        <v-btn class="mx-2" dark color="primary" v-if="(page>=2)" @click="page--,shuffleArray(), getAllPosts()">
                            <v-icon >mdi-arrow-left-circle-outline</v-icon>
                        </v-btn>
                        <v-btn class="mx-2" dark color="primary" @click="page++,shuffleArray(), getAllPosts()" v-if="page<(numberOfPosts/5)">
                            <v-icon >mdi-arrow-right-circle-outline </v-icon>
                        </v-btn>
                        <p>{{page}} sur {{maxPages}} - {{numberOfPosts}} Commentaires</p>
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
                                <v-btn color="red darken-1" text @click="dialog_com = false">Finalement je n'ai rien à ajouter</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <!--Dialog box for modify Comment-->
                    <v-dialog v-model="dialog_modif_com" max-width="400">
                        <v-card>
                            <v-card-title class="headline">Modification d'un commentaire</v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-text-field label="Voulez-vous modifier ce commentaire ?" v-model="textToModify" required></v-text-field>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="green darken-1" text @click="modifyComment()">Oui</v-btn>
                                <v-btn color="red darken-1" text @click="dialog_modif_com = false">Non</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                <!--Dialog box for delete Comment-->
                    <v-dialog v-model="dialog_com" max-width="290">
                        <v-card>
                            <v-card-title class="headline">Suppression d'un commentaire</v-card-title>
                            <v-card-text>Voulez-vous définitivement supprimer ce commentaire ?</v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="green darken-1" text @click="deleteComment()">Oui</v-btn>
                                <v-btn color="red darken-1" text @click="dialog_com = false">Non</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
            </div>
        </div>
    </div>
</template>

<script>
//import Post from "../models/post";
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
            dialog_com: false,
            dialog_modif_com:false,
            show:false,
            commentActive: null,
            IDpostToDelete: "",
            IDpostToModify:"",
            IDpostToComment:"",
            IDcommentToDelete: "",
            IDcommentToModify:"",
            commentToAdd:"",
            textToModify:"",
            input_modified_post: "",
            maxPages:"",
            numberOfPosts:"",
            page:"1",
            token:"",
            ClrSnack:"error",
            index:0,
            colorArray:["#1abc9c","#2ecc71","#3498db","#9b59b6","#34495e","#f1c40f","#16a085","#27ae60","#2980b9","#8e44ad","#2c3e50","#e67e22","#e74c3c","#7f8c8d"],
            user: new User("email","username","id","","",""),
            newPost :"",
            resultMessage:"",
            newPostRules:[
                v => !!v
            ],
        }
    },
        created () {
            this.shuffleArray();
            this.getNumberOfPosts();
            this.getAllPosts();
            this.getUser();
    },
    methods: {
        shuffleArray(){
            let array = this.colorArray;
            for (var i = array.length - 1; i > 0; i--) {  
            // Generate random number  
            var j = Math.floor(Math.random() * (i + 1)); 
            var temp = array[i]; 
            array[i] = array[j]; 
            array[j] = temp; 
            } 
            return array; 
        },
        //Method to get 5 last posts
        getNumberOfPosts (){
            //let postsGetted =[];
            const getPostRequest = async () => {
                return new Promise(resolve => {
                    try {
                    axios.get('http://localhost:3000/api/publication/getPosts', {
                         params: {
                            number_of_posts: 500,
                            page:1,
                        }
                    }).then(function(resp){
                        if (resp.status == 201) {
                        sessionStorage.removeItem("numberOfPosts");
                        let numberOfPosts = resp.data.allPostsCommentsGet.length
                        sessionStorage.setItem("numberOfPosts",numberOfPosts)
                        console.log(numberOfPosts);
                        resolve(numberOfPosts) ;
                    }
                    })
                    //Utiliser.then
                }
                catch (err){
                    console.log(err);
                }
                })
            }
            const loadPostFunction = async function(){
                let awaitReq = await getPostRequest();
                console.log(awaitReq);
                console.log(JSON.parse(sessionStorage.getItem("numberOfPosts")));
            }
           loadPostFunction ()
           .then(()=>{
               const postsGetted= sessionStorage.getItem("numberOfPosts");
                this.numberOfPosts =JSON.parse(postsGetted);
                this.maxPages = Math.ceil(this.numberOfPosts/5);
                console.log(this.numberOfPosts);
           }) 
        },
        getAllPosts () {
            this.error = this.post = null;
            this.loading = true;
            this.load = false;
            //let postsGetted =[];
            const getPostRequest = async () => {
                return new Promise(resolve => {
                    try {
                    axios.get('http://localhost:3000/api/publication/getPosts', {
                         params: {
                            number_of_posts: 5,
                            page:this.page,
                        }
                    }).then(function(resp){
                        if (resp.status == 201) {
                        sessionStorage.removeItem("posts");
                        sessionStorage.setItem("posts",JSON.stringify(resp.data.allPostsCommentsGet))
                        console.log(resp.data.allPostsCommentsGet);
                    }
                            console.log(JSON.parse(sessionStorage.getItem("posts")));
                            resolve(resp.data.allPostsCommentsGet) ;
                    })
                    //Utiliser.then
                    this.loading = false;
                    this.load = true;
                }
                catch (err){
                    console.log(err);
                }
                })
            }
            const loadPostFunction = async function(){
                let awaitReq = await getPostRequest();
                console.log(awaitReq);
                console.log(JSON.parse(sessionStorage.getItem("posts")));
            }
           loadPostFunction ()
           .then(()=>{
               const postsGetted= sessionStorage.getItem("posts");
                this.posts =JSON.parse(postsGetted);
                console.log(this.posts);
           }) 
        },
        //METHOD TO SEND NEW POST 
        sendNewPost () {
        let date = new Date();// New date
        const newPost = {//body request
          userId: this.user.id,
          text: this.newPost,
          publication_date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
          publication_time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
        };
        console.log(date);
        console.log(newPost)
        //Axios request
        const sendPostRequest = async () => {
            
            try {
                const resp = await axios({
                    method: 'post',
                    url:'http://localhost:3000/api/publication/addPost',
                    headers:{'authorization':`${this.token}`},
                    data: {newPost},
                })
                
                if (resp.status == 201) {
                    this.resultMessage=`Nouveau text posté !`;
                    this.newPost = "";
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
      },
        getUser (){
            //Get id and token of the user with sessionStorage
            let localUser_string = sessionStorage.getItem("user");
            const localUser = JSON.parse(localUser_string);
            //Get asign v-model
            this.user.username = localUser.userName;
            this.user.email = localUser.email;
            this.user.id = `${localUser.user_id}`;
            this.user.user_role = localUser.user_role;
            this.token = localUser.token
            console.log(localUser);
        },
        modifyPost () {
        let date = new Date();// New date
        const newPost = {//body request
          userId: this.user.id,
          id_post: this.IDpostToModify,
          new_text: this.textToModify,
          new_publication_date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
          new_publication_time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
        };
      
        console.log(newPost)
        //Axios request
        const sendPostRequest = async () => {
            try {
                const resp = await axios({
                    method: 'put',
                    url:'http://localhost:3000/api/publication/updatePost',
                    headers:{'authorization':`${this.token}`},
                    data: {newPost},
                })
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
        
        },
        deletePost () {
        //Axios request
        const sendPostRequest = async () => {
            try {
                const resp = await axios({
                    method: 'delete',
                    url:'http://localhost:3000/api/publication/deletePost',
                    headers:{'authorization':`${this.token}`},
                    params: {
                        userId: this.user.id,
                        id_post: this.IDpostToDelete,
                    }
                })
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
        },
        commentPost () {
        let date = new Date();// New date
        //Axios request
        const sendPostRequest = async () => {
            try {
                const resp = await axios.post('http://localhost:3000/api/publication/addComment', {
                        userId: this.user.id,
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
        
        },
        modifyComment () {
        let date = new Date();// New date
        const newComment = {//body request
          id_user: this.user.id,
          id_comment: this.IDcommentToModify,
          new_text: this.textToModify,
          new_comment_date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
          new_comment_time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
        };
      
        console.log(newComment)
        //Axios request
        const sendcommentRequest = async () => {
            try {
                
                const resp = await axios.put('http://localhost:3000/api/publication/updateComment', newComment);
                if (resp.status == 201) {
                    this.resultMessage=`Nouveau text posté !`;
                    this.ClrSnack = "success";
                    console.log(`Commentaire modifié`);
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
        sendcommentRequest ();
        this.dialog_modif_com = false;
        this.snackbar = true;
        //this.getAllPosts ();
        
        },
        deleteComment () {
        //Axios request
        const sendcommentRequest = async () => {
            try {
                const resp = await axios({
                    method: 'delete',
                    url:'http://localhost:3000/api/publication/deleteComment',
                    headers:{'authorization':`${this.token}`},
                    params: {
                        userId: this.user.id,
                        id_comment: this.IDcommentToDelete,
                    }
                })
                if (resp.status == 201) {
                    this.resultMessage=`Commentaire supprimé !`;
                    this.dialog_com= false;
                    this.ClrSnack = "success";
                    console.log(`Le commentaire a bien été supprimé`);
                    console.log(resp.data.message);
                    console.log(this.resultMessage);
                }else {
                    this.resultMessage="Le commentaire n'a pas pu être supprimé, merci de recommencer ultérieurement.";
                }
            }
            catch (err){
                this.resultMessage="Le commentairee n'a pas pu être supprimé, merci de recommencer ultérieurement.";
                console.log(err);
            }
        }
        sendcommentRequest ();
        this.dialog_com = false;
        this.snackbar = true;
        this.getAllPosts ();
        
        },
    },
}
</script>
<style>
#board {
    width: 75%;

}
.error--text{
    caret-color: black !important;
}
.info_post{
    font-size: 0.8rem !important;
}
</style>
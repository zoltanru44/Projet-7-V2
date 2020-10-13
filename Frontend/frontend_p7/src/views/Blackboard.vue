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
                        <!--Post comment btn + snackbar -->
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
                    class="mx-auto my-5"
                    :style="[{'background-color':colorArray[index]}]"
                    dark
                    >
                        <v-card-text class="headline font-weight-bold white--text">"{{item.text}}"</v-card-text>
                        <v-card-subtitle class="white--text">
                            <span v-if="item.username!==null">@{{item.username}}</span>
                            <span v-if="item.username==null">L'auteur à supprimé son compte,</span> 
                            <span v-if="!item.modification_date"><br/>publié il y a 
                            <!--all condition to display days/hours/minutes/seconds-->
                            <span v-if="GetTimeDifferenceNow(item.date, item.time).day">{{GetTimeDifferenceNow(item.date, item.time).day}} jours et </span>
                            <span v-if="GetTimeDifferenceNow(item.date, item.time).hour">{{GetTimeDifferenceNow(item.date, item.time).hour}} heure<span v-if="GetTimeDifferenceNow(item.date, item.time).hour>1">s</span></span>
                            <span v-if="GetTimeDifferenceNow(item.date, item.time).min && !GetTimeDifferenceNow(item.date, item.time).hour && !GetTimeDifferenceNow(item.date, item.time).day">{{GetTimeDifferenceNow(item.date, item.time).min}} minute<span v-if="GetTimeDifferenceNow(item.date, item.time).min>1">s</span> et </span>
                            <span v-if="GetTimeDifferenceNow(item.date, item.time).sec && !GetTimeDifferenceNow(item.date, item.time).hour && !GetTimeDifferenceNow(item.date, item.time).day">{{GetTimeDifferenceNow(item.date, item.time).sec}} secondes</span>
                            </span>
                            <span v-if="item.modification_date"><br/>modifié il y a 
                            <!--all condition to display days/hours/minutes/seconds-->
                            <span v-if="GetTimeDifferenceNow(item.modification_date, item.modification_time).day">{{GetTimeDifferenceNow(item.modification_date, item.modification_time).day}} jours et </span>
                            <span v-if="GetTimeDifferenceNow(item.modification_date, item.modification_time).hour">{{GetTimeDifferenceNow(item.modification_date, item.modification_time).hour}} heure<span v-if="GetTimeDifferenceNow(item.modification_date, item.modification_time).hour>1">s</span></span>
                            <span v-if="GetTimeDifferenceNow(item.modification_date, item.modification_time).min && !GetTimeDifferenceNow(item.modification_date, item.modification_time).hour && !GetTimeDifferenceNow(item.modification_date, item.modification_time).day">{{GetTimeDifferenceNow(item.modification_date, item.modification_time).min}} minute<span v-if="GetTimeDifferenceNow(item.modification_date, item.modification_time).min>1">s</span> et </span>
                            <span v-if="GetTimeDifferenceNow(item.modification_date, item.modification_time).sec && !GetTimeDifferenceNow(item.modification_date, item.modification_time).hour && !GetTimeDifferenceNow(item.modification_date, item.modification_time).day">{{GetTimeDifferenceNow(item.modification_date, item.modification_time).sec}} secondes</span>
                            </span>
                        </v-card-subtitle>
                        <!--btn to modify/delete or comment-->
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn v-show="item.id_author == user.id || user.user_role ==1 || user.user_role ==2" @click="dialog_modif=true, IDpostToModify = item.id, textToModify=item.text">
                                <v-icon v-show="item.id_author == user.id || user.user_role ==1 || user.user_role ==2" @click="dialog_modif=true, IDpostToModify = item.id, textToModify=item.text">mdi-comment-edit-outline</v-icon>
                            </v-btn>
                            <v-btn v-show="item.id_author == user.id || user.user_role ==1 || user.user_role ==2" @click.stop="dialog = true, IDpostToDelete = item.id">
                                <v-icon v-show="item.id_author == user.id || user.user_role ==1 || user.user_role ==2" @click.stop="dialog = true, IDpostToDelete = item.id">mdi-delete-forever-outline</v-icon>
                            </v-btn>
                            <v-btn @click="dialog_comment = true, IDpostToComment = item.id, commentToAdd='' ">
                                <v-icon @click="dialog_comment = true, IDpostToComment = item.id, commentToAdd='' ">mdi-chat-plus-outline</v-icon>
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn class="chevron_comment" icon v-if="item.comments.length!==0" @click="commentActive=item.id, show =!show">
                              <v-icon>{{ (commentActive==item.id && show) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                            </v-btn>
                        </v-card-actions>
                        <!--Comments part -->
                        <v-expand-transition>
                          <div v-show="commentActive==item.id && show">
                              <div v-for="items in item.comments" :key="items.id">
                                  <v-divider></v-divider>
                            <v-card-text>
                              {{items.text}}
                            </v-card-text>
                            <v-card-text class="caption text-right">
                                <!--btn to modify or delete comment-->
                                <v-row align="center" justify="end">
                                  <v-icon class="mr-1" v-show="items.id_author == user.id || user.user_role ==1 || user.user_role ==2" @click="dialog_modif_com=true, IDcommentToModify = items.id, textToModify=items.text">mdi-comment-edit-outline</v-icon>
                                  <span class="subheading"> </span>
                                  <v-icon class="mr-1" v-show="items.id_author == user.id || user.user_role ==1 || user.user_role ==2" @click.stop="dialog_com = true, IDcommentToDelete = items.id">mdi-delete-forever-outline</v-icon>
                                  <span class="subheading"> </span>
                                </v-row>
                              <p>
                                  <span v-if="items.username!==null">@{{items.username}}</span>
                            <span v-if="items.username==null">L'auteur à supprimé son compte,</span> 
                            <span v-if="!items.modification_date"><br/>publié il y a 
                            <!--all condition to display days/hours/minutes/seconds-->
                            <span v-if="GetTimeDifferenceNow(items.date, items.time).day">{{GetTimeDifferenceNow(items.date, items.time).day}} jours et </span>
                            <span v-if="GetTimeDifferenceNow(items.date, items.time).hour">{{GetTimeDifferenceNow(items.date, items.time).hour}} heure<span v-if="GetTimeDifferenceNow(items.date, items.time).hour>1">s</span></span>
                            <span v-if="GetTimeDifferenceNow(items.date, items.time).min && !GetTimeDifferenceNow(items.date, items.time).hour && !GetTimeDifferenceNow(items.date, items.time).day">{{GetTimeDifferenceNow(items.date, items.time).min}} minute<span v-if="GetTimeDifferenceNow(items.date, items.time).min>1">s</span> et </span>
                            <span v-if="GetTimeDifferenceNow(items.date, items.time).sec && !GetTimeDifferenceNow(items.date, items.time).hour && !GetTimeDifferenceNow(items.date, items.time).day">{{GetTimeDifferenceNow(items.date, items.time).sec}} secondes</span>
                            </span>
                            <span v-if="items.modification_date"><br/>modifié il y a 
                            <!--all condition to display days/hours/minutes/seconds-->
                            <span v-if="GetTimeDifferenceNow(items.modification_date, items.modification_time).day">{{GetTimeDifferenceNow(items.modification_date, items.modification_time).day}} jours et </span>
                            <span v-if="GetTimeDifferenceNow(items.modification_date, items.modification_time).hour">{{GetTimeDifferenceNow(items.modification_date, items.modification_time).hour}} heure<span v-if="GetTimeDifferenceNow(item.modification_date, item.modification_time).hour>1">s</span></span>
                            <span v-if="GetTimeDifferenceNow(items.modification_date, items.modification_time).min && !GetTimeDifferenceNow(items.modification_date, items.modification_time).hour && !GetTimeDifferenceNow(items.modification_date, items.modification_time).day">{{GetTimeDifferenceNow(items.modification_date, items.modification_time).min}} minute<span v-if="GetTimeDifferenceNow(items.modification_date, items.modification_time).min>1">s</span> et </span>
                            <span v-if="GetTimeDifferenceNow(items.modification_date, items.modification_time).sec && !GetTimeDifferenceNow(items.modification_date, items.modification_time).hour && !GetTimeDifferenceNow(items.modification_date, items.modification_time).day">{{GetTimeDifferenceNow(items.modification_date, items.modification_time).sec}} secondes</span>
                            </span>
                              </p>
                            </v-card-text>
                              </div>
                          </div>
                        </v-expand-transition>
                    </v-card>
                </div>
                <!--btn for other pages and number of posts-->
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
                                <v-btn color="green darken-1" text @click="modifyPost(), getAllPosts()">Oui</v-btn>
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
                                <v-btn color="green darken-1" text @click="deletePost(), getAllPosts ()">Oui</v-btn>
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
                                <v-btn color="green darken-1" text @click="commentPost(), getAllPosts ()">Commenter</v-btn>
                                <v-btn color="red darken-1" text @click="dialog_comment = false">Annuler</v-btn>
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
                                <v-btn color="green darken-1" text @click="modifyComment(), getAllPosts ()">Oui</v-btn>
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
                                <v-btn color="green darken-1" text @click="deleteComment(), getAllPosts ()">Oui</v-btn>
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
            commentShow: false,
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
            colorArray:["#333399","#6666cc","#19194d","#cc5200","#662900","#80000d"],//Color choice
            user: new User("email","username","id","","",""),
            newPost :"",
            resultMessage:"",
            newPostRules:[
                v => !!v
            ],
        }
    },
        created () {
            this.verificationLog();
            this.shuffleArray();
            this.getNumberOfPosts();
            this.getAllPosts();
            this.getUser();
    },
    methods: {
        //Method to shuffle color array of posts
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
        //Method to verify if there is a user in session storage
       verificationLog(){
           if (sessionStorage.getItem("user")){
               console.log("l'utilisateur est bien connecté")
           }
           else{
               document.location.href="/"
           }
       },
       //method to calculate difference of time between a date / time and now
       GetTimeDifferenceNow(date, time){
           let diff = {};
           let postDate = date;
           let postTime = time;
           let completeDate = new Date (postDate + " " + postTime);
           let tmp = new Date - completeDate;
           tmp = Math.floor(tmp/1000);             // number of seconds
            diff.sec = tmp % 60;
            tmp = Math.floor((tmp-diff.sec)/60);    // number of minutes
            if (tmp>=1){
                diff.min = tmp % 60;
            }
            tmp = Math.floor((tmp-diff.min)/60);    // number of hours
            if (tmp>=1){
                diff.hour = tmp % 24;
            }
            tmp = Math.floor((tmp-diff.hour)/24); // number of days
            if (tmp>=1){
                diff.day = tmp;
            }  
           return diff;
       },
        //Method with promise to get all posts and return the total number of posts
        getNumberOfPosts (){
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
                        resolve(numberOfPosts) ;
                    }
                    })
                }
                catch (err){
                    console.log(err);
                }
                })
            }
            const loadPostFunction = async function(){
                let awaitReq = await getPostRequest();
                return awaitReq
            }
           loadPostFunction ()
           .then(()=>{
               const postsGetted= sessionStorage.getItem("numberOfPosts");
                this.numberOfPosts =JSON.parse(postsGetted);
                this.maxPages = Math.ceil(this.numberOfPosts/5);
           })
        },
        //Method to get last 5 posts
        getAllPosts () {
            this.error = this.post = null;
            this.loading = true;
            this.load = false;
            //promise to get 5 last posts and comments
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
                    }
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
                return awaitReq
            }
           loadPostFunction ()
           .then(()=>{
               //Store in session storage
               const postsGetted= sessionStorage.getItem("posts");
                this.posts =JSON.parse(postsGetted);
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
      //Method to get user informations from session storage
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
        },
        //Method to modify a post in database
        modifyPost () {
        let date = new Date();// New date
        const newPost = {//body request
          userId: this.user.id,
          id_post: this.IDpostToModify,
          new_text: this.textToModify,
          new_publication_date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
          new_publication_time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
        };
        //Axios PUT request
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
        this.getAllPosts ();//To actualise all posts
        
        },
        //Method to delete a post
        deletePost () {
        //Axios DELETE request
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
        //Method to add a comment for a post
        commentPost () {
        let date = new Date();// New date
        //Axios POST request
        const sendPostRequest = async () => {
            const newComment={
                userId: this.user.id,
                id_post: this.IDpostToComment,
                text: this.commentToAdd,
                publication_date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
                publication_time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
            }
            try {
                const resp = await axios({
                    method: 'post',
                    url:'http://localhost:3000/api/publication/addComment',
                    headers:{'authorization':`${this.token}`},
                    data: {
                        newComment
                    }
                })
                if (resp.status == 201) { //If OK
                    this.resultMessage=`Commentaire ajouté !`;
                    this.dialog_comment= false;
                    this.ClrSnack = "success";
                }else {
                    this.ClrSnack = "error";
                    this.resultMessage="Le commentaire n'a pas pu être ajouté, merci de recommencer ultérieurement.";
                }
            }
            catch (err){
                this.ClrSnack = "error";
                this.resultMessage="Le commentaire n'a malheureusement pas pu être ajouté, merci de recommencer ultérieurement.";
                console.log(err);
            }
        }
        sendPostRequest ();
        this.snackbar = true;
        this.getAllPosts ();
        },
        //Method to modify a comment
        modifyComment () {
        let date = new Date();// New date
        const newComment = {//body request
          userId: this.user.id,
          id_comment: this.IDcommentToModify,
          new_text: this.textToModify,
          new_comment_date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
          new_comment_time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
        };
        console.log(newComment)
        //Axios PUT request
        const sendcommentRequest = async () => {
            try {
                const resp = await axios({
                    method: 'put',
                    url:'http://localhost:3000/api/publication/updateComment',
                    headers:{'authorization':`${this.token}`},
                    data: {
                        newComment
                    }
                })
                if (resp.status == 201) {
                    this.resultMessage=`Nouveau texte posté !`;
                    this.ClrSnack = "success";
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
        
        },
        //Method to delete a comment
        deleteComment () {
        //Axios DELETE request
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

.error--text{
    caret-color: black !important;
}
.info_post{
    font-size: 0.8rem !important;
}
.v-snack__wrapper{
    min-width: 50px !important;
}
.v-btn{
    min-width: 15px !important;
}
.chevron_comment{
    position: absolute;
    right: 5px;
}
</style>
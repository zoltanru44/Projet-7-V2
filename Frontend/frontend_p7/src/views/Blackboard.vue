<template>
    <div class="blackboard" id="Blackboard">
        <div class="loarding" v-if="loading">
            <h1>Chargement en cours</h1>
        </div>
        <div v-if="load" class="content">
            <div v-for="item in posts" :key="item.text">
                <h2>Posté par {{item.username}} le {{item.date}} à {{item.time}}, <span v-if="item.modification_date">modifié le {{item.modification_date}} à {{item.modification_time}}</span></h2> 
                 <p>{{item.text}}</p>
                 <div v-if="isComments">
                     <p>Il y a des commentaires</p>
                 </div>
                 <v-divider key="index"></v-divider>
                 </div>
        </div>
        


    </div>
</template>

<script>
const axios = require('axios');
export default {
    data () {
        return {
            loading : false,
            load : false,
            posts: [],
            comments: [],
            isComments: false,
            error: null,
            
        }
    },
    created () {
        this.getAllPosts ();
        this.loadPosts ();
    },
    methods: {
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
                    })
                    if (resp.status == 201) {
                        console.log(resp.data.rows);
                        localStorage.setItem("posts", JSON.stringify(resp.data.rows));
                        const postsGetted= localStorage.getItem("posts");
                        const posts =JSON.parse(postsGetted);
                        
                        
                       
                        for (let item of posts) {
                            const getComments = async () => {
                                const res = await axios.get('http://localhost:3000/api/publication/getComments', {
                                    params: {
                                        id_post : item.id,
                                        number: 5
                                    }
                                })
                                if (res.status == 201) {
                                    this.isComments = true;
                                    let commentsGetted = localStorage.getItem(`commentsPost`);
                                    if (commentsGetted) {
                                        console.log(commentsGetted);
                                        
                                        let commentsGettedArray = JSON.parse(commentsGetted);
                                        console.log(res.data.rows);
                                        console.log(commentsGettedArray);
                                        commentsGettedArray.push(res.data.rows);
                                        localStorage.setItem('commentsPost', JSON.stringify(commentsGettedArray));
                                        console.log(commentsGetted);
                                    }else {
                                        console.log(res.data.rows);
                                        let commentsGettedArray = res.data.rows;
                                        localStorage.setItem('commentsPost', JSON.stringify(commentsGettedArray));
                                        console.log(commentsGetted);
                                    }
                                    
                                    
                                    
                                    
                                }
                                if (res.status == 200){
                                    
                                    console.log(`Pas de commentaire trouvé pour le post ${item.id}`);
                                }
                                
                                console.log(item.id);
                                console.log(this.comments)
                                this.loading = false;
                                this.load = true;
                                
                                
                                //To get comments from local storage
                                
                            }
                            getComments ();
                        }
                        
                        
                    }
                }
                catch (err){
                    console.log(err);
                }
            }
            getPostRequest();
        },
        loadPosts () {
            const postsGetted= localStorage.getItem("posts");
            this.posts =JSON.parse(postsGetted);
            const commentsGetted = localStorage.getItem("comments");
            this.comments = JSON.parse(commentsGetted); //TODO Await get comments to load
            console.log(this.comments);
        }
        
    }
}
</script>
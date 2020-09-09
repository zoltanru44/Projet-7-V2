<template>
    <div class="blackboard" id="Blackboard">
        <div class="loarding" v-if="loading">
            <h1>Chargement en cours</h1>
        </div>
        <div v-if="load" class="content">
            <div v-for="item in posts" :key="item.text">
                <h2>Posté par {{item.id_author}} le {{item.modification_date}}</h2> 
                 <p>{{item.text}}</p>
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
            error: null,
            
        }
    },
    created () {
        this.getAllPosts (),
        this.displayAllPosts ()
    },
    methods: {
        getAllPosts () {
            this.error = this.post = null;
            this.loading = true;
            this.load = false;
            axios.get('http://localhost:3000/api/publication/getPosts', {
                params: {
                    number_of_posts: 5
                }
            })
            .then (function(response) {
                console.log(response.data.rows);
                localStorage.setItem("posts", JSON.stringify(response.data.rows))
            })
            .catch(function (error) {
                console.log(error);
            })
        },
        displayAllPosts () {
            this.loading = false;
            this.load = true;
            const postsGetted= localStorage.getItem("posts");
            console.log(JSON.parse(postsGetted));
            this.posts =JSON.parse(postsGetted);


        }
    }
}
</script>
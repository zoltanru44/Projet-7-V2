<template>
    <div class="blackboard" id="Blackboard">
        <div class="loarding" v-if="loading">
            <h1>Chargement en cours</h1>
        </div>
        <div v-if="load" class="content">
<h2 v-for="item in posts" :key="item.text"> {{item.text}}</h2>
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
        this.getAllPosts ()
    },
    methods: {
        getAllPosts () {
            this.error = this.post = null
            this.loading = true
            this.load = true
            axios.get('http://localhost:3000/api/publication/getPosts', {
                params: {
                    number_of_posts: 5
                }
            })
            .then (function(response) {
                //this.load = true;
                //this.loading = false;
                console.log(response.data.rows)
                localStorage.setItem("posts", response.data.row)
                return
            })
            .catch(function (error) {
                console.log(error);
            })
            this.posts= localStorage.getItem("posts")
            console.log(this.posts)
        }
        
    }
}
</script>
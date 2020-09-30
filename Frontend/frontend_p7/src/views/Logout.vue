<template>
<div>
    <div v-if="connected==true">
        <h2>Vous allez être déconnecté du réseau social</h2>
        <button @click="deconnexion()">Retenter la déconnexion</button>
    </div>
    
    <h2 v-if="connected==false">Merci de votre visite, <br/>Vous êtes maintenant déconnecté, vous allez être redirigé vers la page d'accueil</h2>
    
</div>
</template>
<script>
export default {
    data () {
        return{
             connected : false
        }
    },
    mounted(){
        this.deconnexion();
    },

    methods: {
        deconnexion(){
            sessionStorage.removeItem("posts");
             sessionStorage.removeItem("postsComs");
            sessionStorage.removeItem("user");
            console.log("déconnection page")
            console.log(sessionStorage.getItem("user"));
            if (sessionStorage.getItem("user")){
                this.connected = true;
                console.log("Vous êtes encore connecté");
            }
            else{
                this.$store.dispatch('deconnected');
                this.connected = false;
                console.log("Vous êtes maintenant déconnecté, vous allez être redirigé vers la page d'accueil")
                console.log(this.$store.state.connexion.isConnected);
                setTimeout(function(){
                    document.location.href="/"
                }, 3000);
            }
        },
    }
}
</script>
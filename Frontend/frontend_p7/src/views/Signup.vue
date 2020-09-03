<template >
    <div class="signup">
        <img alt="logo-groupomania" src="../assets/icon-above-font.png" class="logo_groupo">
        <h1>Bienvenue sur GroupoNetwork !</h1>
        <h2>Avant de pouvoir partager avec vos collègues, merci de créer un compte.</h2>
        <form class="signup__form" id="signup__form">
            <div class="signup__form__group">
                <label for="form_email" class="signup__form__group__label">Adresse mail</label>
                <input type="text" class="signup__form__group__input" id="form_email" v-model="user.email" name="email">
            </div>
            <div class="signup__form__group">
                <label for="form_username" class="signup__form__group__label">Nom d'utilisateur</label>
                <input type="text" class="signup__form__group__input" id="form_username" v-model="user.username" name="username">
            </div>
            <div class="signup__form__group">
                <label for="form_password" class="signup__form__group__label">Mot de passe</label>
                <input type="text" class="signup__form__group__input" id="form_password" v-model="user.password" name="password">
            </div>
            <p>
                <button @:click="submitForm" >Créer un compte</button>
            </p>
        </form>
    </div>
</template>

<script>
import user from "../models/user";
export default {
    name:"SignUp",
    data () {
        return {
          user: new user("","",""),
            successful : false,
        }
    },
    methods: {
        submitForm: function (){
                console.log ("c'est cliqué")
            if (this.email && this.username && this.password) {
                console.log(this.email);
            }
            else {
                console.log ("problème de remplissage")
            }
        }
    }
}
</script>

<style lang="scss">
.logo_groupo{
    width: 300px;
}
.signup__form{
    width:30%;
    margin:auto;
    &__group{
        display:flex;
        flex-direction:column;
        justify-content:center;
        margin: 10px;
        &__label{
            font: size 10px;
            margin-bottom: 3px;
        }
        &__input{
            text-align: center;
            //border-radius: 25% 10%;
        }
    }
}
.btn_send{
    border-radius: 5%;
    padding: 5px 5px;

}

</style>

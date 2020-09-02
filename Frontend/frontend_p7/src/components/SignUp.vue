<template >
    <div class="signup">
        <img alt="logo-groupomania" src="../assets/icon-above-font.png" class="logo_groupo">
        <h1>Bienvenue sur GroupoNetwork !</h1>
        <h2>Avant de pouvoir partager avec vos collègues, merci de créer un compte.</h2>
        <form class="signup__form">
            <div class="signup__form__group">
                <label for="form_email" class="signup__form__group__label">Adresse mail</label>
                <input type="text" class="signup__form__group__input" placeholder="michel.dupont@gmail.com" id="form_email">
            </div>
            <div class="signup__form__group">
                <label for="form_username" class="signup__form__group__label">Nom d'utilisateur</label>
                <input type="text" class="signup__form__group__input" placeholder="michel_dupont" id="form_username">
            </div>
            <div class="signup__form__group">
                <label for="form_password" class="signup__form__group__label">Mot de passe</label>
                <input type="text" class="signup__form__group__input" placeholder="********" id="form_password">
            </div>
        </form>
    </div>
</template>

<script>

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
        &__label{
font: size 10px;;
        }
        &__input{
text-align: center;
        }
    }
}

</style>
<template>
  <div class="text-center">
    <v-btn
      v-bind:color=ClrSnack
      @click="EmitCustomEvent"
      
    >
      {{buttonText}}
    </v-btn>

    <v-snackbar
      v-model="snackbar"
      :multi-line="multiLine"
    >
      {{ snackbarText }}

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
</template>
<script>
  export default {
      name: 'BtnSnackbar',
    data: () => ({
      multiLine: true,
      snackbar: false,
    }),
    props:['buttonText', 'snackbarText', 'ClrSnack', 'ClickFunction'],
    methods: {
        EmitCustomEvent () {
            this.snackbar = true;
            this.$emit('CustomEventName')
        }
    }
  }
</script>
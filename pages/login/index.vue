<template>
  <v-container fluid fill-height>
    
    <div class="text-center ma-2">
      <v-snackbar v-model="snackbar">
        {{ text }}

        <template v-slot:action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>

    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Login form</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <form ref="form" @submit.prevent="login">
              <v-text-field
                v-model="email"
                name="email"
                label="Email"
                type="email"
                placeholder="Email"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                name="password"
                label="Password"
                type="password"
                placeholder="password"
                required
              ></v-text-field>
              <v-btn type="submit" class="mt-4" color="primary" value="log in"
                >Login</v-btn
              >
            </form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <loading-overlay :is-loading="loading"/>
  </v-container>
</template>

<script>
import LoadingOverlay from '~/components/UiComponents/LoadingOverlay.vue'
export default {
  layout: 'auth',

  components: {
      LoadingOverlay,
    },

  data: () => {
    return {
      email: '',
      password: '',
      snackbar: false,
      text: `Hello, I'm a snackbar`,
      loading: false,
    }
  },

  mounted() {
    if (this.$auth.loggedIn) {
      this.$router.push('/')
    }
  },
  methods: {
    async login() {
      try {
        this.loading = true
        let response = await this.$auth.loginWith('laravelSanctum', {
          data: {
            email: this.email,
            password: this.password,
          },
        })
        this.$auth.$storage.setLocalStorage('access_token', response.data.access_token)
        this.$toast.success("Login Success");
        this.loading = false
        await this.$router.push('/')
      } catch (error) {
        console.log(error.response.data.message)
        this.loading = false
        this.snackbar = true
        this.text = error.response.data.message
      }
    },
  },
}
</script>

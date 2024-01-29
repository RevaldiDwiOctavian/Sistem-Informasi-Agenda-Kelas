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
      <v-card width="1000" elevation="24" rounded="100">
        <v-row justify="center">
          <v-col cols="12" sm="6" class="pa-10">
            <v-card-text class="text-h4">
              Sistem Informasi Agenda Kelas
            </v-card-text>
            <v-spacer></v-spacer>
            <v-card-text class="text-h5">
              SMK Tutwuri Handayani Cimahi
            </v-card-text>
            <div class="d-flex justify-center">
              <v-list-item-avatar tile size="256">
                <img src="iconDashboard.png" alt="icon" />
              </v-list-item-avatar>
            </div>
          </v-col>
          <v-col cols="12" sm="6" class="pa-10">
            <v-card-text class="text-h4"> Selamat Datang! </v-card-text>
            <v-spacer></v-spacer>
            <v-card-text class="text-h5 font-weight-light">
              Silahkan login untuk mengakses sistem.
            </v-card-text>
            <v-spacer></v-spacer>
            <v-card-text class="text-h5 font-weight-noraml text-center">
              Login
            </v-card-text>
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
                <v-btn type="submit" block class="mt-4" color="primary" value="log in"
                  >Masuk</v-btn
                >
              </form>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </v-layout>
    <loading-overlay :is-loading="loading" />
  </v-container>
</template>

<script>
import LoadingOverlay from '~/components/UiComponents/LoadingOverlay.vue'
export default {
  layout: 'auth',
  auth: 'guest',
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
        this.$auth.$storage.setLocalStorage(
          'access_token',
          response.data.access_token
        )
        this.$toast.success('Login Success')
        this.loading = false
        await this.$router.push('/').catch()
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

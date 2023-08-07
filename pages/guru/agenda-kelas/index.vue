<template>
  <v-card class="mx-auto" max-width="100%">
    <v-card-title class="text-h6 font-weight-regular justify-space-between">
      <span>{{ currentTitle }}</span>
      <v-avatar
        color="primary lighten-2"
        class="subheading white--text"
        size="24"
        >{{ step }}</v-avatar
      >
    </v-card-title>

    <v-window v-model="step">
      <v-window-item :value="1">
        <v-card-text>
          <v-select
            :items="['asd']"
            label="Rombongan Belajar*"
            required
          ></v-select>
          <span class="text-caption grey--text text--darken-1">
            Pilih Rombongan Belajar yang saat ini sedang melakukan pembelajaran.
          </span>
        </v-card-text>
        <v-card-text>
          <v-select :items="['asd']" label="Pembelajaran*" required></v-select>
          <span class="text-caption grey--text text--darken-1">
            Pilih Pembelajaran yang saat ini sedang dilakukan.
          </span>
        </v-card-text>
        <v-card-text>
          <v-textarea
            name="input-7-1"
            filled
            label="Materi Pembelajaran"
            auto-grow
            hint="Isi Materi Pembelajaran yang sedang diajarkan."
          ></v-textarea>
        </v-card-text>
      </v-window-item>

      <v-window-item :value="2">
        <v-card-text>
          <v-text-field label="Password" type="password"></v-text-field>
          <v-text-field label="Confirm Password" type="password"></v-text-field>
          <span class="text-caption grey--text text--darken-1">
            Please enter a password for your account
          </span>
        </v-card-text>
      </v-window-item>

      <v-window-item :value="3">
        <div class="pa-4 text-center">
          <v-img
            class="mb-4"
            contain
            height="128"
            src="https://cdn.vuetifyjs.com/images/logos/v.svg"
          ></v-img>
          <h3 class="text-h6 font-weight-light mb-2">Welcome to Vuetify</h3>
          <span class="text-caption grey--text">Thanks for signing up!</span>
        </div>
      </v-window-item>
    </v-window>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn :disabled="step === 1" text @click="step--"> Back </v-btn>
      <v-spacer></v-spacer>
      <v-btn :disabled="step === 3" color="primary" depressed @click="step++">
        Next
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    step: 1,
  }),

  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return 'Informasi Agenda Kelas'
        case 2:
          return 'Siswa Absen'
        default:
          return 'Konfirmasi'
      }
    },
  },
}
</script>

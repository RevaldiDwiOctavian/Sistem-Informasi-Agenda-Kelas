<template>
  <div>
    <v-row>
      <v-col cols="12" sm="12">
        <v-card class="pa-4 text-h5" tile>Kelas {{ rombelInfo.nama_rombel }}</v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="4">
        <v-card class="mx-auto" outlined>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline mb-4">Wali Kelas</div>
              <v-list-item-title class="text-h6 mb-1">
                {{ rombelInfo.wali_kelas }}
              </v-list-item-title>
            </v-list-item-content>

            <v-list-item-avatar tile size="80">
              <v-icon size="80">mdi-account</v-icon>
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card class="mx-auto" outlined>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline mb-4">Jumlah Siswa</div>
              <v-list-item-title class="text-h6 mb-1">
                {{ rombelInfo.jumlah_siswa }}
              </v-list-item-title>
            </v-list-item-content>

            <v-list-item-avatar tile size="80">
              <v-icon size="80">mdi-account-school</v-icon>
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card class="mx-auto" outlined>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline mb-4">Jurusan</div>
              <v-list-item-title class="text-h6 mb-1">
                {{ rombelInfo.jurusan }}
              </v-list-item-title>
            </v-list-item-content>

            <v-list-item-avatar tile size="80">
              <v-icon size="80">mdi-school</v-icon>
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            {{ title }}
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="siswaList"
            item-key="id"
            class="elevation-1"
            :search="search"
            :loading="loading"
            loading-text="Loading... Please wait"
            fixed-header
            height="400px"
          >
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: this.$auth.user.data,
      loading: false,
      search: '',
      headers: [
        {
          text: 'NISN',
          align: 'start',
          sortable: true,
          value: 'nisn',
        },
        { text: 'Nama Siswa', value: 'nama_lengkap' },
        { text: 'Jenis Kelamin', value: 'jenis_kelamin' },
      ],
      title: 'Daftar Siswa',
      siswaList: [],
      rombelInfo: {},
    }
  },

  async mounted() {
    this.fetchRombelInfo()
    this.fetchSiswaThisRombel()
  },

  methods: {
    async fetchRombelInfo() {
      if (this.$auth.loggedIn && this.$auth.strategy.token.get()) {
        const token = localStorage.getItem('auth.access_token')

        this.$axios.setHeader('Authorization', `Bearer ${token}`)
        this.$axios
          .get(`/walikelas/rombel/${this.user.id}`)
          .then((response) => {
            this.rombelInfo = response.data.data
          })
          .catch((error) => {
            console.error('Gagal mengambil data agenda kelas:', error.message)
            this.error = error.message
          })
      }
    },

    async fetchSiswaThisRombel(){
      if (this.$auth.loggedIn && this.$auth.strategy.token.get()) {
        const token = localStorage.getItem('auth.access_token')
        this.loading = true

        this.$axios.setHeader('Authorization', `Bearer ${token}`)
        this.$axios
          .get(`/walikelas/siswa/${this.user.rombel_id}`)
          .then((response) => {
            this.siswaList = response.data.data
            this.loading = false
          })
          .catch((error) => {
            console.error('Gagal mengambil data agenda kelas:', error.message)
            this.error = error.message
            this.loading = false
          })
      }else{
        this.loading = false
      }
    }
  }
}
</script>

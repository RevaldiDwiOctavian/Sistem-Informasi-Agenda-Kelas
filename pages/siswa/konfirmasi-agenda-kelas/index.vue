<template>
  <div>
    <v-row>
      <v-col cols="12" sm="12">
        <v-card class="pa-4" tile>Konfirmasi Agenda Kelas</v-card>
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
            :items="data"
            item-key="id"
            class="elevation-1"
            :search="search"
            :loading="loading"
            no-data-text="Semua agenda kelas sudah dikonfirmasi. Terimakasih ya"
            loading-text="Loading... Please wait"
            fixed-header
            height="25%"
          >
            <template v-slot:[`item.aksi`]="{ item }">
              <v-row>
                <v-col>
                  <v-btn
                    color="success"
                    small
                    fab
                    :loading="loadingSave"
                    @click="item.id"
                  >
                    <v-icon> mdi-check </v-icon>
                    {{ item.id }}
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn
                    color="error"
                    small
                    fab
                    :loading="loadingSave"
                    @click="item.id"
                  >
                    <v-icon> mdi-close </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </template>
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

      title: 'Agenda Kelas Belum Dikonfirmasi',
      search: '',
      headers: [
        {
          text: 'Tanggal Agenda',
          align: 'start',
          sortable: true,
          value: 'tanggal_agenda_kelas',
        },
        { text: 'Rombongan Belajar', value: 'nama_rombel' },
        { text: 'Jurusan', value: 'jurusan' },
        { text: 'Guru', value: 'nama_guru' },
        { text: 'NUPTK', value: 'nuptk' },
        { text: 'Mata Pelajaran', value: 'mata_pelajaran' },
        { text: 'Konfirmasi Kehadiran', value: 'aksi' },
      ],
      data: [],
      loading: false,
      loadingSave: false
    }
  },

  async mounted() {
    this.fetchUnconfirmedAgendaKelas()
  },

  methods: {
    async fetchUnconfirmedAgendaKelas() {
      if (this.$auth.loggedIn && this.$auth.strategy.token.get()) {
        const token = localStorage.getItem('auth.access_token')
        this.loading = true

        this.$axios.setHeader('Authorization', `Bearer ${token}`)
        this.$axios
          .get(`/siswa/agenda-kelas/${this.user.rombel_id}`)
          .then((response) => {
            this.data = response.data.data
            this.loading = false
          })
          .catch((error) => {
            console.error('Gagal mengambil data agenda kelas:', error.message)
            this.error = error.message
            this.loading = false
          })
      } else {
        this.loading = false
      }
    },

    async confirmAgendaHadir(){
      if (this.$auth.loggedIn && this.$auth.strategy.token.get()) {
        const token = localStorage.getItem('auth.access_token')
        this.loadingSave = true

        this.$axios.setHeader('Authorization', `Bearer ${token}`)
        this.$axios
          .get(`/siswa/agenda-kelas/${this.user.rombel_id}/konfirmasi-hadir`)
          .then((response) => {
            this.$toast.success('Agenda Kelas berhasil dikonfirmasi hadir')
            this.loadingSave = false
            this.fetchUnconfirmedAgendaKelas()
          })
          .catch((error) => {
            this.$toast.error('Sepertinya server sedang mengalami masalah.')
            this.error = error.message
            this.loadingSave = false
          })
      } else {
        this.loadingSave = false
      }
    },

    async confirmAgendaTidakHadir(){
      if (this.$auth.loggedIn && this.$auth.strategy.token.get()) {
        const token = localStorage.getItem('auth.access_token')
        this.loadingSave = true

        this.$axios.setHeader('Authorization', `Bearer ${token}`)
        this.$axios
          .get(`/siswa/agenda-kelas/${this.user.rombel_id}/konfirmasi-tidak-hadir`)
          .then((response) => {
            this.$toast.success('Agenda Kelas berhasil dikonfirmasi tidak hadir')
            this.loadingSave = false
            this.fetchUnconfirmedAgendaKelas()
          })
          .catch((error) => {
            this.$toast.error('Sepertinya server sedang mengalami masalah.')
            this.error = error.message
            this.loadingSave = false
          })
      } else {
        this.loadingSave = false
      }
    }
  },
}
</script>

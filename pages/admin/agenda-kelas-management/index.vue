<template>
  <div>
    <v-row>
      <v-col cols="auto">
        <v-dialog
          v-model="dialogDelete"
          transition="dialog-top-transition"
          persistent
          max-width="600"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="error"
              v-bind="attrs"
              v-on="on"
              :disabled="selected.length === 0"
              ><v-icon>mdi-delete</v-icon> Hapus</v-btn
            >
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Hapus Guru</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <div class="text-h6">
                  Apakah anda yakin ingin menghapus guru terpilih?
                </div>
              </v-container>
              <small>* Setelah dihapus, guru tidak dapat dikembalikan.</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="dialogDelete = false">Batal</v-btn>
              <v-btn text @click="handleDelete">Ya</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
            v-model="selected"
            :headers="headers"
            :items="data"
            item-key="id"
            show-select
            class="elevation-1"
            :search="search"
            :loading="loading"
            loading-text="Loading... Please wait"
            fixed-header
            height="400px"
          >
            <template v-slot:[`item.created_at`]="{ item }">
              {{ formatDate(item.created_at) }}
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
      dialogDelete: false,

      selected: [],
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
      ],
      title: 'Daftar Agenda Kelas',
      data: [],
      loading: false,
    }
  },

  async mounted() {
    this.fetchAgendaKelasData()
  },

  methods: {
    async fetchAgendaKelasData() {
      if (this.$auth.loggedIn && this.$auth.strategy.token.get()) {
        const token = localStorage.getItem('auth.access_token')
        this.loading = true

        this.$axios.setHeader('Authorization', `Bearer ${token}`)
        this.$axios
          .get('/admin/agenda-kelas')
          .then((response) => {
            this.data = response.data.data
            console.log(response)
            this.loading = false
          })
          .catch((error) => {
            console.error('Gagal mengambil data agenda kelas:', error.message)
            this.error = error.message
            console.log(response)
            this.loading = false
          })
      } else {
        this.loading = false
      }
    },

    async delete(id) {
      const token = localStorage.getItem('auth.access_token')
      const headers = {
        Authorization: `Bearer ${token}`,
      }

      try {
        const response = await this.$axios.delete(`/admin/agenda-kelas/${id}`, {
          headers,
        })

        if (response.status === 200) {
          this.$toast.success('Agenda Kelas berhasil dihapus')
          this.fetchAgendaKelasData() // Perbarui daftar siswa setelah berhasil menghapus
          this.selected = []
        } else {
          console.log(response)
          this.$toast.error('Gagal menghapus agnda kelas, silahkan coba lagi.')
        }
      } catch (error) {
        console.error('Error:', error)
        this.$toast.error(
          'Terjadi kesalahan saat menghapus agenda kelas, silakan coba lagi.'
        )
      }
    },

    formatDate(value) {
        return new Date(value).toLocaleDateString()
      },

    async handleDelete() {
      this.selected.map((item) => {
        this.delete(item.id)
      })
      this.fetchAgendaKelasData()
      this.dialogDelete = false
      this.selected = []
    },
  },
}
</script>

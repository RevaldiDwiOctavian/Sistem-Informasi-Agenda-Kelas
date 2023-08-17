<template>
  <div>
    <v-row>
      <v-col cols="12" sm="12">
        <v-card class="pa-4 text-h5" tile> Kelola Agenda Kelas </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto" class="mt-4">
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
                  Apakah anda yakin ingin menghapus agenda kelas terpilih?
                </div>
              </v-container>
              <small
                >* Setelah dihapus, agenda kelas tidak dapat
                dikembalikan.</small
              >
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="dialogDelete = false">Batal</v-btn>
              <v-btn text @click="handleDelete">Ya</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>

        <v-col class="d-flex" cols="auto">
        <v-select
          :items="tahunOptions"
          v-model="exportPayload.tahun"
          label="Tahun"
        ></v-select>
      </v-col>
      <v-col class="d-flex" cols="auto">
        <v-select
          :items="bulanOptions"
          v-model="exportPayload.bulan"
          label="Bulan"
        ></v-select>
      </v-col>
      <v-col class="d-flex" cols="auto">
        <v-select
          :items="rombelOptions"
          item-text="nama_rombel"
          item-value="id"
          v-model="exportPayload.rombelId"
          label="Rombel"
        ></v-select>
      </v-col>

      <v-col class="d-flex mt-3" cols="auto">
        <v-btn color="success" @click="exportAgendaKelas">
          <v-icon left> mdi-file-export </v-icon>
          Ekspor Agenda Kelas
        </v-btn>
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
            multi-sort
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
import download from 'downloadjs'
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
        { text: 'Kehadiran Guru', value: 'kehadiran_guru' },
      ],
      title: 'Daftar Agenda Kelas',
      data: [],
      loading: false,

      rombelOptions: [],
      tahunOptions: [2023, 2024],
      bulanOptions: [
        {
          text: 'Januari',
          value: 1,
        },
        {
          text: 'Februari',
          value: 2,
        },
        {
          text: 'Maret',
          value: 3,
        },
        {
          text: 'April',
          value: 4,
        },
        {
          text: 'Mei',
          value: 5,
        },
        {
          text: 'Juni',
          value: 6,
        },
        {
          text: 'Juli',
          value: 7,
        },
        {
          text: 'Agustus',
          value: 8,
        },
        {
          text: 'September',
          value: 9,
        },
        {
          text: 'Oktober',
          value: 10,
        },
        {
          text: 'November',
          value: 11,
        },
        {
          text: 'Desember',
          value: 12,
        },
      ],

      file: {
        file_name: null,
      },

      exportPayload: {
        bulan: null,
        bulanText: null,
        tahun: null,
        rombelId: null,
        rombelName: null,
      },
    }
  },

  async mounted() {
    this.fetchAgendaKelasData()
    this.fetchRombelData()
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

    async fetchRombelData() {
      if (this.$auth.loggedIn && this.$auth.strategy.token.get()) {
        const token = localStorage.getItem('auth.access_token')
        this.loading = true

        this.$axios.setHeader('Authorization', `Bearer ${token}`)
        this.$axios
          .get('/admin/rombels')
          .then((response) => {
            this.rombelOptions = response.data.data
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

    async exportAgendaKelas() {
      console.log(this.exportPayload)
      switch (this.exportPayload.bulan) {
        case 1:
          this.exportPayload.bulanText = 'Januari'
          break
        case 2:
          this.exportPayload.bulanText = 'Februari'
          break
        case 3:
          this.exportPayload.bulanText = 'Maret'
          break
        case 4:
          this.exportPayload.bulanText = 'April'
          break
        case 5:
          this.exportPayload.bulanText = 'Mei'
          break
        case 6:
          this.exportPayload.bulanText = 'Juni'
          break
        case 7:
          this.exportPayload.bulanText = 'Juli'
          break
        case 8:
          this.exportPayload.bulanText = 'Agustus'
          break
        case 9:
          this.exportPayload.bulanText = 'September'
          break
        case 10:
          this.exportPayload.bulanText = 'Oktober'
          break
        case 11:
          this.exportPayload.bulanText = 'November'
          break
        default:
          this.exportPayload.bulanText = 'Desember'
          break
      }
      this.rombelOptions.map((item) => {
        if (item.id === this.exportPayload.rombelId) {
          this.exportPayload.rombelName = item.nama_rombel
        }
      })
      this.file.file_name = `agenda_kelas_${this.exportPayload.rombelName}_${this.exportPayload.bulanText}_${this.exportPayload.tahun}`
      if (
        this.exportPayload.bulan != null &&
        this.exportPayload.tahun != null
      ) {
        if (this.$auth.loggedIn && this.$auth.strategy.token.get()) {
          const formData = new FormData()
          formData.append('tahun', this.exportPayload.tahun)
          formData.append('bulan', this.exportPayload.bulan)

          const token = localStorage.getItem('auth.access_token')

          this.$axios.setHeader('Authorization', `Bearer ${token}`)
          this.$axios
            .get(`/export/agenda-kelas/${this.exportPayload.rombelId}`, {
              responseType: 'blob',
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: {
                bulan: this.exportPayload.bulan,
                tahun: this.exportPayload.tahun,
              },
            })
            .then((response) => {
              const content = response.headers['content-type']
              download(response.data, this.file.file_name, content)
            })
            .catch((error) => {
              console.error('Gagal mengambil data agenda kelas:', error.message)
            })
        } else {
          this.loading = false
        }
      } else{
        this.$toast.error('Harap pilih tahun dan bulan')
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

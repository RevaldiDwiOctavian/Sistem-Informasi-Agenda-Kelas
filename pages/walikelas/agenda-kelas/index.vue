<template>
  <div>
    <v-row>
      <v-col cols="12" sm="12">
        <v-card class="pa-4 text-h5" tile
          >Kelas {{ rombelInfo.nama_rombel }}</v-card
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
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

      <v-col cols="4">
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

      <v-col cols="4">
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

    <v-row align="end" align-content="end">
      <v-col class="d-flex" cols="auto" sm="auto">
        <v-select
          :items="tahunOptions"
          v-model="exportPayload.tahun"
          label="Tahun"
        ></v-select>
      </v-col>
      <v-col class="d-flex" cols="auto" sm="auto">
        <v-select
          :items="bulanOptions"
          v-model="exportPayload.bulan"
          label="Bulan"
        ></v-select>
      </v-col>

      <v-col class="d-flex" cols="auto" sm="auto">
        <v-btn color="success" @click="exportAgendaKelas">
          <v-icon left> mdi-content-save </v-icon>
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
            :headers="headers"
            :items="agendaKelasList"
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
import download from 'downloadjs'
export default {
  data() {
    return {
      user: this.$auth.user.data,
      loading: false,
      search: '',
      headers: [
        {
          text: 'Tanggal Agenda',
          align: 'start',
          sortable: true,
          value: 'tanggal_agenda_kelas',
        },
        { text: 'Guru', value: 'nama_guru' },
        { text: 'NUPTK', value: 'nuptk' },
        { text: 'Mata Pelajaran', value: 'mata_pelajaran' },
      ],
      title: 'Daftar Agenda Kelas',
      agendaKelasList: [],
      rombelInfo: {},
      tahunOptions: [2023],
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
      },
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

    async fetchSiswaThisRombel() {
      if (this.$auth.loggedIn && this.$auth.strategy.token.get()) {
        const token = localStorage.getItem('auth.access_token')
        this.loading = true

        this.$axios.setHeader('Authorization', `Bearer ${token}`)
        this.$axios
          .get(`/walikelas/agenda-kelas/${this.user.rombel_id}`)
          .then((response) => {
            this.agendaKelasList = response.data.data
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

    async exportAgendaKelas() {
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
      this.file.file_name = `agenda_kelas_${this.rombelInfo.nama_rombel}_${this.exportPayload.bulanText}_${this.exportPayload.tahun}`
      if (
        this.exportPayload.bulan != null &&
        this.exportPayload.tahun != null
      ) {
        if (this.$auth.loggedIn && this.$auth.strategy.token.get()) {
          const formData = new FormData()
          formData.append('tahun', this.exportPayload.tahun)
          formData.append('bulan', this.exportPayload.nuptk)

          const token = localStorage.getItem('auth.access_token')

          this.$axios.setHeader('Authorization', `Bearer ${token}`)
          this.$axios
            .get(`/export/agenda-kelas/${this.user.rombel_id}`, {
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
  },
}
</script>

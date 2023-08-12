<template>
  <div>
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
              :items="rombelList"
              item-value="id"
              item-text="nama_rombel"
              label="Rombongan Belajar*"
              v-model="agendaKelasPayload.rombel_id"
              :disabled="saveDisabled"
              required
            ></v-select>
            <span class="text-caption grey--text text--darken-1">
              Pilih Rombongan Belajar yang saat ini sedang melakukan
              pembelajaran.
            </span>
          </v-card-text>
          <v-card-text>
            <v-select
              :items="pembelajaranList"
              item-value="id"
              item-text="mata_pelajaran"
              label="Pembelajaran*"
              v-model="agendaKelasPayload.pembelajaran_id"
              :disabled="saveDisabled"
              required
            ></v-select>
            <span class="text-caption grey--text text--darken-1">
              Pilih Pembelajaran yang saat ini sedang dilakukan.
            </span>
          </v-card-text>
          <v-card-text>
            <v-textarea
              name="input-7-1"
              label="Materi Pembelajaran"
              clearable
              clear-icon="mdi-close-circle"
              auto-grow
              hint="Isi Materi Pembelajaran yang sedang diajarkan."
              :disabled="saveDisabled"
              v-model="agendaKelasPayload.materi_pembelajaran"
            ></v-textarea>
          </v-card-text>

          <v-card-text>
            <v-row class="ma-5" align="end" justify="space-around">
              <v-btn
                color="success"
                :loading="loadingSave"
                :disabled="loadingSave || saveDisabled"
                @click="handleSubmitAgenda"
              >
                <v-icon left> mdi-content-save </v-icon>
                Simpan
              </v-btn>
            </v-row>
          </v-card-text>
        </v-window-item>

        <div v-if="saveDisabled">
          <v-window-item :value="2">
            <v-card-text>
              <v-select
                :items="siswaList"
                item-text="nama_lengkap"
                item-value="id"
                label="Siswa*"
                v-model="siswaAbsenPayload.siswa_id"
                required
              ></v-select>
              <v-select
                :items="['Sakit', 'Izin', 'Tanpa Keterangan']"
                label="Keterangan Absen*"
                v-model="siswaAbsenPayload.keterangan"
                required
              ></v-select>
              <v-text-field
                label="Alasan"
                v-model="siswaAbsenPayload.alasan"
              ></v-text-field>

              <v-row class="ma-5" align="end" justify="space-around">
                <v-btn
                  color="success"
                  :loading="loadingSave"
                  @click="handleSubmitSiswaAbsen"
                >
                  <v-icon left> mdi-plus </v-icon>
                  Tambah
                </v-btn>
              </v-row>

              <v-data-table
                :headers="headers"
                :items="siswaAbsenList"
                item-key="id"
                class="elevation-1"
                :loading="loading"
                loading-text="Loading... Please wait"
                fixed-header
                height="400px"
              >
                <template v-slot:[`item.aksi`]="{ item }">
                  <v-btn
                    color="error"
                    :loading="loadingSave"
                    @click="deleteSiswaAbsen(item.id)"
                  >
                    <v-icon left> mdi-trash-can </v-icon>
                    Hapus
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-window-item>
        </div>
      </v-window>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn :disabled="step === 1" text @click="step--"> Kembali </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="step < 2"
          :disabled="step === 3 || !saveDisabled"
          color="primary"
          depressed
          @click="step++"
        >
          Lanjut
        </v-btn>
        <div v-else>
          <v-dialog
            v-model="dialogDelete"
            transition="dialog-top-transition"
            persistent
            max-width="600"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                v-bind="attrs"
                v-on="on"
                ><v-icon>mdi-check</v-icon> Selesai</v-btn
              >
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Hapus Guru</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <div class="text-h6">
                    Apakah anda yakin ingin menyelesaikan agenda kelas?
                  </div>
                </v-container>
                <small>* Setelah diselesaikan, anda tidak dapat melakukan perubahan data. pastikan semua data sudah benar.</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="dialogDelete = false">Batal</v-btn>
                <v-btn text @click="finish">Ya</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import LoadingOverlay from '~/components/UiComponents/LoadingOverlay.vue'
export default {
  components: { LoadingOverlay },
  data() {
    return {
      headers: [
        {
          text: 'NISN',
          align: 'start',
          sortable: true,
          value: 'nisn',
        },
        { text: 'Nama Siswa', value: 'nama_lengkap' },
        { text: 'Keterangan Absen', value: 'keterangan_absen' },
        { text: 'Alasan Absen', value: 'alasan' },
        { text: 'Aksi', value: 'aksi' },
      ],

      dialogDelete: false,

      step: 1,
      loader: null,
      loading: false,
      loadingSave: false,
      saveDisabled: false,
      rombelList: [],
      pembelajaranList: [],
      siswaList: [],
      siswaAbsenList: [],
      loggedInGuruID: this.$auth.user.data.guru_id,
      currentAgendaKelas: {
        id: null,
        rombel_id: null,
      },
      agendaKelasPayload: {
        rombel_id: null,
        guru_id: null,
        pembelajaran_id: null,
        materi_pembelajaran: null,
      },
      siswaAbsenPayload: {
        siswa_id: null,
        agenda_kelas_id: null,
        keterangan: null,
        alasan: null,
      },
    }
  },

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

  async mounted() {
    this.loading = true
    this.fetchRombelData()
    this.fetchPebelajaranData()
    this.loading = false
    this.agendaKelasPayload.guru_id = this.loggedInGuruID
  },

  methods: {
    loadingButton() {
      console.log(this.agendaKelasPayload)
    },

    async fetchRombelData() {
      if (this.$auth.loggedIn && this.$auth.strategy.token.get()) {
        const token = localStorage.getItem('auth.access_token')

        this.$axios.setHeader('Authorization', `Bearer ${token}`)
        this.$axios
          .get('http://localhost:8000/api/admin/rombels')
          .then((response) => {
            this.rombelList = response.data.data
          })
          .catch((error) => {
            console.error('Gagal mengambil data siswa:', error.message)
            this.error = error.message
          })
      }
    },

    async fetchPebelajaranData() {
      if (this.$auth.loggedIn && this.$auth.strategy.token.get()) {
        const token = localStorage.getItem('auth.access_token')

        this.$axios.setHeader('Authorization', `Bearer ${token}`)
        this.$axios
          .get(
            `http://localhost:8000/api/guru/pembelajaran-guru/${this.loggedInGuruID}`
          )
          .then((response) => {
            this.pembelajaranList = response.data.data
          })
          .catch((error) => {
            console.error('Gagal mengambil data siswa:', error.message)
            this.error = error.message
          })
      }
    },

    async fetchSiswaByCurrentAgenda() {
      if (this.$auth.loggedIn && this.$auth.strategy.token.get()) {
        const token = localStorage.getItem('auth.access_token')
        this.loading = true

        this.$axios.setHeader('Authorization', `Bearer ${token}`)
        this.$axios
          .get(`/guru/siswa-current/${this.currentAgendaKelas.rombel_id}`)
          .then((response) => {
            this.siswaList = response.data.data
            this.loading = false
          })
          .catch((error) => {
            console.error('Gagal mengambil data siswa:', error.message)
            this.error = error.message
            this.loading = false
          })
      } else {
        this.loading = false
      }
    },

    async fetchSiswaAbsenByCurrentAgenda() {
      if (this.$auth.loggedIn && this.$auth.strategy.token.get()) {
        const token = localStorage.getItem('auth.access_token')
        this.loading = true

        this.$axios.setHeader('Authorization', `Bearer ${token}`)
        this.$axios
          .get(`/guru/siswa-absen/${this.currentAgendaKelas.id}`)
          .then((response) => {
            this.siswaAbsenList = response.data.data
            this.loading = false
          })
          .catch((error) => {
            console.error('Gagal mengambil data siswa:', error.message)
            this.error = error.message
            this.loading = false
          })
      } else {
        this.loading = false
      }
    },

    async handleSubmitAgenda() {
      if (
        this.agendaKelasPayload.rombel_id &&
        this.agendaKelasPayload.pembelajaran_id &&
        this.agendaKelasPayload.materi_pembelajaran
      ) {
        const formData = new FormData()
        formData.append('guru_id', this.agendaKelasPayload.guru_id)
        formData.append('rombel_id', this.agendaKelasPayload.rombel_id)
        formData.append(
          'pembelajaran_id',
          this.agendaKelasPayload.pembelajaran_id
        )
        formData.append(
          'materi_pembelajaran',
          this.agendaKelasPayload.materi_pembelajaran
        )
        const headers = {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('auth.access_token'),
        }
        this.loadingSave = true
        this.$nuxt.$loading.start()
        await this.$axios
          .post('/guru/agenda-kelas', formData, { headers })
          .then((res) => {
            if (res.status === 200) {
              this.$nuxt.$loading.finish()
              this.$toast.success('Agenda Kelas berhasil disimpan')
              this.currentAgendaKelas.id = res.data.data.id
              this.currentAgendaKelas.rombel_id = res.data.data.rombel_id
              this.siswaAbsenPayload.agenda_kelas_id = res.data.data.id
              this.loadingSave = false
              this.saveDisabled = true
              this.fetchSiswaByCurrentAgenda()
            } else {
              this.$nuxt.$loading.finish()
              this.$toast.error('Sepertinya server sedang mengalami masalah.')
              this.loadingSave = false
            }
          })
      } else {
        this.$nuxt.$loading.finish()
        this.$toast.error('Harap lengkapi data')
      }
    },

    async handleSubmitSiswaAbsen() {
      console.log(this.siswaAbsenPayload)
      if (
        this.siswaAbsenPayload.siswa_id &&
        this.siswaAbsenPayload.agenda_kelas_id &&
        this.siswaAbsenPayload.keterangan &&
        this.siswaAbsenPayload.alasan
      ) {
        const formData = new FormData()
        formData.append('siswa_id', this.siswaAbsenPayload.siswa_id)
        formData.append(
          'agenda_kelas_id',
          this.siswaAbsenPayload.agenda_kelas_id
        )
        formData.append('keterangan_absen', this.siswaAbsenPayload.keterangan)
        formData.append('alasan', this.siswaAbsenPayload.alasan)
        const headers = {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('auth.access_token'),
        }
        this.loadingSave = true
        this.$nuxt.$loading.start()
        await this.$axios
          .post('/guru/siswa-absen', formData, { headers })
          .then((res) => {
            if (res.status === 200) {
              this.$nuxt.$loading.finish()
              this.$toast.success('Siswa Absen berhasil disimpan')
              this.loadingSave = false
              this.saveDisabled = true
              this.fetchSiswaAbsenByCurrentAgenda()
            } else {
              this.$nuxt.$loading.finish()
              this.$toast.error('Sepertinya server sedang mengalami masalah.')
              this.loadingSave = false
            }
          })
      } else {
        this.$nuxt.$loading.finish()
        this.$toast.error('Harap lengkapi data')
      }
    },

    async deleteSiswaAbsen(id) {
      const token = localStorage.getItem('auth.access_token')
      const headers = {
        Authorization: `Bearer ${token}`,
      }

      try {
        const response = await this.$axios.delete(`/guru/siswa-absen/${id}`, {
          headers,
        })

        if (response.status === 200) {
          this.$toast.success('guru berhasil dihapus')
          this.fetchSiswaAbsenByCurrentAgenda()
        } else {
          console.log(response)
          this.$toast.error('Gagal menghapus guru, silahkan coba lagi.')
        }
      } catch (error) {
        console.error('Error:', error)
        this.$toast.error(
          'Terjadi kesalahan saat menghapus guru, silakan coba lagi.'
        )
      }
    },

    finish() {
      this.step = 1
      this.saveDisabled = false
      this.agendaKelasPayload = {
        rombel_id: null,
        guru_id: null,
        pembelajaran_id: null,
        materi_pembelajaran: null,
      }
      this.siswaAbsenPayload = {
        siswa_id: null,
        agenda_kelas_id: null,
        keterangan: null,
        alasan: null,
      }
      this.currentAgendaKelas = {
        id: null,
        rombel_id: null,
      }
    }
  },
}
</script>

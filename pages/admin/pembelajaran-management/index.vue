<template>
  <div>
    <v-row>
      <v-col cols="12" sm="12">
        <v-card class="pa-4 text-h5" tile> Kelola Pembelajaran </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-dialog v-model="dialog" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark v-bind="attrs" v-on="on">
              <v-icon>mdi-plus</v-icon>Tambah Pembelajaran
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Data Pembelajaran</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Mata Pelajaran*"
                      v-model="pembelajaranPayload.mata_pelajaran"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      :items="rombelList"
                      item-text="nama_rombel"
                      item-value="id"
                      v-model="pembelajaranPayload.rombel_id"
                      label="Rombongan Belajar*"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      :items="guruList"
                      item-text="nama_lengkap"
                      item-value="id"
                      v-model="pembelajaranPayload.guru_id"
                      label="Guru Pengampu*"
                      required
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
              <small>tanda (*) wajib diisi.</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="closeDialogAndReset"> Tutup </v-btn>
              <v-btn text @click="handleSubmit"> Simpan </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>

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
                  Apakah anda yakin ingin menghapus pembelajaran terpilih?
                </div>
              </v-container>
              <small
                >* Setelah dihapus, pembelajaran tidak dapat
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

      <v-col cols="auto">
        <v-dialog v-model="dialogEdit" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="warning"
              dark
              v-bind="attrs"
              v-on="on"
              :disabled="selected.length != 1"
              @click="appendSelected"
            >
              <v-icon>mdi-pencil</v-icon>Edit
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Edit Pemelajaran</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Mata Pelajaran*"
                      v-model="pembelajaranPayload.mata_pelajaran"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      :items="rombelList"
                      item-text="nama_rombel"
                      item-value="id"
                      v-model="pembelajaranPayload.rombel_id"
                      label="Rombongan Belajar*"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      :items="guruList"
                      item-text="nama_lengkap"
                      item-value="id"
                      v-model="pembelajaranPayload.guru_id"
                      label="Guru Pengampu*"
                      required
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
              <small>tanda (*) wajib diisi.</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="closeDialogAndReset"> Tutup </v-btn>
              <v-btn text @click="handleEdit"> Simpan </v-btn>
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
            :items="pembelajaranList"
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
      user: this.$auth.user.data,

      dialog: false,
      dialogDelete: false,
      dialogEdit: false,

      selected: [],
      search: '',

      headers: [
        {
          text: 'Mata Pelajaran',
          align: 'start',
          sortable: true,
          value: 'mata_pelajaran',
        },
        { text: 'Rombongan Belajar', value: 'nama_rombel' },
        { text: 'Jurusan', value: 'jurusan' },
        { text: 'Guru Pengampu', value: 'guru_pengampu' },
        { text: 'NUPTK', value: 'nuptk' },
        { text: 'Tanggal Dibuat', value: 'created_at' },
      ],
      title: 'Daftar Pembelajaran',
      pembelajaranList: [],
      guruList: [],
      rombelList: [],
      loading: false,

      pembelajaranPayload: {
        mata_pelajaran: null,
        rombel_id: null,
        guru_id: null,
      },
    }
  },

  async mounted() {
    this.fetchPembelajaranData()
    this.fetchGuruData()
    this.fetchRombelData()
  },

  methods: {
    async fetchRombelData() {
      if (this.$auth.loggedIn && this.$auth.strategy.token.get()) {
        const token = localStorage.getItem('auth.access_token')
        this.loading = true

        this.$axios.setHeader('Authorization', `Bearer ${token}`)
        this.$axios
          .get('/admin/rombels')
          .then((response) => {
            this.rombelList = response.data.data
            this.loading = false
          })
          .catch((error) => {
            console.error('Gagal mengambil data:', error.message)
            this.error = error.message
            this.loading = false
          })
      } else {
        this.loading = false
      }
    },

    async fetchPembelajaranData() {
      if (this.$auth.loggedIn && this.$auth.strategy.token.get()) {
        const token = localStorage.getItem('auth.access_token')
        this.loading = true

        this.$axios.setHeader('Authorization', `Bearer ${token}`)
        this.$axios
          .get('/admin/pembelajarans')
          .then((response) => {
            this.pembelajaranList = response.data.data
            this.loading = false
          })
          .catch((error) => {
            console.error('Gagal mengambil data pembelajaran:', error.message)
            this.error = error.message
            this.loading = false
          })
      } else {
        this.loading = false
      }
    },

    async fetchGuruData() {
      if (this.$auth.loggedIn && this.$auth.strategy.token.get()) {
        const token = localStorage.getItem('auth.access_token')
        this.loading = true

        this.$axios.setHeader('Authorization', `Bearer ${token}`)
        this.$axios
          .get('/admin/gurus')
          .then((response) => {
            this.guruList = response.data.data
            this.loading = false
          })
          .catch((error) => {
            console.error('Gagal mengambil data guru:', error.message)
            this.error = error.message
            this.loading = false
          })
      } else {
        this.loading = false
      }
    },

    formatDate(value) {
      return new Date(value).toLocaleDateString()
    },

    resetPayload() {
      this.pembelajaranPayload.mata_pelajaran = null
      this.pembelajaranPayload.guru_id = null
      this.pembelajaranPayload.rombel_id = null
    },

    appendSelected() {
      if (this.selected.length === 1) {
        this.pembelajaranPayload.mata_pelajaran = this.selected[0].mata_pelajaran
        this.pembelajaranPayload.guru_id = this.selected[0].guru_id
        this.pembelajaranPayload.rombel_id = this.selected[0].rombel_id
      }
    },

    closeDialogAndReset() {
      this.dialog = false
      this.dialogEdit = false
      this.resetPayload()
    },

    async handleSubmit() {
      if (
        this.pembelajaranPayload.mata_pelajaran &&
        this.pembelajaranPayload.guru_id &&
        this.pembelajaranPayload.rombel_id
      ) {
        const formData = new FormData()
        formData.append('mata_pelajaran', this.pembelajaranPayload.mata_pelajaran)
        formData.append('guru_id', this.pembelajaranPayload.guru_id)
        formData.append('rombel_id', this.pembelajaranPayload.rombel_id)
        const headers = {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('auth.access_token'),
        }
        await this.$axios
          .post('/admin/pembelajaran', formData, { headers })
          .then((res) => {
            if (res.status === 200) {
              this.$nuxt.$loading.finish()
              this.$toast.success('Pembelajaran berhasil ditambahkan')
              this.fetchPembelajaranData()
              this.closeDialogAndReset()
            } else {
              this.$nuxt.$loading.finish()
              this.$toast.error('Sepertinya server sedang mengalami masalah.')
              this.closeDialogAndReset()
            }
          })
      } else {
        this.$nuxt.$loading.finish()
        this.$toast.error('Harap lengkapi data')
        console.log(this.pembelajaranPayload)
      }
    },

    async handleEdit() {
      if (
        this.pembelajaranPayload.mata_pelajaran &&
        this.pembelajaranPayload.guru_id &&
        this.pembelajaranPayload.rombel_id
      ) {
        const formData = new FormData()
        formData.append('mata_pelajaran', this.pembelajaranPayload.mata_pelajaran)
        formData.append('guru_id', this.pembelajaranPayload.guru_id)
        formData.append('rombel_id', this.pembelajaranPayload.rombel_id)
        const headers = {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('auth.access_token'),
        }
        await this.$axios
          .post(`/admin/pembelajaran/${this.selected[0].id}`, formData, { headers })
          .then((res) => {
            if (res.status === 200) {
              this.$nuxt.$loading.finish()
              this.$toast.success('Pembelajaran berhasil diedit')
              this.fetchPembelajaranData()
              this.closeDialogAndReset()
            } else {
              this.$nuxt.$loading.finish()
              this.$toast.error('Sepertinya server sedang mengalami masalah.')
              this.closeDialogAndReset()
            }
          })
      } else {
        this.$nuxt.$loading.finish()
        this.$toast.error('Harap lengkapi data')
      }
    },

    async delete(id) {
      const token = localStorage.getItem('auth.access_token')
      const headers = {
        Authorization: `Bearer ${token}`,
      }

      try {
        const response = await this.$axios.delete(`/admin/pembelajaran/${id}`, {
          headers,
        })

        if (response.status === 200) {
          this.$toast.success('Pembelajaran berhasil dihapus')
          this.closeDialogAndReset() // Tutup dialog setelah menghapus
        } else {
          console.log(response)
          this.$toast.error('Gagal menghapus pembelajaran, silahkan coba lagi.')
        }
      } catch (error) {
        console.error('Error:', error)
        this.$toast.error(
          'Terjadi kesalahan saat menghapus pembelajaran, silakan coba lagi.'
        )
      }
    },

    async handleDelete() {
      this.selected.map((item) => {
        this.delete(item.id)
      })
      this.fetchPembelajaranData()
      this.dialogDelete = false
      this.selected = []
    },
  },
}
</script>

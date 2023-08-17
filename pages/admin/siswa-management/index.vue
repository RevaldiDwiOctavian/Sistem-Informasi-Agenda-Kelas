<template>
  <div>
    <v-row>
      <v-col cols="12" sm="12">
        <v-card class="pa-4 text-h5" tile> Kelola Siswa </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-dialog v-model="dialog" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark v-bind="attrs" v-on="on">
              <v-icon>mdi-plus</v-icon>Tambah Siswa
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Data Siswa</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Nama Lengkap Siswa*"
                      v-model="siswaPayload.nama_lengkap"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      label="NISN*"
                      v-model="siswaPayload.nisn"
                      hint="Pastikan hanya menggunakan angka"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      :items="['Laki-laki', 'Perempuan']"
                      v-model="siswaPayload.jenis_kelamin"
                      label="Jenis Kelamin*"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      :items="rombelList"
                      item-text="nama_rombel"
                      item-value="id"
                      label="Rombongan Belajar*"
                      v-model="siswaPayload.rombel"
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
              <span class="text-h5">Data Siswa</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <div class="text-h6">
                  Apakah anda yakin ingin menghapus siswa terpilih?
                </div>
              </v-container>
              <small>* Setelah dihapus, siswa tidak dapat dikembalikan.</small>
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
              <span class="text-h5">Data Siswa</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Nama Lengkap Siswa*"
                      v-model="siswaPayload.nama_lengkap"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      label="NISN*"
                      v-model="siswaPayload.nisn"
                      hint="Pastikan hanya menggunakan angka"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      :items="['Laki-laki', 'Perempuan']"
                      v-model="siswaPayload.jenis_kelamin"
                      label="Jenis Kelamin*"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      :items="rombelList"
                      item-text="nama_rombel"
                      item-value="id"
                      label="Rombongan Belajar*"
                      v-model="siswaPayload.rombel"
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

      <v-col cols="auto">
        <v-dialog v-model="dialogSetUser" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="success"
              dark
              v-bind="attrs"
              v-on="on"
              :disabled="selected.length != 1"
              @click="appendSelected"
            >
              <v-icon>mdi-link</v-icon>Tautkan Akun
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Pilih Akun</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-select
                      :items="userSiswaList"
                      item-text="email"
                      item-value="id"
                      label="Email"
                      v-model="siswaPayload.user_id"
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
              <v-btn text @click="handleLinkUser"> Simpan </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>

      <v-col cols="auto">
        <v-dialog v-model="dialogUnlinkUser" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="success"
              dark
              v-bind="attrs"
              v-on="on"
              :disabled="selected.length != 1 || siswaPayload.user_id === null"
              @click="appendSelected"
            >
              <v-icon>mdi-link-off</v-icon>Batal Tautkan Akun
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Pilih Akun</span>
            </v-card-title>
            <v-card-text>
              <v-container>
              <div class="text-h6">
                  Apakah anda yakin ingin melepas akun siswa terpilih?
                </div>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="closeDialogAndReset"> Batal </v-btn>
              <v-btn text @click="handleUnlinkUser"> Ya </v-btn>
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
            :items="siswaList"
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
      dialogSetUser: false,
      dialogUnlinkUser: false,

      selected: [],
      search: '',

      headers: [
        {
          text: 'NISN',
          align: 'start',
          sortable: true,
          value: 'nisn',
        },
        { text: 'Nama Siswa', value: 'nama_lengkap' },
        { text: 'Rombel', value: 'nama_rombel' },
        { text: 'Jurusan', value: 'jurusan' },
        { text: 'Jenis Kelamin', value: 'jenis_kelamin' },
        { text: 'Tanggal Dibuat', value: 'created_at' },
        { text: 'Akun', value: 'nama_akun' },
      ],
      title: 'Daftar Siswa',
      siswaList: [],
      userSiswaList: [],
      rombelList: [],
      loading: false,

      siswaPayload: {
        nama_lengkap: null,
        nisn: null,
        jenis_kelamin: null,
        rombel: null,
        user_id: null,
      },

      submitButtonLabel: 'Tambah Siswa',
      submittedData: null,
    }
  },

  async mounted() {
    this.fetchUserSiswaData()
    this.fetchSiswaData()
    this.fetchRombelData()
  },

  methods: {
    async fetchUserSiswaData() {
      if (this.$auth.loggedIn && this.$auth.strategy.token.get()) {
        const token = localStorage.getItem('auth.access_token')
        this.loading = true

        this.$axios.setHeader('Authorization', `Bearer ${token}`)
        this.$axios
          .get('/admin/users/siswa')
          .then((response) => {
            this.userSiswaList = response.data.data
            console.log(response)
            this.loading = false
          })
          .catch((error) => {
            console.error('Gagal mengambil data siswa:', error.message)
            this.error = error.message
            console.log(response)
            this.loading = false
          })
      } else {
        this.loading = false
      }
    },

    async fetchSiswaData() {
      if (this.$auth.loggedIn && this.$auth.strategy.token.get()) {
        const token = localStorage.getItem('auth.access_token')
        this.loading = true

        this.$axios.setHeader('Authorization', `Bearer ${token}`)
        this.$axios
          .get('/admin/siswa')
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

    async fetchRombelData() {
      if (this.$auth.loggedIn && this.$auth.strategy.token.get()) {
        const token = localStorage.getItem('auth.access_token')
        this.loading = true

        this.$axios.setHeader('Authorization', `Bearer ${token}`)
        this.$axios
          .get('http://localhost:8000/api/admin/rombels')
          .then((response) => {
            this.rombelList = response.data.data
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

    formatDate(value) {
      return new Date(value).toLocaleDateString()
    },

    resetSiswaPayload() {
      this.siswaPayload.nama_lengkap = null
      this.siswaPayload.nisn = null
      this.siswaPayload.jenis_kelamin = null
      this.siswaPayload.rombel = null
    },

    appendSelected() {
      if (this.selected.length === 1) {
        this.siswaPayload.nama_lengkap = this.selected[0].nama_lengkap
        this.siswaPayload.nisn = this.selected[0].nisn
        this.siswaPayload.jenis_kelamin = this.selected[0].jenis_kelamin
        this.siswaPayload.rombel = this.selected[0].rombel_id
        this.siswaPayload.user_id = this.selected[0].user_id
      }
    },

    closeDialogAndReset() {
      this.dialog = false
      this.dialogEdit = false
      this.dialogSetUser = false
      this.dialogUnlinkUser = false
      this.resetSiswaPayload()
    },

    async handleSubmit() {
      if (
        this.siswaPayload.nama_lengkap &&
        this.siswaPayload.nisn &&
        this.siswaPayload.rombel &&
        this.siswaPayload.jenis_kelamin
      ) {
        const formData = new FormData()
        formData.append('nama_lengkap', this.siswaPayload.nama_lengkap)
        formData.append('nisn', this.siswaPayload.nisn)
        formData.append('jenis_kelamin', this.siswaPayload.jenis_kelamin)
        formData.append('rombel_id', this.siswaPayload.rombel)
        const headers = {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('auth.access_token'),
        }
        await this.$axios
          .post('/admin/siswa', formData, { headers })
          .then((res) => {
            if (res.status === 200) {
              this.$nuxt.$loading.finish()
              this.$toast.success('Siswa berhasil ditambahkan')
              this.fetchSiswaData()
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

    async handleEdit() {
      if (
        this.siswaPayload.nama_lengkap &&
        this.siswaPayload.nisn &&
        this.siswaPayload.rombel &&
        this.siswaPayload.jenis_kelamin
      ) {
        const formData = new FormData()
        formData.append('nama_lengkap', this.siswaPayload.nama_lengkap)
        formData.append('nisn', this.siswaPayload.nisn)
        formData.append('jenis_kelamin', this.siswaPayload.jenis_kelamin)
        formData.append('rombel_id', this.siswaPayload.rombel)
        const headers = {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('auth.access_token'),
        }
        await this.$axios
          .post(`/admin/siswa/${this.selected[0].id}`, formData, { headers })
          .then((res) => {
            if (res.status === 200) {
              this.$nuxt.$loading.finish()
              this.$toast.success('Siswa berhasil diedit')
              this.fetchSiswaData()
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

    async handleLinkUser() {
      this.$nuxt.$loading.start()
      if (this.siswaPayload.user_id) {
        const payload = {
          user_id: this.siswaPayload.user_id,
        }

        try {
          const response = await this.$axios.patch(
            `/admin/siswa/${this.selected[0].id}`,
            payload
          )
          if (response.status === 200) {
            this.$nuxt.$loading.finish()
              this.$toast.success('Akun berhasil ditautkan')
              this.fetchSiswaData()
              this.closeDialogAndReset()
          } else {
            this.$nuxt.$loading.finish()
              this.$toast.error('Sepertinya server sedang mengalami masalah.')
              this.closeDialogAndReset()
          }
        } catch (error) {
          this.$nuxt.$loading.finish()
        }
      } else {
        this.$toast.error('Harap pilih akun untuk siswa')
      }
    },

    async handleUnlinkUser() {

        const payload = {
          user_id: null,
        }

        try {
          const response = await this.$axios.patch(
            `/admin/siswa/${this.selected[0].id}`,
            payload
          )
          if (response.status === 200) {
            this.$nuxt.$loading.finish()
              this.$toast.success('Berhasil melepas akun tertaut')
              this.fetchSiswaData()
              this.closeDialogAndReset()
          } else {
            this.$nuxt.$loading.finish()
              this.$toast.error('Sepertinya server sedang mengalami masalah.')
              this.closeDialogAndReset()
          }
        } catch (error) {
          this.$nuxt.$loading.finish()
        }
      
    },

    async deleteSiswa(id) {
      const token = localStorage.getItem('auth.access_token')
      const headers = {
        Authorization: `Bearer ${token}`,
      }

      try {
        const response = await this.$axios.delete(`/admin/siswa/${id}`, {
          headers,
        })

        if (response.status === 200) {
          this.$toast.success('Siswa berhasil dihapus')
          this.closeDialogAndReset() // Tutup dialog setelah menghapus
        } else {
          console.log(response)
          this.$toast.error('Gagal menghapus siswa, silahkan coba lagi.')
        }
      } catch (error) {
        console.error('Error:', error)
        this.$toast.error(
          'Terjadi kesalahan saat menghapus siswa, silakan coba lagi.'
        )
      }
    },

    async handleDelete() {
      this.selected.map((item) => {
        this.deleteSiswa(item.id)
      })
      this.fetchSiswaData()
      this.dialogDelete = false
      this.selected = []
    },

    async logout() {
      await this.$auth.logout()
      this.$toast.success('Logout Success')
      this.$router.push('/login')
    },
  },
}
</script>

<template>
    <div>
      <v-row>
        <v-col>
          <v-dialog v-model="dialog" persistent max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark v-bind="attrs" v-on="on">
                <v-icon>mdi-plus</v-icon>Tambah Guru
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Data Guru</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="Nama Lengkap Guru*"
                        v-model="guruPayload.nama_lengkap"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="NUPTK*"
                        v-model="guruPayload.nuptk"
                        hint="Pastikan hanya menggunakan angka"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        :items="['Laki-laki', 'Perempuan']"
                        v-model="guruPayload.jenis_kelamin"
                        label="Jenis Kelamin*"
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
                <span class="text-h5">Edit Guru</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="Nama Lengkap Guru*"
                        v-model="guruPayload.nama_lengkap"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="NUPTK*"
                        v-model="guruPayload.nuptk"
                        hint="Pastikan hanya menggunakan angka"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        :items="['Laki-laki', 'Perempuan']"
                        v-model="guruPayload.jenis_kelamin"
                        label="Jenis Kelamin*"
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
                        :items="userGuruList"
                        item-text="email"
                        item-value="id"
                        label="Email"
                        v-model="guruPayload.user_id"
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
                :disabled="selected.length != 1"
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
                    Apakah anda yakin ingin melepas akun guru terpilih?
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
              :items="guruList"
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
            text: 'NUPTK',
            align: 'start',
            sortable: true,
            value: 'nuptk',
          },
          { text: 'Nama Guru', value: 'nama_lengkap' },
          { text: 'Jenis Kelamin', value: 'jenis_kelamin' },
          { text: 'Tanggal Dibuat', value: 'created_at' },
          { text: 'Akun', value: 'nama_akun' },
        ],
        title: 'Daftar Guru',
        guruList: [],
        userGuruList: [],
        loading: false,
  
        guruPayload: {
          nama_lengkap: null,
          nuptk: null,
          jenis_kelamin: null,
          user_id: null,
        },
      }
    },
  
    async mounted() {
      this.fetchGuruData()
      this.fetchUserGuruData()
    },
  
    methods: {
      async fetchUserGuruData() {
        if (this.$auth.loggedIn && this.$auth.strategy.token.get()) {
          const token = localStorage.getItem('auth.access_token')
          this.loading = true
  
          this.$axios.setHeader('Authorization', `Bearer ${token}`)
          this.$axios
            .get('/admin/users/guru')
            .then((response) => {
              this.userGuruList = response.data.data
              console.log(response)
              this.loading = false
            })
            .catch((error) => {
              console.error('Gagal mengambil data guru:', error.message)
              this.error = error.message
              console.log(response)
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
  
      resetGuruPayload() {
        this.guruPayload.nama_lengkap = null
        this.guruPayload.nuptk = null
        this.guruPayload.jenis_kelamin = null
      },
  
      appendSelected() {
        if (this.selected.length === 1) {
          this.guruPayload.nama_lengkap = this.selected[0].nama_lengkap
          this.guruPayload.nuptk = this.selected[0].nuptk
          this.guruPayload.jenis_kelamin = this.selected[0].jenis_kelamin
          this.guruPayload.user_id = this.selected[0].user_id
        }
      },
  
      closeDialogAndReset() {
        this.dialog = false
        this.dialogEdit = false
        this.dialogSetUser = false
        this.dialogUnlinkUser = false
        this.resetGuruPayload()
      },
  
      async handleSubmit() {
        if (
          this.guruPayload.nama_lengkap &&
          this.guruPayload.nuptk &&
          this.guruPayload.jenis_kelamin
        ) {
          const formData = new FormData()
          formData.append('nama_lengkap', this.guruPayload.nama_lengkap)
          formData.append('nuptk', this.guruPayload.nuptk)
          formData.append('jenis_kelamin', this.guruPayload.jenis_kelamin)
          const headers = {
            'Content-Type': 'multipart/form-data',
            Authorization: localStorage.getItem('auth.access_token'),
          }
          await this.$axios
            .post('/admin/guru', formData, { headers })
            .then((res) => {
              if (res.status === 200) {
                this.$nuxt.$loading.finish()
                this.$toast.success('Guru berhasil ditambahkan')
                this.fetchGuruData()
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
          this.guruPayload.nama_lengkap &&
          this.guruPayload.nuptk &&
          this.guruPayload.jenis_kelamin
        ) {
          const formData = new FormData()
          formData.append('nama_lengkap', this.guruPayload.nama_lengkap)
          formData.append('nuptk', this.guruPayload.nuptk)
          formData.append('jenis_kelamin', this.guruPayload.jenis_kelamin)
          const headers = {
            'Content-Type': 'multipart/form-data',
            Authorization: localStorage.getItem('auth.access_token'),
          }
          await this.$axios
            .post(`/admin/guru/${this.selected[0].id}`, formData, { headers })
            .then((res) => {
              if (res.status === 200) {
                this.$nuxt.$loading.finish()
                this.$toast.success('Guru berhasil diedit')
                this.fetchGuruData()
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
        if (this.guruPayload.user_id) {
          const payload = {
            user_id: this.guruPayload.user_id,
          }
  
          try {
            const response = await this.$axios.patch(
              `/admin/guru/${this.selected[0].id}`,
              payload
            )
            if (response.status === 200) {
              this.$nuxt.$loading.finish()
                this.$toast.success('Akun berhasil ditautkan')
                this.fetchGuruData()
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
          this.$toast.error('Harap pilih akun untuk guru')
        }
      },
  
      async handleUnlinkUser() {
  
          const payload = {
            user_id: null,
          }
  
          try {
            const response = await this.$axios.patch(
              `/admin/guru/${this.selected[0].id}`,
              payload
            )
            if (response.status === 200) {
              this.$nuxt.$loading.finish()
                this.$toast.success('Berhasil melepas akun tertaut')
                this.fetchGuruData()
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
  
      async deleteGuru(id) {
        const token = localStorage.getItem('auth.access_token')
        const headers = {
          Authorization: `Bearer ${token}`,
        }
  
        try {
          const response = await this.$axios.delete(`/admin/guru/${id}`, {
            headers,
          })
  
          if (response.status === 200) {
            this.$toast.success('guru berhasil dihapus')
            this.fetchGuruData() // Perbarui daftar siswa setelah berhasil menghapus
            this.closeDialogAndReset() // Tutup dialog setelah menghapus
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
  
      async handleDelete() {
        this.selected.map((item) => {
          this.deleteGuru(item.id)
        })
        this.fetchGuruData()
        this.dialogDelete = false
        this.selected = []
      },
    },
  }
  </script>
  
<template>
  <div>
    <v-row>
      <v-col>
        <v-dialog v-model="dialog" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark v-bind="attrs" v-on="on">
              <v-icon>mdi-plus</v-icon>Tambah Rombel
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Data Rombel</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Nama Rombongan Belajar*"
                      v-model="rombelPayload.nama_rombel"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      :items="[
                        'Rekayasa Perangkat Lunak',
                        'Teknik Kendaraan Ringan',
                        'Teknik Pemesinan',
                      ]"
                      v-model="rombelPayload.jurusan"
                      label="Jurusan*"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      :items="userGuruList"
                      v-model="rombelPayload.user_id"
                      item-text="nama_akun"
                      item-value="id"
                      label="Wali Kelas*"
                      required
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
              <small>Tanda (*) wajib diisi.</small>
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
                  Apakah anda yakin ingin menghapus rombel terpilih?
                </div>
              </v-container>
              <small>* Setelah dihapus, data tidak dapat dikembalikan. Siswa yang berada pada rombel ini juga akan terhapus.</small>
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
              <v-icon>mdi-pencil</v-icon>Edit Rombel
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Data Rombel</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Nama Rombongan Belajar*"
                      v-model="rombelPayload.nama_rombel"
                      @click="appendSelected"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      :items="[
                        'Rekayasa Perangkat Lunak',
                        'Teknik Kendaraan Ringan',
                        'Teknik Pemesinan',
                      ]"
                      v-model="rombelPayload.jurusan"
                      label="Jurusan*"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      :items="userGuruList"
                      v-model="rombelPayload.user_id"
                      item-text="nama_akun"
                      item-value="id"
                      label="Wali Kelas*"
                      required
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
              <small>Tanda (*) wajib diisi.</small>
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
            :items="rombelList"
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
          text: 'Nama Rombel',
          align: 'start',
          sortable: true,
          value: 'nama_rombel',
        },
        { text: 'Jurusan', value: 'jurusan' },
        { text: 'Wali Kelas', value: 'wali_kelas' },
      ],
      title: 'Daftar Rombongan Belajar',
      rombelList: [],
      userGuruList: [],
      loading: false,

      rombelPayload: {
        nama_rombel: null,
        jurusan: null,
        user_id: null,
      },
    }
  },

  async mounted() {
    this.fetchRombelData()
    this.fetchUserGuruData()
  },

  methods: {
    resetRombelPayload() {
      this.rombelPayload.nama_rombel = null
      this.rombelPayload.jurusan = null
      this.rombelPayload.user_id = null
    },

    closeDialogAndReset() {
      this.dialog = false
      this.dialogEdit = false
      this.resetRombelPayload()
    },

    appendSelected() {
      if (this.selected.length === 1) {
        this.rombelPayload.nama_rombel = this.selected[0].nama_rombel
        this.rombelPayload.jurusan = this.selected[0].jurusan
        this.rombelPayload.user_id = this.selected[0].user_id
      }
    },

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
            console.error('Gagal mengambil data Guru:', error.message)
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

    async handleSubmit() {
      if (this.rombelPayload.nama_rombel && this.rombelPayload.jurusan) {
        const formData = new FormData()
        formData.append('nama_rombel', this.rombelPayload.nama_rombel)
        formData.append('jurusan', this.rombelPayload.jurusan)
        formData.append('user_id', this.rombelPayload.user_id)
        const headers = {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('auth.access_token'),
        }
        try {
          await this.$axios
            .post('/admin/rombel', formData, { headers })
            .then((res) => {
              if (res.status === 200) {
                this.$nuxt.$loading.finish()
                this.$toast.success('Rombongan belajar berhasil ditambahkan')
                this.fetchRombelData()
                this.closeDialogAndReset()
              } else {
                this.$nuxt.$loading.finish()
                this.$toast.error('Sepertinya server sedang mengalami masalah.')
                this.closeDialogAndReset()
              }
            })
        } catch (error) {
          this.$nuxt.$loading.finish()
          this.$toast.error('Terjadi kesalahan saat mengirim data.')
          console.log(error)
        }
      } else {
        this.$nuxt.$loading.finish()
        this.$toast.error('Harap lengkapi data')
      }
    },

    async handleEdit() {
      if (this.rombelPayload.nama_rombel && this.rombelPayload.jurusan) {
        const formData = new FormData()
        formData.append('nama_rombel', this.rombelPayload.nama_rombel)
        formData.append('jurusan', this.rombelPayload.jurusan)
        formData.append('user_id', this.rombelPayload.user_id)
        const headers = {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('auth.access_token'),
        }
        await this.$axios
          .post(`/admin/rombel/${this.selected[0].id}`, formData, { headers })
          .then((res) => {
            if (res.status === 200) {
              this.$nuxt.$loading.finish()
              this.$toast.success('Rombel berhasil diedit')
              this.fetchRombelData()
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

    async deleteRombel(id) {
      const token = localStorage.getItem('auth.access_token')
      const headers = {
        Authorization: `Bearer ${token}`,
      }

      try {
        const response = await this.$axios.delete(`/admin/rombel/${id}`, {
          headers,
        })

        if (response.status === 200) {
          this.$toast.success('Rombel berhasil dihapus')
          this.closeDialogAndReset() // Tutup dialog setelah menghapus
        } else {
          console.log(response)
          this.$toast.error('Gagal menghapus rombel, silahkan coba lagi.')
        }
      } catch (error) {
        console.error('Error:', error)
        this.$toast.error(
          'Rombel tidak dapat dihapus karena memiliki agenda kelas'
        )
      }
    },

    async handleDelete() {
      this.selected.map((item) => {
        this.deleteRombel(item.id)
      })
      this.fetchRombelData()
      this.dialogDelete = false
      this.selected = []
    },
  },
}
</script>

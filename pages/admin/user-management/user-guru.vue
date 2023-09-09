<template>
  <div>
    <v-row>
      <v-col cols="12" sm="12">
        <v-card class="pa-4 text-h5" tile> Kelola User Guru </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-dialog v-model="dialog" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark v-bind="attrs" v-on="on">
              <v-icon>mdi-plus</v-icon>Tambah User
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Data User</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Nama*"
                      v-model="payload.name"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      label="E-mail*"
                      v-model="payload.email"
                      type="email"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="payload.password"
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show1 ? 'text' : 'password'"
                      name="input-10-1"
                      label="Password"
                      hint="Minimal 8 karakter"
                      counter
                      @click:append="show1 = !show1"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      label="No Whatsapp*"
                      v-model="payload.no_wa"
                      type="text"
                      required
                      hint="Gunakan +62 untuk mengganti 0. Contoh +62812345678"
                    ></v-text-field>
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
              <v-icon>mdi-account</v-icon>Edit User
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Data User</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Nama*"
                      v-model="payload.name"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      :items="['admin', 'walikelas', 'guru', 'siswa']"
                      v-model="payload.role"
                      label="role*"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      :items="['Aktif', 'Nonaktif']"
                      v-model="payload.status"
                      label="Status*"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      label="No Whatsapp*"
                      v-model="payload.no_wa"
                      type="text"
                      required
                      hint="Gunakan +62 untuk mengganti 0. Contoh +62812345678"
                    ></v-text-field>
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
        <v-dialog v-model="dialogEditPassword" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="warning"
              dark
              v-bind="attrs"
              v-on="on"
              :disabled="selected.length != 1"
            >
              <v-icon>mdi-lock</v-icon>Edit Password
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Data User</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="payload.password"
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show1 ? 'text' : 'password'"
                      name="input-10-1"
                      label="Password"
                      hint="Minimal 8 karakter"
                      counter
                      @click:append="show1 = !show1"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <small>tanda (*) wajib diisi.</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="closeDialogAndReset"> Tutup </v-btn>
              <v-btn text @click="handleEditPassword"> Simpan </v-btn>
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
              <span class="text-h5">Data User</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <div class="text-h6">
                  Apakah anda yakin ingin menghapus user terpilih?
                </div>
              </v-container>
              <small>* Setelah dihapus, user tidak dapat dikembalikan.</small>
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
        <v-dialog
          v-model="dialogTegur"
          transition="dialog-top-transition"
          persistent
          max-width="600"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="success"
              v-bind="attrs"
              v-on="on"
              :disabled="selected.length != 1"
              ><v-icon>mdi-whatsapp</v-icon>&nbsp; Tegur
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Data User</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <div class="text-h6">
                  Apakah anda yakin ingin menegur user terpilih?
                </div>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="dialogTegur = false">Batal</v-btn>
              <v-btn text @click="handleTegur(selected[0].no_wa)">Ya</v-btn>
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
            <template v-slot:[`item.status`]="{ item }">
              <v-chip
                v-if="item.status === 'Aktif'"
                class="ma-2"
                color="green"
                text-color="white"
                >{{ item.status }}</v-chip
              >
              <v-chip v-else class="ma-2" color="red" text-color="white">{{
                item.status
              }}</v-chip>
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

      show1: false,

      dialog: false,
      dialogDelete: false,
      dialogEdit: false,
      dialogEditPassword: false,
      dialogTegur: false,

      selected: [],
      search: '',

      headers: [
        {
          text: 'Nama',
          align: 'start',
          sortable: true,
          value: 'name',
        },
        { text: 'Email', value: 'email' },
        { text: 'Role', value: 'role' },
        { text: 'Status Akun', value: 'status' },
        { text: 'No Whatsapp', value: 'no_wa' },
        { text: 'Tanggal Dibuat', value: 'created_at' },
      ],
      title: 'Daftar User Guru',
      data: [],
      loading: false,

      payload: {
        name: null,
        email: null,
        password: null,
        role: 'guru',
        status: null,
        no_wa: null,
      },
    }
  },

  async mounted() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      if (this.$auth.loggedIn && this.$auth.strategy.token.get()) {
        const token = localStorage.getItem('auth.access_token')
        this.loading = true

        this.$axios.setHeader('Authorization', `Bearer ${token}`)
        this.$axios
          .get('/admin/users/guru')
          .then((response) => {
            this.data = response.data.data
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

    formatDate(value) {
      return new Date(value).toLocaleDateString()
    },

    resetPayload() {
      this.payload.name = null
      this.payload.email = null
      this.payload.password = null
      this.payload.role = 'guru'
      this.payload.status = 'aktif'
      this.payload.no_wa = null
    },

    appendSelected() {
      if (this.selected.length === 1) {
        this.payload.name = this.selected[0].name
        this.payload.email = this.selected[0].email
        this.payload.password = this.selected[0].password
        this.payload.role = this.selected[0].role
        this.payload.status = this.selected[0].status
        this.payload.no_wa = this.selected[0].no_wa
      }
    },

    closeDialogAndReset() {
      this.dialog = false
      this.dialogEdit = false
      this.dialogEditPassword = false
      this.resetPayload()
    },

    async handleSubmit() {
      if (
        this.payload.name &&
        this.payload.email &&
        this.payload.password &&
        this.payload.role &&
        this.payload.no_wa
      ) {
        const formData = new FormData()
        formData.append('name', this.payload.name)
        formData.append('email', this.payload.email)
        formData.append('role', this.payload.role)
        formData.append('password', this.payload.password)
        formData.append('no_wa', this.payload.no_wa)
        const headers = {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('auth.access_token'),
        }
        await this.$axios
          .post('/admin/users', formData, { headers })
          .then((res) => {
            if (res.status === 200) {
              this.$nuxt.$loading.finish()
              this.$toast.success('User berhasil ditambahkan')
              this.fetchData()
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
        this.payload.name &&
        this.payload.role &&
        this.payload.status &&
        this.payload.no_wa
      ) {
        const formData = new FormData()
        formData.append('name', this.payload.name)
        formData.append('role', this.payload.role)
        formData.append('status', this.payload.status)
        formData.append('no_wa', this.payload.no_wa)
        const headers = {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('auth.access_token'),
        }
        await this.$axios
          .post(`/admin/users/${this.selected[0].id}`, formData, { headers })
          .then((res) => {
            if (res.status === 200) {
              this.$nuxt.$loading.finish()
              this.$toast.success('User berhasil diedit')
              this.fetchData()
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

    async handleEditPassword() {
      if (this.payload.password) {
        const formData = new FormData()
        formData.append('password', this.payload.password)
        const headers = {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('auth.access_token'),
        }
        await this.$axios
          .post(`/admin/users/password/${this.selected[0].id}`, formData, {
            headers,
          })
          .then((res) => {
            if (res.status === 200) {
              this.$nuxt.$loading.finish()
              this.$toast.success('Password berhasil diedit')
              this.fetchData()
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
        const response = await this.$axios.delete(`/admin/users/${id}`, {
          headers,
        })

        if (response.status === 200) {
          this.$toast.success('User berhasil dihapus')
          this.closeDialogAndReset() // Tutup dialog setelah menghapus
        } else {
          console.log(response)
          this.$toast.error('Gagal menghapus user, silahkan coba lagi.')
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
        this.delete(item.id)
      })
      this.fetchData()
      this.dialogDelete = false
      this.selected = []
    },

    handleTegur(noWa) {
      const text = 
`
Halo, *${this.selected[0].name}*.

Admin mendapati bahwa anda tidak mengisi agenda kelas. Mohon untuk selalu mengisi agenda kelas dilain waktu.
`
      const ecodedURI = encodeURIComponent(text)
      window.open(`https://wa.me/${noWa}?text=${ecodedURI}`)
      this.dialogTegur = false
    }
  },
}
</script>

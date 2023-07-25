<template>
  <div>
    <v-row>
      <v-col cols="12" sm="12">
        <v-row justify="end">
          <v-col cols="12" sm="2">
            <div class="my-2">
              <form-dialog-vue
                :formFields="formFields"
                :submitButtonLabel="submitButtonLabel"
                @formSubmitted="handleFormSubmission"
              />
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        ><table-data
          :dataArr="siswaList"
          :headers="headers"
          :isLoading="loading"
          :title="title"
      /></v-col>
    </v-row>
  </div>
</template>

<script>
import TableData from '@/components/UiComponents/TableData.vue'
import FormDialogVue from '~/components/UiComponents/FormDialog.vue'
export default {
  components: {
    TableData,
    FormDialogVue,
  },

  data() {
    return {
      user: this.$auth.user.data,

      headers: [
        {
          text: 'Nama Siswa',
          align: 'start',
          sortable: true,
          value: 'nama_lengkap',
        },
        { text: 'Rombel', value: 'nama_rombel' },
        { text: 'Jurusan', value: 'jurusan' },
        { text: 'Akun', value: 'nama_akun' },
      ],
      title: 'Daftar Siswa',
      siswaList: [],
      rombelList: [
        { id: 1, nama: 'asdsad' },
        { id: 2, nama: 'asdggdjsdv' },
        { id: 3, nama: 'asd6yrusad' },
        { id: 4, nama: 'asdsdcsad' },
        { id: 6, nama: 'asxcbvjdsad' },
      ],
      loading: false,

      formFields: [
        { name: 'nisn', label: 'NISN', type: 'text' },
        { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text' },
        {
          name: 'jenis_kelamin',
          label: 'Jenis Kelamin',
          type: 'select',
          items: ['Laki-laki', 'Perempuan'],
        },
        {
          name: 'rombel',
          label: 'Rombongan Belajar',
          type: 'select',
          items: [],
        },
        // Add more fields here as needed
      ],
      submitButtonLabel: 'Tambah Siswa',
      submittedData: null,
    }
  },

  async mounted() {
    this.fetchSiswaData()
    this.fetchRombelData()
    console.log('List type:', typeof this.siswaList);
  },

  methods: {
    async fetchSiswaData() {
      if (this.$auth.loggedIn && this.$auth.strategy.token.get()) {
        const token = localStorage.getItem('auth.access_token')
        this.loading = true

        this.$axios.setHeader('Authorization', `Bearer ${token}`)
        this.$axios
          .get('http://localhost:8000/api/admin/siswa')
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
            this.formFields[3].items = JSON.stringify(response.data.data[0])
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

    async handleFormSubmission(formData) {
      // Proses data form yang diterima dari komponen anak
      this.submittedData = formData
      console.log(this.submittedData)
      this.fetchSiswaData()
      // Lakukan apa pun yang perlu dilakukan dengan data form di sini
    },

    async logout() {
      await this.$auth.logout()
      this.$toast.success('Logout Success')
      this.$router.push('/login')
    },
  },
}
</script>

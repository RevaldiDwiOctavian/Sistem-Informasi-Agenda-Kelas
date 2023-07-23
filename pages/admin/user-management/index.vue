<template>
    <div>
        <table-data :dataArr="siswaList" :headers="headers" :isLoading="loading"/>
    </div>
  </template>
  
  <script>
  import TableData from '@/components/UiComponents/TableData.vue'
  export default {
    components: {
      TableData,
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
        siswaList: [],
        loading: true,
      }
    },
  
    async asyncData({ $auth, $axios }) {
      console.log($auth.$storage.getUniversal('auth.access_token'))
      try {
        // Pastikan pengguna sudah terautentikasi dan memiliki token
        if ($auth.loggedIn && $auth.strategy.token.get()) {
          // Ambil token dari autentikasi
          const token = localStorage.getItem('auth.access_token')
          // Atur header dengan token untuk otorisasi
          $axios.setHeader('Authorization', `Bearer ${token}`)
  
          // Lakukan permintaan ke endpoint "localhost:3000/api/admin/siswas"
          const response = await $axios.get(
            'http://localhost:8000/api/admin/siswa'
          )
          const siswaList = response.data.data
  
          // Kembalikan data siswa untuk di-render pada halaman
          return { siswaList, loading: false }
        } else {
          // Jika pengguna belum terautentikasi atau token tidak tersedia
          return { siswaList: [], loading: false }
        }
      } catch (error) {
        console.error('Gagal mengambil data siswa:', error.message)
        // Set loading menjadi false dan kembalikan objek dengan data error
        return { siswaList: [], loading: false, error: error.message }
      }
    },
  
    mounted() {},
  
    methods: {
      async logout() {
        await this.$auth.logout()
        this.$toast.success("Logout Success");
        this.$router.push('/login')
      },
    },
  }
  </script>
  
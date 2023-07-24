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
  
    async mounted() {
    if (this.$auth.loggedIn && this.$auth.strategy.token.get()) {
      const token = localStorage.getItem('auth.access_token');

      this.$axios.setHeader('Authorization', `Bearer ${token}`);
      this.$axios
        .get('http://localhost:8000/api/admin/siswa')
        .then((response) => {
          this.siswaList = response.data.data;
          this.loading = false;
        })
        .catch((error) => {
          console.error('Gagal mengambil data siswa:', error.message);
          this.error = error.message;
          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  },
  
    methods: {
      async logout() {
        await this.$auth.logout()
        this.$toast.success("Logout Success");
        this.$router.push('/login')
      },
    },
  }
  </script>
  
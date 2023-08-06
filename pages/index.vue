<template>
  <v-container>
      <loading-overlay :is-loading="loading"/>
    <v-row>
      <v-col cols="12" sm="12">
        <v-card class="pa-4" tile> Selamat Datang, {{ user.name }} </v-card>
      </v-col>
    </v-row>
    <v-row justify="space-between">
      <v-col cols="12" sm="4">
        <dashboard-card :data="siswaCard" />
      </v-col>

      <v-col cols="12" sm="4">
        <dashboard-card :data="guruCard" />
      </v-col>

      <v-col cols="12" sm="4">
        <dashboard-card :data="rombelCard" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="8">
        <v-card class="pa-4" tile> SMK Tutwuri Handayani Cimahi </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="pa-4">
          <v-row>
          <v-col>
            <v-card class="mx-auto" max-width="344" outlined>
              <v-list-item three-line>
                <v-list-item-content>
                  <v-list-item-title class="text-h5 mb-1">
                    Informasi
                  </v-list-item-title>
                  <v-divider></v-divider>
                  <v-list-item-subtitle>Sistem Informasi Agenda Kelas</v-list-item-subtitle>
                  <v-list-item-subtitle>Versi 1.0.0</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-avatar
                  tile
                  size="80"
                  color="grey"
                ></v-list-item-avatar>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card class="mx-auto" max-width="344" outlined>
              <v-list-item three-line>
                <v-list-item-content>
                  <v-list-item-title class="text-h5 mb-1">
                    Bantuan
                  </v-list-item-title>
                  <v-divider></v-divider>
                  <v-list-item-subtitle><v-icon>mdi-email</v-icon> email@mail.com</v-list-item-subtitle>
                  <br />
                  <v-list-item-subtitle><v-icon>mdi-phone</v-icon>+6288123456789</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DashboardCard from '~/components/UiComponents/DashboardCard.vue'
import LoadingOverlayVue from '~/components/UiComponents/LoadingOverlay.vue'
export default {
  name: 'IndexPage',

  components: {
    'dashboard-card': DashboardCard,
    'loading-overlay': LoadingOverlayVue
  },

  data() {
    return {
      user: this.$auth.user.data,
      loading: true,
      siswaCard: {
        title: 'Jumlah Siswa',
        total: 0,
        icon: 'mdi-account-school',
      },
      guruCard: {
        title: 'Jumlah Guru',
        total: 0,
        icon: 'mdi-account-school',
      },
      rombelCard: {
        title: 'Jumlah Rombel',
        total: 0,
        icon: 'mdi-google-classroom',
      },
    }
  },

  async mounted() {
    try {
      const totalSiswa = await this.$axios.$get('/admin/siswa-total')
      const totalGuru = await this.$axios.$get('/admin/guru-total')
      const totalRombel = await this.$axios.$get('/admin/rombel-total')
      this.siswaCard.total = totalSiswa?.data
      this.guruCard.total = totalGuru?.data
      this.rombelCard.total = totalRombel?.data
      this.loading = false
    } catch (error) {
      this.loading = false
      this.$toast.error('Server sedang mengalami masalah')
      console.error('Error fetching data:', error)
    }
  },
}
</script>

<template>
  <div>
    <loading-overlay :is-loading="loading" />
    <v-row class="mb-1">
      <v-col cols="12" sm="12">
        <v-card class="pa-4" tile> Selamat Datang, {{ user.name }} </v-card>
      </v-col>
    </v-row>
    <div v-if="user.role === 'siswa'">
      <v-alert
        v-if="
          agendaKelasBelumKonfirmasi != 0 && agendaKelasBelumKonfirmasi != null
        "
        prominent
        type="error"
      >
        <v-row align="center">
          <v-col class="grow">
            Ada {{ agendaKelasBelumKonfirmasi }} agenda kelas belum
            dikonfirmasi.
          </v-col>
          <v-col class="shrink">
            <v-btn to="/siswa/konfirmasi-agenda-kelas">Cek Sekarang</v-btn>
          </v-col>
        </v-row>
      </v-alert>
      <div v-else>
        <v-alert prominent type="success">
          <v-row align="center">
            <v-col class="grow"> Tidak ada agenda kelas baru. </v-col>
          </v-row>
        </v-alert>
      </div>
    </div>
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
        <v-card class="pa-4" tile>
          <v-row>
            <v-col>
              <v-card-title>SMK Tutwuri Handayani Cimahi</v-card-title>
          <v-card-text><table>
            <tbody>
              <tr>
                <td>NPSN:</td>
                <td>20224102</td>
              </tr>
              <tr>
                <td>Kecamatan:</td>
                <td>Cimahi Utara</td>
              </tr>
              <tr>
                <td>Kota:</td>
                <td>Cimahi</td>
              </tr>
              <tr>
                <td>Provinsi:</td>
                <td>Jawa Barat</td>
              </tr>
            </tbody>
          </table></v-card-text>
            </v-col>
            <v-col>
              <div class="d-flex justify-end">
              <v-list-item-avatar tile size="128">
                <img src="iconDashboard.png" alt="icon" />
              </v-list-item-avatar>
            </div>
            </v-col>
          </v-row>
        </v-card>
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
                    <v-list-item-subtitle
                      >Sistem Informasi Agenda Kelas</v-list-item-subtitle
                    >
                    <v-list-item-subtitle>Versi 1.0.0</v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-avatar tile size="100">
                    <img src="iconDashboard.png" alt="icon" />
                  </v-list-item-avatar>
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
                    <v-list-item-subtitle
                      ><v-icon>mdi-email</v-icon>
                      email@mail.com</v-list-item-subtitle
                    >
                    <br />
                    <v-list-item-subtitle
                      ><v-icon>mdi-phone</v-icon
                      >+6288123456789</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import DashboardCard from '~/components/UiComponents/DashboardCard.vue'
import LoadingOverlayVue from '~/components/UiComponents/LoadingOverlay.vue'
export default {
  name: 'IndexPage',

  components: {
    'dashboard-card': DashboardCard,
    'loading-overlay': LoadingOverlayVue,
  },

  data() {
    return {
      user: this.$auth.user.data,
      loading: true,
      agendaKelasBelumKonfirmasi: null,
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
    const token = localStorage.getItem('auth.access_token')

    try {
      const totalSiswa = await this.$axios.$get('/admin/siswa-total')
      const totalGuru = await this.$axios.$get('/admin/guru-total')
      const totalRombel = await this.$axios.$get('/admin/rombel-total')

      this.siswaCard.total = totalSiswa?.data
      this.guruCard.total = totalGuru?.data
      this.rombelCard.total = totalRombel?.data

      if (this.user.role === 'siswa') {
        const totalAgendaKelasKonfirmasi = await await this.$axios.$get(
          `/siswa/jumlah-konfirmai-agenda-kelas/${this.user.rombel_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        this.agendaKelasBelumKonfirmasi = totalAgendaKelasKonfirmasi?.data
      }
      this.loading = false
    } catch (error) {
      this.loading = false
      this.$toast.error('Server sedang mengalami masalah')
      console.error('Error fetching data:', error)
    }
  },
}
</script>

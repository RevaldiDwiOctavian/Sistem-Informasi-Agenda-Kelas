<template>
  <v-container>
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
        <dashboard-card :data="siswaCard"/>
      </v-col>

      <v-col cols="12" sm="4">
        <dashboard-card :data="siswaCard"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DashboardCardVue from '../UiComponents/DashboardCard.vue'
export default {
  components: {
    'dashboard-card': DashboardCardVue,
  },

  data() {
    return {
      user: this.$auth.user.data,
      siswaCard : {
        title: "Jumlah Siswa",
        total: 100,
        icon: "mdi-account-school"
      }
    }
  },
}
</script>

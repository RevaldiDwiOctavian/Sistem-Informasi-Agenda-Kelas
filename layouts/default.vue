<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list shaped>
        <v-list-item to="/" router exact>
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dahsboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-group :value="false" prepend-icon="mdi-account-circle">
          <template v-slot:activator>
            <v-list-item-title>Management</v-list-item-title>
          </template>
          <v-list-item router exact>
            <v-list-item-action><v-icon>mdi-account</v-icon> </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>User Admin</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-group :value="false" prepend-icon="mdi-cog">
          <template v-slot:activator>
            <v-list-item-title>Management</v-list-item-title>
          </template>
          <v-list-item
            v-for="(item, i) in managements"
            :key="i"
            :to="item.to"
            router
            exact
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="clipped" dark app>
      <div v-if="$device.isDesktop">
        <v-app-bar-nav-icon @click.stop="miniVariant = !miniVariant" />
      </div>
      <div v-else>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      </div>

      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <div v-if="this.$device.isDesktop">{{ user.name }}</div>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="true" temporary fixed>
      <v-list>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              {{ user.name }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>

      <v-list shaped>
        <v-list-item to="/notifikasi">
          <v-list-item-action>
            <v-icon> mdi-bell </v-icon>
          </v-list-item-action>
          <v-list-item-title>Notifikasi</v-list-item-title>
        </v-list-item>

        <v-list-item @click="logout">
          <v-list-item-action>
            <v-icon> mdi-logout </v-icon>
          </v-list-item-action>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :absolute="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  props: {},
  data() {
    return {
      user: this.$auth.user.data,
      clipped: true,
      drawer: true,
      fixed: false,
      managements: [],
      miniVariant: false,
      rightDrawer: false,
      title: 'Sistem InformasiAgenda Kelas',
    }
  },

  mounted() {
    console.log
    if (this.$device.isMobile) {
      this.drawer = false
    }
    if (this.user.role == 'admin') {
      this.managements = [
        {
          icon: 'mdi-account-school',
          title: 'Guru',
          to: '/admin/guru-management',
        },
        {
          icon: 'mdi-google-classroom',
          title: 'Rombel',
          to: '/admin/rombel-management',
        },
        {
          icon: 'mdi-account-school',
          title: 'Siswa',
          to: '/admin/siswa-management',
        },
        {
          icon: 'mdi-bookshelf',
          title: 'Pembelajaran',
          to: '/admin/pembelejaran-management',
        },
        {
          icon: 'mdi-view-agenda',
          title: 'Agenda Kelas',
          to: '/admin/agenda-kelas-management',
        },
      ]
    } else if (this.user.role == 'walikelas') {
      this.items = [
        {
          icon: 'mdi-apps',
          title: 'Dashboard',
          to: '/',
        },
        {
          icon: 'mdi-account',
          title: 'User Management',
          to: '/user-management',
        },
      ]
    }
  },
  methods: {
    async logout() {
      await this.$auth.logout()
      this.$toast.success('Logout Success')
      this.$router.push('/login')
    },
  },
}
</script>

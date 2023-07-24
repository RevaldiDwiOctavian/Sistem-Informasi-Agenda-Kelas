<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <div v-if="items != null">
        <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      </div>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped"
      dark
      scroll-target="#scrolling-techniques-2" app>
      <div v-if="$device.isDesktop">
        <v-app-bar-nav-icon  @click.stop="miniVariant = !miniVariant" />
    </div>
      <div v-else>
        <v-app-bar-nav-icon  @click.stop="drawer = !drawer" />
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
    <v-navigation-drawer v-model="rightDrawer" :right=true temporary fixed>

      <v-list>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              {{ user.name }}
            </v-list-item-title>
            <v-list-item-subtitle>{{user.email}}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-icon>mdi-menu-down</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>

      <v-list>
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
  props: {
    
  },
  data() {
    return {
      user: this.$auth.user.data,
      clipped: true,
      drawer: true,
      fixed: false,
      items: [],
      miniVariant: false,
      rightDrawer: false,
      title: 'Sistem InformasiAgenda Kelas',
    }
  },

  mounted() {
    console.log
    if(this.$device.isMobile){
      this.drawer = false
    }
    if(this.user.role == 'admin'){
      this.items = [
      {
          icon: 'mdi-apps',
          title: 'Dashboard',
          to: '/',
        },
        {
          icon: 'mdi-account-school',
          title: 'Siswa Management',
          to: '/admin/siswa-management',
        },
      ]
    } else if (this.user.role == 'walikelas'){
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

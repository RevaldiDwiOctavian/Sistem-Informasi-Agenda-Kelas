<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      width="400"
      app
    >
      <v-list shaped>
        <v-list-item
          v-for="item in singleList"
          :key="item.to"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.label }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group
          :value="false"
          v-for="item in groupList"
          :key="item.to"
          :prepend-icon="item.icon"
          color="success"
        >
          <template v-slot:activator>
            <v-list-item-title>{{ item.label }}</v-list-item-title>
          </template>
          <v-list-item
            v-for="(child, j) in item.childrens"
            :key="j"
            :to="child.to"
            router
            exact
          >
            <v-list-item-icon> </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ child.label }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>{{ child.icon }}</v-icon>
            </v-list-item-icon>
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

      <v-toolbar-title
        ><span v-if="this.$device.isDesktop">{{ title }}</span></v-toolbar-title
      >
      <v-spacer />
      <div v-if="this.$device.isDesktop">{{ user.name }}</div>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container fluid>
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
      singleList: [],
      groupList: [],
      miniVariant: false,
      rightDrawer: false,
      title: 'Sistem InformasiAgenda Kelas',
    }
  },

  mounted() {
    if (this.$device.isMobile) {
      this.drawer = false
    }
    this.singleList = [
      {
        icon: 'mdi-view-dashboard',
        label: 'Dashboard',
        to: '/',
      },
    ]

    if (this.user.role === 'walikelas') {
      this.groupList = [
      {
          icon: 'mdi-view-agenda',
          label: 'Agenda Kelas',
          childrens: [
            {
              icon: 'mdi-view-agenda',
              label: 'Isi Agenda Kelas',
              to: '/guru/agenda-kelas',
            },
          ],
        },
        {
          icon: 'mdi-view-agenda',
          label: 'Rombel',
          childrens: [
            {
              icon: 'mdi-google-classroom',
              label: 'Lihat Rombel',
              to: '/walikelas/rombel',
            },
            {
              icon: 'mdi-view-agenda',
              label: 'Lihat Agenda Kelas',
              to: '/walikelas/agenda-kelas',
            },
          ],
        },
      ]
    }

    if (this.user.role === 'siswa') {
      this.groupList = [
        {
          icon: 'mdi-view-agenda',
          label: 'Menu',
          childrens: [
            {
              icon: 'mdi-view-agenda',
              label: 'Konfirmasi Agenda Kelas',
              to: '/siswa/konfirmasi-agenda-kelas',
            },
          ],
        },
      ]
    }

    if (this.user.role === 'guru') {
      this.groupList = [
        {
          icon: 'mdi-view-agenda',
          label: 'Agenda Kelas',
          childrens: [
            {
              icon: 'mdi-view-agenda',
              label: 'Isi Agenda Kelas',
              to: '/guru/agenda-kelas',
            },
          ],
        },
      ]
    }

    if (this.user.role === 'admin') {
      this.groupList = [
        {
          icon: 'mdi-account-circle',
          label: 'User',
          childrens: [
            {
              icon: 'mdi-checkbox-blank-circle',
              label: 'Admin',
              to: '/admin/user-management/user-admin',
            },
            {
              icon: 'mdi-checkbox-blank-circle',
              label: 'Wali Kelas',
              to: '/admin/user-management/user-walikelas',
            },
            {
              icon: 'mdi-checkbox-blank-circle',
              label: 'Guru',
              to: '/admin/user-management/user-guru',
            },
            {
              icon: 'mdi-checkbox-blank-circle',
              label: 'Siswa',
              to: '/admin/user-management/user-siswa',
            },
          ],
        },
        {
          icon: 'mdi-cog',
          label: 'Management',
          childrens: [
            {
              icon: 'mdi-account-school',
              label: 'Guru',
              to: '/admin/guru-management',
            },
            {
              icon: 'mdi-google-classroom',
              label: 'Rombel',
              to: '/admin/rombel-management',
            },
            {
              icon: 'mdi-account-school',
              label: 'Siswa',
              to: '/admin/siswa-management',
            },
            {
              icon: 'mdi-bookshelf',
              label: 'Pembelajaran',
              to: '/admin/pembelajaran-management',
            },
            {
              icon: 'mdi-view-agenda',
              label: 'Agenda Kelas',
              to: '/admin/agenda-kelas-management',
            },
          ],
        },
      ]
    }
  },
  methods: {
    async logout() {
      await this.$auth.logout()
      this.$toast.success('Logout Success')
    },
  },
}
</script>

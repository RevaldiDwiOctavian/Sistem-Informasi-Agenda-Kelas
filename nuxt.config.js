import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  store: true,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - SMK Tutwuri Handayani',
    title: 'Sistem Informasi Agenda Kelas',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/src/plugins/vue-toastification', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/auth-next',
    '@nuxtjs/device',
  ],

  workbox : {
    debug: true
 },

  device: {
    refreshOnResize: true
  },

  auth: {
    redirect: {
      login: '/login',
      logout: '/login',
      home: '/'
    },
    strategies: {
      'laravelSanctum' : {
        provider: 'laravel/sanctum',
        url: 'http://localhost:8000',
        // url: 'https://103.175.216.220',
        endpoints: {
          login: {
            url: '/api/login',
            method: 'POST'
          },
          logout: {
            url: '/api/logout',
            method: 'POST'
          }
        }
      },
      local: {
        token: {
          property: 'access_token',
          global: true,
        },
      }
    },
  },

  router: {
    middleware: ['auth']
  },


  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    // baseURL: 'https://103.175.216.220/api',
    baseURL: 'http://localhost:8000/api',
    credentials: true,
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      name: "Sistem Informasi Agenda Kelas",
      short_name: "SisFoAgendaKelas",
      description: "bla bla bla",
      theme_color: colors.blue.darken2,
      lang: "en",
      background_color: colors.grey.darken3,
    },

    meta: {
      name: "Sistem Informasi Agenda Kelas",
      description: "bla bla bla",
      author: "Revaldi Dwi Octavian",
      theme_color:  colors.blue.darken2,
      nativeUi: true,
      appleStatusBarStyle: "black",
      mobileAppIOS: true,
    },

    workbox: {
      
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  // vuetify: {
  //   customVariables: ['~/assets/variables.scss'],
  //   theme: {
  //     dark: true,
  //     themes: {
  //       dark: {
  //         primary: colors.blue.darken2,
  //         accent: colors.grey.darken3,
  //         secondary: colors.amber.darken3,
  //         info: colors.teal.lighten1,
  //         warning: colors.amber.base,
  //         error: colors.deepOrange.accent4,
  //         success: colors.green.accent3,
  //       },
  //     },
  //   },
  // },

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      // Set dark to false for a light theme
      dark: false,
      themes: {
        light: {
          primary: colors.blue.base, // Change primary color as needed
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}

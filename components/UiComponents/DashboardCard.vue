<template>
    <v-card
      class="mx-auto"
      outlined
    >
      <v-list-item three-line>
        <v-list-item-content>
          <div class="text-overline mb-4">
            {{ data && data.title }}
          </div>
          <v-list-item-title class="text-h5 mb-1">
            {{ data && data.total }}
          </v-list-item-title>
        </v-list-item-content>
  
        <v-list-item-avatar
          tile
          size="80"
        ><v-icon size="80">{{ data && data.icon }}</v-icon></v-list-item-avatar>
      </v-list-item>
    </v-card>
  </template>

<script>
export default {
    name: 'DashboardCard',

    props: {
        data: {
            type: Object,
            required: false
        },
    },

    data() {
    return {
      
    }
  },
}
</script>
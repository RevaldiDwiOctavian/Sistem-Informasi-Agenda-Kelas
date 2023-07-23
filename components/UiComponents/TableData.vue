<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="dataArr"
      item-key="id"
      show-select
      class="elevation-1"
      :search="search"
      :loading = "isLoading"
      loading-text="Loading... Please wait"
    >
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: 'TableData',
  props: {
    dataArr: {
      type: Array,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
    isLoading: {
        type: Boolean,
        default: false
    }
  },
  data() {
    return {
      selected: [],
      search: '',
    }
  },

  methods: {
    clickMe() {
      console.log(this.selected)
    },
  },
}
</script>

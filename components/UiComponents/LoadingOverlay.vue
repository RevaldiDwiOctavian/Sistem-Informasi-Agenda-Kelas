<template>
  <div class="text-center">
    <v-overlay :value="isLoading">
        <v-progress-circular
      :size="100"
      color="white"
      indeterminate
    ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
export default {
    name: 'LoadingOverlay',
  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({

  }),
}
</script>

<template>
  <div>
    <div v-if="user.role == 'admin'">
      <AdminMenu :name="user.name" />
    </div>
    <div v-else-if="user.role == 'guru'">
      <AdminMenu :name="user.name" />
    </div>
    <div v-else-if="user.role == 'siswa'">
      <AdminMenu :name="user.name" />
    </div>
    <div v-else>other menu <a href="#" @click.prevent="logout">Logout</a></div>
  </div>
</template>

<script>
import TableData from '@/components/UiComponents/TableData.vue'
export default {
  name: 'IndexPage',

  components: {
    TableData,
  },

  data() {
    return {
      user: this.$auth.user.data,
    }
  },

  mounted() {},
}
</script>

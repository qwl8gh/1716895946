<template>
  <a-layout>
    <a-layout-content style="padding: 2rem 1rem;">
      <LeadsTable />
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LeadsTable from '../components/LeadsTable.vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    LeadsTable,
  },
});
</script>

<style scoped>
</style>

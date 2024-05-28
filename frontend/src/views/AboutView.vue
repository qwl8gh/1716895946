<template>
  <a-layout>
    <a-layout-header>
      <a-typography-title level="2" style="color: white;">
        About
      </a-typography-title>
    </a-layout-header>
    <a-layout-content style="padding: 24px;">
      <a-typography-paragraph>
        This is an example about page.
      </a-typography-paragraph>
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AboutView',
});
</script>

<style scoped>
</style>
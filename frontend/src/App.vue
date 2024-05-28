<template>
  <a-layout>
    <a-layout-header style="background: #ffffff">
      <a-row>
        <a-col :flex="1">
          <a-menu mode="horizontal" :selectedKeys="[selectedKey]">
            <a-menu-item key="/" @click="navigate('/')">Home</a-menu-item>
            <a-menu-item key="/about" @click="navigate('/about')">About</a-menu-item>
          </a-menu>
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content style="padding: 24px;">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'App',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const selectedKey = computed(() => route.path);

    const navigate = (path: string) => {
      router.push(path);
    };

    return {
      selectedKey,
      navigate,
    };
  },
});
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;600&display=swap');

  body {
      background: #f0f2f5;
  }

  * {
      font-family: Nunito;
  }
</style>
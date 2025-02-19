<!-- App.vue -->

<template>
  <div id="app">
    <h1>Bienvenue sur notre site</h1>
    <nav>
      <router-link to="/preliminaires">Preliminaires</router-link>
      <router-link to="/johnson">Johnson</router-link>
      <router-link to="/maintenance">Maintenance</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
nav {
  margin-bottom: 20px;
}

router-link {
  margin-right: 10px;
}
</style>

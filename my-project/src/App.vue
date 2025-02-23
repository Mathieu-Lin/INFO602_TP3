<template>
  <div id="app">
    <header>
      <h1>INFO602 TP3 - Improvisé !</h1>
      <nav>
        <router-link to="/preliminaires" class="nav-link">Préliminaires</router-link>
        <router-link to="/johnson" class="nav-link">Johnson</router-link>
        <router-link to="/maintenance" class="nav-link">Maintenance</router-link>
        <router-link to="/casgeneral" class="nav-link">Cas Général</router-link>
      </nav>
    </header>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style scoped>
#app {
  font-family: 'Arial', sans-serif;
  text-align: center;
  padding: 20px;
  background-color: #f4f4f9;
  min-height: 100vh;
}

header {
  background-color: #4CAF50;
  color: white;
  padding: 15px 0;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  margin: 0;
  font-size: 2.5em;
  font-weight: bold;
}

nav {
  margin-top: 10px;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 1.2em;
  margin: 0 15px;
  padding: 8px 15px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #45a049;
}

.router-view {
  margin-top: 20px;
}
</style>

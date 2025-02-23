<template>
  <div id="app">
    <div class="container">
      <h1>Algorithme de Johnson pour Ordonnancement</h1>

      <div class="input-box">
        <h2>Entrez les Temps des Tâches</h2>

        <div class="input-group">
          <label for="temps0">Temps sur Machine 0 (Séparés par des virgules)</label>
          <input v-model="temps0" id="temps0" type="text" placeholder="Ex: 6,5,5,4" />
        </div>

        <div class="input-group">
          <label for="temps1">Temps sur Machine 1 (Séparés par des virgules)</label>
          <input v-model="temps1" id="temps1" type="text" placeholder="Ex: 2,4,3,4" />
        </div>

        <button @click="calculateJohnsonOrder" class="btn">Calculer Ordonnancement</button>
      </div>

      <div class="result-box" v-if="sigma.length">
        <h3>Ordonnancement Optimal :</h3>
        <p>{{ sigma.join(' -> ') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  /* eslint-disable vue/multi-word-component-names */
  name: 'Johnson',
  data() {
    return {
      temps0: '',  // Temps sur Machine 0
      temps1: '',  // Temps sur Machine 1
      sigma: [],   // Ordonnancement optimal
    };
  },
  methods: {
    // Question 2
    // Fonction tri_tache pour trier les tâches en fonction de tm0 et tm1
    tri_tache(tab) {
      // Filtrer et trier les tâches en fonction de tm0 < tm1 et tm0 >= tm1
      const I0 = tab.filter(task => task.tm0 < task.tm1).sort((a, b) => a.tm0 - b.tm0);
      const I1 = tab.filter(task => task.tm0 >= task.tm1).sort((a, b) => b.tm1 - a.tm1);

      // Retourner les deux listes triées
      return { I0, I1 };
    },
    // Question 3
    // Simulation de la fonction Johnson en JavaScript pour l'interface
    johnson(n, temps0, temps1) {
      // Créer un tableau de tâches
      const tab = [];
      for (let i = 0; i < n; i++) {
        tab.push({ tm0: temps0[i], tm1: temps1[i], ind: i });
      }

      // Utilisation de la fonction tri_tache pour trier les tâches
      const { I0, I1 } = this.tri_tache(tab);


      // Concaténer I0 et I1 pour obtenir l'ordonnancement
      const orderedTasks = [...I0, ...I1];

      // Remplir le tableau sigma avec les indices des tâches
      return orderedTasks.map(task => task.ind);
    },
    // Fonction pour calculer l'ordonnancement Johnson
    calculateJohnsonOrder() {
      const temps0Arr = this.temps0.split(',').map(Number);
      const temps1Arr = this.temps1.split(',').map(Number);
      const n = temps0Arr.length;

      // Appel de la fonction johnson
      this.sigma = this.johnson(n, temps0Arr, temps1Arr);
    }
  },
};
</script>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  margin-top: 50px;
}

.container {
  width: 80%;
  margin: 0 auto;
}

h1 {
  font-size: 2.5em;
  color: #4CAF50;
}

.input-box {
  background-color: #f9f9f9;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  font-size: 1.2em;
  margin-bottom: 5px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  font-size: 1.1em;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 15px 20px;
  font-size: 1.2em;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #45a049;
}

.result-box {
  font-size: 1.5em;
  font-weight: bold;
  margin-top: 20px;
  color: #4CAF50;
}
</style>

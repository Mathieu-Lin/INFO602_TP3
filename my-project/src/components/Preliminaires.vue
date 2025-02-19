<template>
  <div id="app">
    <div class="container">
      <h1>Calcul du Temps Total des Opérations</h1>

      <div class="input-box">
        <h2>Entrez les Temps des Tâches</h2>
        <div class="input-group">
          <label for="temps0">Temps sur Machine 0</label>
          <input v-model="temps0" id="temps0" type="text" placeholder="Ex: 6,5,5,4" />
        </div>
        <div class="input-group">
          <label for="temps1">Temps sur Machine 1</label>
          <input v-model="temps1" id="temps1" type="text" placeholder="Ex: 2,4,3,4" />
        </div>
        <div class="input-group">
          <label for="sigma">Ordonnancement</label>
          <input v-model="sigma" id="sigma" type="text" placeholder="Ex: 0,1,2,3" />
        </div>
        <button @click="calculateTotalTime" class="btn">Calculer Temps Total</button>
      </div>

      <div class="result-box" v-if="totalTime !== null">
        <p><strong>Temps Total des Opérations : {{ totalTime }} minutes</strong></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  /* eslint-disable vue/multi-word-component-names */
  name: 'Preliminaires',
  data() {
    return {
      temps0: '',  // Entrée des temps sur la machine 0
      temps1: '',  // Entrée des temps sur la machine 1
      sigma: '',   // Entrée de l'ordonnancement
      totalTime: null, // Temps total calculé
    };
  },
  methods: {
    // Fonction pour calculer le temps total en fonction des entrées
    calculateTotalTime() {
      const temps0Arr = this.temps0.split(',').map(Number);
      const temps1Arr = this.temps1.split(',').map(Number);
      const sigmaArr = this.sigma.split(',').map(Number);

      // Appeler la fonction temps_total pour calculer le temps total
      this.totalTime = this.temps_total(temps0Arr.length, temps0Arr, temps1Arr, sigmaArr);
    },
    temps_total(n, temps0, temps1, sigma) {
      let finTempsMachine0 = 0;
      let finTempsMachine1 = 0;
      let tempsTotal = 0;

      for (let i = 0; i < n; i++) {
        const tacheIndex = sigma[i];

        const debutMachine0 = finTempsMachine0;
        const finMachine0 = debutMachine0 + temps0[tacheIndex];
        finTempsMachine0 = finMachine0;

        const debutMachine1 = Math.max(finTempsMachine0, finTempsMachine1);
        const finMachine1 = debutMachine1 + temps1[tacheIndex];
        finTempsMachine1 = finMachine1;

        tempsTotal = finMachine1;
      }

      return tempsTotal;
    },
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

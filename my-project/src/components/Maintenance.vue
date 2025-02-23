<template>
  <div id="app">
    <div class="container">
      <h1>Calcul du Temps Total avec Maintenance</h1>

      <div class="input-box">
        <h2>Entrée des Données</h2>
        <div class="input-group">
          <label for="machineA">Temps sur Machine A</label>
          <input v-model="machineAInput" id="machineA" type="text" placeholder="Ex: 6,5,5,4" />
        </div>
        <div class="input-group">
          <label for="machineB">Temps sur Machine B</label>
          <input v-model="machineBInput" id="machineB" type="text" placeholder="Ex: 2,4,3,4" />
        </div>
        <div class="input-group">
          <label for="taskOrder">Ordre des Tâches</label>
          <input v-model="taskOrderInput" id="taskOrder" type="text" placeholder="Ex: 0,1,2,3" />
        </div>
        <div class="input-group">
          <label for="maintenanceStart">Début de Maintenance</label>
          <input v-model.number="maintenanceStart" id="maintenanceStart" type="number" placeholder="Ex: 10" />
        </div>
        <div class="input-group">
          <label for="maintenanceEnd">Fin de Maintenance</label>
          <input v-model.number="maintenanceEnd" id="maintenanceEnd" type="number" placeholder="Ex: 18" />
        </div>

        <button @click="calculateTotalTime" class="btn">Calculer Temps</button>
        <button @click="calculateOptimalOrder" class="btn secondary">Ordre Optimal</button>
        <button @click="calculateExactSolution" class="btn secondary">Solution Exacte</button>
      </div>

      <div class="result-box" v-if="totalTime !== null">
        <p><strong>Temps Total : {{ totalTime }} min</strong></p>
      </div>

      <div class="result-box" v-if="optimalOrder.length">
        <p><strong>Ordre Optimal : {{ optimalOrder.join(', ') }}</strong></p>
      </div>

      <!-- Affichage du résultat exact -->
      <div class="result-box" v-if="exactSolution !== null">
        <p><strong>Temps Total Exact : {{ exactSolution }} min</strong></p>
        <p><strong>Details :</strong></p>
        <pre>{{ exactDetails }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MaintenanceScheduler',
  data() {
    return {
      machineAInput: '',
      machineBInput: '',
      taskOrderInput: '',
      maintenanceStart: 0,
      maintenanceEnd: 0,
      totalTime: null,
      optimalOrder: [],
      exactSolution: null,
      exactDetails: '',  // Détails de la solution exacte
      memo: {}  // Stockage des résultats de la programmation dynamique
    };
  },
  methods: {
    // Question 4
    calculateTotalTime() {
      const machineA = this.machineAInput.split(',').map(Number);
      const machineB = this.machineBInput.split(',').map(Number);
      const taskOrder = this.taskOrderInput.split(',').map(Number);
      this.totalTime = this.computeTotalTime(machineA, machineB, taskOrder, this.maintenanceStart, this.maintenanceEnd);
    },

    computeTotalTime(machineA, machineB, order, maintenanceStart, maintenanceEnd) {
      let total = machineA.reduce((sum, time) => sum + time, 0);
      if (maintenanceStart < total) total += maintenanceEnd - maintenanceStart;
      total += machineB[order[order.length - 1]];

      let cumulativeTime = machineA[order[0]];
      let maintenanceApplied = false;
      let delay = 0;

      for (let i = 0; i < order.length - 1; i++) {
        cumulativeTime += machineA[order[i + 1]];
        if (cumulativeTime > maintenanceStart && !maintenanceApplied) {
          machineA[order[i + 1]] += maintenanceEnd - maintenanceStart;
          maintenanceApplied = true;
        }
        if (machineB[order[i]] > machineA[order[i + 1]]) {
          delay += machineB[order[i]] - machineA[order[i + 1]];
        }
        if (machineB[order[i]] < machineA[order[i + 1]] && delay !== 0) {
          delay = Math.max(delay - (machineA[order[i + 1]] - machineB[order[i]]), 0);
        }
      }
      return total + delay;
    },

    // Question 5
    calculateOptimalOrder() {
      const machineA = this.machineAInput.split(',').map(Number);
      const machineB = this.machineBInput.split(',').map(Number);
      this.optimalOrder = this.approx(machineA, machineB, this.maintenanceStart, this.maintenanceEnd);
    },

    approx(tempsM0, tempsM1, debutMaintenance, finMaintenance) {
      const n = tempsM0.length;
      const tasks = [...Array(n).keys()];

      const maxM1Task = tasks.reduce((maxIdx, i) => (tempsM1[i] > tempsM1[maxIdx] ? i : maxIdx), 0);
      const remainingTasks = tasks.filter(i => i !== maxM1Task);
      const sigma1 = [maxM1Task, ...remainingTasks];

      const sigma2 = [...tasks].sort((i, j) => (tempsM1[j] / tempsM0[j]) - (tempsM1[i] / tempsM0[i]));

      const time1 = this.computeTotalTime(tempsM0, tempsM1, sigma1, debutMaintenance, finMaintenance);
      const time2 = this.computeTotalTime(tempsM0, tempsM1, sigma2, debutMaintenance, finMaintenance);

      return time1 <= time2 ? sigma1 : sigma2;
    },

    // Question 6
// Solution exacte
    calculateExactSolution() {
      const machineA = this.machineAInput.split(',').map(Number);
      const machineB = this.machineBInput.split(',').map(Number);

      // Initialisation des variables pour la programmation dynamique
      const l = machineA.length;

      // Calcul du temps total minimal avec les ordres de tâches
      const { time, taskOrder } = this.computeMinimalTime(l, 0, 0, 0, 0, machineA, machineB);

      // Détails de l'exécution avec l'ordre exact des tâches
      this.exactDetails = `Programmation dynamique avec ${l} tâches.\nTemps minimal : ${time} minutes.\nOrdre des tâches : ${taskOrder.join(', ')}`;

      // Affichage du résultat
      this.exactSolution = time;
    },

// Programmation dynamique pour obtenir l'ordre des tâches exact
    computeMinimalTime(l, u0, u1, v0, v1, machineA, machineB, taskOrder = []) {
      const memoKey = `${l}-${u0}-${u1}-${v0}-${v1}`;
      if (this.memo[memoKey] !== undefined) {
        return this.memo[memoKey];
      }

      if (l === 0) {
        return {
          time: Math.max(u0, v0) + machineB[0],
          taskOrder
        };
      }

      let minTime = Infinity;
      let bestTaskOrder = [];

      for (let i = 0; i < l; i++) {
        const newU0 = Math.max(u0, machineA[i]);
        const newV0 = v0 + machineA[i];
        const newU1 = Math.max(u1, newV0 + machineB[i]);
        const newV1 = newV0 + machineB[i];

        const { time, taskOrder: newTaskOrder } = this.computeMinimalTime(
            l - 1, newU0, newU1, newV0, newV1, machineA, machineB,
            [...taskOrder, i]
        );

        if (time < minTime) {
          minTime = time;
          bestTaskOrder = newTaskOrder;
        }
      }

      this.memo[memoKey] = { time: minTime, taskOrder: bestTaskOrder };
      return { time: minTime, taskOrder: bestTaskOrder };
    }

  }
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
  margin: auto;
}

h1 {
  font-size: 2em;
  color: #4CAF50;
}

.input-box {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  font-size: 1.1em;
}

.input-group input {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.btn {
  background: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin: 5px;
}

.btn.secondary {
  background: #008CBA;
}

.result-box {
  font-size: 1.3em;
  font-weight: bold;
  margin-top: 20px;
  color: #4CAF50;
}
</style>

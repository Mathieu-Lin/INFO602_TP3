<template>
  <div class="container">
    <h2>Génération de la matrice des temps</h2>

    <div class="inputs-container">
      <div class="input-group">
        <label class="label">N (jobs) :</label>
        <input class="input" type="number" v-model="n" min="1" />
      </div>

      <div class="input-group">
        <label class="label">M (machines) :</label>
        <input class="input" type="number" v-model="m" min="1" />
      </div>

      <div class="input-group">
        <label class="label">tmax :</label>
        <input class="input" type="number" v-model="tmax" min="1" />
      </div>
    </div>

    <button class="btn" @click="genererMatrice">Générer la matrice</button>

    <h3>Matrice des temps :</h3>
    <table class="matrice-table" v-if="matrice.length">
      <tr v-for="(row, i) in matrice" :key="i">
        <td v-for="(val, j) in row" :key="j">{{ val }}</td>
      </tr>
    </table>

    <h3>Ordonnancement (sigma) :</h3>
    <input type="text" v-model="sigmaStr" placeholder="Ex: 0,2,1,3" class="input" />

    <button @click="calculerTempsTotal" class="btn">Calculer Temps Total</button>

    <h3 v-if="tempsTotal !== null">Temps total : {{ tempsTotal }}</h3>

    <div class="approches">
      <!-- Approche Gloutonne -->
      <div class="approche">
        <h3>Approche Gloutonne</h3>
        <button class="btn" @click="executerGlouton">Exécuter Glouton</button>
        <h4 v-if="sigmaGlouton.length">Ordre glouton : {{ sigmaGlouton.join(', ') }}</h4>
        <h4 v-if="tempsGlouton !== null">Temps total (glouton) : {{ tempsGlouton }}</h4>
      </div>

      <!-- Branch and Bound -->
      <div class="approche">
        <h3>Branch and Bound</h3>
        <button class="btn" @click="executerBranchBound">Exécuter Branch and Bound</button>
        <h4 v-if="sigmaBB.length">Meilleure solution : {{ sigmaBB.join(', ') }}</h4>
        <h4 v-if="tempsBB !== null">Temps total (BB) : {{ tempsBB }}</h4>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "CasGeneral",
  setup() {
    const n = ref(4);
    const m = ref(3);
    const tmax = ref(10);
    const matrice = ref([]);
    const sigmaStr = ref("");
    const tempsTotal = ref(null);
    const sigmaGlouton = ref([]);
    const tempsGlouton = ref(null);
    const sigmaBB = ref([]);
    const tempsBB = ref(null);

    // Question 7
    function matrice_alea(m, n, tmax) {
      return Array.from({ length: m }, () =>
          Array.from({ length: n }, () => Math.floor(Math.random() * tmax))
      );
    }

    function genererMatrice() {
      matrice.value = matrice_alea(n.value, m.value, tmax.value);
      tempsTotal.value = null;
      sigmaGlouton.value = [];
      tempsGlouton.value = null;
      sigmaBB.value = [];
      tempsBB.value = null;
    }

    // Question 8
    function temps_total(temps, sigma) {
      let total = 0;
      for (let i = 0; i < sigma.length; i++) {
        let job = sigma[i];
        total += temps[job].reduce((acc, t) => acc + t, 0);
      }
      return total;
    }

    function calculerTempsTotal() {
      const sigma = sigmaStr.value.split(",").map(Number);
      if (!sigma.every(i => i >= 0 && i < n.value)) {
        alert("Ordonnancement invalide !");
        return;
      }
      tempsTotal.value = temps_total(matrice.value, sigma);
    }

    // Question 9
    function executerGlouton() {
      sigmaGlouton.value = [...Array(n.value).keys()].sort((a, b) =>
          matrice.value[a].reduce((sum, t) => sum + t, 0) -
          matrice.value[b].reduce((sum, t) => sum + t, 0)
      );
      tempsGlouton.value = temps_total(matrice.value, sigmaGlouton.value);
    }

    // Question 10
// Question 12
    function executerBranchBound() {
      // Fonction pour calculer une borne inférieure (lower bound) pour un sous-ensemble de jobs
      function calculerBornesInferieures(partialSigma, remainingJobs) {
        let bound = 0;

        // Approximation de la borne inférieure : la somme des temps de chaque job restant
        // pour les machines les plus optimales
        for (let i = 0; i < remainingJobs.length; i++) {
          let job = remainingJobs[i];
          // Trouver le meilleur temps pour chaque machine
          bound += Math.min(...matrice.value[job]);
        }

        return bound;
      }

      function backtrack(partialSigma, remainingJobs) {
        if (remainingJobs.length === 0) {
          // Si aucun job n'est restant, on a une solution complète
          let currentTotal = temps_total(matrice.value, partialSigma);
          if (tempsBB.value === null || currentTotal < tempsBB.value) {
            tempsBB.value = currentTotal;
            sigmaBB.value = [...partialSigma];
          }
          return;
        }

        // Calculer la borne inférieure pour la solution partielle actuelle
        let bound = calculerBornesInferieures(partialSigma, remainingJobs);

        // Si la borne inférieure est meilleure que la meilleure solution actuelle, on explore
        if (tempsBB.value === null || bound < tempsBB.value) {
          for (let i = 0; i < remainingJobs.length; i++) {
            let nextJob = remainingJobs[i];
            backtrack([...partialSigma, nextJob], remainingJobs.filter((_, index) => index !== i));
          }
        }
      }

      sigmaBB.value = [];
      tempsBB.value = null;
      backtrack([], [...Array(n.value).keys()]);
    }


    return {
      n, m, tmax, matrice, sigmaStr, tempsTotal,
      sigmaGlouton, tempsGlouton, sigmaBB, tempsBB,
      genererMatrice, calculerTempsTotal, executerGlouton, executerBranchBound
    };
  }
};
</script>

<style scoped>
.container {
  width: 70%;
  margin: 0 auto;
  text-align: center;
  font-family: 'Arial', sans-serif;
}

h2, h3 {
  color: #333;
}

.inputs-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.input-group {
  width: 30%;
  text-align: left;
}

.label {
  font-size: 1em;
  margin-bottom: 5px;
}

.input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1em;
  margin-bottom: 15px;
}

.btn {
  background-color: #4CAF50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.btn:hover {
  background-color: #45a049;
}

.matrice-table {
  width: 80%;
  margin: 0 auto;
  border-collapse: collapse;
}

.matrice-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.approches {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.approche {
  width: 45%;
}

h4 {
  margin-top: 10px;
  color: #555;
}
</style>

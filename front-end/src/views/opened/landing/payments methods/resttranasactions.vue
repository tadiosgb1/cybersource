<template>
  <div class="transactions-wrapper">
    <h2>Transactions</h2>
    <table class="transaction-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="tx in transactions" :key="tx.id">
          <td>{{ tx._id }}</td>
          <td>{{ tx.amount }} {{ tx.currency }}</td>
          <td>
            <span :class="'status ' + tx.status.toLowerCase()">
              {{ tx.status }}
            </span>
          </td>
          <td>{{ tx.createdAt }}</td>

          <td class="actions">
            <button @click="getDetails(tx._id)">Details</button>
            <button 
              :disabled="tx.status !== 'AUTHORIZED'" 
              @click="capture(tx.transactionId,tx.amount,tx.currency)"
            >
              Capture
            </button>
            <button 
              :disabled="tx.status !== 'AUTHORIZED' && tx.status !== 'CAPTURED'"
              @click="reverse(tx.transactionId,tx.amount,tx.currency)"
            >
              Reversal
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Details Modal -->
    <div v-if="selectedTx" class="modal">
      <div class="modal-content">
        <h3>Transaction Details</h3>
        <pre>{{ selectedTx }}</pre>
        <button @click="selectedTx = null">Close</button>
      </div>
    </div>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: "RestTransactions",

  data() {
    return {
      transactions: [],
      selectedTx: null,
    };
  },




  async mounted(){
    const res = await axios.get("http://10.195.49.21:3000/api/transactions");
    this.transactions=res.data;
    console.log("res",res);
  },


  methods: {


    async getDetails(id) {
    console.log("detail id", id);
    try {
      const res = await axios.post(`http://10.195.49.21:3000/api/transactions/${id}/sync`);
      this.selectedTx = res.data;
      console.log("Details:", res.data);
    } catch (err) {
      console.error("Error fetching details", err);
    }
  },

  async capture(id,amount,currency) {
    console.log("capture id", id);
    const payload={
        amountDetails:{
          totalAmount:amount,
          currency:currency
        }
    }

    try {
      const res = await axios.post(`http://10.195.49.21:3000/api/capture/${id}`,payload);
      console.log("Capture response:", res.data);
      // Update UI after success
      const tx = this.transactions.find(t => t._id === id);
      if (tx) tx.status = "CAPTURED";
    } catch (err) {
      console.error("Error capturing payment", err);
    }
  },

  async reverse(id,amount,currency) {
    console.log("reverse id", id);
    const payload={
        amountDetails:{
          totalAmount:amount,
          currency:currency
        }
    }

    try {
      const res = await axios.post(`http://10.195.49.21:3000/api/reverse/${id}`,payload);
      console.log("Reverse response:", res.data);

      // Update UI after success
      const tx = this.transactions.find(t => t._id === id);
      if (tx) tx.status = "REVERSED";
    } catch (err) {
      console.error("Error reversing payment", err);
    }
  }



  }
};
</script>

<style scoped>
.transactions-wrapper {
  padding: 20px;
}

.transaction-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.transaction-table th,
.transaction-table td {
  padding: 10px;
  border: 1px solid #ddd;
}

.actions button {
  margin-right: 8px;
}

/* Status Colors */
.status.authorized {
  color: #1e88e5;
  font-weight: bold;
}
.status.captured {
  color: #43a047;
  font-weight: bold;
}
.status.reversed {
  color: #e53935;
  font-weight: bold;
}

/* Modal */
.modal {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  width: 400px;
  border-radius: 6px;
}
</style>
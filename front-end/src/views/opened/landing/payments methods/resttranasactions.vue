<template>
  <div class="page-container">
    <header class="main-header">
      <div class="header-content">
        <div class="logo">
          <span class="brand-name">WEGAGEN</span>
          <span class="brand-sub">Digital Banking Portal</span>
        </div>
        <nav class="header-nav">
          <span class="user-profile">Administrator</span>
          <button class="logout-btn">Logout</button>
        </nav>
      </div>
    </header>

    <main class="transactions-wrapper">
      <div class="content-header">
        <h2>Transaction Management</h2>
        <p>Monitor and manage real-time payment flows</p>
      </div>

      <div class="table-card">
        <table class="transaction-table">
          <thead>
            <tr>
              <th>Reference ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date Created</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="tx in transactions" :key="tx._id">
              <td class="font-mono">{{ tx._id.substring(0, 12) }}...</td>
              <td class="font-bold">{{ formatCurrency(tx.amount, tx.currency) }}</td>
              <td>
                <span :class="['status-badge', tx.status.toLowerCase()]">
                  {{ tx.status }}
                </span>
              </td>
              <td class="text-muted">{{ formatDate(tx.createdAt) }}</td>

              <td class="actions">
                <button class="btn btn-outline" @click="  goToDetails(tx.transactionId)">
                  Details
                </button>
                <button 
                  class="btn btn-primary"
                  :disabled="tx.status !== 'AUTHORIZED'" 
                  @click="capture(tx.transactionId, tx.amount, tx.currency)"
                >
                  Capture
                </button>
                <button 
                  class="btn btn-danger"
                  :disabled="tx.status !== 'AUTHORIZED' && tx.status !== 'CAPTURED'"
                  @click="reverse(tx.transactionId, tx.amount, tx.currency)"
                >
                  Reverse
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <footer class="main-footer">
      <div class="footer-content">
        <p>&copy; 2026 Wegagen Bank S.C. All Rights Reserved.</p>
        <div class="footer-links">
          <span>Support: +251 11 552 3800</span>
          <span>Security Policy</span>
        </div>
      </div>
    </footer>

    <transition name="fade">
      <div v-if="selectedTx" class="modal-overlay" @click.self="selectedTx = null">
        <div class="modal-card">
          <div class="modal-header">
            <h3>Transaction Information</h3>
            <button class="close-btn" @click="selectedTx = null">&times;</button>
          </div>
          <div class="modal-body">
            <pre>{{ JSON.stringify(selectedTx, null, 2) }}</pre>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="selectedTx = null">Done</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "WegagenTransactions",
  data() {
    return {
      transactions: [],
      selectedTx: null,
      apiUrl: "http://localhost:5000/api"
    };
  },
  async mounted() {
    this.fetchTransactions();
  },
  methods: {
    async fetchTransactions() {
      try {
        const res = await axios.get(`${this.apiUrl}/transactions`);
        this.transactions = res.data;
      } catch (err) {
        console.error("Fetch error:", err);
      }
    },
    formatCurrency(amount, currency) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'ETB',
      }).format(amount);
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    },
    goToDetails(id) {
    this.$router.push({ 
      name: 'TransactionDetail', 
      params: { id: id } 
    });
  },
    async capture(id, amount, currency) {
      if (!confirm("Confirm fund capture?")) return;
      try {
        await axios.post(`${this.apiUrl}/capture/${id}`, {
          amountDetails: { totalAmount: amount, currency }
        });
        this.fetchTransactions(); // Refresh list
      } catch (err) {
        console.error(err);
      }
    },
    async reverse(id, amount, currency) {
      if (!confirm("Are you sure you want to reverse this transaction?")) return;
      try {
        await axios.post(`${this.apiUrl}/reverse/${id}`, {
          amountDetails: { totalAmount: amount, currency }
        });
        this.fetchTransactions();
      } catch (err) {
        console.error(err);
      }
    }
  }
};
</script>

<style scoped>
/* Color Variables */
:root {
  --primary-blue: #1a237e;
  --wegagen-orange: #ff8f00;
  --bg-gray: #f4f7f9;
  --text-dark: #333;
  --border-color: #e0e0e0;
}

.page-container {
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f4f7f9;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header & Footer */
.main-header {
  background: #1a237e; /* Deep Bank Blue */
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 1px;
  color: #ff8f00; /* Wegagen Orange */
}

.brand-sub {
  display: block;
  font-size: 0.7rem;
  text-transform: uppercase;
  opacity: 0.8;
}

.main-footer {
  background: #fff;
  border-top: 1px solid var(--border-color);
  padding: 1.5rem;
  margin-top: auto;
  font-size: 0.85rem;
  color: #666;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}

/* Layout */
.transactions-wrapper {
  max-width: 1200px;
  margin: 2rem auto;
  width: 100%;
  padding: 0 1rem;
}

.content-header {
  margin-bottom: 2rem;
}

.content-header h2 {
  color: var(--primary-blue);
  margin: 0;
}

.table-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  overflow: hidden;
}

/* Table Styling */
.transaction-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.transaction-table th {
  background: #f8f9fa;
  padding: 1rem;
  font-weight: 600;
  color: #444;
  border-bottom: 2px solid var(--border-color);
}

.transaction-table td {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
}

/* Status Badges */
.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
}

.status-badge.authorized { background: #e3f2fd; color: #1976d2; }
.status-badge.captured { background: #e8f5e9; color: #2e7d32; }
.status-badge.reversed { background: #ffebee; color: #c62828; }

/* Buttons */
.btn {
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;
  border: 1px solid transparent;
  margin-left: 5px;
}

.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-primary { background: var(--primary-blue); color: rgb(108, 9, 201); }
.btn-outline { border-color: var(--primary-blue); color: var(--primary-blue); background: white; }
.btn-danger { background: #fff; border-color: #d32f2f; color: #d32f2f; }
.btn-danger:hover:not(:disabled) { background: #d32f2f; color: white; }

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
}

.modal-card {
  background: white;
  width: 600px;
  max-width: 90%;
  border-radius: 8px;
  overflow: hidden;
}

.modal-header {
  padding: 1rem;
  background: var(--primary-blue);
  color: white;
  display: flex;
  justify-content: space-between;
}

.modal-body {
  padding: 1.5rem;
  max-height: 400px;
  overflow-y: auto;
}

pre {
  background: #f4f4f4;
  padding: 1rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.text-muted { color: #888; }
.font-mono { font-family: monospace; }
.font-bold { font-weight: 700; }
</style>
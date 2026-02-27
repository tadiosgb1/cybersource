<template>
  <div class="detail-container">
    <div class="breadcrumb">
      <router-link to="/transactions">Transactions</router-link> / 
      <span>Detail: {{ transactionId }}</span>
    </div>

    <div v-if="loading" class="loader-wrapper">
      <div class="spinner"></div>
      <p>Fetching secure transaction data...</p>
    </div>

    <div v-else-if="error" class="error-card">
      <p>{{ error }}</p>
      <button @click="fetchDetails" class="btn btn-primary">Retry</button>
    </div>

    <div v-else class="detail-card">
      <header class="detail-header">
        <div class="header-left">
          <span :class="['status-pill', transaction.status.toLowerCase()]">
            {{ transaction.status }}
          </span>
          <h1>Transaction Details</h1>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" @click="printPage">Print Receipt</button>
          <button class="btn btn-primary" @click="$router.go(-1)">Back to List</button>
        </div>
      </header>

      <div class="detail-grid">
        <section class="info-section main-info">
          <h3>Financial Overview</h3>
          <div class="info-row highlight">
            <span class="label">Total Amount</span>
            <span class="value">{{ formatCurrency(transaction.amount, transaction.currency) }}</span>
          </div>
          <div class="info-row">
            <span class="label">Transaction ID</span>
            <span class="value font-mono">
              {{ transaction.transactionId }}
              <button class="copy-btn" @click="copyId(transaction.transactionId)">📋</button>
            </span>
          </div>
          <div class="info-row">
            <span class="label">Internal Reference</span>
            <span class="value">{{ transaction._id }}</span>
          </div>
        </section>

        <section class="info-section">
          <h3>Date & Time</h3>
          <div class="info-row">
            <span class="label">Created At</span>
            <span class="value">{{ formatDate(transaction.createdAt) }}</span>
          </div>
          <div class="info-row" v-if="transaction.updatedAt">
            <span class="label">Last Modified</span>
            <span class="value">{{ formatDate(transaction.updatedAt) }}</span>
          </div>
        </section>

        <section class="info-section full-width">
          <h3>Technical Metadata</h3>
          <div class="metadata-box">
            <pre>{{ transaction.metadata || 'No additional metadata available' }}</pre>
          </div>
        </section>
      </div>

      <footer class="audit-footer">
        <p>Verified by Wegagen Bank Core Banking System &bull; Audit Log ID: {{ transaction.auditId || 'N/A' }}</p>
      </footer>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TransactionDetail",
  props: ["id"], // Passed via router
  data() {
    return {
      transaction: null,
      loading: true,
      error: null,
      transactionId: this.$route.params.id // Using route param if prop isn't used
    };
  },
  created() {
    this.fetchDetails();
  },
  methods: {
    async fetchDetails() {
      this.loading = true;
      this.error = null;
      try {
        // Updated to your requested endpoint: /api/payment/:id
        const res = await axios.get(`http://localhost:5000/api/payment/${this.transactionId}`);
        this.transaction = res.data;
      } catch (err) {
        this.error = "Unable to retrieve transaction details. Please verify your connection.";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    formatCurrency(amount, currency) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'ETB',
      }).format(amount);
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    copyId(text) {
      navigator.clipboard.writeText(text);
      alert("Transaction ID copied to clipboard");
    },
    printPage() {
      window.print();
    }
  }
};
</script>

<style scoped>
.detail-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.breadcrumb {
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.breadcrumb a { color: #1a237e; text-decoration: none; }

/* Main Card */
.detail-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  border-top: 5px solid #ff8f00; /* Wegagen Orange Accent */
  overflow: hidden;
}

.detail-header {
  padding: 2rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left h1 {
  margin: 0.5rem 0 0 0;
  font-size: 1.5rem;
  color: #1a237e;
}

/* Status Pills */
.status-pill {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
}
.status-pill.captured { background: #e8f5e9; color: #2e7d32; }
.status-pill.authorized { background: #e3f2fd; color: #1976d2; }
.status-pill.reversed { background: #ffebee; color: #c62828; }

/* Grid Layout */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
}

.info-section h3 {
  font-size: 0.85rem;
  text-transform: uppercase;
  color: #999;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 0.5rem;
}

.info-row {
  margin-bottom: 1.2rem;
}

.info-row.highlight .value {
  font-size: 1.8rem;
  color: #1a237e;
  font-weight: 800;
}

.label {
  display: block;
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.2rem;
}

.value {
  font-weight: 600;
  color: #333;
}

.full-width { grid-column: span 2; }

/* Buttons & Utils */
.btn {
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  border: none;
  transition: 0.2s;
}

.btn-primary { background: #1a237e; color: white; }
.btn-outline { background: white; border: 1px solid #ccc; margin-right: 10px; }

.copy-btn {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 10px;
  opacity: 0.6;
}

.metadata-box pre {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #444;
  overflow-x: auto;
}

.audit-footer {
  padding: 1.5rem 2rem;
  background: #fcfcfc;
  border-top: 1px solid #eee;
  text-align: center;
  font-size: 0.75rem;
  color: #aaa;
}

/* Printing logic */
@media print {
  .header-actions, .breadcrumb, .copy-btn { display: none; }
  .detail-card { box-shadow: none; border: 1px solid #ccc; }
}

/* Loader */
.loader-wrapper {
  text-align: center;
  padding: 4rem;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ff8f00;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>
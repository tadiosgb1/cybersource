<template>
  <div class="page-container">
    <header class="main-header">
      <div class="header-content">
        <div class="logo-section">
          <span class="brand-name">Haile Reort</span>
          <span class="brand-tagline">Empowering Your Progress</span>
        </div>
        <div class="security-badge">
          <span class="lock-icon">🔒</span> Secure Checkout
        </div>
      </div>
    </header>

    <main class="payment-wrapper">
      <div class="payment-card">
        <div class="card-top-accent"></div>
        
        <div class="card-content">
          <h2 class="section-title">Order Summary</h2>
          <p class="instruction-text">Please review your transaction details before proceeding to the secure payment server.</p>

          <div class="summary-box">
            <div class="summary-item">
              <span class="label">Invoice Number</span>
              <span class="value">{{ order.reference_number }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Payment Currency</span>
              <span class="value">{{ order.currency }}</span>
            </div>
            <div class="summary-item total">
              <span class="label">Total Amount</span>
              <span class="value">{{ order.amount }} {{ order.currency }}</span>
            </div>
          </div>

          <form
            v-if="signatureData"
            :action="cyberSourceUrl"
            method="post"
            class="payment-form"
          >
            <input type="hidden" name="access_key" :value="signatureData.access_key" />
            <input type="hidden" name="profile_id" :value="signatureData.profile_id" />
            <input type="hidden" name="transaction_uuid" :value="signatureData.transaction_uuid" />
            <input type="hidden" name="signed_field_names" :value="signatureData.signed_field_names" />
            <input type="hidden" name="unsigned_field_names" value="" />
            <input type="hidden" name="signed_date_time" :value="signatureData.signed_date_time" />
            <input type="hidden" name="locale" value="en" />
            <input type="hidden" name="amount" :value="order.amount" />
            <input type="hidden" name="currency" :value="order.currency" />
            <input type="hidden" name="reference_number" :value="order.reference_number" />
            <input type="hidden" name="transaction_type" value="sale" />
            <input type="hidden" name="signature" :value="signatureData.signature" />

            <div class="security-notice">
              <p>You will be redirected to our secure CyberSource partner for card processing.</p>
            </div>

            <button type="submit" class="btn btn-pay">
              Confirm & Pay Now
            </button>
          </form>

          <button
            v-else
            @click="getSignature"
            :disabled="loading"
            class="btn btn-checkout"
          >
            <span v-if="loading" class="spinner"></span>
            {{ loading ? "Establishing Secure Connection..." : "Generate Secure Token" }}
          </button>
        </div>
      </div>

      <div class="payment-trust-logos">
        <span class="visa">VISA</span>
        <span class="mastercard">MasterCard</span>
        <span class="cybersource">CyberSource</span>
      </div>
    </main>

    <footer class="main-footer">
      <div class="footer-content">
        <p>&copy; 2026 Wegagen Bank S.C. All Rights Reserved.</p>
        <div class="footer-contact">
          <span>Contact Support: 8667 (Toll Free)</span>
          <span class="separator">|</span>
          <span>info@wegagenbanksc.com.et</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
export default {
  name: "WegagenPaymentPortal",
  data() {
    return {
      loading: false,
      cyberSourceUrl: "https://testsecureacceptance.cybersource.com/pay",
      signatureData: null,
      order: {
        amount: "102.21",
        currency: "USD",
        reference_number: "INV-" + Date.now(),
        transaction_uuid: uuidv4(),
      },
    };
  },
  methods: {
    async getSignature() {
      this.loading = true;
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_BASE_URL_LOCAL}/api/sign-request`,
          {
            amount: this.order.amount,
            currency: this.order.currency,
            transaction_uuid: this.order.transaction_uuid,
            reference_number: this.order.reference_number,
          }
        );

        this.signatureData = response.data;

      } catch (err) {
        console.error("Failed to get signature", err);
        alert("Security Error: Could not verify transaction signature. Please contact Wegagen Support.");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Wegagen Theme Colors */
:root {
  --wegagen-blue: #1a237e;
  --wegagen-gold: #ff8f00;
  --bg-soft: #f4f7f9;
}

.page-container {
  font-family: 'Segoe UI', Arial, sans-serif;
  background-color: #f4f7f9;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.main-header {
  background: #1a237e;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header-content {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-name {
  font-size: 1.6rem;
  font-weight: 800;
  color: #ff8f00;
  letter-spacing: 1px;
}

.brand-tagline {
  display: block;
  font-size: 0.7rem;
  opacity: 0.9;
  text-transform: uppercase;
}

/* Card Styling */
.payment-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.payment-card {
  background: white;
  width: 100%;
  max-width: 450px;
  border-radius: 12px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  overflow: hidden;
}

.card-top-accent {
  height: 6px;
  background: linear-gradient(90deg, #1a237e, #ff8f00);
}

.card-content {
  padding: 2.5rem;
}

.section-title {
  color: #1a237e;
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
}

.instruction-text {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 2rem;
}

/* Summary Box */
.summary-box {
  background: #f8f9fb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #edf2f7;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
}

.summary-item.total {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px dashed #cbd5e0;
}

.summary-item .label { color: #718096; font-size: 0.9rem; }
.summary-item .value { font-weight: 600; color: #2d3748; }
.summary-item.total .value { color: #1a237e; font-size: 1.25rem; font-weight: 800; }

/* Buttons */
.btn {
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-checkout {
  background: #1a237e;
  color: white;
}

.btn-checkout:hover:not(:disabled) {
  background: #0d1440;
}

.btn-pay {
  background: #27ae60;
  color: white;
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.2);
}

.btn-pay:hover { background: #219150; }

.security-notice {
  font-size: 0.75rem;
  color: #718096;
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 0 10px;
}

/* Footer */
.main-footer {
  background: #fff;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.footer-content {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #718096;
}

.separator { margin: 0 10px; color: #cbd5e0; }

.payment-trust-logos {
  margin-top: 2rem;
  display: flex;
  gap: 20px;
  opacity: 0.5;
  font-weight: bold;
  font-style: italic;
  color: #718096;
}

/* Utils */
.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255,255,255,.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  margin-right: 10px;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
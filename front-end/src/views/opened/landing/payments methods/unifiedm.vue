<template>
  <div class="p-6 max-w-xl mx-auto">

    <h1 class="text-2xl font-bold mb-4 text-gray-800">
      Wegagen Unified + Microform Payment
    </h1>

    <!-- ORDER SUMMARY -->
    <div class="bg-white shadow p-4 rounded-lg mb-4">
      <h2 class="text-lg font-semibold mb-2">Order Summary</h2>
      <p>Reference: {{ order.reference_number }}</p>
      <p>Amount: <strong>{{ order.amount }} {{ order.currency }}</strong></p>
    </div>

    <!-- MICROFORM CARD FIELDS -->
    <div class="bg-white shadow p-4 rounded-lg mb-6">

      <h3 class="text-md font-semibold mb-2 text-gray-700">
        Card Details (Secure Fields)
      </h3>

      <div id="number-container"
           class="border rounded p-3 mb-3 bg-gray-50">
      </div>

      <div id="cvv-container"
           class="border rounded p-3 mb-3 bg-gray-50">
      </div>

      <button
        @click="tokenizeCard"
        :disabled="loading"
        class="w-full bg-blue-600 text-white py-2 rounded font-semibold">
        {{ loading ? "Processing..." : "Pay Now" }}
      </button>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      loading: false,
      microformInstance: null,
      order: {
        amount: "55.10",
        currency: "USD",
        reference_number: "INV-" + Date.now(),
      },
    };
  },

  async mounted() {
    await this.initMicroform();
  },

  methods: {
    async initMicroform() {
      try {
        const session = await axios.get("http://localhost:3000/api/unified-session");

        const flex = new window.Flex(session.data.keyId);
        const microform = flex.microform({ styles: { input: { fontSize: "16px" } } });

        // Mount secure fields
        microform.createField("number").load("#number-container");
        microform.createField("securityCode").load("#cvv-container");

        this.microformInstance = microform;

      } catch (e) {
        console.error("Microform initialization failed", e);
      }
    },

    async tokenizeCard() {
      if (!this.microformInstance) return alert("Microform not ready");

      this.loading = true;

      try {
        const result = await this.microformInstance.tokenize({
          cardType: "001" // visa
        });

        const token = result.token;

        // send token + order to Node.js backend
        const response = await axios.post("http:// 10.195.49.18:3000/api/unified-pay", {
          token,
          amount: this.order.amount,
          currency: this.order.currency,
          reference_number: this.order.reference_number,
        });

        alert("Payment Success: " + response.data.status);

      } catch (err) {
        console.error("Token or payment error", err);
        alert("Payment failed");
      }

      this.loading = false;
    },
  },
};
</script>

<style>
/* Tailwind handles styling */
</style>
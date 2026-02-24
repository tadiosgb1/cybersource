<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
    <div class="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

      <h2 class="text-2xl font-bold text-gray-800 mb-6">Wegagen SDK Payment</h2>

      <form @submit.prevent="submitPayment" class="space-y-4">

        <input v-model="order.amount" placeholder="Amount" class="w-full border rounded p-2" />

        <input v-model="order.currency" placeholder="Currency (USD)" class="w-full border rounded p-2" />

        <!-- Only required if not using token -->
        <input v-model="card.number" placeholder="Card Number" class="w-full border rounded p-2" />
        <input v-model="card.expMonth" placeholder="Expiry Month (MM)" class="w-full border rounded p-2" />
        <input v-model="card.expYear" placeholder="Expiry Year (YYYY)" class="w-full border rounded p-2" />
        <input v-model="card.cvv" placeholder="CVV" class="w-full border rounded p-2" />

        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
          Pay via SDK
        </button>

      </form>

      <div v-if="result" class="mt-4 p-4 rounded bg-green-100 text-green-800">
        Payment Status: {{ result.status || result.decision }}
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      order: { amount: '100.00', currency: 'USD' },
      card: { number: '', expMonth: '', expYear: '', cvv: '' },
      token: null, // Optional, if using tokenized card
      result: null,
    };
  },
  methods: {
    async submitPayment() {
      try {
        const response = await axios.post('http:// 10.195.49.18:3000/api/sdk-pay', {
          ...this.order,
          ...this.card,
          token: this.token,
        });
        this.result = response.data;
      } catch (err) {
        console.error(err);
        alert('Payment failed');
      }
    },
  },
};
</script>
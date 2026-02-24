<template>
  <div class="p-6 max-w-md mx-auto bg-white shadow rounded">
    <h2 class="text-xl font-bold mb-4">Silent Order Payment</h2>

    <form
      v-if="signatureData"
      :action="sopUrl"
      method="post"
      class="space-y-4"
    >
      <!-- Hidden signed fields -->
      <input type="hidden" name="access_key" :value="signatureData.access_key" />
      <input type="hidden" name="profile_id" :value="signatureData.profile_id" />
      <input type="hidden" name="transaction_uuid" :value="signatureData.transaction_uuid" />
      <input type="hidden" name="signed_date_time" :value="signatureData.signed_date_time" />
      <input type="hidden" name="signed_field_names" :value="signatureData.signed_field_names" />
      <input type="hidden" name="signature" :value="signatureData.signature" />

      <input type="hidden" name="amount" :value="order.amount" />
      <input type="hidden" name="currency" :value="order.currency" />
      <input type="hidden" name="reference_number" :value="order.reference_number" />
      <input type="hidden" name="transaction_type" value="sale" />

      <!-- Card fields (user enters here) -->
      <div>
        <label class="block font-semibold">Card Number</label>
        <input v-model="card.number" name="card_number" type="text" class="w-full border rounded p-2" />
      </div>
      <div>
        <label class="block font-semibold">Expiry MM/YY</label>
        <input v-model="card.exp" name="card_expiry_date" type="text" class="w-full border rounded p-2" />
      </div>
      <div>
        <label class="block font-semibold">CVV</label>
        <input v-model="card.cvv" name="card_cvn" type="text" class="w-full border rounded p-2" />
      </div>

      <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg">Pay Now</button>
    </form>

    <button v-else @click="getSignature" class="w-full bg-gray-400 text-white py-3 rounded-lg">
      Preparing Secure Session...
    </button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      sopUrl: "https://testsecureacceptance.cybersource.com/silent/pay",
      signatureData: null,
      card: { number: "", exp: "", cvv: "" },
      order: { amount: "100", currency: "USD", reference_number: "INV-" + Date.now() },
    };
  },
  methods: {
    async getSignature() {
      const response = await axios.post("http:// 10.195.49.18:3000/api/silent-sign", {
        amount: this.order.amount,
        currency: this.order.currency,
      });
      this.signatureData = response.data;
    },
  },
};
</script>
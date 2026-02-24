<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Wegagen Payment Portal</h1>

    <div class="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
      <h3 class="text-xl font-semibold text-gray-700 mb-4">Order Summary</h3>

      <p class="text-gray-600 mb-1">Invoice: {{ order.reference_number }}</p>
      <p class="text-gray-800 font-bold mb-6">
        Amount: {{ order.amount }} {{ order.currency }}
      </p>

      <!-- Show form only AFTER signature is received -->
      <form
        v-if="signatureData"
        :action="cyberSourceUrl"
        method="post"
        class="space-y-3"
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

        <button
          type="submit"
          class="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold shadow"
        >
          Proceed to Secure Payment
        </button>
      </form>

      <button
        v-else
        @click="getSignature"
        :disabled="loading"
        class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold shadow mt-4"
      >
        {{ loading ? "Preparing Secure Session..." : "Checkout Now" }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // ✅ import UUID

export default {
  data() {
    return {
      loading: false,
      cyberSourceUrl: "https://testsecureacceptance.cybersource.com/pay",
      signatureData: null,
      order: {
        amount: "102.21",
        currency: "USD",
        reference_number: "INV-" + Date.now(),
        transaction_uuid: uuidv4(), // ✅ proper UUID
      },
    };
  },

  methods: {
    async getSignature() {
      this.loading = true;
      try {
        const response = await axios.post("http://10.195.49.18:3000/api/sign-request", {
          amount: this.order.amount,
          currency: this.order.currency,
          transaction_uuid: this.order.transaction_uuid, // ✅ UUID
          reference_number: this.order.reference_number,
        });

        this.signatureData = response.data;
      } catch (err) {
        console.error("Failed to get signature", err);
        alert("Security Error: Could not generate signature.");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
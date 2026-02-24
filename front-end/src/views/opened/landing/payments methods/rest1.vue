<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
    <div class="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">

      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">Wegagen REST Payment</h2>

      <!-- Order Summary -->
      <div class="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
        <p class="text-gray-700">Reference: <span class="font-semibold">{{ order.reference_number }}</span></p>
        <p class="text-gray-700">Amount: <span class="font-bold">{{ order.amount }} {{ order.currency }}</span></p>
      </div>

      <!-- Payment Form -->
      <form @submit.prevent="submitPayment" class="space-y-4">

        <!-- Card Info -->
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Card Information</h3>
        <div>
          <label class="block font-medium text-gray-600 mb-1">Card Number</label>
          <input
            v-model="card.number"
            type="text"
            maxlength="19"
            placeholder="4111 1111 1111 1111"
            class="w-full border-gray-300 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block font-medium text-gray-600 mb-1">Expiry Month</label>
            <input
              v-model="card.expMonth"
              type="text"
              maxlength="2"
              placeholder="MM"
              class="w-full border-gray-300 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label class="block font-medium text-gray-600 mb-1">Expiry Year</label>
            <input
              v-model="card.expYear"
              type="text"
              maxlength="4"
              placeholder="YYYY"
              class="w-full border-gray-300 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label class="block font-medium text-gray-600 mb-1">CVV</label>
          <input
            v-model="card.cvv"
            type="text"
            maxlength="4"
            placeholder="123"
            class="w-full border-gray-300 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <!-- Billing Info -->
        <h3 class="text-lg font-semibold text-gray-700 mt-4 mb-2">Billing Information</h3>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block font-medium text-gray-600 mb-1">First Name</label>
            <input
              v-model="billing.firstName"
              type="text"
              class="w-full border-gray-300 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label class="block font-medium text-gray-600 mb-1">Last Name</label>
            <input
              v-model="billing.lastName"
              type="text"
              class="w-full border-gray-300 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label class="block font-medium text-gray-600 mb-1">Email</label>
          <input
            v-model="billing.email"
            type="email"
            class="w-full border-gray-300 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label class="block font-medium text-gray-600 mb-1">Phone</label>
          <input
            v-model="billing.phoneNumber"
            type="text"
            class="w-full border-gray-300 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block font-medium text-gray-600 mb-1">Address</label>
          <input
            v-model="billing.address1"
            type="text"
            placeholder="Street Address"
            class="w-full border-gray-300 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block font-medium text-gray-600 mb-1">City</label>
            <input
              v-model="billing.locality"
              type="text"
              class="w-full border-gray-300 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block font-medium text-gray-600 mb-1">State</label>
            <input
              v-model="billing.administrativeArea"
              type="text"
              class="w-full border-gray-300 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block font-medium text-gray-600 mb-1">Postal Code</label>
            <input
              v-model="billing.postalCode"
              type="text"
              class="w-full border-gray-300 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label class="block font-medium text-gray-600 mb-1">Country</label>
          <input
            v-model="billing.country"
            type="text"
            placeholder="US"
            class="w-full border-gray-300 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold mt-4"
          :disabled="loading"
        >
          {{ loading ? 'Processing Payment...' : 'Pay Now' }}
        </button>
      </form>

      <!-- Result -->
      <div v-if="result" class="mt-6 p-4 rounded bg-green-100 text-green-800 text-center">
        Payment Status: {{ result.status }}
      </div>

    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      loading: false,
      result: null,
      order: {
        amount: "4000",
        currency: "ETB",
        reference_number: "INV-" + Date.now(),
      },
      card: {
        number: "4111111111111111",
        expMonth: "12",
        expYear: "2031",
        cvv: "123",
      },
      billing: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address1: "",
        locality: "",
        administrativeArea: "",
        postalCode: "",
        country: "",
      },
    };
  },
  methods: {
    async submitPayment() {
      this.loading = true;
      this.result = null;
      const payload = {
        clientReferenceInformation: { code: "TC5014554978_6" },
        paymentInformation: {
          card: {
            number: this.card.number,
            expirationMonth: this.card.expMonth,
            expirationYear: this.card.expYear,
            cvv:this.card.cvv
          },
        },
        orderInformation: {
          amountDetails: {
            totalAmount: this.order.amount,
            currency: this.order.currency,
          },
          billTo: { ...this.billing },
        },
      };


    console.log("Payload",payload);

      try {
        const response = await axios.post("http://10.195.49.21:3000/api/payments", payload);
        this.result = response.data;
      } catch (error) {
        console.error(error);
        alert("Payment failed. Check console for details.");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style>
/* Tailwind handles the majority of styling */
</style>
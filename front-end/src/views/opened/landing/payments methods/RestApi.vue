<template>
  <div class="min-h-screen flex flex-col bg-[#F8FAFC] font-sans text-slate-800">
    
    <header class="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <img src="https://www.wegagenbank.com.et/wp-content/uploads/2022/01/cropped-Wegagen-Bank-Logo-1.png" 
               alt="Wegagen Bank" class="h-10" />
          <div class="h-6 w-px bg-slate-200"></div>
          <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Secure Checkout</span>
        </div>
        <div class="flex items-center space-x-2 text-emerald-600">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 4.908-3.367 9.193-8 10.466-4.633-1.273-8-5.558-8-10.466 0-.68.056-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
          <span class="text-[11px] font-bold uppercase tracking-wider">Encrypted Session</span>
        </div>
      </div>
    </header>

    <main class="flex-grow py-12 px-6">
      <div class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-50 pb-4">Purchase Summary</h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-slate-500 font-medium">Reference</span>
                <span class="text-sm font-mono font-bold">{{ order.reference_number }}</span>
              </div>
              <div class="flex justify-between items-end pt-4 border-t border-slate-100">
                <span class="text-sm text-slate-500 font-medium">Total Amount</span>
                <div class="text-right">
                  <span class="text-[10px] font-black text-slate-400 block uppercase">{{ order.currency }}</span>
                  <span class="text-2xl font-black text-[#003366]">{{ order.amount }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start space-x-3">
            <span class="text-blue-500 text-lg">ℹ️</span>
            <p class="text-[11px] text-blue-800 leading-relaxed font-medium">
              Your payment is processed via Wegagen Bank's secure gateway. Card details are never stored on this merchant's server in compliance with PCI DSS standards.
            </p>
          </div>
        </div>

        <div class="lg:col-span-8 bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
          <div class="p-8 md:p-10">
            <form @submit.prevent="submitPayment" class="space-y-8">
              
              <section>
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-lg font-bold flex items-center">
                    <span class="w-8 h-8 bg-slate-100 text-[#003366] rounded-lg flex items-center justify-center text-xs mr-3">01</span>
                    Payment Method
                  </h3>
                  <div class="flex space-x-2 grayscale opacity-60">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" class="h-4" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" class="h-6" />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="md:col-span-2">
                    <label class="checkout-label">Credit Card Number</label>
                    <div class="relative">
                      <input v-model="card.number" type="text" maxlength="19" placeholder="0000 0000 0000 0000" class="checkout-input" required />
                      <div class="absolute right-4 top-1/2 -translate-y-1/2">💳</div>
                    </div>
                  </div>
                  <div>
                    <label class="checkout-label">Expiry Date</label>
                    <div class="flex space-x-3">
                      <input v-model="card.expMonth" type="text" maxlength="2" placeholder="MM" class="checkout-input text-center" required />
                      <input v-model="card.expYear" type="text" maxlength="4" placeholder="YYYY" class="checkout-input text-center" required />
                    </div>
                  </div>
                  <div>
                    <label class="checkout-label">Security Code (CVV)</label>
                    <input v-model="card.cvv" type="password" maxlength="4" placeholder="•••" class="checkout-input" required />
                  </div>
                </div>
              </section>

              <hr class="border-slate-100" />

              <section>
                <h3 class="text-lg font-bold flex items-center mb-6">
                  <span class="w-8 h-8 bg-slate-100 text-[#003366] rounded-lg flex items-center justify-center text-xs mr-3">02</span>
                  Billing Details
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="checkout-label">First Name</label>
                    <input v-model="billing.firstName" type="text" class="checkout-input" required />
                  </div>
                  <div>
                    <label class="checkout-label">Last Name</label>
                    <input v-model="billing.lastName" type="text" class="checkout-input" required />
                  </div>
                  <div class="md:col-span-2">
                    <label class="checkout-label">Street Address</label>
                    <input v-model="billing.address1" type="text" class="checkout-input" required />
                  </div>
                  <div class="grid grid-cols-3 gap-4 md:col-span-2">
                    <div class="col-span-1">
                      <label class="checkout-label">City</label>
                      <input v-model="billing.locality" type="text" class="checkout-input" />
                    </div>
                    <div class="col-span-1">
                      <label class="checkout-label">Postal Code</label>
                      <input v-model="billing.postalCode" type="text" class="checkout-input" />
                    </div>
                    <div class="col-span-1">
                      <label class="checkout-label">Country (ISO)</label>
                      <input v-model="billing.country" type="text" placeholder="ET" class="checkout-input text-center" />
                    </div>
                  </div>
                </div>
              </section>

              <button :disabled="loading" type="submit" 
                      class="w-full bg-[#ef7d00] hover:bg-[#d67000] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-50">
                <span v-if="!loading">Authorize Transaction</span>
                <span v-else class="flex items-center justify-center">
                  <svg class="animate-spin h-4 w-4 mr-3 border-2 border-white/30 border-t-white rounded-full" viewBox="0 0 24 24"></svg>
                  Processing...
                </span>
              </button>
            </form>

            <div v-if="result" class="mt-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-center animate-pulse">
              <p class="text-xs font-black uppercase tracking-widest mb-1">Transaction Success</p>
              <p class="text-sm font-bold">Reference ID: {{ result.id || 'Confirmed' }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="bg-white border-t border-slate-200 pt-12 pb-8 px-6">
      <div class="max-w-5xl mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div class="text-center md:text-left">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Licensed Banking Partner</p>
            <img src="https://www.wegagenbank.com.et/wp-content/uploads/2022/01/cropped-Wegagen-Bank-Logo-1.png" class="h-6 opacity-50 grayscale" />
          </div>
          <div class="flex items-center space-x-8">
            <div class="text-right">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Support Line</p>
              <p class="text-sm font-bold text-slate-600">8667 (Toll-Free)</p>
            </div>
            <div class="h-10 w-px bg-slate-100"></div>
            <div class="flex flex-col items-center">
               <span class="px-3 py-1 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-tighter border border-slate-200">PCI DSS Level 1</span>
            </div>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-slate-50 text-center">
          <p class="text-[10px] text-slate-400 font-medium tracking-wide">
            © 2026 Wegagen Bank S.C. | Secure Digital Merchant Service. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
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
        amount: "4,000.00",
        currency: "ETB",
        reference_number: "WGN-TXN-" + Date.now().toString().slice(-6),
      },
      card: {
        number: "",
        expMonth: "",
        expYear: "",
        cvv: "",
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
        country: "ET",
      },
    };
  },
  methods: {
    async submitPayment() {
      this.loading = true;
      this.result = null;
      
      const payload = {
        clientReferenceInformation: { code: this.order.reference_number },
        paymentInformation: {
          card: {
            number: this.card.number.replace(/\s/g, ''),
            expirationMonth: this.card.expMonth,
            expirationYear: this.card.expYear,
            cvv: this.card.cvv
          },
        },
        orderInformation: {
          amountDetails: {
            totalAmount: this.order.amount.replace(',', ''),
            currency: this.order.currency,
          },
          billTo: { ...this.billing },
        },
      };

      try {
        const response = await axios.post("http://localhost:5000/api/checkout", payload);
        this.result = response.data;
      } catch (error) {
        console.error("Payment Gateway Error:", error);
        alert("Transaction Declined: Please verify card details and try again.");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.checkout-label {
  @apply block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1;
}
.checkout-input {
  @apply w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-700 outline-none transition-all focus:ring-2 focus:ring-[#003366] focus:bg-white focus:border-transparent placeholder:text-slate-300;
}
</style>
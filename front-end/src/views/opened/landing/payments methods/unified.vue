<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      
      <div class="bg-[#003366] p-6 text-center">
        <img src="https://www.wegagenbank.com.et/wp-content/uploads/2022/01/cropped-Wegagen-Bank-Logo-1.png" 
             alt="Wegagen Logo" class="h-12 mx-auto mb-2 brightness-0 invert" />
        <h2 class="text-white text-lg font-semibold tracking-tight">Secure Payment Portal</h2>
        <p class="text-blue-200 text-xs uppercase tracking-widest mt-1">PCI-DSS Compliant Environment</p>
      </div>

      <div v-if="loading" class="p-12 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ef7d00] mx-auto mb-4"></div>
        <p class="text-slate-500 font-medium">Establishing secure connection...</p>
      </div>

      <form v-show="!loading" @submit.prevent="handlePayment" id="payment-form" class="p-8 space-y-6">
        
        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Cardholder Name</label>
          <input type="text" v-model="cardholderName" placeholder="Full Name on Card" required
                 class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400" />
        </div>

        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Card Number</label>
          <div id="number-container" 
               class="h-[46px] w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all flex items-center">
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Expiry (MM)</label>
            <input type="text" v-model="expiryMonth" placeholder="MM" maxlength="2" required
                   class="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center" />
          </div>
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Year (YYYY)</label>
            <input type="text" v-model="expiryYear" placeholder="YYYY" maxlength="4" required
                   class="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center" />
          </div>
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">CVV</label>
            <div id="securityCode-container" 
                 class="h-[46px] w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 flex items-center">
            </div>
          </div>
        </div>

        <button type="submit" :disabled="processing" 
                class="w-full py-4 bg-[#ef7d00] hover:bg-[#d67000] text-white font-bold rounded-xl shadow-lg shadow-orange-200 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:grayscale">
          <div v-if="processing" class="flex items-center justify-center space-x-2">
            <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Processing...</span>
          </div>
          <span v-else>Pay USD 102.21</span>
        </button>

        <div class="flex items-center justify-center space-x-4 opacity-50 grayscale hover:grayscale-0 transition-all">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" class="h-4" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" class="h-4" />
        </div>
      </form>

      <transition enter-active-class="transition duration-300 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100">
        <div v-if="paymentStatus" class="p-6 border-t">
          <div :class="[
            'p-4 rounded-lg flex items-start space-x-3',
            paymentStatus.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
          ]">
            <div class="flex-1">
              <p class="font-bold text-sm">{{ paymentStatus.title }}</p>
              <p class="text-xs mt-1">{{ paymentStatus.message }}</p>
              <p v-if="paymentStatus.id" class="text-[10px] mt-2 font-mono bg-white/50 inline-block px-1">Ref: {{ paymentStatus.id }}</p>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

// All your original logic remains exactly here...
const loading = ref(true);
const processing = ref(false);
const cardholderName = ref('');
const expiryMonth = ref('');
const expiryYear = ref('');
const paymentStatus = ref(null);

let microformInstance = null;

onMounted(async () => {
  try {
    const response = await fetch('http://192.168.2.14:3000/generate-capture-context', { method: 'POST' });
    const jwt = await response.text();

    const payload = JSON.parse(atob(jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    const context = payload.ctx[0].data;

    const script = document.createElement('script');
    script.src = context.clientLibrary;
    script.integrity = context.clientLibraryIntegrity;
    script.crossOrigin = "anonymous";

    script.onload = () => {
      const flex = new window.Flex(jwt);
      microformInstance = flex.microform({
        styles: { 
          input: { 'font-size': '16px', 'font-family': 'Arial', 'color': '#334155' },
          ':focus': { 'color': '#003366' },
          '::placeholder': { 'color': '#94a3b8' }
        }
      });

      const cardNumberField = microformInstance.createField('number', { placeholder: '0000 0000 0000 0000' });
      const securityCodeField = microformInstance.createField('securityCode', { placeholder: 'CVV' });

      cardNumberField.load('#number-container');
      securityCodeField.load('#securityCode-container');
      loading.value = false;
    };
    document.head.appendChild(script);
  } catch (err) {
    console.error("Initialization Error:", err);
    paymentStatus.value = { type: 'error', title: 'System Error', message: 'Failed to load secure payment fields.' };
  }
});

const handlePayment = () => {
  if (!microformInstance) return;
  processing.value = true;
  paymentStatus.value = null;
  
  const options = {
    expirationMonth: expiryMonth.value,
    expirationYear: expiryYear.value
  };

  microformInstance.createToken(options, async (err, token) => {
    if (err) {
      processing.value = false;
      paymentStatus.value = { type: 'error', title: 'Validation Failed', message: err.message };
      return;
    }

    try {
      const response = await fetch('http://10.195.49.18:3000/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transientToken: token,
          amount: "102.21",
          currency: "USD"
        })
      });

      const result = await response.json();
      if (response.ok && result.status === 'AUTHORIZED') {
        paymentStatus.value = { type: 'success', title: 'Payment Successful', message: 'Your transaction has been approved.', id: result.id };
      } else {
        paymentStatus.value = { type: 'error', title: 'Payment Declined', message: result.message || 'The bank declined this transaction.' };
      }
    } catch (fetchErr) {
      paymentStatus.value = { type: 'error', title: 'Network Error', message: 'Communication with payment server failed.' };
    } finally {
      processing.value = false;
    }
  });
};
</script>

<style scoped>
/* No extra CSS needed as Tailwind handles it, 
   but we keep this for the SDK iframe alignment */
:deep(iframe) {
  width: 100% !important;
  height: 100% !important;
}
</style>
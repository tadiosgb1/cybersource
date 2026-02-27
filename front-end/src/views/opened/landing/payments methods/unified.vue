<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">
    
    <header class="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <img src="https://www.wegagenbank.com.et/wp-content/uploads/2022/01/cropped-Wegagen-Bank-Logo-1.png" 
               alt="HaileResort" class="h-10 md:h-12" />
          <div class="hidden md:block h-8 w-px bg-slate-200"></div>
          <span class="hidden md:block text-[#003366] font-semibold text-sm uppercase tracking-wider">
            Online Payment Gateway
          </span>
        </div>
        
        <div class="flex items-center space-x-2 text-slate-500 text-xs font-medium bg-slate-100 px-3 py-1.5 rounded-full">
          <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span>Secure Session Active</span>
        </div>
      </div>
    </header>

    <main class="flex-grow flex items-center justify-center p-4 py-12">
      <div class="max-w-md w-full bg-white rounded-2xl  border border-slate-200 overflow-hidden">
        
        <div class="bg-[#003366] p-6 text-center">
          <h2 class="text-white text-lg font-semibold tracking-tight">Complete Your Payment</h2>
          <p class="text-blue-200 text-xs uppercase tracking-widest mt-1">Order Ref: INV-2026-8842</p>
        </div>

        <div v-if="loading" class="p-12 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ef7d00] mx-auto mb-4"></div>
          <p class="text-slate-500 font-medium">Initializing secure field encryption...</p>
        </div>

        <form v-show="!loading" @submit.prevent="handlePayment" id="payment-form" class="p-8 space-y-6">
          
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Cardholder Name</label>
            <input type="text" v-model="cardholderName" placeholder="Full Name on Card" required
                   class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all" />
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Card Number</label>
            <div id="number-container" 
                 class="h-[46px] w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-[#003366] focus-within:bg-white transition-all flex items-center">
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Expiry (MM)</label>
              <input type="text" v-model="expiryMonth" placeholder="MM" maxlength="2" required
                     class="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#003366] outline-none text-center" />
            </div>
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Year (YYYY)</label>
              <input type="text" v-model="expiryYear" placeholder="YYYY" maxlength="4" required
                     class="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#003366] outline-none text-center" />
            </div>
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">CVV</label>
              <div id="securityCode-container" 
                   class="h-[46px] w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-[#003366] flex items-center">
              </div>
            </div>
          </div>

          <button type="submit" :disabled="processing" 
                  class="w-full py-4 bg-[#ef7d00] hover:bg-[#d67000] text-white font-bold rounded-xl shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-50">
            <div v-if="processing" class="flex items-center justify-center space-x-2">
              <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Authenticating...</span>
            </div>
            <span v-else>Authorize Payment: USD 5000.00</span>
          </button>

          <div class="flex items-center justify-center space-x-6 opacity-40 grayscale">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" class="h-4" alt="Visa" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" class="h-4" alt="Mastercard" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" class="h-4" alt="PayPal" />
          </div>
        </form>

        <transition enter-active-class="transition duration-300 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100">
          <div v-if="paymentStatus" class="p-6 border-t bg-slate-50">
            <div :class="[
              'p-4 rounded-lg flex items-start space-x-3',
              paymentStatus.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            ]">
              <div class="flex-1">
                <p class="font-bold text-sm">{{ paymentStatus.title }}</p>
                <p class="text-xs mt-1">{{ paymentStatus.message }}</p>
                <p v-if="paymentStatus.id" class="text-[10px] mt-2 font-mono bg-white/50 inline-block px-1">Receipt ID: {{ paymentStatus.id }}</p>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </main>

    <footer class="bg-white border-t border-slate-200 py-8">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div class="space-y-3">
            <h4 class="text-[#003366] font-bold text-sm">Security & Privacy</h4>
            <p class="text-slate-500 text-xs leading-relaxed">
              Haile Resort uses end-to-end encryption. Your card data is never stored on our local servers.
            </p>
          </div>
          <div class="space-y-3 text-center">
            <h4 class="text-[#003366] font-bold text-sm">Need Assistance?</h4>
            <p class="text-slate-500 text-xs">
              Call our 24/7 Contact Center:<br/>
              <span class="font-bold text-slate-700">8667 (Toll Free)</span>
            </p>
          </div>
          <div class="flex flex-col items-center md:items-end justify-center space-y-2">
            <div class="flex space-x-4">
               <span class="text-[10px] font-bold text-slate-400 border border-slate-200 px-2 py-1 rounded">PCI DSS</span>
               <span class="text-[10px] font-bold text-slate-400 border border-slate-200 px-2 py-1 rounded">SSL SECURE</span>
            </div>
            <p class="text-slate-400 text-[10px]">&copy; 2026 Haie Resort S.C. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
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
    const response = await fetch('http://localhost:5000/generate-capture-context', { method: 'POST' });
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
      const response = await fetch('http://localhost:5000/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transientToken: token,
          amount: "5000",
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
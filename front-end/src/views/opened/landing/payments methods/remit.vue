<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-6">
    <div class="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
      <h1 class="text-2xl font-bold text-slate-900 text-center mb-1">Wegagen Pay</h1>
      <p class="text-slate-500 text-sm text-center mb-8">Secure Remittance Portal</p>

      <div v-if="loading" class="text-center py-10 animate-pulse text-slate-400">
        Initializing secure tunnel...
      </div>

      <form v-show="!loading" @submit.prevent="startFlow" class="space-y-4">
        <div class="space-y-1">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Card Number</label>
          <div id="number-container" class="field h-14"></div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expiry</label>
            <div class="flex gap-2">
              <input v-model="form.mm" placeholder="MM" class="field w-full text-center" />
              <input v-model="form.yy" placeholder="YY" class="field w-full text-center" />
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CVC</label>
            <div id="cvv-container" class="field h-14"></div>
          </div>
        </div>

        <button :disabled="processing" class="w-full bg-blue-600 text-white h-14 rounded-2xl font-bold text-lg shadow-blue-200 shadow-lg active:scale-95 transition-all disabled:bg-slate-200">
          {{ processing ? 'Processing...' : 'Send 100.00 ETB' }}
        </button>
      </form>

      <div v-if="feedback" :class="isError ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'" class="mt-6 p-4 rounded-2xl text-center text-sm font-semibold">
        {{ feedback }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';

const API = 'http://localhost:5000';
const loading = ref(true);
const processing = ref(false);
const feedback = ref('');
const isError = ref(false);
const form = reactive({ mm: '', yy: '' });

let microform = null;

onMounted(async () => {
  try {
    const res = await fetch(`${API}/generate-capture-context`, { method: 'POST' });
    const jwt = await res.json();
    
    // Some responses wrap the JWT in an object { keyId: "..." }
    const token = typeof jwt === 'string' ? jwt : jwt.keyId;
    
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    
    const script = document.createElement('script');
    script.src = payload.ctx[0].data.clientLibrary;
    script.onload = () => {
      const flex = new window.Flex(token);
      microform = flex.microform();
      microform.createField('number').load('#number-container');
      microform.createField('securityCode').load('#cvv-container');
      loading.value = false;
    };
    document.head.appendChild(script);
  } catch (e) {
    isError.value = true;
    feedback.value = "Failed to load secure fields.";
  }
});

const startFlow = async () => {
  processing.value = true;
  feedback.value = "Tokenizing card...";
  
  microform.createToken({ expirationMonth: form.mm, expirationYear: form.yy }, async (err, token) => {
    if (err) {
      isError.value = true;
      feedback.value = "Card validation failed.";
      processing.value = false;
      return;
    }

    try {
      // 1. Setup 3DS
      feedback.value = "Authorizing 3DS...";
      const sRes = await fetch(`${API}/setup-3ds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const sData = await sRes.json();

      // 2. Validate
      feedback.value = "Verifying Identity...";
      const vRes = await fetch(`${API}/validate-3ds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authId: sData.id })
      });
      const vData = await vRes.json();

      // 3. Pay
      feedback.value = "Finalizing Payment...";
      const pRes = await fetch(`${API}/process-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientReferenceInformation: { code: "WEG_" + Date.now() },
          processingInformation: { paymentSolution: "AFT" },
          paymentInformation: { tokenizedCard: { transientToken: token } },
          orderInformation: { amountDetails: { totalAmount: "100.00", currency: "ETB" } },
          consumerAuthenticationInformation: {
            cavv: vData.consumerAuthenticationInformation?.cavv,
            eciRaw: vData.consumerAuthenticationInformation?.eciRaw
          }
        })
      });

      const final = await pRes.json();
      if (final.status === 'AUTHORIZED') {
        isError.value = false;
        feedback.value = "Success! Funds transferred.";
      } else {
        isError.value = true;
        feedback.value = "Transaction Declined.";
      }
    } catch (e) {
      isError.value = true;
      feedback.value = "An error occurred during processing.";
    } finally {
      processing.value = false;
    }
  });
};
</script>

<style scoped>
.field { 
  border: 2px solid #f1f5f9; 
  padding: 0 1rem; 
  border-radius: 1rem; 
  width: 100%; 
  background: #f8fafc;
  display: flex;
  align-items: center;
  transition: all 0.3s;
}
.field:focus-within {
  border-color: #3b82f6;
  background: white;
}
input { outline: none; background: transparent; height: 100%; width: 100%; }
</style>
<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
      
      <div class="bg-[#003366] p-6 text-center">
        <img src="https://www.wegagenbank.com.et/wp-content/uploads/2022/01/cropped-Wegagen-Bank-Logo-1.png" class="h-10 mx-auto mb-2 brightness-0 invert" />
        <h2 class="text-white text-lg font-bold uppercase tracking-tight">Secure Remittance</h2>
      </div>

      <div class="p-8 space-y-6">
        <div class="space-y-1.5">
          <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Recipient Name</label>
          <input v-model="recipientName" type="text" placeholder="Full Name in Ethiopia" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#ef7d00]" />
        </div>

        <div class="space-y-4">
          <div class="space-y-1.5">
            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Sender Card Number</label>
            <div id="number-container" class="secure-input"></div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div class="space-y-1.5">
              <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Month</label>
              <div id="month-container" class="secure-input"></div>
            </div>
            <div class="space-y-1.5">
              <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Year</label>
              <div id="year-container" class="secure-input"></div>
            </div>
            <div class="space-y-1.5">
              <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest">CVV</label>
              <div id="securityCode-container" class="secure-input"></div>
            </div>
          </div>
        </div>

        <button @click="handleRemittance" :disabled="loading || processing" class="w-full py-4 bg-[#ef7d00] hover:bg-[#003366] text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50">
          <span v-if="processing">Securing Data...</span>
          <span v-else>Authorize Transfer</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const loading = ref(true);
const processing = ref(false);
const recipientName = ref('');
let microformInstance = null;

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:5000/generate-capture-context', { method: 'POST' });
    const jwt = await response.text();
    const payload = JSON.parse(atob(jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));

    const script = document.createElement('script');
    script.src = payload.ctx[0].data.clientLibrary;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      const flex = new (window.FLEX || window.Flex)(jwt);
      
      // Providing explicit styles ensures the iFrame renders visible text
      microformInstance = flex.microform({
        styles: {
          input: { 'font-size': '16px', 'color': '#334155', 'font-family': 'sans-serif' },
          '::placeholder': { 'color': '#94a3b8' }
        }
      });

      // Loading all 4 fields with placeholders
      microformInstance.createField('number', { placeholder: '0000 0000 0000 0000' }).load('#number-container');
      microformInstance.createField('securityCode', { placeholder: 'CVV' }).load('#securityCode-container');
      microformInstance.createField('expirationMonth', { placeholder: 'MM' }).load('#month-container');
      microformInstance.createField('expirationYear', { placeholder: 'YYYY' }).load('#year-container');
      
      loading.value = false;
    };
    document.head.appendChild(script);
  } catch (err) { console.error("Handshake Error:", err); }
});

const handleRemittance = () => {
  if (!microformInstance) return;
  processing.value = true;

  // Passing empty {} because all data is in the iFrames
  microformInstance.createToken({}, async (err, token) => {
    if (err) { alert(err.message); processing.value = false; return; }

    const res = await fetch('http://localhost:5000/process-remittance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, recipientName: recipientName.value })
    });
    const result = await res.json();
    alert(result.status === 'AUTHORIZED' ? "Success!" : "Declined");
    processing.value = false;
  });
};
</script>

<style scoped>
.secure-input {
  height: 3rem;
  width: 100%;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
}
.secure-input:focus-within {
  border-color: #003366;
  box-shadow: 0 0 0 2px rgba(0, 51, 102, 0.1);
}
:deep(iframe) {
  width: 100% !important;
  height: 100% !important;
  border: none !important;
}
</style>
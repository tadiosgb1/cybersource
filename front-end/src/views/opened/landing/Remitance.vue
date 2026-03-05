<template>
  <div class="min-h-screen bg-[#FDFDFD] flex flex-col font-sans text-slate-900">
    <nav class="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <img src="../../../assets/img/wegagen.png" alt="Wegagen Bank" class="h-10 md:h-12" />
          <div class="h-8 w-px bg-slate-200"></div>
          <div>
            <span class="block text-[#003366] font-black text-xs uppercase tracking-tighter">Unified Remittance</span>
            <span class="block text-[9px] text-[#ef7d00] font-bold uppercase tracking-[0.2em]">Global Secure Gateway</span>
          </div>
        </div>
      </div>
    </nav>

    <header v-if="step !== 3" class="bg-[#003366] py-12 px-6 overflow-hidden relative">
      <div class="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full fill-white">
          <path d="M44.7,-76.4C58.1,-69.2,69.2,-58.1,76.4,-44.7C83.5,-31.3,86.7,-15.7,85.2,-0.9C83.7,14,77.5,27.9,68.8,40.1C60.1,52.3,48.9,62.7,35.9,70.5C22.9,78.2,8,83.2,-6.4,81.4C-20.8,79.5,-34.7,70.7,-46.8,61C-58.9,51.3,-69.1,40.7,-75.4,28.1C-81.7,15.5,-84,1,-82.1,-12.7C-80.2,-26.4,-74,-39.3,-64.1,-49.6C-54.2,-59.8,-40.6,-67.4,-27.2,-74.6C-13.8,-81.8,-0.1,-88.6,13.8,-88.7C27.6,-88.7,41.2,-81.9,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>
      </div>
      <div class="max-w-7xl mx-auto relative z-10 text-center md:text-left">
        <h1 class="text-3xl md:text-5xl font-serif text-white mb-4 italic">
          Move money to your <span class="text-[#ef7d00]">friends & family</span>
        </h1>
        <p class="text-blue-100 text-lg md:text-xl max-w-2xl font-light">
          Reliable, fast, and secure cross-border transfers by <span class="font-bold border-b border-[#ef7d00]">Wegagen Bank</span>.
        </p>
      </div>
    </header>

    <main class="flex-grow max-w-6xl mx-auto px-6 py-12 w-full">
      
      <div v-if="step === 1" class="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-8">
        <div class="lg:col-span-5 bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8">
          <h3 class="text-sm font-black text-[#003366] uppercase tracking-widest mb-6 flex items-center">
            <span class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">1</span>
            Sender Information
          </h3>
          <div class="space-y-5">
            <div class="space-y-1">
              <label class="remit-label">Full Name</label>
              <input v-model="sender.name" type="text" placeholder="John Doe" class="remit-input" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="remit-label">Phone Number</label>
                <input v-model="sender.phone" type="tel" placeholder="+1..." class="remit-input" />
              </div>
              <div class="space-y-1">
                <label class="remit-label">Origin Country</label>
                <select v-model="sender.country" class="remit-input bg-white">
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="EU">Europe</option>
                  <option value="CAN">Canada</option>
                </select>
              </div>
            </div>
            <div class="space-y-1">
              <label class="remit-label">Email Address</label>
              <input v-model="sender.email" type="email" placeholder="john@example.com" class="remit-input" />
            </div>
          </div>
        </div>

        <div class="lg:col-span-7 bg-white rounded-[2rem] shadow-2xl shadow-[#003366]/5 border-t-4 border-[#ef7d00] p-8">
          <h3 class="text-sm font-black text-[#003366] uppercase tracking-widest mb-6 flex items-center">
            <span class="w-8 h-8 rounded-full bg-orange-50 text-[#ef7d00] flex items-center justify-center mr-3">2</span>
            Transfer Details
          </h3>
          <div class="space-y-6">
            <div class="space-y-1">
              <label class="remit-label">Wegagen Recipient Account</label>
              <input v-model="accountNumber" type="text" placeholder="0000 0000 0000" class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xl font-bold text-slate-700 focus:border-[#003366] outline-none transition-all" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-1">
                <label class="remit-label">Send Amount</label>
                <div class="relative">
                  <input v-model.number="sendAmount" type="number" class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xl font-bold text-[#003366] outline-none" />
                  <div class="absolute right-4 top-1/2 -translate-y-1/2 font-black text-xs text-slate-400">{{ selectedCurrency }}</div>
                </div>
              </div>
              <div class="bg-[#ef7d00]/5 rounded-2xl p-5 border border-[#ef7d00]/10">
                <p class="text-[9px] font-black text-[#ef7d00] uppercase tracking-widest mb-1">Local Payout (ETB)</p>
                <div class="flex items-baseline space-x-1">
                  <span class="text-2xl font-black text-[#003366]">{{ convertedAmount.toLocaleString() }}</span>
                  <span class="text-[10px] font-bold text-[#003366]">ETB</span>
                </div>
              </div>
            </div>
            <button @click="verifySampleAccount" :disabled="isValidating || !accountNumber || !sender.email" class="w-full bg-[#003366] hover:bg-[#002244] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all">
              <span v-if="!isValidating">Confirm & Secure Payment</span>
              <span v-else>Identifying Recipient...</span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="step === 2" class="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in zoom-in-95">
        <div class="lg:col-span-4">
          <div class="bg-[#003366] text-white p-8 rounded-[2.5rem] shadow-2xl">
            <p class="text-[10px] font-bold uppercase text-blue-300 mb-8 tracking-widest">Final Summary</p>
            <div class="space-y-6">
              <div>
                <p class="text-[9px] opacity-50 uppercase font-bold">Payout To</p>
                <p class="text-lg font-serif italic">{{ recipientName }}</p>
                <p class="text-xs font-mono opacity-60">{{ accountNumber }}</p>
              </div>
              <div class="pt-6 border-t border-white/10 space-y-3">
                <div class="flex justify-between items-center text-xs">
                  <span class="opacity-60">Total to Deduct</span>
                  <span class="text-lg font-bold">{{ sendAmount }} {{ selectedCurrency }}</span>
                </div>
                <div class="flex justify-between items-center text-xs text-[#ef7d00]">
                  <span class="font-bold">Total to Credit</span>
                  <span class="font-black">{{ convertedAmount.toLocaleString() }} ETB</span>
                </div>
              </div>
            </div>
            <button @click="step = 1" class="mt-12 w-full py-3 border border-white/20 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition">Edit Details</button>
          </div>
        </div>

        <div class="lg:col-span-8 bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 border border-slate-100">
          <div class="flex items-center justify-between mb-10">
            <h3 class="font-black text-[#003366] text-sm uppercase tracking-widest">Authorized Payment Card</h3>
            <div class="flex items-center space-x-4 opacity-40">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" class="h-3" :class="{'opacity-100 grayscale-0 scale-110': cardBrand === 'visa'}" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" class="h-6" :class="{'opacity-100 grayscale-0 scale-110': cardBrand === 'mastercard'}" />
            </div>
          </div>
          
          <form @submit.prevent="processPayment" class="space-y-6">
            <div class="space-y-2">
              <label class="remit-label">Cardholder Name</label>
              <input v-model="cardholderName" type="text" class="remit-input" required />
            </div>
            <div class="space-y-2">
              <label class="remit-label">Secure Card Number</label>
              <div id="number-container" class="microform-field"></div>
            </div>
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="remit-label">Expiry Date</label>
                <div class="flex space-x-2">
                  <input v-model="expiryMonth" placeholder="MM" maxlength="2" class="remit-input text-center" />
                  <input v-model="expiryYear" placeholder="YYYY" maxlength="4" class="remit-input text-center" />
                </div>
              </div>
              <div class="space-y-2">
                <label class="remit-label">CVV/CVC</label>
                <div id="securityCode-container" class="microform-field"></div>
              </div>
            </div>
            <button :disabled="processing" type="submit" class="w-full bg-[#ef7d00] hover:bg-[#d67000] text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl mt-6 transition-all">
              <span v-if="!processing">Authorize Secure Transfer</span>
              <span v-else>Processing...</span>
            </button>
          </form>
          
          <div v-if="status" :class="status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'" class="mt-8 p-6 rounded-2xl text-xs font-bold border">
            {{ status.message }}
          </div>
        </div>
      </div>

      <div v-if="step === 3" class="max-w-2xl mx-auto animate-in fade-in zoom-in-95">
        <div id="receipt-content" class="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          <div class="bg-[#003366] p-8 text-center text-white">
            <div class="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 class="text-2xl font-serif italic">Transfer Successful</h2>
            <p class="text-blue-200 text-xs font-bold uppercase tracking-widest mt-2">Transaction ID: {{ transactionId }}</p>
          </div>
          
          <div class="p-8 space-y-6">
            <div class="flex justify-between items-center border-b border-slate-50 pb-4">
              <img src="../../../assets/img/wegagen.png" alt="Wegagen Bank" class="h-8" />
              <div class="text-right">
                <p class="text-[10px] font-black text-slate-400 uppercase">Date</p>
                <p class="text-sm font-bold">{{ new Date().toLocaleDateString() }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-8">
              <div>
                <p class="remit-label">Sender Name</p>
                <p class="font-bold text-slate-800">{{ sender.name }}</p>
                <p class="text-xs text-slate-500">{{ sender.country }}</p>
              </div>
              <div>
                <p class="remit-label">Receiver Name</p>
                <p class="font-bold text-slate-800">{{ recipientName }}</p>
                <p class="text-xs text-slate-500">Acc: {{ accountNumber }}</p>
              </div>
            </div>

            <div class="bg-slate-50 rounded-2xl p-6 space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-xs font-bold text-slate-500">Amount Sent</span>
                <span class="font-black text-[#003366]">{{ sendAmount }} {{ selectedCurrency }}</span>
              </div>
              <div class="flex justify-between items-center border-t border-slate-200 pt-4">
                <span class="text-xs font-black text-[#ef7d00] uppercase">To Be Received</span>
                <span class="text-xl font-black text-[#003366]">{{ Number(convertedAmount).toLocaleString() }} ETB</span>
              </div>
            </div>

            <div class="text-center space-y-4 pt-4">
              <p class="text-[10px] text-slate-400 italic">Funds are typically available within minutes. Thank you for choosing Wegagen Bank.</p>
              <div class="flex gap-4">
                <button @click="printReceipt" class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition">
                  Download Receipt
                </button>
                <button @click="resetForm" class="flex-1 bg-[#003366] text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition">
                  New Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      step: 1,
      isValidating: false,
      loadingFields: false,
      processing: false,
      transactionId: '',
      
      sender: {
        name: '',
        phone: '',
        email: '',
        country: 'USA'
      },

      accountNumber: '',
      recipientName: '',
      sendAmount: 500,
      selectedCurrency: 'USD',
      exchangeRates: { 'USD': 125.40, 'EUR': 136.15, 'GBP': 158.90 },

      cardholderName: '',
      expiryMonth: '',
      expiryYear: '',
      cardBrand: 'unknown',
      
      status: null,
      microformInstance: null
    };
  },

  computed: {
    convertedAmount() {
      const rate = this.exchangeRates[this.selectedCurrency] || 1;
      return (this.sendAmount * rate).toFixed(2);
    }
  },

  methods: {
    verifySampleAccount() {
      this.isValidating = true;
      setTimeout(() => {
        if (this.accountNumber.length >= 8) {
          this.recipientName = "Amanuel Tadesse Gebremariam"; 
          this.step = 2;
          this.initUnifiedGateway();
        } else {
          alert("Please enter a valid Wegagen account number.");
        }
        this.isValidating = false;
      }, 1500);
    },

    async initUnifiedGateway() {
      this.loadingFields = true;
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL_LOCAL}/generate-capture-context`, {
          method: 'POST'
        });
        const jwt = await response.text();
        const payload = JSON.parse(atob(jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        const context = payload.ctx[0].data;

        const script = document.createElement('script');
        script.src = context.clientLibrary;
        script.integrity = context.clientLibraryIntegrity;
        script.crossOrigin = "anonymous";

        script.onload = () => {
          const flex = new window.Flex(jwt);
          this.microformInstance = flex.microform({
            styles: {
              input: { 'font-size': '16px', 'font-family': 'Inter, sans-serif', 'color': '#1e293b' }
            }
          });

          const numberField = this.microformInstance.createField('number', { placeholder: '•••• •••• •••• ••••' });
          const cvField = this.microformInstance.createField('securityCode', { placeholder: '•••' });

          numberField.load('#number-container');
          cvField.load('#securityCode-container');

          numberField.on('change', (data) => {
            if (data.card && data.card.length > 0) this.cardBrand = data.card[0].name;
            else this.cardBrand = 'unknown';
          });

          this.loadingFields = false;
        };
        document.head.appendChild(script);
      } catch (err) {
        this.status = { type: 'error', message: 'Gateway Connection Failed.' };
        this.loadingFields = false;
      }
    },

    processPayment() {
      if (!this.microformInstance) return;
      this.processing = true;
      this.status = null;

      this.microformInstance.createToken({
        expirationMonth: this.expiryMonth,
        expirationYear: this.expiryYear
      }, async (err, token) => {
        if (err) {
          this.processing = false;
          this.status = { type: 'error', message: 'Card validation failed.' };
          return;
        }

        try {
          const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL_LOCAL}/process-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              transientToken: token,
              amount: this.sendAmount,
              currency: this.selectedCurrency,
              sender: this.sender,
              receiver: this.accountNumber
            })
          });

          if (res.ok) {
            // Generate a random Transaction ID for the receipt
            this.transactionId = 'WGN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
            this.step = 3; // Switch to Receipt Step
          } else { throw new Error(); }
        } catch (e) {
          this.status = { type: 'error', message: 'Authorization Declined by Bank.' };
        } finally {
          this.processing = false;
        }
      });
    },

    printReceipt() {
      window.print();
    },

    resetForm() {
      window.location.reload();
    }
  }
};
</script>

<style scoped>
/* Previous styles remain */
.remit-input {
  @apply w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#003366] transition-all;
}
.microform-field {
  @apply h-[56px] bg-slate-50 border border-slate-200 rounded-xl px-4 flex items-center transition-all focus-within:ring-2 focus-within:ring-[#003366];
}
.remit-label {
  @apply text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1;
}
:deep(iframe) { width: 100% !important; height: 100% !important; }

/* Print styles to only print the receipt card */
@media print {
  nav, header, button, .no-print {
    display: none !important;
  }
  body, main {
    background: white !important;
    padding: 0 !important;
  }
  #receipt-content {
    box-shadow: none !important;
    border: 1px solid #eee !important;
    margin: 0 auto !important;
  }
}
</style>
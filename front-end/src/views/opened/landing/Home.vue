<template>
  <div class="min-h-screen flex flex-col font-sans bg-slate-50">
    <header class="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <img src="../../../assets/img/wegagen.png" alt="Wegagen Bank" class="h-10 md:h-12" />
          <div class="hidden md:block h-8 w-px bg-slate-200"></div>
          <span class="hidden md:block text-[#003366] font-bold text-sm uppercase tracking-widest">Secure Gateway</span>
        </div>
        <div class="flex items-center space-x-2 text-slate-500 text-xs font-bold bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
          <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span>ENCRYPTED SESSION</span>
        </div>
      </div>
    </header>

    <section v-if="!selectedNGO" class="bg-[#003366] text-white py-20 px-6 text-center">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl md:text-6xl font-black mb-6 leading-tight">Empower Ethiopia's Future</h1>
        <p class="text-blue-100 text-xl opacity-90 leading-relaxed">
          Support verified non-profit organizations through Wegagen Bank's end-to-end encrypted donation portal. 
          Your contribution directly impacts lives across the nation.
        </p>
      </div>
    </section>

   <main class="max-w-7xl mx-auto px-6 py-12 flex-grow">
  <div v-if="!selectedNGO" class="grid grid-cols-1 md:grid-cols-3 gap-10">
    <div v-for="ngo in merchants" :key="ngo.id" 
      class="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
      
      <div class="h-56 bg-slate-50 flex items-center justify-center p-8">
        <img :src="resolveLogoUrl(ngo.logo)" class="max-h-full object-contain" />
      </div>

      <div class="p-8 flex-grow flex flex-col">
        <h3 class="text-2xl font-black text-[#003366] mb-3">{{ ngo.companyName }}</h3>
        
        <div class="text-slate-500 text-sm leading-relaxed mb-8">
          <p>
            {{ ngo.showFull ? ngo.description : (ngo.description?.substring(0, 200) + '...') }}
            <button 
              v-if="ngo.description?.length > 50"
              @click="ngo.showFull = !ngo.showFull" 
              class="text-[#ef7d00] font-bold ml-1 hover:underline focus:outline-none"
            >
              {{ ngo.showFull ? 'See Less' : 'See More' }}
            </button>
          </p>
        </div>

        <div class="mt-auto">
          <button @click="selectOrganization(ngo)" 
            class="w-full bg-[#ef7d00] text-white py-4 rounded-2xl font-bold hover:bg-[#d67000] transition-colors shadow-lg shadow-orange-200">
            Donate Now
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="max-w-2xl mx-auto">
    <button v-if="currentStep < 4" @click="goBack" 
      class="mb-6 text-slate-400 font-bold text-sm flex items-center gap-2 hover:text-slate-600 transition-colors">
      <span>←</span> Back to Organizations
    </button>
    
    <div class="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
      <div class="bg-[#003366] p-8 text-white flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold">{{ selectedNGO.companyName }}</h2>
          <p class="text-blue-200 text-[10px] uppercase tracking-widest mt-1">Step {{ currentStep }} of 3</p>
        </div>
        <div class="bg-white/10 px-4 py-2 rounded-xl text-xs font-mono">
          SECURE_SESSION: {{ captureJwt ? 'ACTIVE' : 'INITIALIZING' }}
        </div>
      </div>

      <div class="p-10">
        <div v-if="currentStep === 1" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-slate-400 ml-1 uppercase">First Name</label>
              <input type="text" v-model="sender.firstName" class="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-slate-400 ml-1 uppercase">Last Name</label>
              <input type="text" v-model="sender.lastName" class="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-400 ml-1 uppercase">Email Address</label>
            <input type="email" v-model="sender.email" class="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-400 ml-1 uppercase">Street / District</label>
            <input type="text" v-model="sender.address1" class="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <input type="text" v-model="sender.locality" placeholder="City" class="p-4 bg-slate-50 border rounded-xl outline-none" />
            <input type="text" v-model="sender.postalCode" placeholder="Postal Code" class="p-4 bg-slate-50 border rounded-xl outline-none" />
          </div>
          <button @click="currentStep = 2" :disabled="!sender.email" class="w-full py-5 bg-[#003366] text-white font-bold rounded-2xl shadow-lg hover:bg-opacity-95 transition-all">
            Continue to Payment
          </button>
        </div>

        <div v-show="currentStep === 2" class="space-y-8">
          <div class="space-y-4">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest">Donation Amount (USD)</h3>
            <div class="grid grid-cols-3 gap-3">
              <button v-for="amt in [25, 100, 500]" :key="amt" @click="donationAmountUSD = amt" 
                :class="donationAmountUSD == amt ? 'bg-[#ef7d00] text-white border-[#ef7d00]' : 'bg-white text-slate-400 border-slate-200'" 
                class="py-4 rounded-xl font-bold border-2 transition-all">
                ${{ amt }}
              </button>
            </div>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-300 text-lg">$</span>
              <input type="number" v-model="donationAmountUSD" placeholder="Other Amount" 
                class="w-full p-5 pl-10 bg-slate-50 border-2 border-dashed rounded-2xl outline-none focus:border-[#ef7d00] transition-colors" />
            </div>
            <div class="p-5 bg-blue-50 rounded-2xl flex justify-between items-center border border-blue-100">
               <span class="text-xs font-black text-[#003366] uppercase">Wegagen Conversion (ETB):</span>
               <span class="font-black text-2xl text-[#003366]">{{ formattedETB }} ETB</span>
            </div>
          </div>

          <div class="space-y-4 pt-4 border-t border-slate-100">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Card Network</h3>
            <div class="grid grid-cols-2 gap-4">
              <label :class="cardType === 'visa' ? 'border-[#003366] bg-blue-50 ring-2 ring-[#003366]/10' : 'border-slate-200 bg-white'" 
                class="relative flex items-center justify-center p-5 border-2 rounded-2xl cursor-pointer transition-all">
                <input type="radio" v-model="cardType" value="visa" class="hidden" />
                <img src="https://logos-world.net/wp-content/uploads/2020/04/Visa-Logo.png" class="h-4 object-contain" />
                <div v-if="cardType === 'visa'" class="absolute top-2 right-2 bg-[#003366] rounded-full p-0.5">
                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </label>

              <label :class="cardType === 'mastercard' ? 'border-[#003366] bg-blue-50 ring-2 ring-[#003366]/10' : 'border-slate-200 bg-white'" 
                class="relative flex items-center justify-center p-5 border-2 rounded-2xl cursor-pointer transition-all">
                <input type="radio" v-model="cardType" value="mastercard" class="hidden" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" class="h-8 object-contain" />
                <div v-if="cardType === 'mastercard'" class="absolute top-2 right-2 bg-[#003366] rounded-full p-0.5">
                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </label>
            </div>

            <div class="space-y-4 mt-6">
              <div class="space-y-1">
                <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Card Number</label>
                <div id="number-container" class="h-[60px] w-full px-4 bg-white border-2 border-slate-100 rounded-xl flex items-center shadow-sm focus-within:border-[#003366]"></div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Expiry (MM/YYYY)</label>
                  <div class="flex gap-2">
                    <input type="text" v-model="expiryMonth" placeholder="MM" maxlength="2" class="w-1/2 p-4 bg-white border-2 border-slate-100 rounded-xl text-center focus:border-[#003366] outline-none" />
                    <input type="text" v-model="expiryYear" placeholder="YYYY" maxlength="4" class="w-1/2 p-4 bg-white border-2 border-slate-100 rounded-xl text-center focus:border-[#003366] outline-none" />
                  </div>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">CVV / CVC</label>
                  <div id="securityCode-container" class="h-[60px] w-full px-4 bg-white border-2 border-slate-100 rounded-xl shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>

          <button @click="currentStep = 3" :disabled="flexLoading" class="w-full py-5 bg-[#003366] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all">
            Review Transaction
          </button>
        </div>

        <div v-if="currentStep === 3" class="space-y-6">
           <div class="bg-slate-50 p-8 rounded-3xl border-2 border-dashed border-slate-200 space-y-4">
              <div class="flex justify-between text-sm"><span class="text-slate-500">Recipient:</span><strong class="text-[#003366]">{{ selectedNGO.companyName }}</strong></div>
              <div class="flex justify-between text-sm"><span class="text-slate-500">Donor Name:</span><strong>{{ sender.firstName }} {{ sender.lastName }}</strong></div>
              <div class="flex justify-between text-sm"><span class="text-slate-500">Method:</span><strong class="uppercase text-[#003366]">{{ cardType }}</strong></div>
              <div class="pt-4 border-t flex justify-between items-center text-[#ef7d00]">
                <span class="font-black text-lg">TOTAL TO CHARGE:</span>
                <span class="text-3xl font-black">{{ formattedETB }} ETB</span>
              </div>
           </div>
           <button @click="handlePayment" :disabled="processing" class="w-full py-6 bg-[#ef7d00] text-white font-black text-xl rounded-2xl shadow-xl transition-all active:scale-95">
            <span v-if="!processing">Confirm & Authorize</span>
            <span v-else class="flex items-center justify-center gap-3">
              <svg class="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full" viewBox="0 0 24 24"></svg>
              Finalizing Transaction...
            </span>
           </button>
        </div>

        <div v-if="currentStep === 4" class="py-4">
          <div id="receipt-area" class="bg-white border-2 border-slate-100 p-10 rounded-3xl shadow-sm text-center relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-2 bg-[#003366]"></div>
            <img src="../../../assets/img/wegagen.png" class="h-10 mx-auto mb-6" />
            <h2 class="text-xl font-black text-[#003366] uppercase tracking-tighter">Official Donation Receipt</h2>
            
            <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto my-6 text-2xl font-bold shadow-inner">✓</div>
            
            <div class="space-y-4 text-left mt-8 border-t border-b border-slate-50 py-8">
              <div class="flex justify-between text-xs tracking-widest"><span class="text-slate-400">TXN REFERENCE:</span><span class="font-mono font-bold">{{ receiptData?.id || 'WG-889-1102' }}</span></div>
              <div class="flex justify-between text-xs tracking-widest"><span class="text-slate-400">TIMESTAMP:</span><span class="font-bold">{{ new Date().toLocaleString() }}</span></div>
              <div class="flex justify-between text-xs tracking-widest"><span class="text-slate-400">BENEFICIARY:</span><span class="font-bold">{{ selectedNGO.companyName }}</span></div>
              <div class="flex justify-between text-xs tracking-widest"><span class="text-slate-400">DONOR:</span><span class="font-bold">{{ sender.firstName }} {{ sender.lastName }}</span></div>
              <div class="flex justify-between text-lg pt-4 text-[#003366] font-black border-t mt-4">
                <span>TOTAL AMOUNT:</span>
                <span>{{ formattedETB }} ETB</span>
              </div>
            </div>
            <p class="text-[10px] text-slate-400 mt-6 italic">Secure payment processed through Wegagen Bank Gateway.</p>
          </div>

          <div class="grid grid-cols-2 gap-4 mt-8 no-print">
            <button @click="downloadReceipt" class="flex items-center justify-center gap-2 p-4 bg-[#003366] text-white rounded-xl font-bold hover:bg-[#002244] transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Save PDF
            </button>
            <button @click="shareReceipt" class="flex items-center justify-center gap-2 p-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
              Share
            </button>
          </div>
          <button @click="resetFlow" class="w-full mt-8 text-slate-400 font-bold text-sm hover:underline no-print">Return to Home</button>
        </div>

        <div v-if="paymentStatus" class="mt-6 p-4 bg-rose-50 text-rose-800 rounded-2xl text-xs border border-rose-100 flex gap-3 items-center">
          <div class="bg-rose-100 p-2 rounded-full">⚠️</div>
          <div><span class="font-black uppercase">Transaction Error:</span> {{ paymentStatus.message }}</div>
        </div>
      </div>
    </div>
  </div>
</main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onMounted } from 'vue';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL_LOCAL;
const BASE_URL_SOURCE = import.meta.env.VITE_APP_BASE_URL_LOCAL_SOURCE;

const merchants = ref([]);
const selectedNGO = ref(null);
const currentStep = ref(1);
const processing = ref(false);
const flexLoading = ref(false);
const paymentStatus = ref(null);
const donationAmountUSD = ref(25);
const exchangeRate = 120.50;
const cardType = ref('visa');

const sender = reactive({
  firstName: '', lastName: '', email: '',
  address1: '', locality: '', postalCode: '',
  administrativeArea: 'AA', country: 'ET'
});

const expiryMonth = ref('');
const expiryYear = ref('');
const receiptData = ref(null);

let microformInstance = null;
let captureJwt = null;

const formattedETB = computed(() => (donationAmountUSD.value * exchangeRate).toFixed(2));

const fetchMerchants = async () => {
  const res = await fetch(`${BASE_URL}/merchants`);
  merchants.value = await res.json();
};

const resolveLogoUrl = (path) => path?.startsWith('http') ? path : `${BASE_URL_SOURCE}${path}`;

const selectOrganization = async (ngo) => {
  selectedNGO.value = ngo;
  currentStep.value = 1;
  paymentStatus.value = null;
  try {
    const res = await fetch(`${BASE_URL}/generate-capture-context`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ merchantId: ngo.id })
    });
    captureJwt = await res.text();
  } catch (e) {
    paymentStatus.value = { message: "Encryption context failed." };
  }
};

watch(currentStep, (newStep) => {
  if (newStep === 2 && !microformInstance) {
    flexLoading.value = true;
    nextTick(() => initFlex());
  }
});

const initFlex = () => {
  if (!captureJwt) return;
  const payload = JSON.parse(atob(captureJwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
  const script = document.createElement('script');
  script.src = payload.ctx[0].data.clientLibrary;
  script.onload = () => {
    const flex = new window.Flex(captureJwt);
    microformInstance = flex.microform({ styles: { input: { 'font-size': '16px' } } });
    microformInstance.createField('number').load('#number-container');
    microformInstance.createField('securityCode').load('#securityCode-container');
    flexLoading.value = false;
  };
  document.head.appendChild(script);
};

const handlePayment = () => {
  if (!microformInstance) return;
  processing.value = true;
  paymentStatus.value = null;

  const options = {
    expirationMonth: expiryMonth.value.padStart(2, '0'),
    expirationYear: expiryYear.value.length === 2 ? `20${expiryYear.value}` : expiryYear.value
  };

  microformInstance.createToken(options, async (err, token) => {
    if (err) {
      paymentStatus.value = { message: err.message };
      processing.value = false;
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/process-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantId: selectedNGO.value.id,
          transientToken: token,
          amount: formattedETB.value,
          currency: "ETB",
          ...sender
        })
      });

      if (response.ok) {
        receiptData.value = await response.json();
        currentStep.value = 4;
      } else {
        const error = await response.json();
        paymentStatus.value = { message: error.error || "Decline" };
      }
    } catch (e) {
      paymentStatus.value = { message: "Network error" };
    } finally {
      processing.value = false;
    }
  });
};

const downloadReceipt = () => window.print();

const shareReceipt = async () => {
  if (navigator.share) {
    await navigator.share({
      title: 'Donation Receipt',
      text: `Receipt from Wegagen Bank for ${selectedNGO.value.companyName}`,
      url: window.location.href
    });
  }
};

const goBack = () => currentStep.value === 1 ? selectedNGO.value = null : currentStep.value--;
const resetFlow = () => window.location.reload();

onMounted(fetchMerchants);
</script>

<style scoped>
:deep(iframe) { width: 100% !important; height: 100% !important; }

@media print {
  .no-print, header, section, button { display: none !important; }
  main { padding: 0 !important; margin: 0 !important; }
  #receipt-area { border: none !important; box-shadow: none !important; width: 100% !important; }
}
</style>
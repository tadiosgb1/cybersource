<template>
  <div class="min-h-screen flex flex-col font-sans bg-slate-50">
    <header class="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <img src="../../../assets/img/wegagen.png" alt="Wegagen Bank" class="h-10 md:h-12" />
        <div class="text-slate-500 text-xs font-bold bg-slate-100 px-4 py-2 rounded-full flex items-center gap-2">
          <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          SECURE CHECKOUT
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-10 flex-grow">
      <div v-if="!selectedNGO" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="ngo in merchants" :key="ngo.id" class="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div class="h-48 bg-slate-50 flex items-center justify-center p-6">
            <img :src="resolveLogoUrl(ngo.logo)" class="max-h-full object-contain" />
          </div>
          <div class="p-8">
            <h3 class="text-2xl font-black text-slate-800 mb-2">{{ ngo.companyName }}</h3>
            <p class="text-slate-500 text-sm mb-6 line-clamp-2">{{ ngo.description }}</p>
            <button @click="selectOrganization(ngo)" class="w-full bg-[#ef7d00] text-white py-4 rounded-2xl font-bold">Donate Now</button>
          </div>
        </div>
      </div>

      <div v-else class="max-w-xl mx-auto">
        <button v-if="currentStep < 4" @click="goBack" class="mb-4 text-slate-400 font-bold text-sm">← Back</button>
        
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          <div class="bg-[#003366] p-6 text-white text-center">
            <h2 class="text-lg font-bold">{{ selectedNGO.companyName }}</h2>
            <p class="text-blue-200 text-[10px] uppercase tracking-widest mt-1">Step {{ currentStep }} of 3</p>
          </div>

          <div class="p-8">
            <div v-if="currentStep === 1" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <input type="text" v-model="sender.firstName" placeholder="First Name" class="p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" v-model="sender.lastName" placeholder="Last Name" class="p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <input type="email" v-model="sender.email" placeholder="Email Address" class="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
              <button @click="currentStep = 2" :disabled="!sender.email" class="w-full py-4 bg-[#003366] text-white font-bold rounded-2xl">Continue to Payment</button>
            </div>

            <div v-show="currentStep === 2" class="space-y-6">
              <div class="space-y-3">
                <div class="grid grid-cols-3 gap-2">
                  <button v-for="amt in [10, 100, 1000]" :key="amt" @click="donationAmountUSD = amt" 
                    :class="donationAmountUSD === amt ? 'bg-[#ef7d00] text-white' : 'bg-slate-50 text-slate-400'" class="py-3 rounded-xl font-bold border transition-all">
                    ${{ amt }}
                  </button>
                </div>
                <div class="p-4 bg-blue-50 rounded-xl flex justify-between items-center text-[#003366]">
                   <span class="text-xs font-bold uppercase">Estimated Charge:</span>
                   <span class="font-black">{{ formattedETB }} ETB</span>
                </div>
              </div>

              <div class="space-y-4 pt-4 border-t">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-slate-500">CARD NUMBER</label>
                  <div id="number-container" class="h-[56px] w-full px-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center"></div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="flex gap-1">
                    <input type="text" v-model="expiryMonth" placeholder="MM" maxlength="2" class="w-1/2 p-4 bg-slate-50 border rounded-xl text-center" />
                    <input type="text" v-model="expiryYear" placeholder="YYYY" maxlength="4" class="w-1/2 p-4 bg-slate-50 border rounded-xl text-center" />
                  </div>
                  <div id="securityCode-container" class="h-[56px] w-full px-4 bg-slate-50 border border-slate-200 rounded-xl"></div>
                </div>
              </div>

              <div v-if="flexLoading" class="text-center text-xs text-slate-400 animate-pulse">Securing payment fields...</div>
              
              <button v-else @click="currentStep = 3" class="w-full py-4 bg-[#003366] text-white font-bold rounded-2xl">Review Donation</button>
            </div>

            <div v-if="currentStep === 3" class="space-y-6 text-center">
               <div class="bg-slate-50 p-6 rounded-2xl border text-left space-y-2">
                  <p class="text-sm">Recipient: <strong>{{ selectedNGO.companyName }}</strong></p>
                  <p class="text-sm">Donor: <strong>{{ sender.firstName }} {{ sender.lastName }}</strong></p>
                  <p class="text-xl font-black text-[#ef7d00] pt-2">Total: {{ formattedETB }} ETB</p>
               </div>
               <button @click="handlePayment" :disabled="processing" class="w-full py-5 bg-[#ef7d00] text-white font-black rounded-2xl shadow-xl transition-all">
                <span v-if="!processing">Authorize Payment Now</span>
                <span v-else class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" viewBox="0 0 24 24"></svg>
                  Processing...
                </span>
               </button>
            </div>

            <div v-if="currentStep === 4" class="text-center py-10">
              <div class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">✓</div>
              <h2 class="text-2xl font-black text-slate-800">Payment Sent!</h2>
              <p class="text-slate-500 mt-2">Transaction Ref: {{ receiptData?.id }}</p>
              <button @click="resetFlow" class="mt-8 text-[#003366] font-bold hover:underline">Donate to another organization</button>
            </div>

            <div v-if="paymentStatus" class="mt-4 p-4 bg-rose-50 text-rose-800 rounded-xl text-xs border border-rose-100">
              <strong>Error:</strong> {{ paymentStatus.message }}
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

// State
const merchants = ref([]);
const selectedNGO = ref(null);
const currentStep = ref(1);
const processing = ref(false);
const flexLoading = ref(false);
const paymentStatus = ref(null);
const donationAmountUSD = ref(10);
const exchangeRate = 120.50;

const sender = reactive({ firstName: '', lastName: '', email: '' });
const expiryMonth = ref('');
const expiryYear = ref('');
const receiptData = ref(null);

let microformInstance = null;
let captureJwt = null;

const formattedETB = computed(() => (donationAmountUSD.value * exchangeRate).toFixed(2));

// 1. Initial Load
const fetchMerchants = async () => {
  const res = await fetch(`${BASE_URL}/merchants`);
  merchants.value = await res.json();
};

const resolveLogoUrl = (path) => path?.startsWith('http') ? path : `${BASE_URL_SOURCE}${path}`;

// 2. Select Org & Get JWT
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
    paymentStatus.value = { message: "Security gateway unavailable." };
  }
};

// 3. WATCHER: When user enters Step 2, initialize Flex Microform
watch(currentStep, (newStep) => {
  if (newStep === 2 && !microformInstance) {
    flexLoading.value = true;
    nextTick(() => initFlex());
  }
});

const initFlex = () => {
  if (!captureJwt) return;
  
  const payload = JSON.parse(atob(captureJwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
  const context = payload.ctx[0].data;

  const script = document.createElement('script');
  script.src = context.clientLibrary;
  script.onload = () => {
    const flex = new window.Flex(captureJwt);
    microformInstance = flex.microform({ styles: { input: { 'font-size': '16px' } } });
    
    microformInstance.createField('number').load('#number-container');
    microformInstance.createField('securityCode').load('#securityCode-container');
    
    flexLoading.value = false;
    console.log("Flex Microform Loaded Successfully");
  };
  document.head.appendChild(script);
};

// 4. Handle Final Submission
const handlePayment = () => {
  console.log("Submit Clicked...");
  if (!microformInstance) return;

  processing.value = true;
  paymentStatus.value = null;

  const options = {
    expirationMonth: expiryMonth.value.padStart(2, '0'),
    expirationYear: expiryYear.value.length === 2 ? `20${expiryYear.value}` : expiryYear.value
  };

  microformInstance.createToken(options, async (err, token) => {
    if (err) {
      console.error("Tokenization Error:", err);
      paymentStatus.value = { message: err.message };
      processing.value = false;
      currentStep.value = 2; // Return to fix card
      return;
    }

    console.log("Token received, calling backend...");

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

      const result = await response.json();
      if (response.ok) {
        receiptData.value = result;
        currentStep.value = 4;
      } else {
        paymentStatus.value = { message: result.error || 'Payment declined.' };
      }
    } catch (e) {
      paymentStatus.value = { message: 'Network error calling backend.' };
    } finally {
      processing.value = false;
    }
  });
};

const goBack = () => {
  if (currentStep.value === 1) selectedNGO.value = null;
  else currentStep.value--;
};

const resetFlow = () => {
  selectedNGO.value = null;
  currentStep.value = 1;
  microformInstance = null;
  captureJwt = null;
};

onMounted(fetchMerchants);
</script>

<style scoped>
:deep(iframe) { width: 100% !important; height: 100% !important; }
</style>
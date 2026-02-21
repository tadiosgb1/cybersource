<template>
  <div class="min-h-screen bg-[#F1F5F9] font-sans selection:bg-[#FA9B2F]/30">
    <nav class="bg-white border-b border-slate-200 px-10 py-5 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <div class="flex items-center space-x-3">
        <div class="h-10 w-10 bg-[#004360] rounded-xl flex items-center justify-center font-black text-white shadow-lg">W</div>
        <div class="flex flex-col">
          <span class="text-xl font-black text-[#004360] leading-none uppercase tracking-tighter">Wegagen <span class="text-[#FA9B2F]">Direct</span></span>
          <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Official Remittance Portal</span>
        </div>
      </div>
      <div class="flex items-center space-x-8">
        <div class="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
          <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest">Rate: 1 USD = 132.45 ETB</span>
        </div>
        <i class="fas fa-shield-alt text-[#004360] text-xl opacity-20"></i>
      </div>
    </nav>

    <main class="max-w-4xl mx-auto py-16 px-6">
      <div class="flex justify-between mb-12 px-10">
        <div v-for="step in 3" :key="step" class="flex flex-col items-center space-y-2 relative">
          <div :class="currentStep >= step ? 'bg-[#004360] text-white' : 'bg-slate-200 text-slate-400'" 
               class="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 z-10">
            {{ step }}
          </div>
          <span class="text-[9px] font-black uppercase tracking-widest" :class="currentStep >= step ? 'text-[#004360]' : 'text-slate-300'">
            {{ ['Verify', 'Sender Info', 'Payment'][step-1] }}
          </span>
        </div>
        <div class="absolute top-[165px] left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-slate-200"></div>
      </div>

      <div class="bg-white rounded-[3rem] shadow-2xl shadow-slate-300 border border-white overflow-hidden">
        
        <div v-if="currentStep === 1" class="p-12 animate-in fade-in slide-in-from-bottom-4">
          <h2 class="text-2xl font-black text-slate-800 mb-2">Who are you sending to?</h2>
          <p class="text-slate-400 text-sm mb-10">Enter a valid 13-digit Wegagen account number to verify the recipient.</p>
          
          <div class="flex gap-4 p-2 bg-slate-50 border border-slate-100 rounded-[2rem]">
            <input v-model="accountNumber" type="text" placeholder="Recipient Account Number" 
                   class="flex-grow bg-transparent px-8 py-4 font-bold text-xl outline-none" />
            <button @click="verifyAccount" :disabled="isVerifying"
                    class="bg-[#004360] text-white px-10 rounded-[1.5rem] font-black uppercase text-xs hover:bg-slate-800 transition-all">
              {{ isVerifying ? 'Searching...' : 'Verify' }}
            </button>
          </div>

          <transition name="fade">
            <div v-if="verifiedName" class="mt-8 p-8 bg-emerald-50 border border-emerald-100 rounded-[2rem] flex items-center justify-between">
              <div>
                <span class="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified Receiver</span>
                <h3 class="text-2xl font-black text-emerald-900 mt-1">{{ verifiedName }}</h3>
              </div>
              <button @click="currentStep = 2" class="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs shadow-lg shadow-emerald-200">
                Continue
              </button>
            </div>
          </transition>
        </div>

        <div v-if="currentStep === 2" class="p-12 animate-in fade-in slide-in-from-right-8">
          <h2 class="text-2xl font-black text-slate-800 mb-2">Sender Information</h2>
          <p class="text-slate-400 text-sm mb-10">Compliance requires valid ID and contact details for international transfers.</p>
          
          <div class="grid grid-cols-2 gap-8">
            <div class="space-y-6">
              <div class="group">
                <label class="input-label">Full Legal Name (as on ID)</label>
                <input type="text" class="pro-input" placeholder="First Middle Last" />
              </div>
              <div class="group">
                <label class="input-label">Email Address</label>
                <input type="email" class="pro-input" placeholder="name@example.com" />
              </div>
              <div class="group">
                <label class="input-label">Residential Address</label>
                <input type="text" class="pro-input" placeholder="Street, City, State, ZIP" />
              </div>
            </div>
            
            <div class="space-y-6">
              <div class="group">
                <label class="input-label">Identification Type</label>
                <select class="pro-input">
                  <option>Passport</option>
                  <option>Driver's License</option>
                  <option>Resident ID</option>
                </select>
              </div>
              <div class="group">
                <label class="input-label">ID Number</label>
                <input type="text" class="pro-input" placeholder="Document Number" />
              </div>
              <div class="group">
                <label class="input-label">Purpose of Transfer</label>
                <select class="pro-input">
                  <option>Family Support</option>
                  <option>Investment/Real Estate</option>
                  <option>Education Expenses</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>

          <div class="mt-12 flex justify-between items-center border-t border-slate-100 pt-8">
            <button @click="currentStep = 1" class="text-slate-400 font-black uppercase text-xs tracking-widest hover:text-slate-600">Back</button>
            <button @click="currentStep = 3" class="bg-[#004360] text-white px-12 py-5 rounded-2xl font-black uppercase text-xs shadow-xl shadow-slate-200 hover:scale-105 transition-all">
              Go to Payment Details
            </button>
          </div>
        </div>

        <div v-if="currentStep === 3" class="animate-in fade-in slide-in-from-right-8">
          <div class="flex flex-col md:flex-row">
            <div class="bg-slate-900 text-white p-12 md:w-2/5 flex flex-col justify-between">
              <div>
                <h3 class="text-white/40 font-black uppercase tracking-widest text-[10px] mb-8">Transfer Summary</h3>
                <div class="space-y-6">
                  <div>
                    <p class="text-xs text-white/60 mb-1">To Account</p>
                    <p class="font-bold tracking-widest">{{ accountNumber }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-white/60 mb-1">Recipient</p>
                    <p class="font-bold text-[#FA9B2F]">{{ verifiedName }}</p>
                  </div>
                  <div class="pt-6 border-t border-white/10">
                    <p class="text-xs text-white/60 mb-1">Total to Pay</p>
                    <p class="text-4xl font-black">$500.00</p>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2 text-[10px] opacity-40 uppercase tracking-widest">
                <i class="fas fa-lock text-[#FA9B2F]"></i>
                <span>Bank-Level Security</span>
              </div>
            </div>

            <div class="p-12 md:w-3/5 space-y-8">
               <h3 class="text-xl font-black text-slate-800">Secure Card Entry</h3>
               <div class="space-y-4">
                  <div class="group">
                    <label class="input-label text-slate-400">Cardholder Name</label>
                    <input type="text" class="pro-input" placeholder="Exactly as on card" />
                  </div>
                  <div class="group">
                    <label class="input-label text-slate-400">Card Number</label>
                    <div class="pro-input h-[54px] flex items-center bg-slate-50 italic text-slate-400">
                       <i class="far fa-credit-card mr-3"></i> 0000 0000 0000 0000
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="group">
                      <label class="input-label text-slate-400">Expiry</label>
                      <input type="text" class="pro-input" placeholder="MM / YY" />
                    </div>
                    <div class="group">
                      <label class="input-label text-slate-400">CVV</label>
                      <input type="password" class="pro-input" placeholder="•••" />
                    </div>
                  </div>
               </div>

               <button class="w-full bg-[#FA9B2F] text-white py-6 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#e88a1e] shadow-xl shadow-orange-500/20 transition-all">
                 Authorize Transfer
               </button>
               
               <div class="flex justify-center space-x-6 opacity-30 grayscale hover:grayscale-0 transition-all">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" class="h-4" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" class="h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" class="h-5" />
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
      currentStep: 1,
      accountNumber: '',
      isVerifying: false,
      verifiedName: null
    }
  },
  methods: {
    verifyAccount() {
      if(this.accountNumber.length < 5) return;
      this.isVerifying = true;
      setTimeout(() => {
        this.isVerifying = false;
        this.verifiedName = "Kebede Tolosa Memheru";
      }, 1200);
    }
  }
}
</script>

<style scoped>
.pro-input {
  @apply w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 
         focus:bg-white focus:border-[#FA9B2F] focus:ring-4 focus:ring-orange-500/5 transition-all outline-none;
}
.input-label {
  @apply block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 ml-1;
}
.fade-enter-active { transition: opacity 0.5s; }
.fade-enter-from { opacity: 0; }
</style>
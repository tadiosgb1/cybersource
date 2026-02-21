<template>
  <div class="min-h-screen bg-[#F8FAFC] font-sans selection:bg-primary/30">
    <header class="bg-[#1e293b] sticky top-0 z-50 border-b border-white/10 shadow-xl">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="h-12 w-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-inner">
             <div class="text-[#eab308] font-black text-2xl">W</div>
          </div>
          <div class="flex flex-col">
            <span class="text-xl font-black text-white tracking-tight">WEGAGEN <span class="text-[#eab308]">IMPACT</span></span>
            <span class="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Official Philanthropy Portal</span>
          </div>
        </div>
        
        <nav class="hidden md:flex items-center space-x-8 text-white/80 text-xs font-black uppercase tracking-widest">
          <a href="#" class="hover:text-[#eab308] transition">Partner NGOs</a>
          <a href="#" class="hover:text-[#eab308] transition">Transparency Report</a>
          <button class="bg-[#eab308] text-[#1e293b] px-6 py-2.5 rounded-full hover:scale-105 transition-transform">Bank Login</button>
        </nav>
      </div>
    </header>

    <section class="bg-[#1e293b] text-white pt-12 pb-24 px-6 text-center relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div class="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#eab308] rounded-full blur-[120px]"></div>
      </div>
      
      <div class="relative z-10 max-w-4xl mx-auto">
        <h1 class="text-5xl font-black mb-6 leading-tight">Empower Change Across Ethiopia</h1>
        <p class="text-slate-400 text-lg mb-10">Securely donate to verified local organizations. Every cent is tracked and processed via Wegagen Bank's secure gateway.</p>
        
        <div class="max-w-2xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 flex">
          <input type="text" placeholder="Search for a cause (e.g. Education, Health)..." class="flex-grow bg-transparent px-6 text-white outline-none placeholder:text-white/40" />
          <button class="bg-[#eab308] text-black px-8 py-3 rounded-xl font-bold">Search</button>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="merchant in merchants" :key="merchant.id" 
             class="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all group">
          <div class="h-48 overflow-hidden relative">
            <img :src="merchant.image" :alt="merchant.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div class="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase text-primary">
              {{ merchant.category }}
            </div>
          </div>
          
          <div class="p-8">
            <h3 class="text-2xl font-black text-slate-800 mb-2">{{ merchant.name }}</h3>
            <p class="text-slate-500 text-sm leading-relaxed mb-6 h-12 overflow-hidden">{{ merchant.description }}</p>
            
            <div class="flex items-center justify-between pt-6 border-t border-slate-50">
              <div class="flex flex-col">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified by</span>
                <span class="text-xs font-bold text-slate-700">Wegagen Compliance</span>
              </div>
              <button @click="openDonationModal(merchant)" 
                      class="bg-primary hover:bg-dprimary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-95">
                Donate Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <transition name="fade">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" @click="showModal = false"></div>
        
        <div class="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
          <div class="bg-slate-900 p-8 text-white flex justify-between items-center">
            <div>
              <h3 class="text-xl font-bold">Secure Donation</h3>
              <p class="text-slate-400 text-[10px] uppercase tracking-widest mt-1">To: {{ selectedMerchant.name }}</p>
            </div>
            <i class="fas fa-shield-check text-[#eab308] text-3xl"></i>
          </div>

          <div class="p-10">
            <div class="space-y-6">
              <div class="grid grid-cols-3 gap-3">
                <button v-for="amt in [200, 500, 1000]" :key="amt" 
                        @click="donationAmount = amt"
                        :class="donationAmount === amt ? 'bg-primary text-white shadow-lg' : 'bg-slate-50 text-slate-500'"
                        class="py-3 rounded-xl font-bold transition-all border border-slate-100">
                  {{ amt }}
                </button>
              </div>

              <div class="space-y-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-black uppercase text-slate-400 ml-1">Card Holder</label>
                  <input type="text" placeholder="Name on card" class="custom-input" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-black uppercase text-slate-400 ml-1">Card Details</label>
                  <div id="card-number-field" class="custom-input h-[52px] flex items-center text-slate-400 italic">
                    <i class="far fa-credit-card mr-2"></i> Encrypted Secure Field
                  </div>
                </div>
              </div>

              <button class="w-full bg-[#eab308] text-black py-5 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-[#d4a007] transition-all shadow-xl shadow-yellow-500/10">
                Confirm {{ donationAmount }} ETB Donation
              </button>
              
              <div class="flex items-center justify-center space-x-4 opacity-40 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" class="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" class="h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <footer class="bg-white py-20 mt-20 border-t border-slate-100">
      <div class="max-w-7xl mx-auto px-6 text-center">
        <p class="text-slate-400 text-sm font-medium">© 2026 Wegagen Bank S.C. All Rights Reserved.</p>
        <p class="text-slate-300 text-xs mt-2 uppercase tracking-widest">Licensed by National Bank of Ethiopia</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      selectedMerchant: {},
      donationAmount: 500,
      merchants: [
        {
          id: 'ngo_001',
          name: 'Green Ethiopia',
          category: 'Environment',
          description: 'Reforestation and sustainable farming initiatives in the northern highlands.',
          image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400'
        },
        {
          id: 'ngo_002',
          name: 'Hope Education',
          category: 'Education',
          description: 'Providing textbooks and digital learning tools to rural primary schools.',
          image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400'
        },
        {
          id: 'ngo_003',
          name: 'Clean Water Initiative',
          category: 'Health',
          description: 'Constructing solar-powered water wells in drought-affected regions.',
          image: 'https://images.unsplash.com/photo-1541544741938-0af808891447?auto=format&fit=crop&q=80&w=400'
        }
      ]
    }
  },
  methods: {
    openDonationModal(merchant) {
      this.selectedMerchant = merchant;
      this.showModal = true;
    }
  }
}
</script>

<style scoped>
.custom-input {
  @apply w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-700 
         transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-slate-300;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
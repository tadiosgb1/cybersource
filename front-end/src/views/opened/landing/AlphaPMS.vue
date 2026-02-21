<template>
  <div class="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-500/30">
    <nav class="flex items-center justify-between px-8 py-6 border-b border-white/5 sticky top-0 bg-black/50 backdrop-blur-xl z-50">
      <div class="flex items-center space-x-2">
        <div class="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
          <i class="fas fa-play text-black text-xs"></i>
        </div>
        <span class="text-2xl font-black tracking-tighter uppercase">Ethio<span class="text-amber-500">Source</span></span>
      </div>
      
      <div class="hidden lg:flex space-x-12 text-[11px] font-black uppercase tracking-[0.2em] text-white/60">
        <a href="#" class="hover:text-white transition">Library</a>
        <a href="#" class="hover:text-white transition">Licenses</a>
        <a href="#" class="text-amber-500">Pricing</a>
      </div>

      <div class="flex items-center space-x-6">
        <span class="text-[10px] font-bold text-white/40 uppercase">Global Access</span>
        <button class="border border-white/20 px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Sign In</button>
      </div>
    </nav>

    <section class="relative py-32 px-6 overflow-hidden">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent"></div>
      
      <div class="max-w-4xl mx-auto text-center relative z-10">
        <h1 class="text-7xl font-black mb-8 tracking-tighter leading-tight">
          Authentic African Assets <br/> for <span class="text-amber-500 italic">Modern Creators.</span>
        </h1>
        <p class="text-white/50 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
          Premium 8K stock footage, traditional music stems, and high-res photography. Produced in Ethiopia, licensed globally.
        </p>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-6 pb-32">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div class="bg-[#111] p-12 rounded-[3rem] border border-white/5 flex flex-col hover:border-amber-500/50 transition-all group">
          <span class="text-amber-500 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Solo Creator</span>
          <h3 class="text-3xl font-bold mb-6">Creator</h3>
          <div class="mb-10">
            <span class="text-5xl font-black">$29</span>
            <span class="text-white/30 text-sm font-bold uppercase ml-2 tracking-widest">/ Month</span>
          </div>
          <ul class="space-y-5 mb-12 flex-grow">
            <li class="flex items-center text-white/60 text-sm font-semibold">
              <i class="fas fa-check text-amber-500 mr-4 text-xs"></i> 10 Downloads / Mo
            </li>
            <li class="flex items-center text-white/60 text-sm font-semibold">
              <i class="fas fa-check text-amber-500 mr-4 text-xs"></i> Standard License
            </li>
            <li class="flex items-center text-white/60 text-sm font-semibold">
              <i class="fas fa-check text-amber-500 mr-4 text-xs"></i> Royalty Free
            </li>
          </ul>
          <button @click="initiateGlobalPayment('creator', 29)" 
                  class="w-full py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-amber-500 transition-all">
            Subscribe Now
          </button>
        </div>

        <div class="bg-[#111] p-12 rounded-[3rem] border-2 border-amber-500 flex flex-col relative transform scale-105 shadow-[0_0_50px_-12px_rgba(245,158,11,0.3)]">
          <div class="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
            Best for Agencies
          </div>
          <span class="text-amber-500 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Unlimited Power</span>
          <h3 class="text-3xl font-bold mb-6">Studio</h3>
          <div class="mb-10">
            <span class="text-5xl font-black">$89</span>
            <span class="text-white/30 text-sm font-bold uppercase ml-2 tracking-widest">/ Month</span>
          </div>
          <ul class="space-y-5 mb-12 flex-grow">
            <li class="flex items-center text-white text-sm font-bold">
              <i class="fas fa-bolt text-amber-500 mr-4 text-xs"></i> Unlimited Downloads
            </li>
            <li class="flex items-center text-white text-sm font-bold">
              <i class="fas fa-bolt text-amber-500 mr-4 text-xs"></i> Multi-User Access (5)
            </li>
            <li class="flex items-center text-white text-sm font-bold">
              <i class="fas fa-bolt text-amber-500 mr-4 text-xs"></i> Extended Commercial License
            </li>
          </ul>
          <button @click="initiateGlobalPayment('studio', 89)" 
                  class="w-full py-5 rounded-2xl bg-amber-500 text-black font-black uppercase tracking-widest text-xs hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all">
            Unlock Everything
          </button>
        </div>

        <div class="bg-[#111] p-12 rounded-[3rem] border border-white/5 flex flex-col hover:border-amber-500/50 transition-all">
          <span class="text-amber-500 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Enterprise</span>
          <h3 class="text-3xl font-bold mb-6">Broadcast</h3>
          <div class="mb-10">
            <span class="text-5xl font-black">$299</span>
            <span class="text-white/30 text-sm font-bold uppercase ml-2 tracking-widest">/ Year</span>
          </div>
          <ul class="space-y-5 mb-12 flex-grow">
            <li class="flex items-center text-white/60 text-sm font-semibold">
              <i class="fas fa-star text-amber-500 mr-4 text-xs"></i> 8K Raw Footage Access
            </li>
            <li class="flex items-center text-white/60 text-sm font-semibold">
              <i class="fas fa-star text-amber-500 mr-4 text-xs"></i> Television Rights
            </li>
            <li class="flex items-center text-white/60 text-sm font-semibold">
              <i class="fas fa-star text-amber-500 mr-4 text-xs"></i> API Integration
            </li>
          </ul>
          <button @click="initiateGlobalPayment('broadcast', 299)" 
                  class="w-full py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-amber-500 transition-all">
            Get Broadcast License
          </button>
        </div>

      </div>

      <div class="mt-24 flex flex-col items-center">
        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8">Secure Worldwide Processing</p>
        <div class="flex items-center space-x-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
           <i class="fab fa-cc-visa text-4xl"></i>
           <i class="fab fa-cc-mastercard text-4xl"></i>
           <span class="text-xs font-black border border-white px-3 py-1 rounded italic">WEGAGEN SECURE</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  methods: {
    initiateGlobalPayment(plan, price) {
      console.log(`International checkout triggered for ${plan} at $${price}`);
      
      // LOGIC: 
      // 1. Send Plan ID to Node.js backend.
      // 2. Backend generates a Secure Acceptance Signature for Wegagen/Cybersource.
      // 3. User is redirected to Cybersource's Hosted Page.
      
      alert(`Redirecting to Wegagen Bank's International Payment Gateway. \nPlan: ${plan.toUpperCase()} \nAmount: $${price}.00`);
    }
  }
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
</style>
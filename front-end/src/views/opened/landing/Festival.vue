<template>
  <div class="min-h-screen bg-[#fafaf9] text-[#1a1a1a] font-serif">
    <nav class="flex items-center justify-between px-12 py-8 bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200">
      <div class="flex flex-col">
        <span class="text-2xl font-black tracking-widest uppercase font-sans">Gondar<span class="text-amber-600">2026</span></span>
        <span class="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em]">Official VIP Gateway</span>
      </div>
      
      <div class="hidden lg:flex space-x-12 text-[11px] font-bold uppercase tracking-widest text-stone-600">
        <a href="#" class="hover:text-amber-600">The Tradition</a>
        <a href="#" class="hover:text-amber-600">Historic Circuit</a>
        <a href="#" class="text-amber-600 border-b-2 border-amber-600 pb-1">Booking</a>
      </div>

      <button class="bg-black text-white px-8 py-3 rounded-none font-sans text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-colors">
        Check Availability
      </button>
    </nav>

    <section class="relative h-[80vh] flex items-center justify-center overflow-hidden">
      <img src="https://images.unsplash.com/photo-1544015759-444498308873?auto=format&fit=crop&q=80&w=2000" 
           class="absolute inset-0 w-full h-full object-cover brightness-50" />
      <div class="relative z-10 text-center text-white px-6">
        <span class="text-amber-400 font-sans font-black uppercase tracking-[0.5em] text-xs mb-6 block">Witness Ancient Majesty</span>
        <h1 class="text-7xl md:text-9xl font-black mb-8 leading-none">TIMKET</h1>
        <p class="text-xl max-w-2xl mx-auto font-light leading-relaxed font-sans opacity-80">
          The world’s most spectacular Epiphany. Join the sacred procession in the medieval capital of Gondar.
        </p>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-6 -mt-32 relative z-20 pb-32">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-0 shadow-2xl">
        
        <div class="bg-white p-12 border-r border-stone-100 flex flex-col">
          <h3 class="text-2xl font-bold mb-2">The Observer</h3>
          <p class="text-stone-400 text-sm mb-8 font-sans uppercase tracking-widest font-bold">Standard Access</p>
          <div class="mb-10 font-sans">
            <span class="text-4xl font-light">$</span>
            <span class="text-6xl font-black">450</span>
          </div>
          <ul class="space-y-6 mb-12 flex-grow font-sans text-sm text-stone-600">
            <li class="flex items-start"><i class="fas fa-check text-amber-600 mt-1 mr-4"></i> Reserved Grandstand Seating</li>
            <li class="flex items-start"><i class="fas fa-check text-amber-600 mt-1 mr-4"></i> English Speaking Historian</li>
            <li class="flex items-start"><i class="fas fa-check text-amber-600 mt-1 mr-4"></i> Airport Transfers (Gondar)</li>
          </ul>
          <button @click="processPayment('observer', 450)" 
                  class="w-full py-5 border-2 border-black font-sans font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all">
            Secure This Pass
          </button>
        </div>

        <div class="bg-stone-900 p-12 text-white flex flex-col relative transform md:scale-105 z-10">
          <div class="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
          <h3 class="text-2xl font-bold mb-2">The Pilgrim</h3>
          <p class="text-amber-500 text-sm mb-8 font-sans uppercase tracking-widest font-bold">Immersive Experience</p>
          <div class="mb-10 font-sans">
            <span class="text-4xl font-light text-stone-500">$</span>
            <span class="text-6xl font-black">1,200</span>
          </div>
          <ul class="space-y-6 mb-12 flex-grow font-sans text-sm text-stone-300">
            <li class="flex items-start"><i class="fas fa-star text-amber-500 mt-1 mr-4"></i> 4-Night Luxury Boutique Stay</li>
            <li class="flex items-start"><i class="fas fa-star text-amber-500 mt-1 mr-4"></i> VIP Poolside Access (Fasilides)</li>
            <li class="flex items-start"><i class="fas fa-star text-amber-500 mt-1 mr-4"></i> Traditional White Festival Attire</li>
            <li class="flex items-start"><i class="fas fa-star text-amber-500 mt-1 mr-4"></i> Exclusive Eve Dinner with Elders</li>
          </ul>
          <button @click="processPayment('pilgrim', 1200)" 
                  class="w-full py-5 bg-amber-500 text-black font-sans font-black uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20">
            Reserve Your Place
          </button>
        </div>

        <div class="bg-white p-12 flex flex-col">
          <h3 class="text-2xl font-bold mb-2">The Imperial</h3>
          <p class="text-stone-400 text-sm mb-8 font-sans uppercase tracking-widest font-bold">Full Circuit</p>
          <div class="mb-10 font-sans">
            <span class="text-4xl font-light">$</span>
            <span class="text-6xl font-black">3,500</span>
          </div>
          <ul class="space-y-6 mb-12 flex-grow font-sans text-sm text-stone-600">
            <li class="flex items-start"><i class="fas fa-crown text-amber-600 mt-1 mr-4"></i> Private Helicopter (Addis-Gondar)</li>
            <li class="flex items-start"><i class="fas fa-crown text-amber-600 mt-1 mr-4"></i> 5-Star Historical Circuit Access</li>
            <li class="flex items-start"><i class="fas fa-crown text-amber-600 mt-1 mr-4"></i> All-Inclusive Private Concierge</li>
          </ul>
          <button @click="processPayment('imperial', 3500)" 
                  class="w-full py-5 border-2 border-black font-sans font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all">
            Inquire for Details
          </button>
        </div>

      </div>
    </section>

    <div class="max-w-4xl mx-auto text-center pb-24 border-t border-stone-200 pt-16">
      <div class="flex items-center justify-center space-x-8 opacity-40">
        <span class="text-[9px] font-black uppercase tracking-[0.3em]">Official Partner</span>
        <div class="h-8 w-[1px] bg-stone-300"></div>
        <span class="text-[12px] font-black font-sans">WEGAGEN BANK SECURE</span>
        <div class="h-8 w-[1px] bg-stone-300"></div>
        <i class="fab fa-cc-visa text-xl"></i>
        <i class="fab fa-cc-mastercard text-xl"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    processPayment(tier, amount) {
      // Directs the international tourist to the bank's secure page
      console.log(`Redirecting to Wegagen Cybersource for tier: ${tier}`);
      const confirmMsg = `You have selected the ${tier.toUpperCase()} package for $${amount}. \n\nYou will now be redirected to Wegagen Bank's secure server for PCI-compliant card processing.`;
      
      if(confirm(confirmMsg)) {
        // Logic to send user to the bank's Hosted Payment Page (HPP)
        window.location.href = `https://wegagen-payment-gateway.com/checkout?amount=${amount}&ref=TIMKET2026`;
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;700;900&display=swap');
.font-serif { font-family: 'Playfair Display', serif; }
.font-sans { font-family: 'Inter', sans-serif; }
</style>
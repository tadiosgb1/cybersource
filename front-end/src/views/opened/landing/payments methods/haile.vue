<template>
  <div class="min-h-screen bg-[#FDFCFB] flex flex-col font-sans">
    
    <header class="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div class="bg-[#003366] text-white py-2 px-6 hidden md:block">
        <div class="max-w-7xl mx-auto flex justify-between items-center text-[10px] font-bold tracking-[0.15em] uppercase">
          <div class="flex space-x-6">
            <span>Free Shipping on Orders over 10,000 ETB</span>
            <span class="text-blue-300">|</span>
            <span>Customer Support: 8667</span>
          </div>
          <div class="flex space-x-4">
            <a href="#" class="hover:text-[#ef7d00] transition">My Account</a>
            <a href="#" class="hover:text-[#ef7d00] transition">Track Order</a>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div class="flex items-center space-x-8">
          <div class="flex items-center space-x-3">
            <img src="../../../../assets/img/haile.JPG" 
                 alt="Haile Resort" class="h-10 md:h-12" />
            <div class="h-8 w-px bg-stone-200"></div>
            <span class="text-[#003366] font-bold text-sm uppercase tracking-widest hidden sm:block">
              Boutique
            </span>
          </div>

          <nav class="hidden lg:flex items-center space-x-8 text-[11px] font-black uppercase tracking-widest text-stone-600">
            <a href="#" class="hover:text-[#003366] transition">New Arrivals</a>
            <a href="#" class="hover:text-[#003366] transition">Home Decor</a>
            <a href="#" class="hover:text-[#003366] transition">Apparel</a>
            <a href="#" class="hover:text-[#003366] transition">Traditional</a>
          </nav>
        </div>
        
        <div class="flex items-center space-x-6">
          <div class="hidden md:flex flex-col items-end">
             <span class="text-[9px] font-black text-emerald-600 uppercase">Live Security Active</span>
             <span class="text-[10px] text-stone-400 font-medium">Verified by Wegagen Bank</span>
          </div>
          <button class="relative p-2 bg-stone-50 rounded-full hover:bg-stone-100 transition-colors">
            <span class="absolute -top-1 -right-1 bg-[#ef7d00] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">3</span>
            <svg class="w-5 h-5 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>
    </header>

    <main class="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
      <div class="mb-12 border-b border-stone-100 pb-8 flex justify-between items-end">
        <div>
          <h1 class="text-4xl font-serif text-stone-800 italic">Signature Collection</h1>
          <p class="text-stone-500 text-sm mt-2 font-medium italic">Hand-selected luxury items from Haile Resort destinations.</p>
        </div>
        <div class="hidden md:block">
          <select class="bg-transparent border-none text-xs font-bold uppercase tracking-widest text-stone-400 outline-none">
            <option>Sort By: Featured</option>
            <option>Price: Low to High</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div v-for="product in products" :key="product.id" class="group">
          <div class="aspect-[4/5] overflow-hidden bg-stone-100 rounded-2xl mb-6 relative shadow-sm border border-stone-200/50">
            <img :src="product.image" :alt="product.name" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div class="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter text-[#003366]">
              {{ product.category }}
            </div>
          </div>
          <div class="flex justify-between items-start px-1">
            <div>
              <h3 class="text-stone-800 font-bold text-lg group-hover:text-[#ef7d00] transition-colors">{{ product.name }}</h3>
              <p class="text-stone-400 text-xs font-medium mt-1">Authentic Haile Resort Merchandise</p>
            </div>
            <p class="text-[#003366] font-black text-lg">{{ product.price }} <span class="text-[10px]">ETB</span></p>
          </div>
          <button @click="openCheckout(product)" class="mt-6 w-full bg-[#003366] text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#ef7d00] transition-all transform active:scale-95 shadow-xl shadow-blue-900/10">
            Purchase Now
          </button>
        </div>
      </div>
    </main>

    <transition name="fade">
      <div v-if="activeProduct" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-stone-900/80 backdrop-blur-md" @click="activeProduct = null"></div>
        
        <div class="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
          <div class="md:w-5/12 bg-stone-50 p-10 border-r border-stone-100">
            <button @click="activeProduct = null" class="text-stone-400 hover:text-stone-800 text-[10px] font-black uppercase tracking-widest mb-10 flex items-center">
              <svg class="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg> Return to Shop
            </button>
            <div class="relative inline-block mb-6">
              <img :src="activeProduct.image" class="w-24 h-24 object-cover rounded-2xl shadow-lg" />
              <span class="absolute -top-2 -right-2 bg-[#ef7d00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">1</span>
            </div>
            <h4 class="text-stone-800 font-bold text-base leading-tight">{{ activeProduct.name }}</h4>
            <div class="mt-12 space-y-3">
              <div class="flex justify-between text-xs text-stone-500 font-medium"><span>Standard Shipping</span><span>Calculated at Bank</span></div>
              <div class="flex justify-between font-black text-[#003366] text-xl pt-4 border-t border-stone-200"><span>Total Due</span><span>{{ activeProduct.price }} ETB</span></div>
            </div>
          </div>

          <div class="md:w-7/12 p-10">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h3 class="font-black text-stone-800 text-lg uppercase tracking-tight">Checkout</h3>
                <p class="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Wegagen Secure Gateway</p>
              </div>
              <i class="fas fa-shield-check text-emerald-500 text-2xl"></i>
            </div>

            <div v-if="loading" class="py-20 text-center">
              <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-[#ef7d00] mx-auto mb-4"></div>
              <p class="text-stone-400 text-[10px] font-black uppercase tracking-widest">Securing Session...</p>
            </div>

            <form v-show="!loading" @submit.prevent="processTransaction" class="space-y-5">
              <div class="space-y-1">
                <label class="text-[10px] font-black text-stone-400 uppercase ml-1">Cardholder Name</label>
                <input type="text" v-model="cardholderName" placeholder="As it appears on card" class="checkout-input" required />
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-black text-stone-400 uppercase ml-1">Card Number</label>
                <div id="number-container" class="h-[56px] bg-stone-50 border border-stone-200 rounded-xl px-4 flex items-center transition-all focus-within:ring-2 focus-within:ring-[#003366]"></div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-black text-stone-400 uppercase ml-1">Expiry Date</label>
                  <div class="flex space-x-2">
                    <input type="text" v-model="expiryMonth" placeholder="MM" maxlength="2" class="checkout-input text-center px-0 w-1/2" />
                    <input type="text" v-model="expiryYear" placeholder="YYYY" maxlength="4" class="checkout-input text-center px-0 w-1/2" />
                  </div>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-black text-stone-400 uppercase ml-1">CVV / CVC</label>
                  <div id="securityCode-container" class="h-[56px] bg-stone-50 border border-stone-200 rounded-xl px-4 flex items-center"></div>
                </div>
              </div>

              <button :disabled="processing" type="submit" class="w-full bg-[#ef7d00] hover:bg-[#d67000] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-50 mt-4">
                <span v-if="!processing">Pay {{ activeProduct.price }} ETB Securely</span>
                <span v-else class="flex items-center justify-center">
                  <svg class="animate-spin h-4 w-4 mr-3 border-2 border-white/30 border-t-white rounded-full" viewBox="0 0 24 24"></svg> Encrypting...
                </span>
              </button>
              
              <div class="flex items-center justify-center space-x-4 opacity-40 grayscale pt-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" class="h-3" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" class="h-5" />
              </div>
            </form>

            <div v-if="paymentStatus" :class="paymentStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'" class="mt-6 p-4 rounded-xl text-[11px] font-bold border animate-in fade-in slide-in-from-top-2">
              {{ paymentStatus.message }}
            </div>
          </div>
        </div>
      </div>
    </transition>

    <footer class="bg-[#1A1A1A] text-white pt-20 pb-10">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div class="space-y-6">
            <img src="https://www.wegagenbank.com.et/wp-content/uploads/2022/01/cropped-Wegagen-Bank-Logo-1.png" class="h-10 brightness-0 invert opacity-80" />
            <p class="text-stone-500 text-sm leading-relaxed font-medium">
              Bringing the world-class hospitality of Haile Resorts to your doorstep through the most secure digital payment gateway in Ethiopia.
            </p>
          </div>

          <div>
            <h5 class="text-[#ef7d00] font-black text-[10px] uppercase tracking-[0.3em] mb-8">Navigation</h5>
            <ul class="space-y-4 text-stone-400 text-sm font-bold">
              <li><a href="#" class="hover:text-white transition">All Products</a></li>
              <li><a href="#" class="hover:text-white transition">Resort Destinations</a></li>
              <li><a href="#" class="hover:text-white transition">Guest Benefits</a></li>
              <li><a href="#" class="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h5 class="text-[#ef7d00] font-black text-[10px] uppercase tracking-[0.3em] mb-8">Security</h5>
            <ul class="space-y-4 text-stone-400 text-sm font-bold">
              <li><a href="#" class="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" class="hover:text-white transition">Wegagen Security Protocol</a></li>
              <li><a href="#" class="hover:text-white transition">PCI-DSS Standards</a></li>
              <li class="pt-2 flex items-center space-x-2">
                <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span class="text-[10px] uppercase text-emerald-500">Bank-Grade Encryption</span>
              </li>
            </ul>
          </div>

          <div>
            <h5 class="text-[#ef7d00] font-black text-[10px] uppercase tracking-[0.3em] mb-8">Customer Care</h5>
            <div class="space-y-4">
              <div class="flex items-center space-x-3 text-stone-400">
                <span class="bg-stone-800 p-2 rounded-lg text-white">📞</span>
                <span class="text-sm font-black">8667 Toll-Free</span>
              </div>
              <div class="flex items-center space-x-3 text-stone-400">
                <span class="bg-stone-800 p-2 rounded-lg text-white">✉️</span>
                <span class="text-sm">support@haileresorts.com</span>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-10 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 text-[10px] font-bold text-stone-600 uppercase tracking-widest">
          <p>© 2026 Haile Resort S.C. | Powered by Wegagen Bank S.C.</p>
          <div class="flex items-center space-x-6">
            <span>PCI DSS Certified</span>
            <span class="text-stone-800">|</span>
            <span>SSL Secured</span>
            <span class="text-stone-800">|</span>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" class="h-3 opacity-20 invert" />
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const products = [
  { id: 'h001', name: 'Signature Spa Robe', category: 'Apparel', price: '4500', currency: 'ETB', image: 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=400' },
  { id: 'h002', name: 'Haile Lakefront Scent', category: 'Home', price: '2800', currency: 'ETB', image: 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=400' },
  { id: 'h003', name: 'Woven Ethiopian Throw', category: 'Handicraft', price: '6200', currency: 'ETB', image: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=400' },
{ id: 'h004', name: 'Signature Spa Robe', category: 'Apparel', price: '4500', currency: 'ETB', image: 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=400' },
  { id: 'h005', name: 'Haile Lakefront Scent', category: 'Home', price: '2800', currency: 'ETB', image: 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=400' },
  { id: 'h006', name: 'Woven Ethiopian Throw', category: 'Handicraft', price: '6200', currency: 'ETB', image: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=400' }
];

const activeProduct = ref(null);
const loading = ref(false);
const processing = ref(false);
const cardholderName = ref('');
const expiryMonth = ref('');
const expiryYear = ref('');
const paymentStatus = ref(null);
let microformInstance = null;

const openCheckout = async (product) => {
  activeProduct.value = product;
  loading.value = true;
  paymentStatus.value = null;

  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_BASE_URL_LOCAL}/generate-capture-context`,
      { method: 'POST' }
    );

    const jwt = await response.text();

    const payload = JSON.parse(
      atob(jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
    );

    const context = payload.ctx[0].data;

    const script = document.createElement('script');
    script.src = context.clientLibrary;

    script.onload = () => {
      const flex = new window.Flex(jwt);

      microformInstance = flex.microform({
        styles: {
          input: {
            'font-size': '15px',
            'color': '#2d3748'
          }
        }
      });

      microformInstance
        .createField('number', { placeholder: '0000 0000 0000 0000' })
        .load('#number-container');

      microformInstance
        .createField('securityCode', { placeholder: 'CVV' })
        .load('#securityCode-container');

      loading.value = false;
    };

    document.head.appendChild(script);

  } catch (err) {
    loading.value = false;
    paymentStatus.value = {
      type: 'error',
      message: 'Payment module failed to load.'
    };
  }
};

const processTransaction = () => {
  if (!microformInstance) return;
  processing.value = true;

  microformInstance.createToken(
    {
      expirationMonth: expiryMonth.value,
      expirationYear: expiryYear.value
    },
    async (err, token) => {
      if (err) {
        processing.value = false;
        paymentStatus.value = {
          type: 'error',
          message: 'Valid payment details required.'
        };
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_APP_BASE_URL_LOCAL}/process-payment`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              transientToken: token,
              amount: activeProduct.value.price,
              productId: activeProduct.value.id
            })
          }
        );

        const result = await res.json();

        if (res.ok) {
          paymentStatus.value = {
            type: 'success',
            message: 'Order Confirmed! Receipt ID: ' + result.id
          };
        }

      } catch (e) {
        paymentStatus.value = {
          type: 'error',
          message: 'Bank communication error.'
        };
      } finally {
        processing.value = false;
      }
    }
  );
};
</script>

<style scoped>
.checkout-input {
  @apply w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-stone-700 outline-none focus:ring-2 focus:ring-[#003366];
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
:deep(iframe) { width: 100% !important; height: 100% !important; }
</style>
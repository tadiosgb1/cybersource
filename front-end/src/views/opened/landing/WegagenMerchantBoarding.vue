<template>
  <div class="min-h-screen bg-[#F4F7FA] font-sans text-slate-900">
    <header class="bg-[#004360] py-6 px-10 flex justify-between items-center shadow-lg">
      <div class="flex items-center space-x-4">
        <div class="bg-white p-2 rounded-lg font-black text-[#004360] text-xl">W</div>
        <h1 class="text-white font-black uppercase tracking-widest text-lg">Merchant <span class="text-[#FA9B2F]">Boarding</span></h1>
      </div>
      <div class="text-white/60 text-[10px] font-bold uppercase tracking-widest border border-white/20 px-4 py-2 rounded-full">
        Cybersource Enterprise Gateway
      </div>
    </header>

    <main class="max-w-5xl mx-auto py-12 px-6">
      <div class="flex justify-between mb-12 relative">
        <div class="absolute top-5 left-0 w-full h-[2px] bg-slate-200 z-0"></div>
        <div v-for="(step, index) in steps" :key="index" class="relative z-10 flex flex-col items-center">
          <div :class="currentStep >= index + 1 ? 'bg-[#FA9B2F] text-white shadow-lg shadow-orange-500/30' : 'bg-slate-200 text-slate-500'" 
               class="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500">
            {{ index + 1 }}
          </div>
          <span class="text-[9px] font-black uppercase mt-3 tracking-widest" :class="currentStep >= index + 1 ? 'text-[#004360]' : 'text-slate-400'">
            {{ step }}
          </span>
        </div>
      </div>

      <div class="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        
        <div v-if="currentStep === 1" class="p-12 animate-in fade-in duration-500">
          <div class="mb-10">
            <h2 class="text-3xl font-black text-[#004360]">Business Profile</h2>
            <p class="text-slate-400 font-medium">Create your primary Merchant Organization record.</p>
          </div>

          <div class="grid grid-cols-2 gap-8">
            <div class="space-y-6">
              <div class="form-group">
                <label>Legal Business Name *</label>
                <input v-model="form.businessName" type="text" placeholder="e.g. Ethio Retail PLC" class="api-input" />
              </div>
              <div class="form-group">
                <label>Unique Organization ID *</label>
                <input v-model="form.orgId" type="text" placeholder="ER_PLC_001" class="api-input font-mono" />
                <p class="text-[9px] text-slate-400 mt-1 uppercase tracking-tighter">Required for Cybersource API mapping</p>
              </div>
            </div>
            
            <div class="space-y-6">
              <div class="form-group">
                <label>Merchant Category Code (MCC) *</label>
                <input v-model="form.mcc" type="text" placeholder="5999" class="api-input" />
              </div>
              <div class="form-group">
                <label>Website URL</label>
                <input v-model="form.website" type="text" placeholder="https://..." class="api-input" />
              </div>
            </div>
          </div>

          <div class="mt-12 flex justify-end">
            <button @click="currentStep = 2" class="bg-[#004360] text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all">
              Next: Contacts & Address
            </button>
          </div>
        </div>

        <div v-if="currentStep === 2" class="p-12 animate-in slide-in-from-right-10 duration-500">
          <div class="mb-10">
            <h2 class="text-3xl font-black text-[#004360]">Technical & Business Contact</h2>
            <p class="text-slate-400 font-medium">Required for API registration and emergency alerts.</p>
          </div>

          <div class="grid grid-cols-2 gap-10">
            <div class="space-y-6">
              <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 border-b pb-2">Business Address</h3>
              <input v-model="form.address1" placeholder="Address Line 1" class="api-input" />
              <div class="grid grid-cols-2 gap-4">
                <input v-model="form.locality" placeholder="City (Locality)" class="api-input" />
                <input v-model="form.country" placeholder="Country (ISO Code: US/ET)" class="api-input" />
              </div>
            </div>

            <div class="space-y-6">
              <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 border-b pb-2">Contact Person</h3>
              <div class="grid grid-cols-2 gap-4">
                <input v-model="form.firstName" placeholder="First Name" class="api-input" />
                <input v-model="form.lastName" placeholder="Last Name" class="api-input" />
              </div>
              <input v-model="form.email" placeholder="Email Address" class="api-input" />
              <input v-model="form.phone" placeholder="Phone Number" class="api-input" />
            </div>
          </div>

          <div class="mt-12 flex justify-between items-center">
            <button @click="currentStep = 1" class="text-slate-400 font-black uppercase text-xs tracking-widest">Back</button>
            <button @click="currentStep = 3" class="bg-[#004360] text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">
              Next: Product Enablement
            </button>
          </div>
        </div>

        <div v-if="currentStep === 3" class="p-12 animate-in zoom-in-95 duration-500">
          <div class="mb-10">
            <h2 class="text-3xl font-black text-[#004360]">Product Configuration</h2>
            <p class="text-slate-400 font-medium">Select Cybersource modules for this organization.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div v-for="product in products" :key="product.id" 
                 @click="product.enabled = !product.enabled"
                 :class="product.enabled ? 'border-[#FA9B2F] bg-orange-50' : 'border-slate-100 bg-slate-50'"
                 class="p-6 border-2 rounded-3xl cursor-pointer transition-all hover:shadow-md flex items-center justify-between">
              <div>
                <h4 class="font-black text-[#004360] uppercase text-xs tracking-widest">{{ product.name }}</h4>
                <p class="text-[10px] text-slate-500 mt-1">{{ product.desc }}</p>
              </div>
              <div :class="product.enabled ? 'bg-[#FA9B2F]' : 'bg-slate-300'" class="w-5 h-5 rounded-full flex items-center justify-center">
                <i v-if="product.enabled" class="fas fa-check text-white text-[10px]"></i>
              </div>
            </div>
          </div>

          <div class="bg-slate-900 rounded-2xl p-6 mb-8 overflow-hidden relative">
            <div class="absolute top-4 right-4 text-[10px] font-mono text-emerald-500 uppercase">POST /boarding/v1/registrations</div>
            <pre class="text-emerald-500 text-[10px] font-mono leading-relaxed">
{
  "registrationInformation": { "boardingFlow": "ENTERPRISE" },
  "organizationInformation": {
    "organizationId": "{{ form.orgId }}",
    "type": "MERCHANT",
    "configurable": true,
    "businessInformation": {
      "name": "{{ form.businessName }}",
      "address": { "country": "{{ form.country }}", "locality": "{{ form.locality }}" }
    }
  }
}</pre>
          </div>

          <div class="flex justify-between items-center">
            <button @click="currentStep = 2" class="text-slate-400 font-black uppercase text-xs tracking-widest">Back</button>
            <button @click="submitBoarding" class="bg-[#FA9B2F] text-white px-16 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-orange-500/30 hover:scale-105 transition-all">
              Execute Boarding
            </button>
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
      steps: ['Organization', 'Contacts', 'Products'],
      form: {
        businessName: '',
        orgId: '',
        mcc: '',
        website: '',
        address1: '',
        locality: '',
        country: 'ET',
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      },
      products: [
        { id: 1, name: 'Token Management', desc: 'Securely store customer card data.', enabled: true },
        { id: 2, name: 'Decision Manager', desc: 'Advanced fraud detection rules.', enabled: true },
        { id: 3, name: 'Tax Service', desc: 'Automated global tax calculation.', enabled: false },
        { id: 4, name: 'Payment Gateway', desc: 'Core Visa/Mastercard processing.', enabled: true }
      ]
    }
  },
  methods: {
    async submitBoarding() {
      // 1. Create Merchant Org (As per Page 16 of Guide)
      // 2. If Successful, Create Transacting Org (As per Page 19 of Guide)
      alert(`API EXECUTION INITIATED\nCreating Merchant Organization: ${this.form.orgId}\n\nPlease check console for REST response codes.`);
      console.log("CYBS API Request Sent...");
    }
  }
}
</script>

<style scoped>
.api-input {
  @apply w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-bold text-slate-700 
         focus:bg-white focus:border-[#FA9B2F] focus:ring-4 focus:ring-orange-500/5 transition-all outline-none;
}
label {
  @apply block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 ml-1;
}
</style>
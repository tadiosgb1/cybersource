<template>
  <div class="min-h-screen bg-slate-50 p-6">

    <!-- Header + Controls -->
    <div class="max-w-7xl mx-auto mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black text-[#003366]">Merchant Donation Dashboard</h1>
        <p class="text-slate-500 mt-2 text-sm">List of registered merchants/NGOs.</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-2 items-center">
        <!-- Search Box -->
        <div class="relative w-full sm:w-64">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search merchants..."
            @input="filterMerchants"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm text-gray-700 placeholder-gray-400 transition"
          />
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
        </div>

        <!-- Add Merchant Button -->
        <button
          @click="showAddMerchant = true"
          class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
        >
          <i class="fas fa-plus mr-2"></i> Add Merchant
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin h-10 w-10 border-2 border-[#ef7d00] border-t-transparent rounded-full"></div>
    </div>

    <!-- Merchant Grid -->
    <div v-else class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="merchant in filteredMerchants" :key="merchant.id"
        class="bg-white rounded-3xl border border-slate-100 overflow-hidden transition group hover:shadow-md">

        <!-- Image -->
        <div class="h-48 overflow-hidden relative bg-slate-100 flex items-center justify-center">
          <img 
            v-if="merchant.logo"
            :src="resolveLogoUrl(merchant.logo)"
            alt="Logo"
            class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <span v-else class="text-slate-400 text-sm">No Logo</span>
        </div>

        <!-- Content -->
        <div class="p-6 flex flex-col justify-between h-[220px]">
          <div>
            <h2 class="text-xl font-black text-slate-800 mb-2">{{ merchant.companyName }}</h2>
            <p class="text-sm text-slate-500 line-clamp-3">{{ merchant.description }}</p>
            <p class="text-xs text-slate-400 mt-2">Merchant ID: {{ merchant.merchantId }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && filteredMerchants.length === 0"
      class="text-center text-slate-400 mt-20">
      No merchants available.
    </div>

    <!-- Add Merchant Modal -->
    <add-merchant
      v-if="showAddMerchant"
      @close="showAddMerchant = false"
      @merchant-added="handleMerchantAdded"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import AddMerchant from './addMerchant.vue';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL_LOCAL;
const BASE_URL_SOURCE = import.meta.env.VITE_APP_BASE_URL_LOCAL_SOURCE;

const merchants = ref([]);
const filteredMerchants = ref([]);
const loading = ref(false);
const searchQuery = ref("");
const showAddMerchant = ref(false);

// Fetch merchants from API
const fetchMerchants = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`${BASE_URL}/merchants`);
    merchants.value = res.data;
    filteredMerchants.value = merchants.value;
  } catch (err) {
    console.error("Failed to fetch merchants:", err);
  } finally {
    loading.value = false;
  }
};

// Filter merchants based on search query
const filterMerchants = () => {
  const query = searchQuery.value.toLowerCase();
  filteredMerchants.value = merchants.value.filter(m =>
    m.companyName.toLowerCase().includes(query) ||
    (m.description && m.description.toLowerCase().includes(query))
  );
};

// Handle logo URL
const resolveLogoUrl = (logoPath) => {
  if (!logoPath) return "";
  if (logoPath.startsWith("http")) return logoPath;
  return `${BASE_URL_SOURCE}${logoPath}`;
};

// Refresh merchant list after adding
const handleMerchantAdded = () => {
  showAddMerchant.value = false;
  fetchMerchants();
};

onMounted(fetchMerchants);
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Primary colors */
.bg-primary { background-color: #4f46e5; }
.hover\:bg-primary-dark:hover { background-color: #4338ca; }
.text-primary { color: #4f46e5; }

/* Modal pop-in animation */
@keyframes popIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-pop-in { animation: popIn 0.25s ease-out; }
</style>
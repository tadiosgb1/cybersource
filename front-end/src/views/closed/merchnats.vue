<template>
  <div class="min-h-screen bg-slate-50 p-6">

    <!-- Header -->
    <div class="max-w-7xl mx-auto mb-10">
      <h1 class="text-3xl font-black text-[#003366]">
        Merchant Dashboard
      </h1>
      <p class="text-slate-500 mt-2 text-sm">
        List of registered merchants/NGOs.
      </p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin h-10 w-10 border-2 border-[#ef7d00] border-t-transparent rounded-full"></div>
    </div>

    <!-- Merchant Grid -->
    <div v-else class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      
      <div v-for="merchant in merchants" :key="merchant.id"
        class="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden transition group">

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
            <h2 class="text-xl font-black text-slate-800 mb-2">
              {{ merchant.companyName }}
            </h2>

            <p class="text-sm text-slate-500 line-clamp-3">
              {{ merchant.description }}
            </p>

            <p class="text-xs text-slate-400 mt-2">
              Merchant ID: {{ merchant.merchantId }}
            </p>
          </div>
        </div>

      </div>

    </div>

    <!-- Empty State -->
    <div v-if="!loading && merchants.length === 0"
      class="text-center text-slate-400 mt-20">
      No merchants available yet.
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// Base URL for images (make sure this matches your backend)
const BASE_URL = import.meta.env.VITE_APP_BASE_URL_LOCAL;
const BASE_URL_SOURCE = import.meta.env.VITE_APP_BASE_URL_LOCAL_SOURCE;

const merchants = ref([]);
const loading = ref(false);

// Resolve the logo URL
const resolveLogoUrl = (logoPath) => {
  if (!logoPath) return ""; // No logo
  // If the path is already a full URL, return as is
  if (logoPath.startsWith("http")) return logoPath;
  // Otherwise, prepend BASE_URL
  return `${BASE_URL_SOURCE}${logoPath}`;
};

// Fetch merchants from backend
const fetchMerchants = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`${BASE_URL}/merchants`);
    merchants.value = res.data;
  } catch (err) {
    console.error("Failed to fetch merchants:", err);
  } finally {
    loading.value = false;
  }
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
</style>
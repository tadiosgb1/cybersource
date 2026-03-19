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

          <!-- Edit Button -->
          <button
            @click="openEditModal(merchant)"
            class="mt-4 text-white bg-[#ef7d00] px-4 py-2 rounded-lg hover:bg-[#d66b00] transition"
          >
            Edit
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && merchants.length === 0"
      class="text-center text-slate-400 mt-20">
      No merchants available yet.
    </div>

    <!-- Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 relative">
        <h2 class="text-2xl font-bold mb-4">Edit Merchant</h2>
        
        <form @submit.prevent="saveMerchant">
          <label class="block text-sm text-slate-600 mt-2">Company Name</label>
          <input v-model="editableMerchant.companyName" type="text"
            class="w-full mt-1 p-2 border rounded-lg border-slate-300" required />

          <label class="block text-sm text-slate-600 mt-2">Description</label>
          <textarea v-model="editableMerchant.description" rows="4"
            class="w-full mt-1 p-2 border rounded-lg border-slate-300"></textarea>

          <label class="block text-sm text-slate-600 mt-2">Logo URL</label>
          <input v-model="editableMerchant.logo" type="text"
            class="w-full mt-1 p-2 border rounded-lg border-slate-300" />

          <div class="flex justify-end mt-6 space-x-3">
            <button type="button" @click="closeModal"
              class="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#002244]">
              Save
            </button>
          </div>
        </form>

        <!-- Close button -->
        <button @click="closeModal" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">&times;</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL_LOCAL;
const BASE_URL_SOURCE = import.meta.env.VITE_APP_BASE_URL_LOCAL_SOURCE;

const merchants = ref([]);
const loading = ref(false);

// Modal state
const showModal = ref(false);
const editableMerchant = ref({});

// Resolve the logo URL
const resolveLogoUrl = (logoPath) => {
  if (!logoPath) return ""; 
  if (logoPath.startsWith("http")) return logoPath;
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

// Modal functions
const openEditModal = (merchant) => {
  editableMerchant.value = { ...merchant }; // Clone to avoid direct mutation
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

// Save merchant
const saveMerchant = async () => {
  try {
    const { id, companyName, description, logo } = editableMerchant.value;
    await axios.put(`${BASE_URL}/merchants/${id}`, {
      companyName,
      description,
      logo
    });
    // Update local merchants array
    const index = merchants.value.findIndex(m => m.id === id);
    if (index !== -1) merchants.value[index] = { ...editableMerchant.value };
    closeModal();
  } catch (err) {
    console.error("Failed to save merchant:", err);
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
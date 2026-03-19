<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-6" @click.self="$emit('close')">
    <div class="w-full max-w-2xl bg-white rounded-3xl p-8 space-y-6 animate-pop-in relative shadow-2xl">
      
      <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition text-2xl">
        &times;
      </button>

      <h2 class="text-2xl font-black text-[#003366] text-center">Edit Merchant Details</h2>

      <form @submit.prevent="submitEdit" class="space-y-4">
        <input v-model="form.companyName" type="text" placeholder="Company Name"
          class="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-orange-200 outline-none" required />

        <textarea v-model="form.description" placeholder="Description" rows="3"
          class="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-orange-200 outline-none"></textarea>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input v-model="form.merchantId" type="text" placeholder="Merchant ID"
            class="w-full p-3 border rounded-xl bg-slate-50" required />
          <input v-model="form.accessKey" type="text" placeholder="Access Key"
            class="w-full p-3 border rounded-xl bg-slate-50" />
        </div>

        <input v-model="form.secretKey" type="password" placeholder="Secret Key"
          class="w-full p-3 border rounded-xl bg-slate-50" />

        <div class="p-4 border-2 border-dashed border-slate-200 rounded-xl">
          <label class="text-xs font-bold text-slate-500 uppercase">Merchant Logo</label>
          <input type="file" @change="handleFile" class="w-full mt-2 text-sm" accept="image/*" />
          
          <div v-if="form.logo && !logoFile" class="mt-3 flex items-center gap-3">
            <img :src="resolveLogoUrl(form.logo)" class="h-12 w-12 object-cover rounded border" />
            <span class="text-xs text-slate-400">Current Logo</span>
          </div>
        </div>

        <button type="submit" :disabled="loading"
          class="w-full py-4 bg-[#ef7d00] text-white font-bold rounded-xl hover:bg-[#d67000] disabled:opacity-50 transition shadow-lg shadow-orange-200">
          <span v-if="!loading">Update Merchant</span>
          <span v-else class="flex justify-center items-center">
            <i class="fas fa-circle-notch animate-spin mr-2"></i> Saving...
          </span>
        </button>

        <div v-if="message" :class="success ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'"
          class="p-4 rounded-xl text-center text-sm font-medium animate-pulse">
          {{ message }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import axios from "axios";

const props = defineProps({
  merchant: { type: Object, required: true }
});

const emit = defineEmits(["close", "merchant-updated"]);

const BASE_URL = import.meta.env.VITE_APP_BASE_URL_LOCAL;
const BASE_URL_SOURCE = import.meta.env.VITE_APP_BASE_URL_LOCAL_SOURCE;

const form = ref({
  id: "",
  companyName: "",
  description: "",
  merchantId: "",
  accessKey: "",
  secretKey: "",
  logo: ""
});

const logoFile = ref(null);
const loading = ref(false);
const message = ref("");
const success = ref(false);

// Function to populate form
const syncForm = (data) => {
  form.value = {
    id: data.id || data._id || "",
    companyName: data.companyName || "",
    description: data.description || "",
    merchantId: data.merchantId || "",
    accessKey: data.accessKey || "",
    secretKey: data.secretKey || "",
    logo: data.logo || ""
  };
};

// Sync on initial load
onMounted(() => syncForm(props.merchant));

// Sync if props change while open
watch(() => props.merchant, (newVal) => {
  if (newVal) syncForm(newVal);
}, { deep: true });

const handleFile = (e) => {
  logoFile.value = e.target.files[0];
};

const resolveLogoUrl = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${BASE_URL_SOURCE}${path}`;
};

const submitEdit = async () => {
  loading.value = true;
  message.value = "";
  try {
    const formData = new FormData();
    formData.append("companyName", form.value.companyName);
    formData.append("description", form.value.description);
    formData.append("merchantId", form.value.merchantId);
    formData.append("accessKey", form.value.accessKey);
    formData.append("secretKey", form.value.secretKey);
    if (logoFile.value) formData.append("logo", logoFile.value);

    await axios.patch(`${BASE_URL}/merchants/${form.value.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    success.value = true;
    message.value = "Changes saved successfully!";
    
    // Crucial: Wait a moment for user to see success, then emit update
    setTimeout(() => {
      emit("merchant-updated");
    }, 600);
  } catch (err) {
    success.value = false;
    message.value = err.response?.data?.message || "Error updating merchant";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@keyframes popIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-pop-in { animation: popIn 0.2s ease-out; }
</style>
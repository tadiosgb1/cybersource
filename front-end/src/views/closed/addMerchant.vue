<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-6" @click.self="$emit('close')">
    <div class="w-full max-w-2xl bg-white rounded-3xl p-8 space-y-6 animate-pop-in relative">

      <!-- Close button -->
      <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition">
        <i class="fas fa-times text-lg"></i>
      </button>

      <h2 class="text-2xl font-black text-[#003366] text-center">
        Register Merchant
      </h2>

      <form @submit.prevent="submitMerchant" class="space-y-5">

        <input v-model="form.companyName" type="text" placeholder="Company Name"
          class="w-full p-4 border rounded-xl bg-slate-50" required />

        <textarea v-model="form.description" placeholder="Description"
          class="w-full p-4 border rounded-xl bg-slate-50"></textarea>

        <input v-model="form.merchantId" type="text" placeholder="Merchant ID"
          class="w-full p-4 border rounded-xl bg-slate-50" required />

        <input v-model="form.accessKey" type="text" placeholder="Access Key"
          class="w-full p-4 border rounded-xl bg-slate-50" />

        <input v-model="form.secretKey" type="text" placeholder="Secret Key"
          class="w-full p-4 border rounded-xl bg-slate-50" />

        <div>
          <label class="text-sm font-bold text-slate-600">Upload Logo <span class="text-red-500">*</span></label>
          <input 
            type="file" 
            accept="image/*"
            @change="handleFile"
            class="w-full mt-2 p-3 border rounded-xl bg-slate-50" 
            required
          />
        </div>

        <button type="submit"
          :disabled="loading"
          class="w-full py-4 bg-[#ef7d00] text-white font-bold rounded-xl hover:bg-[#d67000] transition">

          <span v-if="!loading">Register Merchant</span>
          <span v-else class="flex justify-center items-center">
            <span class="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
            Uploading...
          </span>
        </button>

        <div v-if="message"
          class="p-4 rounded-xl text-sm"
          :class="success ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'">
          {{ message }}
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";

const { appContext } = getCurrentInstance();
const $apiPost = appContext.config.globalProperties.$apiPost;

const emit = defineEmits(['close','merchant-added']);

const form = ref({
  companyName: "",
  description: "",
  category: "",
  merchantId: "",
  accessKey: "",
  secretKey: ""
});

const logoFile = ref(null);
const loading = ref(false);
const message = ref("");
const success = ref(false);

const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

const handleFile = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  if (!allowedTypes.includes(file.type)) {
    message.value = "Only image files (PNG, JPG, JPEG, WEBP) are allowed.";
    success.value = false;
    logoFile.value = null;
    e.target.value = "";
    return;
  }

  logoFile.value = file;
  message.value = "";
};

const submitMerchant = async () => {
  message.value = "";

  if (!logoFile.value) {
    success.value = false;
    message.value = "Please upload a logo image.";
    return;
  }

  if (!allowedTypes.includes(logoFile.value.type)) {
    success.value = false;
    message.value = "Only image files (PNG, JPG, JPEG, WEBP) are allowed.";
    return;
  }

  loading.value = true;

  try {
    const formData = new FormData();
    formData.append("companyName", form.value.companyName);
    formData.append("description", form.value.description);
    formData.append("category", form.value.category);
    formData.append("merchantId", form.value.merchantId);
    formData.append("accessKey", form.value.accessKey);
    formData.append("secretKey", form.value.secretKey);
    formData.append("logo", logoFile.value);

    const headers = { "Content-Type": "multipart/form-data" };

    // ✅ Use global API utility with URL, payload, headers
    await $apiPost(`${import.meta.env.VITE_APP_BASE_URL_LOCAL}/merchants`, formData, headers);

    success.value = true;
    message.value = "Merchant registered successfully!";

    form.value = {
      companyName: "",
      description: "",
      merchantId: "",
      accessKey: "",
      secretKey: "",
      category: ""
    };
    logoFile.value = null;

    setTimeout(() => emit('merchant-added'), 500);

  } catch (err) {
    success.value = false;
    message.value = err.response?.data?.message || "Failed to register merchant";
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
.animate-pop-in { animation: popIn 0.25s ease-out; }
</style>
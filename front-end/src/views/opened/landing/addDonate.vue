```vue
<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-6">
    <div class="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 space-y-6">
      
      <h2 class="text-2xl font-black text-[#003366] text-center">
        Register Merchant
      </h2>

      <form @submit.prevent="submitMerchant" class="space-y-5">

        <!-- Company Name -->
        <input v-model="form.companyName" type="text" placeholder="Company Name"
          class="w-full p-4 border rounded-xl bg-slate-50" required />

        <!-- Description -->
        <textarea v-model="form.description" placeholder="Description"
          class="w-full p-4 border rounded-xl bg-slate-50"></textarea>

     
        <!-- Merchant ID -->
        <input v-model="form.merchantId" type="text" placeholder="Merchant ID"
          class="w-full p-4 border rounded-xl bg-slate-50" required />

        <!-- Access Key -->
        <input v-model="form.accessKey" type="text" placeholder="Access Key"
          class="w-full p-4 border rounded-xl bg-slate-50" />

        <!-- Secret Key -->
        <input v-model="form.secretKey" type="text" placeholder="Secret Key"
          class="w-full p-4 border rounded-xl bg-slate-50" />

        <!-- Logo Upload -->
        <div>
          <label class="text-sm font-bold text-slate-600">Upload Logo</label>
          <input type="file" @change="handleFile"
            class="w-full mt-2 p-3 border rounded-xl bg-slate-50" />
        </div>

        <!-- Submit Button -->
        <button type="submit"
          :disabled="loading"
          class="w-full py-4 bg-[#ef7d00] text-white font-bold rounded-xl hover:bg-[#d67000] transition">
          
          <span v-if="!loading">Register Merchant</span>
          <span v-else class="flex justify-center items-center">
            <span class="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
            Uploading...
          </span>
        </button>

        <!-- Status -->
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
import { ref } from "vue";
import axios from "axios";

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

// 👉 Handle file
const handleFile = (e) => {
  logoFile.value = e.target.files[0];
};

// 👉 Submit form (MULTIPART)
const submitMerchant = async () => {
  loading.value = true;
  message.value = "";

  try {
    const formData = new FormData();

    formData.append("companyName", form.value.companyName);
    formData.append("description", form.value.description);
    formData.append("category", form.value.category);
    formData.append("merchantId", form.value.merchantId);
    formData.append("accessKey", form.value.accessKey);
    formData.append("secretKey", form.value.secretKey);

    if (logoFile.value) {
      formData.append("logo", logoFile.value);
    }

    const res = await axios.post(
      `${import.meta.env.VITE_APP_BASE_URL_LOCAL}/merchants`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    success.value = true;
    message.value = "Merchant registered successfully!";

    // Reset form
    form.value = {
      companyName: "",
      description: "",
      merchantId: "",
      accessKey: "",
      secretKey: ""
    };
    logoFile.value = null;

  } catch (err) {
    success.value = false;
    message.value = err.response?.data?.message || "Failed to register merchant";
  } finally {
    loading.value = false;
  }
};
</script>
```

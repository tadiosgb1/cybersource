<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-[60] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]"
    >
      <div class="bg-gradient-to-r from-dprimary to-primary px-6 py-5 flex justify-between items-center shrink-0">
        <div class="flex items-center gap-3">
          <div class="bg-white/20 p-2 rounded-lg backdrop-blur-md">
            <i class="fas fa-user-plus text-white text-xl"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-white tracking-tight">Create Manager Account</h2>
            <p class="text-white/60 text-[10px] uppercase tracking-widest font-black">System Access & Profile Setup</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="h-8 w-8 flex items-center justify-center rounded-full bg-black/10 text-white hover:bg-black/20 transition-all font-bold"
        >
          ✕
        </button>
      </div>

      <div class="overflow-y-auto p-6 custom-scrollbar bg-white">
        <form @submit.prevent="submitForm" id="managerForm" class="space-y-6">
          
          <div class="space-y-4">
            <h3 class="text-[11px] font-black text-primary uppercase tracking-[0.2em] border-b border-primary/10 pb-2">Administrative Zone</h3>
            <div>
              <label class="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Property Zone</label>
              <div class="relative group">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary transition-colors">
                  <i class="fas fa-map-marker-alt text-xs"></i>
                </span>
                <select
                  v-model="form.property_zone"
                  required
                  class="custom-input !pl-10 !mt-0 h-11 shadow-sm border-gray-200 focus:border-primary"
                >
                  <option disabled value="">Select Assigned Zone</option>
                  <option v-for="zone in zones" :key="zone.id" :value="zone.id">
                    {{ zone.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-[11px] font-black text-primary uppercase tracking-[0.2em] border-b border-primary/10 pb-2">Contact Credentials</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="manager@domain.com"
                  class="custom-input !mt-0 h-11 shadow-sm border-gray-200 focus:border-primary"
                />
              </div>
              <div>
                <label class="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                <input
                  v-model="form.phone_number"
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  class="custom-input !mt-0 h-11 shadow-sm border-gray-200 focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-[11px] font-black text-primary uppercase tracking-[0.2em] border-b border-primary/10 pb-2">Personal Identity</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">First Name</label>
                <input
                  v-model="form.first_name"
                  type="text"
                  required
                  class="custom-input !mt-0 h-11 shadow-sm border-gray-200 focus:border-primary"
                />
              </div>
              <div>
                <label class="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Last Name</label>
                <input
                  v-model="form.last_name"
                  type="text"
                  required
                  class="custom-input !mt-0 h-11 shadow-sm border-gray-200 focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label class="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Middle Name (Optional)</label>
              <input
                v-model="form.middle_name"
                type="text"
                class="custom-input !mt-0 h-11 shadow-sm border-gray-200 focus:border-primary"
              />
            </div>
            <div>
              <label class="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Physical Address</label>
              <textarea
                v-model="form.address"
                rows="2"
                placeholder="Street, City, State, Zip"
                class="custom-input !mt-0 py-3 shadow-sm border-gray-200 focus:border-primary"
              ></textarea>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-[11px] font-black text-primary uppercase tracking-[0.2em] border-b border-primary/10 pb-2">Security</h3>
            <div>
              <label class="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Account Password</label>
              <div class="relative group">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <i class="fas fa-lock text-xs"></i>
                </span>
                <input
                  v-model="form.password"
                  type="password"
                  required
                  placeholder="••••••••"
                  class="custom-input !mt-0 !pl-10 h-11 shadow-sm border-gray-200 focus:border-primary"
                />
              </div>
              <p class="mt-1 text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Required for the first login of this user.</p>
            </div>
          </div>
        </form>
      </div>

      <div class="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100 shrink-0">
        <button
          type="button"
          @click="$emit('close')"
          class="text-[11px] font-black text-gray-400 hover:text-gray-600 uppercase tracking-[0.2em] transition-colors"
        >
          Cancel
        </button>
        <button
          form="managerForm"
          type="submit"
          class="bg-gradient-to-r from-primary to-dprimary text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 uppercase text-[11px] tracking-widest"
        >
          <i class="fas fa-save"></i> 
          Save Manager Account
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>

<script>
export default {
  name: "AddManagerModal",
  props: {
    visible: Boolean,
  },
  data() {
    return {
      managerVisible: false,
      zones: [],
      form: {
        email: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        phone_number: "",
        address: "",
        property_zone: "",
        owner_id: localStorage.getItem("userId"),
        is_manager: true,
        password: "",
      },
    };
  },
  async mounted() {
    const result = await this.$getZones();
    this.zones = result.zones;
    console.log("zones", this.zones);
  },
  methods: {
    close() {
      this.resetForm();
      this.managerVisible = false;
    },
async submitForm() {
  console.log("this.form", this.form);
  
  try {
    const res = await this.$apiPost("/create_manager", this.form);
    console.log("res manager add", res);
    // ✅ Show success toast
    this.$root.$refs.toast.showToast("Manager successfully added", "success");

    this.resetForm();
    this.$reloadPage();
    this.close();
  } catch (error) {
    console.error("Error adding manager:", error);

    // ❌ Show error toast
    this.$root.$refs.toast.showToast(
      error.message || "Failed to add manager.",
      "error"
    );
  }
}
,
    resetForm() {
      this.form = {
        email: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        phone_number: "",
        address: "",
        owner_id: localStorage.getItem("userId"),
        property_zone: "",
        is_manager: true,
        password: "",
      };
    },
  },
};
</script>

<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
  >
    <div class="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100">
      
      <div class="bg-gradient-to-r from-dprimary to-primary px-8 py-6 flex justify-between items-center shadow-md shrink-0">
        <div class="flex items-center gap-4">
          <div class="p-2.5 bg-white/20 rounded-xl backdrop-blur-md">
            <i class="fas fa-user-plus text-white text-xl"></i>
          </div>
          <div>
            <h2 class="text-2xl font-black text-white tracking-tight">Create User Account</h2>
            <p class="text-white/70 text-[10px] uppercase tracking-widest font-bold">Register a new system member</p>
          </div>
        </div>
        <button 
          @click="$emit('close')" 
          class="w-10 h-10 flex items-center justify-center rounded-full bg-black/10 text-white hover:bg-white/20 transition-all text-xl"
        >
          &times;
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-8 modal-scroll">
        <form id="addUserForm" @submit.prevent="submitForm" class="space-y-8">
          
          <div class="space-y-4">
            <p class="text-[11px] font-black text-primary uppercase tracking-[0.2em] border-b border-primary/10 pb-2">Personal Profile</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-1">
                <label class="custom-label">First Name <span class="custom-star">*</span></label>
                <input v-model="form.first_name" type="text" required placeholder="John" class="custom-input !mt-0 h-11" />
              </div>
              <div class="space-y-1">
                <label class="custom-label">Middle Name</label>
                <input v-model="form.middle_name" type="text" placeholder="Michael" class="custom-input !mt-0 h-11" />
              </div>
              <div class="space-y-1">
                <label class="custom-label">Last Name <span class="custom-star">*</span></label>
                <input v-model="form.last_name" type="text" required placeholder="Doe" class="custom-input !mt-0 h-11" />
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <p class="text-[11px] font-black text-primary uppercase tracking-[0.2em] border-b border-primary/10 pb-2">Contact & Access</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-1">
                <label class="custom-label">Email Address <span class="custom-star">*</span></label>
                <div class="relative group">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary">
                    <i class="fas fa-envelope text-xs"></i>
                  </span>
                  <input v-model="form.email" type="email" required placeholder="john@example.com" class="custom-input !mt-0 !pl-10 h-11" />
                </div>
              </div>
              <div class="space-y-1">
                <label class="custom-label">Phone Number</label>
                <div class="relative group">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary">
                    <i class="fas fa-phone text-xs"></i>
                  </span>
                  <input v-model="form.phone_number" type="text" placeholder="+251..." class="custom-input !mt-0 !pl-10 h-11" />
                </div>
              </div>
              <div class="space-y-1">
                <label class="custom-label">Temporary Password <span class="custom-star">*</span></label>
                <div class="relative group">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary">
                    <i class="fas fa-lock text-xs"></i>
                  </span>
                  <input v-model="form.password" type="password" required placeholder="••••••••" class="custom-input !mt-0 !pl-10 h-11" />
                </div>
              </div>
              <div class="space-y-1">
                <label class="custom-label">Physical Address</label>
                <div class="relative group">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary">
                    <i class="fas fa-map-marker-alt text-xs"></i>
                  </span>
                  <input v-model="form.address" type="text" placeholder="Addis Ababa, Ethiopia" class="custom-input !mt-0 !pl-10 h-11" />
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Account Permissions</p>
            <div class="flex flex-wrap gap-8">
              <label class="flex items-center group cursor-pointer">
                <div class="relative flex items-center">
                  <input type="checkbox" v-model="form.is_active" class="peer h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary/20 transition-all" />
                </div>
                <span class="ml-3 text-sm font-bold text-gray-600 group-hover:text-primary transition-colors">Active Account</span>
              </label>
              
              <label class="flex items-center group cursor-pointer">
                <input type="checkbox" v-model="form.is_staff" class="peer h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary/20 transition-all" />
                <span class="ml-3 text-sm font-bold text-gray-600 group-hover:text-primary transition-colors">Staff Access</span>
              </label>

              <label class="flex items-center group cursor-pointer">
                <input type="checkbox" v-model="form.is_superuser" class="peer h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-200 transition-all" />
                <span class="ml-3 text-sm font-bold text-gray-600 group-hover:text-red-600 transition-colors">Superuser (Full Control)</span>
              </label>
            </div>
          </div>
        </form>
      </div>

      <div class="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-4 shrink-0">
        <button
          type="button"
          @click="$emit('close')"
          class="px-6 py-2 text-xs font-black text-gray-400 hover:text-gray-600 uppercase tracking-[0.15em] transition-all"
        >
          Cancel
        </button>
        <button
          form="addUserForm"
          type="submit"
          class="custom-button !w-auto !px-10 flex items-center gap-3 shadow-lg shadow-primary/20"
        >
          <i class="fas fa-save"></i>
          Register User
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "AddUserModal",
  props: {
    visible: { type: Boolean, default: false },
  },
  data() {
    return {
      form: {
        password: "",
        last_login: new Date().toISOString(),
        email: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        phone_number: "",
        address: "",
        date_joined: new Date().toISOString(),
        is_active: true,
        is_staff: false,
        is_superuser: false,
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        const payload = { ...this.form };
        await this.$apiPost("/post_user", payload);
        this.$root.$refs.toast.showToast("User Successfully registered","success")
       // this.$emit("success"); // notify parent to refresh users
        this.$emit("close");   // close modal after success
      } catch (error) {
        console.error("Failed to create user:", error);
         this.$root.$refs.toast.showToast(error.message,"error")
        //alert("Failed to create user.");
      }
    },
  },
};
</script>

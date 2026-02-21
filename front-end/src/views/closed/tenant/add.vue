<template>
  <div>
    <Toast ref="toast" />

    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300"
    >
      <div 
        class="bg-white w-full max-w-[850px] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100 animate-in zoom-in duration-200"
      >
        <div class="bg-gradient-to-r from-dprimary to-primary px-8 py-6 flex justify-between items-center shadow-md shrink-0">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-white/20 rounded-lg backdrop-blur-md">
              <i class="fas fa-user-plus text-white text-lg"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white tracking-tight">Add New Tenant</h2>
              <p class="text-white/70 text-[10px] uppercase tracking-widest font-bold">Onboard New Property Resident</p>
            </div>
          </div>
          <button 
            @click="$emit('close')" 
            class="w-8 h-8 flex items-center justify-center rounded-full bg-black/10 text-white hover:bg-white/20 transition-colors"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 md:p-8">
          <form id="tenantForm" @submit.prevent="submitForm" class="space-y-8">
            
            <div class="space-y-4">
              <h3 class="text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b border-gray-100 pb-2">1. Personal Identity</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="space-y-1">
                  <label class="custom-label">First Name <span class="custom-star">*</span></label>
                  <input v-model="form.first_name" type="text" placeholder="John" class="custom-input h-11" required />
                </div>
                <div class="space-y-1">
                  <label class="custom-label">Middle Name</label>
                  <input v-model="form.middle_name" type="text" placeholder="Michael" class="custom-input h-11" />
                </div>
                <div class="space-y-1">
                  <label class="custom-label">Last Name <span class="custom-star">*</span></label>
                  <input v-model="form.last_name" type="text" placeholder="Doe" class="custom-input h-11" required />
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <h3 class="text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b border-gray-100 pb-2">2. Contact & Logistics</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1 group">
                  <label class="custom-label">Email Address <span class="custom-star">*</span></label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary">
                      <i class="fas fa-envelope text-xs"></i>
                    </span>
                    <input v-model="form.email" type="email" placeholder="tenant@example.com" class="custom-input !pl-10 h-11" required />
                  </div>
                </div>
                <div class="space-y-1 group">
                  <label class="custom-label">Phone Number <span class="custom-star">*</span></label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary">
                      <i class="fas fa-phone text-xs"></i>
                    </span>
                    <input v-model="form.phone_number" type="tel" placeholder="+251..." class="custom-input !pl-10 h-11" required />
                  </div>
                </div>
              </div>
              <div class="space-y-1 group">
                <label class="custom-label">Current Address</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary">
                    <i class="fas fa-map-marker-alt text-xs"></i>
                  </span>
                  <input v-model="form.address" type="text" placeholder="Addis Ababa, Ethiopia" class="custom-input !pl-10 h-11" />
                </div>
              </div>
            </div>

            <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-6">
              <h3 class="text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b border-gray-200 pb-2">3. Account Settings</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1 group">
                  <label class="custom-label">Set Password <span class="custom-star">*</span></label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary">
                      <i class="fas fa-lock text-xs"></i>
                    </span>
                    <input v-model="form.password" type="password" placeholder="••••••••" class="custom-input !pl-10 h-11 bg-white" required />
                  </div>
                </div>

                <div class="flex flex-wrap gap-4 items-end pb-2">
                  <label class="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" v-model="form.is_active" class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    <span class="text-xs font-bold text-gray-600 uppercase tracking-wider group-hover:text-primary transition-colors">Active</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" v-model="form.is_staff" class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    <span class="text-xs font-bold text-gray-600 uppercase tracking-wider group-hover:text-primary transition-colors">Staff</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" v-model="form.is_superuser" class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    <span class="text-xs font-bold text-gray-600 uppercase tracking-wider group-hover:text-primary transition-colors">Superuser</span>
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div class="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors"
          >
            Cancel
          </button>
          <button
            form="tenantForm"
            type="submit"
            :disabled="loading"
            class="custom-button !w-auto !px-10 flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-check-circle"></i>
            {{ loading ? "Creating..." : "Create Tenant Account" }}
          </button>
        </div>
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
        is_tenant:true,
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        // 1. Create the user
        const payload = { ...this.form };
        const res = await this.$apiPost("/sign_up", payload);
         console.log("res sign up",res);
        // if (!res || !res.id) {
        //   throw new Error("User creation failed: No ID returned.");
        // }

        // console.log("User created:", res);

        // // 2. Assign to super_staff group
        // const groupPayload = {
        //   user_id: res.id,
        //   groups: ["tenant"],
        // };

        // console.log("Assigning groups:", groupPayload);

        // const resAsign=await this.$apiPost("/set_user_groups", groupPayload);
       
        // if(resAsign){
        //   this.$root.$refs.toast.showToast("Successfully  Created", "success");
        // }
        // 3. Emit events to parent
        this.$emit("success"); // refresh parent users
        this.$emit("close");   // close modal
      } catch (error) {
        console.error("Failed to create user or assign group:", error);
        alert("Failed to create user or assign to super_staff group.");
      }
    },
  },
};
</script>

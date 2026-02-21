<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
  >
    <div class="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100">
      
      <div class="bg-gradient-to-r from-dprimary to-primary px-8 py-6 flex justify-between items-center shadow-md shrink-0">
        <div class="flex items-center gap-4">
          <div class="p-2.5 bg-white/20 rounded-xl backdrop-blur-md text-white">
            <i class="fas fa-user-shield text-xl"></i>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-white tracking-tight">Add Super Staff</h2>
            <p class="text-white/70 text-[10px] uppercase tracking-widest font-black">Internal Administrative Access</p>
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
        <form id="addSuperStaffForm" @submit.prevent="submitForm" class="space-y-8">
          
          <div class="space-y-4">
            <p class="text-[11px] font-black text-primary uppercase tracking-[0.2em] border-b border-primary/10 pb-2">Full Identity</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-1">
                <label class="text-[11px] font-black text-gray-500 uppercase tracking-wider ml-1">First Name *</label>
                <input v-model="form.first_name" type="text" required placeholder="John" class="custom-input !mt-0 h-11" />
              </div>
              <div class="space-y-1">
                <label class="text-[11px] font-black text-gray-500 uppercase tracking-wider ml-1">Middle Name</label>
                <input v-model="form.middle_name" type="text" placeholder="Michael" class="custom-input !mt-0 h-11" />
              </div>
              <div class="space-y-1">
                <label class="text-[11px] font-black text-gray-500 uppercase tracking-wider ml-1">Last Name *</label>
                <input v-model="form.last_name" type="text" required placeholder="Doe" class="custom-input !mt-0 h-11" />
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <p class="text-[11px] font-black text-primary uppercase tracking-[0.2em] border-b border-primary/10 pb-2">Account Security</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-1">
                <label class="text-[11px] font-black text-gray-500 uppercase tracking-wider ml-1">Email Address *</label>
                <div class="relative group">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary transition-colors">
                    <i class="fas fa-envelope text-xs"></i>
                  </span>
                  <input v-model="form.email" type="email" required placeholder="john@example.com" class="custom-input !mt-0 !pl-10 h-11" />
                </div>
              </div>
              <div class="space-y-1">
                <label class="text-[11px] font-black text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                <div class="relative group">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary transition-colors">
                    <i class="fas fa-phone text-xs"></i>
                  </span>
                  <input v-model="form.phone_number" type="text" placeholder="+251..." class="custom-input !mt-0 !pl-10 h-11" />
                </div>
              </div>
              <div class="space-y-1">
                <label class="text-[11px] font-black text-gray-500 uppercase tracking-wider ml-1">Temporary Password *</label>
                <div class="relative group">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary transition-colors">
                    <i class="fas fa-lock text-xs"></i>
                  </span>
                  <input v-model="form.password" type="password" required placeholder="••••••••" class="custom-input !mt-0 !pl-10 h-11" />
                </div>
              </div>
              <div class="space-y-1">
                <label class="text-[11px] font-black text-gray-500 uppercase tracking-wider ml-1">Physical Address</label>
                <div class="relative group">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary transition-colors">
                    <i class="fas fa-map-marker-alt text-xs"></i>
                  </span>
                  <input v-model="form.address" type="text" placeholder="Addis Ababa, Ethiopia" class="custom-input !mt-0 !pl-10 h-11" />
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Privileged Flags</p>
            <div class="flex flex-wrap gap-8">
              <label class="flex items-center group cursor-pointer">
                <input type="checkbox" v-model="form.is_active" class="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary/20 transition-all" />
                <span class="ml-3 text-[11px] font-black text-gray-600 group-hover:text-primary uppercase tracking-widest transition-colors">Active</span>
              </label>
              
              <label class="flex items-center group cursor-pointer">
                <input type="checkbox" v-model="form.is_staff" class="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary/20 transition-all" />
                <span class="ml-3 text-[11px] font-black text-gray-600 group-hover:text-primary uppercase tracking-widest transition-colors">Staff Access</span>
              </label>

              <label class="flex items-center group cursor-pointer">
                <input type="checkbox" v-model="form.is_superuser" class="h-5 w-5 rounded border-gray-300 text-orange-600 focus:ring-orange-200 transition-all" />
                <span class="ml-3 text-[11px] font-black text-gray-600 group-hover:text-orange-600 uppercase tracking-widest transition-colors">Superuser</span>
              </label>
            </div>
          </div>
        </form>
      </div>

      <div class="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-4 shrink-0">
        <button
          type="button"
          @click="$emit('close')"
          class="px-6 py-2 text-[11px] font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-all"
        >
          Discard
        </button>
        <button
          form="addSuperStaffForm"
          type="submit"
          class="bg-gradient-to-r from-dprimary to-primary text-white font-black px-8 py-2.5 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 transform hover:scale-105 active:scale-95 text-[11px] uppercase tracking-[0.2em] flex items-center gap-2"
        >
          <i class="fas fa-save"></i>
          Register Staff
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
    // Step 1: Create the user
    const payload = { ...this.form };
    let res = null;
    try {
      res = await this.$apiPost("/post_user", payload);
      console.log("User created:", res);
    } catch (err) {
      console.error("Error creating user:", err);
      this.$root.$refs.toast.showToast(err.message || "Failed to create user", "error");
      return; // stop further execution if user creation fails
    }

    // Step 2: Assign user to group
    try {
      const groupPayload = {
        user_id: res.id,
        groups: ["super_staff"],
      };
      console.log("Assigning groups:", groupPayload);

      const resAssign = await this.$apiPost("/set_user_groups", groupPayload);

      if (resAssign) {
        this.$root.$refs.toast.showToast("Successfully created and assigned group", "success");
      }
    } catch (err) {
      console.error("Error assigning group:", err);
      this.$root.$refs.toast.showToast(err.message || "Failed to assign user group", "error");
    }

    // Step 3: Emit events regardless of success/failure in group assignment
    this.$emit("success"); // refresh parent
    this.$emit("close");   // close modal

  } catch (error) {
    console.error("Unexpected error in submitForm:", error);
    this.$root.$refs.toast.showToast(error.message || "Something went wrong", "error");
  }
}
,
  },
};
</script>

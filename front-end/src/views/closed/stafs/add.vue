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
              <h2 class="text-xl font-bold text-white tracking-tight">Add New Staff</h2>
              <p class="text-white/70 text-[10px] uppercase tracking-widest font-bold">Register System Personnel</p>
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
          <form id="staffForm" @submit.prevent="submitForm" class="space-y-8">
            
            <div class="space-y-4">
              <h3 class="text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b border-gray-100 pb-2">1. Workplace Assignment</h3>
              <div class="relative group">
                <label class="custom-label">Property Zone <span class="custom-star">*</span></label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary">
                    <i class="fas fa-map-marker-alt text-xs"></i>
                  </span>
                  <select
                    v-model="form.property_zone"
                    class="custom-input !mt-0 !pl-10 h-11 appearance-none"
                    required
                  >
                    <option disabled value="">Select Zone</option>
                    <option v-for="zone in zones" :key="zone.id" :value="zone.id">
                      {{ zone.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <h3 class="text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b border-gray-100 pb-2">2. Personal Profile</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="space-y-1">
                  <label class="custom-label">First Name <span class="custom-star">*</span></label>
                  <input v-model="form.first_name" type="text" placeholder="John" class="custom-input h-11" required />
                </div>
                <div class="space-y-1">
                  <label class="custom-label">Middle Name</label>
                  <input v-model="form.middle_name" type="text" placeholder="Quincy" class="custom-input h-11" />
                </div>
                <div class="space-y-1">
                  <label class="custom-label">Last Name <span class="custom-star">*</span></label>
                  <input v-model="form.last_name" type="text" placeholder="Doe" class="custom-input h-11" required />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1 group">
                  <label class="custom-label">Email Address <span class="custom-star">*</span></label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary">
                      <i class="fas fa-envelope text-xs"></i>
                    </span>
                    <input v-model="form.email" type="email" placeholder="staff@company.com" class="custom-input !pl-10 h-11" required />
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

              <div class="space-y-1">
                <label class="custom-label">Residential Address</label>
                <textarea v-model="form.address" rows="2" placeholder="Full physical address..." class="custom-input py-3 min-h-[80px]"></textarea>
              </div>
            </div>

            <div class="space-y-4">
              <h3 class="text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b border-gray-100 pb-2">3. Security Credentials</h3>
              <div class="relative group md:w-1/2">
                <label class="custom-label">System Password <span class="custom-star">*</span></label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary">
                    <i class="fas fa-lock text-xs"></i>
                  </span>
                  <input v-model="form.password" type="password" placeholder="••••••••" class="custom-input !pl-10 h-11" required />
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
            form="staffForm"
            type="submit"
            :disabled="loading"
            class="custom-button !w-auto !px-10 flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-user-check"></i>
            {{ loading ? "Processing..." : "Save Staff Member" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddManagerModal",
  props: {
    visible: Boolean,
  },
  data() {
    return {
      managerVisible: false,
      zones:[],
      form: {
        email: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        phone_number: "",
        address: "",
        property_zone: "",
        owner_id:localStorage.getItem('userId'),
        password: "",
        is_staff:true
      }
    };
  },
 async  mounted(){
  const result = await this.$getZones();
  this.zones=result.zones;
  console.log("zones",this.zones);
  },
  methods: {
   
    close() {
      this.resetForm();
      this.managerVisible = false;
    },
async submitForm() {
  console.log("this.form", this.form);

  try {
    const res = await this.$apiPost('/create_staff', this.form);
    console.log("res staff add", res);

    if (res) {
      this.$root.$refs.toast.showToast("Successfully registered", "success");
      // or if you prefer alert:
      // alert("Successfully registered");
       this.$emit('close')
      this.$emit('success')
     
    }

    this.resetForm();
    this.close();

  } catch (err) {
    console.error("Error registering staff:", err);
    this.$root.$refs.toast.showToast(err.message || "Failed to register", "error");
     this.$emit('close')
      
  } 
},

    resetForm() {
      this.form = {
        email: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        phone_number: "",
        address: "",
        owner_id:localStorage.getItem('userId'),
        property_zone: "",
        password: "",
      };
    }
  }
};
</script>

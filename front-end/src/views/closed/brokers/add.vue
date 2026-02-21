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
              <i class="fas fa-handshake text-white text-lg"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white tracking-tight">Add New Broker</h2>
              <p class="text-white/70 text-[10px] uppercase tracking-widest font-bold">Register Authorized Sales Representative</p>
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
          <form id="brokerForm" @submit.prevent="submitForm" class="space-y-8">
            
            <div class="space-y-4">
              <h3 class="text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b border-gray-100 pb-2">1. Personal Profile</h3>
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

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1 group">
                  <label class="custom-label">Email Address <span class="custom-star">*</span></label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary">
                      <i class="fas fa-envelope text-xs"></i>
                    </span>
                    <input v-model="form.email" type="email" placeholder="broker@example.com" class="custom-input !pl-10 h-11" required />
                  </div>
                </div>
                <div class="space-y-1 group">
                  <label class="custom-label">Phone Number</label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary">
                      <i class="fas fa-phone text-xs"></i>
                    </span>
                    <input v-model="form.phone_number" type="tel" placeholder="+251..." class="custom-input !pl-10 h-11" />
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-6">
              <h3 class="text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b border-gray-200 pb-2">2. Professional Details</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1 group">
                  <label class="custom-label">License Number <span class="custom-star">*</span></label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary">
                      <i class="fas fa-id-card text-xs"></i>
                    </span>
                    <input v-model="form.license_number" type="text" placeholder="BR-XXXXXX" class="custom-input !pl-10 h-11 bg-white" required />
                  </div>
                </div>

                <div class="space-y-1 group">
                  <label class="custom-label">Commission Rate (%) <span class="custom-star">*</span></label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary">
                      <i class="fas fa-percentage text-xs"></i>
                    </span>
                    <input v-model="form.commission_rate" type="text" placeholder="e.g. 5.0" class="custom-input !pl-10 h-11 bg-white" required />
                  </div>
                </div>

                <div class="space-y-1 group">
                  <label class="custom-label">Wallet ID / Address <span class="custom-star">*</span></label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary">
                      <i class="fas fa-wallet text-xs"></i>
                    </span>
                    <input v-model="form.wallet" type="text" placeholder="Transfer destination" class="custom-input !pl-10 h-11 bg-white" required />
                  </div>
                </div>

                <div class="space-y-1 group">
                  <label class="custom-label">System Password <span class="custom-star">*</span></label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary">
                      <i class="fas fa-lock text-xs"></i>
                    </span>
                    <input v-model="form.password" type="password" placeholder="••••••••" class="custom-input !pl-10 h-11 bg-white" required />
                  </div>
                </div>
              </div>

              <div class="pt-2">
                <label class="flex items-center gap-2 cursor-pointer group w-fit">
                  <input type="checkbox" v-model="form.is_active" class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span class="text-xs font-bold text-gray-600 uppercase tracking-wider group-hover:text-primary transition-colors">Broker Account Active</span>
                </label>
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
            form="brokerForm"
            type="submit"
            :disabled="loading"
            class="custom-button !w-auto !px-10 flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-user-tie"></i>
            {{ loading ? "Processing..." : "Create Broker Account" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from "@/components/Toast.vue";

export default {
  name: "AddUserBrokerModal",
  components: { Toast },
  props: { visible: Boolean },
  data() {
    return {
      form: {
        // User
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
        is_active: true,
        is_staff: false,
        is_superuser: false,
        is_broker:true,
        // Broker
        license_number: "",
        commission_rate: "",
        wallet: "",
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        // 1️⃣ Create User
        const userPayload = {
          first_name: this.form.first_name,
          middle_name: this.form.middle_name,
          last_name: this.form.last_name,
          email: this.form.email,
          phone_number: this.form.phone_number,
          password: this.form.password,
          is_active: this.form.is_active,
          is_staff: this.form.is_staff,
          is_superuser: this.form.is_superuser,
          is_broker:true
        };

        const userResponse = await this.$apiPost("/sign_up", userPayload);
        console.log("userResponse", userResponse);
        // const userId = userResponse.id; // make sure your API returns user ID
        // // 2️⃣ Create Broker with User ID
        // const brokerPayload = {
        //   license_number: this.form.license_number,
        //   commission_rate: this.form.commission_rate,
        //   wallet: this.form.wallet,
        //   user: userId,
        // };
        // await this.$apiPost("/post_broker_profile", brokerPayload);
        // this.$root.$refs.toast.showToast(
        //   "Broker added successfully",
        //   "success"
        // );
        setTimeout(() => {
          this.$emit("close");
          this.$emit("success"); // refresh parent
        }, 1500);
      } catch (error) {
        console.error("Error creating user/broker", error);
        this.$root.$refs.toast.showToast(
         error.message,
          "error"
        );
      }
    },
  },
};
</script>

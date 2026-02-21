<template>
  <div>
    <Toast ref="toast" />
    
    <transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
        @click.self="$emit('close')"
      >
        <div 
          class="bg-white w-full sm:max-w-[600px] md:max-w-[750px] lg:max-w-[850px] 
                 rounded-xl shadow-2xl overflow-hidden relative mx-auto transform transition-all animate-swing"
        >
          <div class="bg-gradient-to-r from-dprimary to-primary text-white px-6 py-5 flex justify-between items-center border-b border-white/10">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/10 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold tracking-tight">Permission Configuration</h3>
            </div>
            <button 
              @click="$emit('close')" 
              class="hover:bg-secondary p-1.5 rounded-full transition-all duration-300 hover:rotate-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitForm" class="p-6 md:p-8 modal-scroll">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div class="flex flex-col">
                <label class="custom-label">
                  Content Type <span class="custom-star">*</span>
                </label>
                <input 
                  v-model="form.content_type" 
                  type="number" 
                  class="custom-input"
                  placeholder="20"
                />
              </div>

              <div class="flex flex-col">
                <label class="custom-label">
                  Display Name <span class="custom-star">*</span>
                </label>
                <input 
                  v-model="form.name" 
                  type="text" 
                  class="custom-input"
                  placeholder="e.g. Management Access"
                />
              </div>

              <div class="flex flex-col md:col-span-2">
                <label class="custom-label">
                  Codename <span class="custom-star">*</span>
                </label>
                <input 
                  v-model="form.codename" 
                  type="text" 
                  class="custom-input"
                  placeholder="e.g. can_manage_users"
                />
              </div>
            </div>

            <div class="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end items-center gap-4">
              <button 
                type="button" 
                @click="$emit('close')" 
                class="w-full sm:w-auto px-6 py-2 text-gray-500 font-semibold hover:text-secondary transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="custom-button w-full sm:w-auto shadow-custom-blue"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="custom-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Save Permission
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Toast from '../../../components/Toast.vue';

export default {
  name: "AddPermission",
  props: {
    visible: Boolean,
  },
  components: { Toast },
  data() {
    return {
      form: {
        content_type: 20,
        name: '',
        codename: '',
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        await this.$apiPost("/post_permission", this.form);
        this.$root.$refs.toast.showToast('Permission saved successfully ', 'success');
        setTimeout(() => {
          this.$emit("close");
        }, 3000);
      } catch (error) {
        console.error("Error saving permission:", error);
        this.$root.$refs.toast.showToast(error.message, "error")
      }
    },
  },
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
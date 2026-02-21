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
              <div class="p-2 bg-white/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold tracking-tight">Edit Permission</h3>
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

          <form @submit.prevent="updateModalVisible = true" class="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div class="flex flex-col">
                <label class="custom-label">
                  Content Type <span class="custom-star">*</span>
                </label>
                <input 
                  v-model="form.content_type" 
                  type="number" 
                  class="custom-input"
                  placeholder="Enter content type ID"
                />
              </div>

              <div class="flex flex-col">
                <label class="custom-label">
                  Permission Name <span class="custom-star">*</span>
                </label>
                <input 
                  v-model="form.name" 
                  type="text" 
                  class="custom-input"
                  placeholder="e.g. Can View Reports"
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
                  placeholder="e.g. can_view_reports"
                />
              </div>
            </div>

            <div class="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end items-center gap-4">
              <button 
                type="button" 
                @click="$emit('close')" 
                class="w-full sm:w-auto px-6 py-2.5 text-gray-500 font-semibold hover:text-secondary transition-colors"
              >
                Cancel Changes
              </button>
              <button 
                type="submit" 
                class="custom-button w-full sm:w-auto shadow-custom-blue"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="custom-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Update Permission
              </button>
            </div>
          </form>
        </div>

        <ConfirmModal
          :visible="updateModalVisible"
          title="Confirm Update"
          :message="`Are you sure you want to update '${form?.name}'? These changes will take effect immediately.`"
          @cancel="updateModalVisible = false"
          @confirm="submitForm"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import Toast from '../../../components/Toast.vue';
import ConfirmModal from "@/components/ConfirmModal.vue";

export default {
  name: "UpdatePermission",
  components: { Toast, ConfirmModal },
  props: {
    visible: Boolean,
    permission: Object,
  },
  data() {
    return {
      form: {
        id: null,
        content_type: 20,
        name: '',
        codename: '',
      },
      updateModalVisible: false
    };
  },
  watch: {
    permission: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form = { ...newVal }; // clone to avoid direct mutation
        }
      }
    }
  },
  methods: {
    async submitForm() {
      this.updateModalVisible = false
      try {
        await this.$apiPut("/update_permission", this.form.id, this.form);
        this.$root.$refs.toast.showToast('Permission Updated successfully ', 'success');
        setTimeout(() => {
          this.$emit("close");
        }, 3000);
        this.$emit("refresh");
      } catch (error) {
        console.error("Error updating permission:", error);
        this.$root.$refs.toast.showToast(error.message, "error")
      }
    }
  }
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
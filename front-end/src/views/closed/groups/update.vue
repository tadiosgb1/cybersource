<template>
  <div>
    <Toast ref="toast" />
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div 
        class="bg-white max-w-2xl w-full rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100"
      >
        
        <div class="bg-gradient-to-r from-dprimary to-primary px-6 py-5 flex justify-between items-center shadow-md shrink-0">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-white/20 rounded-lg">
              <i class="fas fa-users-cog text-white text-lg"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white tracking-tight">Modify Group</h2>
              <p class="text-white/70 text-[10px] uppercase tracking-widest font-bold">Manage Security Role</p>
            </div>
          </div>
          <button @click="$emit('close')" class="w-8 h-8 flex items-center justify-center rounded-full bg-black/10 text-white hover:bg-white/20">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-8 modal-scroll">
          <form id="groupForm" @submit.prevent="updateModalVisible = true" class="space-y-6">
            
            <div class="space-y-1">
              <label class="custom-label">Group Name <span class="custom-star">*</span></label>
              <div class="relative group">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary">
                  <i class="fas fa-id-badge"></i>
                </span>
                <input v-model="form.name" type="text" class="custom-input !mt-0 !pl-10 h-12" required />
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <label class="custom-label !mb-0">Select Permissions</label>
                <span class="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {{ form.permissions.length }} Selected
                </span>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-inner">
                <label 
                  v-for="perm in availablePermissions" 
                  :key="perm.codename" 
                  class="relative flex items-center p-3 rounded-lg border transition-all cursor-pointer bg-white hover:border-primary/50"
                  :class="form.permissions.includes(perm.codename) ? 'bg-primary/5 border-primary/30' : 'border-gray-200'"
                >
                  <input
                    type="checkbox"
                    :value="perm.codename"
                    v-model="form.permissions"
                    class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                  />
                  <div class="ml-3">
                    <p class="text-xs font-bold text-gray-700 leading-tight">{{ perm.name }}</p>
                    <p class="text-[9px] font-mono text-gray-400 uppercase mt-0.5">{{ perm.codename }}</p>
                  </div>
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
            form="groupForm"
            type="submit"
            class="custom-button !w-auto !px-10 flex items-center gap-2"
          >
            <i class="fas fa-save"></i>
            Commit Changes
          </button>
        </div>
      </div>

      <ConfirmModal
        :visible="updateModalVisible"
        title="Confirm Security Update"
        :message="`Are you sure you want to update '${form?.name}'?`"
        @cancel="updateModalVisible = false"
        @confirm="submitForm"
      />
    </div>
  </div>
</template>

<script>
import Toast from "../../../components/Toast.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";

export default {
  name: "UpdateGroup",
  components: { Toast, ConfirmModal },
  props: {
    visible: Boolean,
    groupData: Object,
  },
  data() {
    return {
      form: {
        id: null,
        name: "",
        permissions: [],
      },
      availablePermissions: [],
      updateModalVisible: false,
    };
  },
  watch: {
    groupData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form.id = newVal.id;
          this.form.name = newVal.name;
          this.form.permissions = [...newVal.permissions];
        }
      },
    },
  },
  mounted() {
    this.fetchPermissions();
  },
  methods: {
    async fetchPermissions() {
      try {
        const response = await this.$apiGet("/get_permissions", {
          page_size: 1000,
        });
        this.availablePermissions = response.data || [];
      } catch (err) {
        console.error("Failed to fetch permissions:", err);
        this.availablePermissions = [];
      }
    },
    async submitForm() {
      this.updateModalVisible = false;
      try {
        const payload = {
          group_id: this.form.id,
          permissions: this.form.permissions,
        };

        console.log("payload", payload);
        // await this.$apiPut(`/update_group`, this.form.id, payload);

        await this.$apiPost(`/set_group_permissions`, payload);

        this.$root.$refs.toast.showToast(
          "Group updated successfully",
          "success"
        );
        this.$emit("updated");
        this.$emit("close");
      } catch (err) {
        console.error(err);
        //alert('Failed to update group. Please try again.');
        this.$root.$refs.toast.showToast(err.message, "error");
      }
    },
  },
};
</script>

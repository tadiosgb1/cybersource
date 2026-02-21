<template>
  <div>
    <Toast ref="toast" />
    
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300"
    >
      <div 
        class="bg-white max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden relative border border-gray-100 transform transition-all"
      >
        <div class="bg-gradient-to-r from-dprimary to-primary px-6 py-5 flex justify-between items-center shadow-md">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-white/20 rounded-lg">
              <i class="fas fa-users-cog text-white text-lg"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white tracking-tight">Create Access Group</h2>
              <p class="text-white/70 text-[10px] uppercase tracking-widest font-bold">New Security Role</p>
            </div>
          </div>
          <button 
            @click="$emit('close')" 
            class="w-8 h-8 flex items-center justify-center rounded-full bg-black/10 text-white hover:bg-white/20 transition-colors"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="p-8">
          <div class="space-y-6 max-h-[70vh] overflow-y-auto pr-2 modal-scroll">
            
            <div class="space-y-1">
              <label class="custom-label">
                Group Name <span class="custom-star">*</span>
              </label>
              <div class="relative group">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary">
                  <i class="fas fa-id-badge"></i>
                </span>
                <input 
                  v-model="form.name" 
                  type="text" 
                  class="custom-input !mt-0 !pl-10 h-12" 
                  placeholder="e.g. System Administrators"
                  required 
                />
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex justify-between items-end">
                <label class="custom-label !mb-0">Configure Permissions</label>
                <span class="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">
                  {{ form.permissions.length }} Selected
                </span>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 max-h-60 overflow-y-auto modal-scroll shadow-inner">
                <label 
                  v-for="perm in availablePermissions" 
                  :key="perm.codename" 
                  class="relative flex items-center p-3 rounded-lg border transition-all cursor-pointer group"
                  :class="form.permissions.includes(perm.codename) 
                    ? 'bg-primary/5 border-primary/30 shadow-sm' 
                    : 'bg-white border-gray-200 hover:border-primary/50'"
                >
                  <input
                    type="checkbox"
                    :value="perm.codename"
                    v-model="form.permissions"
                    class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary transition-all cursor-pointer"
                  />
                  <div class="ml-3">
                    <p class="text-xs font-bold text-gray-700 group-hover:text-primary transition-colors">
                      {{ perm.name }}
                    </p>
                    <p class="text-[9px] font-mono text-gray-400 uppercase leading-none mt-0.5">
                      {{ perm.codename }}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div class="mt-8 flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
            <button
              type="button"
              @click="$emit('close')"
              class="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="custom-button !w-auto !px-10 flex items-center gap-2"
            >
              <i class="fas fa-save"></i>
              Save Group
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from '../../../components/Toast.vue';

export default {
  name: "AddGroup",
  components:{Toast},
  props: {
    visible: Boolean,
  },
  data() {
    return {
      form: {
        name: '',
        permissions: []
      },
      availablePermissions: []
    };
  },
  mounted() {
    this.fetchPermissions();
  },
  methods: {
    async fetchPermissions() {
 const params={
        page_size:1000
      }

      try {
        const response = await this.$apiGet("/get_permissions",params);

        console.log("response permissions",response.data);

        this.availablePermissions = response.data || [];

        
      } catch (err) {
        console.error("Failed to fetch permissions:", err);
        this.availablePermissions = [];
      }
    },
    async submitForm() {
      try {
        const payload = {
          name: this.form.name,
          permissions: this.form.permissions        };



        console.log("permissions raw:", this.form.permissions);
        console.log("permissions type:", typeof this.form.permissions);
        console.log("Array.isArray:", Array.isArray(this.form.permissions));
        console.log("Converted:", Array.from(this.form.permissions));


        console.log("payload",payload);

        const response = await this.$apiPost("/post_group", payload);
        this.$root.$refs.toast.showToast('Group saved successfully', 'success');
        console.log("Group created:", response);
        this.$emit("close");
      } catch (err) {
        console.error("Failed to create group:", err);
        //alert("Failed to save group.");
         this.$root.$refs.toast.showToast(err.message,"error")
      } finally {
        this.form.name = '';
        this.form.permissions = [];
      }
    }
  }
};
</script>

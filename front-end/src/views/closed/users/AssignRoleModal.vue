<template>
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
    <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-pop-in border border-slate-100">
      
      <div class="h-2 w-full bg-gradient-to-r from-amber-400 to-primary"></div>

      <div class="p-8">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-2xl font-black text-slate-900 leading-none">Assign Role</h2>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 mt-2 flex items-center gap-2">
              <i class="fas fa-shield-alt"></i> Access Control Mapping
            </p>
          </div>
          <button @click="$emit('close')" class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-green-50 transition-all">
            <i class="fas fa-times text-xs"></i>
          </button>
        </div>

        <div class="mb-8 p-4 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100">
          <div class="w-12 h-12 rounded-xl bg-slate-900 text-primary flex items-center justify-center font-black">
            {{ user.username.charAt(0).toUpperCase() }}
          </div>
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Target User</p>
            <p class="text-sm font-black text-slate-700 uppercase tracking-tighter">{{ user.username }}</p>
          </div>
        </div>

        <form @submit.prevent="submitAssignment" class="space-y-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Select Security Role</label>
            <div class="relative group">
              <i class="fas fa-user-tag absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors text-xs"></i>
              <select 
                v-model="form.role_id" 
                required
                class="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:ring-0 focus:border-amber-400 outline-none transition-all text-sm font-bold text-slate-800 appearance-none cursor-pointer"
              >
                <option value="" disabled>Choose a role...</option>
                <option v-for="role in roles" :key="role.id" :value="role.id">
                  {{ role.name }}
                </option>
              </select>
              <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-[10px]"></i>
            </div>
            <p v-if="roles.length === 0 && !loadingRoles" class="text-[10px] text-red-400 font-bold mt-1 ml-1">
              No roles found in registry.
            </p>
          </div>

          <div class="flex gap-3 pt-4">
            <button 
              type="button" 
              @click="$emit('close')" 
              class="flex-1 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="loading || !form.role_id"
              class="flex-[2] bg-slate-900 hover:bg-amber-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-amber-500/10 active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <template v-if="!loading">
                Authorize Role <i class="fas fa-key text-[8px] group-hover:rotate-12 transition-transform"></i>
              </template>
              <template v-else>
                <div class="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              </template>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: { type: Object, required: true }
  },
  data() {
    return {
      loading: false,
      loadingRoles: false,
      roles: [],
      form: {
        user_id: this.user.id,
        role_id: ''
      }
    };
  },
  methods: {
    async fetchRoles() {
      this.loadingRoles = true;
      try {
        // Fetching from your existing roles endpoint
        const response = await this.$apiGet('/roles', { page_size: 100 });
        this.roles = response.data.data || [];
      } catch (e) {
        console.error("Error loading roles:", e);
      } finally {
        this.loadingRoles = false;
      }
    },
    async submitAssignment() {
      this.loading = true;
      try {
        // Sending the {user_id, role_id} payload
        const res = await this.$apiPost("/user-roles", this.form);
        if (res) {
          this.$root.$refs.toast.showToast('Role assigned successfully', 'success');
          this.$emit("assigned");
          this.$emit("close");
        }
      } catch (e) {
        console.error(e);
        this.$root.$refs.toast.showToast('Failed to assign role', 'error');
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchRoles();
  }
}
</script>

<style scoped>
@keyframes popIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-pop-in { animation: popIn 0.3s ease-out; }
</style>
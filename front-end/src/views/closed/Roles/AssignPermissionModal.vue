<template>
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
    <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-pop-in border border-slate-100">
      <div class="h-2 w-full bg-gradient-to-r from-indigo-400 to-primary"></div>

      <div class="p-8">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-2xl font-black text-slate-900 leading-none">Assign Permission</h2>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mt-2 flex items-center gap-2">
              <i class="fas fa-shield-alt"></i> Permission Mapping
            </p>
          </div>
          <button @click="$emit('close')" class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary">
            <i class="fas fa-times text-xs"></i>
          </button>
        </div>

        <div class="mb-8 p-4 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100">
          <div class="w-12 h-12 rounded-xl bg-slate-900 text-primary flex items-center justify-center font-black">
            {{ role.name.charAt(0).toUpperCase() }}
          </div>
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Role</p>
            <p class="text-sm font-black text-slate-700 uppercase tracking-tighter">{{ role.name }}</p>
          </div>
        </div>

        <form @submit.prevent="submitAssignment" class="space-y-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Select System Permission</label>
            <div class="relative group">
              <i class="fas fa-key absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors text-xs"></i>
              <select v-model="form.permission_id" required class="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-indigo-400 outline-none transition-all text-sm font-bold text-slate-800 appearance-none cursor-pointer">
                <option value="" disabled>Choose a permission...</option>
                <option v-for="p in permissions" :key="p.id" :value="p.id">{{ p.key }}</option>
              </select>
              <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-[10px]"></i>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button type="button" @click="$emit('close')" class="flex-1 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50">Cancel</button>
            <button type="submit" :disabled="loading || !form.permission_id" class="flex-[2] bg-slate-900 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
              <template v-if="!loading">Grant Permission <i class="fas fa-check-circle"></i></template>
              <template v-else><div class="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div></template>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { role: { type: Object, required: true } },
  data() {
    return {
      loading: false,
      permissions: [],
      form: { role_id: this.role.id, permission_id: '' }
    };
  },
  methods: {
    async fetchPermissions() {
      try {
        const response = await this.$apiGet('/permissions', { page_size: 100 });
        this.permissions = response.data.data || [];
      } catch (e) { console.error(e); }
    },
    async submitAssignment() {
      this.loading = true;
      try {
        // Correct endpoint for Role -> Permission mapping
        const res = await this.$apiPost("/role-permissions", this.form);
        if (res) {
          this.$root.$refs.toast.showToast('Permission granted', 'success');
          this.$emit("assigned");
          this.$emit("close");
        }
      } finally { this.loading = false; }
    }
  },
  mounted() { this.fetchPermissions(); }
}
</script>
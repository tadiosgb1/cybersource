<template>
  <div class="p-6 bg-slate-50 min-h-screen font-sans text-slate-800">
    <Loading :visible="loading" message="Decrypting Permission Profile..." />

    <div class="max-w-4xl mx-auto mb-6 flex items-center justify-between">
      <button 
        @click="$router.back()" 
        class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors group"
      >
        <i class="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
        Back to Registry
      </button>
      
      <div class="flex gap-2">
        <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-tighter border border-primary/20">
          Active Node
        </span>
      </div>
    </div>

    <div class="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
      <div class="bg-slate-900 p-8 md:p-12 text-white relative overflow-hidden">
        <div class="absolute top-0 right-0 p-8 opacity-10">
          <i class="fas fa-shield-alt text-9xl"></i>
        </div>
        
        <div class="relative z-10">
          <p class="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2">Permission Identifier</p>
          <h1 class="text-3xl md:text-4xl font-black font-mono tracking-tight lowercase">
            {{ item.key || '---' }}
          </h1>
        </div>
      </div>

      <div class="p-8 md:p-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          <div class="space-y-8">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Description</label>
              <p class="text-slate-700 font-bold leading-relaxed">
                {{ item.description || 'No description provided for this security key.' }}
              </p>
            </div>

            <div class="pt-6 border-t border-slate-50">
              <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Object ID (UUID)</label>
              <div class="flex items-center gap-3">
                <code class="bg-slate-50 px-3 py-2 rounded-xl text-xs text-slate-500 font-mono break-all border border-slate-100">
                  {{ item.id }}
                </code>
              </div>
            </div>
          </div>

          <div class="bg-slate-50 rounded-[2rem] p-8 space-y-6">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Owner ID</span>
              <span class="text-xs font-mono font-bold text-slate-600">{{ item.user_id || 'System' }}</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Created At</span>
              <span class="text-xs font-bold text-slate-600">{{ formatDate(item.created_at) }}</span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Updated</span>
              <span class="text-xs font-bold text-slate-600">{{ formatDate(item.updated_at) }}</span>
            </div>

            <div class="pt-4 mt-4 border-t border-slate-200/60">
              <div class="flex items-center gap-3 text-dprimary">
                <i class="fas fa-lock text-xs"></i>
                <span class="text-[9px] font-black uppercase tracking-widest">Enterprise Secured Key</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="bg-slate-50/50 p-6 border-t border-slate-100 flex justify-center gap-4">
         <p class="text-[10px] font-bold text-slate-400 italic">
           Alpha Message Integrator Architecture v3.0
         </p>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue";

export default {
  components: { Loading },
  data() {
    return {
      item: {},
      loading: false,
    };
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },
  async mounted() {
    this.loading = true;
    const id = this.$route.params.id;
    try {
      const response = await this.$apiGetById('/permissions', id);
      this.item = response.data || response || {};
    } catch (error) {
      console.error("Detail Fetch Error:", error);
      this.$root.$refs.toast?.showToast('Error loading permission details', 'error');
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
/* Only keeping the animation as it's likely not in your global tailwind.config */
@keyframes popIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-pop-in { animation: popIn 0.3s ease-out; }
</style>
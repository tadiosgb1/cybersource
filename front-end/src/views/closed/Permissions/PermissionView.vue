<template>
  <div class="p-6 bg-slate-50 min-h-screen font-sans text-slate-800 relative">
    <Loading :visible="loading" message="Syncing Permissions..." />

    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight">System Permissions</h1>
        <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
           <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
           Access Control Registry
        </p>
      </div>
      
      <button 
        @click="openAddModal" 
        class="bg-primary hover:bg-dprimary text-slate-900 px-6 py-4 rounded-2xl font-black shadow-lg shadow-primary/20 flex items-center justify-center space-x-2 text-[10px] uppercase tracking-widest transition-all active:scale-95"
      >
        <i class="fas fa-plus-circle text-sm"></i>
        <span>Create Permission</span>
      </button>
    </div>

    <div class="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="relative flex-1 max-w-md group">
        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors text-xs"></i>
        <input 
          v-model="searchQuery" 
          @input="fetchItems(1)" 
          type="text" 
          placeholder="Filter by key or description..."
          class="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/10 outline-none text-[13px] font-bold text-slate-700 transition-all placeholder:text-slate-300" 
        />
      </div>
      
      <div class="flex items-center gap-4 px-2">
        <div class="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
          <label>View Count</label>
          <select v-model="pageSize" @change="fetchItems(1)" class="bg-slate-50 border-none rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-primary text-slate-700 font-bold outline-none cursor-pointer">
            <option v-for="size in [5,10,20,50,100]" :key="size" :value="size">{{ size }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden hidden md:block">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-100">
            <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Key (Identifier)</th>
            <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
            <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
            <th class="px-8 py-5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="item in items" :key="item.id" class="hover:bg-slate-50/80 transition-colors group">
            <td class="px-8 py-5">
              <span class="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-[10px] font-black font-mono border border-slate-200 group-hover:border-primary/40 group-hover:text-primary transition-all">
                {{ item.key }}
              </span>
            </td>
            <td class="px-8 py-5 text-xs font-bold text-slate-600 uppercase tracking-tighter">{{ item.description }}</td>
            <td class="px-8 py-5 text-[10px] text-slate-400 font-mono tracking-tighter">{{ formatDate(item.created_at) }}</td>
            <td class="px-8 py-5">
              <div class="flex items-center justify-center gap-1">
               <button @click="editItem(item)" title="Edit Logic" class="w-9 h-9 flex items-center justify-center rounded-xl text-slate-300 hover:text-dprimary hover:bg-primary/10 transition-all"><i class="fas fa-edit text-sm"></i></button>
                <button @click="openDeleteModal(item.id)" title="Revoke Key" class="w-9 h-9 flex items-center justify-center rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"><i class="fas fa-trash-alt text-sm"></i></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="items.length === 0" class="py-24 text-center">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-full mb-4">
            <i class="fas fa-shield-alt text-slate-200 text-3xl"></i>
        </div>
        <p class="text-slate-400 font-black uppercase tracking-widest text-[10px]">Registry is empty</p>
      </div>
    </div>

    <div class="md:hidden space-y-4">
      <div v-for="item in items" :key="item.id" class="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <span class="bg-primary/10 text-primary px-3 py-1 rounded-lg text-[10px] font-black font-mono uppercase tracking-tighter">
            {{ item.key }}
          </span>
          <div class="flex gap-2">
             <button @click="editItem(item)" class="w-9 h-9 flex items-center justify-center bg-slate-50 rounded-xl text-slate-400 active:bg-primary/10 active:text-primary"><i class="fas fa-edit text-xs"></i></button>
             <button @click="openDeleteModal(item.id)" class="w-9 h-9 flex items-center justify-center bg-slate-50 rounded-xl text-slate-400 active:bg-red-50 active:text-red-500"><i class="fas fa-trash text-xs"></i></button>
          </div>
        </div>
        <p class="text-slate-600 font-bold text-sm leading-relaxed mb-4">{{ item.description }}</p>
        <div class="pt-4 border-t border-slate-50 flex justify-between items-center">
          <span class="text-[9px] text-slate-300 font-mono">{{ formatDate(item.created_at) }}</span>
          <button @click="viewDetails(item.id)" class="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View Profile</button>
        </div>
      </div>
    </div>

    <div class="flex flex-col md:flex-row items-center justify-between mt-10 gap-6">
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
        Showing {{ items.length }} of {{ count }} system keys
      </p>
      <div class="flex items-center gap-3">
        <button 
          @click="fetchItems(currentPage - 1)" 
          :disabled="!previousPage"
          class="w-12 h-12 flex items-center justify-center rounded-2xl border-2 border-slate-100 bg-white text-slate-400 hover:border-primary hover:text-primary disabled:opacity-20 transition-all shadow-sm"
        >
          <i class="fas fa-chevron-left text-xs"></i>
        </button>
        <div class="px-6 h-12 flex items-center justify-center rounded-2xl bg-white border-2 border-slate-100 shadow-sm">
            <span class="text-xs font-black text-slate-900 tracking-widest">{{ currentPage }}</span>
        </div>
        <button 
          @click="fetchItems(currentPage + 1)" 
          :disabled="!nextPage"
          class="w-12 h-12 flex items-center justify-center rounded-2xl border-2 border-slate-100 bg-white text-slate-400 hover:border-primary hover:text-primary disabled:opacity-20 transition-all shadow-sm"
        >
          <i class="fas fa-chevron-right text-xs"></i>
        </button>
      </div>
    </div>

    <add-permission v-if="showModal && !editMode" :data="selectedItem" @close="showModal=false" @saved="fetchItems"/>
    <edit-permission v-if="showModal && editMode" :data="selectedItem" @close="showModal=false" @saved="fetchItems"/>

    <delete-confirm-modal 
      :visible="deleteModalVisible"
      title="Revoke Permission"
      message="Removing this key will immediately interrupt access for associated integrations."
      @confirm="confirmDelete"
      @cancel="deleteModalVisible=false"
    />
  </div>
</template>

<script>
import AddPermission from "./AddPermission.vue";
import EditPermission from "./EditPermission.vue";
import Loading from "@/components/Loading.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";

export default {
  components: { AddPermission, EditPermission, Loading, DeleteConfirmModal },
  data() {
    return {
      items: [],
      count: 0,
      nextPage: null,
      previousPage: null,
      currentPage: 1,
      pageSize: 10,
      searchQuery: "",
      showModal: false,
      editMode: false,
      selectedItem: null,
      loading: false,
      deleteModalVisible: false,
      deleteId: null,
    };
  },
  methods: {
    formatDate(dateString) {
      if(!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });
    },
    async fetchItems(page = 1) {
      this.loading = true;
      this.currentPage = page;
      const params = { page: this.currentPage, page_size: this.pageSize, search: this.searchQuery };
      try {
        const response = await this.$apiGet('/permissions', params);
        // Direct assignment using your standard API structure
        this.items = response.data || []; 
        this.count = response.count || 0;
        this.nextPage = response.next;
        this.previousPage = response.previous;
      } catch(e) { 
        console.error("Fetch Error:", e); 
      } finally { 
        this.loading = false; 
      }
    },
    openAddModal() { this.editMode = false; this.selectedItem = null; this.showModal = true; },
    editItem(item) { this.editMode = true; this.selectedItem = item; this.showModal = true; },
    viewDetails(id) { this.$router.push({ name: 'Permission-detail', params: { id } }); },
    openDeleteModal(id) { this.deleteId = id; this.deleteModalVisible = true; },
    async confirmDelete() {
      const res = await this.$apiDelete('/permission', this.deleteId);
      if(res) {
        this.$root.$refs.toast.showToast('Permission Revoked Successfully', 'success');
      }
      this.deleteModalVisible = false;
      this.fetchItems(this.currentPage);
    },
  },
  mounted() { this.fetchItems(); }
};
</script>

<style scoped>
/* No manual colors defined here - using global tailwind classes only */
</style>
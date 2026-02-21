<template>
  <div class="min-h-screen bg-background p-4 md:p-2">
    <Toast ref="toast" />
    <Loading :visible="loading" message="Syncing Tenant Directory..." />

    <div class="max-w-7xl mx-auto bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
      
      <div class="bg-gradient-to-r from-dprimary to-primary px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-4">
          <div class="bg-white/20 p-2.5 rounded-xl backdrop-blur-md text-white">
            <i class="fas fa-users text-2xl"></i>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white tracking-tight">Tenant Management</h1>
            <p class="text-white/70 text-[10px] uppercase tracking-widest font-black">Resident Profiles & Occupancy Status</p>
          </div>
        </div>

        <button
          @click="addTenantVisible = true"
          class="bg-white text-primary hover:bg-gray-50 font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <i class="fas fa-plus-circle"></i> Add Tenant
        </button>
      </div>

      <div class="p-6 border-b border-gray-50 flex flex-col lg:flex-row gap-4 items-center justify-between bg-white">
        <div class="relative w-full max-w-xl group">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary transition-colors">
            <i class="fas fa-search text-sm"></i>
          </span>
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search by name, email, phone, or property..."
            class="custom-input !mt-0 !pl-10 h-11 shadow-sm border-gray-200 focus:border-primary"
          />
        </div>

        <div class="flex items-center gap-3 self-end lg:self-center">
          <span class="text-[11px] font-black text-gray-400 uppercase tracking-widest">Show</span>
          <select
            v-model="pageSize"
            @change="fetchTenants()"
            class="bg-gray-50 border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
          >
            <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
          </select>
          <span class="text-[11px] font-black text-gray-400 uppercase tracking-widest">Residents</span>
        </div>
      </div>

      <div class="hidden lg:block overflow-x-auto">
        <table class="w-full divide-y divide-gray-100">
          <thead class="bg-gray-50/50">
            <tr class="text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">
              <th class="px-6 py-5 cursor-pointer hover:text-primary transition-colors" @click="sortBy('id')">
                ID <SortIcon :field="'id'" :sort-key="sortKey" :sort-asc="sortAsc" />
              </th>
              <th class="px-6 py-5">Tenant Identity</th>
              <th class="px-6 py-5">Property & Contact</th>
              <th class="px-6 py-5 text-center">Status</th>
              <th class="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="tenant in tenants" :key="tenant.id" class="hover:bg-primary/5 transition-all group">
              <td class="px-6 py-4 text-xs font-bold text-gray-400">#{{ tenant.id }}</td>
              
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20 uppercase">
                    {{ tenant.first_name[0] }}{{ tenant.last_name[0] }}
                  </div>
                  <div>
                    <div class="text-sm font-black text-gray-800 tracking-tight">{{ formatFullName(tenant) }}</div>
                    <div class="flex gap-1 mt-1">
                      <span v-for="g in tenant.groups" :key="g" class="px-1.5 py-0.5 bg-gray-100 text-[8px] font-black text-gray-500 uppercase rounded border border-gray-200">
                        {{ g }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <div class="flex flex-col gap-1">
                  <div class="text-xs font-bold text-gray-700 flex items-center gap-2">
                    <i class="fas fa-building text-primary/40 text-[10px]"></i>
                    {{ tenant.property_id?.name || 'Unassigned' }}
                  </div>
                  <div class="text-[10px] text-gray-400 font-medium italic">
                    {{ tenant.email }} • {{ tenant.phone_number }}
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 text-center">
                <span 
                  :class="tenant.is_active ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'"
                  class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
                >
                  {{ tenant.is_active ? 'Active' : 'Inactive' }}
                </span>
                <div class="text-[8px] text-gray-400 font-bold uppercase mt-1 tracking-tighter">Joined {{ formatDate(tenant.date_joined) }}</div>
              </td>

              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <button @click="goToDetail(tenant.id)" 
                    class="h-8 px-3 flex items-center gap-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all text-[11px] font-bold uppercase tracking-wider shadow-sm border border-blue-100">
                    <i class="fas fa-eye"></i> Details
                  </button>
                  
                  <button v-if="!tenant.is_active" @click="askConfirmation('activate', tenant.id)"
                    class="h-8 w-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all border border-green-100 shadow-sm">
                    <i class="fas fa-check text-xs"></i>
                  </button>
                  <button v-else @click="askConfirmation('deactivate', tenant.id)"
                    class="h-8 w-8 flex items-center justify-center rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition-all border border-orange-100 shadow-sm">
                    <i class="fas fa-power-off text-xs"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="tenants.length === 0">
              <td colspan="5" class="text-center py-12 text-gray-400 text-xs font-bold uppercase tracking-widest">
                No tenants matching your search.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="lg:hidden p-4 space-y-4">
        <div v-for="tenant in tenants" :key="tenant.id" class="bg-gray-50 border border-gray-100 rounded-2xl p-5">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-black text-gray-800 text-sm tracking-tight">{{ formatFullName(tenant) }}</h3>
            <span :class="tenant.is_active ? 'text-green-600 bg-green-100 border-green-200' : 'text-red-600 bg-red-100 border-red-200'" class="text-[9px] font-black uppercase px-2 py-1 rounded-md border">
              {{ tenant.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>
          
          <div class="space-y-2 mb-4">
            <p class="text-[11px] text-gray-600 flex items-center gap-2">
              <i class="fas fa-building text-primary/50 w-4"></i> 
              <span class="font-bold">Property:</span> {{ tenant.property_id?.name || 'N/A' }}
            </p>
            <p class="text-[11px] text-gray-500 flex items-center gap-2 italic">
              <i class="fas fa-envelope text-gray-300 w-4"></i> {{ tenant.email }}
            </p>
          </div>

          <div class="flex gap-2 pt-4 border-t border-gray-200/60">
            <button @click="goToDetail(tenant.id)" class="flex-1 py-2 bg-white border border-gray-200 rounded-lg text-center text-[10px] font-black text-gray-600 uppercase tracking-widest shadow-sm">Details</button>
            <button 
              @click="tenant.is_active ? askConfirmation('deactivate', tenant.id) : askConfirmation('activate', tenant.id)"
              :class="tenant.is_active ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-green-50 text-green-600 border-green-100'"
              class="px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-colors shadow-sm"
            >
              {{ tenant.is_active ? 'Disable' : 'Enable' }}
            </button>
          </div>
        </div>
      </div>

      <div class="bg-gray-50/50 px-6 py-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Page {{ currentPage }} / {{ totalPages }}</p>
        <div class="flex gap-2">
          <button :disabled="!previous" @click="fetchTenants(previous)" class="px-5 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase text-gray-400 hover:text-primary disabled:opacity-30 transition-all shadow-sm">Prev</button>
          <button :disabled="!next" @click="fetchTenants(next)" class="px-5 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase text-gray-400 hover:text-primary disabled:opacity-30 transition-all shadow-sm">Next</button>
        </div>
      </div>
    </div>

    <ConfirmModal :visible="showConfirm" :title="confirmTitle" :message="confirmMessage" @cancel="showConfirm = false" @confirm="confirmAction" />
    <addTenant v-if="addTenantVisible" :visible="addTenantVisible" @close="addTenantVisible = false" @success="fetchTenants" />
  </div>
</template>


<script>
import ConfirmModal from "@/components/ConfirmModal.vue";
import Toast from "@/components/Toast.vue";
import addTenant from './add.vue'
import Loading from "@/components/Loading.vue";
const SortIcon = {
  props: ["field", "sortKey", "sortAsc"],
  template: `<span class="inline-block ml-1 text-gray-500">
    <svg v-if="sortKey !== field" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
    </svg>
    <svg v-else-if="sortAsc" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 13l4 4 4-4m0-6l-4-4-4 4"/>
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
    </svg>
  </span>`,
};

export default {
  name: "TenantView",
  components: { SortIcon, ConfirmModal, Toast,addTenant ,Loading},
  data() {
    return {
      addTenantVisible:false,
      searchTerm: "",
      tenants: [],
      sortKey: "id",
      sortAsc: true,
      // Pagination
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
      pageSize: 10,
      pageSizes: [5, 10, 20, 50, 100],

      confirmVisible: false,
      tenantToDelete: null,

       showConfirm: false,
    selectedUser: null,
    selectedAction: null, // 'activate' or 'deactivate'
    loading:false,
    };
  },
 computed: {
  filteredAndSortedTenants() {
    const term = this.searchTerm.toLowerCase();
    let filtered = this.tenants.filter((t) => {
      const u = t.user_id || {}; // make it safe
      return (
        String(u.id).includes(term) ||
        this.formatFullName(u).toLowerCase().includes(term) ||
        (u.email || "").toLowerCase().includes(term) ||
        (u.phone_number || "").toLowerCase().includes(term) ||
        (u.groups || []).some((g) => g.toLowerCase().includes(term))
      );
    });

    filtered.sort((a, b) => {
      const uA = a.user_id || {};
      const uB = b.user_id || {};
      let res = 0;
      if (uA[this.sortKey] < uB[this.sortKey]) res = -1;
      if (uA[this.sortKey] > uB[this.sortKey]) res = 1;
      return this.sortAsc ? res : -res;
    });

    return filtered;
  },
   confirmTitle() {
    return this.selectedAction === "activate"
      ? "Activate User"
      : "Deactivate User";
  },
  confirmMessage() {
    return this.selectedAction === "activate"
      ? "Are you sure you want to activate this user?"
      : "Are you sure you want to deactivate this user?";
  },
},
watch: {
  searchTerm() {
    this.fetchTenants();
  }
},

  mounted() {
    this.fetchTenants();
  },
  methods: {
   askConfirmation(action, id) {
    this.selectedUser = id;
    this.selectedAction = action;
    this.showConfirm = true;
  },
  confirmAction() {
    if (!this.selectedUser || !this.selectedAction) return;

    if (this.selectedAction === "activate") {
      this.$apiPost(`/activate_user/${this.selectedUser}`, { id: this.selectedUser })
        .then(() => {
          this.$root.$refs.toast.showToast("User activated successfully", "success");
          this.fetchUsers(this.pagination.current_page);
        });
    } else {
      this.$apiDelete(`/deactivate_user`, this.selectedUser)
        .then(() => {
          this.$root.$refs.toast.showToast("User deactivated successfully", "success");
          this.fetchUsers(this.pagination.current_page);
        });
    }

    this.showConfirm = false;
  },
       activateUser(id) {
      this.$apiPost(`/activate_user/${id}`, { id }).then(() => {
        this.$root.$refs.toast.showToast("User activated successfully", "success");
        this.fetchUsers(this.pagination.current_page);
      });
    },

    deactivateUser(id) {
      this.$apiDelete(`/deactivate_user`, id).then(() => {
        this.$root.$refs.toast.showToast("User deactivated successfully", "success");
        this.fetchUsers(this.pagination.current_page);
      });
    },

   

    goToDetail(id) {
      this.$router.push(`/user_detail/${id}`);
    },

    async fetchTenants(url) {
      this.loading=true;
      try {
       // const pageUrl = url || `/get_tenants?page=1&page_size=${this.pageSize}`;

        const response = await this.$getTenants(  url,
      this.pageSize,
      this.searchTerm);
        console.log("response", response);
        this.tenants = response.tenants || response.data || [];
        this.currentPage = response.currentPage || 1;
        this.totalPages = response.totalPages || 1;
        this.next = response.next || null;
        this.previous = response.previous || null;
      } catch (error) {
        console.error("Failed to fetch tenants:", error);
        this.tenants = [];
        this.currentPage = 1;
        this.totalPages = 1;
        this.next = null;
        this.previous = null;
        alert("Failed to load tenants. Please try again later.");
      }finally{
        this.loading=false;
      }
    },
    sortBy(key) {
      if (this.sortKey === key) this.sortAsc = !this.sortAsc;
      else ((this.sortKey = key), (this.sortAsc = true));
    },
    formatDate(dateStr) {
      if (!dateStr) return "";
      return new Date(dateStr).toLocaleDateString();
    },
    formatFullName(tenant) {
      return [tenant.first_name, tenant.middle_name, tenant.last_name]
        .filter(Boolean)
        .join(" ");
    },
    editTenant(tenant) {
      alert(`Edit tenant ${tenant.id} (you can add modal here)`);
    },
    askDeleteConfirmation(tenant) {
      this.tenantToDelete = tenant;
      this.confirmVisible = true;
    },
    async confirmDelete() {
      this.confirmVisible = false;
      try {
        const response = await this.$apiDelete(
          `/delete_tenant/${this.tenantToDelete.id}`
        );
        this.$refs.toast.showToast(response.message, "success");
        this.fetchTenants();
      } catch (error) {
        alert("Failed to delete tenant.");
        console.error(error);
      }
      this.tenantToDelete = null;
    },
  },
};
</script>

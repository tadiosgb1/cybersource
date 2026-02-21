<template>
  <div class="min-h-screen bg-background p-4 md:p-2">
    <Toast ref="toast" />
    <Loading :visible="loading" message="Syncing Owner Directory..." />

    <div class="max-w-7xl mx-auto bg-white rounded-xl overflow-hidden border border-gray-100">
      
      <div class="bg-gradient-to-r from-dprimary to-primary px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-4">
          <div class="bg-white/20 p-2.5 rounded-xl backdrop-blur-md text-white">
            <i class="fas fa-id-badge text-2xl"></i>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white tracking-tight">Owner Management</h1>
            <p class="text-white/70 text-[10px] uppercase tracking-widest font-black">Entity & Property Ownership</p>
          </div>
        </div>

        <button
          v-if="showAdd"
          @click="visible = true"
          class="bg-white text-primary hover:bg-gray-50 font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <i class="fas fa-plus-circle"></i> Add New Owner
        </button>
      </div>

      <div class="p-6 border-b border-gray-50 bg-white">
        <div class="relative w-full max-w-xl group">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary transition-colors">
            <i class="fas fa-search text-sm"></i>
          </span>
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search owners by name, email, or contact..."
            class="custom-input !mt-0 !pl-10 h-11 shadow-sm border-gray-200 focus:border-primary"
          />
        </div>
      </div>

      <div class="hidden md:block overflow-x-auto">
        <table class="w-full divide-y divide-gray-100">
          <thead class="bg-gray-50/50">
            <tr class="text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">
              <th class="px-6 py-5 cursor-pointer hover:text-primary transition-colors" @click="sortBy('full_name')">
                Owner Identity 
                <SortIcon :field="'full_name'" :sort-key="sortKey" :sort-asc="sortAsc" />
              </th>
              <th class="px-6 py-5">Contact Details</th>
              <th class="px-6 py-5 text-center">Status</th>
              <th class="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="owner in owners" :key="owner.id" class="hover:bg-primary/5 transition-all group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20 uppercase">
                    {{ owner.full_name?.split(' ').map(n => n[0]).join('') }}
                  </div>
                  <div>
                    <div class="text-sm font-black text-gray-800 tracking-tight">
                      {{ owner.full_name }}
                    </div>
                    <div class="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Owner ID: #{{ owner.id }}</div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 text-sm font-medium text-gray-600">
                 <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-2 text-xs">
                    <i class="fas fa-envelope text-[10px] text-gray-300"></i> {{ owner.email }}
                  </div>
                  <div class="flex items-center gap-2 text-xs">
                    <i class="fas fa-phone text-[10px] text-gray-300"></i> {{ owner.phoneNumber }}
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 text-center">
                <span 
                  :class="owner.is_active ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'"
                  class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                >
                  {{ owner.is_active ? "Active" : "Inactive" }}
                </span>
              </td>

              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <button @click="goToDetail(owner.id)" class="h-8 px-3 flex items-center gap-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all text-[11px] font-bold uppercase tracking-wider">
                    <i class="fas fa-info-circle"></i> Details
                  </button>
                  
                  <button 
                    v-if="!owner.is_active" 
                    @click="askConfirmation('activate', owner.id)"
                    class="h-8 w-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all"
                  >
                    <i class="fas fa-check-circle text-xs"></i>
                  </button>
                  <button 
                    v-else 
                    @click="askConfirmation('deactivate', owner.id)"
                    class="h-8 w-8 flex items-center justify-center rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition-all"
                  >
                    <i class="fas fa-ban text-xs"></i>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="owners.length === 0">
              <td colspan="4" class="text-center py-12 text-gray-400 italic text-sm">
                No owners found matching your criteria.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="md:hidden p-4 space-y-4 bg-gray-50/50">
        <div v-for="owner in owners" :key="owner.id" class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                {{ owner.full_name[0] }}
              </div>
              <h3 class="font-black text-gray-800 tracking-tight text-sm">{{ owner.full_name }}</h3>
            </div>
            <span :class="owner.is_active ? 'text-green-600 bg-green-100 border-green-200' : 'text-orange-600 bg-orange-100 border-orange-200'" class="text-[9px] font-black uppercase px-2 py-1 rounded-md border">
              {{ owner.is_active ? "Active" : "Inactive" }}
            </span>
          </div>
          
          <div class="space-y-1 mb-4">
            <p class="text-[10px] text-gray-600 flex items-center gap-2"><i class="fas fa-envelope text-gray-300 w-4"></i> {{ owner.email }}</p>
            <p class="text-[10px] text-gray-600 flex items-center gap-2"><i class="fas fa-phone text-gray-300 w-4"></i> {{ owner.phoneNumber }}</p>
          </div>

          <div class="flex gap-2 pt-3 border-t border-gray-100">
            <button @click="goToDetail(owner.id)" class="flex-1 py-2 bg-white border border-gray-200 rounded-lg text-[11px] font-black text-gray-600 uppercase tracking-widest shadow-sm">Details</button>
            <button 
              @click="owner.is_active ? askConfirmation('deactivate', owner.id) : askConfirmation('activate', owner.id)"
              :class="owner.is_active ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-green-50 text-green-600 border-green-100'"
              class="px-4 rounded-lg text-[10px] font-black uppercase tracking-widest border"
            >
              {{ owner.is_active ? 'Disable' : 'Enable' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <AddOwner v-if="visible" :visible="visible" @close="visible = false" @saved="fetchOwners" />
    <UpdateOwner v-if="updateVisible" :visible="updateVisible" :ownerData="selectedOwner" @close="updateVisible = false" @updated="fetchOwners" />
    <ConfirmModal :visible="showConfirm" :title="confirmTitle" :message="confirmMessage" @cancel="showConfirm = false" @confirm="confirmAction" />
  </div>
</template>
<script>
import Toast from '../../../components/Toast.vue';
import AddOwner from './add.vue';
import UpdateOwner from './edit.vue';
import ConfirmModal from "@/components/ConfirmModal.vue";
import Loading from "@/components/Loading.vue"; // <-- Added Loading

const SortIcon = {
  props: ['field', 'sortKey', 'sortAsc'],
  template: `
    <span class="inline-block ml-1 text-gray-500">
      <svg v-if="sortKey !== field" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
      </svg>
      <svg v-else-if="sortAsc" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 13l4 4 4-4m0-6l-4-4-4 4"/>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
      </svg>
    </span>
  `
};

export default {
  name: 'OwnersView',
  components: { SortIcon, AddOwner, UpdateOwner, Toast,ConfirmModal,Loading },
  data() {
    return {
      searchTerm: '',
      visible: false,
      updateVisible: false,
      selectedOwner: null,
      sortKey: 'full_name',
      sortAsc: true,
      owners: [],
      groupPermissions:"",
      ordering:"-id",

      showConfirm: false,
    selectedUser: null,
    selectedAction: null, // 'activate' or 'deactivate'
     loading: false,
    };
  },
  // computed: {
  //   filteredAndSortedOwners() {
  //     const term = this.searchTerm.toLowerCase();
  //     let filtered = this.owners.filter(o =>
  //       o.full_name.toLowerCase().includes(term)
  //     );
  //     filtered.sort((a, b) => {
  //       let res = 0;
  //       if (a[this.sortKey] < b[this.sortKey]) res = -1;
  //       if (a[this.sortKey] > b[this.sortKey]) res = 1;
  //       return this.sortAsc ? res : -res;
  //     });
  //     return filtered;
  //   }
  // },
async   mounted() {
    this.fetchOwners();
    const payload={
     group:'owner'
    }
     const response = await this.$apiGetById('/get_group_permissions',payload);
      console.log("response owners",response)

  },
  computed: {
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
          this.fetchOwners();
        });
    } else {
      this.$apiDelete(`/deactivate_user`, this.selectedUser)
        .then(() => {
          this.$root.$refs.toast.showToast("User deactivated successfully", "success");
          this.fetchOwners();
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
    async fetchOwners() {
       this.loading = true;
      try {
        const response = await this.$apiGet(`/get_owners?search=${this.searchTerm}&ordering=${this.ordering}`);

        this.owners = response.owners || [];

        console.log("owners",response);

      } catch (error) {
        console.error('Failed to fetch owners:', error);
        this.owners = [];
        alert('Failed to load owners. Please try again later.');
      }finally{
        this.loading=false;
      }
    },
    sortBy(key) {
      this.sortKey === key ? (this.sortAsc = !this.sortAsc) : ((this.sortKey = key), (this.sortAsc = true));
    },
    editOwner(owner) {
      this.selectedOwner = { ...owner };
      this.updateVisible = true;
    },
    async deleteOwner(owner) {
      if (confirm(`Are you sure you want to delete "${owner.full_name}"?`)) {
        try {
          await this.$apiDelete(`/delete_owner/${owner.id}`);
          this.$root.$refs.toast.showToast('Owner deleted successfully', 'success');
          this.owners = this.owners.filter(o => o.id !== owner.id);
        } catch (err) {
          console.error(err);
          alert('Failed to delete owner.');
        }
      }
    }
  }
};
</script>

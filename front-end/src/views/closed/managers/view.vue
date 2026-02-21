<template>
  <div class="min-h-screen bg-background p-4 md:p-2">
    <Toast ref="toast" />
    <Loading :visible="loading" message="Syncing Manager Directory..." />

    <div class="max-w-7xl mx-auto bg-white rounded-xl overflow-hidden border border-gray-100 ">
      
      <div class="bg-gradient-to-r from-dprimary to-primary px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-4">
          <div class="bg-white/20 p-2.5 rounded-xl backdrop-blur-md text-white">
            <i class="fas fa-user-tie text-2xl"></i>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white tracking-tight">Manager Management</h1>
            <p class="text-white/70 text-[10px] uppercase tracking-widest font-black">Entity Administrators & Supervisors</p>
          </div>
        </div>

        <button
          @click="showAddManager = true"
          class="bg-white text-primary hover:bg-gray-50 font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <i class="fas fa-plus-circle"></i> Add Manager
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
            placeholder="Search managers by name, email, or owner..."
            class="custom-input !mt-0 !pl-10 h-11 shadow-sm border-gray-200 focus:border-primary"
          />
        </div>

        <div class="flex items-center gap-3 self-end lg:self-center">
          <span class="text-[11px] font-black text-gray-400 uppercase tracking-widest">Show</span>
          <select
            v-model="pageSize"
            @change="fetchManagers()"
            class="bg-gray-50 border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
          >
            <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
          </select>
          <span class="text-[11px] font-black text-gray-400 uppercase tracking-widest">Entries</span>
        </div>
      </div>

      <div class="hidden md:block overflow-x-auto">
        <table class="w-full divide-y divide-gray-100">
          <thead class="bg-gray-50/50">
            <tr class="text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">
              <th class="px-6 py-5 cursor-pointer hover:text-primary transition-colors" @click="sortBy('fullName')">
                Manager Identity 
                <SortIcon :field="'fullName'" :sort-key="sortKey" :sort-asc="sortAsc" />
              </th>
              <th class="px-6 py-5">Contact / Groups</th>
              <th class="px-6 py-5">Reporting To (Owner)</th>
              <th class="px-6 py-5 text-center">Status</th>
              <th class="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="manager in managers" :key="manager.id" class="hover:bg-primary/5 transition-all group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20 uppercase">
                    {{ manager.manager.first_name[0] }}{{ manager.manager.last_name[0] }}
                  </div>
                  <div>
                    <div class="text-sm font-black text-gray-800 tracking-tight">
                      {{ manager.manager.first_name }} {{ manager.manager.middle_name }} {{ manager.manager.last_name }}
                    </div>
                    <div class="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">ID: #MN-{{ manager.id }}</div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <div class="flex flex-col gap-1">
                  <div class="text-xs text-gray-600 font-medium italic mb-1">{{ manager.manager.email }}</div>
                  <div class="flex flex-wrap gap-1">
                    <span v-for="group in manager.manager.groups" :key="group" class="px-2 py-0.5 bg-gray-100 text-[9px] font-black text-gray-500 uppercase rounded border border-gray-200">
                      {{ group }}
                    </span>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <i class="fas fa-crown text-[10px] text-amber-400"></i>
                  <span class="text-xs font-bold text-gray-700">
                    {{ manager.owner.first_name }} {{ manager.owner.last_name }}
                  </span>
                </div>
              </td>

              <td class="px-6 py-4 text-center">
                <span 
                  :class="manager.is_active ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'"
                  class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                >
                  {{ manager.is_active ? "Active" : "Inactive" }}
                </span>
              </td>

              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <router-link :to="`/user_detail/${manager.id}`" 
                    class="h-8 px-3 flex items-center gap-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all text-[11px] font-bold uppercase tracking-wider shadow-sm">
                    <i class="fas fa-eye"></i> Details
                  </router-link>
                  
                  <button 
                    v-if="!manager.is_active" 
                    @click="askConfirmation('activate', manager.id)"
                    class="h-8 w-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all border border-green-100 shadow-sm"
                  >
                    <i class="fas fa-power-off text-xs"></i>
                  </button>
                  <button 
                    v-else 
                    @click="askConfirmation('deactivate', manager.id)"
                    class="h-8 w-8 flex items-center justify-center rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition-all border border-orange-100 shadow-sm"
                  >
                    <i class="fas fa-ban text-xs"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="md:hidden p-4 space-y-4">
        <div v-for="manager in managers" :key="manager.id" class="bg-gray-50 border border-gray-100 rounded-2xl p-5">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-black text-gray-800 text-sm tracking-tight">
              {{ manager.manager.first_name }} {{ manager.manager.last_name }}
            </h3>
            <span :class="manager.is_active ? 'text-green-600 bg-green-100 border-green-200' : 'text-orange-600 bg-orange-100 border-orange-200'" class="text-[9px] font-black uppercase px-2 py-1 rounded-md border">
              {{ manager.is_active ? "Active" : "Inactive" }}
            </span>
          </div>
          <div class="space-y-2 mb-4">
            <p class="text-[11px] text-gray-600 flex items-center gap-2">
              <i class="fas fa-crown text-amber-400 w-4"></i> 
              <span class="font-bold">Owner:</span> {{ manager.owner.first_name }} {{ manager.owner.last_name }}
            </p>
            <p class="text-[11px] text-gray-400 uppercase font-black tracking-widest">
              Groups: {{ manager.manager.groups.join(", ") }}
            </p>
          </div>
          <div class="flex gap-2 pt-3 border-t border-gray-100">
            <router-link :to="`/user_detail/${manager.id}`" class="flex-1 py-2 bg-white border border-gray-200 rounded-lg text-center text-[11px] font-black text-gray-600 uppercase tracking-widest shadow-sm">Details</router-link>
            <button 
              @click="manager.is_active ? askConfirmation('deactivate', manager.id) : askConfirmation('activate', manager.id)"
              :class="manager.is_active ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'"
              class="px-4 rounded-lg text-[10px] font-black uppercase tracking-widest border border-current opacity-80"
            >
              {{ manager.is_active ? 'Disable' : 'Enable' }}
            </button>
          </div>
        </div>
      </div>

      <div class="bg-gray-50/50 px-6 py-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Page {{ currentPage }} / {{ totalPages }}</p>
        <div class="flex gap-2">
          <button :disabled="!previous" @click="fetchManagers(previous)" class="px-5 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase text-gray-400 hover:text-primary disabled:opacity-30 transition-all shadow-sm">Prev</button>
          <button :disabled="!next" @click="fetchManagers(next)" class="px-5 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase text-gray-400 hover:text-primary disabled:opacity-30 transition-all shadow-sm">Next</button>
        </div>
      </div>
    </div>

    <AddManager v-if="showAddManager" :visible="showAddManager" @close="showAddManager = false" @success="fetchManagers" />
    <ConfirmModal :visible="showConfirm" :title="confirmTitle" :message="confirmMessage" @cancel="showConfirm = false" @confirm="confirmAction" />
  </div>
</template>


<script>
import Toast from "@/components/Toast.vue";
import AddManager from "./add.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import Loading from "@/components/Loading.vue";
const SortIcon = {
  props: ["field", "sortKey", "sortAsc"],
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
  `,
};

export default {
  name: "ManagersView",
  components: { SortIcon, Toast, AddManager,ConfirmModal,Loading },
  data() {
    return {
      searchTerm: "",
      sortKey: "fullName",
      sortAsc: true,
      managers: [],
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
      pageSize: 5,
      pageSizes: [5, 10, 20, 50, 100],
      showAddManager: false,
      searchTimeout: null, // debounce timer

        showConfirm: false,
    selectedUser: null,
    selectedAction: null, // 'activate' or 'deactivate'
    loading:false,
    };
  },
  // computed: {
  //   filteredAndSortedManagers() {
  //     const term = this.searchTerm.toLowerCase();
  //     let filtered = this.managers.filter(
  //       (manager) =>
  //         `${manager.first_name} ${manager.middle_name} ${manager.last_name}`
  //           .toLowerCase()
  //           .includes(term) ||
  //         manager.groups.join(", ").toLowerCase().includes(term) ||
  //         (manager.is_active ? "yes" : "no").includes(term)
  //     );

  //     filtered.sort((a, b) => {
  //       let aVal =
  //         `${a.first_name} ${a.middle_name} ${a.last_name}`.toLowerCase();
  //       let bVal =
  //         `${b.first_name} ${b.middle_name} ${b.last_name}`.toLowerCase();
  //       if (aVal < bVal) return this.sortAsc ? -1 : 1;
  //       if (aVal > bVal) return this.sortAsc ? 1 : -1;
  //       return 0;
  //     });

  //     return filtered;
  //   },
  // },
  watch: {
    searchTerm(newVal) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.fetchManagers(null, newVal);
      }, 400); // delay 400ms
    },
  },

  mounted() {


    if(this.$hasPermission('pms.view_ownermanager')==true){
     this.fetchManagers();
    }else{
      this.$router.push({
        name:'accessDenied'
      })
    }
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
    async fetchManagers(url = null, searchTerm = "") {
      this.loading=true;
      try {
        const result = await this.$getManagers(searchTerm); // Global function handles URL & params
        console.log("result", result);
        this.managers = result.managers;
        console.log("accepted managers",this.managers);
        this.currentPage = result.currentPage;
        this.totalPages = result.totalPages;
        this.next = result.next;
        this.previous = result.previous;
      } catch (err) {
        console.error("Failed to fetch managers:", err);
        this.managers = [];
        this.currentPage = 1;
        this.totalPages = 1;
        this.next = null;
        this.previous = null;
      }finally{
        this.loading=false;
      }
    },
    sortBy(key) {
      if (this.sortKey === key) this.sortAsc = !this.sortAsc;
      else {
        this.sortKey = key;
        this.sortAsc = true;
      }
    },
    activateUser(id) {
      this.$apiPost(`/activate_user/${id}`, { id }).then((res) => {
        this.$root.$refs.toast.showToast("Activate Manger User successfully ", "success");
        this.fetchManagers();
      });
    },
    deactivateUser(id) {
      this.$apiDelete(`/deactivate_user`, { id }).then((res) => {
        this.$root.$refs.toast.showToast("Deactivate Manger User successfully ", "success");
        this.fetchManagers();
      });
    },
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
          this.fetchManagers();
        });
    } else {
      this.$apiDelete(`/deactivate_user`, this.selectedUser)
        .then(() => {
          this.$root.$refs.toast.showToast("User deactivated successfully", "success");
          this.fetchManagers();
        });
    }

    this.showConfirm = false;
  },
  },
};
</script>

<template>
  <div class="min-h-screen bg-background p-4 md:p-3">
    <Toast ref="toast" />
    <Loading :visible="loading" message="Syncing Staff Directory..." />

    <div class="max-w-7xl mx-auto bg-white rounded-xl overflow-hidden border border-gray-100">
      
      <div class="bg-gradient-to-r from-dprimary to-primary px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-4">
          <div class="bg-white/20 p-2.5 rounded-xl backdrop-blur-md text-white">
            <i class="fas fa-user-tie text-2xl"></i>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white tracking-tight">Staff Management</h1>
            <p class="text-white/70 text-[10px] uppercase tracking-widest font-black">Owner & Operational Staffs</p>
          </div>
        </div>

        <button
          @click="showAddStaff = true"
          class="bg-white text-primary hover:bg-gray-50 font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <i class="fas fa-plus-circle"></i> Add Staff
        </button>
      </div>

      <div class="p-6 border-b border-gray-50 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div class="relative w-full max-w-xl group">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary transition-colors">
            <i class="fas fa-search text-sm"></i>
          </span>
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search staff by name, email, or group..."
            class="custom-input !mt-0 !pl-10 h-11 shadow-sm border-gray-200 focus:border-primary"
          />
        </div>

        <div class="flex items-center gap-3 self-end lg:self-center">
          <span class="text-[11px] font-black text-gray-400 uppercase tracking-widest">Show</span>
          <select
            v-model="pageSize"
            @change="fetchStaffs()"
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
                Staff Identity 
                <SortIcon :field="'fullName'" :sort-key="sortKey" :sort-asc="sortAsc" />
              </th>
              <th class="px-6 py-5">Contact Details</th>
              <th class="px-6 py-5">Assigned Groups</th>
              <th class="px-6 py-5 text-center">Status</th>
              <th class="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="staff in filteredAndSortedStaffs" :key="staff.id" class="hover:bg-primary/5 transition-all group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
                    {{ staff.staff.first_name[0] }}{{ staff.staff.last_name[0] }}
                  </div>
                  <div>
                    <div class="text-sm font-black text-gray-800 tracking-tight">
                      {{ staff.staff.first_name }} {{ staff.middle_name }} {{ staff.staff.last_name }}
                    </div>
                    <div class="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Staff ID: #{{ staff.id }}</div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-2 text-xs text-gray-600">
                    <i class="fas fa-envelope text-[10px] text-gray-300"></i> {{ staff.staff.email }}
                  </div>
                  <div class="flex items-center gap-2 text-xs text-gray-600">
                    <i class="fas fa-phone text-[10px] text-gray-300"></i> {{ staff.staff.phone_number }}
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span v-for="group in staff.staff.groups" :key="group"
                    class="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-black uppercase tracking-wider border border-gray-200"
                  >
                    {{ group }}
                  </span>
                </div>
              </td>

              <td class="px-6 py-4 text-center">
                <span 
                  :class="staff.staff.is_active ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'"
                  class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                >
                  {{ staff.staff.is_active ? "Active" : "Inactive" }}
                </span>
              </td>

              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <router-link :to="`/user_detail/${staff.staff.id}`" 
                    class="h-8 px-3 flex items-center gap-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all text-[11px] font-bold uppercase tracking-wider">
                    <i class="fas fa-eye"></i> View
                  </router-link>
                  
                  <button 
                    v-if="!staff.staff.is_active" 
                    @click="activateUser(staff.id)"
                    class="h-8 w-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all"
                  >
                    <i class="fas fa-power-off text-xs"></i>
                  </button>
                  <button 
                    v-else 
                    @click="deactivateUser(staff.id)"
                    class="h-8 w-8 flex items-center justify-center rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition-all"
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
        <div v-for="staff in filteredAndSortedStaffs" :key="staff.id" class="bg-gray-50 border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                {{ staff.staff.first_name[0] }}
              </div>
              <h3 class="font-black text-gray-800 tracking-tight text-sm">{{ staff.staff.first_name }} {{ staff.staff.last_name }}</h3>
            </div>
            <span :class="staff.staff.is_active ? 'text-green-600 bg-green-100 border-green-200' : 'text-orange-600 bg-orange-100 border-orange-200'" class="text-[9px] font-black uppercase px-2 py-1 rounded-md border">
              {{ staff.staff.is_active ? "Active" : "Inactive" }}
            </span>
          </div>
          <div class="space-y-2 mb-4">
            <p class="text-[11px] text-gray-600 flex items-center gap-2"><i class="fas fa-envelope text-gray-300 w-4"></i> {{ staff.staff.email }}</p>
            <p class="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">Groups: {{ staff.staff.groups.join(", ") }}</p>
          </div>
          <div class="flex gap-2 pt-3 border-t border-gray-100">
            <router-link :to="`/user_detail/${staff.staff.id}`" class="flex-1 py-2 bg-white border border-gray-200 rounded-lg text-center text-[11px] font-black text-gray-600 uppercase tracking-widest shadow-sm">Details</router-link>
            <button 
              @click="staff.staff.is_active ? deactivateUser(staff.id) : activateUser(staff.id)"
              :class="staff.staff.is_active ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-green-50 text-green-600 border-green-100'"
              class="px-4 rounded-lg text-[10px] font-black uppercase tracking-widest border"
            >
              {{ staff.staff.is_active ? 'Disable' : 'Enable' }}
            </button>
          </div>
        </div>
      </div>

      <div class="bg-gray-50/50 px-6 py-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          Showing Page {{ currentPage }} of {{ totalPages }}
        </p>
        <div class="flex items-center gap-2">
          <button
            :disabled="!previous"
            @click="fetchStaffs(previous)"
            class="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black uppercase text-gray-500 hover:text-primary hover:border-primary disabled:opacity-40 transition-all shadow-sm"
          >
            <i class="fas fa-chevron-left mr-1"></i> Prev
          </button>
          <button
            :disabled="!next"
            @click="fetchStaffs(next)"
            class="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black uppercase text-gray-500 hover:text-primary hover:border-primary disabled:opacity-40 transition-all shadow-sm"
          >
            Next <i class="fas fa-chevron-right ml-1"></i>
          </button>
        </div>
      </div>
    </div>

    <AddStaff v-if="showAddStaff" :visible="showAddStaff" @close="showAddStaff = false" @success="fetchStaffs()" />
  </div>
</template>


<script>
import Toast from "@/components/Toast.vue";
import AddStaff from "./add.vue";
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
  name: "StaffsView",
  components: { SortIcon, Toast, AddStaff ,Loading},
  data() {
    return {
      searchTerm: "",
      sortKey: "fullName",
      sortAsc: true,
      staffs: [],
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
      pageSize: 100,
      pageSizes: [5, 10, 20, 50, 100],
      showAddStaff: false,
      loading:false,
    };
  },
  computed: {
    filteredAndSortedStaffs() {
      const term = this.searchTerm.toLowerCase();
      let filtered = this.staffs.filter(
        (staff) =>
          `${staff.first_name} ${staff.middle_name} ${staff.last_name}`
            .toLowerCase()
            .includes(term) ||
          staff.email.toLowerCase().includes(term) ||
          staff.phone_number.toLowerCase().includes(term) ||
          staff.groups.join(", ").toLowerCase().includes(term) ||
          (staff.is_active ? "yes" : "no").includes(term)
      );

      filtered.sort((a, b) => {
        let aVal =
          `${a.first_name} ${a.middle_name} ${a.last_name}`.toLowerCase();
        let bVal =
          `${b.first_name} ${b.middle_name} ${b.last_name}`.toLowerCase();
        if (aVal < bVal) return this.sortAsc ? -1 : 1;
        if (aVal > bVal) return this.sortAsc ? 1 : -1;
        return 0;
      });

      return filtered;
    },
  },
  mounted() {
    this.fetchStaffs();
  },
  methods: {
  async fetchStaffs(customUrl = null) {
    this.loading=true;
  try {
    let params = {};
    let url = customUrl;

    if (localStorage.getItem('is_superuser') === 'true') {
      url = 'get_owner_staffs';   // fixed spelling
      params = {
        //owner__id: localStorage.getItem('userId')
      };          // keep it object
    } else {
      url = 'get_owner_staffs';
      params = {
        owner__id: localStorage.getItem('userId')
      };
    }


    console.log("params for staff by owner",params);

    const res = await this.$apiGet(url, params);
    
    console.log("staffs result", res);

    this.staffs = Array.isArray(res.data) ? res.data : [];

    console.log("staffs", this.staffs);

    // TODO: handle pagination if backend returns { next, previous, count }
  } catch (err) {
    console.error("Failed to fetch staffs:", err);
    this.staffs = [];
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
      this.$apiPost(`/activate_user/${id}`, { id }).then(() => {
        this.$root.$refs.toast.showToast(
          "Staff activated successfully",
          "success"
        );
        this.fetchStaffs();
      });
    },
    deactivateUser(id) {
      this.$apiDelete(`/deactivate_user`, { id }).then(() => {
        this.$root.$refs.toast.showToast(
          "Staff deactivated successfully",
          "success"
        );
        this.fetchStaffs();
      });
    },
  },
};
</script>

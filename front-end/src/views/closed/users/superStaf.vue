<template>
  <div class="min-h-screen bg-background p-4 md:p-2">
    <Toast ref="toast" />
    <Loading :visible="loading" message="Syncing Super Staff Directory..." />

    <div class="max-w-7xl mx-auto bg-white rounded-xl overflow-hidden border border-gray-100 ">
      
      <div class="bg-gradient-to-r from-dprimary to-primary px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-4">
          <div class="bg-white/20 p-2.5 rounded-xl backdrop-blur-md text-white">
            <i class="fas fa-user-shield text-2xl"></i>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white tracking-tight">Super Staff</h1>
            <p class="text-white/70 text-[10px] uppercase tracking-widest font-bold">Privileged Access Accounts</p>
          </div>
        </div>

        <button
          @click="showAddModal = true"
          class="bg-white text-primary hover:bg-gray-50 font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <i class="fas fa-plus"></i> Add Super Staff
        </button>
      </div>

      <div class="hidden md:block overflow-x-auto">
        <table class="w-full divide-y divide-gray-100">
          <thead class="bg-gray-50/50">
            <tr class="text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">
              <th class="px-6 py-5 cursor-pointer hover:text-primary transition-colors" @click="sortBy('fullName')">
                Identity 
                <SortIcon :field="'fullName'" :sort-key="sortKey" :sort-asc="sortAsc" />
              </th>
              <th class="px-6 py-5">Permission Groups</th>
              <th class="px-6 py-5 text-center">Status</th>
              <th class="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="user in sortedSuperStaffs" :key="user.id" class="hover:bg-primary/5 transition-all group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
                    {{ user.first_name[0] }}{{ user.last_name[0] }}
                  </div>
                  <div>
                    <div class="text-sm font-black text-gray-800 tracking-tight">
                      {{ user.first_name }} {{ user.middle_name }} {{ user.last_name }}
                    </div>
                    <div class="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Admin ID: #{{ user.id }}</div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <template v-if="user.groups?.length">
                    <span 
                      v-for="group in user.groups" :key="group"
                      class="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-black uppercase tracking-wider border border-gray-200"
                    >
                      {{ group }}
                    </span>
                  </template>
                  <span v-else class="text-xs italic text-gray-300">No Groups</span>
                </div>
              </td>

              <td class="px-6 py-4 text-center">
                <span 
                  :class="user.is_active ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'"
                  class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                >
                  {{ user.is_active ? "Active" : "Inactive" }}
                </span>
              </td>

              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <button @click="goToDetail(user.id)" class="h-8 px-3 flex items-center gap-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all text-[11px] font-bold uppercase tracking-wider">
                    Details
                  </button>
                  
                  <button 
                    v-if="!user.is_active" 
                    @click="askConfirmation('activate', user.id)"
                    class="h-8 w-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all"
                  >
                    <i class="fas fa-power-off text-xs"></i>
                  </button>
                  <button 
                    v-else 
                    @click="askConfirmation('deactivate', user.id)"
                    class="h-8 w-8 flex items-center justify-center rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition-all"
                  >
                    <i class="fas fa-ban text-xs"></i>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="superStaffs.length === 0">
              <td colspan="4" class="text-center py-12 text-gray-400 italic text-sm">
                No super staff members found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="md:hidden p-4 space-y-4">
        <div v-for="user in sortedSuperStaffs" :key="user.id" class="bg-gray-50 border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                {{ user.first_name[0] }}
              </div>
              <h3 class="font-black text-gray-800 tracking-tight">{{ user.first_name }} {{ user.last_name }}</h3>
            </div>
            <span :class="user.is_active ? 'text-green-600 bg-green-100' : 'text-orange-600 bg-orange-100'" class="text-[9px] font-black uppercase px-2 py-1 rounded-md">
              {{ user.is_active ? "Active" : "Inactive" }}
            </span>
          </div>
          
          <div class="mb-4">
            <p class="text-[10px] text-gray-400 font-bold uppercase mb-1">Groups</p>
            <div class="flex flex-wrap gap-1">
              <span v-for="group in user.groups" :key="group" class="bg-white border border-gray-200 px-2 py-0.5 rounded text-[9px] font-bold text-gray-500">
                {{ group }}
              </span>
            </div>
          </div>

          <div class="flex gap-2 pt-2 border-t border-gray-200">
            <button @click="goToDetail(user.id)" class="flex-1 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 uppercase tracking-widest">Details</button>
            <button 
              @click="user.is_active ? askConfirmation('deactivate', user.id) : askConfirmation('activate', user.id)"
              :class="user.is_active ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'"
              class="px-4 rounded-lg text-[10px] font-black uppercase tracking-widest"
            >
              {{ user.is_active ? 'Disable' : 'Enable' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <Addsuperstaff v-if="showAddModal" :visible="showAddModal" @close="showAddModal = false" @success="fetchUsers" />
    <ConfirmModal :visible="showConfirm" :title="confirmTitle" :message="confirmMessage" @cancel="showConfirm = false" @confirm="confirmAction" />
  </div>
</template>

<script>
import Addsuperstaff from "./addSuperStaff.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
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
  components: { Addsuperstaff, SortIcon, ConfirmModal, Loading },
  data() {
    return {
      users: [],
      sortKey: "fullName",
      sortAsc: true,
      showAddModal: false,
      showConfirm: false,
      selectedUser: null,
      selectedAction: null,
      loading: false, // ✅ new loading state
    };
  },
  computed: {
    superStaffs() {
      return this.users.filter((u) => u.groups.includes("super_staff"));
    },
    sortedSuperStaffs() {
      return this.superStaffs.sort((a, b) => {
        const aName = `${a.first_name} ${a.middle_name} ${a.last_name}`.toLowerCase();
        const bName = `${b.first_name} ${b.middle_name} ${b.last_name}`.toLowerCase();
        if (aName < bName) return this.sortAsc ? -1 : 1;
        if (aName > bName) return this.sortAsc ? 1 : -1;
        return 0;
      });
    },
    confirmTitle() {
      return this.selectedAction === "activate" ? "Activate User" : "Deactivate User";
    },
    confirmMessage() {
      return this.selectedAction === "activate"
        ? "Are you sure you want to activate this user?"
        : "Are you sure you want to deactivate this user?";
    },
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        this.loading = true;
        const params = { page_size: 1000000 };
        const res = await this.$apiGet("/get_users", params);
        this.users = res.data;
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        this.loading = false;
      }
    },
    sortBy(key) {
      this.sortKey === key ? (this.sortAsc = !this.sortAsc) : (this.sortKey = key);
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
          .then(() => this.fetchUsers());
      } else {
        this.$apiDelete(`/deactivate_user`, this.selectedUser)
          .then(() => this.fetchUsers());
      }
      this.showConfirm = false;
    },
    goToDetail(id) {
      this.$router.push(`/user_detail/${id}`);
    },
  },
};
</script>

<style scoped>
@media (max-width: 640px) {
  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>

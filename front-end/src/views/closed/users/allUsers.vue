
<template>
  <div class="min-h-screen bg-background p-4 md:p-2">
    <Toast ref="toast" />
    <Loading :visible="loading" message="Syncing User Directory..." />
    <div class="max-w-7xl mx-auto bg-white rounded-2xl overflow-hidden border border-gray-100">
      <div class="bg-gradient-to-r from-dprimary to-primary px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-4">
          <div class="bg-white/20 p-2.5 rounded-xl backdrop-blur-md text-white">
            <i class="fas fa-users text-2xl"></i>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white tracking-tight">User Management</h1>
            <p class="text-white/70 text-[10px] uppercase tracking-widest font-bold">Directory & Access Control</p>
          </div>
        </div>

        <button
          @click="showAddModal = true"
          class="bg-white text-primary hover:bg-gray-50 font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <i class="fas fa-user-plus"></i> Add New User
        </button>
      </div>

      <div class="p-6 border-b border-gray-50 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div class="relative w-full max-w-xl group">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary transition-colors">
            <i class="fas fa-search text-sm"></i>
          </span>
          <input
            v-model="search"
            @input="fetchUsers(1)"
            type="text"
            placeholder="Find users by name, email, or phone number..."
            class="custom-input !mt-0 !pl-10 h-11 shadow-sm border-gray-200 focus:border-primary"
          />
        </div>

        <div class="flex items-center gap-3 self-end lg:self-center">
          <span class="text-[11px] font-black text-gray-400 uppercase tracking-widest">Show</span>
          <select
            v-model="pageSize"
            @change="fetchUsers(1)"
            class="bg-gray-50 border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
          >
            <option v-for="size in [5, 10, 20, 50, 100]" :key="size" :value="size">{{ size }}</option>
          </select>
          <span class="text-[11px] font-black text-gray-400 uppercase tracking-widest">Entries</span>
        </div>
      </div>

      <div class="hidden md:block overflow-x-auto">
        <table class="w-full divide-y divide-gray-100">
          <thead class="bg-gray-50/50">
            <tr class="text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">
              <th class="px-6 py-4">Identity</th>
              <th class="px-6 py-4">Contact Details</th>
              <th class="px-6 py-4">Assigned Groups</th>
              <th class="px-6 py-4 text-center">Status</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="user in users" :key="user.id" class="hover:bg-primary/5 transition-all group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
                    {{ user.first_name[0] }}{{ user.last_name[0] }}
                  </div>
                  <div>
                    <div class="text-sm font-black text-gray-800 tracking-tight">
                      {{ user.first_name }} {{ user.last_name }}
                    </div>
                    <div class="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">ID: #{{ user.id }}</div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-2 text-xs text-gray-600">
                    <i class="fas fa-envelope text-[10px] text-gray-300"></i> {{ user.email }}
                  </div>
                  <div class="flex items-center gap-2 text-xs text-gray-600">
                    <i class="fas fa-phone text-[10px] text-gray-300"></i> {{ user.phone_number || 'No Phone' }}
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
                  <span v-else class="text-xs italic text-gray-300">Unassigned</span>
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
                    <i class="fas fa-eye"></i> View
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
          </tbody>
        </table>
      </div>

      <div class="md:hidden p-4 space-y-4">
        <div v-for="user in users" :key="user.id" class="bg-gray-50 border border-gray-100 rounded-2xl p-5 shadow-sm">
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
          
          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-xs text-gray-600"><i class="fas fa-envelope w-4"></i> {{ user.email }}</div>
            <div class="flex items-center gap-2 text-xs text-gray-600"><i class="fas fa-phone w-4"></i> {{ user.phone_number || '—' }}</div>
          </div>

          <div class="flex gap-2 pt-2 border-t border-gray-200">
            <button @click="goToDetail(user.id)" class="flex-1 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600">Details</button>
            <button 
              @click="user.is_active ? askConfirmation('deactivate', user.id) : askConfirmation('activate', user.id)"
              :class="user.is_active ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'"
              class="px-4 rounded-lg text-xs font-bold uppercase tracking-widest"
            >
              {{ user.is_active ? 'Disable' : 'Enable' }}
            </button>
          </div>
        </div>
      </div>

      <div class="bg-gray-50/50 px-6 py-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          Showing Page {{ pagination.current_page }} of {{ pagination.total_pages }}
        </p>
        
        <div class="flex items-center gap-2">
          <button
            :disabled="!pagination.previous"
            @click="changePage(pagination.current_page - 1)"
            class="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black uppercase text-gray-500 hover:text-primary hover:border-primary disabled:opacity-40 disabled:hover:border-gray-200 transition-all shadow-sm"
          >
            <i class="fas fa-chevron-left mr-1"></i> Prev
          </button>
          <button
            :disabled="!pagination.next"
            @click="changePage(pagination.current_page + 1)"
            class="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black uppercase text-gray-500 hover:text-primary hover:border-primary disabled:opacity-40 disabled:hover:border-gray-200 transition-all shadow-sm"
          >
            Next <i class="fas fa-chevron-right ml-1"></i>
          </button>
        </div>
      </div>
    </div>

    <Add v-if="showAddModal" :visible="showAddModal" @close="showAddModal = false" @success="fetchUsers" />
    <ConfirmModal :visible="showConfirm" :title="confirmTitle" :message="confirmMessage" @cancel="showConfirm = false" @confirm="confirmAction" />
  </div>

</template>

<script>
import Toast from "@/components/Toast.vue";
import Add from "./add.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import Loading from "@/components/Loading.vue";

export default {
  name: "UsersView",
  components: { Toast, Add, ConfirmModal, Loading },
  data() {
    return {
      users: [],
      search: "",
      pageSize: 10,
      pagination: {
        current_page: 1,
        total_pages: 1,
        next: null,
        previous: null,
      },
      showAddModal: false,
      showConfirm: false,
      selectedUser: null,
      selectedAction: null,
      loading: false,
    };
  },
  mounted() {
    this.fetchUsers();
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
    async fetchUsers(page = 1) {
      this.loading = true;
      try {
        const params = {
          search: this.search,
          page,
          page_size: this.pageSize,
          ordering: "-id",
        };
        const response = await this.$apiGet("/get_users", params);
        this.users = response.data || [];
        this.pagination = {
          current_page: response.current_page,
          total_pages: response.total_pages,
          next: response.next,
          previous: response.previous,
        };
      } catch (error) {
        console.error(error);
        this.$root.$refs.toast.showToast("Failed to load users", "error");
      } finally {
        this.loading = false;
      }
    },

    askConfirmation(action, id) {
      this.selectedUser = id;
      this.selectedAction = action;
      this.showConfirm = true;
    },

    confirmAction() {
      if (!this.selectedUser || !this.selectedAction) return;
      this.loading = true;
      const actionPromise =
        this.selectedAction === "activate"
          ? this.$apiPost(`/activate_user/${this.selectedUser}`, {
              id: this.selectedUser,
            })
          : this.$apiDelete(`/deactivate_user`, this.selectedUser);

      actionPromise
        .then(() => {
          const msg =
            this.selectedAction === "activate"
              ? "User activated successfully"
              : "User deactivated successfully";
          this.$root.$refs.toast.showToast(msg, "success");
          this.fetchUsers(this.pagination.current_page);
        })
        .finally(() => {
          this.loading = false;
          this.showConfirm = false;
        });
    },

    changePage(page) {
      this.fetchUsers(page);
    },

    goToDetail(id) {
      this.$router.push(`/user_detail/${id}`);
    },
  },
};
</script>

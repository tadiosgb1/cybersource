<template>
  <div class="min-h-screen bg-background p-4 md:p-2">
    <Toast ref="toast" />
    <Loading :visible="loading" message="Loading System Permissions..." />

    <div class="max-w-7xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
      
      <div class="bg-gradient-to-r from-dprimary to-primary px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-4">
          <div class="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white tracking-tight">System Permissions</h1>
            <p class="text-white/70 text-xs uppercase tracking-widest font-semibold">Security Management</p>
          </div>
        </div>

        <button
          @click="addVisible = true"
          class="bg-white text-primary hover:bg-gray-50 font-bold px-6 py-2.5 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <span class="text-xl">+</span> Add Permission
        </button>
      </div>

      <div class="p-6 md:p-8">
        <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div class="relative w-full md:w-1/3">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <i class="fas fa-search"></i>
            </span>
            <input
              v-model="searchTerm"
              type="search"
              placeholder="Search by name or codename..."
              class="custom-input !mt-0 !pl-10 h-11"
            />
          </div>
          <div class="text-sm font-medium text-gray-500">
            Total Records: <span class="text-primary font-bold">{{ filteredAndSortedPermissions.length }}</span>
          </div>
        </div>

        <div class="hidden md:block overflow-hidden rounded-xl border border-gray-100 shadow-sm">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest cursor-pointer hover:text-primary transition-colors"
                  @click="sortBy('name')"
                >
                  <div class="flex items-center gap-1">
                    Permission Name
                    <SortIcon :field="'name'" :sort-key="sortKey" :sort-asc="sortAsc" />
                  </div>
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest cursor-pointer hover:text-primary transition-colors"
                  @click="sortBy('codename')"
                >
                  <div class="flex items-center gap-1">
                    System Codename
                    <SortIcon :field="'codename'" :sort-key="sortKey" :sort-asc="sortAsc" />
                  </div>
                </th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr
                v-for="permission in filteredAndSortedPermissions"
                :key="permission.id"
                class="hover:bg-primary/5 transition-colors group"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors">
                    {{ permission.name }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] font-mono border border-gray-200">
                    {{ permission.codename }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                  <div class="flex justify-center gap-3">
                    <button
                      @click="editPermission(permission)"
                      class="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                      title="Edit"
                    >
                      <i class="fas fa-edit text-xs"></i>
                    </button>
                    <button
                      @click="deletePermission(permission)"
                      class="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-secondary hover:bg-secondary hover:text-white transition-all shadow-sm"
                      title="Delete"
                    >
                      <i class="fas fa-trash-alt text-xs"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredAndSortedPermissions.length === 0">
                <td colspan="3" class="text-center py-12">
                  <div class="flex flex-col items-center text-gray-400">
                    <i class="fas fa-folder-open text-4xl mb-2"></i>
                    <p class="font-medium">No matching permissions found</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="md:hidden flex flex-col gap-4">
          <div
            v-for="permission in filteredAndSortedPermissions"
            :key="permission.id"
            class="bg-white rounded-xl border-l-4 border-l-primary shadow-md p-5 relative overflow-hidden group active:bg-gray-50 transition-colors border border-gray-100"
          >
            <div class="flex flex-col gap-1">
              <h3 class="font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors">{{ permission.name }}</h3>
              <span class="text-[11px] font-mono text-gray-400 uppercase">{{ permission.codename }}</span>
            </div>
            
            <div class="flex gap-3 mt-4 pt-4 border-t border-gray-100">
              <button
                @click="editPermission(permission)"
                class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all"
              >
                <i class="fas fa-edit"></i> Edit
              </button>
              <button
                @click="deletePermission(permission)"
                class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-secondary/10 text-secondary text-xs font-bold rounded-lg hover:bg-secondary hover:text-white transition-all"
              >
                <i class="fas fa-trash-alt"></i> Delete
              </button>
            </div>
          </div>
          <div v-if="filteredAndSortedPermissions.length === 0" class="text-center py-10 text-gray-400 font-medium">
            No permissions available.
          </div>
        </div>
      </div>
    </div>

    <AddPermission v-if="addVisible" :visible="addVisible" @close="addVisible = false; fetchPermissions();" />
    <UpdatePermission v-if="updateVisible" :visible="updateVisible" :permission="permissionToEdit" @close="updateVisible = false" @refresh="fetchPermissions" />
    <ConfirmModal
      :visible="deleteModalVisible"
      title="Confirm Deletion"
      :message="`Are you sure you want to permanently delete '${permissionToDelete?.name}'? This action cannot be undone.`"
      @cancel="deleteModalVisible = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script>
import Toast from "../../../components/Toast.vue";
import AddPermission from "./add.vue";
import UpdatePermission from "./update.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import Loading from "@/components/Loading.vue"; // <-- Added Loading

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
  name: "PermissionsView",
  components: {
    SortIcon,
    AddPermission,
    UpdatePermission,
    ConfirmModal,
    Toast,
    Loading
  },
  data() {
    return {
      searchTerm: "",
      sortKey: "name",
      sortAsc: true,
      permissions: [],
      addVisible: false,
      updateVisible: false,
      permissionToEdit: null,
      deleteModalVisible: false,
      permissionToDelete: null,
      loading:false,
    };
  },
  computed: {
    filteredAndSortedPermissions() {
      let filtered = this.permissions.filter(
        (p) =>
          p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          p.codename.toLowerCase().includes(this.searchTerm.toLowerCase())
      );

      filtered.sort((a, b) => {
        let res = 0;
        if (a[this.sortKey] < b[this.sortKey]) res = -1;
        if (a[this.sortKey] > b[this.sortKey]) res = 1;
        return this.sortAsc ? res : -res;
      });

      return filtered;
    },
  },
  mounted() {
    this.fetchPermissions();
  },
  methods: {
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = key;
        this.sortAsc = true;
      }
    },
    async fetchPermissions() {
      this.loading=true;
      const params = {
        page_size: 1000,
      };
      try {
        const response = await this.$apiGet("/get_permissions", params);
        this.permissions = response.data;
        console.log("permissions are",this.permissions)
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
        alert("Failed to load permissions.");
      }finally{
        this.loading=false;
      }
    },
    editPermission(permission) {
      this.permissionToEdit = permission;
      this.updateVisible = true;
    },
    deletePermission(permission) {
      this.permissionToDelete = permission;
      this.deleteModalVisible = true;
    },
    async confirmDelete() {
      try {
        await this.$apiDelete(
          `/delete_permission/${this.permissionToDelete.id}`
        );
        this.$root.$refs.toast.showToast(
          "Permission deleted successfully",
          "success"
        );
        this.fetchPermissions();
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete permission.");
      } finally {
        this.permissionToDelete = null;
        this.deleteModalVisible = false;
      }
    },
  },
};
</script>

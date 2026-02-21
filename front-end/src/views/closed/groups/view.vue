<template>
  <div class="min-h-screen bg-background p-4 md:p-2">
    <Toast ref="toast" />
    <Loading :visible="loading" message="Loading Security Groups..." />

    <div class="max-w-7xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
      
      <div class="bg-gradient-to-r from-dprimary to-primary px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg">
        <div class="flex items-center gap-4">
          <div class="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white tracking-tight">Access Groups</h1>
            <p class="text-white/70 text-[10px] uppercase tracking-widest font-bold">Role-Based Access Control</p>
          </div>
        </div>

        <button
          @click="visible = true"
          class="bg-white text-primary hover:bg-gray-50 font-bold px-6 py-2.5 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <span class="text-xl">+</span> Add Group
        </button>
      </div>

      <div class="p-6 md:p-8">
        <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div class="relative w-full md:w-1/3 group">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary transition-colors">
              <i class="fas fa-search"></i>
            </span>
            <input
              v-model="searchTerm"
              type="search"
              placeholder="Search groups..."
              class="custom-input !mt-0 !pl-10 h-11"
            />
          </div>
          <div class="px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-xs font-semibold text-gray-500">
            Total Groups: <span class="text-primary">{{ filteredAndSortedGroups.length }}</span>
          </div>
        </div>

        <div class="hidden md:block overflow-hidden rounded-xl border border-gray-100 shadow-sm">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50/80">
              <tr>
                <th
                  class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest cursor-pointer hover:text-primary transition-colors w-1/4"
                  @click="sortBy('name')"
                >
                  <div class="flex items-center gap-1">
                    Group Name
                    <SortIcon :field="'name'" :sort-key="sortKey" :sort-asc="sortAsc" />
                  </div>
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Assigned Permissions
                </th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-widest w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr
                v-for="group in filteredAndSortedGroups"
                :key="group.id"
                class="hover:bg-primary/5 transition-colors group"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors">
                    {{ group.name }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1.5">
                    <span 
                      v-for="perm in group.permissions" 
                      :key="perm"
                      class="px-2.5 py-0.5 bg-blue-50 text-primary border border-blue-100 rounded-md text-[10px] font-bold uppercase tracking-tighter"
                    >
                      {{ perm }}
                    </span>
                    <span v-if="!group.permissions || group.permissions.length === 0" class="text-gray-400 text-xs italic">
                      No permissions assigned
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex justify-center gap-3">
                    <button
                      @click="editGroup(group)"
                      class="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                      title="Edit Group"
                    >
                      <i class="fas fa-edit text-sm"></i>
                    </button>
                    <button
                      @click="deleteGroup(group)"
                      class="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-secondary hover:bg-secondary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                      title="Delete Group"
                    >
                      <i class="fas fa-trash-alt text-sm"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="md:hidden space-y-4">
          <div
            v-for="group in filteredAndSortedGroups"
            :key="group.id"
            class="bg-white rounded-2xl border border-gray-100 shadow-md p-5 border-l-4 border-l-primary"
          >
            <div class="flex justify-between items-start mb-4">
              <h3 class="font-bold text-gray-900 text-lg tracking-tight">{{ group.name }}</h3>
              <div class="flex gap-2">
                 <button @click="editGroup(group)" class="text-primary p-2 bg-blue-50 rounded-lg"><i class="fas fa-edit"></i></button>
                 <button @click="deleteGroup(group)" class="text-secondary p-2 bg-red-50 rounded-lg"><i class="fas fa-trash-alt"></i></button>
              </div>
            </div>
            
            <div class="space-y-2">
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Permissions</p>
              <div class="flex flex-wrap gap-1.5">
                <span 
                  v-for="perm in group.permissions" 
                  :key="perm"
                  class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold"
                >
                  {{ perm }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredAndSortedGroups.length === 0" class="text-center py-20 bg-gray-50/50 mt-4 rounded-xl border-2 border-dashed border-gray-100">
           <i class="fas fa-users-slash text-gray-200 text-6xl mb-4"></i>
           <p class="text-gray-400 font-medium italic">No groups found matching your criteria.</p>
        </div>
      </div>
    </div>

    <AddGroup v-if="visible" :visible="visible" @close="visible = false" @saved="fetchGroups" />
    <UpdateGroup v-if="updateVisible" :visible="updateVisible" :groupData="selectedGroup" @close="updateVisible = false" @updated="fetchGroups" />
  </div>
</template>


<script>
import Toast from '../../../components/Toast.vue';
import AddGroup from './add.vue';
import UpdateGroup from './update.vue';
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
  name: 'GroupsView',
  components: { SortIcon, AddGroup, UpdateGroup, Toast,Loading },
  data() {
    return {
      searchTerm: '',
      visible: false,
      updateVisible: false,
      selectedGroup: null,
      sortKey: 'name',
      sortAsc: true,
      groups: [],
      loading:false,
    };
  },
  computed: {
    filteredAndSortedGroups() {
      const term = this.searchTerm.toLowerCase();
      let filtered = this.groups.filter(g =>
        g.name.toLowerCase().includes(term) ||
        g.permissions.some(p => p.toLowerCase().includes(term))
      );
      filtered.sort((a, b) => {
        let res = 0;
        if (a[this.sortKey] < b[this.sortKey]) res = -1;
        if (a[this.sortKey] > b[this.sortKey]) res = 1;
        return this.sortAsc ? res : -res;
      });
      return filtered;
    }
  },
  mounted() {
    this.fetchGroups();
  },
  methods: {
    async fetchGroups() {
      this.loading=true;
      try {
        const response = await this.$apiGet('/get_groups', { page_size: 1000 });
        this.groups = response.data || [];

        console.log("groups", this.groups);

      } catch (error) {
        console.error('Failed to fetch groups:', error);
        alert('Failed to load groups. Please try again later.');
        this.groups = [];
      }finally{
        this.loading=false;
      }
    },
    sortBy(key) {
      this.sortKey === key ? (this.sortAsc = !this.sortAsc) : ((this.sortKey = key), (this.sortAsc = true));
    },
    editGroup(group) {
      this.selectedGroup = { ...group };
      this.updateVisible = true;
    },
    async deleteGroup(group) {
      if (confirm(`Are you sure you want to delete "${group.name}"?`)) {
        try {
          await this.$apiDelete(`/delete_group/${group.id}`);
          this.$root.$refs.toast.showToast('Group deleted successfully', 'success');
          this.groups = this.groups.filter(g => g.id !== group.id);
          this.fetchGroups();
        } catch (err) {
          console.error(err);
          alert('Failed to delete group.');
        }
      }
    }
  }
};
</script>

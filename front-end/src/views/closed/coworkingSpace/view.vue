<template>
  <div class="min-h-screen bg-background p-4 md:p-2">
    <Toast ref="toast" />
    <Loading :visible="loading" message="Loading Co-working space..." />

    <div class="max-w-7xl mx-auto bg-white  rounded-xl overflow-hidden border border-gray-100">
      
      <div class="bg-gradient-to-r from-dprimary to-primary px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-4">
          <div class="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
            <i class="fas fa-laptop-house text-white text-xl"></i>
          </div>
          <div>
            <h2 class="text-2xl font-black text-white tracking-tight">Co-Working Spaces</h2>
            <p class="text-white/70 text-[10px] uppercase tracking-widest font-bold">Manage Shared Office Inventory</p>
          </div>
        </div>
        <button
          @click="showAddSpace = true"
          class="bg-white text-primary font-black text-[11px] uppercase tracking-widest px-6 py-3 rounded-xl shadow-lg hover:bg-gray-50 transform hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
        >
          <i class="fas fa-plus"></i>
          Add New Space
        </button>
      </div>

      <div class="p-6 border-b border-gray-50 flex flex-col lg:flex-row justify-between items-center gap-4 bg-gray-50/30">
        <div class="relative w-full lg:max-w-md group">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary transition-colors">
            <i class="fas fa-search text-xs"></i>
          </span>
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search by name, location or zone..."
            class="custom-input !mt-0 !pl-10 h-11 w-full"
          />
        </div>

        <div class="flex items-center gap-4 shrink-0">
          <div class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
            <label for="pageSize" class="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Show</label>
            <select
              id="pageSize"
              v-model="pageSize"
              @change="fetchSpaces()"
              class="text-sm font-bold text-gray-700 focus:outline-none bg-transparent"
            >
              <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="px-6 py-4 cursor-pointer group" @click="sortBy('name')">
                <div class="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Space Details
                  <SortIcon :field="'name'" :sort-key="sortKey" :sort-asc="sortAsc" />
                </div>
              </th>
              <th class="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Capacity</th>
              <th class="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Pricing Tiers (Daily-Yearly)</th>
              <th class="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Zone</th>
              <th class="px-6 py-4 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="space in filteredAndSortedSpaces" :key="space.id" class="hover:bg-primary/5 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="text-sm font-black text-gray-800 group-hover:text-primary transition-colors">{{ space.name }}</span>
                  <span class="text-[11px] text-gray-400 flex items-center gap-1">
                    <i class="fas fa-map-marker-alt text-[9px]"></i> {{ space.location }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600">
                  <i class="fas fa-users mr-1.5 text-[10px]"></i> {{ space.capacity }} Seats
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-center gap-2">
                  <div class="text-center px-2 py-1 bg-gray-50 rounded border border-gray-100 min-w-[60px]" title="Daily">
                    <p class="text-[9px] font-black text-gray-400">DLY</p>
                    <p class="text-xs font-bold text-gray-700">{{ space.price_daily }}</p>
                  </div>
                  <div class="text-center px-2 py-1 bg-gray-50 rounded border border-gray-100 min-w-[60px]" title="Monthly">
                    <p class="text-[9px] font-black text-gray-400">MTH</p>
                    <p class="text-xs font-bold text-gray-700">{{ space.price_monthly }}</p>
                  </div>
                  <div class="text-center px-2 py-1 bg-gray-50 rounded border border-gray-100 min-w-[60px]" title="Yearly">
                    <p class="text-[9px] font-black text-gray-400">YLY</p>
                    <p class="text-xs font-bold text-gray-700">{{ space.price_yearly }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                {{ space.zone.name }}
                <button 
                  @click="goToZoneDetail(space.zone.id)"
                  class="flex items-center gap-2 text-[11px] font-bold text-gray-500 hover:text-primary transition-colors bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200"
                >
                  <i class="fas fa-external-link-alt text-[9px]"></i>
                  View Zone detail
                </button>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-center gap-2">
                  <button @click="goDetail(space.id)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Space Detail">
                    <i class="fas fa-info-circle text-xs"></i>
                  </button>
                  <button @click="editSpace(space)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all shadow-sm" title="Edit">
                    <i class="fas fa-edit text-xs"></i>
                  </button>
                  <button @click="askDeleteConfirmation(space)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Delete">
                    <i class="fas fa-trash text-xs"></i>
                  </button>
                  <button v-if="showAddRental" @click="goToRentals(space.id)" class="px-3 h-8 flex items-center gap-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all text-[10px] font-black uppercase tracking-tighter shadow-sm">
                    <i class="fas fa-plus"></i> Rental
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="md:hidden grid grid-cols-1 gap-4 p-4">
        <div v-for="space in filteredAndSortedSpaces" :key="space.id" class="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-4">
          <div class="flex justify-between items-start">
            <div>
              <p class="font-black text-gray-800 tracking-tight">{{ space.name }}</p>
              <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{{ space.location }}</p>
            </div>
            <span class="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-1 rounded-md">{{ space.capacity }} Seats</span>
          </div>
          
          <div class="grid grid-cols-2 gap-2 text-[11px]">
            <div class="bg-gray-50 p-2 rounded-lg border border-gray-100">
              <p class="text-gray-400 font-bold uppercase tracking-tighter">Daily Price</p>
              <p class="font-black text-gray-700">{{ space.price_daily }}</p>
            </div>
            <div class="bg-gray-50 p-2 rounded-lg border border-gray-100">
              <p class="text-gray-400 font-bold uppercase tracking-tighter">Monthly Price</p>
              <p class="font-black text-gray-700">{{ space.price_monthly }}</p>
            </div>
          </div>

          <div class="flex justify-between items-center pt-2 border-t border-gray-50">
            <button @click="goToZoneDetail(space.zone)" class="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1">
              <i class="fas fa-map"></i> Zone Link
            </button>
            <div class="flex gap-2">
              <button @click="editSpace(space)" class="p-2 text-green-500 hover:bg-green-50 rounded-lg"><i class="fas fa-edit"></i></button>
              <button @click="askDeleteConfirmation(space)" class="p-2 text-red-500 hover:bg-red-50 rounded-lg"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        </div>
      </div>

      <div class="px-6 py-6 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Showing Page <span class="text-primary">{{ currentPage }}</span> of {{ totalPages }}
        </p>
        <div class="flex gap-2">
          <button
            :disabled="!previous"
            @click="fetchSpaces(previous)"
            class="px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
          >
            <i class="fas fa-chevron-left mr-2"></i> Previous
          </button>
          <button
            :disabled="!next"
            @click="fetchSpaces(next)"
            class="px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all bg-primary text-white hover:bg-dprimary disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
          >
            Next <i class="fas fa-chevron-right ml-2"></i>
          </button>
        </div>
      </div>
    </div>

    <AddSpace :visible="showAddSpace" @close="showAddSpace = false" @success="fetchSpaces" />
    <UpdateCoworkspace :visible="updateVisible" :space="spaceToEdit" @close="updateVisible = false" @refresh="fetchSpaces" />
    <ConfirmModal
      v-if="confirmVisible"
      :visible="confirmVisible"
      title="Confirm Deletion"
      message="This action will permanently remove this co-working space and all associated booking configurations. Proceed?"
      @confirm="confirmDelete"
      @cancel="confirmVisible = false"
    />
  </div>
</template>


<script>
import Toast from "@/components/Toast.vue";
import AddSpace from "./Add.vue";
import UpdateCoworkspace from "./update.vue";
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
  name: "CoworkingSpacesView",
  components: { SortIcon, Toast, AddSpace, UpdateCoworkspace, ConfirmModal ,Loading},
  data() {
    return {
      searchTerm: "",
      sortKey: "name",
      sortAsc: true,
      spaces: [],
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
      pageSize: 10,
      pageSizes: [5, 10, 20, 50, 100],
      showAddSpace: false,
      updateVisible: false,
      spaceToEdit: null,
      confirmVisible: false,
      spaceToDelete: null,
      loading:false
    };
  },
  computed: {
    filteredAndSortedSpaces() {
      const term = this.searchTerm.toLowerCase();
      let filtered = this.spaces.filter(
        (space) =>
          space.name.toLowerCase().includes(term) ||
          space.location.toLowerCase().includes(term) ||
          space.description.toLowerCase().includes(term) ||
          String(space.capacity).includes(term) ||
          String(space.price_daily).includes(term) ||
          String(space.price_monthly).includes(term) ||
          String(space.price_quarterly).includes(term) ||
          String(space.price_yearly).includes(term) ||
          String(space.zone).includes(term)
      );

      filtered.sort((a, b) => {
        let aVal = a[this.sortKey];
        let bVal = b[this.sortKey];

        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return this.sortAsc ? -1 : 1;
        if (aVal > bVal) return this.sortAsc ? 1 : -1;
        return 0;
      });

      return filtered;
    },
  },
  mounted() {
    this.fetchSpaces();
  },
  methods: {
    goDetail(id){
       this.$router.push({
          name: "co-work-detail",
          params: { id: id},
        });
    },
    async fetchSpaces(url = null) {
      this.loading=true;
      try {
        const response = await this.$getCoworkingSpaces(url, this.pageSize);
        this.spaces = response.spaces || [];
        this.currentPage = response.currentPage || 1;
        this.totalPages = response.totalPages || 1;
        this.next = response.next;
        this.previous = response.previous;
      } catch (err) {
        console.error("Failed to fetch coworking spaces:", err);
        this.spaces = [];
      }finally{
        this.loading=false;
      }
    },
    sortBy(key) {
      if (this.sortKey === key) this.sortAsc = !this.sortAsc;
      else this.sortKey = key;
    },
    editSpace(space) {
      this.spaceToEdit = space;
      this.updateVisible = true;
    },
    askDeleteConfirmation(space) {
      this.spaceToDelete = space;
      this.confirmVisible = true;
    },
    async confirmDelete() {
      this.confirmVisible = false;
      try {
        await this.$apiDelete(`/delete_coworking_space/${this.spaceToDelete.id}`);
        this.$root.$refs.toast.showToast("Co-Working Space deleted successfully", "success");
        this.fetchSpaces();
      } catch (err) {
        console.error(err);
        this.$refs.toast.showToast("Failed to delete co-working space", "error");
      } finally {
        this.spaceToDelete = null;
      }
    },
    goToRentals(workspace_id) {
      this.$router.push({
        path: "/coworking-space-rentals",
        query: { workspace_id },
      });
    },
    goToZoneDetail(propertyZoneId) {
      if (propertyZoneId)
        this.$router.push({
          name: "zoneDetail",
          params: { id: propertyZoneId },
        });
    },
  },
};
</script>

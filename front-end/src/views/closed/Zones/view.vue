<template>
  <div class="min-h-screen bg-background p-4 md:p-2">
    <Toast ref="toast" />
    <Loading :visible="loading" message="Loading Property Zones..." />

    <div class="max-w-7xl mx-auto bg-white rounded-xl overflow-hidden border border-gray-100">
      
      <div class="bg-gradient-to-r from-dprimary to-primary px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-4">
          <div class="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white tracking-tight">Property Zones</h1>
            <p class="text-white/70 text-xs uppercase tracking-widest font-semibold">Real Estate Portfolio</p>
          </div>
        </div>

        <button
          v-if="$hasPermission('pms.add_propertyzone')"
          @click="visible = true"
          class="bg-white text-primary hover:bg-gray-50 font-bold px-6 py-2.5 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <span class="text-xl">+</span> Add Zone
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
              @input="onSearch"
              type="search"
              placeholder="Search by name, city, or address..."
              class="custom-input !mt-0 !pl-10 h-11 shadow-sm"
            />
          </div>

          <div class="flex items-center gap-4">
            <div class="flex items-center bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
              <label for="pageSize" class="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Show</label>
              <select
                id="pageSize"
                v-model="pageSize"
                @change="fetchZones()"
                class="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 cursor-pointer"
              >
                <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
              </select>
            </div>
            <div class="text-sm font-medium text-gray-500">
              Total: <span class="text-primary font-bold">{{ filteredAndSortedZones.length }}</span>
            </div>
          </div>
        </div>

        <div class="hidden lg:block overflow-hidden rounded-xl border border-gray-100 shadow-sm">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th @click="sortBy('name')" class="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest cursor-pointer hover:text-primary transition-colors">
                  <div class="flex items-center gap-1">Zone Name <SortIcon :field="'name'" :sort-key="sortKey" :sort-asc="sortAsc" /></div>
                </th>
                <th class="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Location Info</th>
                <th class="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Stakeholders</th>
                <th class="px-4 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">Map</th>
                <th class="px-4 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="zone in filteredAndSortedZones" :key="zone.id" class="hover:bg-primary/5 transition-colors group">
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{{ zone.name }}</div>
                  <div class="text-[10px] text-gray-400 font-mono">ID: {{ zone.id }}</div>
                </td>
                <td class="px-4 py-4">
                  <div class="text-xs text-gray-700 font-medium">{{ zone.address }}</div>
                  <div class="text-[11px] text-gray-400">{{ zone.city }}, {{ zone.state }}</div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-2">
                      <span class="text-[9px] font-black uppercase text-gray-400 w-12">Owner:</span>
                      <button @click="goToDetail(zone.owner_id)" class="text-xs font-bold text-blue-600 hover:underline">{{ zone.ownerName }}</button>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-[9px] font-black uppercase text-gray-400 w-12">Manager:</span>
                      <button @click="goToDetail(zone.manager_id)" class="text-xs font-bold text-primary hover:underline">{{ zone.managerName }}</button>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4 text-center">
                  <a :href="`https://www.google.com/maps/search/?api=1&query=${zone.latlong}`" target="_blank" 
                     class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-[10px] font-bold hover:bg-red-600 hover:text-white transition-all">
                    <i class="fa-solid fa-location-dot"></i> View
                  </a>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="flex justify-center items-center gap-2">
                    <button @click="goToZoneDetail(zone.id)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all shadow-sm" title="View Detail">
                      <i class="fas fa-eye text-xs"></i>
                    </button>
                    <button v-if="$hasPermission('pms.change_propertyzone')" @click="editZone(zone)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Edit">
                      <i class="fas fa-edit text-xs"></i>
                    </button>
                    <button @click="properties(zone.id)" class="px-3 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-800 hover:text-white transition-all text-[10px] font-black uppercase tracking-tighter" title="Units">
                      Units
                    </button>
                    <button @click="openSaleModal(zone.id)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-500 hover:text-white transition-all shadow-sm" title="List for Sale">
                      <i class="fas fa-tag text-xs"></i>
                    </button>
                    <button v-if="$hasPermission('pms.delete_propertyzone')" @click="askDeleteConfirmation(zone)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-secondary hover:bg-secondary hover:text-white transition-all shadow-sm" title="Delete">
                      <i class="fas fa-trash-alt text-xs"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="lg:hidden grid grid-cols-1 gap-4">
          <div v-for="zone in filteredAndSortedZones" :key="zone.id" class="bg-white rounded-2xl border border-gray-100 shadow-md p-5 relative overflow-hidden">
            <div class="absolute top-0 right-0 p-3">
               <span class="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-black uppercase">{{ zone.state }}</span>
            </div>
            
            <div class="flex flex-col gap-1 mb-4">
              <h3 class="font-bold text-gray-900 text-lg group-hover:text-primary transition-colors leading-tight">{{ zone.name }}</h3>
              <p class="text-xs text-gray-400 flex items-center gap-1">
                <i class="fas fa-map-marker-alt text-red-400"></i> {{ zone.city }}, {{ zone.address }}
              </p>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-5 p-3 bg-gray-50 rounded-xl">
              <div>
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Owner</p>
                <p class="text-xs font-bold text-gray-700 truncate">{{ zone.ownerName }}</p>
              </div>
              <div>
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Manager</p>
                <p class="text-xs font-bold text-gray-700 truncate">{{ zone.managerName }}</p>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <button @click="goToZoneDetail(zone.id)" class="flex-1 py-2 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-lg">Info</button>
              <button @click="editZone(zone)" class="flex-1 py-2 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-lg">Edit</button>
              <button @click="properties(zone.id)" class="flex-1 py-2 bg-gray-100 text-gray-600 text-[10px] font-black uppercase rounded-lg">Units</button>
              <button @click="openSaleModal(zone.id)" class="w-10 flex items-center justify-center bg-yellow-50 text-yellow-600 rounded-lg"><i class="fas fa-tag text-xs"></i></button>
            </div>
          </div>
        </div>

        <div class="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-100">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Showing Page <span class="text-primary">{{ currentPage }}</span> of {{ totalPages }}
          </p>
          <div class="flex gap-2">
            <button
              :disabled="currentPage <= 1"
              @click="changePage(currentPage - 1)"
              class="px-4 py-2 rounded-xl bg-gray-50 text-gray-400 font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-white disabled:opacity-30 transition-all shadow-sm"
            >
              Previous
            </button>
            <button
              :disabled="currentPage >= totalPages"
              @click="changePage(currentPage + 1)"
              class="px-4 py-2 rounded-xl bg-gray-50 text-gray-400 font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-white disabled:opacity-30 transition-all shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <AddZone v-if="visible" :visible="visible" @close="visible = false" @refresh="fetchZones" />
    <UpdateZone v-if="updateVisible" :visible="updateVisible" :zone="zoneToEdit" @close="updateVisible = false" @refresh="fetchZones" />
    <ConfirmModal v-if="confirmVisible" :visible="confirmVisible" title="Delete Zone" message="Are you sure you want to remove this property zone from the system?" @confirm="confirmDelete" @cancel="confirmVisible = false" />
    <SaleModal v-if="saleVisible" :visible="saleVisible" :propertyZoneId="salePropertyId" sourceType="zone" @close="saleVisible = false" @refresh="fetchZones" />
  </div>
</template>

<script>
import Toast from "../../../components/Toast.vue";
import AddZone from "./add.vue";
import UpdateZone from "./update.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import SaleModal from "../propertiesListForSale/add.vue";
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
  components: { AddZone, UpdateZone, ConfirmModal, SortIcon, Toast, SaleModal, Loading },
  data() {
    return {
      globalZones: [],
      visible: false,
      updateVisible: false,
      confirmVisible: false,
      zoneToEdit: null,
      zoneToDelete: null,
      searchTerm: "",
      sortKey: "name",
      sortAsc: true,
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,
      pageSizes: [1, 5, 10, 20, 50, 100],
      saleVisible: false,
      salePropertyId: null,
      loading: false,
    };
  },
  computed: {
    filteredAndSortedZones() {
      let sorted = [...this.globalZones];
      sorted.sort((a, b) => {
        let res = 0;
        if (a[this.sortKey] < b[this.sortKey]) res = -1;
        if (a[this.sortKey] > b[this.sortKey]) res = 1;
        return this.sortAsc ? res : -res;
      });
      return sorted;
    },
  },
  async mounted() {
    await this.fetchZones();
  },
  methods: {
    openSaleModal(propertyZoneId) {
      this.salePropertyId = propertyZoneId;
      this.saleVisible = true;
    },
    async fetchZones() {
      this.loading = true;
      try {
        const params = { ordering: "-id" };
        const url = `/get_property_zones?page=${this.currentPage}&page_size=${this.pageSize}&search=${this.searchTerm}`;
        const result = await this.$getZones(url, params);
        this.globalZones = result.zones;
        this.currentPage = result.currentPage;
        this.totalPages = result.totalPages;
      } catch (err) {
        console.error("Error fetching zones:", err);
        this.globalZones = [];
      } finally {
        this.loading = false;
      }
    },
    onSearch() {
      this.currentPage = 1;
      this.fetchZones();
    },
    changePage(page) {
      this.currentPage = page;
      this.fetchZones();
    },
    editZone(zone) {
      this.zoneToEdit = zone;
      this.updateVisible = true;
    },
    askDeleteConfirmation(zone) {
      this.zoneToDelete = zone;
      this.confirmVisible = true;
    },
    async confirmDelete() {
      this.confirmVisible = false;
      try {
        const response = await this.$apiDelete(
          `/delete_property_zone/${this.zoneToDelete.id}`
        );
        if (response && response.error) {
          this.$root.$refs.toast.showToast(
            response.error || "Failed to delete zone",
            "error"
          );
        } else {
          this.$root.$refs.toast.showToast(
            "Zone deleted successfully",
            "success"
          );
          await this.fetchZones();
        }
      } catch (err) {
        this.$root.$refs.toast.showToast("Failed to delete zone", "error");
        console.error(err);
      }
      this.zoneToDelete = null;
    },


    goToZoneDetail(propertyZoneId) {
      if (propertyZoneId)
        this.$router.push(`/zones/${propertyZoneId}`);
    },


    properties(zoneId) {
      this.$router.push(`/properties?zone=${zoneId}`);
    },
    goToDetail(id) {
      if (id) this.$router.push(`/user_detail/${id}`);
    },
    sortBy(field) {
      if (this.sortKey === field) this.sortAsc = !this.sortAsc;
      else {
        this.sortKey = field;
        this.sortAsc = true;
      }
    },
  },
};
</script>

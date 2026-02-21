<template>
  <div class="min-h-screen bg-[#f8fafc]">
    <Toast ref="toast" />

    <div class="px-6 pt-6 flex justify-between items-center">
      <button
        @click="$router.back()"
        class="group flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-primary hover:border-primary/30 transition-all shadow-sm"
      >
        <i class="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
        Back
      </button>
      
      <div class="flex items-center gap-3">
        <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Market Data</span>
      </div>
    </div>

    <div class="p-6">
      <div class="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
        
        <div class="bg-gradient-to-r from-dprimary to-primary px-8 py-8">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 class="text-2xl font-black text-white tracking-tight">Property Sale Listings</h1>
              <p class="text-white/60 text-xs font-bold uppercase tracking-[0.2em] mt-1">Global Asset Inventory</p>
            </div>
            
            <div class="relative max-w-md w-full">
              <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-black text-sm"></i>
              <input
                v-model="searchTerm"
                @input="onSearch"
                type="search"
                placeholder="Filter by zone or price..."
                class="w-full bg-white border border-white/20 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:bg-white focus:text-gray-900 focus:ring-4 focus:ring-white/10 transition-all"
              />
            </div>
          </div>
        </div>

        <div class="p-8">
          <div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-50 pb-6">
            <div class="flex items-center gap-4">
              <div class="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                <label for="pageSize" class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Show</label>
                <select
                  id="pageSize"
                  v-model="pageSize"
                  @change="fetchListings()"
                  class="bg-transparent font-black text-primary text-xs outline-none cursor-pointer"
                >
                  <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
                </select>
              </div>
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Items Per Page</span>
            </div>

            <div class="flex gap-2">
               <button @click="fetchListings()" class="p-2 text-gray-400 hover:text-primary transition-colors">
                 <i class="fas fa-sync-alt text-sm"></i>
               </button>
            </div>
          </div>

          <div class="hidden md:block overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-left border-b border-gray-100">
                  <th class="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Property Asset / Zone</th>
                  <th class="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Market Valuation</th>
                  <th class="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Engagement</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr
                  v-for="listing in listings"
                  :key="listing.id"
                  class="group hover:bg-gray-50/50 transition-all"
                >
                  <td class="px-4 py-5">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <i class="fas fa-map-marker-alt"></i>
                      </div>
                      <button
                        @click="goToZoneDetail(listing.property_zone_id?.id || listing.property_id?.id)"
                        class="text-sm font-black text-gray-700 hover:text-primary transition-colors text-left"
                      >
                        {{ listing.property_zone_id?.name || listing.property_id?.name || 'N/A' }}
                      </button>
                    </div>
                  </td>
                  <td class="px-4 py-5">
                    <div class="flex flex-col">
                      <span class="text-sm font-black text-emerald-600">{{ listing.listing_price?.toLocaleString() }} ETB</span>
                      <span class="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Asking Price</span>
                    </div>
                  </td>
                  <td class="px-4 py-5 text-center">
                    <button
                      @click="sale(listing.id)"
                      class="px-5 py-2.5 bg-white border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20 transition-all"
                    >
                      Process Sale
                    </button>
                  </td>
                </tr>
                <tr v-if="listings.length === 0">
                  <td colspan="3" class="text-center py-20">
                    <div class="flex flex-col items-center">
                      <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                        <i class="fas fa-box-open text-2xl"></i>
                      </div>
                      <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">No listings available</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="md:hidden space-y-4">
            <div
              v-for="listing in listings"
              :key="listing.id"
              class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary">
                    <i class="fas fa-home"></i>
                  </div>
                  <h3
                    class="font-black text-gray-800 text-sm leading-tight hover:text-primary transition-colors"
                    @click="goToZoneDetail(listing.property_zone_id?.id || listing.property_id?.id)"
                  >
                    {{ listing.property_zone_id?.name || listing.property_id?.name || 'N/A' }}
                  </h3>
                </div>
              </div>
              
              <div class="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
                <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Market Value</span>
                <span class="text-sm font-black text-emerald-600">${{ listing.listing_price }}</span>
              </div>

              <div class="flex gap-2">
                <button
                  @click="sale(listing.id)"
                  class="flex-1 px-4 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/10 transition-all"
                >
                  Process Sale
                </button>
                <button
                  @click="viewDetail(listing.id)"
                  class="px-4 py-3 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                >
                  Details
                </button>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row justify-between items-center mt-12 pt-8 border-t border-gray-50 gap-6">
            <div class="flex items-center gap-2">
              <button
                :disabled="!previous"
                @click="fetchListings(previous)"
                class="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-400 hover:text-primary hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <i class="fas fa-chevron-left text-xs"></i>
              </button>
              
              <div class="px-6 py-2 bg-gray-50 rounded-xl border border-gray-100">
                <span class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Page {{ currentPage }} / {{ totalPages }}</span>
              </div>

              <button
                :disabled="!next"
                @click="fetchListings(next)"
                class="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-400 hover:text-primary hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <i class="fas fa-chevron-right text-xs"></i>
              </button>
            </div>
            
            <p class="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Inventory sync active</p>
          </div>
        </div>
      </div>

      <AddPropertySaleListing
        v-if="visible"
        :visible="visible"
        @close="visible = false"
        @refresh="fetchListings"
      />

      <MakePropertySale
        v-if="saleVisible"
        :visible="saleVisible"
        :listing="selectedListing"
        @close="saleVisible = false"
        @success="fetchListings"
      />
    </div>
  </div>
</template>

<script>
import Toast from "@/components/Toast.vue";
import AddPropertySaleListing from "@/views/closed/propertiesListForSale/add.vue";
import MakePropertySale from "@/views/closed/propertiesListForSale/MakePropertySale.vue";

export default {
  name: "PropertySaleListingView",
  components: { Toast, AddPropertySaleListing,MakePropertySale },
  data() {
    return {
      listings: [],
      visible: false,
      searchTerm: "",
      saleVisible: false, // ✅ add this
      selectedListing: null, // ✅ add this
      next: null,
      previous: null,
      pageSize: 10,
      pageSizes: [5, 10, 20, 50, 100],
      currentPage: 1,
      totalPages: 1,
    };
  },
  mounted() {
   // alert("hii")
   
    this.fetchListings();
  },
  methods: {
    async fetchListings(url = `/get_property_zone_sales?search=${this.searchTerm}&page_size=${this.pageSize}`) {
      try {
        const response = await this.$apiGet(url);
        console.log("response listings", response);
        if (response && response.data) {
          this.listings = response.data || [];
          this.next = response.next;
          this.previous = response.previous;
          this.currentPage = response.current_page;
          this.totalPages = response.total_pages;
        }
      } catch (error) {
        console.error("Failed to fetch property sale listings:", error);
        this.listings = [];
      }
    },
    onSearch() {
      this.currentPage = 1;
      this.fetchListings();
    },
    goToZoneDetail(zoneId) {
      if (zoneId)
        this.$router.push({
          name: "PropertyZoneDetail",
          params: { id: zoneId },
        });
    },


    viewDetail(id) {
      this.$router.push({ name: "property-sale-detail", params: { id } });
    },
    

     sale(listingId) {
      const listing = this.listings.find((item) => item.id === listingId);
      if (listing) {
        this.selectedListing = listing;
        this.saleVisible = true;
      }
    },
    formatCurrency(value) {
      if (!value) return "N/A";
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    },
  },
};
</script>

<style scoped>
@media (max-width: 768px) {
  .card {
    transition: box-shadow 0.2s ease-in-out;
  }
  .card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
}
</style>

<template>
  <div class="min-h-screen bg-background p-4 md:p-2">
    <Toast ref="toast" />
    <Loading :visible="loading" message="Syncing Property Data..." />

    <div class="max-w-7xl mx-auto space-y-6">
      
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-black text-gray-800 tracking-tight">Real Estate Assets</h1>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Manage & Track Global Properties</p>
        </div>
        <button
          v-if="$hasPermission('pms.add_property')"
          @click="visible = true"
          class="bg-primary text-white font-black text-[11px] uppercase tracking-widest px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-dprimary hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          <i class="fas fa-plus"></i> New Property
        </button>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-wrap items-end gap-6">
        <div class="flex-1 min-w-[240px]">
          <label class="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-2 block">Quick Search</label>
          <div class="relative">
            <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm"></i>
            <input
              v-model="searchTerm"
              @input="fetchProperties()"
              type="search"
              placeholder="Filter by name, city or owner..."
              class="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl text-sm transition-all outline-none font-medium"
            />
          </div>
        </div>

        <div v-if="!zone_id_query_set" class="w-full md:w-48">
          <label class="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-2 block">Zone</label>
          <select v-model="zone_id" @change="fetchProperties()" class="w-full bg-gray-50 border border-transparent px-3 py-2.5 rounded-xl text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-primary/20 transition-all">
            <option value="">All Regions</option>
            <option v-for="zone in zones" :key="zone.id" :value="zone.id">{{ zone.name }}</option>
          </select>
        </div>

        <div class="w-full md:w-48">
          <label class="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-2 block">Asset Status</label>
          <select v-model="status" @change="fetchProperties()" class="w-full bg-gray-50 border border-transparent px-3 py-2.5 rounded-xl text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-primary/20 transition-all">
            <option value="">Everything</option>
            <option value="rent">Active Rent</option>
            <option value="sale">Listed for Sale</option>
            <option value="available">Vacant</option>
            <option value="under_maintenance">Maintenance</option>
          </select>
        </div>

        <div class="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
           <select v-model="pageSize" @change="fetchProperties()" class="bg-transparent text-[11px] font-black uppercase outline-none">
              <option v-for="size in pageSizes" :key="size" :value="size">{{ size }} Items</option>
           </select>
        </div>
      </div>

      <div class="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100">
              <th @click="changeOrdering('name')" class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-primary transition-colors">Property Asset</th>
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ownership/Management</th>
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Location Info</th>
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Current Status</th>
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="property in properties" :key="property.id" class="hover:bg-primary/[0.02] transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-primary font-black text-xs">
                    {{ property.name.substring(0,2).toUpperCase() }}
                  </div>
                  <div>
                    <p class="text-sm font-black text-gray-800">{{ property.name }}</p>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{{ property.property_type }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="text-[11px] text-gray-500 font-medium">Owner:</span>
                    <span @click="goToUserDetail(property.owner_id)" class="text-[11px] font-black text-gray-700 hover:text-primary cursor-pointer transition-colors">{{ property.ownerName }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-[11px] text-gray-500 font-medium">Manager:</span>
                    <span @click="goToUserDetail(property.manager_id)" class="text-[11px] font-black text-gray-700 hover:text-primary cursor-pointer transition-colors">{{ property.managerName }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-gray-700">{{ property.city }}</span>
                  <span @click="goToZoneDetail(property.property_zone_id)" class="text-[10px] font-black text-primary uppercase tracking-tighter cursor-pointer">{{ property.zoneName }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm"
                  :class="{
                    'bg-green-100 text-green-600': property.status === 'available',
                    'bg-blue-100 text-blue-600': property.status === 'rent',
                    'bg-orange-100 text-orange-600': property.status === 'sale',
                    'bg-pink-100 text-pink-600': property.status === 'under_maintenance'
                  }"
                >
                  {{ property.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
  <div class="flex justify-end gap-2 transition-opacity">
    <button @click="goToDetail(property.id)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-green-600 transition-all shadow-sm" title="View Detail">
      <i class="fas fa-eye text-xs"></i>
    </button>
    
    <button v-if="$hasPermission('pms.change_property')" @click="editProperty(property)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm" title="Edit">
      <i class="fas fa-edit text-xs"></i>
    </button>
    
    <button @click="rentPay(property.id)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-sm" title="Payments">
      <i class="fas fa-receipt text-xs"></i>
    </button>
    
    <button @click="openSaleModal(property.id)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-orange-50 hover:text-orange-600 transition-all shadow-sm" title="List Sale">
      <i class="fas fa-tag text-xs"></i>
    </button>
    
    <button v-if="$hasPermission('pms.delete_property')" @click="askDeleteConfirmation(property)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm" title="Delete">
      <i class="fas fa-trash-alt text-xs"></i>
    </button>
  </div>
</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="property in properties" :key="property.id" class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div class="absolute top-0 right-0 p-4">
            <span class="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded bg-gray-100 text-gray-400">#{{property.id}}</span>
          </div>
          <div class="flex items-start gap-4 mb-4">
            <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">{{ property.name.substring(0,1) }}</div>
            <div>
              <h3 class="font-black text-gray-800 tracking-tight">{{ property.name }}</h3>
              <p class="text-[10px] font-bold text-gray-400 uppercase">{{ property.city }} &bull; {{ property.property_type }}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
               <p class="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Owner</p>
               <p class="text-xs font-bold text-gray-700 truncate">{{ property.ownerName }}</p>
            </div>
            <div class="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-center">
               <p class="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Status</p>
               <p class="text-[10px] font-black uppercase" :class="property.status === 'available' ? 'text-green-500' : 'text-blue-500'">{{ property.status }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button @click="goToDetail(property.id)" class="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Detail View</button>
            <button @click="editProperty(property)" class="w-12 py-2.5 bg-gray-100 text-gray-500 rounded-xl flex justify-center"><i class="fas fa-edit text-xs"></i></button>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div class="text-[11px] font-black text-gray-400 uppercase tracking-widest">
          Showing <span class="text-gray-800">Page {{ currentPage }}</span> of {{ totalPages }}
        </div>
        <div class="flex gap-2">
          <button :disabled="!previous" @click="fetchProperties(previous)" class="px-5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-500 disabled:opacity-30 hover:bg-gray-100 transition-all">Previous</button>
          <button :disabled="!next" @click="fetchProperties(next)" class="px-5 py-2.5 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-md shadow-primary/20 disabled:opacity-30 hover:bg-dprimary transition-all">Next Page</button>
        </div>
      </div>
    </div>

    <AddProperty v-if="visible" :visible="visible" @close="visible = false" @refresh="fetchProperties" />
    <UpdateProperty v-if="updateVisible" :visible="updateVisible" :property="propertyToEdit" @close="updateVisible = false" @refresh="fetchProperties" />
    <ConfirmModal v-if="confirmVisible" :visible="confirmVisible" title="Delete Asset" message="This action is permanent. Do you want to remove this property?" @confirm="confirmDelete" @cancel="confirmVisible = false" />
    <SaleModal v-if="saleVisible" :visible="saleVisible" :propertyId="salePropertyId" sourceType="property" @close="saleVisible = false" @refresh="fetchProperties" />
  </div>
</template>

<script>
import AddProperty from "@/views/closed/proporty/add.vue";
import UpdateProperty from "@/views/closed/proporty/update.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import Toast from "../../../components/Toast.vue";
import Manager from "../managers/add.vue";
import SaleModal from "../propertiesListForSale/add.vue";
import Loading from "@/components/Loading.vue"; // <-- Added Loading

export default {
  name: "PropertyView",
  components: { AddProperty, UpdateProperty, ConfirmModal, Toast, Manager,SaleModal,Loading },
  data() {
    return {
      zones: [],
      zone_id: "",
      zone_id_query_set: false,
      properties: [],
      visible: false,
      updateVisible: false,
      confirmVisible: false,
      propertyToEdit: null,
      propertyToDelete: null,
      searchTerm: "",
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
      pageSize: 10,
      pageSizes: [5, 10, 20, 50, 100],
      ordering: "-id", // default ordering
      status:"",
      is_super_user:false,
      saleVisible: false,
      salePropertyId: null,
      loading: false,
    };
  },
 async  created(){
    this.is_super_user=localStorage.getItem('is_superuser');
    if (this.$route.query.zone_id) {
      this.zone_id_query_set = true;
    }
   
   
    const resultZones = await this.$getZones();
    this.zones = resultZones.zones;
     console.log("this.zones", resultZones);

        await this.fetchProperties();

  },
  async mounted() {
  
  },
  methods: {

    openSaleModal(propertyId) {
  this.salePropertyId = propertyId;
  this.saleVisible = true;
},
    //if per(view_property)
    async fetchProperties(url = null) {
       this.loading = true;
      try {
        let params={};
        const pageUrl =
          url ||
          `/get_properties?page=${this.currentPage}&page_size=${this.pageSize}&search=${this.searchTerm}&ordering=${this.ordering}`;

        let result = [];
        if (this.$route.query.zone_id || this.zone_id) {
           params = {
            property_zone_id: this.$route.query.zone_id || this.zone_id,
            status:this.status
          };
          console.log("params properties",params)
          result = await this.$getProperties(pageUrl, params);
        }else if(this.searchTerm){
           params={
             status:this.status,
             search:this.searchTerm
          }
          result = await this.$getProperties(pageUrl,params);
        }
        
        
        else {
           params={
             status:this.status
          }
          result = await this.$getProperties(pageUrl,params);
        }

        this.properties = result.properties;
        this.currentPage = result.currentPage;
        this.totalPages = result.totalPages;
        this.next = result.next;
        this.previous = result.previous;
      } catch (err) {
        console.error("Failed to fetch properties", err);
        this.properties = [];
        this.currentPage = 1;
        this.totalPages = 1;
        this.next = null;
        this.previous = null;
      }
      finally {
        this.loading = false;
      }
    },
    changeOrdering(field) {
      if (this.ordering === field) {
        this.ordering = `-${field}`;
      } else {
        this.ordering = field;
      }
      this.fetchProperties();
    },
    editProperty(property) {
      this.propertyToEdit = property;
      this.updateVisible = true;
    },
    askDeleteConfirmation(property) {
      this.propertyToDelete = property;
      this.confirmVisible = true;
    },
    async confirmDelete() {
      this.confirmVisible = false;
      try {
        const res = await this.$apiDelete(
          `/delete_property/${this.propertyToDelete.id}`
        );
        if (res && res.error){
      this.$root.$refs.toast.showToast(res.error || "Failed to delete property", "error");

        } else{
        this.$root.$refs.toast.showToast(res.message, "success");
        await this.fetchProperties();
        }
      } catch (err) {
        console.error(err);
       this.$root.$refs.toast.showToast("Failed to delete property", "error");
      }
      this.propertyToDelete = null;
    },
    goToUserDetail(id) {
      this.$router.push(`/user_detail/${id}`);
    },
    goToZoneDetail(id) {
      this.$router.push(`/zones/${id}`);
    },
    goToDetail(propertyId) {
      if (propertyId)
        this.$router.push({
          name: "PropertyDetail",
          params: { id: propertyId },
        });
    },
    rentPay(propertyId) {
      if (propertyId)
        this.$router.push({ name: "rentPay", params: { id: propertyId } });
    },
    managers(property_id) {
      this.$router.push({ path: "/managers", query: { property_id } });
    },
  },
};
</script>

<style scoped>
/* Medium screens 768px–1150px → two filters per row */
@media (max-width: 1150px) and (min-width: 768px) {
  .filters-container > div {
    width: 48%;
    margin-bottom: 1rem;
  }
}

/* Small screens <768px → stacked vertically */
@media (max-width: 767px) {
  .filters-container > div {
    width: 100%;
    margin-bottom: 1rem;
  }
}
</style>

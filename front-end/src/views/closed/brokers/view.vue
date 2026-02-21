<template>
  <div class="min-h-screen bg-background p-4 md:p-2">
    <Toast ref="toast" />
    <Loading :visible="loading" message="Syncing Broker Directory..." />

    <div class="max-w-7xl mx-auto bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
      
      <div class="bg-gradient-to-r from-dprimary to-primary px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-4">
          <div class="bg-white/20 p-2.5 rounded-xl backdrop-blur-md text-white">
            <i class="fas fa-handshake text-2xl"></i>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white tracking-tight">Broker Management</h1>
            <p class="text-white/70 text-[10px] uppercase tracking-widest font-black">Authorized Sales & Property Representatives</p>
          </div>
        </div>

        <button
          @click="showAddBroker = true"
          class="bg-white text-primary hover:bg-gray-50 font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <i class="fas fa-plus-circle"></i> Add Broker
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
            placeholder="Search brokers by name, license, or wallet..."
            @input="onSearchInput"
            class="custom-input !mt-0 !pl-10 h-11 shadow-sm border-gray-200 focus:border-primary"
          />
        </div>

        <div class="flex items-center gap-3 self-end lg:self-center">
          <span class="text-[11px] font-black text-gray-400 uppercase tracking-widest">Show</span>
          <select
            v-model="pageSize"
            @change="fetchBrokers"
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
              <th class="px-6 py-5 cursor-pointer hover:text-primary transition-colors" @click="sortBy('name')">
                Broker Identity 
                <SortIcon :field="'name'" :sort-key="sortKey" :sort-asc="sortAsc" />
              </th>
              <th class="px-6 py-5">Professional Info</th>
              <th class="px-6 py-5">Financial Details</th>
              <th class="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="broker in brokers" :key="broker.id" class="hover:bg-primary/5 transition-all group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20 uppercase">
                    {{ broker.first_name[0] }}{{ broker.last_name[0] }}
                  </div>
                  <div>
                    <div class="text-sm font-black text-gray-800 tracking-tight">
                      {{ broker.first_name }} {{ broker.middle_name }} {{ broker.last_name }}
                    </div>
                    <div class="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{{ broker.email }}</div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-2 text-xs font-bold text-gray-700">
                    <i class="fas fa-id-badge text-primary/50 text-[10px]"></i>
                    {{ broker.license_number }}
                  </div>
                  <div class="text-[10px] text-gray-400 uppercase font-black tracking-widest">License Number</div>
                </div>
              </td>

              <td class="px-6 py-4">
                <div class="flex flex-col gap-1">
                  <div class="text-xs font-bold text-gray-700 flex items-center gap-2">
                    <span class="px-2 py-0.5 bg-green-50 text-green-600 rounded border border-green-100">{{ broker.commission_rate }}%</span>
                    <span class="text-gray-300 font-light">|</span>
                    <span class="truncate max-w-[150px] italic text-gray-500 font-medium">{{ broker.wallet }}</span>
                  </div>
                  <div class="text-[10px] text-gray-400 uppercase font-black tracking-widest text-right mr-auto">Rate & Wallet</div>
                </div>
              </td>

              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <button @click="goToUserDetail(broker.user)" 
                    class="h-8 px-3 flex items-center gap-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all text-[11px] font-bold uppercase tracking-wider shadow-sm">
                    <i class="fas fa-info-circle"></i>
                  </button>
                  
                  <button @click="openUpdateModal(broker)"
                    class="h-8 w-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all border border-green-100 shadow-sm">
                    <i class="fas fa-edit text-xs"></i>
                  </button>

                  <button @click="askDeleteConfirmation(broker)"
                    class="h-8 w-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all border border-red-100 shadow-sm">
                    <i class="fas fa-trash-alt text-xs"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="brokers.length === 0">
              <td colspan="4" class="text-center py-12">
                <i class="fas fa-users-slash text-gray-200 text-4xl mb-3 block"></i>
                <p class="text-gray-400 text-xs font-bold uppercase tracking-widest">No brokers found in the directory.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="md:hidden p-4 space-y-4">
        <div v-for="broker in brokers" :key="broker.id" class="bg-gray-50 border border-gray-100 rounded-2xl p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-black text-gray-800 text-sm tracking-tight">
              {{ broker.first_name }} {{ broker.last_name }}
            </h3>
            <span class="px-2 py-1 bg-white border border-gray-200 text-[10px] font-black text-primary rounded-lg shadow-sm">
              {{ broker.commission_rate }}%
            </span>
          </div>
          
          <div class="space-y-3 mb-4">
            <div class="flex items-center gap-3">
              <i class="fas fa-id-card text-gray-400 w-4 text-xs"></i>
              <p class="text-[11px] text-gray-600 font-bold uppercase tracking-tight">{{ broker.license_number }}</p>
            </div>
            <div class="flex items-center gap-3">
              <i class="fas fa-wallet text-gray-400 w-4 text-xs"></i>
              <p class="text-[11px] text-gray-500 italic truncate">{{ broker.wallet }}</p>
            </div>
          </div>

          <div class="flex gap-2 pt-4 border-t border-gray-100">
            <button @click="goToUserDetail(broker.user)" class="flex-1 py-2 bg-white border border-gray-200 rounded-lg text-[10px] font-black text-gray-600 uppercase tracking-widest">Details</button>
            <button @click="openUpdateModal(broker)" class="w-10 h-10 bg-green-50 text-green-600 border border-green-100 rounded-lg flex items-center justify-center"><i class="fas fa-edit"></i></button>
            <button @click="askDeleteConfirmation(broker)" class="w-10 h-10 bg-red-50 text-red-600 border border-red-100 rounded-lg flex items-center justify-center"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>

      <div class="bg-gray-50/50 px-6 py-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Showing Page {{ currentPage }} of {{ totalPages }}</p>
        <div class="flex gap-2">
          <button :disabled="!previous" @click="fetchBrokers(previous)" class="px-5 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase text-gray-400 hover:text-primary disabled:opacity-30 transition-all shadow-sm">Prev</button>
          <button :disabled="!next" @click="fetchBrokers(next)" class="px-5 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase text-gray-400 hover:text-primary disabled:opacity-30 transition-all shadow-sm">Next</button>
        </div>
      </div>
    </div>

    <AddBroker :visible="showAddBroker" @close="showAddBroker = false" @success="fetchBrokers" />
    <UpdateBroker :visible="showUpdateModal" :broker="selectedBroker" @close="showUpdateModal = false" @success="fetchBrokers" />
    <ConfirmModal :visible="confirmVisible" title="Confirm Deletion" message="Are you sure you want to delete this broker record?" @confirm="confirmDelete" @cancel="confirmVisible = false" />
  </div>
</template>


<script>
import Toast from "@/components/Toast.vue";
import AddBroker from "./Add.vue";
import UpdateBroker from "./Update.vue";
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
  name: "BrokersView",
  components: { Toast, AddBroker, UpdateBroker, ConfirmModal, SortIcon ,Loading},
  data() {
    return {
      selectedBrokerId: null,
      searchTerm: "",
      brokers: [],
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
      pageSize: 5,
      pageSizes: [5, 10, 20, 50, 100],
      showAddBroker: false,
      showUpdateModal: false,
      confirmVisible: false,
      brokerToDelete: null,
      sortKey: "name",
      sortAsc: true,
      searchTimeout: null,
      selectedBroker: null,
      loading:false,
    };
  },
  mounted() {
    this.fetchBrokers();
  },
  methods: {
    goToUserDetail(id) {
      this.$router.push(`/user_detail/${id}`);
    },
   openUpdateModal(broker) {
  this.selectedBroker = { ...broker }; // Clone full object
  this.showUpdateModal = true;
}
,
    // Debounced search input
    onSearchInput() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.fetchBrokers();
      }, 300);
    },

    async fetchBrokers(customUrl = null) {
      this.loading=true
      try {
        let url = customUrl || "get_broker_profiles";
        const params = {
          user__first_name:this.searchTerm,
          page_size: this.pageSize,
          
        };
        const res = await this.$apiGet(url, params);
        const data = res.data || [];
        this.brokers = data.results || data;
        // fetch user details for each broker
        await Promise.all(
          this.brokers.map(async (broker) => {
            try {
              const userRes = await this.$apiGetById(`/get_user`,broker.user);
              console.log("userRes",userRes);
              broker.user = userRes.id;
              broker.first_name=userRes.first_name;
              broker.middle_name=userRes.middle_name;
              broker.last_name=userRes.last_name;
            } catch (err) {
              console.error("Failed to fetch user", err);
              broker.userObj = { first_name: "", middle_name: "", last_name: "" };
            }
            
          })
        );

        console.log("brokers",this.brokers);

        this.currentPage = data.current_page || 1;
        this.totalPages = data.total_pages || 1;
        this.next = data.next;
        this.previous = data.previous;
      } catch (err) {
        console.error("Failed to fetch brokers:", err);
        this.brokers = [];
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

    askDeleteConfirmation(broker) {
      this.brokerToDelete = broker;
      this.confirmVisible = true;
    },

    async confirmDelete() {
      this.confirmVisible = false;
      try {
        await this.$apiDelete(`/delete_broker/${this.brokerToDelete.id}`);
        this.$root.$refs.toast.showToast("Broker deleted successfully", "success");
        this.fetchBrokers();
      } catch (err) {
        console.error(err);
        this.$refs.toast.showToast("Failed to delete broker", "error");
      } finally {
        this.brokerToDelete = null;
      }
    },
  },
};
</script>

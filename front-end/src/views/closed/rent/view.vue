<template>
  <div class="min-h-screen bg-[#f8fafc]">
    <Toast ref="toast" />
    <Loading :visible="loading" message="Syncing ledger..." />

    <div class="px-6 pt-6 flex justify-between items-center">
      <button
        @click="$router.back()"
        class="group flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-primary hover:border-primary/30 transition-all shadow-sm"
      >
        <i class="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
        Back
      </button>
      
      <div class="flex items-center gap-4">
        <div class="hidden sm:flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Billing System</span>
        </div>
      </div>
    </div>

    <div class="p-2">
      <div class="bg-white rounded-xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
        
        <div class="bg-gradient-to-r from-dprimary to-primary px-8 py-8">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 class="text-2xl font-black text-white tracking-tight">Lease & Rent Ledger</h1>
              <p class="text-white/60 text-xs font-bold uppercase tracking-[0.2em] mt-1">Tenant Occupancy & Financials</p>
            </div>
            
            <button
              @click="visible = true"
              class="bg-white/10 hover:bg-white text-white hover:text-primary px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all border border-white/20 hover:border-transparent flex items-center justify-center gap-2"
            >
              <i class="fas fa-plus"></i>
              Create New Lease
            </button>
          </div>
        </div>

        <div class="p-8">
          <div class="flex flex-col lg:flex-row justify-between items-center mb-8 gap-6 border-b border-gray-50 pb-8">
            <div class="relative w-full lg:max-w-md group">
              <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors"></i>
              <input
                v-model="searchTerm"
                @input="onSearch"
                type="search"
                placeholder="Search tenant or property..."
                class="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
              />
            </div>

            <div class="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
              <div class="flex items-center px-4 space-x-2">
                <label for="pageSize" class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Show</label>
                <select id="pageSize" v-model="pageSize" @change="fetchRents()" class="bg-transparent font-black text-primary text-xs outline-none">
                  <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="hidden lg:block overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-left">
                  <th class="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Agreement</th>
                  <th class="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Timeline</th>
                  <th class="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Finances</th>
                  <th class="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Status</th>
                  <th class="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="rent in rents" :key="rent.id" class="group hover:bg-gray-50/50 transition-all">
                  <td class="px-4 py-5">
                    <div class="space-y-1">
                      <p @click="goToPropertyDetail(rent.property_id.id)" class="text-sm font-black text-gray-700 hover:text-primary cursor-pointer transition-colors">{{ rent.property_id?.name || 'N/A' }}</p>
                      <div @click="goToUserDetail(rent.user_id.id)" class="flex items-center gap-2 text-[11px] font-bold text-gray-400 hover:text-primary cursor-pointer transition-colors">
                        <i class="fas fa-user-circle text-[9px]"></i>
                        {{ rent.user_id?.first_name }} {{ rent.user_id?.last_name }}
                      </div>
                    </div>
                  </td>

                  <td class="px-4 py-5">
                    <div class="flex flex-col">
                      <span class="text-[11px] font-black text-gray-600 tracking-tight">{{ new Date(rent.start_date).toLocaleDateString() }}</span>
                      <span class="text-[9px] font-bold text-gray-300 uppercase">Ends: {{ new Date(rent.end_date).toLocaleDateString() }}</span>
                    </div>
                  </td>

                  <td class="px-4 py-5">
                    <div class="flex flex-col">
                      <span class="text-sm font-black text-primary">{{ rent.rent_amount }}</span>
                      <span class="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{{ rent.payment_cycle }} Cycle</span>
                    </div>
                  </td>

                  <td class="px-4 py-5 text-center">
                    <span
                      class="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest inline-block"
                      :class="rent.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'"
                    >
                      {{ rent.status }}
                    </span>
                  </td>

                  <td class="px-4 py-5 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button @click="selectedRentId = rent.id; showModal = true" class="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm" title="Pay Rent">
                        <i class="fas fa-credit-card"></i>
                      </button>
                      <button @click="rentDetail(rent.id)" class="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button @click="goToPayments(rent.id)" class="px-3 py-2.5 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-900 hover:text-white transition-all">
                        Ledger
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="lg:hidden space-y-4">
            <div v-for="rent in rents" :key="rent.id" class="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
              <div class="flex justify-between items-start">
                <div @click="goToPropertyDetail(rent.property_id.id)">
                  <h3 class="font-black text-gray-800 text-sm tracking-tight leading-none mb-1">{{ rent.property_id?.name || 'N/A' }}</h3>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ rent.user_id?.first_name }} {{ rent.user_id?.last_name }}</p>
                </div>
                <span class="px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest" :class="rent.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'">
                  {{ rent.status }}
                </span>
              </div>
              
              <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                <div>
                  <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Rent</p>
                  <p class="text-sm font-black text-primary">{{ rent.rent_amount }}</p>
                </div>
                <div>
                  <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Cycle</p>
                  <p class="text-[11px] font-bold text-gray-700 uppercase">{{ rent.payment_cycle }}</p>
                </div>
              </div>

              <div class="flex gap-2">
                <button @click="selectedRentId = rent.id; showModal = true" class="flex-1 bg-emerald-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Pay Rent</button>
                <button @click="goToPayments(rent.id)" class="flex-1 bg-gray-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Payments</button>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row justify-between items-center mt-12 pt-8 border-t border-gray-50 gap-6">
            <div class="flex items-center gap-2">
              <button :disabled="!previous" @click="fetchRents(previous)" class="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-400 hover:border-primary hover:text-primary disabled:opacity-30 transition-all shadow-sm">
                <i class="fas fa-chevron-left text-xs"></i>
              </button>
              <div class="px-6 py-2 bg-gray-50 rounded-xl border border-gray-100">
                <span class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Page {{ currentPage }} / {{ totalPages }}</span>
              </div>
              <button :disabled="!next" @click="fetchRents(next)" class="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-400 hover:border-primary hover:text-primary disabled:opacity-30 transition-all shadow-sm">
                <i class="fas fa-chevron-right text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AddPictureModal v-if="addPictureVisible" :visible="addPictureVisible" :rentId="selectedRentId" @close="addPictureVisible = false" @refresh="fetchRents" />
    <MakePaymentModal v-if="showModal" :visible="showModal" :rentId="selectedRentId" @close="showModal = false" @success="handlePaymentSuccess" />
    <AddRent v-if="visible" :propertyId="$route.params.id" :visible="visible" @close="visible = false" @refresh="fetchRents" />
    <UpdateRent v-if="updateVisible" :visible="updateVisible" :rent="rentToEdit" @close="updateVisible = false" @refresh="fetchRents" />
    <ConfirmModal v-if="confirmVisible" :visible="confirmVisible" title="Confirm Deletion" message="Are you sure you want to delete this rent?" @confirm="confirmDelete" @cancel="confirmVisible = false" />
  </div>
</template>

<script>
import AddRent from "@/views/closed/rent/add.vue";
import UpdateRent from "@/views/closed/rent/update.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import Toast from "@/components/Toast.vue";
import AddPictureModal from "@/views/closed/rent/addRentPicture.vue";
import MakePaymentModal from "@/views/closed/rent/addRentPayment.vue";
import Loading from "@/components/Loading.vue"; // <-- Added Loading

export default {
  name: "RentsView",
  components: {
    AddRent,
    UpdateRent,
    ConfirmModal,
    Toast,
    AddPictureModal,
    MakePaymentModal,
    Loading
  },
  data() {
    return {
      selectedRentId: "",
      addPictureVisible: false,
      searchTerm: "",
      visible: false,
      updateVisible: false,
      confirmVisible: false,
      rentToEdit: null,
      rentToDelete: null,
      sortKey: "property_id",
      sortAsc: true,
      rents: [],
      showModal: false,
      pageSize: 10,
      pageSizes: [5, 10, 20, 50, 100],
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
     loading:false
    };
  },
  computed: {
    filteredAndSortedRents() {
      let sorted = [...this.rents];
      sorted.sort((a, b) => {
        let valA = a[this.sortKey];
        let valB = b[this.sortKey];
        if (this.sortKey === "property_id") {
          valA = a.property_id?.name || "";
          valB = b.property_id?.name || "";
        }
        if (this.sortKey === "user_id") {
          valA = a.user_id?.first_name || "";
          valB = b.user_id?.first_name || "";
        }
        if (valA < valB) return this.sortAsc ? -1 : 1;
        if (valA > valB) return this.sortAsc ? 1 : -1;
        return 0;
      });
      return sorted;
    },
  },
  mounted() {
    this.fetchRents();
  },
  methods: {
    goToPayments(rentId) {
      this.$router.push({ name: "rents_payment_detail", params: { id: rentId } });
    },
    rentDetail(rentId) {
      this.$router.push({ name: "rent-detail", params: { id: rentId } });
    },
    buildRoleParams(params = {}) {
      const isSuperUser =
        localStorage.getItem("is_superuser") === "1" ||
        localStorage.getItem("is_superuser") === "true";
      const groups = JSON.parse(localStorage.getItem("groups") || "[]");
      const email = localStorage.getItem("email");

      if (!isSuperUser) {
        if (groups.includes("manager")) {
          params["property_id__property_zone_id__manager_id__email"] = email;
         
        } else if (groups.includes("owner")) {
          params["property_id__property_zone_id__owner_id__email"] = email;
             
        } else if (groups.includes("staff")) {
          params["property_id__property_zone_id__staff_id__email"] = email;
            
        }
      }
      return params;
    },
    async fetchRents(url = `/get_rents?search=${this.searchTerm}&page_size=${this.pageSize}`) {
      this.loading=true
      try {
        const params = this.buildRoleParams();
        const response = await this.$apiGet(url, params);
       console.log("response rents",response);

        if (response && response.data) {
          this.rents = response.data || [];
          this.next = response.next;
          this.previous = response.previous;
          this.currentPage = response.current_page;
          this.totalPages = response.total_pages;
        }
      } catch (error) {
        console.error("Failed to fetch rents:", error);
        this.rents = [];
      }
      finally {
        this.loading=false
      }
    },
    goToPropertyDetail(propertyId) {
      if (propertyId)
        this.$router.push({
          name: "PropertyDetail",
          params: { id: propertyId },
        });
    },
    goToUserDetail(id) {
      this.$router.push(`/user_detail/${id}`);
    },
    onSearch() {
      this.currentPage = 1;
      this.fetchRents();
    },
    sortBy(key) {
      if (this.sortKey === key) this.sortAsc = !this.sortAsc;
      else {
        this.sortKey = key;
        this.sortAsc = true;
      }
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

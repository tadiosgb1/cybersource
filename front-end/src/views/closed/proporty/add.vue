<template>
  <div>
    <Toast ref="toast" />

    <div
      v-if="visible"
      class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300 overflow-y-auto"
    >
      <div 
        class="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col my-auto border border-gray-100 animate-in fade-in zoom-in duration-200"
      >
        <div class="rounded-2xl bg-gradient-to-r from-dprimary to-primary px-8 py-6 flex justify-between items-center shrink-0">
          <div class="flex items-center gap-4 text-white">
            <div class="p-3 bg-white/20 rounded-xl backdrop-blur-md">
              <i class="fas fa-building text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-black tracking-tight">Register New Asset</h2>
              <p class="text-white/70 text-[10px] uppercase tracking-[0.2em] font-bold">Property Management System</p>
            </div>
          </div>
          <button 
            @click="$emit('close')" 
            class="w-10 h-10 flex items-center justify-center rounded-full bg-black/10 text-white hover:bg-white/20 transition-all active:scale-95"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="p-8 overflow-y-auto max-h-[75vh]">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div class="md:col-span-1 space-y-6">
              <div class="flex items-center gap-2 mb-2 border-b border-gray-100 pb-2">
                <i class="fas fa-user-shield text-primary text-xs"></i>
                <h3 class="text-[11px] font-black text-gray-400 uppercase tracking-widest">Management</h3>
              </div>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-[10px] font-black text-gray-500 uppercase mb-1.5 ml-1">Property Manager</label>
         <select v-model="form.manager_id"
        class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm
               focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all
               outline-none font-medium">

  <option value="" disabled>Select Manager</option>

  <option v-for="item in managers"
          :key="item.manager?.id || item.id"
          :value="item.manager?.id || item.id"
          class="text-black">

    {{ (item.manager?.first_name || item.first_name) }}
    {{ (item.manager?.middle_name || item.middle_name) }}
    {{ (item.manager?.last_name || item.last_name) }}

  </option>
</select>


                </div>

                <div>
                  <label class="block text-[10px] font-black text-gray-500 uppercase mb-1.5 ml-1">Assigned Zone</label>
                  <select v-model="form.property_zone_id" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium">
                    <option value="" disabled>Select Zone</option>
                    <option v-for="zone in zones" :key="zone.id" :value="zone.id">{{ zone.name }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[10px] font-black text-gray-500 uppercase mb-1.5 ml-1">Asset Category</label>
                  <select v-model="form.property_type" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium">
                    <option value="" disabled>Select Type</option>
                    <option value="land">Land</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="room">Room</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="md:col-span-2 space-y-6">
              <div class="flex items-center gap-2 mb-2 border-b border-gray-100 pb-2">
                <i class="fas fa-map-marked-alt text-primary text-xs"></i>
                <h3 class="text-[11px] font-black text-gray-400 uppercase tracking-widest">Physical & Financial Details</h3>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-[10px] font-black text-gray-500 uppercase mb-1.5 ml-1">Property Display Name</label>
                  <input v-model="form.name" type="text" placeholder="e.g. Sunset Heights Villa" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-bold" required />
                </div>

                <div class="md:col-span-2">
                  <label class="block text-[10px] font-black text-gray-500 uppercase mb-1.5 ml-1">Street Address</label>
                  <input v-model="form.address" type="text" placeholder="House no, Street name..." class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                </div>

                <div>
                  <label class="block text-[10px] font-black text-gray-500 uppercase mb-1.5 ml-1">City</label>
                  <input v-model="form.city" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                </div>

                  <div>
                  <label class="block text-[10px] font-black text-gray-500 uppercase mb-1.5 ml-1">Block Number</label>
                  <input v-model="form.block_number" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                </div>

                   <div>
                  <label class="block text-[10px] font-black text-gray-500 uppercase mb-1.5 ml-1">Floor Number</label>
                  <input v-model="form.floor_number" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                </div>

                   <div>
                  <label class="block text-[10px] font-black text-gray-500 uppercase mb-1.5 ml-1">House Number</label>
                  <input v-model="form.house_number" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                </div>

                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block text-[10px] font-black text-gray-500 uppercase mb-1.5 ml-1">State</label>
                    <input v-model="form.state" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                  </div>


                  <div>
                    <label class="block text-[10px] font-black text-gray-500 uppercase mb-1.5 ml-1">ZIP</label>
                    <input v-model="form.zip_code" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                  </div>
                </div>

                <div class="p-4 bg-primary/5 rounded-2xl border border-primary/10 grid grid-cols-2 gap-4 md:col-span-2">
                  <div>
                    <label class="block text-[10px] font-black text-primary uppercase mb-1.5">Monthly Rent</label>
                    <div class="relative">
                      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">$</span>
                      <input v-model.number="form.rent" type="number" class="w-full bg-white border border-primary/20 rounded-xl pl-8 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none font-black text-gray-700" />
                    </div>
                  </div>
                  <div>
                    <label class="block text-[10px] font-black text-orange-600 uppercase mb-1.5">Selling Price</label>
                    <div class="relative">
                      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-orange-600 font-bold">$</span>
                      <input v-model.number="form.price" type="number" class="w-full bg-white border border-orange-200 rounded-xl pl-8 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-200 outline-none font-black text-gray-700" />
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-3 md:col-span-2">
                   <div>
                    <label class="block text-[9px] font-black text-gray-400 uppercase mb-1 ml-1">Area (sqft)</label>
                    <input v-model="form.area" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold" />
                  </div>
                  <div>
                    <label class="block text-[9px] font-black text-gray-400 uppercase mb-1 ml-1">Bedrooms</label>
                    <input v-model.number="form.bed_rooms" type="number" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold" />
                  </div>
                  <div>
                    <label class="block text-[9px] font-black text-gray-400 uppercase mb-1 ml-1">Bathrooms</label>
                    <input v-model.number="form.bath_rooms" type="number" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold" />
                  </div>
                </div>
              </div>
            </div>

            <div class="md:col-span-3 pt-4">
              <div class="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                <div class="flex items-center gap-2">
                  <i class="fas fa-concierge-bell text-primary text-xs"></i>
                  <h3 class="text-[11px] font-black text-gray-400 uppercase tracking-widest">Additional Amenities</h3>
                </div>
                <button type="button" @click="addAmenity" class="text-[10px] font-black text-primary hover:text-dprimary uppercase tracking-tighter flex items-center gap-1 transition-colors">
                  <i class="fas fa-plus-circle"></i> Add Row
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  v-for="(item, index) in amenities"
                  :key="index"
                  class="flex gap-2 items-center bg-gray-50 p-2 rounded-xl border border-gray-100 group animate-in slide-in-from-left-2 duration-200"
                >
                  <input v-model="item.amenity" placeholder="e.g. High-speed Wifi" class="bg-white border-none rounded-lg px-3 py-2 text-xs w-1/2 shadow-sm outline-none focus:ring-1 focus:ring-primary/30 font-medium" />
                  <input v-model="item.value" placeholder="e.g. Free" class="bg-white border-none rounded-lg px-3 py-2 text-xs w-1/2 shadow-sm outline-none focus:ring-1 focus:ring-primary/30 font-medium" />
                  <button
                    v-if="amenities.length > 1"
                    type="button"
                    @click="removeAmenity(index)"
                    class="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <i class="fas fa-minus-circle text-sm"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-4">
             <button
              type="button"
              @click="$emit('close')"
              class="px-8 py-3 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button type="submit" class="bg-primary hover:bg-dprimary text-white font-black text-[11px] uppercase tracking-widest px-10 py-4 rounded-xl shadow-xl shadow-primary/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2">
              <i class="fas fa-save"></i> Complete Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from "../../../components/Toast.vue";

export default {
  name: "AddProperty",
  components: { Toast },
  props: {
    visible: Boolean,
  },
  data() {
    return {
      managers: [],
      zones: [],
      amenities: [{ amenity: "", value: "" }],
      form: {
        property_zone_id: "",
        owner_id: localStorage.getItem("userId"),
        manager_id: "",
        name: "",
        property_type: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        price: "",
        bed_rooms: "",
        bath_rooms: "",
        rent: "",
        status: "available",
        area: "",
        description: "", // 🔴 backend field
        block_number:"",
        floor_number:"",
        house_number:"",
      },
    };
  },

  async mounted() {
    // Managers
    if (localStorage.getItem("is_superuser") == "true") {
      const res = await this.$apiGet(`/get_managers`);
      this.managers = res.data || [];
    } else {
      const res = await this.$apiGet(`/get_owner_managers`, {
        owner__id: localStorage.getItem("userId"),
      });
      this.managers = res.data || [];
      
      console.log("this.managers and the response ",this.managers,res);

    }

    // Zones
    const result = await this.$getZones();

    console.log("zone result",result);

    this.zones = result.zones || [];

    
  },

  methods: {
    addAmenity() {
      this.amenities.push({ amenity: "", value: "" });
    },
    removeAmenity(index) {
      this.amenities.splice(index, 1);
    },

    async submitForm() {
      // 🔥 Convert amenities → description
      this.form.description = this.amenities
        .filter(a => a.amenity && a.value)
        .map(a => `${a.amenity.trim()}:"${a.value.trim()}"`)
        .join(",");

      try {
        await this.$apiPost("/post_property", this.form);
        this.$root.$refs.toast.showToast("Property saved successfully", "success");
        this.$emit("refresh");
        this.$emit("close");
        this.resetForm();
      } catch (err) {
        console.error(err);
        this.$root.$refs.toast.showToast("Failed to save property", "error");
      }
    },

    resetForm() {
      this.form = {
        property_zone_id: "",
        owner_id: localStorage.getItem("userId"),
        manager_id: "",
        name: "",
        property_type: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        price: "",
        bed_rooms: "",
        bath_rooms: "",
        rent: "",
        status: "available",
        area: "",
        description: "",
      };
      this.amenities = [{ amenity: "", value: "" }];
    },
  },
};
</script>

<style scoped>
.custom-input {
  @apply w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500;
}
</style>

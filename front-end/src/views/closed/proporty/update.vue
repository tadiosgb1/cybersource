<template>
  <div>
    <Toast ref="toast" />

    <div
      v-if="visible"
      class="fixed inset-0 z-[70] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300"
    >
      <div class="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100 animate-in zoom-in duration-200">
        
        <div class="bg-gradient-to-r from-dprimary to-primary px-8 py-6 flex justify-between items-center shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur-md">
              <i class="fas fa-edit text-lg"></i>
            </div>
            <div>
              <h2 class="text-lg font-black text-white tracking-tight leading-none">Update Asset</h2>
              <p class="text-white/60 text-[10px] uppercase tracking-widest font-bold mt-1">Refine Property Intelligence</p>
            </div>
          </div>
          <button @click="$emit('close')" class="w-8 h-8 flex items-center justify-center rounded-full bg-black/10 text-white hover:bg-white/20 transition-all">
            <i class="fas fa-times text-xs"></i>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="flex-1 overflow-y-auto p-8 space-y-8">
          
          <div class="space-y-4">
            <h3 class="text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b border-primary/10 pb-2">1. Identity & Management</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-1">
                <label class="block text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Asset Name</label>
                <input v-model="form.name" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" required />
              </div>
              <div class="space-y-1">
                <label class="block text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Asset Type</label>
                <select v-model="form.property_type" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none">
                  <option value="">Select Type</option>
                  <option value="land">Land</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="room">Room</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="block text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Property Zone</label>
                <select v-model="form.property_zone_id" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none">
                  <option value="">Select Zone</option>
                  <option v-for="zone in zones" :key="zone.id" :value="zone.id">{{ zone.name }}</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="block text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Assigned Manager</label>
                <select v-model="form.manager_id" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none">
                  <option value="">Select Manager</option>
                  <option v-for="manager in managers" :key="manager.manager.id" :value="manager.manager.id">
                    {{ manager.manager.first_name }} {{ manager.manager.middle_name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] border-b border-gray-100 pb-2">2. Geolocation Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2 space-y-1">
                <label class="block text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Street Address</label>
                <input v-model="form.address" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
              <div class="space-y-1">
                <label class="block text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">City</label>
                <input v-model="form.city" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
               <div class="space-y-1">
                <label class="block text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Block Number</label>
                <input v-model="form.block_number" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>


                <div class="space-y-1">
                <label class="block text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Floor Number</label>
                <input v-model="form.floor_number" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>

                <div class="space-y-1">
                <label class="block text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">House Number</label>
                <input v-model="form.house_number" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="block text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">State</label>
                  <input v-model="form.state" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                </div>
                <div class="space-y-1">
                  <label class="block text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">ZIP Code</label>
                  <input v-model="form.zip_code" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] border-b border-gray-100 pb-2">3. Financials & Configuration</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div class="space-y-1">
                <label class="block text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Sale Price</label>
                <input v-model.number="form.price" type="number" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-orange-600 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all" />
              </div>
              <div class="space-y-1">
                <label class="block text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Monthly Rent</label>
                <input v-model.number="form.rent" type="number" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-primary focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all" />
              </div>
              <div class="space-y-1">
                <label class="block text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Bedrooms</label>
                <input v-model.number="form.bed_rooms" type="number" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
              <div class="space-y-1">
                <label class="block text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Bathrooms</label>
                <input v-model.number="form.bath_rooms" type="number" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex justify-between items-center border-b border-gray-100 pb-2">
              <h3 class="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">4. Amenities Portfolio</h3>
              <button type="button" @click="addAmenity" class="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">+ Add Row</button>
            </div>
            
            <div class="space-y-3">
              <div
                v-for="(item, index) in amenities"
                :key="index"
                class="flex gap-3 items-center group"
              >
                <input v-model="item.amenity" placeholder="Amenity Name" class="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:bg-white focus:border-primary outline-none transition-all" />
                <input v-model="item.value" placeholder="Value (e.g. Yes/No/2)" class="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:bg-white focus:border-primary outline-none transition-all" />
                <button
                  v-if="amenities.length > 1"
                  type="button"
                  @click="removeAmenity(index)"
                  class="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <i class="fas fa-trash-alt text-xs"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="sticky bottom-0 bg-white pt-6 pb-2 mt-12 border-t border-gray-100 flex items-center gap-4 shrink-0">
            <button 
              type="button" 
              @click="$emit('close')" 
              class="flex-1 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-all"
            >
              Discard Changes
            </button>
            <button 
              type="submit" 
              class="flex-[2] bg-primary hover:bg-dprimary text-white font-black text-[11px] uppercase tracking-widest px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              <i class="fas fa-save"></i> Synchronize Data
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
  name: "UpdateProperty",
  components: { Toast },
  props: {
    visible: Boolean,
    property: Object,
  },
  data() {
    return {
      zones: [],
      managers: [],
      amenities: [{ amenity: "", value: "" }],
      form: {},
    };
  },

  watch: {
    property: {
      immediate: true,
      handler(val) {
        if (!val) return;
        this.form = { ...val };
        this.amenities = this.parseAmenities(val.description);
      },
    },
  },

  async mounted() {
    const zones = await this.$getZones();
    this.zones = zones.zones || [];

    const res =
      localStorage.getItem("is_superuser") === "true"
        ? await this.$apiGet("/get_managers")
        : await this.$apiGet("/get_owner_managers", {
            owner__id: localStorage.getItem("userId"),
          });

    this.managers = res.data || [];
  },

  methods: {
    parseAmenities(description) {
      if (!description) return [{ amenity: "", value: "" }];

      return description.split(",").map(pair => {
        const [key, value] = pair.split(":");
        return {
          amenity: key?.trim() || "",
          value: value?.replace(/"/g, "").trim() || "",
        };
      });
    },

    addAmenity() {
      this.amenities.push({ amenity: "", value: "" });
    },

    removeAmenity(index) {
      this.amenities.splice(index, 1);
    },

    async submitForm() {
      // Combine amenities into description
      this.form.description = this.amenities
        .filter(a => a.amenity && a.value)
        .map(a => `${a.amenity.trim()}:"${a.value.trim()}"`)
        .join(",");

      try {
        await this.$apiPut("/update_property", this.form.id, this.form);
        this.$root.$refs.toast.showToast("Property updated successfully", "success");
        this.$emit("refresh");
        this.$emit("close");
      } catch (err) {
        console.error(err);
        this.$root.$refs.toast.showToast("Failed to update property", "error");
      }
    },
  },
};
</script>

<style scoped>
.custom-input {
  @apply w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500;
}
</style>

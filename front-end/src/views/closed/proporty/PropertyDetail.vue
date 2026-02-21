<template>
  <div class="min-h-screen bg-gray-50 pb-12">
    <Toast ref="toast" />
    <Loading :visible="loading" message="Loading Property Details..." />

    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-6 py-6 flex flex-wrap justify-between items-center gap-4">
        <div v-if="property" class="flex items-center gap-4">
          <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <i class="fas fa-building text-2xl"></i>
          </div>
          <div>
            <h1 class="text-2xl font-black text-gray-900 tracking-tight">{{ property.name }}</h1>
            <div class="flex items-center gap-2 mt-1">
              <span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-md">{{ property.status }}</span>
              <span class="text-gray-400 text-xs font-medium"><i class="fas fa-map-marker-alt mr-1"></i> {{ property.city }}, {{ property.state }}</span>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-400 font-bold uppercase tracking-widest animate-pulse">Loading Assets...</p>

        <div class="flex items-center gap-3">
          <button
            v-if="property && $hasPermission('pms.change_property')"
            @click="editProperty(property)"
            class="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <i class="fas fa-edit text-blue-500"></i> Edit Property
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 mt-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2 space-y-8">
          
          <div v-if="property" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <p class="text-[10px] font-black text-gray-400 uppercase mb-1">Rent Price</p>
              <p class="text-lg font-black text-primary">{{ property.rent }}</p>
            </div>
            <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <p class="text-[10px] font-black text-gray-400 uppercase mb-1">Selling Price</p>
              <p class="text-lg font-black text-orange-600">{{ property.price?.toLocaleString() }}</p>
            </div>
            <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <p class="text-[10px] font-black text-gray-400 uppercase mb-1">Type</p>
              <p class="text-lg font-black text-gray-700 capitalize">{{ property.property_type }}</p>
            </div>

              <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <p class="text-[10px] font-black text-gray-400 uppercase mb-1">Block Number</p>
              <p class="text-lg font-black text-gray-700 capitalize">{{ property.block_number }}</p>
            </div>

                  <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <p class="text-[10px] font-black text-gray-400 uppercase mb-1">House Number</p>
              <p class="text-lg font-black text-gray-700 capitalize">{{ property.house_number }}</p>
            </div>

                  <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <p class="text-[10px] font-black text-gray-400 uppercase mb-1">Floor Number</p>
              <p class="text-lg font-black text-gray-700 capitalize">{{ property.floor_number }}</p>
            </div>

             <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <p class="text-[10px] font-black text-gray-400 uppercase mb-1">Configuration</p>
              <p class="text-sm font-black text-gray-700">{{ property.bed_rooms }} BD | {{ property.bath_rooms }} BA</p>
            </div>
          </div>

          <div v-if="property" class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
             <div class="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
               <h3 class="text-xs font-black text-gray-500 uppercase tracking-widest">General Specifications</h3>
             </div>
             <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <div class="flex justify-between border-b border-gray-50 pb-2">
                  <span class="text-gray-400 text-xs font-bold uppercase">ZIP Code</span>
                  <span class="text-gray-700 text-xs font-black">{{ property.zip_code }}</span>
                </div>
                <div class="flex justify-between border-b border-gray-50 pb-2">
                  <span class="text-gray-400 text-xs font-bold uppercase">Created</span>
                  <span class="text-gray-700 text-xs font-black">{{ property.created_at }}</span>
                </div>
                <div class="flex justify-between border-b border-gray-50 pb-2">
                  <span class="text-gray-400 text-xs font-bold uppercase">Full Address</span>
                  <span class="text-gray-700 text-xs font-black">{{ property.address }}</span>
                </div>
                <div class="flex justify-between border-b border-gray-50 pb-2">
                  <span class="text-gray-400 text-xs font-bold uppercase">Last Updated</span>
                  <span class="text-gray-700 text-xs font-black">{{ property.updated_at || "N/A" }}</span>
                </div>
             </div>
          </div>

          <div v-if="amenities.length" class="space-y-4">
            <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Amenities & Features</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                v-for="(item, index) in amenities"
                :key="index"
                class="flex justify-between items-center bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100"
              >
                <span class="font-black text-[11px] text-gray-600 uppercase tracking-tight">{{ item.amenity }}</span>
                <span class="text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg">{{ item.value }}</span>
              </div>
            </div>
          </div>

          <div v-if="property" class="space-y-4 pt-4">
             <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Maintenance History</h3>
             <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <Maintenance
                  :visible="true"
                  :propertyId="property.id"
                  @close="maintenanceView = false"
                />
             </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="flex justify-between items-end px-1">
            <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest">Media Gallery</h3>
            <button
              @click="addPictureVisible = true"
              class="text-[10px] font-black text-white bg-primary px-3 py-1.5 rounded-lg hover:bg-dprimary transition-colors uppercase"
            >
              <i class="fas fa-plus mr-1"></i> Add
            </button>
          </div>

          <div v-if="property?.property_pictures?.length" class="space-y-4">
            <div
              v-for="pic in visiblePictures"
              :key="pic.id"
              class="group bg-white rounded-3xl p-3 border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
            >
              <div class="aspect-video rounded-2xl overflow-hidden mb-3 relative">
                <img
                  :src="pic.property_image"
                  :alt="pic.description"
                  class="object-cover w-full h-full cursor-pointer transition-transform duration-500 group-hover:scale-105"
                  @click="previewImage(pic.property_image)"
                />
                <div class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click.stop="openUpdatePicture(pic)" class="w-8 h-8 bg-white/90 backdrop-blur rounded-full text-blue-600 text-xs shadow-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                    <i class="fas fa-pen"></i>
                  </button>
                  <button @click.stop="askDeletePicture(pic)" class="w-8 h-8 bg-white/90 backdrop-blur rounded-full text-red-600 text-xs shadow-lg flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              <p class="text-xs font-bold text-gray-600 px-1 truncate">{{ pic.description }}</p>
            </div>

            <button
              v-if="remainingPicturesCount > 0 && !showAllPictures"
              @click="showAllPictures = true"
              class="w-full py-4 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 font-black text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-all"
            >
              +{{ remainingPicturesCount }} More Images
            </button>
          </div>
          <div v-else class="bg-gray-100 rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
             <i class="fas fa-images text-gray-300 text-3xl mb-2"></i>
             <p class="text-gray-400 text-xs font-bold uppercase tracking-widest">No Photos</p>
          </div>
        </div>

      </div>
    </div>

    <AddPictureModal
      v-if="addPictureVisible && property"
      :visible="addPictureVisible"
      :propertyId="property.id"
      :propertyName="property.name"
      @close="addPictureVisible = false"
      @refresh="fetchProperty"
    />
    <UpdatePictureModal
      v-if="updatePictureVisible && property"
      :visible="updatePictureVisible"
      :picture="pictureToUpdate"
      :propertyId="property.id"
      @close="updatePictureVisible = false"
      @refresh="fetchProperty"
    />
    <ConfirmModal
      v-if="confirmDeleteVisible"
      :visible="confirmDeleteVisible"
      title="Confirm Delete"
      message="Are you sure you want to delete this picture?"
      @confirm="confirmDeletePicture"
      @cancel="confirmDeleteVisible = false"
    />
    <UpdateProperty
      v-if="updateVisible"
      :visible="updateVisible"
      :property="propertyToEdit"
      @close="updateVisible = false"
      @refresh="fetchProperty"
    />

    <div
      v-if="imagePreviewVisible"
      class="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] backdrop-blur-sm transition-all"
      @click="imagePreviewVisible = false"
    >
      <img
        :src="imageToPreview"
        alt="Preview"
        class="max-h-[85vh] max-w-[90vw] rounded-xl shadow-2xl ring-4 ring-white/10"
        @click.stop
      />
      <button
        @click="imagePreviewVisible = false"
        class="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center text-xl transition-all"
      >
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script>
import AddPictureModal from "@/views/closed/proporty/AddPropertyPicture.vue";
import UpdatePictureModal from "@/views/closed/proporty/UpdatePropertyPicture.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import UpdateProperty from "@/views/closed/proporty/update.vue";
import Toast from "../../../components/Toast.vue";
import Maintenance from "@/views/closed/maintenanceRequests/view1.vue";
import Loading from "@/components/Loading.vue";

export default {
  name: "PropertyDetail",
  components: {
    AddPictureModal,
    UpdatePictureModal,
    UpdateProperty,
    ConfirmModal,
    Toast,
    Maintenance,
    Loading,
  },
  data() {
    return {
      property: null,
      addPictureVisible: false,
      updatePictureVisible: false,
      pictureToUpdate: null,
      confirmDeleteVisible: false,
      pictureToDelete: null,
      showAllPictures: false,
      maintenanceView: false,
      imagePreviewVisible: false,
      imageToPreview: null,
      updateVisible: false,
      propertyToEdit: null,
      loading: false,
    };
  },
  computed: {
    amenities() {
      if (!this.property?.description) return [];
      return this.property.description.split(",").map(pair => {
        const [key, value] = pair.split(":");
        return {
          amenity: key?.trim() || "",
          value: value?.replace(/"/g, "").trim() || "",
        };
      });
    },
    visiblePictures() {
      if (!this.property?.property_pictures) return [];
      if (this.showAllPictures) return this.property.property_pictures;
      return this.property.property_pictures.slice(0, 3);
    },
    remainingPicturesCount() {
      if (!this.property?.property_pictures) return 0;
      return Math.max(0, this.property.property_pictures.length - 3);
    },
  },
  mounted() {
    this.fetchProperty();
  },
  methods: {
    editProperty(property) {
      this.propertyToEdit = property;
      this.updateVisible = true;
    },
    async fetchProperty() {
      this.loading = true;
      try {
        const res = await this.$apiGet(`/get_property/${this.$route.params.id}`);
        this.property = res.data || res;
      } catch (err) {
        console.error("Failed to fetch property details", err);
        this.$refs.toast.showToast("Could not load property details.", "error");
      } finally {
        this.loading = false;
      }
    },
    openUpdatePicture(picture) {
      this.pictureToUpdate = picture;
      this.updatePictureVisible = true;
    },
    askDeletePicture(picture) {
      this.pictureToDelete = picture;
      this.confirmDeleteVisible = true;
    },
    async confirmDeletePicture() {
      this.confirmDeleteVisible = false;
      if (!this.pictureToDelete) return;
      try {
        const res = await this.$apiDelete(`/delete_property_picture/${this.pictureToDelete.id}`);
        this.$root.$refs.toast.showToast(res.message || "Picture deleted successfully", "success");
        this.fetchProperty();
      } catch (err) {
        console.error(err);
        this.$root.$refs.toast.showToast("Failed to delete picture.", "error");
      }
      this.pictureToDelete = null;
    },
    previewImage(imageUrl) {
      this.imageToPreview = imageUrl;
      this.imagePreviewVisible = true;
    },
  },
};
</script>

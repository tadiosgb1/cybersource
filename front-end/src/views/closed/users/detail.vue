<template>
  <div class="min-h-screen bg-gray-100 p-4 md:p-8">
    <Loading :visible="loading" message="Loading user details..." />

    <div v-if="user" class="max-w-6xl mx-auto">
      <div class="bg-white shadow-md rounded-lg overflow-hidden border border-gray-300">
        
        <div class="bg-primary text-white px-6 py-4 flex justify-between items-center">
          <h2 class="text-xl font-bold flex items-center gap-2">
            <i class="fas fa-user-circle"></i> User Detail: {{ user.first_name }} {{ user.last_name }}
          </h2>
          <button @click="$router.go(-1)" class="bg-white text-primary px-3 py-1 rounded text-sm font-bold hover:bg-gray-100 transition">
            <i class="fas fa-arrow-left"></i> Back
          </button>
        </div>

        <div class="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div class="lg:col-span-2 space-y-6">
            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">General Profile</h3>
              
              <form @submit.prevent="saveProfile(user)" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-gray-600 font-bold text-sm mb-1">First Name</label>
                    <input type="text" v-model="user.first_name" class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label class="block text-gray-600 font-bold text-sm mb-1">Middle Name</label>
                    <input type="text" v-model="user.middle_name" class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label class="block text-gray-600 font-bold text-sm mb-1">Last Name</label>
                    <input type="text" v-model="user.last_name" class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-gray-600 font-bold text-sm mb-1">Email</label>
                    <input type="email" v-model="user.email" class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label class="block text-gray-600 font-bold text-sm mb-1">Phone</label>
                    <input type="text" v-model="user.phone_number" class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>

                <div>
                  <label class="block text-gray-600 font-bold text-sm mb-1">Address</label>
                  <input type="text" v-model="user.address" class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                <div class="flex flex-wrap gap-6 py-4 bg-gray-50 px-4 rounded border border-gray-200">
                  <div class="flex items-center space-x-2">
                    <input type="checkbox" v-model="user.is_active" id="active" class="h-4 w-4 text-blue-600" />
                    <label for="active" class="text-gray-700 font-semibold">Active</label>
                  </div>
                  <div class="flex items-center space-x-2">
                    <input type="checkbox" v-model="user.is_staff" id="staff" class="h-4 w-4 text-blue-600" />
                    <label for="staff" class="text-gray-700 font-semibold">Staff</label>
                  </div>
                  <div class="flex items-center space-x-2">
                    <input type="checkbox" v-model="user.is_superuser" id="superuser" class="h-4 w-4 text-blue-600" />
                    <label for="superuser" class="text-gray-700 font-semibold">Superuser</label>
                  </div>
                </div>

                <div class="flex justify-start">
                  <button type="submit" class="bg-blue-600 text-white font-bold px-6 py-2 rounded shadow hover:bg-blue-700 transition">
                    Save Profile
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="space-y-6">
            <div class="border border-gray-200 rounded-lg p-4 bg-white">
              <label class="block text-gray-500 font-bold text-xs uppercase mb-1">Date Joined</label>
              <div class="text-gray-800 font-semibold bg-gray-100 p-2 rounded">
                {{ formatDate(user.date_joined) }}
              </div>
            </div>

            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <div class="bg-gray-200 px-4 py-2 flex justify-between items-center">
                <h3 class="font-bold text-gray-700 text-sm uppercase">Groups</h3>
                <button @click="showGroupsModal = true" class="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase">Edit</button>
              </div>
              <div class="p-4 flex flex-wrap gap-1 max-h-40 overflow-y-auto">
                <span v-for="group in user.groups" :key="group" class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold border border-green-200">
                  {{ group }}
                </span>
                <span v-if="user.groups.length === 0" class="text-gray-400 text-xs italic">No Groups Assigned</span>
              </div>
            </div>

            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <div class="bg-gray-200 px-4 py-2 flex justify-between items-center">
                <h3 class="font-bold text-gray-700 text-sm uppercase">Permissions</h3>
                <button @click="showPermissionsModal = true" class="text-purple-600 hover:text-purple-800 text-xs font-bold uppercase">Edit</button>
              </div>
              <div class="p-4 flex flex-wrap gap-1 max-h-48 overflow-y-auto">
                <span v-for="perm in user.user_permissions" :key="perm" class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-[10px] font-semibold border border-blue-200">
                  {{ perm }}
                </span>
                <span v-if="user.user_permissions.length === 0" class="text-gray-400 text-xs italic">No Direct Permissions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EditGroupsModal
      v-if="showGroupsModal"
      :groups="user.groups"
      :userId="user.id"
      @close="showGroupsModal = false; fetchUser();"
    />
    <EditPermissionsModal
      v-if="showPermissionsModal"
      :permissions="user.user_permissions"
      :userId="user.id"
      @close="showPermissionsModal = false; fetchUser();"
    />
  </div>
</template>

<script>
import EditGroupsModal from "./EditGroupsModal.vue";
import EditPermissionsModal from "./EditPermissionsModal.vue";
import Loading from "@/components/Loading.vue";


export default {
  name: "UserDetail",
  components: { EditGroupsModal, EditPermissionsModal,Loading },
  data() {
    return {
      user: null,
      showGroupsModal: false,
      showPermissionsModal: false,
      loading:false,
    };
  },
  mounted() {
    this.fetchUser();
  },
  methods: {
    async fetchUser() {
      this.loading=true;
      try {
        const userId = this.$route.params.id;
        const res = await this.$apiGetById("/get_user", userId);
        this.user = res;
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }finally{
        this.loading=false;
      }
    },
    async saveProfile(user) {
      console.log("user", user);
      const payload = {
        address: user.address,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        middle_name: user.middle_name,
        phone_number: user.phone_number,
        date_joined: user.date_joined,
        last_login: user.last_login,
        is_active: user.is_active,
        is_staff: user.is_staff,
        is_superuser: user.is_superuser,
      };
      try {
        // Custom API to update user profile
        await this.$apiPut(`/old_update_user`, user.id, payload).then((res) => {
          this.$root.$refs.toast.showToast(res.message, "success");
        });
      } catch (err) {
        console.error("Failed to save profile:", err);
        this.$root.$refs.toast.showToast(err.message, "error");
      }
    },
    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleString();
    },
  },
};
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
</style>

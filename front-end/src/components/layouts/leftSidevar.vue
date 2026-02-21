<template>
  <div>
    <transition name="slide">
      <aside
        class="w-64 flex flex-col fixed md:relative z-15 h-full transition-all duration-300 bg-white mt-0 lg:mt-1 border-r border-slate-100 custom-scrollbar"
      >
        <div
          v-if="showTitle"
          class="flex flex-row items-center space-x-4 p-4 font-black text-lg text-white bg-primary sticky top-0 z-10 shadow-md"
        >
          <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <img
              src="../../assets/img/logo1.jpg"
              alt="Logo"
              class="h-8 w-8 rounded-lg"
            />
          </div>
          <p class="tracking-tight">Alpha PMS</p>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar pt-4">
          <ul class="px-3 space-y-1">
            <li v-for="item in filteredMenuItems" :key="item.route">
              <router-link
                :to="{ name: item.route }"
                class="group flex items-center px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 relative overflow-hidden"
                :class="[
                  $route.name === item.route 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-primary hover:bg-slate-50 hover:text-secondary'
                ]"
              >
                <i
                  :class="[
                    item.icon, 
                    'w-5 text-base mr-3 transition-colors duration-200',
                    $route.name === item.route ? 'text-white' : 'text-icon group-hover:text-icon'
                  ]"
                ></i>
                
                <span class="whitespace-nowrap tracking-tight">{{ item.name }}</span>

                <div 
                  v-if="$route.name === item.route" 
                  class="absolute right-0 w-1.5 h-6 bg-white/30 rounded-l-full"
                ></div>
              </router-link>
            </li>
          </ul>

          <div class="h-10"></div>
        </div>
      </aside>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showTitle: false,
      is_superuser: false,
      menuItems: [
        { name: "Dashboard", route: "first-dash", icon: "fas fa-gauge" },
        { name: "Configurations", route: "configurations", icon: "fas fa-gear", is_superuser: true },
        { name: "Subscriptions", route: "subscriptions_view", icon: "fas fa-receipt", permission: "pms.view_subscription" },
        { name: "Groups", route: "groups", icon: "fas fa-layer-group", permission: "auth.view_group" },
        { name: "Permissions", route: "permissions_view", icon: "fas fa-shield-halved", permission: "auth.view_permission" },
        { name: "Users", route: "user_view", icon: "fas fa-user", permission: "pms.view_user" },
        { name: "Zones", route: "zones", icon: "fas fa-map-location-dot", permission: "pms.view_propertyzone" },
        { name: "Coworking Spaces", route: "coworking-spaces", icon: "fas fa-people-roof" },
        { name: "Properties", route: "properties", icon: "fas fa-building", permission: "pms.view_property" },
        { name: "For Sale", route: "propertiesListForSale", icon: "fas fa-tag" },
        { name: "Rent Management", route: "rents", icon: "fas fa-file-contract", permission: "pms.view_rent" },
        { name: "Shared Rentals", route: "coworking-space-rentals", icon: "fas fa-file-signature" },
        { name: "Maintenance", route: "maintenance-requests", icon: "fas fa-screwdriver-wrench", permission: "pms.view_maintenancerequest" },
        { name: "Payments", route: "payments", icon: "fas fa-money-bill-transfer" },
        { name: "Transactions", route: "transactions", icon: "fas fa-arrows-rotate" },
        { name: "Reports", route: "reports", icon: "fas fa-chart-pie" },
        { name: "Notifications", route: "notifications", icon: "fas fa-bell" },
        { name: "Contacts", route: "contacts", icon: "fas fa-address-book" },
      ],
    };
  },

  computed: {
    filteredMenuItems() {
      return this.menuItems.filter(item => {
        if (item.is_superuser && !this.is_superuser) return false;
        if (item.permission) return this.$hasPermission(item.permission);
        return true;
      });
    },
  },

  mounted() {
    this.is_superuser = localStorage.getItem("is_superuser") === "true";
    this.showTitle = window.innerWidth < 1024;
  },
};
</script>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from, .slide-leave-to {
  transform: translateX(-100%);
}
</style>

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
          <p class="tracking-tight">Wegagen Donations</p>
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

       {
      name: "Users",
      route: "Users-view",
      icon: "fas fa-folder",
      color: "#22c55e"
    },
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

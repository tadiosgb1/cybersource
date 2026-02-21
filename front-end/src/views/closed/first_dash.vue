<template>
  <div class="p-6 bg-slate-50 min-h-screen">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-800 tracking-tight">Dashboard</h1>
        <p class="text-sm text-slate-500 font-medium uppercase tracking-widest text-[10px]">Overview and Analytics</p>
      </div>
      <div class="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-200">
        <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        <span class="text-xs font-bold text-slate-600 uppercase tracking-tighter">Live System Status</span>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div
        v-for="(value, key) in stats"
        :key="key"
        class="bg-white shadow-sm rounded-[1.5rem] p-6 flex flex-col justify-between border border-slate-200 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
      >
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] mb-1">
              {{ key.replace("total", "").trim() }}
            </h2>
            <p class="text-3xl font-black text-slate-800 group-hover:text-primary transition-colors">{{ value }}</p>
          </div>
          <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
            <i class="fas fa-chart-line text-sm"></i>
          </div>
        </div>
        <div class="mt-4 border-t border-slate-50 pt-3 flex items-center justify-between">
          <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Updated Just Now</span>
          <i class="fas fa-chevron-right text-[8px] text-slate-300"></i>
        </div>
      </div>
    </div>

    <div v-if="is_superuser == 'true'"
      class="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 mb-10 overflow-hidden"
    >
      <div class="p-8 pb-0">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
              <i class="fas fa-crown"></i>
            </div>
            <div>
              <h2 class="text-xl font-black text-slate-800 tracking-tight uppercase">Pricing Plan Analytics</h2>
              <p class="text-xs font-bold text-slate-400">Revenue and Tier Performance</p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
            <div class="flex items-center gap-2">
              <input
                type="date"
                v-model="start_date"
                class="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 outline-none transition"
              />
              <span class="text-slate-300 text-xs">to</span>
              <input
                type="date"
                v-model="end_date"
                class="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 outline-none transition"
              />
            </div>
            <button
              @click="refreshAllReports"
              class="bg-dprimary hover:bg-primary text-white font-black text-[10px] tracking-widest px-6 py-3 rounded-xl shadow-lg shadow-dprimary/20 transition-all active:scale-95 uppercase"
            >
              Fetch Report
            </button>
          </div>
        </div>

        <div class="bg-slate-50/50 rounded-3xl p-4 border border-slate-50">
          <apexchart
            type="line"
            height="350"
            :options="pricingChartOptions"
            :series="pricingSeries"
          />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 space-y-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div class="flex items-center gap-3">
          <div class="w-2 h-8 bg-primary rounded-full"></div>
          <h2 class="text-xl font-black text-slate-800 tracking-tight uppercase">Income / Expense Overview</h2>
        </div>

        <div class="flex flex-row items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <div class="flex flex-col">
            <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Start</label>
            <input
              type="date"
              v-model="revenue_start_date"
              @change="fetchIncomeData"
              class="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
            />
          </div>
          <div class="flex flex-col">
            <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">End</label>
            <input
              type="date"
              v-model="revenue_end_date"
              @change="fetchIncomeData"
              class="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
            />
          </div>
        </div>
      </div>

      <div class="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="p-6 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all duration-500">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 rounded-lg bg-red-100 text-red-500 flex items-center justify-center text-xs"><i class="fas fa-arrow-up"></i></div>
            <h3 class="text-sm font-black text-slate-700 uppercase tracking-tight">Subscription (Expense)</h3>
          </div>
          <apexchart
            type="bar"
            height="280"
            :options="chartOptions('Subscription', incomeData.months)"
            :series="[{ name: 'Subscription', data: incomeData.subscription }]"
          />
        </div>

        <div class="p-6 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all duration-500">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 rounded-lg bg-green-100 text-green-500 flex items-center justify-center text-xs"><i class="fas fa-home"></i></div>
            <h3 class="text-sm font-black text-slate-700 uppercase tracking-tight">Rent (Income)</h3>
          </div>
          <apexchart
            type="bar"
            height="280"
            :options="chartOptions('Rent', incomeData.months)"
            :series="[{ name: 'Rent', data: incomeData.rent }]"
          />
        </div>

        <div class="p-6 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all duration-500">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center text-xs"><i class="fas fa-tag"></i></div>
            <h3 class="text-sm font-black text-slate-700 uppercase tracking-tight">Sales (Income)</h3>
          </div>
          <apexchart
            type="bar"
            height="280"
            :options="chartOptions('Sale', incomeData.months)"
            :series="[{ name: 'Sale', data: incomeData.sale }]"
          />
        </div>

        <div class="p-6 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all duration-500">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 rounded-lg bg-purple-100 text-purple-500 flex items-center justify-center text-xs"><i class="fas fa-briefcase"></i></div>
            <h3 class="text-sm font-black text-slate-700 uppercase tracking-tight">Workspace (Income)</h3>
          </div>
          <apexchart
            type="bar"
            height="280"
            :options="chartOptions('Workspace', incomeData.months)"
            :series="[{ name: 'Workspace', data: incomeData.workspace }]"
          />
        </div>
      </div>

      <div v-if="is_superuser == 'true'" class="bg-slate-900 rounded-[2.5rem] p-8 text-white mt-8 overflow-hidden relative group">
        <div class="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32 transition-colors group-hover:bg-primary/20"></div>
        
        <div class="relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div class="lg:w-1/3">
            <h2 class="text-2xl font-black tracking-tight mb-2">User Distribution</h2>
            <p class="text-slate-400 text-sm font-medium mb-6">Analyze how your user base is split across different functional groups.</p>
            <div class="space-y-4">
              <div class="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary">
                <i class="fas fa-circle text-[6px]"></i> Real-time Sync
              </div>
              <div class="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-secondary">
                <i class="fas fa-circle text-[6px]"></i> Group Permissions
              </div>
            </div>
          </div>
          <div class="lg:w-2/3 w-full bg-white/5 backdrop-blur-md rounded-[2rem] p-6 border border-white/10">
            <apexchart
              type="donut"
              height="350"
              :options="userChartOptions"
              :series="userSeries"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      is_superuser: false,
      stats: {
        totalProperties: 0,
        totalZones: 0,
        totalSubscriptions: 0,
        totalTenants: 0,
      },
      hugePageSize: 10000000000,
      start_date: "",
      end_date: "",

      revenue_start_date: new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0],
      revenue_end_date: new Date().toISOString().split("T")[0],


      // Pricing report
      pricingSeries: [
        { name: "Users", type: "column", data: [] },
        { name: "Revenue ($)", type: "line", data: [] },
      ],
      pricingChartOptions: {
        chart: { height: 350, type: "line", toolbar: { show: false } },
        stroke: { width: [0, 4] },
        title: { text: "Plan Adoption and Revenue", align: "left" },
        xaxis: { categories: [] },
        yaxis: [
          { title: { text: "Users" } },
          { opposite: true, title: { text: "Revenue ($)" } },
        ],
        dataLabels: { enabled: true, enabledOnSeries: [1] },
        colors: ["#3b82f6", "#10b981"],
        legend: { position: "top" },
      },

      // Income report
      incomeData: {
        months: [],
        rent: [],
        sale: [],
        subscription: [],
        workspace: [],
      },


      incomeChartOptions: {
        chart: { id: "income-chart", stacked: false, toolbar: { show: false } },
        xaxis: { categories: [] },
        plotOptions: { bar: { horizontal: false, columnWidth: "55%" } },
        dataLabels: { enabled: false },
        legend: { position: "top" },
      },

      // User report
      userSeries: [],
      userChartOptions: {
        labels: [],
        legend: { position: "bottom" },
      },
    };
  },

  mounted() {
    this.is_superuser = localStorage.getItem("is_superuser");
    this.fetchAllData();
    if (this.is_superuser === "true") {
      this.refreshAllReports();
    }
  },

  methods: {
    async fetchAllData() {
      await Promise.all([
        this.fetchTotalProperties(),
        this.fetchTotalZones(),
        this.fetchTotalSubscriptions(),
        this.fetchTotalTenants(),
        this.fetchIncomeData(),
        this.fetchUserTypeReport(),
      ]);
    },

    async refreshAllReports() {
      await Promise.all([
        this.fetchSubscriptionReport(),
        this.fetchUserTypeReport(),
      ]);
    },
    chartOptions(title, months) {
      return {
        chart: { id: `${title}-chart` },
        xaxis: { categories: months },
        dataLabels: { enabled: false },
        grid: { strokeDashArray: 4 },
        title: {
          text: title,
          align: "center",
          style: { fontSize: "14px", color: "#374151" },
        },
        tooltip: { y: { formatter: (val) => val.toLocaleString() } },
        colors: ["#2563eb"],
      };
    },

    async fetchIncomeData() {
     // alert("hii")
     // if (!this.revenue_start_date || !this.revenue_end_date) return;


      const isSuperUser =
      localStorage.getItem("is_superuser") === "1" ||
      localStorage.getItem("is_superuser") === "true";

  const groups = JSON.parse(localStorage.getItem("groups") || "[]");
   const userId=localStorage.getItem('userId');
    let params = {};

    if (!isSuperUser) {
      if (groups.includes("manager")) {
        params = { 
        rent_id__property_id__property_zone_id__manager_id__id: userId,
        subscription_id__user_id__id:userId,
        space__zone__manager_id__id:userId,
        start_date: this.revenue_start_date,
        end_date: this.revenue_end_date,
        };
      } else if (groups.includes("owner")) {
        params = {
             rent_id__property_id__property_zone_id__owner_id__id: userId,
             property_zone_sale_id__property_zone_id__owner_id__id:userId,
             subscription_id__user_id__id:userId,
             space__zone__owner_id__id:userId,
             start_date: this.revenue_start_date,
             end_date: this.revenue_end_date,
         };
      } else if (groups.includes("staff")) {
        params={rent_id__property_id__property_zone_id__staff_id__id: userId,
        subscription_id__user_id__id:userId,
        space__zone__staff_id__id:userId,
        start_date: this.revenue_start_date,
        end_date: this.revenue_end_date,
        };
      } else if (groups.includes("super_staff")) {
        params = {
            start_date: this.revenue_start_date,
            end_date: this.revenue_end_date,
        };
      }
    }else{
        params = {
            start_date: this.revenue_start_date,
            end_date: this.revenue_end_date,
        };
      }
      console.log("Fetching with params for income:", params);

      try {
        const res = await this.$apiGet("/get_revenue_report", params);
        console.log("resin", res);
        this.incomeData = res;
      } catch (error) {
        console.error("Failed to load income data:", error);
        this.$root.$refs.toast?.showToast("Failed to load income data", "error");
      }
    },

    // 🟢 Fetch subscription report
async fetchSubscriptionReport() {
  try {
    let url = "/get_subscription_report";

    // Add date filters if selected
    if (this.start_date && this.end_date) {
      url += `?start_date=${this.start_date}&end_date=${this.end_date}`;
    }

    const res = await this.$apiGet(url);
    const data = res.data || res;

    // Extract only plans and revenue
    const { plans = [], revenue = [] } = data;

    // Update chart options
    this.pricingChartOptions = {
      chart: {
        type: "bar",
        toolbar: { show: false },
      },
      title: {
        text: "PLANS AND THEIR REVENUE",
        align: "center",
        style: {
          fontSize: "18px",
          fontWeight: "bold",
          color: "#4B0082", // deep purple
        },
      },
      xaxis: {
        categories: plans,
        title: {
          text: "PLAN TYPE",
          style: { color: "#333", fontWeight: "600" },
        },
      },
      yaxis: {
        title: {
          text: "REVENUE ($)",
          style: { color: "#333", fontWeight: "600" },
        },
      },
      colors: ["#7C3AED"], // violet accent
      dataLabels: {
        enabled: true,
        style: {
          colors: ["#fff"],
          fontWeight: "bold",
        },
        background: {
          enabled: true,
          foreColor: "#000",
          borderRadius: 6,
          opacity: 0.9,
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          distributed: true,
          columnWidth: "45%",
        },
      },
      tooltip: {
        theme: "light",
        y: {
          formatter: (val) => `$${val.toLocaleString()}`,
        },
      },
    };

    // Update data series
    this.pricingSeries = [
      {
        name: "Revenue ($)",
        data: revenue,
      },
    ];

    // Success message
    this.$root.$refs.toast?.showToast(
      "Revenue report loaded successfully",
      "success"
    );
  } catch (err) {
    console.error(err);
    this.$root.$refs.toast?.showToast(
      "Failed to load revenue report",
      "error"
    );
  }
},


    // 🟢 Fetch user type report (replaces fetchAndGroupUsers)
    async fetchUserTypeReport() {
      try {
        const params = {
          user_id: localStorage.getItem("userId"),
        };
        let url = "/get_user_type_report";
        if (this.start_date && this.end_date) {
          url += `?start_date=${this.start_date}&end_date=${this.end_date}`;
        }

        const res = await this.$apiGet(url, params);
        const data = res.data || res;
        const { groups = [], counts = [] } = data;

        this.userChartOptions = {
          ...this.userChartOptions,
          labels: groups,
        };
        this.userSeries = counts;

        if (this.start_date && this.end_date)
          this.$root.$refs.toast?.showToast(
            "User type report loaded",
            "success"
          );
      } catch (err) {
        console.error(err);
        this.$root.$refs.toast?.showToast(
          "Failed to load user type report",
          "error"
        );
      }
    },

    // ---- Stats fetchers ----
    async fetchTotalProperties() {
      try {
        //  const res = await this.$apiGet("/get_properties", { page_size: this.hugePageSize });
        const pageSize = this.hugePageSize;
        const params = {};
        const pageUrl = "/get_properties?page=1&page_size=1000000000";
        const res = await this.$getProperties(pageUrl, params);
        console.log("res properties", res);
        //alert("hi");
        this.stats.totalProperties = res.properties?.length ?? 0;
      } catch {}
    },

    async fetchTotalZones() {
      try {
        const pageUrl = "/get_property_zones?page=1&page_size=10000000000";
        const params = {};
        const res = await this.$getZones(pageUrl, params);
        console.log("res zones", res);
        this.stats.totalZones = res.zones?.length ?? 0;
      } catch {}
    },

    async fetchTotalSubscriptions() {
      try {
        let params = {
          user_id__id: localStorage.getItem("userId"),
          page: 1,
          page_size: 10000000000,
        };

        if (localStorage.getItem("is_superuser") == "true") {
          params = {
            page: 1,
            page_size: 10000000000,
          };
        }
        const pageUrl = `/get_subscription`;
        const res = await this.$apiGet(pageUrl, params);
        console.log("res", res);
        console.log("res for subscriptions", res);
        this.stats.totalSubscriptions = res.count;
      } catch {}
    },

    async fetchTotalTenants() {
      try {
        const pageUrl = `/get_rents`;
        const params = {
          page_size: 10000000000,
        };
        const res = await this.$getTenants(pageUrl, params);
        console.log("res for tenants", res);

        this.stats.totalTenants = res.tenants.length ?? 0;
      } catch {}
    },

  },
};
</script>

<style scoped>
.bg-white:hover {
  transform: translateY(-2px);
  transition: all 0.2s ease;
}
</style>

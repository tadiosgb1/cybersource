<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <Toast ref="toast" />

    <div class="bg-white rounded-2xl w-full max-w-sm p-8 animate-pop-in">

      <!-- Wegagen Logo -->
      <div class="mb-6 text-center">
        <img src="../../../assets/img/wegagen.png" alt="Wegagen Logo" class="mx-auto w-28 h-auto mb-4" />
        <h2 class="text-2xl font-bold text-gray-900">Wegagen Donation Dashboard</h2>
        <p class="text-xs font-semibold text-primary uppercase mt-1">Merchant Access Portal</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="login" class="space-y-4">
        <!-- Email -->
        <div class="relative">
          <i class="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
          <input
            type="email"
            v-model="form.email"
            required
            placeholder="Email Address"
            class="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-medium text-gray-800 placeholder-gray-400"
          />
        </div>

        <!-- Password -->
        <div class="relative">
          <i class="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="form.password"
            required
            placeholder="Password"
            class="w-full pl-9 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-medium text-gray-800 placeholder-gray-400"
          />
          <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-xs"></i>
          </button>
        </div>

        <!-- Forgot password -->
        <div class="text-right">
          <a href="/forgot-password" class="text-xs font-semibold text-gray-500 hover:text-primary">Forgot Password?</a>
        </div>

        <!-- Error -->
        <transition name="error-shake">
          <div v-if="error" class="flex items-center gap-2 text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 text-xs font-semibold">
            <i class="fas fa-exclamation-circle"></i>
            <span>{{ error }}</span>
          </div>
        </transition>

        <!-- Submit button -->
        <button
          type="submit"
          class="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-colors disabled:opacity-70"
          :disabled="loading"
        >
          <span v-if="!loading">Enter Dashboard</span>
          <span v-else class="flex items-center justify-center gap-2">
            <div class="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            Verifying...
          </span>
        </button>
      </form>

      <!-- Create account -->
      <p class="mt-6 text-center text-xs text-gray-500 uppercase">
        New merchant? <a href="#plans" class="text-primary hover:underline ml-1">Register here</a>
      </p>
    </div>
  </div>
</template>

<script>
import Toast from "../../../components/Toast.vue";

export default {
  name: "WegagenLogin",
  components: { Toast },
  data() {
    return {
      form: { email: "", password: "" },
      error: "",
      loading: false,
      showPassword: false,
    };
  },
  methods: {
    async login() {
      this.error = "";
      this.loading = true;
      try {
        const response = await this.$apiPost("/auth/login", this.form);
       
   console.log("response",response);

        localStorage.setItem("access", response.token);


       

        this.$refs.toast?.showSuccessToastMessage("Login successful!");
        setTimeout(() => {
          this.$router.push({ path: "/dashboard/first-dash" });

          
        }, 1000);
      } catch (error) {
        this.error = error.response?.data?.message || "Login failed.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Centering animations */
@keyframes popIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}
.animate-pop-in { animation: popIn 0.3s ease-out; }

.error-shake-enter-active { animation: shake 0.4s both; }
@keyframes shake {
  10%, 90% { transform: translateX(-1px); }
  30%, 70% { transform: translateX(-2px); }
  40%, 60% { transform: translateX(2px); }
}

/* Colors */
.bg-primary { background-color: #4f46e5; } 
.hover\:bg-primary-dark:hover { background-color: #4338ca; } 
.text-primary { color: #4f46e5; }
</style>
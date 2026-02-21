<template>
  <Teleport to="body">
    <transition name="auth-overlay">
      <div
        v-if="visible"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4 py-4"
        @click.self="$emit('close')"
      >
        <Toast ref="toast" />

        <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm relative overflow-hidden animate-pop-in">
          <div class="h-1.5 w-full bg-gradient-to-r from-primary to-secondary"></div>

          <div class="p-6 md:p-8">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h2 class="text-2xl font-black text-slate-900 leading-none">Login</h2>
                <p class="text-[9px] font-black uppercase tracking-widest text-primary mt-1">Alpha Account Access</p>
              </div>
              <button @click="$emit('close')" class="text-slate-300 hover:text-red-500 transition-colors">
                <i class="fas fa-times text-lg"></i>
              </button>
            </div>

            <form @submit.prevent="login" class="space-y-4">
              <div class="space-y-1">
                <div class="relative group">
                  <i class="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs group-focus-within:text-primary transition-colors"></i>
                  <input
                    type="email"
                    v-model="form.email"
                    required
                    placeholder="Email Address"
                    class="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm font-bold text-slate-800 placeholder:font-medium placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div class="space-y-1">
                <div class="relative group">
                  <i class="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs group-focus-within:text-primary transition-colors"></i>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    v-model="form.password"
                    required
                    placeholder="Password"
                    class="w-full pl-9 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm font-bold text-slate-800 placeholder:text-slate-300"
                  />
                  <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-xs"></i>
                  </button>
                </div>
                <div class="text-right">
                  <a @click="$emit('close')" href="/forgot-password" class="text-[9px] font-black uppercase text-slate-400 hover:text-primary transition-colors tracking-tighter">Forgot Password?</a>
                </div>
              </div>

              <transition name="error-shake">
                <div v-if="error" class="flex items-center gap-2 text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100">
                  <i class="fas fa-exclamation-circle text-[10px]"></i>
                  <p class="text-[9px] font-black uppercase leading-none">{{ error }}</p>
                </div>
              </transition>

              <button
                type="submit"
                class="w-full bg-slate-900 hover:bg-primary text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 shadow-lg active:scale-95 disabled:opacity-70"
                :disabled="loading"
              >
                <span v-if="!loading" class="flex items-center justify-center gap-2">
                  Enter Dashboard <i class="fas fa-arrow-right text-[8px]"></i>
                </span>
                <span v-else class="flex items-center justify-center gap-2">
                  <div class="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </span>
              </button>
            </form>

            <div class="mt-6 text-center pt-4 border-t border-slate-50">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                New? <a @click="$emit('close')" href="#plans" class="text-primary hover:underline ml-1">Create Account</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script>
import Toast from "../../../components/Toast.vue";

export default {
  name: "LoginModal",
  components: { Toast },
  props: {
    visible: { type: Boolean, required: true },
  },
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
        const response = await this.$apiPost("/token", this.form);
        const { refresh, access, permissions, id, is_superuser, email, groups } = response;

        localStorage.setItem("refresh", refresh);
        localStorage.setItem("access", access);
        localStorage.setItem("permissions", JSON.stringify(permissions));
        localStorage.setItem("groups", JSON.stringify(groups));
        localStorage.setItem("userId", id);
        localStorage.setItem("is_superuser", is_superuser);
        localStorage.setItem("email", email);

        const user = await this.$apiGetById(`/get_user`, id);
        localStorage.setItem("name", user.first_name);

        this.$refs.toast?.showSuccessToastMessage("Login successful!");
        setTimeout(() => {
          this.$emit("close");
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
@keyframes popIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-pop-in { animation: popIn 0.3s ease-out; }

.auth-overlay-enter-active, .auth-overlay-leave-active { transition: opacity 0.2s ease; }
.auth-overlay-enter-from, .auth-overlay-leave-to { opacity: 0; }

.error-shake-enter-active { animation: shake 0.4s both; }
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  30%, 70% { transform: translate3d(-2px, 0, 0); }
  40%, 60% { transform: translate3d(2px, 0, 0); }
}
</style>
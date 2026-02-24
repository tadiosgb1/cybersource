<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
      
      <div class="bg-blue-900 p-6 text-center">
        <h1 class="text-white text-2xl font-bold tracking-tighter">WEGAGEN BANK</h1>
        <p class="text-blue-200 text-xs uppercase tracking-widest mt-1">Direct Remittance Portal</p>
      </div>

      <div class="p-8 space-y-5">
        <div>
          <label class="block text-sm font-semibold text-gray-600 mb-1">Transfer Amount (USD)</label>
          <div class="relative">
            <span class="absolute left-3 top-3 text-gray-400">$</span>
            <input v-model="amount" type="number" 
                   class="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-600 mb-1">Recipient Name</label>
          <input v-model="recipient" type="text" placeholder="Full Name in Ethiopia"
                 class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-600 mb-1">Card Number (Secure Iframe)</label>
          <div id="card-number-container" 
               class="h-12 w-full bg-gray-50 border border-gray-200 rounded-lg transition duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
          </div>
        </div>

        <button @click="submitRemittance" :disabled="loading || !flexLoaded"
                class="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg transition duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="!loading">SEND FUNDS NOW</span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            PROCESSING...
          </span>
        </button>

        <div class="flex items-center justify-center space-x-2">
          <span class="text-[10px] text-gray-400">SECURED BY CYBERSOURCE</span>
          <div class="h-1 w-1 bg-gray-300 rounded-full"></div>
          <span class="text-[10px] text-gray-400">PCI-DSS COMPLIANT</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FlexMicroform from "@cybersource/flex-microform";

export default {
  data() {
    return {
      amount: 100,
      recipient: "",
      loading: false,
      flexLoaded: false,
      microformInstance: null
    };
  },

  async mounted() {
    await this.initFlex();
  },

  methods: {
    async initFlex() {
      try {
        // Get JWT Capture Context from backend
        const response = await fetch("http://localhost:5000/get-context");
        const captureContext = await response.text();

        if (!captureContext || captureContext.includes("error")) {
          throw new Error("Failed to load Capture Context");
        }

        // **Create Flex instance from NPM module**
        const flex = new FlexMicroform(captureContext);

        // Create Microform instance
        this.microformInstance = flex.microform({
          styles: {
            input: {
              "font-size": "16px",
              "font-family": "Arial",
              color: "#1a202c"
            }
          }
        });

        // Create and load the number field
        const numberField = this.microformInstance.createField("number", {
          placeholder: "0000 0000 0000 0000"
        });

        numberField.load("#card-number-container");
        this.flexLoaded = true;

      } catch (err) {
        console.error("Flex NPM Init Error:", err);
        alert(err.message);
      }
    },

    async submitRemittance() {
      if (!this.recipient) return alert("Enter recipient name!");

      this.loading = true;

      this.microformInstance.createToken(async (err, token) => {
        if (err) {
          alert("Invalid card details");
          this.loading = false;
          return;
        }

        try {
          const res = await fetch("http://localhost:5000/remit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: token,
              amount: this.amount
            })
          });

          const result = await res.json();

          if (result.status === "AUTHORIZED" || result.status === "PENDING") {
            alert(`Success! Ref: ${result.id}`);
          } else {
            alert("Declined: " + result.status);
          }
        } catch (error) {
          alert("Backend error");
        }

        this.loading = false;
      });
    }
  }
};
</script>

<style scoped>
/* Ensure the iframe container looks active when focused */
#card-number-container {
  display: flex;
  align-items: center;
}
</style>
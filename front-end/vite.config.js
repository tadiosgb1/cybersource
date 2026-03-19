import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import commonjs from 'vite-plugin-commonjs'
import fs from 'fs'
// import basicSsl from '@vitejs/plugin-basic-ssl'
export default defineConfig({
plugins: [
vue(),
commonjs(),
// basicSsl() // 👈 REQUIRED
],

resolve: {
alias: {
'@': path.resolve(__dirname, 'src')
}
},

server: {
host: '10.195.49.19', // allow external access
port: 3000,
strictPort: true,
 https: {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
  },
// https:true,
allowedHosts: ['donation.wegagen.com', 'localhost']
},

preview: {
host: '0.0.0.0',
port: 3000,
strictPort: true
},

optimizeDeps: {
include: ['rtcpeerconnection-shim', 'sdp']
},

assetsInclude: [
'**/*.PNG',
'**/*.JPG',
'**/*.jpeg',
'**/*.gif',
'**/*.svg'
]
})

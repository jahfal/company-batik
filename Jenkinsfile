pipeline {
    agent any

    environment {
        // ============================================================
        // ⚠️ KONFIGURASI WAJIB DIUBAH ⚠️
        // Masukkan IP Address LAN Laptop Acer (Cek pakai perintah 'ip a')
        // Contoh: '192.168.1.15'
        // ============================================================
        SERVER_IP = '192.168.1.53' 

        // Password Database (Sementara hardcode, nanti bisa pakai Credentials)
        DB_ROOT_PASSWORD = 'root'
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "--- Menarik Kode dari GitHub ---"
                // Mengambil repo utama & submodules secara otomatis
                checkout scm
            }
        }
        
        stage('Setup Environment (.env)') {
            steps {
                script {
                    // ============================================================
                    // 1. BACKEND (Express) - Port 3000
                    // ============================================================
                    echo "--- Generate Env: BACKEND ---"
                    def backendEnv = "cms-catalog-backend/.env"
                    
                    // PORT=3000 sesuai mapping "3000:3000" di docker-compose
                    sh "echo 'PORT=3000' > ${backendEnv}"
                    sh "echo 'DB_HOST=mysql_db' >> ${backendEnv}"
                    sh "echo 'DB_USERNAME=root' >> ${backendEnv}"
                    sh "echo 'DB_PASSWORD=${DB_ROOT_PASSWORD}' >> ${backendEnv}"
                    sh "echo 'DB_DATABASE=cms_catalog_db' >> ${backendEnv}"
                    
                    // ============================================================
                    // 2. FRONTEND (Next.js) - Port 3001
                    // ============================================================
                    echo "--- Generate Env: FRONTEND ---"
                    def frontendEnv = "company-profile-batik/.env"
                    
                    // PORT=3001 WAJIB ADA karena mapping docker-compose kamu "3001:3001"
                    // Kalau tidak ada ini, Next.js jalan di 3000, docker bingung nyari di 3001.
                    sh "echo 'PORT=3001' > ${frontendEnv}"
                    
                    // URL API menembak ke Port Backend (3000) + Prefix /api
                    sh "echo 'NEXT_PUBLIC_API_URL=http://${SERVER_IP}:3000/api' >> ${frontendEnv}"

                    // ============================================================
                    // 3. CMS (React) - Port 3002
                    // ============================================================
                    echo "--- Generate Env: CMS ---"
                    def cmsEnv = "dashboard-cms/.env"
                    
                    // PORT=3002 WAJIB ADA karena mapping docker-compose kamu "3002:3002"
                    sh "echo 'PORT=3002' > ${cmsEnv}"
                    
                    // URL API menembak ke Port Backend (3000) + Prefix /api
                    sh "echo 'REACT_APP_API_URL=http://${SERVER_IP}:3000/api' >> ${cmsEnv}"
                    
                    // Tambahan config agar build tidak gagal karena warning linter
                    sh "echo 'ESLINT_NO_DEV_ERRORS=true' >> ${cmsEnv}"
                    sh "echo 'DISABLE_ESLINT_PLUGIN=true' >> ${cmsEnv}"
                }
            }
        }

        stage('Build & Deploy') {
            steps {
                echo "--- Membangun & Menjalankan Container ---"
                
                // 1. Matikan container lama & hapus network yatim piatu
                sh 'docker-compose down --remove-orphans || true'
                
                // 2. Build ulang (-d --build)
                // Flag --build PENTING agar environment variable IP baru "dibakar" masuk ke image Frontend/CMS
                sh 'docker-compose up -d --build'
            }
        }
        
        stage('Database Migration') {
            steps {
                script {
                    echo "--- Menunggu Database Siap (20 detik) ---"
                    // Beri waktu agak lama karena MySQL 8.0 butuh waktu startup
                    sleep 20 
                    
                    echo "--- Menjalankan Migrasi Database ---"
                    // Masuk ke container 'cms_backend' -> jalankan sequelize migrate
                    sh 'docker exec cms_backend npx sequelize-cli db:migrate'
                }
            }
        }
    }
}
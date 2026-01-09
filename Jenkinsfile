pipeline {
    agent any

    environment {
        // ============================================================
        // IP Address Server (Tetap sama)
        // ============================================================
        SERVER_IP = '192.168.1.53' 

        // Password Database
        DB_ROOT_PASSWORD = 'test'
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "--- Menarik Kode dari GitHub ---"
                // PENTING: Update submodule agar kodingan Backend & CMS terbaru ikut tertarik
                // Karena Backend & CMS akan di-build di server ini.
                checkout scm
                sh 'git submodule update --init --recursive'
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
                    
                    sh "echo 'PORT=3000' > ${backendEnv}"
                    sh "echo 'DB_HOST=mysql_db' >> ${backendEnv}"
                    sh "echo 'DB_USER=root' >> ${backendEnv}"
                    sh "echo 'DB_PASSWORD=${DB_ROOT_PASSWORD}' >> ${backendEnv}"
                    sh "echo 'DB_NAME=cms_catalog_db' >> ${backendEnv}"
                    sh "echo 'JWT_SECRET=test' >> ${backendEnv}"
                    
                    // ============================================================
                    // 2. FRONTEND (Next.js) - Port 3001
                    // ============================================================
                    echo "--- Generate Env: FRONTEND ---"
                    def frontendEnv = "company-profile-batik/.env"
                    
                    // Kita cukup buat file ini agar docker-compose tidak error saat mencarinya.
                    // Variable NEXT_PUBLIC_... sudah tidak ngefek di sini karena sudah 
                    // dibuild (baked) di GitHub Actions.
                    sh "echo 'PORT=3001' > ${frontendEnv}"
                    sh "echo '# NEXT_PUBLIC Variables sudah di-set di GitHub Actions' >> ${frontendEnv}"

                    // ============================================================
                    // 3. CMS (React) - Port 3002
                    // ============================================================
                    echo "--- Generate Env: CMS ---"
                    def cmsEnv = "dashboard-cms/.env"
                    
                    // PORT=3002 (Akses lewat http://192.168.1.53:3002)
                    sh "echo 'PORT=3002' > ${cmsEnv}"
                    
                    // API URL: Tembak ke Nginx (Port 80) biar konsisten & hindari CORS
                    // Hapus ':3000' agar lewat pintu utama
                    sh "echo 'REACT_APP_API_URL=http://${SERVER_IP}/api' >> ${cmsEnv}"
                    
                    // Config tambahan biar build React aman
                    sh "echo 'ESLINT_NO_DEV_ERRORS=true' >> ${cmsEnv}"
                    sh "echo 'DISABLE_ESLINT_PLUGIN=true' >> ${cmsEnv}"
                }
            }
        }

        stage('Build & Deploy Hybrid') {
            steps {
                echo "--- Membangun & Menjalankan Container ---"

                // 1. Bersihkan container lama yang mungkin nyangkut
                sh 'docker-compose down --remove-orphans || true'
                
                // 2. JURUS HYBRID (Build + Pull):
                // --build : Paksa build ulang service yang pakai "build:" (Backend & CMS)
                // --pull  : Paksa download image terbaru service yang pakai "image:" (Frontend)
                sh 'docker-compose up -d --build --pull'
            }
        }
        
        stage('Database Migration') {
            steps {
                script {
                    echo "--- Menunggu Database Siap (20 detik) ---"
                    sleep 20 
                    
                    echo "--- Menjalankan Migrasi Database ---"
                    // Pastikan nama container backend sesuai dengan docker-compose.yml
                    sh 'docker exec cms_backend npx sequelize-cli db:migrate'
                }
            }
        }
    }
}
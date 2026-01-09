pipeline {
    agent any

    options {
        // Mematikan checkout otomatis agar tidak nyangkut di awal
        skipDefaultCheckout()
        timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        // Konfigurasi Server
        SERVER_IP = '192.168.1.53' 
        DB_ROOT_PASSWORD = 'test'
        
        // ID Kredensial Jenkins
        CREDENTIAL_ID = 'github-jenkins-login'
    }

    stages {
        stage('Cleanup & Manual Checkout') {
            steps {
                script {
                    echo "--- 1. Membersihkan Workspace ---"
                    deleteDir() 
                    
                    withCredentials([usernamePassword(credentialsId: "${env.CREDENTIAL_ID}", passwordVariable: 'GIT_PASS', usernameVariable: 'GIT_USER')]) {
                        
                        echo "--- 2. Clone Repo Utama (Root) ---"
                        sh "git clone https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/company-batik.git ."
                        
                        echo "--- 3. Clone Sub-Projects secara Manual (Anti-Nyangkut) ---"
                        // Hapus folder kosong bawaan submodule agar bisa di-clone ulang
                        sh "rm -rf cms-catalog-backend company-profile-batik dashboard-cms"
                        
                        // Tarik masing-masing repo sebagai folder biasa
                        sh "git clone https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/cms-catalog-backend.git cms-catalog-backend"
                        sh "git clone https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/company-profile-batik.git company-profile-batik"
                        sh "git clone https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/dashboard-cms.git dashboard-cms"
                    }
                }
            }
        }
        
        stage('Setup Environment (.env)') {
            steps {
                script {
                    echo "--- 4. Generate File Environment (.env) ---"
                    // Backend Env
                    sh """
                        echo 'PORT=3000
                        DB_HOST=mysql_db
                        DB_USER=root
                        DB_PASSWORD=${DB_ROOT_PASSWORD}
                        DB_NAME=cms_catalog_db
                        JWT_SECRET=test' > cms-catalog-backend/.env
                    """
                    
                    // Frontend Env
                    sh "echo 'PORT=3001' > company-profile-batik/.env"

                    // CMS Env
                    sh """
                        echo 'PORT=3002
                        REACT_APP_API_URL=http://${SERVER_IP}/api
                        ESLINT_NO_DEV_ERRORS=true
                        DISABLE_ESLINT_PLUGIN=true' > dashboard-cms/.env
                    """
                }
            }
        }

        stage('Build & Deploy') {
            steps {
                script {
                    echo "--- 5. Menjalankan Docker Compose ---"
                    // Pastikan file docker-compose.yml ada di root
                    sh 'docker-compose down --remove-orphans || true'
                    sh 'docker-compose pull'
                    sh 'docker-compose up -d --build'
                }
            }
        }
        
        stage('Database Migration') {
            steps {
                script {
                    echo "--- 6. Menunggu Database & Migrasi ---"
                    sleep 20 
                    // Nama container 'cms_backend' harus sesuai dengan di docker-compose.yml
                    sh 'docker exec cms_backend npx sequelize-cli db:migrate || echo "Migrasi gagal, cek manual."'
                }
            }
        }
    }

    post {
        success {
            echo "✅ DEPLOYMENT BERHASIL!"
        }
        failure {
            echo "❌ DEPLOYMENT GAGAL! Periksa log di atas."
        }
    }
}
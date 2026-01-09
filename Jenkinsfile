pipeline {
    agent any

    options {
        // Mematikan checkout otomatis agar tidak bentrok dengan script manual kita
        skipDefaultCheckout()
        timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        SERVER_IP = '192.168.1.53' 
        DB_ROOT_PASSWORD = 'test'
        CREDENTIAL_ID = 'github-jenkins-login'
    }

    stages {
        stage('Cleanup & Checkout') {
            steps {
                script {
                    echo "--- Membersihkan Workspace ---"
                    deleteDir() 
                    
                    echo "--- Menarik Kode Utama & Submodule ---"
                    withCredentials([usernamePassword(credentialsId: "${env.CREDENTIAL_ID}", passwordVariable: 'GIT_PASS', usernameVariable: 'GIT_USER')]) {
                        
                        // 1. Clone repo utama
                        sh "git clone https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/company-batik.git ."
                        
                        echo "--- Inject Kredensial ke Konfigurasi Submodule ---"
                        // 2. Inisialisasi dulu agar file config terbentuk
                        sh "git submodule init"
                        
                        // 3. Paksa setiap submodule menggunakan URL yang mengandung USER:PASS
                        // Cara ini bypass error "could not read Username" secara total
                        sh """
                            git config submodule.cms-catalog-backend.url "https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/cms-catalog-backend.git"
                            git config submodule.company-profile-batik.url "https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/company-profile-batik.git"
                            git config submodule.dashboard-cms.url "https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/dashboard-cms.git"
                            
                            echo "--- Memulai Proses Update Submodule ---"
                            git submodule update --init --recursive
                        """
                    }
                }
            }
        }
        
        stage('Setup Environment (.env)') {
            steps {
                script {
                    echo "--- Membuat File Environment (.env) ---"
                    // Menggunakan format yang lebih aman untuk penulisan file
                    sh """
                        echo 'PORT=3000\nDB_HOST=mysql_db\nDB_USER=root\nDB_PASSWORD=${DB_ROOT_PASSWORD}\nDB_NAME=cms_catalog_db\nJWT_SECRET=test' > cms-catalog-backend/.env
                        echo 'PORT=3001\n# NEXT_PUBLIC di-set di GitHub Actions' > company-profile-batik/.env
                        echo 'PORT=3002\nREACT_APP_API_URL=http://${SERVER_IP}/api\nESLINT_NO_DEV_ERRORS=true\nDISABLE_ESLINT_PLUGIN=true' > dashboard-cms/.env
                    """
                }
            }
        }

        stage('Build & Deploy') {
            steps {
                script {
                    echo "--- Docker Compose: Deploying ---"
                    // Memastikan kita berada di folder yang benar yang berisi docker-compose.yml
                    sh 'docker-compose down --remove-orphans || true'
                    sh 'docker-compose pull'
                    sh 'docker-compose up -d --build'
                }
            }
        }
        
        stage('Database Migration') {
            steps {
                script {
                    echo "--- Menunggu Database (20 detik) ---"
                    sleep 20 
                    echo "--- Menjalankan Migrasi ---"
                    sh 'docker exec cms_backend npx sequelize-cli db:migrate || echo "Migrasi gagal, silakan cek manual."'
                }
            }
        }
    }

    post {
        success {
            echo "✅ SELESAI: Aplikasi berhasil dideploy!"
        }
        failure {
            echo "❌ GAGAL: Terjadi kesalahan pada proses build/deploy."
        }
    }
}
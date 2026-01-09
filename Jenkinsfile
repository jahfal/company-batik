pipeline {
    agent any

    options {
        // Mematikan checkout otomatis agar kita bisa kontrol manual
        skipDefaultCheckout()
        timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        SERVER_IP = '192.168.1.53' 
        DB_ROOT_PASSWORD = 'test'
        CREDENTIAL_ID = 'github-jenkins-login'
    }

    stages {
        stage('Cleanup & Manual Checkout') {
            steps {
                script {
                    echo "--- 1. Membersihkan Workspace ---"
                    deleteDir() 
                    
                    withCredentials([usernamePassword(credentialsId: "${env.CREDENTIAL_ID}", passwordVariable: 'GIT_PASS', usernameVariable: 'GIT_USER')]) {
                        
                        echo "--- 2. Clone Repo Utama ---"
                        // Gunakan --depth 1 agar tarikan data ringan
                        sh "git clone --depth 1 https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/company-batik.git ."
                        
                        echo "--- 3. Clone Sub-Projects Manual ---"
                        sh "rm -rf cms-catalog-backend company-profile-batik dashboard-cms"
                        
                        // Menambahkan --quiet agar proses clone lebih stabil di background Jenkins
                        sh "git clone --quiet --depth 1 https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/cms-catalog-backend.git cms-catalog-backend"
                        sh "git clone --quiet --depth 1 https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/company-profile-batik.git company-profile-batik"
                        sh "git clone --quiet --depth 1 https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/dashboard-cms.git dashboard-cms"
                    }
                }
            }
        }
        
        stage('Setup Environment (.env)') {
            steps {
                script {
                    echo "--- 4. Pembuatan File .env ---"
                    sh """
                        echo 'PORT=3000\nDB_HOST=mysql_db\nDB_USER=root\nDB_PASSWORD=${DB_ROOT_PASSWORD}\nDB_NAME=cms_catalog_db\nJWT_SECRET=test' > cms-catalog-backend/.env
                        echo 'PORT=3001' > company-profile-batik/.env
                        echo 'PORT=3002\nREACT_APP_API_URL=http://${SERVER_IP}/api\nESLINT_NO_DEV_ERRORS=true\nDISABLE_ESLINT_PLUGIN=true' > dashboard-cms/.env
                    """
                }
            }
        }

        stage('Build & Deploy Hybrid') {
            steps {
                script {
                    echo "--- 5. Menjalankan Docker Compose ---"
                    // Mematikan container lama jika ada
                    sh 'docker-compose down --remove-orphans || true'
                    
                    // Menarik image yang sudah jadi (Frontend/Next.js dari GHCR/DockerHub)
                    sh 'docker-compose pull'
                    
                    // Build service lokal (Backend & CMS) dan jalankan semuanya
                    sh 'docker-compose up -d --build'
                }
            }
        }
        
        stage('Database Migration') {
            steps {
                script {
                    echo "--- 6. Menunggu Database (20 detik) ---"
                    sleep 20 
                    echo "--- Menjalankan Migrasi ---"
                    // Pastikan nama container 'cms_backend' sesuai dengan docker-compose.yml
                    sh 'docker exec cms_backend npx sequelize-cli db:migrate || echo "Migrasi gagal, silakan cek log container."'
                }
            }
        }
    }

    post {
        success {
            echo "✅ SELESAI: Aplikasi berhasil dideploy ulang dalam kondisi bersih!"
        }
        failure {
            echo "❌ GAGAL: Silakan cek tahapan mana yang merah."
        }
    }
}
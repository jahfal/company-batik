pipeline {
    agent any

    options {
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
                        sh "git clone --depth 1 https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/company-batik.git ."
                        
                        echo "--- 3. Clone Sub-Projects Manual ---"
                        // Hapus folder bawaan hasil git clone utama agar bersih sebelum di-clone mandiri
                        sh "rm -rf cms-catalog-backend company-profile-batik dashboard-cms"
                        
                        sh "git clone --quiet --depth 1 https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/cms-catalog-backend.git cms-catalog-backend"
                        sh "git clone --quiet --depth 1 https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/company-profile-batik.git company-profile-batik"
                        sh "git clone --quiet --depth 1 https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/dashboard-cms.git dashboard-cms"
                    }
                }
            }
        }
        
        stage('Setup Environment') {
            steps {
                script {
                    echo "--- 4. Menyiapkan Konfigurasi (.env & Nginx) ---"
                    
                    // Pastikan tidak ada folder bernama default.conf (sisa error sebelumnya)
                    sh "rm -rf default.conf || true"

                    // Menulis ulang default.conf (agar selalu update jika ada perubahan di Jenkinsfile)
                    sh """
                        echo 'server {
                            listen 80;
                            server_name localhost;

                            location / {
                                proxy_pass http://company-profile-frontend:3001;
                            }

                            location /api/ {
                                proxy_pass http://cms_backend:3000/;
                                proxy_set_header Host \$host;
                                proxy_set_header X-Real-IP \$remote_addr;
                            }

                            location /cms {
                                proxy_pass http://cms_app:3002;
                            }
                        }' > default.conf
                    """

                    // Setup .env untuk setiap service
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
                    echo "--- 5. Docker Compose Deploy ---"
                    // Membersihkan kontainer lama
                    sh 'docker-compose down --remove-orphans || true'
                    
                    // Pull image frontend (Hybrid)
                    sh 'docker-compose pull'
                    
                    // Build & Run
                    sh 'docker-compose up -d --build'
                }
            }
        }
        
        stage('Database Migration') {
            steps {
                script {
                    echo "--- 6. Migrasi Database ---"
                    sleep 20 
                    sh 'docker exec cms_backend npx sequelize-cli db:migrate || echo "Migrasi gagal/sudah up-to-date."'
                }
            }
        }
    }

    post {
        success { echo "✅ DEPLOYMENT SUKSES!" }
        failure { echo "❌ DEPLOYMENT GAGAL!" }
    }
}
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
                        
                        echo "--- 3. Clone Sub-Projects ---"
                        // Hapus folder lama jika ada sisa
                        sh "rm -rf cms-catalog-backend company-profile-batik dashboard-cms"
                        
                        sh "git clone --depth 1 https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/cms-catalog-backend.git cms-catalog-backend"
                        sh "git clone --depth 1 https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/company-profile-batik.git company-profile-batik"
                        sh "git clone --depth 1 https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/dashboard-cms.git dashboard-cms"
                    }
                }
            }
        }
        
        stage('Hardcode Config') {
            steps {
                script {
                    echo "--- 4. Menulis ulang file Konfigurasi ---"
                    
                    // PAKSA HAPUS folder default.conf (jika ada sisa error Docker)
                    sh "rm -rf default.conf"

                    // Menulis file default.conf menggunakan metode heredoc (EOF)
                    sh """
cat <<EOF > default.conf
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://company-profile-frontend:3001;
    }

    location /api/ {
        proxy_pass http://cms_backend:3000;
        proxy_set_header Host \\\$host;
        proxy_set_header X-Real-IP \\\$remote_addr;
        proxy_set_header X-Forwarded-For \\\$proxy_add_x_forwarded_for;
    }

    location /cms/ {
        proxy_pass http://cms_app:3002/;
        proxy_set_header Host \\\$host;
        proxy_set_header X-Real-IP \\\$remote_addr;
        proxy_set_header X-Forwarded-For \\\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\\$scheme;
    }

    location /cms {
        return 301 \\\$scheme://\\\$host\\\$request_uri/;
    }
}
EOF
                    """

                    // Menulis file .env untuk setiap service
                    sh """
                        echo "PORT=3000\nDB_HOST=mysql_db\nDB_USER=root\nDB_PASSWORD=${DB_ROOT_PASSWORD}\nDB_NAME=cms_catalog_db\nJWT_SECRET=test" > cms-catalog-backend/.env
                        echo "PORT=3001" > company-profile-batik/.env
                        echo "PORT=3002\nREACT_APP_API_URL=http://${SERVER_IP}/api\nESLINT_NO_DEV_ERRORS=true\nDISABLE_ESLINT_PLUGIN=true" > dashboard-cms/.env
                    """
                }
            }
        }

        stage('Build & Deploy') {
            steps {
                script {
                    echo "--- 5. Docker Compose Deploy ---"
                    // Matikan yang lama jika ada
                    sh 'docker-compose down --remove-orphans || true'
                    
                    // Jalankan ulang dengan build fresh
                    sh 'docker-compose up -d --build'
                }
            }
        }
    }

    post {
        success { echo "✅ DEPLOYMENT BERHASIL!" }
        failure { echo "❌ DEPLOYMENT GAGAL!" }
    }
}   
pipeline {
    agent any

    options {
        skipDefaultCheckout()
        timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        SERVER_IP = '192.168.1.53' 
        DB_ROOT_PASSWORD = 'test'
        // Gunakan ID kredensial Jenkins anda
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
                        // Menggunakan --depth 1 dan mematikan terminal prompt
                        sh """
                            export GIT_TERMINAL_PROMPT=0
                            git config --global http.sslVerify false
                            git clone --depth 1 https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/company-batik.git .
                        """
                        
                        echo "--- 3. Clone Sub-Projects Manual (Anti-Nyangkut) ---"
                        sh "rm -rf cms-catalog-backend company-profile-batik dashboard-cms"
                        
                        sh """
                            export GIT_TERMINAL_PROMPT=0
                            git clone --depth 1 https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/cms-catalog-backend.git cms-catalog-backend
                            git clone --depth 1 https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/company-profile-batik.git company-profile-batik
                            git clone --depth 1 https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/dashboard-cms.git dashboard-cms
                        """
                    }
                }
            }
        }
        
        stage('Setup Environment (.env)') {
            steps {
                script {
                    echo "--- 4. Generate File Environment (.env) ---"
                    sh """
                        echo 'PORT=3000\nDB_HOST=mysql_db\nDB_USER=root\nDB_PASSWORD=${DB_ROOT_PASSWORD}\nDB_NAME=cms_catalog_db\nJWT_SECRET=test' > cms-catalog-backend/.env
                        echo 'PORT=3001' > company-profile-batik/.env
                        echo 'PORT=3002\nREACT_APP_API_URL=http://${SERVER_IP}/api\nESLINT_NO_DEV_ERRORS=true\nDISABLE_ESLINT_PLUGIN=true' > dashboard-cms/.env
                    """
                }
            }
        }

        stage('Build & Deploy') {
            steps {
                script {
                    echo "--- 5. Docker Compose: Memulai Deployment ---"
                    sh 'docker-compose down --remove-orphans || true'
                    sh 'docker-compose pull'
                    sh 'docker-compose up -d --build'
                }
            }
        }
        
        stage('Database Migration') {
            steps {
                script {
                    echo "--- 6. Migrasi Database (Menunggu 20 detik) ---"
                    sleep 20 
                    sh 'docker exec cms_backend npx sequelize-cli db:migrate || echo "Migrasi gagal."'
                }
            }
        }
    }

    post {
        success {
            echo "✅ DEPLOYMENT SUKSES!"
        }
        failure {
            echo "❌ DEPLOYMENT GAGAL!"
        }
    }
}
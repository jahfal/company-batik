pipeline {
    agent any

    options {
        skipDefaultCheckout()
        timeout(time: 15, unit: 'MINUTES')
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
                        
                        // Konfigurasi performa & anti-interaksi
                        sh """
                            git config --global http.postBuffer 524288000
                            git config --global core.compression 0
                            git config --global http.sslVerify false
                            export GIT_TERMINAL_PROMPT=0
                        """

                        echo "--- 2. Clone Repo Utama ---"
                        sh "git clone --depth 1 https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/company-batik.git ."
                        
                        echo "--- 3. Clone Sub-Projects secara Manual ---"
                        sh "rm -rf cms-catalog-backend company-profile-batik dashboard-cms"
                        
                        // Menambahkan --progress agar kita bisa lihat apakah dia jalan atau benar-benar diam
                        // Jika nyangkut, log verbose akan menunjukkan apakah masalahnya di otentikasi atau koneksi
                        sh "git clone --depth 1 https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/cms-catalog-backend.git cms-catalog-backend"
                        echo "--- Backend Berhasil ---"
                        
                        sh "git clone --depth 1 https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/company-profile-batik.git company-profile-batik"
                        echo "--- Frontend Berhasil ---"
                        
                        sh "git clone --depth 1 https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/dashboard-cms.git dashboard-cms"
                        echo "--- CMS Berhasil ---"
                    }
                }
            }
        }
        
        stage('Setup Environment (.env)') {
            steps {
                script {
                    echo "--- 4. Membuat File .env ---"
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
                    echo "--- 5. Deployment Docker ---"
                    sh 'docker-compose down --remove-orphans || true'
                    sh 'docker-compose pull'
                    sh 'docker-compose up -d --build'
                }
            }
        }
    }

    post {
        success { echo "✅ Sukses!" }
        failure { echo "❌ Gagal!" }
    }
}
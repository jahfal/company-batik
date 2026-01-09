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
                        
                        // Set environment git agar tidak interaktif dan mengabaikan helper sistem
                        def gitBase = "https://${GIT_USER}:${GIT_PASS}@github.com/"
                        
                        sh """
                            export GIT_TERMINAL_PROMPT=0
                            export GIT_ASKPASS=/bin/echo
                            git config --global credential.helper ''
                        """

                        echo "--- 2. Clone Repo Utama ---"
                        sh "git clone --depth 1 ${gitBase}jahfal/company-batik.git ."
                        
                        echo "--- 3. Clone Sub-Projects secara Mandiri ---"
                        // Hapus folder jika ada
                        sh "rm -rf cms-catalog-backend company-profile-batik dashboard-cms"
                        
                        // Clone satu per satu dengan delay kecil agar network tidak overload
                        echo "Tarik Backend..."
                        sh "git clone --depth 1 ${gitBase}jahfal/cms-catalog-backend.git cms-catalog-backend"
                        
                        echo "Tarik Frontend..."
                        sh "git clone --depth 1 ${gitBase}jahfal/company-profile-batik.git company-profile-batik"
                        
                        echo "Tarik Dashboard..."
                        sh "git clone --depth 1 ${gitBase}jahfal/dashboard-cms.git dashboard-cms"
                    }
                }
            }
        }
        
        stage('Prepare Env & Deploy') {
            steps {
                script {
                    echo "--- 4. Setup Environment ---"
                    sh """
                        echo 'PORT=3000\nDB_HOST=mysql_db\nDB_USER=root\nDB_PASSWORD=${DB_ROOT_PASSWORD}\nDB_NAME=cms_catalog_db\nJWT_SECRET=test' > cms-catalog-backend/.env
                        echo 'PORT=3001' > company-profile-batik/.env
                        echo 'PORT=3002\nREACT_APP_API_URL=http://${SERVER_IP}/api\nESLINT_NO_DEV_ERRORS=true\nDISABLE_ESLINT_PLUGIN=true' > dashboard-cms/.env
                    """

                    echo "--- 5. Docker Deploy ---"
                    sh 'docker-compose down --remove-orphans || true'
                    sh 'docker-compose pull'
                    sh 'docker-compose up -d --build'
                }
            }
        }
    }
}
pipeline {
    agent any

    environment {
        SERVER_IP = '192.168.1.53' 
        DB_ROOT_PASSWORD = 'test'
    }

    stages {
        stage('Cleanup & Checkout') {
            steps {
                script {
                    echo "--- Membersihkan Workspace & Menarik Kode ---"
                    deleteDir()
                    
                    withCredentials([usernamePassword(credentialsId: 'github-jenkins-login', passwordVariable: 'GIT_PASS', usernameVariable: 'GIT_USER')]) {
                        // 1. Clone repo utama
                        sh "git clone https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/company-batik.git ."
                        
                        echo "--- Mengatur & Update Submodule (Anti-Nyangkut) ---"
                        // 2. Trik Utama: Memaksa Git menyisipkan username:password ke setiap URL github.com
                        sh """
                            git config url."https://${GIT_USER}:${GIT_PASS}@github.com/".insteadOf "https://github.com/"
                            git submodule init
                            git submodule update --init --recursive
                        """
                    }
                }
            }
        }
        
        stage('Setup Environment (.env)') {
            steps {
                script {
                    echo "--- Generate Env: BACKEND ---"
                    sh "echo 'PORT=3000\nDB_HOST=mysql_db\nDB_USER=root\nDB_PASSWORD=${DB_ROOT_PASSWORD}\nDB_NAME=cms_catalog_db\nJWT_SECRET=test' > cms-catalog-backend/.env"
                    
                    echo "--- Generate Env: FRONTEND ---"
                    sh "echo 'PORT=3001\n# NEXT_PUBLIC di-set di GitHub Actions' > company-profile-batik/.env"

                    echo "--- Generate Env: CMS ---"
                    sh "echo 'PORT=3002\nREACT_APP_API_URL=http://${SERVER_IP}/api\nESLINT_NO_DEV_ERRORS=true\nDISABLE_ESLINT_PLUGIN=true' > dashboard-cms/.env"
                }
            }
        }

        stage('Build & Deploy') {
            steps {
                echo "--- Membangun & Menjalankan Container ---"
                // || true penting agar pipeline tidak stop jika container belum ada
                sh 'docker-compose down --remove-orphans || true'
                sh 'docker-compose pull'
                sh 'docker-compose up -d --build'
            }
        }
        
        stage('Database Migration') {
            steps {
                script {
                    echo "--- Menunggu Database Siap (20 detik) ---"
                    sleep 20 
                    echo "--- Menjalankan Migrasi Database ---"
                    // Pastikan nama container 'cms_backend' sesuai dengan yang ada di docker-compose.yml
                    sh 'docker exec cms_backend npx sequelize-cli db:migrate || echo "Migrasi gagal, cek log container!"'
                }
            }
        }
    }
}
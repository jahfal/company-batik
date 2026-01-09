pipeline {
    agent any

    options {
        // PENTING: Mematikan checkout otomatis bawaan Jenkins agar tidak "nyangkut" di submodule
        skipDefaultCheckout()
        // Memberikan batas waktu build maksimal 30 menit
        timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        // IP Address Server
        SERVER_IP = '192.168.1.53' 

        // Password Database
        DB_ROOT_PASSWORD = 'test'
        
        // ID Kredensial yang ada di Jenkins (Pastikan ID ini benar di Jenkins Anda)
        CREDENTIAL_ID = 'github-jenkins-login'
    }

    stages {
        stage('Cleanup & Checkout') {
            steps {
                script {
                    echo "--- Membersihkan Workspace agar Fresh ---"
                    deleteDir() // Menghapus folder lama untuk menghindari masalah permission/kotor
                    
                    echo "--- Menarik Kode Utama & Submodule secara Manual ---"
                    withCredentials([usernamePassword(credentialsId: "${env.CREDENTIAL_ID}", passwordVariable: 'GIT_PASS', usernameVariable: 'GIT_USER')]) {
                        
                        // 1. Clone repo utama langsung ke folder workspace
                        sh "git clone https://${GIT_USER}:${GIT_PASS}@github.com/jahfal/company-batik.git ."
                        
                        // 2. Trik Anti-Nyangkut: Memaksa submodule menggunakan token login yang sama
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
                    sh """
                        echo 'PORT=3000
                        DB_HOST=mysql_db
                        DB_USER=root
                        DB_PASSWORD=${DB_ROOT_PASSWORD}
                        DB_NAME=cms_catalog_db
                        JWT_SECRET=test' > cms-catalog-backend/.env
                    """
                    
                    echo "--- Generate Env: FRONTEND ---"
                    sh """
                        echo 'PORT=3001
                        # NEXT_PUBLIC di-set di GitHub Actions' > company-profile-batik/.env
                    """

                    echo "--- Generate Env: CMS ---"
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
                    echo "--- Membangun & Menjalankan Container dengan Docker Compose ---"
                    
                    // --remove-orphans menghapus container lama yang tidak terpakai
                    // || true agar pipeline tidak gagal jika belum ada container yang running
                    sh 'docker-compose down --remove-orphans || true'
                    
                    // Menarik image terbaru (untuk Frontend)
                    sh 'docker-compose pull'
                    
                    // Build & Jalankan (untuk Backend & CMS)
                    sh 'docker-compose up -d --build'
                }
            }
        }
        
        stage('Database Migration') {
            steps {
                script {
                    echo "--- Menunggu Database Siap (20 detik) ---"
                    sleep 20 
                    
                    echo "--- Menjalankan Migrasi Database di dalam Container ---"
                    // Pastikan nama container 'cms_backend' sesuai dengan yang ada di docker-compose.yml
                    sh 'docker exec cms_backend npx sequelize-cli db:migrate || echo "Migrasi gagal, cek log container!"'
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Berhasil!"
        }
        failure {
            echo "❌ Deployment Gagal, periksa log di atas."
        }
    }
}
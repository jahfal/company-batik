pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                // Langkah 1: Jenkins menarik kode dari GitHub
                checkout scm
            }
        }
        
        stage('Setup Environment') {
            steps {
                script {
                    // Membuat file .env dummy dulu untuk tes koneksi
                    sh 'echo "PORT=3000" > .env'
                    sh 'echo "DB_HOST=mysql_db" >> .env'
                }
            }
        }

        stage('Build & Test Docker') {
            steps {
                // Coba bangun image-nya (memastikan tidak ada error syntax)
                sh 'docker-compose build'
            }
        }
    }
}
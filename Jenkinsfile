pipeline {
    agent any
    stages {
        stage('Pull & Deploy') {
            steps {
                withCredentials([sshUserPrivateKey(
                    credentialsId: 'deploy-ssh-key',
                    keyFileVariable: 'SSH_KEY',
                    usernameVariable: 'SSH_USER'
                )]) {
                    sh 'ssh -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new "$SSH_USER"@172.20.0.1 "cd /opt/company-batik && docker compose pull && docker compose up -d --remove-orphans && docker exec infra-nginx-proxy nginx -s reload"'
                }
            }
        }
    }
}
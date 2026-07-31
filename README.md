🚀 Hybrid CI/CD Pipeline: Batik App Deployment
Project Overview
This project demonstrates a robust Hybrid CI/CD Pipeline designed to deploy a multi-service application (Batik App) onto an On-Premise VirtualBox Server. By leveraging a hybrid approach, I optimized resource utilization by offloading heavy build processes to the cloud while maintaining full control over the local deployment environment.

🏗 System Architecture
The architecture is built on four core pillars:

Cloud Build (GitHub Actions): Handles resource-intensive Next.js builds to prevent on-premise server lag and CPU overhead.

Local Orchestration (Jenkins): Acts as the primary conductor on the Ubuntu Server, managing workspace cleanup, multi-repo synchronization, and container deployment.

Containerization (Docker): Orchestrates 4 microservices (Frontend, Backend API, MySQL, and CMS) for environment consistency.

Traffic Management (Nginx): Serves as a Reverse Proxy gateway, routing traffic to multiple services on Port 80 and 81.

🛠 Tech Stack
CI/CD: Jenkins (Local), GitHub Actions (Cloud)

Infrastructure: Docker, Docker Compose, Nginx

Virtualization: Oracle VirtualBox (Ubuntu Server)

Backend & Frontend: Node.js API, React CMS, Next.js Web

Database: MySQL 8.0

⚡ Key Features & Logic
1. Hybrid Optimization
To solve the issue of slow build times on restricted on-premise hardware, the pipeline uses GitHub Actions to build and push Docker images. The local Jenkins server then performs a docker pull, drastically reducing deployment time and local CPU load.

2. Advanced Reverse Proxy
Implemented an Nginx Gateway to handle multiple entry points:

Port 80: Main Company Profile Web.

Port 81: CMS Dashboard for product management.

Path Routing: Seamlessly proxies requests to the backend API and handles static asset delivery.

3. Automated Pipeline (Jenkinsfile)
The Jenkinsfile automates the following stages:

Cleanup: Using deleteDir() to ensure a fresh environment.

Multi-Repo Sync: Clones main and sub-projects using secure credentials.

Env Injection: Dynamically generates .env files for production consistency.

Deployment: Executes docker-compose up -d to refresh services.

🐞 Troubleshooting & Lessons Learned
Routing Conflict: Resolved 404 errors on React static assets by fine-tuning Nginx proxy_pass trailing slashes and absolute paths.

Resource Management: Pivoted from local builds to cloud builds after identifying significant performance bottlenecks during the Next.js compilation phase.

📸 Deployment Success
The pipeline consistently achieves a "Green Stage" view, ensuring that any changes pushed to GitHub are automatically reflected in the on-premise environment.

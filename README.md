# 🌐 Cloud Resume Challenge

This repository contains the complete source code and infrastructure for a **serverless portfolio website** built as part of the [Cloud Resume Challenge](https://cloudresumechallenge.dev/). It combines a static frontend built with **Next.js** and a dynamic backend using **AWS serverless services** to track unique visitors.
Feel free to read the [Deep Wiki](https://deepwiki.com/Haowei-Huang/cloud-resume-challenge) generated for this repo.


## 📋 Overview

This project showcases modern cloud-native development practices including:

- Serverless architecture using **AWS Lambda**, **API Gateway**, and **DynamoDB**
- Static hosting with **AWS S3** and **AWS CloudFront**
- Infrastructure as code with **Terraform**
- Automated CI/CD pipelines using **GitHub Actions**

## 🛠️ Technology Stack

### Frontend
- [**Next.js**](https://nextjs.org/) (**React** Framework) + **Tailwind CSS**
- Static Hosting via **AWS S3 + CloudFront**
- Component-based design with **Tailwind CSS Modules**

### Backend
- **AWS Lambda** for serverless compute with **Python** runtime
- **API Gateway** for **REST API** management and routing
- **DynamoDB** for **NoSQL** data persistence with pay-per-request billing

### Infrastructure
- **Terraform** for infrastructure as code and state management
- **AWS Route53** for DNS management and domain routing
- **AWS Certificate Manager** for SSL/TLS certificate provisioning
- **GitHub Actions** for continuous integration and deployment

## 🚀 Deployment Model

This project uses **dual pipelines**:

- **Frontend Deployment**: Triggered by changes to the `frontend/` directory.
  - Builds and uploads static site to S3
  - Invalidate CloudFront cache

- **Backend Infrastructure**: Managed through **Terraform** via **GitHub Actions**.
  - Runs `terraform plan` and `apply`
  - Validates infrastructure with smoke tests written with **Python** and **Playwright**

## System Architecture

The cloud resume challenge implements a serverless architecture pattern where static content is served through AWS CloudFront while dynamic visitor tracking is handled by AWS Lambda functions. The system uses domain-based routing to serve content from both root and www subdomains.

![architecture](https://github.com/user-attachments/assets/c0bc33a9-68ff-47ae-a2ee-88038d674bcb)



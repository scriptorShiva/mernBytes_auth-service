# Authentication Micro-Service

## Overview

Welcome to the Authentication Micro-Service repository! This micro-service is designed to handle user authentication with a strong focus on security and best practices. Below is an overview of the key features and technologies implemented in this project.

## Features

- [x] **Test-Driven Development (TDD):**
  - Utilized a Test-Driven Development approach to ensure robust test coverage for each implemented feature.

- [x] **Database Connection with TypeORM:**
  - Implemented database connectivity using TypeORM for seamless and efficient communication.

- [x] **Password Hashing:**
  - Ensured secure password hashing to safeguard user credentials.

- [x] **JWT Token Implementation:**
  - Generated JWT (JSON Web Tokens) for secure authentication and authorization.
  - Used RS256 algorithm for the refresh token and HS256 algorithm for the access token.

- [x] **Sanitizing for Request Fields:**
  - Incorporated input sanitization to enhance security and prevent common vulnerabilities.

- [x] **Token Verification:**
  - Implemented token verification mechanisms to ensure the integrity and authenticity of JWTs.

- [x] **Migration:**
  - Supported database migration for smooth updates and version control.

- [x] **Middleware for Role-Based Route Access:**
  - Created middleware for role-based access control, ensuring users can only access routes permitted by their assigned roles.

- [x] **CI/CD Pipeline using GitHub Actions:**
  - Implemented a continuous integration and continuous deployment pipeline using GitHub Actions for automated testing, linting, and deployment.

## Getting Started

Follow these steps to set up and run the Authentication Micro-Service locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/authentication-microservice.git
   cd authentication-microservice

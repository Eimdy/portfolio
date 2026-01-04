# Portfolio Linux Deployment Guide

This guide explains how to deploy the portfolio application on a Linux server (Ubuntu/Debian/CentOS) using the provided `deploy.sh` script.

## Prerequisites

Ensure your server has the following installed:

1.  **Node.js** (v18 or higher recommended)
    ```bash
    # Example for Ubuntu/Debian
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```
2.  **Git** (to pull the code)
3.  **Process Manager (PM2)** (Optional but recommended for production)
    ```bash
    sudo npm install -g pm2
    ```

## How to Deploy

1.  **Grant Execution Permission**
    Make the script executable:
    ```bash
    chmod +x deploy.sh
    ```

2.  **Run Deployment**
    Simply execute the script:
    ```bash
    ./deploy.sh
    ```

    **What the script does:**
    *   Installs dependencies (`npm install`)
    *   Builds the Next.js app (`npm run build`)
    *   Ensures database directory exists
    *   Starts/Reloads the application using **PM2** (if installed) or gives instructions for manual start.

## Manual Commands

If you prefer not to use the script:

```bash
# Install
npm install

# Build
npm run build

# Start (Production mode)
npm start
```

## Troubleshooting

-   **Database Permissions:** Ensure the user running the app has read/write permissions to the `database` folder and `database/portfolio.db`.
-   **Port:** By default, Next.js runs on port `3000`. You can change this in `package.json` or by passing environment variables: `PORT=8080 npm start`.
-   **Nginx Reverse Proxy:** For a production URL (e.g., portfolio.com), set up Nginx to proxy passes to `http://localhost:3000`.

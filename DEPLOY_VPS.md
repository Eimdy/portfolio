# Deployment Guide: Linux VPS + Cloudflare Tunnel

This guide explains how to deploy your Portfolio, Blog, and CMS on a Linux VPS using **PM2** for process management and **Cloudflare Tunnel** for secure public access (no Nginx/Port Opening required).

## Prerequisites
- A Linux VPS (Ubuntu/Debian)
- Node.js 18+ installed
- A Cloudflare Account with your domain (`eimd.my.id`) active

## 1. Prepare & Run App (PM2)

1.  **Clone/Upload** code to server (e.g., `/var/www/portfolio`).
2.  **Install Dependencies & Build**:
    ```bash
    npm install --production
    npm run build
    ```
3.  **Setup Database**:
    ```bash
    mkdir -p database
    chmod 775 database
    ```
4.  **Configure Environment**:
    Create `.env.local` based on `.env.example`.
    ```bash
    # .env.local
    NEXT_PUBLIC_PORTFOLIO_URL=https://eimd.my.id
    NEXT_PUBLIC_BLOG_URL=https://blog.eimd.my.id
    NEXT_PUBLIC_CMS_URL=https://cms.eimd.my.id
    ```
5.  **Start with PM2**:
    ```bash
    npm install -g pm2
    pm2 start npm --name "portfolio" -- start
    pm2 save
    pm2 startup
    ```
    *App is now running on `localhost:3000`.*

---

## 2. Setup Cloudflare Tunnel

### Method A: Via Cloudflare Dashboard (Recommended)
1.  Go to **Zero Trust Dashboard** > **Access** > **Tunnels**.
2.  Click **Create a Tunnel**. Name it (e.g., `vps-portfolio`).
3.  Choose **Debian/Ubuntu** and copy the **Connector Command**.
4.  Run that command on your VPS terminal.
5.  Once connected, go to **Public Hostnames** tab in the dashboard and add 3 entries:

    | Domain | Subdomain | Path | Service |
    | :--- | :--- | :--- | :--- |
    | eimd.my.id | (root) | / | `http://localhost:3000` |
    | eimd.my.id | blog | / | `http://localhost:3000` |
    | eimd.my.id | cms | / | `http://localhost:3000` |

    *All domains point to the same port 3000 because your Next.js app handles the routing logic.*

### Method B: Config File (CLI)
1.  **Install Cloudflared**:
    ```bash
    curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
    sudo dpkg -i cloudflared.deb
    ```
2.  **Login & Create**:
    ```bash
    cloudflared tunnel login
    cloudflared tunnel create portfolio-tunnel
    ```
3.  **Configure Ingress** (`~/.cloudflared/config.yml`):
    ```yaml
    tunnel: <Tunnel-UUID>
    credentials-file: /root/.cloudflared/<Tunnel-UUID>.json

    ingress:
      - hostname: eimd.my.id
        service: http://localhost:3000
      - hostname: blog.eimd.my.id
        service: http://localhost:3000
      - hostname: cms.eimd.my.id
        service: http://localhost:3000
      # Catch-all
      - service: http_status:404
    ```
4.  **Route DNS**:
    ```bash
    cloudflared tunnel route dns portfolio-tunnel eimd.my.id
    cloudflared tunnel route dns portfolio-tunnel blog.eimd.my.id
    cloudflared tunnel route dns portfolio-tunnel cms.eimd.my.id
    ```
5.  **Run Service**:
    ```bash
    cloudflared service install
    systemctl start cloudflared
    ```

## Done!
Your app is now secure behind Cloudflare Edge. SSL is handled automatically.

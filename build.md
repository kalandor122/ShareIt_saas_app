# Deploying Open SaaS (Wasp) to Coolify with Cloudflare Tunnels

This guide outlines how to deploy the **ShareIt** application (built with Open SaaS/Wasp) to a **Coolify** instance on a homelab, using **Cloudflare Tunnels** for public access and a dedicated **Stripe Sandbox** listener.

## 1. Build the Application
Before deploying, you must generate the production build using the Wasp CLI.
```bash
wasp build
```
This command generates the necessary Docker and static files in the `.wasp/build/` directory.

---

## 2. Deploy the Server (Backend)
The server handles the database, authentication, and Stripe logic.

1.  **Coolify Service:** Create a new **Docker-based** service.
2.  **Dockerfile Path:** Use `.wasp/build/Dockerfile`.
3.  **Destination Port:** `3001` (Default Wasp server port).
4.  **Required Environment Variables:**
    *   `DATABASE_URL`: Your PostgreSQL connection string.
    *   `JWT_SECRET`: A long, random string for session signing.
    *   `WASP_WEB_CLIENT_URL`: The public URL of your frontend (e.g., `https://app.yourdomain.com`).
    *   `STRIPE_KEY`: Your Stripe Secret Key (test mode for sandbox).
    *   `STRIPE_WEBHOOK_SECRET`: The signing secret (see Step 5).

---

## 3. Deploy the Frontend (Web App)
The frontend is a static React application built with Vite.

1.  **Coolify Service:** Create a **Static Site** service.
2.  **Base Directory:** `.wasp/build/web-app/`.
3.  **Build Command:** `npm install && npm run build`.
4.  **Publish Directory:** `dist`.
5.  **Environment Variables:**
    *   `REACT_APP_WASP_SERVER_URL`: The public URL of your backend (e.g., `https://api.yourdomain.com`).

---

## 4. Cloudflare Tunnel Configuration
Configure your Cloudflare Tunnel to route traffic to the internal Coolify IP addresses/ports.

| Public Hostname | Service Type | Internal URL (Coolify) |
| :--- | :--- | :--- |
| `app.yourdomain.com` | `HTTP` | `http://<frontend-container-ip>:80` |
| `api.yourdomain.com` | `HTTP` | `http://<server-container-ip>:3001` |

---

## 5. Stripe Sandbox Server (Webhook Listener)
In a homelab environment, the most reliable way to handle "Sandbox" payments is to run a persistent **Stripe CLI listener** as a Docker service in Coolify.

1.  **Coolify Service:** Create a new service using the official image `stripe/stripe-cli`.
2.  **Command/Entrypoint:** 
    ```bash
    listen --api-key <YOUR_STRIPE_TEST_SECRET_KEY> --forward-to http://<server-container-name>:3001/payments-webhook
    ```
3.  **Workflow:**
    *   Check the logs of this container to find the **Webhook Signing Secret** (e.g., `whsec_...`).
    *   Update your **Server Service** environment variables with this `STRIPE_WEBHOOK_SECRET`.
    *   Test payments in Stripe's sandbox will now be automatically forwarded to your internal backend.

---

## Internal Network Flow Summary
1.  **User** visits `app.yourdomain.com` -> Cloudflare Tunnel -> Coolify Frontend.
2.  **Frontend** calls `api.yourdomain.com` -> Cloudflare Tunnel -> Coolify Server.
3.  **Stripe** (Sandbox) sends event -> **Stripe CLI Container** -> Coolify Internal Network -> Coolify Server.

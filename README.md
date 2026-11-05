# GlowGuide

GlowGuide is a personalized skincare education and product discovery app. It pairs a React/Vite frontend with a Spring Boot REST API and MongoDB.

## Run locally

Requirements: Node.js 20.19+ (or 22.12+), Java 17+, Maven 3.8+, and MongoDB 6+ running locally or a MongoDB Atlas connection string.

1. Copy `.env.example` to `.env` and set `MONGODB_URI` and a private `JWT_SECRET` of at least 32 bytes. Spring Boot does not load `.env` files by itself, so import the values into the API terminal before starting it. In PowerShell, run this from the project root:

   ```powershell
   Get-Content .env | Where-Object { $_ -match '^\s*[^#\s].*=' } | ForEach-Object {
     $name, $value = $_ -split '=', 2
     [Environment]::SetEnvironmentVariable($name.Trim(), $value.Trim(), 'Process')
   }
   ```

   With `SEED_ENABLED=true`, the development profile adds 37 skincare brands, 113 real product references, and an 11-entry ingredient guide. Entries remain marked as development seed data; price references and formulas can change, so every product links to its brand for current details. The seed runner is safe to rerun and deactivates old fictional `Sample` products in the public catalogue. To create the first admin account, set both `BOOTSTRAP_ADMIN_EMAIL` and a private `BOOTSTRAP_ADMIN_PASSWORD` of at least 12 characters. No default admin password is shipped.
2. In a terminal, start the API from `backend`:

   ```powershell
   mvn spring-boot:run
   ```

   It listens on `http://localhost:8080`. Leave the API terminal running.
3. In another terminal, install and start the web app:

   ```powershell
   cd frontend
   Copy-Item .env.example .env
   npm install
   npm run dev
   ```

4. Open `http://localhost:5173`.

The public **Brands** page links to each brand's shop filter. Routines require a signed-in user; the Admin dashboard appears in the account menu only for an admin and is also protected by server-side role checks. If an API request fails, the frontend reports the affected section as unavailable while the rest of the page remains usable. Check that MongoDB and the API are running before testing the catalog, account, quiz, routine, order, or admin data flows. Both `http://localhost:5173` and `http://127.0.0.1:5173` are allowed by the default CORS configuration.

## Optional services

- Google sign-in and Google signup: set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `OAUTH2_ENABLED=true`, then start with profiles `dev,oauth`. Register `http://localhost:5173` as an Authorized JavaScript origin and `http://localhost:8080/login/oauth2/code/google` as an Authorized redirect URI in Google Cloud Console. Set `VITE_GOOGLE_LOGIN_ENABLED=true` in `frontend/.env`. Keep Google credentials server-side. Google returns to the frontend using a URL fragment so the JWT is not sent in the HTTP request URL.
- Email verification and password reset: configure `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, and `MAIL_FROM`. For Gmail, use an App Password and a sender address authorized for that account. Contact messages are delivered to `CONTACT_TO_EMAIL` (defaults to `MAIL_USERNAME`). The forgot-password page checks the backend's email configuration instead of relying on a hard-coded frontend flag.
- Cloudinary uploads: configure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
- Production SEO: set `VITE_SITE_URL` to the deployed public origin before building. The production build generates `robots.txt` and `sitemap.xml` for that origin; without it, the build omits a sitemap instead of publishing a made-up domain.
- Social links and support email are optional and only appear when verified values are provided in the frontend environment.

The skincare assistant currently uses the local ingredient library and recommendation engine. It does not claim to be a medical professional or require an external AI key. Checkout is a demonstration flow and does not collect card data or process payments. Replace demo products and review all legal/support copy before launching a real store.

## Deploy the backend for the Vercel frontend

The Spring Boot API is a separate web service; the Vercel site cannot call a backend running at `localhost`. The root `render.yaml` and `backend/Dockerfile` prepare the API for deployment on Render:

1. Push the project to GitHub, then in Render choose **New → Blueprint** and connect this repository. Render reads `render.yaml` and builds the API from `backend/Dockerfile`.
2. When Render asks for `MONGODB_URI`, enter your MongoDB Atlas connection string. Keep it private. The Blueprint creates a JWT secret and allows the deployed Vercel frontend origin. The seed catalogue is enabled for the initially empty production database.
3. After the Render service is live, copy its `onrender.com` URL. In Vercel, open the **frontend** project settings and add `VITE_API_BASE_URL` with the value `https://<your-render-service>.onrender.com/api`. Redeploy the frontend so Vite includes that URL in the production build.
4. Confirm the API is live by opening `https://<your-render-service>.onrender.com/api/health`; it should return `{"status":"UP"}`. The products endpoint is `https://<your-render-service>.onrender.com/api/products`.

Render injects the service port through `PORT`; Spring Boot reads it automatically. If you deploy on another Java host, set `PORT`, `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_BASE_URL`, `CORS_ALLOWED_ORIGINS`, `SPRING_PROFILES_ACTIVE=prod`, and `SEED_ENABLED=true` in that host's environment.

## Build commands

From `frontend`, run `npm run build` for a production bundle and `npm run lint` for lint diagnostics. From `backend`, run `mvn package` to package the API.

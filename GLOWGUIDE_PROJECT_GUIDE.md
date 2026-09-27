# GlowGuide: Beginner-Friendly Project Guide

This guide explains the GlowGuide project in plain language, including what the frontend and backend files do and how they work together. It is written so you can use it to prepare for your end-of-year presentation.

## The project in one sentence

GlowGuide is a skincare education and product-discovery website: a visitor can learn about ingredients, answer a skin questionnaire, get product suggestions from the catalogue, build a routine, and manage an account.

## The big picture

The project has two main programs:

```text
Person using the website
        ↓ clicks, types, submits a quiz
React frontend (the pages and buttons in the browser)
        ↓ sends an HTTP request containing data
Spring Boot backend (the rules and API)
        ↓ reads or saves records
MongoDB database
        ↓ sends a result back
Backend → Frontend → Person sees the result
```

- **Frontend** means the part you see and use in a web browser. This project uses React and JavaScript.
- **Backend** means the server behind the website. It receives requests, checks rules and accounts, and reads or saves information. This project uses Java and Spring Boot.
- **Database** means an organized place to store information. GlowGuide uses MongoDB.
- **API** means the agreed set of doors the frontend can use to ask the backend for information. For example, `/api/products` is a door to the product catalogue.

### Example: how a skincare quiz works

1. `SkinQuiz.jsx` shows the questions and gathers the visitor's answers.
2. `quizService.js` sends those answers to the backend.
3. `QuizController.java` receives the request, and `QuizService.java` processes it.
4. `QuizResult` is the kind of database record used to save the result.
5. `RecommendationService.java` scores catalogue products against the skin profile.
6. The backend returns product suggestions and explanations; React displays them.

## A few important presentation facts

- Product suggestions come from the catalogue and a configurable scoring system. The scores help rank matches; they are not a medical diagnosis.
- The assistant is an educational helper built from the local ingredient information and recommendation features. It does not currently call a paid external AI service.
- Checkout is a demonstration flow. It does not process real card payments or place real retail orders.
- Google OAuth code exists on the backend, but Google buttons were removed from login and signup so the pages do not advertise sign-in that has not been configured. Do not present Google login as active.
- Contact and password-reset email code exists, but actual email delivery requires SMTP settings. The backend currently reports email delivery as not configured.
- Development seed data provides catalogue examples for the demo. Product and brand details can change; the app directs shoppers to the brand's own shop for current information.

## How to talk about the backend layers

The backend is arranged like a restaurant:

| Backend part | Simple comparison | What it does |
| --- | --- | --- |
| `controller` | Front desk | Receives web requests and sends responses. |
| `dto` | Order form / receipt | Defines the information accepted from or returned to the browser. |
| `service` | Kitchen | Applies the actual rules and performs the work. |
| `repository` | Filing cabinet | Finds and saves database records. |
| `model` | Record card | Describes the shape of a thing stored in MongoDB. |
| `config` | Building settings | Sets up security, database, images, and scoring options. |
| `security` | Door and ID check | Confirms who the user is and what they may access. |

## Root folder files

| File or folder | What it is for |
| --- | --- |
| `README.md` | Main setup guide: required software, how to start the app, optional services, and build commands. |
| `.env.example` | Safe template of environment-variable names. Copy it to `.env` locally and fill in your own private settings; never publish secrets. |
| `.gitignore` | Tells Git which private, generated, or machine-specific files not to track. |
| `backend/` | Java Spring Boot server and API. |
| `frontend/` | React website that runs in the browser. |
| `.git/` | Git's private project-history database. It is not website code and should not be edited by hand. |
| `.github/modernize/java-upgrade/` | GitHub modernization-tool support files and hooks. These help repository maintenance; they are not part of the GlowGuide user experience. |
| `.github/modernize/java-upgrade/.gitignore` | Ignores files created by the Java modernization helper. |
| `.github/modernize/java-upgrade/hooks/d52fe001-3b83-4af1-9233-b8ed3b4b8b83.json` | Hook metadata used by the repository modernization tool. |
| `.github/modernize/java-upgrade/hooks/scripts/recordToolUse.ps1` | PowerShell helper that records modernization-tool use. |
| `.github/modernize/java-upgrade/hooks/scripts/recordToolUse.sh` | The same kind of helper for Linux/macOS shells. |
| `.vscode/settings.json` | Editor preferences for Visual Studio Code; it does not change the website's features. |

## Backend: startup and configuration

Backend source root: `backend/src/main/java/com/glowguide/`.

| File | What it is for |
| --- | --- |
| `GlowGuideApplication.java` | The backend's starting point. Spring Boot launches the API from this class. |
| `backend/pom.xml` | Maven recipe: names the Java version and libraries such as Spring, MongoDB, email, security, and tests. |
| `config/CloudinaryConfig.java` | Sets up the optional Cloudinary image service. |
| `config/CloudinaryProperties.java` | Holds Cloudinary settings read from the environment. |
| `config/CorsConfig.java` | Allows the browser app's local address to call the backend. This is called CORS. |
| `config/JwtProperties.java` | Holds settings for login-token signing and expiration. |
| `config/MongoConfig.java` | Configures MongoDB-related behavior. |
| `config/RecommendationScoringProperties.java` | Holds adjustable points and limits used to rank product recommendations. |
| `config/SecurityConfig.java` | Sets the security rules: public routes, signed-in routes, administrator access, JWT, and optional OAuth. |

### Backend controllers: the API doors

These classes accept browser requests. Most hand the real work to a service class.

| File | What it is for |
| --- | --- |
| `controller/AdminCatalogController.java` | Admin API for creating, viewing, changing, and deleting brands and product categories. |
| `controller/AdminInsightsController.java` | Admin API for quiz summaries and site analytics. |
| `controller/AdminManagementController.java` | Admin API for ingredients, users, order status, and review moderation. |
| `controller/AdminOverviewController.java` | Supplies the summary data shown on the admin home page. |
| `controller/AdminProductController.java` | Admin API for managing products. |
| `controller/ArticleController.java` | Returns educational articles and individual article pages. |
| `controller/AssistantController.java` | Receives a question sent to the skincare assistant and returns its answer. |
| `controller/AuthController.java` | Handles signup, login, logout, email verification, password reset, and current-user details. |
| `controller/BrandController.java` | Returns the public brand list and a single brand's details. |
| `controller/CartController.java` | Reads the signed-in user's cart and adds, changes, or removes cart items. |
| `controller/CategoryController.java` | Returns product categories and category details. |
| `controller/ContactController.java` | Receives contact-form messages and newsletter subscriptions. |
| `controller/IngredientController.java` | Returns ingredient-library lists and ingredient details. |
| `controller/MediaController.java` | Receives profile, product, and ingredient image uploads. |
| `controller/OrderController.java` | Creates demonstration checkouts and returns the signed-in user's orders. |
| `controller/ProductController.java` | Returns product lists, featured products, product details, and related products. |
| `controller/QuizController.java` | Accepts quiz answers and returns the user's saved quiz results. |
| `controller/RecommendationController.java` | Returns the product recommendations for a quiz result or a user's latest result. |
| `controller/ReviewController.java` | Returns product reviews and lets signed-in users add or view their reviews. |
| `controller/RoutineController.java` | Reads, creates, updates, and deletes a signed-in user's skincare routines. |
| `controller/UserController.java` | Updates the signed-in user's profile and skin profile, or deletes their account. |
| `controller/WishlistController.java` | Reads and changes the signed-in user's saved-products list. |

### Backend DTOs: the forms sent through the API

**DTO** means Data Transfer Object. In everyday language, it is a neatly shaped form used to send information between the browser and server. Request DTOs carry information in; response DTOs carry information out. They help avoid sending the entire database record when only a few fields are needed.

| File | What information it carries |
| --- | --- |
| `dto/assistant/AssistantRequest.java` | The question and optional context the visitor sends to the assistant. |
| `dto/assistant/AssistantResponse.java` | The assistant's answer and related suggestion data sent back to the page. |
| `dto/auth/AuthResponse.java` | Login/signup result, such as the access token and basic user details. |
| `dto/auth/ForgotPasswordRequest.java` | Email address submitted on the forgot-password page. |
| `dto/auth/LoginRequest.java` | Email and password submitted to log in. |
| `dto/auth/ResendVerificationRequest.java` | Email address that needs another verification message. |
| `dto/auth/ResetPasswordRequest.java` | Reset token and the replacement password. |
| `dto/auth/SignupRequest.java` | Name, email, and password submitted to create an account. |
| `dto/catalog/AdminAnalyticsResponse.java` | Counts and totals shown on the admin analytics page. |
| `dto/catalog/ArticleResponse.java` | Article details formatted for the frontend. |
| `dto/catalog/BrandResponse.java` | Public/admin brand information returned by the API. |
| `dto/catalog/BrandUpsertRequest.java` | Brand details an admin submits to create or update a brand. “Upsert” means create or update. |
| `dto/catalog/CategoryResponse.java` | Category information returned to the frontend. |
| `dto/catalog/CategoryUpsertRequest.java` | Category details an admin submits to create or update a category. |
| `dto/common/ApiErrorResponse.java` | Standard format for an API error message. |
| `dto/contact/ContactRequest.java` | Name, email, subject, and message from the contact form. |
| `dto/contact/NewsletterRequest.java` | Email address submitted to the newsletter signup. |
| `dto/ingredient/IngredientDetailResponse.java` | Full ingredient-library details for one ingredient page. |
| `dto/ingredient/IngredientResponse.java` | Short ingredient information for lists and cards. |
| `dto/ingredient/IngredientUpsertRequest.java` | Ingredient details an admin submits to create or update an ingredient. |
| `dto/media/MediaUploadResponse.java` | Result of an image upload, such as its public image address. |
| `dto/order/AddressRequest.java` | Delivery/contact address sent during checkout. |
| `dto/order/AdminOrderResponse.java` | Order details formatted for the admin interface. |
| `dto/order/OrderCheckoutRequest.java` | Items and delivery information submitted to create a demonstration order. |
| `dto/order/OrderResponse.java` | Order details returned to a customer. |
| `dto/order/OrderStatusUpdateRequest.java` | New status an admin wants to assign to an order. |
| `dto/order/PaymentRequest.java` | Payment-choice/demo payment information; it does not mean card payments are processed. |
| `dto/product/ProductDetailResponse.java` | Full information used on an individual product page. |
| `dto/product/ProductResponse.java` | Product information used in lists, cards, and search results. |
| `dto/product/ProductUpsertRequest.java` | Product details an admin submits to create or update a catalogue product. |
| `dto/quiz/AdminInsightsResponse.java` | Quiz answer summaries formatted for the admin insights page. |
| `dto/quiz/QuizResultResponse.java` | A saved quiz result returned to the user. |
| `dto/quiz/QuizSubmitRequest.java` | Skin answers and preferences submitted by the quiz page. |
| `dto/quiz/RecommendationResponse.java` | Ranked products plus reasons they matched the quiz answers. |
| `dto/review/ReviewRequest.java` | Rating and written review submitted by a user. |
| `dto/review/ReviewResponse.java` | Review text, rating, author, and status returned by the API. |
| `dto/review/ReviewStatusUpdateRequest.java` | Admin choice to approve, hide, or otherwise change a review's status. |
| `dto/routine/RoutineRequest.java` | Routine name, type, and steps submitted to be saved. |
| `dto/routine/RoutineResponse.java` | Saved routine returned to the routine page. |
| `dto/routine/RoutineStepRequest.java` | One step in a routine, such as cleanser or moisturizer. |
| `dto/shopping/CartItemRequest.java` | Product and quantity to add to the cart. |
| `dto/shopping/CartItemResponse.java` | One cart line returned to the browser. |
| `dto/shopping/CartResponse.java` | Whole cart, including its product lines and totals. |
| `dto/shopping/QuantityRequest.java` | New quantity for a cart item. |
| `dto/shopping/WishlistResponse.java` | Products saved by the user. |
| `dto/user/EnabledUpdateRequest.java` | Admin's choice to enable or disable a user account. |
| `dto/user/ProfileUpdateRequest.java` | Name and profile information a user can edit. |
| `dto/user/RolesUpdateRequest.java` | Admin's choice of user permissions/roles. |
| `dto/user/SkinProfileUpdateRequest.java` | Skin type, concerns, sensitivity, and preferences for the user's profile. |
| `dto/user/UserSummaryDto.java` | Safe, short user information for admin lists. |

### Backend models: the kinds of records the database stores

These Java classes describe the information GlowGuide stores. MongoDB saves each record as a document (a data object with named fields). Some names below are **enums**: a fixed list of allowed choices, like AM/PM or order status.

| File | Plain-language meaning |
| --- | --- |
| `model/Address.java` | A saved delivery address. |
| `model/Article.java` | An educational article. |
| `model/ArticleCategory.java` | Fixed choices for article categories. |
| `model/AuthProvider.java` | Which sign-in method is associated with an account (local password or an external provider). |
| `model/Brand.java` | A skincare brand and its shop details. |
| `model/BudgetRange.java` | Allowed budget choices used by matching. |
| `model/Cart.java` | One user's shopping cart. |
| `model/CartItem.java` | One product and quantity inside a cart. |
| `model/Category.java` | A product category such as cleanser or sunscreen. |
| `model/ContactMessage.java` | A message received from the contact form. |
| `model/EmailVerificationToken.java` | A time-limited code/link token used to verify an email address. |
| `model/Ingredient.java` | Ingredient facts used by the library and recommendations. |
| `model/NewsletterSubscriber.java` | An email address saved for newsletter signup. |
| `model/Order.java` | One checkout/order record. In this project checkout is a demo. |
| `model/OrderItem.java` | One product line inside an order. |
| `model/OrderStatus.java` | Fixed allowed order states, such as a placed or fulfilled order. |
| `model/PasswordResetToken.java` | A time-limited token used to choose a new password. |
| `model/PaymentInfo.java` | Demonstration payment-choice details associated with checkout. |
| `model/PaymentStatus.java` | Fixed state choices for demo payment processing. |
| `model/Product.java` | A skincare product, including brand, category, ingredients, price reference, and links. |
| `model/ProductCategory.java` | Fixed product category choices used in product/routine logic. |
| `model/QuizResult.java` | One user's submitted skin questionnaire and its result. |
| `model/Review.java` | A product rating/review and its moderation state. |
| `model/ReviewStatus.java` | Fixed review states such as pending, approved, or hidden. |
| `model/Role.java` | Fixed access roles, such as regular user or administrator. |
| `model/Routine.java` | A saved skincare routine belonging to a user. |
| `model/RoutineStep.java` | One ordered action in a routine, with a product/category and AM/PM timing. |
| `model/RoutineType.java` | Fixed routine timing choices such as morning or evening. |
| `model/SensitivityLevel.java` | Fixed skin-sensitivity choices used by recommendations. |
| `model/SkinConcern.java` | Fixed skin concern choices used by the quiz and matching. |
| `model/SkinProfile.java` | Skin type, concerns, budget, sensitivity, and preferences saved for a user. |
| `model/SkinType.java` | Fixed skin type choices, such as oily, dry, or combination. |
| `model/User.java` | Account information, password/authentication details, roles, and profile. |
| `model/Wishlist.java` | A user's saved-product list. |

### Backend repositories: talking to MongoDB

Repositories are the database helpers. The service layer calls them to find or save records.

| File | What it looks up or saves |
| --- | --- |
| `repository/ArticleRepository.java` | Articles. |
| `repository/BrandRepository.java` | Brands. |
| `repository/CartRepository.java` | Carts. |
| `repository/CategoryRepository.java` | Categories. |
| `repository/ContactMessageRepository.java` | Contact-form messages. |
| `repository/EmailVerificationTokenRepository.java` | Email-verification tokens. |
| `repository/IngredientRepository.java` | Ingredient-library records. |
| `repository/NewsletterSubscriberRepository.java` | Newsletter signups. |
| `repository/OrderRepository.java` | Customer orders. |
| `repository/PasswordResetTokenRepository.java` | Password-reset tokens. |
| `repository/ProductFilter.java` | The values used to filter products, such as category, search text, or budget. |
| `repository/ProductRepository.java` | Product database access. |
| `repository/ProductRepositoryCustom.java` | Extra product-search operations beyond Spring's automatic database methods. |
| `repository/ProductRepositoryImpl.java` | The code that performs those custom product-search operations. |
| `repository/QuizResultRepository.java` | Saved quiz answers/results. |
| `repository/ReviewRepository.java` | Product reviews. |
| `repository/RoutineRepository.java` | Saved routines. |
| `repository/UserRepository.java` | User accounts. |
| `repository/WishlistRepository.java` | Saved-product lists. |

### Backend services: where the rules live

| File | What work it performs |
| --- | --- |
| `service/AdminCatalogService.java` | Admin operations for brands and categories. |
| `service/AuthService.java` | Signup, password login, email verification, password reset, and token handling. |
| `service/BootstrapAdmin.java` | Creates the first administrator only when explicitly configured. |
| `service/CartService.java` | Validates and updates the user's cart. |
| `service/CatalogService.java` | Reads public brands, categories, articles, and catalogue details. |
| `service/ContactService.java` | Saves contact messages and requests email delivery. |
| `service/DevelopmentSeedData.java` | Adds development/demo brands, products, and ingredients to an empty or existing dev database. |
| `service/EducationalAssistantService.java` | Builds the educational answer from the local skincare/ingredient information. |
| `service/EmailDeliveryUnavailableException.java` | A specific error meaning a required email could not be delivered. |
| `service/EmailService.java` | Sends verification, reset, contact, and confirmation emails through SMTP when configured. |
| `service/IngredientService.java` | Reads ingredient information and performs admin ingredient changes. |
| `service/MediaService.java` | Validates and uploads images to Cloudinary when configured. |
| `service/OrderService.java` | Creates the demonstration checkout and returns order data. |
| `service/ProductService.java` | Searches, filters, and returns products. |
| `service/QuizService.java` | Validates quiz answers, saves results, and connects answers to recommendations. |
| `service/RecommendationService.java` | Scores matching products and explains why they match user preferences. |
| `service/ReviewService.java` | Saves, lists, and moderates product reviews. |
| `service/RoutineService.java` | Builds, validates, and saves routines. |
| `service/SkincareAssistantService.java` | Coordinates the assistant request with user/product/ingredient context. |
| `service/UserService.java` | Updates profiles and manages user accounts. |
| `service/WishlistService.java` | Adds, removes, and lists saved products. |

### Backend security files

| File | What it is for |
| --- | --- |
| `security/CustomOAuth2UserService.java` | Reads and checks the Google account details during OAuth login, if that optional flow is enabled. |
| `security/CustomUserDetailsService.java` | Finds a local user account when Spring Security needs to authenticate it. |
| `security/GlowGuideOidcUser.java` | Adapts an OpenID Connect identity to GlowGuide's user details. |
| `security/JwtAuthenticationFilter.java` | Checks each protected API request for a valid JWT login token. |
| `security/JwtService.java` | Creates and validates JWTs. |
| `security/OAuth2AuthenticationSuccessHandler.java` | Chooses where to send a person after successful Google OAuth. The login button is currently hidden in the frontend. |
| `security/RestAuthEntryPoint.java` | Returns a proper API response when someone tries to access a protected route without signing in. |
| `security/UserPrincipal.java` | The signed-in user's identity and permissions as used by Spring Security. |

### Backend error handling and settings

| File | What it is for |
| --- | --- |
| `exception/BadRequestException.java` | Says a request is malformed or its values are not allowed. |
| `exception/DuplicateResourceException.java` | Says a record already exists, such as an email address that is already registered. |
| `exception/ExpiredTokenException.java` | Says a verification/reset token is no longer valid. |
| `exception/GlobalExceptionHandler.java` | Converts backend errors into consistent HTTP error responses instead of exposing confusing server details. |
| `exception/ResourceNotFoundException.java` | Says the requested product, user, or other record could not be found. |
| `exception/UnauthorizedActionException.java` | Says the signed-in user is not allowed to perform an action. |
| `backend/src/main/resources/application.properties` | Shared server settings such as port, MongoDB, JWT, mail, CORS, and recommendation scores. Secret values are read from environment variables. |
| `backend/src/main/resources/application-dev.properties` | Development-only settings, including demo data and more detailed development logs. |
| `backend/src/main/resources/application-oauth.properties` | Optional Google OAuth settings; only used when the OAuth profile and credentials are configured. |
| `backend/src/main/resources/application-prod.properties` | Production safety settings, such as disabling demo data and hiding detailed error messages. |

## Frontend: what runs in the browser

The frontend is inside `frontend/`. It uses React (reusable page pieces), React Router (page addresses), Axios (HTTP requests), and Vite (the local development server and production builder).

### Frontend setup files and public assets

| File | What it is for |
| --- | --- |
| `frontend/package.json` | Names the frontend scripts and its JavaScript libraries. `npm run dev` starts it, `npm run build` packages it, and `npm run lint` checks code. |
| `frontend/package-lock.json` | Locks exact dependency versions so installs are consistent between computers. Do not edit it by hand. |
| `frontend/index.html` | The single HTML page Vite opens. React mounts the whole website into its `<div id="root">`. It also contains base SEO/social tags and font links. |
| `frontend/vite.config.js` | Configures Vite, React, Tailwind CSS, local port, and generated production sitemap/robots files. |
| `frontend/.env.example` | Template for frontend settings like API URL and public site URL. Only `VITE_` variables are exposed to browser code, so never put passwords here. |
| `frontend/.gitignore` | Excludes frontend dependencies, built files, logs, and local environment files from Git. |
| `frontend/.oxlintrc.json` | Sets lint rules; important React hook rules are treated as errors. |
| `frontend/README.md` | Original React/Vite starter notes. The main project instructions are in the root `README.md`. |
| `frontend/public/favicon.svg` | Small GlowGuide icon shown in browser tabs. |
| `frontend/public/og-image.svg` | Preview image used when sharing the website link on social platforms. |
| `frontend/public/product-placeholder.svg` | A fallback illustration when a product image is missing. |
| `frontend/public/robots.txt` | Search crawler instructions for the built site; Vite also writes the production version during build. |

### Frontend startup, routes, and global design

| File | What it is for |
| --- | --- |
| `src/main.jsx` | Browser entry point: creates the React app and loads the global stylesheet. |
| `src/App.jsx` | Sets up page routes, login/cart/wishlist providers, page loading, scroll-to-top, SEO, and the app-wide error boundary. |
| `src/App.css` | App-level CSS styles. |
| `src/index.css` | Global styles, fonts, Tailwind setup, and shared color/design rules. |
| `src/utils/constants.js` | Shared lists and fixed values used by multiple pages. |
| `src/utils/format.js` | Small helpers for displaying values consistently, such as money or text. |
| `src/utils/routinePlan.js` | Builds or formats the step order for morning and evening routines. |
| `src/hooks/useDebounce.js` | Waits briefly after typing before running a search; avoids sending a request for every keystroke. |

`App.jsx` uses separate URL routes for Home, Shop, Brands, products, learning, ingredients, quiz, routines, cart/checkout, login/signup, account pages, and protected admin pages. `ProtectedRoute` checks sign-in for user pages; `AdminRoute` also checks the admin role.

### Frontend reusable components

Components are smaller pieces reused inside pages.

| File | What it shows or does |
| --- | --- |
| `components/assistant/AssistantWidget.jsx` | The floating skincare question-and-answer assistant interface. |
| `components/layout/Footer.jsx` | Footer links and site information. |
| `components/layout/MobileMenu.jsx` | Navigation menu designed for phone screens. |
| `components/layout/Navbar.jsx` | Main site navigation, account links, and shopping/cart links. |
| `components/layout/ProtectedRoute.jsx` | Prevents visitors from opening signed-in-only or admin-only routes. |
| `components/product/ProductCard.jsx` | Reusable product tile with image, price, and product actions. |
| `components/quiz/QuizOption.jsx` | One clickable answer choice in the skin quiz. |
| `components/review/ReviewList.jsx` | Displays reviews for a product. |
| `components/ui/AppErrorBoundary.jsx` | Catches serious React display errors so one crash can show a friendly fallback. |
| `components/ui/Button.jsx` | Shared button with common styling and loading state. |
| `components/ui/EmptyState.jsx` | Friendly message for a page with no saved items/results yet. |
| `components/ui/ErrorState.jsx` | Friendly error message and recovery action for a failed page section. |
| `components/ui/PageLoader.jsx` | Loading indicator while a page is being downloaded or loaded. |
| `components/ui/RatingStars.jsx` | Displays a star rating. |
| `components/ui/Seo.jsx` | Sets page-specific title and metadata for search engines/social previews. |
| `components/ui/Skeleton.jsx` | Placeholder shapes shown while content is loading. |

### Frontend layouts and shared state

| File | What it is for |
| --- | --- |
| `layouts/MainLayout.jsx` | Shared frame for public website pages, usually navigation and footer. |
| `layouts/AuthLayout.jsx` | Shared frame for login, signup, and password pages. |
| `layouts/DashboardLayout.jsx` | Shared menu/frame for the signed-in user dashboard. |
| `layouts/AdminLayout.jsx` | Shared menu/frame for administrator pages. |
| `context/AuthContext.jsx` | Keeps track of the signed-in user and provides login, signup, and logout actions throughout React. |
| `context/CartContext.jsx` | Shares cart data and cart actions between product cards, navigation, and cart pages. |
| `context/WishlistContext.jsx` | Shares saved-product data/actions between pages. |

**Context** is React's way to share important information with many components without passing it manually through every layer.

### Frontend pages: public pages

| File | What the visitor sees |
| --- | --- |
| `pages/Home.jsx` | Landing page with the site's introduction, featured content, and entry points to features. |
| `pages/About.jsx` | About GlowGuide page. |
| `pages/Contact.jsx` | Contact form connected to the contact API. Email delivery requires backend mail settings. |
| `pages/Shop.jsx` | Product catalogue with search, filters, and pagination. |
| `pages/Brands.jsx` | Browse skincare brands and go to their shop/product links. |
| `pages/ProductDetail.jsx` | One product's details, ingredients, brand link, reviews, and shopping actions. |
| `pages/Learn.jsx` | Browse skincare education articles. |
| `pages/ArticleDetail.jsx` | Read one education article. |
| `pages/Ingredients.jsx` | Browse the ingredient guide. |
| `pages/IngredientDetail.jsx` | Read details about one ingredient. |
| `pages/SupportPage.jsx` | Help/support information page. |
| `pages/NotFound.jsx` | Friendly page for a URL that does not match any route. |

### Frontend pages: quiz and routine

| File | What it is for |
| --- | --- |
| `pages/quiz/SkinQuiz.jsx` | Asks skin type, concerns, budget, sensitivity, and preferences. |
| `pages/quiz/QuizResults.jsx` | Shows the quiz result and matching catalogue products. |
| `pages/routines/RoutineBuilder.jsx` | Helps the user create a step-by-step morning/evening routine from available products and preferences. |
| `pages/routines/RoutineList.jsx` | Lists routines saved by the signed-in user. |
| `pages/Cart.jsx` | Shows products the user intends to buy and lets them change quantities or remove items. |
| `pages/Checkout.jsx` | Collects delivery details and demonstrates creating an order; it does not charge a payment card. |

### Frontend pages: login and account

| File | What it is for |
| --- | --- |
| `pages/auth/Login.jsx` | Email/password login page. Google login is intentionally not shown. |
| `pages/auth/Signup.jsx` | Create an account with email/password. Google signup is intentionally not shown. |
| `pages/auth/ForgotPassword.jsx` | Requests a password-reset email. SMTP must be configured for a real email to arrive. |
| `pages/auth/ResetPassword.jsx` | Accepts the reset link/token and a new password. |
| `pages/auth/VerifyEmail.jsx` | Handles the email-verification link. |
| `pages/auth/OAuth2Redirect.jsx` | Backend return page for optional OAuth integration; the login/signup buttons are currently removed. |
| `pages/dashboard/DashboardOverview.jsx` | Signed-in user's account summary. |
| `pages/dashboard/Profile.jsx` | Edit personal/profile information and skin profile. |
| `pages/dashboard/SavedProducts.jsx` | View products the user added to their wishlist. |
| `pages/dashboard/Orders.jsx` | View the user's demonstration order history. |
| `pages/dashboard/OrderDetail.jsx` | View details for one order. |
| `pages/dashboard/Settings.jsx` | Account settings. |
| `pages/dashboard/QuizResultsHistory.jsx` | Past saved quiz results. |
| `pages/dashboard/MyReviews.jsx` | Reviews the signed-in user has written. |

### Frontend pages: admin area

| File | What it is for |
| --- | --- |
| `pages/admin/AdminOverview.jsx` | Admin summary dashboard. |
| `pages/admin/AdminProducts.jsx` | Admin product listing and management page. |
| `pages/admin/AdminCatalog.jsx` | Admin interface for brands and categories. |
| `pages/admin/AdminManagement.jsx` | Admin interface for ingredients, users, orders, and reviews. |
| `pages/admin/AdminInsights.jsx` | Admin quiz data and analytics. |

### Frontend services: talking to the backend

| File | What API work it groups |
| --- | --- |
| `services/api.js` | Creates the shared Axios connection, API base URL, token attachment, and common error behavior. |
| `services/authService.js` | Login, signup, reset-password, verification, and auth-related requests. |
| `services/adminService.js` | Admin requests for overview, catalogue management, users, orders, reviews, and analytics. |
| `services/assistantService.js` | Sends questions to the assistant endpoint. |
| `services/catalogService.js` | Loads brands, categories, articles, and ingredients. |
| `services/productService.js` | Searches for products and loads product details. |
| `services/quizService.js` | Submits quiz answers and loads recommendations/results. |
| `services/routineService.js` | Creates, reads, updates, and deletes routines. |
| `services/shoppingService.js` | Cart, checkout/order, review, and wishlist-related requests. |
| `services/userService.js` | Profile and skin-profile requests. |

## Important words you may be asked to explain

| Word | Simple explanation |
| --- | --- |
| React | JavaScript library used to build the visible website from reusable pieces. |
| Component | A reusable piece of the page, like a navigation bar or product card. |
| Route | A URL path, like `/shop` or `/login`, that opens a particular page. |
| REST API | A common way for the frontend and backend to exchange data using web requests. |
| HTTP | The basic request/response language used between browser and server. |
| JSON | A simple text format used to send structured data, such as `{ "skinType": "dry" }`. |
| Spring Boot | Java framework used to build and run the backend server. |
| MongoDB | Database that stores records as flexible documents. |
| Repository | Backend code that reads or writes database records. |
| Service | Backend code that applies the app's business rules. |
| Controller | Backend code that receives a URL request and calls a service. |
| DTO | A safe, structured request form or response object sent across the API. |
| Authentication | Checking who a person is, usually by confirming login details. |
| Authorization | Checking what an authenticated person is allowed to do. |
| JWT | A signed token that proves the user has logged in when calling protected API routes. |
| OAuth | A way to sign in using another provider, such as Google. This project does not currently show that option to users. |
| CORS | A browser security rule that says which website addresses may call the backend. |
| CRUD | Create, Read, Update, Delete: the four basic ways to manage stored records. |
| Seed data | Starter/demo records automatically inserted into the development database. |
| Responsive design | Layout changes to work on different screen sizes, including phones. |
| SEO | Search Engine Optimization: page titles, descriptions, and sitemap instructions that help search tools understand a website. |
| SMTP | A protocol/service used by the backend to send real email. It needs mail-provider settings. |
| Environment variable | A setting supplied outside source code, often used for private keys or service URLs. |
| Vite | Tool that runs the frontend during development and builds it for release. |
| Maven | Java build tool that downloads libraries, compiles the backend, and runs tests. |
| Lint | Automatic code-quality checks that point out likely mistakes or style issues. |

## Short presentation script

> “GlowGuide is a skincare education and product-discovery platform. The React frontend displays the pages and collects quiz answers. It sends those answers through a REST API to a Java Spring Boot backend. The backend validates the request, saves account and quiz data in MongoDB, and uses a configurable scoring service to rank products from its catalogue. It returns the matches and explanations to the frontend, where a user can explore products and build a routine. I separated the app into controllers, services, repositories, and models so each part has a clear job. Some integrations, such as real email delivery and Google sign-in, need provider credentials; checkout is currently a demonstration rather than a real payment service.”

## Common questions and simple answers

**Why use a backend if React can show the pages?**

The browser handles the display, but accounts, private information, recommendations, and database writes need server-side code. Keeping those rules on the server is safer and lets multiple pages use the same data.

**How does the recommendation feature work?**

The quiz records the person's skin type, concerns, sensitivity, budget, and preferences. The backend compares that profile with product details and gives points for matches. It ranks products and returns a reason for each suggestion. It is educational matching, not a diagnosis or promise that a product will treat a condition.

**Why are there so many folders?**

Each folder gives a kind of code one clear job. For example, controllers handle requests, services make decisions, repositories access MongoDB, and models describe saved records. That separation makes the project easier to understand and change.

**Does the app take real payments?**

No. Checkout demonstrates an order flow, but it does not process card details or charge money.

**Does Google login work?**

The backend has optional OAuth support, but the Google option is currently hidden on login/signup. It needs credentials in Google Cloud before it can be safely offered.

**Will the forgot-password email arrive?**

Only after valid SMTP/email settings are added to the backend environment. The code checks whether mail is configured and avoids claiming an email was sent when delivery cannot be attempted.

## Generated folders (not hand-written source files)

These folders can appear after installing or building the project. They contain downloaded dependencies or generated output, not the original source files to explain one by one:

- `frontend/node_modules/`: JavaScript libraries downloaded by `npm install`.
- `frontend/dist/`: optimized website files created by `npm run build`.
- `backend/target/`: Java class files and build output created by Maven.
- `backend/target/maven-home/`: a local Maven dependency cache used for this machine's backend checks.

The file-by-file sections above cover the project source and configuration files, not each file inside these generated folders or Git's internal object database.

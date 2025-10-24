<h1 align="center">E-Commerce Store 🛒</h1>

![Demo App](/frontend/public/screenshot-for-readme.png)

## Features

- 🚀 Full-Stack MERN Application
- 🗄️ MongoDB & Redis Integration
- 💳 Paystack Payment Integration (Naira Currency)
- 🔐 Robust Authentication System
- 🔑 JWT with Refresh/Access Tokens
- 📝 User Signup & Login
- 🛒 Complete E-Commerce Functionality
- 📦 Product & Category Management
- 🖼️ Multi-Image Product Upload (Cloudinary)
- 🛍️ Shopping Cart with Coupons
- 💰 Secure Checkout Flow
- 🏷️ Dynamic Coupon System
- 👑 Admin Dashboard
- 📊 Sales Analytics with Charts
- 🎨 Modern UI with Tailwind CSS
- ⚡ Framer Motion Animations
- 🚀 Redis Caching for Performance
- 🔒 Production-Ready Security

## Tech Stack

**Frontend:**

- React 18 with Vite
- Tailwind CSS
- Framer Motion
- Zustand (State Management)
- Recharts (Analytics)
- React Hot Toast
- Lucide React Icons

**Backend:**

- Node.js & Express
- MongoDB (Mongoose)
- Redis (Upstash)
- Cloudinary (Image Storage)
- Paystack API
- JWT Authentication

## Local Development Setup

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account
- Redis instance (Upstash recommended)
- Cloudinary account
- Paystack account (test keys)

### Environment Variables

Create a `backend/.env` file:

```bash
PORT=5000
MONGO_URI=your_mongo_uri

UPSTASH_REDIS_URL=your_redis_url

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

PAYSTACK_SECRET_KEY=sk_test_your_paystack_test_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd ecommerce
```

2. **Install dependencies**

```bash
npm install
cd frontend && npm install
cd ..
```

3. **Start development servers**

Frontend (in one terminal):

```bash
cd frontend
npm run dev
```

Backend (in another terminal):

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete AWS Amplify deployment instructions.

### Quick Deploy to AWS Amplify

1. **Build the application**

```bash
npm run build
```

2. **Start production server**

```bash
npm run start
```

3. **Configure environment variables** in AWS Amplify Console (see DEPLOYMENT.md)

## Project Structure

```
ecommerce/
├── backend/
│   ├── controllers/      # Request handlers
│   ├── lib/              # Utility libraries (DB, Redis, Cloudinary, Paystack)
│   ├── middleware/       # Auth middleware
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   └── server.js         # Express server
├── frontend/
│   ├── public/           # Static assets
│   └── src/
│       ├── components/   # Reusable React components
│       ├── lib/          # Axios configuration
│       ├── pages/        # Page components
│       └── stores/       # Zustand state management
├── amplify.yml           # AWS Amplify build config
└── DEPLOYMENT.md         # Deployment guide
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/profile` - Get user profile

### Products

- `GET /api/products` - Get all products (public)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/recommendations` - Get recommended products
- `POST /api/products` - Create product (admin)
- `PATCH /api/products/:id` - Toggle featured status (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart` - Remove item from cart
- `PUT /api/cart/:id` - Update item quantity

### Coupons

- `GET /api/coupons` - Get active coupon (admin)
- `POST /api/coupons/validate` - Validate coupon code

### Payments

- `POST /api/payments/create-checkout-session` - Initialize payment
- `POST /api/payments/checkout-success` - Verify payment

### Analytics (Admin)

- `GET /api/analytics` - Get sales analytics

## Features in Detail

### Multi-Image Product Support

- Admins can upload multiple images per product
- Swipeable image gallery on product detail pages
- Responsive image optimization via Cloudinary

### Shopping Cart

- Persistent cart (saved to user account)
- Real-time quantity updates
- Coupon application with percentage discounts
- Automatic total calculations

### Payment Integration

- Paystack checkout with Naira currency
- Order creation after successful payment
- Cart clearing post-checkout
- Payment verification

### Admin Dashboard

- Product CRUD operations
- Sales analytics with charts
- User management
- Coupon creation
- Featured products toggle

## Security Features

✅ No secrets in source code (environment variables only)  
✅ JWT-based authentication with httpOnly cookies  
✅ Access/Refresh token rotation  
✅ Password hashing with bcrypt  
✅ MongoDB injection protection  
✅ CORS configuration  
✅ Input validation  
✅ Production-ready .gitignore

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

ISC

---

**Ready for production deployment!** 🚀 See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.

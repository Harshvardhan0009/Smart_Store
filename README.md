# SmartStore AI 🏪✨

An AI-powered e-commerce admin dashboard where store owners can manage products, generate AI content, and view sales analytics.

## Features

- 🔐 **Authentication** — Secure signup/login with JWT tokens
- 📦 **Product Management** — Full CRUD operations for products
- 🤖 **AI Content Generation** — Auto-generate descriptions, SEO tags, captions & suggestions
- 📊 **Sales Dashboard** — Revenue charts, top products, category breakdown
- ⚠️ **Smart Alerts** — Low stock warnings and inventory insights
- 🎨 **Modern UI** — Dark theme with glassmorphism, animations & responsive design

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router, Chart.js, Axios |
| Backend | Node.js, Express, Mongoose, JWT, bcryptjs |
| Database | MongoDB |
| AI | OpenAI API (with mock fallback) |

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
npm install
# Edit .env with your MongoDB URI and OpenAI API key
npm run dev
```

### Seed Sample Data
```bash
cd backend
npm run seed
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables (backend/.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/smartstore
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_key  # optional, mock responses work without it
```

## Project Structure

```
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers
│   ├── middleware/       # JWT authentication
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── utils/           # AI helper functions
│   ├── seed.js          # Sample data seeder
│   └── server.js        # Express app entry
│
└── frontend/
    └── src/
        ├── components/  # Reusable UI components
        ├── pages/       # Page-level components
        ├── services/    # API & auth services
        └── index.css    # Design system
```

## API Endpoints

### Auth
- `POST /api/auth/signup` — Register new user
- `POST /api/auth/login` — Login & get JWT token

### Products
- `GET /api/products` — List all products
- `POST /api/products` — Create product
- `PUT /api/products/:id` — Update product
- `DELETE /api/products/:id` — Delete product

### AI Generation
- `POST /api/ai/description` — Generate product description
- `POST /api/ai/tags` — Generate SEO tags
- `POST /api/ai/caption` — Generate marketing caption
- `POST /api/ai/suggestions` — Get AI suggestions

### Analytics
- `GET /api/analytics/summary` — Dashboard summary stats
- `GET /api/analytics/revenue` — Revenue over time
- `GET /api/analytics/top-products` — Top selling products
- `GET /api/analytics/low-stock` — Low stock alerts

## Demo Flow
1. Sign up / Login
2. Add a product
3. Click AI Generate for description, tags & caption
4. View dashboard with revenue charts & top products
5. Check low stock alerts & AI suggestions

## License
MIT

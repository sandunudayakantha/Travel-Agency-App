# 🌍 Wanderlust - Premium Travel Agency App

A modern, full-stack travel agency application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Tailwind CSS. This Airbnb-style platform allows admins to manage travel packages while users can browse, book, and create custom travel experiences.

## ✨ Features

### 🎯 Core Features
- **Admin Panel**: Complete package management system
- **User Authentication**: Secure registration, login, and profile management
- **Package Browsing**: Advanced filtering and search capabilities
- **Custom Packages**: Users can request personalized travel experiences
- **Booking System**: Complete booking management with status tracking
- **Reviews & Ratings**: User feedback system for packages
- **Responsive Design**: Mobile-first approach with modern UI/UX

### 🎨 UI/UX Highlights
- **Modern Design**: Clean, intuitive interface with Tailwind CSS
- **Video Integration**: Support for package videos and promotional content
- **Image Galleries**: Rich media display for destinations
- **Smooth Animations**: Framer Motion animations for enhanced UX
- **Dark/Light Mode Ready**: Extensible theming system
- **Loading States**: Professional loading indicators and skeleton screens

### 🔧 Technical Features
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Admin and user role management
- **File Upload**: Image and video upload support
- **Search & Filtering**: Advanced search with multiple filters
- **Pagination**: Efficient data loading and display
- **Real-time Updates**: Live status updates and notifications
- **API Documentation**: Comprehensive REST API

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Travel-Agency-App
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Database Setup**
   - Ensure MongoDB is running
   - The app will automatically create collections on first run

### Environment Configuration

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/travel-agency

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Cloudinary Configuration (for image/video uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 📁 Project Structure

```
Travel-Agency-App/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication & validation
│   ├── server.js        # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   ├── hooks/       # Custom hooks
│   │   └── utils/       # Utility functions
│   ├── public/          # Static assets
│   └── package.json
└── README.md
```

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### Packages
- `GET /api/packages` - Get all packages (with filters)
- `GET /api/packages/featured` - Get featured packages
- `GET /api/packages/:id` - Get single package
- `POST /api/packages` - Create package (Admin)
- `PUT /api/packages/:id` - Update package (Admin)
- `DELETE /api/packages/:id` - Delete package (Admin)
- `POST /api/packages/:id/reviews` - Add review

### Bookings
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking status (Admin)
- `POST /api/bookings/:id/cancel` - Cancel booking
- `POST /api/bookings/:id/review` - Add booking review

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/analytics` - Detailed analytics
- `GET /api/admin/reports` - Generate reports

## 🎨 UI Components

### Core Components
- **Navbar**: Responsive navigation with user menu
- **Footer**: Site footer with links and information
- **Hero Section**: Eye-catching landing page header
- **Package Cards**: Attractive package display cards
- **Booking Form**: Comprehensive booking interface
- **Admin Dashboard**: Full-featured admin panel

### Interactive Elements
- **Image Galleries**: Swipeable image carousels
- **Video Players**: Embedded video content
- **Date Pickers**: Travel date selection
- **Rating System**: Star-based rating interface
- **Search Filters**: Advanced filtering options

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt password encryption
- **Input Validation**: Comprehensive form validation
- **CORS Protection**: Cross-origin request security
- **Rate Limiting**: API request throttling
- **Helmet Security**: HTTP header protection

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience
- **Tablet**: Optimized touch interface
- **Mobile**: Mobile-first design approach

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables
2. Configure MongoDB connection
3. Deploy to your preferred platform (Heroku, Vercel, etc.)

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy the dist folder to your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🎯 Roadmap

### Upcoming Features
- [ ] Payment gateway integration (Stripe)
- [ ] Email notifications
- [ ] Real-time chat support
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Social media integration
- [ ] Loyalty program

### Performance Improvements
- [ ] Image optimization
- [ ] Caching strategies
- [ ] Database indexing
- [ ] CDN integration
- [ ] Progressive Web App features

---

**Built with ❤️ using the MERN stack, Vite, and Tailwind CSS**
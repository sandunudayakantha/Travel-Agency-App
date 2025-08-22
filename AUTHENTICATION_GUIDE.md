# Authentication System Guide

## Overview

The Travel Agency App now features a robust authentication system that prevents users from having to relogin on page refresh. The system uses JWT tokens stored in localStorage for persistence and automatic token restoration.

## Key Features

### ✅ Persistent Authentication
- Users stay logged in across browser sessions
- Automatic token restoration on page refresh
- No need to relogin after page refresh

### ✅ Secure Token Management
- JWT tokens stored securely in localStorage
- Automatic token verification with server
- Proper token cleanup on logout

### ✅ Role-Based Access Control
- User and Admin roles supported
- Automatic role checking
- Protected routes for different user types

### ✅ Better User Experience
- Loading states during authentication checks
- Toast notifications for login/logout events
- Smooth transitions between authenticated states

## How It Works

### 1. Token Storage
- Tokens are stored in localStorage with key `travel_agency_token`
- User data is cached in localStorage with key `travel_agency_user`
- Automatic cleanup on logout or token expiration

### 2. Authentication Flow
1. **App Initialization**: Check for existing token in localStorage
2. **Token Verification**: Verify token with server endpoint `/api/auth/me`
3. **User Restoration**: Restore user session if token is valid
4. **Error Handling**: Clear invalid tokens and redirect to login if needed

### 3. Login Process
1. User submits credentials
2. Server validates and returns JWT token + user data
3. Token and user data stored in localStorage
4. User redirected to appropriate page (profile for users, admin dashboard for admins)

### 4. Logout Process
1. Call logout endpoint to invalidate server-side session
2. Clear localStorage tokens and user data
3. Remove Authorization header from axios
4. Redirect to home page

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `POST /api/auth/change-password` - Change password (protected)

### Admin Endpoints
- All admin endpoints require `role: 'admin'` in user object
- Admin routes are protected with `AdminRoute` component

## Components

### AuthContext
- Main authentication state management
- Provides login, logout, register functions
- Handles token persistence and restoration
- Manages loading and error states

### PrivateRoute
- Protects routes that require authentication
- Shows loading spinner during auth check
- Redirects to login if not authenticated

### AdminRoute
- Protects admin-only routes
- Checks for admin role in addition to authentication
- Redirects to admin login if not admin

### Navbar
- Shows user menu with profile and admin options
- Handles logout functionality
- Displays user information and role badges

## Usage Examples

### Login
```javascript
const { login } = useAuth();
const result = await login({ email, password });
if (result.success) {
  // User is now logged in
  navigate('/profile');
}
```

### Admin Login
```javascript
const { adminLogin } = useAuth();
const result = await adminLogin({ email, password });
if (result.success) {
  // Admin is now logged in
  navigate('/admin');
}
```

### Check Authentication
```javascript
const { isAuthenticated, user, isAdmin } = useAuth();

if (isAuthenticated) {
  console.log('User is logged in:', user.name);
  if (isAdmin()) {
    console.log('User is admin');
  }
}
```

### Logout
```javascript
const { logout } = useAuth();
await logout();
// User is now logged out and redirected
```

## Security Features

### Token Security
- JWT tokens with 30-day expiration
- Automatic token verification on each request
- Secure token storage in localStorage
- Proper token cleanup on logout

### Role Security
- Server-side role verification
- Client-side role checking for UI
- Protected admin routes
- Automatic redirect for unauthorized access

### Error Handling
- Graceful handling of expired tokens
- Clear error messages for users
- Automatic cleanup of invalid sessions
- Network error handling

## Troubleshooting

### Common Issues

1. **User gets logged out on refresh**
   - Check if token is properly stored in localStorage
   - Verify server is running and accessible
   - Check browser console for errors

2. **Admin can't access admin routes**
   - Verify user has `role: 'admin'` in database
   - Check if admin login was successful
   - Ensure AdminRoute component is used correctly

3. **Authentication errors**
   - Check server logs for detailed error messages
   - Verify JWT_SECRET is set in environment
   - Ensure database connection is working

### Debug Information
- Check browser localStorage for token presence
- Monitor network requests in browser dev tools
- Check server logs for authentication attempts
- Verify axios interceptors are working correctly

## Migration Notes

### From Previous Version
- Tokens now use `travel_agency_token` key instead of `token`
- User data is cached for better performance
- Improved error handling and user feedback
- Better loading states and UX

### Breaking Changes
- Token storage key changed from `token` to `travel_agency_token`
- Some component props may have changed
- Error handling is now more robust

## Future Enhancements

- [ ] Token refresh mechanism
- [ ] Remember me functionality
- [ ] Multi-factor authentication
- [ ] Session management dashboard
- [ ] Audit logging for admin actions 
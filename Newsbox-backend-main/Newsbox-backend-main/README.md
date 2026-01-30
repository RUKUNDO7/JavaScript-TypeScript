# HNB Family API

A Node.js/Express API for the Hope News Box Family Application with guest and member authentication, blog management, and profile features.

## Features

- **Dual Authentication**: Guest and Member login systems
- **Role-Based Access**: Different permissions for guests, members, and admins
- **Blog Management**: Create, read, and delete blog posts with media support
- **Profile Management**: User profiles with birthday tracking
- **Email Notifications**: Birthday alerts sent to family members
- **File Upload**: Support for images and videos
- **API Documentation**: Swagger UI integration

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DBURI=your_mongodb_connection_string

# JWT Secret
JWTSECRETKEY=your_jwt_secret_key

# Family Names (comma-separated)
FAMILYNAMES=MFURA,SIMON,JOHN

# Admin Names (comma-separated)
ADMINNAMES=MFURA,SIMON

# Email Configuration
EMAIL=your_email@gmail.com
EMAILPASS=your_app_password

# Server
PORT=3008
NODE_ENV=development
```

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with required variables
4. Start the server: `npm start`

## API Endpoints

- `POST /api/login` - User authentication (guest/member)
- `POST /api/profile` - Create user profile (members only)
- `GET /api/birthdays` - Get today's birthdays (members only)
- `POST /api/uploadBlog` - Create blog post (admin only)
- `DELETE /api/deleteBlog` - Delete blog post (admin only)
- `GET /api-docs` - API documentation

## Deployment on Render

1. Connect your GitHub repository to Render
2. Set the environment variables in Render dashboard
3. Deploy using the provided `render.yaml` configuration

## File Storage

**Important**: For production deployment, consider using cloud storage (AWS S3, Cloudinary) instead of local file storage, as Render's filesystem is ephemeral.

## License

ISC

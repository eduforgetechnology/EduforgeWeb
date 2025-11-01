# AWS S3 Setup for EduForge

## Prerequisites
1. AWS Account
2. AWS CLI installed
3. Node.js and npm

## Setup Steps

### 1. Create S3 Bucket
1. Go to AWS Console → S3
2. Click "Create bucket"
3. Choose a unique bucket name (e.g., "eduforge-content")
4. Select your preferred region
5. Uncheck "Block all public access" (since we need public read access)
6. Enable versioning
7. Create bucket

### 2. Configure CORS
Add this CORS configuration to your S3 bucket:
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["http://localhost:3000", "https://your-production-domain.com"],
        "ExposeHeaders": []
    }
]
```

### 3. Create IAM User
1. Go to AWS Console → IAM
2. Create new user
3. Add permissions:
   - AmazonS3FullAccess (or create custom policy with limited scope)
4. Save Access Key and Secret Key

### 4. Environment Variables
Add these to your `.env` file:
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your-selected-region
AWS_S3_BUCKET_NAME=your-bucket-name
```

### 5. Testing Setup
1. Install dependencies:
```bash
npm install aws-sdk multer
```

2. Test upload:
```bash
curl -X POST -H "Content-Type: multipart/form-data" \
  -F "video=@test.mp4" \
  http://localhost:5000/api/admin/courses/1/lessons
```

### Security Notes
1. Never commit AWS credentials to version control
2. Use environment variables for all sensitive data
3. Consider implementing file size limits
4. Implement proper file type validation

### Cost Management
1. Enable lifecycle rules to delete old versions
2. Monitor usage with AWS Cost Explorer
3. Set up billing alerts
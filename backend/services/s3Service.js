const AWS = require('aws-sdk');
const multer = require('multer');
const path = require('path');

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'video/mp4',
      'video/webm',
      'video/quicktime'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PPT, PDF, and video files are allowed.'));
    }
  }
});

const s3Service = {
  /**
   * Upload a file to S3
   * @param {Buffer} fileBuffer - The file buffer to upload
   * @param {String} fileName - Original file name
   * @param {String} mimeType - File MIME type
   * @returns {Promise} Object containing the file URL and key
   */
  async uploadFile(fileBuffer, fileName, mimeType) {
    const Key = `${Date.now()}-${path.basename(fileName)}`;
    
    const params = {
      Bucket: BUCKET_NAME,
      Key,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: 'public-read'
    };

    try {
      const result = await s3.upload(params).promise();
      return {
        url: result.Location,
        key: result.Key
      };
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw error;
    }
  },

  /**
   * Delete a file from S3
   * @param {String} key - The S3 key of the file to delete
   */
  async deleteFile(key) {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key
    };

    try {
      await s3.deleteObject(params).promise();
    } catch (error) {
      console.error('Error deleting from S3:', error);
      throw error;
    }
  },

  /**
   * Generate a presigned URL for a file
   * @param {String} key - The S3 key of the file
   * @param {Number} expirySeconds - URL expiry time in seconds (default 1 hour)
   * @returns {String} Presigned URL
   */
  getSignedUrl(key, expirySeconds = 3600) {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Expires: expirySeconds
    };

    return s3.getSignedUrl('getObject', params);
  },

  // Export multer middleware
  upload
};

module.exports = s3Service;
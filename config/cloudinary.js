const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'codetunisiepro',
        resource_type: 'auto', // auto-detect image/video
        allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mov', 'avi', 'webm'], // added video formats
    },
});

module.exports = { cloudinary, storage };

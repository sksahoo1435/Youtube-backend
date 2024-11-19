const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_KEY_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let folder;
        let resource_type;

        if (file.mimetype.startsWith('video/')) {
            folder = 'videos';
            resource_type = 'video';
        } else if (file.mimetype.startsWith('image/')) {
            folder = 'images';
            resource_type = 'image';
        } else {
            throw new Error('Unsupported File Type.');
        }

        return {
            folder: folder,
            resource_type: resource_type,
            quality: 'auto:low',
        };
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 9 * 1024 * 1024,
    },
});

const deleteFromCloudinary = async (publicId, resourceType = 'video') => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });

        if (result.result === 'not found') {
            console.error(
                `Resource with publicId ${publicId} and resource_type ${resourceType} was not found in Cloudinary.`
            );
        } else {
            console.log('Cloudinary deletion result:', publicId, result);
        }

        return result;
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw new Error('Failed to delete from Cloudinary');
    }
};

const generateDownloadUrl = (publicId, resourceType) => {
    return cloudinary.url(publicId, {
        resource_type: resourceType,
        flags: 'attachment',
    });
};

const uploadFields = upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'avatar', maxCount: 1 },
    { name: 'channelBanner', maxCount: 1 },
]);

module.exports = { uploadFields, deleteFromCloudinary, generateDownloadUrl };

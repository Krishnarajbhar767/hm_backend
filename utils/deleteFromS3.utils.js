const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Delete an image from AWS S3
 * @param {string} key - S3 object key (e.g., "uploads/products/product_123/image.jpg")
 */

const deleteFromS3 = async (key) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  };

  const command = new DeleteObjectCommand(params);
  await s3.send(command);
};

module.exports = deleteFromS3;

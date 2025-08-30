

const uploadImage = (req, res) => {
  const productName = req.body.name || 'unknown';
  const safeName = productName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');


  const fileUrls = req.files.map(file => ({
    filename: file.filename,
    path: `/uploads/products/${safeName}/${file.filename}`  // product images url 
  }));


  res.json({
    message: `Uploaded ${fileUrls.length} image(s) for "${productName}"`,
    images: fileUrls
  });
};

module.exports = { uploadImage };

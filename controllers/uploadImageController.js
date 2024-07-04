import cloudinary from 'cloudinary';
import fs from 'fs';
// import path from 'path';

cloudinary.config({
  cloud_name: 'dv87xhc8j',
  api_key: '453134897785465',
  api_secret: 'Pqhj8xngYUwE8HYQuuc5v2QMnEQ',
});

const uploadImages = async (req, res) => {
  try {
    const { path } = req.body;
    let files = Object.values(req.files).flat();
    let images = [];
    if (files.length > 0) {
      for (const file of files) {
        const url = await uploadToCloudinary(file, path);
        images.push(url);
        removeTmp(file.tempFilePath);
      }
      res.status(200).json(images);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadToCloudinary = async (file, path) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { folder: path },
      (err, res) => {
        if (err) {
          removeTmp(file.tempFilePath);
          console.log(err);
          return res.send('Upload image failed');
        }
        resolve({
          url: res.secure_url,
        });
      }
    );
  });
};

export { uploadImages };

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

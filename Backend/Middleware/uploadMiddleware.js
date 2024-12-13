import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Upload Middleware Loaded');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    console.log('Setting destination for file upload...');
    const uploadPath = path.join(__dirname, '..', 'uploads');
    console.log(`Saving file to: ${uploadPath}`);
    
    cb(null, uploadPath); 
  },
  filename: (req, file, cb) => {
    
    console.log('Generating filename for uploaded file...');
    const fileExtension = path.extname(file.originalname);
    const filename = `${Date.now()}${fileExtension}`; 
    console.log(`Generated filename: ${filename}`);
    
    cb(null, filename); 
  },
});

const fileFilter = (req, file, cb) => {
  console.log('Checking file type...');
  const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
  
  if (allowedMimes.includes(file.mimetype)) {
    console.log('File type is valid');
    cb(null, true); 
  } else {
    console.error('Invalid file type');
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, 
});

export default upload;

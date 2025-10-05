import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    // Validação por tipo de campo
    if (file.fieldname === 'poster' || file.fieldname === 'background') {
      // Aceita apenas imagens para poster e background
      const allowedImageMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (allowedImageMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`${file.fieldname} deve ser uma imagem (jpeg, jpg, png, webp)`));
      }
    } else if (file.fieldname === 'trailer') {
      // Aceita vídeos para trailer
      const allowedVideoMimes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
      if (allowedVideoMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Trailer deve ser um vídeo (mp4, mpeg, mov, avi)'));
      }
    } else {
      cb(new Error('Campo de arquivo inválido'));
    }
  },
});

const uploadFields = upload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'background', maxCount: 1 },
  { name: 'trailer', maxCount: 1 },
]);

export { uploadFields };
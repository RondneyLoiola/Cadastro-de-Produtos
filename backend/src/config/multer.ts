import multer from 'multer';
import { resolve } from 'path'

export const upload = multer({
    storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'uploads', 'productsImg'),
        filename: (_req, file, cb) => {
            const uniqueName = `${Date.now()}-${file.originalname}`
            return cb(null, uniqueName)
        }
    })
})
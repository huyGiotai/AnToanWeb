import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

// === Các API cho React Native App (để tương thích) ===
// [POST] /api/v1/auth/register (Mặc định dùng bcrypt)
router.post('/auth/register', AuthController.register);

// [POST] /api/v1/auth/login
router.post('/auth/login', AuthController.login);

// [POST] /api/v1/auth/verify-code
router.post('/auth/verify-code', AuthController.verifyCode);

// [POST] /api/v1/auth/verify-email (Gửi lại mã)
router.post('/auth/verify-email', AuthController.resendCode);

// [GET] /api/v1/auth/account (Cần xác thực)
router.get('/auth/account', AuthMiddleware.verifyToken, AuthController.getAccount);


// === Các API mới cho Đề cương Demo ===
// [POST] /api/v1/auth/register-vulnerable (Demo MD5)
router.post('/auth/register-vulnerable', AuthController.registerVulnerable);

// [POST] /api/v1/auth/register-secure (Demo Bcrypt)
router.post('/auth/register-secure', AuthController.registerSecure);

// [POST] /api/v1/auth/demo-crack (Demo brute-force/dictionary)
router.post('/auth/demo-crack', AuthController.demoCrack);


export default router;
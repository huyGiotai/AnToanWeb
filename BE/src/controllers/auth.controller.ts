import { Request, Response } from 'express';
import User, { HashMethod, IUser } from '../models/user.model';
import { HashService } from '../services/hash.service';
import jwt from 'jsonwebtoken';
import { MailService } from '../services/mail.service';

// Hàm tiện ích: Tạo mã xác thực 6 chữ số
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hàm tiện ích: Tạo JWT
const generateJWT = (userId: string, email: string): string => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" } // Token hết hạn sau 24h
  );
};

// Hàm tiện ích: Gửi mã xác thực
const sendCode = async (user: IUser) => {
  const code = generateVerificationCode();
  user.verificationCode = code;
  user.verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // Hết hạn sau 10 phút
  await user.save({ validateBeforeSave: false }); // Bỏ qua validate (vì password đã có)

  // Gọi MailService (giờ đây sẽ gửi mail thật)
  await MailService.sendVerificationCode(user.email, code);
};

// Controller
export const AuthController = {

  /**
   * API Đăng ký (Tương thích FE gốc) [POST /api/v1/auth/register]
   * Mặc định sử dụng BCRYPT
   */
  register: async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ statusCode: 400, message: "Email, password, và tên là bắt buộc" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        // Nếu user tồn tại nhưng chưa xác thực, cho phép gửi lại code
        if (!existingUser.isVerified) {
          await sendCode(existingUser);
          return res.status(201).json({
            message: "Email đã tồn tại nhưng chưa xác thực. Mã mới đã được gửi.",
            data: { _id: existingUser._id }
          });
        }
        return res.status(409).json({ statusCode: 409, message: "Email đã tồn tại" });
      }

      // Mặc định FE gốc dùng 'bcrypt'
      const hashMethod: HashMethod = 'bcrypt';
      const hashedPassword = await HashService.hash(password, hashMethod);

      const newUser = new User({
        email,
        name,
        password: hashedPassword,
        hashMethod: hashMethod,
        isVerified: false,
      });

      await sendCode(newUser);

      // Response khớp với FE
      res.status(201).json({
        statusCode: 201,
        message: "Đăng ký thành công. Vui lòng kiểm tra email để lấy mã xác thực.",
        data: { _id: newUser._id }
      });

    } catch (error) {
      console.error("Register Error:", error);
      res.status(500).json({ statusCode: 500, message: (error as Error).message });
    }
  },

  /**
   * API Đăng nhập (Tương thích FE gốc) [POST /api/v1/auth/login]
   */
  login: async (req: Request, res: Response) => {
    try {
      const { username: email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ statusCode: 400, message: "Email và mật khẩu là bắt buộc" });
      }

      // Lấy user VÀ password (vì ta đã select: false trong model)
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(404).json({ statusCode: 404, message: "Người dùng không tồn tại" });
      }

      // Kiểm tra xem tài khoản đã active chưa (khớp với logic FE)
      if (!user.isVerified) {
        return res.status(400).json({
          statusCode: 400, // FE bắt status 400 để chuyển sang trang verify
          message: "Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email."
        });
      }

      // Tự động so sánh password dựa trên method đã lưu
      const isMatch = await HashService.compare(password, user.password!, user.hashMethod);

      if (!isMatch) {
        return res.status(400).json({ statusCode: 400, message: "Mật khẩu không chính xác" });
      }

      const token = generateJWT(user._id, user.email);

      // Trả về user data (không có password)
      const userResponse = user.toObject();
      delete userResponse.password;

      // Trả về response khớp với FE
      res.status(200).json({
        statusCode: 200,
        message: "Đăng nhập thành công",
        data: {
          access_token: token,
          user: userResponse
        }
      });

    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ statusCode: 500, message: (error as Error).message });
    }
  },

  /**
   * API Xác thực mã (Tương thích FE gốc) [POST /api/v1/auth/verify-code]
   */
  verifyCode: async (req: Request, res: Response) => {
    try {
      const { email, code } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ statusCode: 404, message: "Người dùng không tồn tại" });
      }

      if (user.isVerified) {
        return res.status(400).json({ statusCode: 400, message: "Tài khoản đã được xác thực" });
      }

      if (user.verificationCode !== code) {
        return res.status(400).json({ statusCode: 400, message: "Mã xác thực không hợp lệ" });
      }

      if (user.verificationExpires && user.verificationExpires < new Date()) {
        return res.status(400).json({ statusCode: 400, message: "Mã xác thực đã hết hạn" });
      }

      user.isVerified = true;
      user.verificationCode = undefined;
      user.verificationExpires = undefined;
      await user.save();

      // FE check res.data
      res.status(200).json({
        statusCode: 200,
        message: "Kích hoạt tài khoản thành công",
        data: true
      });

    } catch (error) {
      console.error("Verify Error:", error);
      res.status(500).json({ statusCode: 500, message: (error as Error).message });
    }
  },

  /**
   * API Gửi lại mã (Tương thích FE gốc) [POST /api/v1/auth/verify-email]
   */
  resendCode: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ statusCode: 404, message: "Người dùng không tồn tại" });
      }

      if (user.isVerified) {
        return res.status(400).json({ statusCode: 400, message: "Tài khoản đã được xác thực" });
      }

      await sendCode(user);

      // FE check res.data
      res.status(200).json({
        statusCode: 200,
        message: "Đã gửi lại mã xác thực. Vui lòng kiểm tra email.",
        data: true
      });

    } catch (error) {
      console.error("Resend Code Error:", error);
      res.status(500).json({ statusCode: 500, message: (error as Error).message });
    }
  },

  /**
   * API Lấy thông tin tài khoản (Tương thích FE gốc) [GET /api/v1/auth/account]
   */
  getAccount: async (req: Request, res: Response) => {
    // req.user được gán từ AuthMiddleware.verifyToken
    // (trong middleware đã KHÔNG lấy password)
    res.status(200).json({
      statusCode: 200,
      message: "Lấy thông tin tài khoản thành công",
      data: {
        user: req.user
      }
    });
  },

  // --- API DÀNH RIÊNG CHO DEMO (THEO ĐỀ CƯƠNG) ---

  /**
   * API Demo Đăng ký Vulnerable [POST /api/v1/auth/register-vulnerable]
   * (Dùng MD5)
   */
  registerVulnerable: async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;
      const hashMethod: HashMethod = 'md5'; // Chỉ định MD5

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "Email đã tồn tại" });
      }

      const startTime = process.hrtime.bigint();
      const hashedPassword = await HashService.hash(password, hashMethod);
      const endTime = process.hrtime.bigint();
      const hashTime = Number(endTime - startTime) / 1_000_000; // milliseconds

      const newUser = new User({
        email,
        name,
        password: hashedPassword,
        hashMethod: hashMethod,
        isVerified: true, // Demo, cho active luôn
      });

      await newUser.save();

      res.status(201).json({
        message: `Đăng ký (MD5) thành công. Thời gian hash: ${hashTime.toFixed(4)} ms`,
        data: { _id: newUser._id }
      });

    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },

  /**
   * API Demo Đăng ký Secure [POST /api/v1/auth/register-secure]
   * (Dùng Bcrypt)
   */
  registerSecure: async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;
      const hashMethod: HashMethod = 'bcrypt'; // Chỉ định Bcrypt

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "Email đã tồn tại" });
      }

      const startTime = process.hrtime.bigint();
      const hashedPassword = await HashService.hash(password, hashMethod);
      const endTime = process.hrtime.bigint();
      const hashTime = Number(endTime - startTime) / 1_000_000; // milliseconds

      const newUser = new User({
        email,
        name,
        password: hashedPassword,
        hashMethod: hashMethod,
        isVerified: true, // Demo, cho active luôn
      });

      await newUser.save();

      res.status(201).json({
        message: `Đăng ký (Bcrypt) thành công. Thời gian hash: ${hashTime.toFixed(4)} ms`,
        data: { _id: newUser._id }
      });

    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },

  /**
   * API Demo Crack [POST /api/v1/auth/demo-crack]
   * (Mô phỏng Dictionary Attack)
   */
  demoCrack: async (req: Request, res: Response) => {
    try {
      const { email, passwordGuess } = req.body; // passwordGuess là mật khẩu thử crack

      // Phải lấy +password vì nó bị ẩn mặc định
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(404).json({ message: "User không tồn tại" });
      }

      if (user.hashMethod === 'bcrypt' || user.hashMethod === 'argon2') {
        return res.status(400).json({
          message: "Đây là hash an toàn (bcrypt/argon2). Không thể crack nhanh.",
          note: "Điều này minh họa rằng hash an toàn có khả năng chống lại tấn công brute-force/dictionary."
        });
      }

      // Mô phỏng crack MD5/SHA1
      const startTime = process.hrtime.bigint();
      // So sánh trực tiếp
      const isMatch = HashService.compare(passwordGuess, user.password!, user.hashMethod);
      const endTime = process.hrtime.bigint();
      // Thời gian "crack" (chính là thời gian hash và so sánh)
      const crackTime = Number(endTime - startTime) / 1_000_000;

      if (await isMatch) {
        return res.status(200).json({
          success: true,
          message: `Mật khẩu ĐÃ BỊ CRACK! Phương thức: ${user.hashMethod}. Thời gian: ${crackTime.toFixed(4)} ms.`,
          password: passwordGuess
        });
      } else {
        return res.status(200).json({
          success: false,
          message: `Thử với '${passwordGuess}' thất bại. Thời gian: ${crackTime.toFixed(4)} ms.`
        });
      }

    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
};
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';

// Mở rộng interface Request của Express để chứa thông tin user
// Điều này cho phép chúng ta gán req.user trong middleware
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const AuthMiddleware = {
  /**
   * Middleware xác thực JWT
   * Lấy token từ header 'Authorization: Bearer <token>'
   */
  verifyToken: async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Tách lấy token

    if (!token) {
      return res.status(401).json({ 
        statusCode: 401,
        message: "Không tìm thấy token. Yêu cầu xác thực." 
      });
    }

    try {
      // Xác thực token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      
      // Tìm user trong DB (không lấy mật khẩu)
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(404).json({ 
          statusCode: 404,
          message: "Người dùng không tồn tại." 
        });
      }

      // Gán user vào request để các controller sau có thể sử dụng
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ 
        statusCode: 401,
        message: "Token không hợp lệ hoặc đã hết hạn." 
      });
    }
  }
};
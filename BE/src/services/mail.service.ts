import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Nạp biến môi trường từ file .env
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "465"),
  secure: process.env.EMAIL_SECURE === 'true', // true cho port 465, false cho các port khác
  auth: {
    user: process.env.EMAIL_USER, // Email của bạn (từ file .env)
    pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng của bạn (từ file .env)
  },
  tls: {
    rejectUnauthorized: false // Bỏ qua lỗi chứng chỉ (nếu cần)
  }
});

/**
 * Dịch vụ gửi email xác thực
 */
export const MailService = {
  sendVerificationCode: async (email: string, code: string): Promise<void> => {

    // Nội dung email HTML
    const mailOptions = {
      from: `"Dubai Food" <${process.env.EMAIL_USER}>`, // Tên và email người gửi
      to: email, // Email người nhận
      subject: 'Mã xác thực tài khoản Dubai Food', // Tiêu đề
      html: `
        <div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 16px; color: #333;">
          <h2 style="color: #f4511e;">Chào mừng bạn đến với Dubai Food!</h2>
          <p>Cảm ơn bạn đã đăng ký. Vui lòng sử dụng mã xác thực bên dưới để kích hoạt tài khoản của bạn:</p>
          <p style="background-color: #f0f0f0; border-radius: 5px; padding: 12px 20px; font-size: 28px; font-weight: bold; letter-spacing: 3px; color: #f4511e; text-align: center;">
            ${code}
          </p>
          <p>Mã này sẽ hết hạn sau <strong>10 phút</strong>.</p>
          <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
          <hr/>
          <p style="font-size: 12px; color: #888;">Trân trọng,<br/>Đội ngũ Dubai Food</p>
        </div>
      `,
    };

    // Gửi mail
    try {
      console.log(`>>> Đang chuẩn bị gửi mail đến ${email}...`);
      await transporter.sendMail(mailOptions);
      console.log(`>>> Gửi mail thành công đến ${email} (Code: ${code})`);
    } catch (error) {
      console.error(`>>> Lỗi khi gửi mail đến ${email}:`, error);
      // Ném lỗi này để controller có thể bắt và thông báo cho người dùng
      throw new Error("Không thể gửi email xác thực. Vui lòng thử lại.");
    }
  }
};
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import apiRouter from './routes/api';

// Nạp biến môi trường
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors()); // Cho phép cross-origin
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Kết nối MongoDB
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("Lỗi: Biến môi trường MONGO_URI chưa được thiết lập.");
  process.exit(1); // Thoát ứng dụng
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('>>> Kết nối MongoDB thành công.'))
  .catch(err => {
    console.error('>>> Lỗi kết nối MongoDB:', err);
    process.exit(1);
  });

// Routes API
app.use('/api/v1', apiRouter);

// Trang chủ
app.get('/', (req, res) => {
  res.send('Chào mừng đến với Backend API An Toàn Web!');
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`>>> Backend server đang chạy tại http://localhost:${PORT}`);
});
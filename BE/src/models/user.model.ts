import mongoose, { Document, Schema } from 'mongoose';

// Định nghĩa các phương thức hash
export type HashMethod = 'md5' | 'sha1' | 'bcrypt' | 'argon2';

// Interface cho User Document
export interface IUser extends Document {
  email: string;
  password?: string; // Thêm '?' vì ta sẽ ẩn nó đi khi trả về
  name: string;
  isVerified: boolean;
  verificationCode?: string;
  verificationExpires?: Date;
  hashMethod: HashMethod; // Lưu lại phương thức đã hash
}

// Schema của Mongoose
const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true, select: false }, // Mặc định không chọn password
  name: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  verificationExpires: { type: Date },
  hashMethod: { type: String, required: true, enum: ['md5', 'sha1', 'bcrypt', 'argon2'] }
}, { timestamps: true }); // Tự động thêm createdAt và updatedAt

export default mongoose.model<IUser>('User', UserSchema);
import * as crypto from 'crypto-js';
import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';
import { HashMethod } from '../models/user.model';

const BCRYPT_SALT_ROUNDS = 10; // Cấu hình cost parameter cho bcrypt

/**
 * Hash password với phương pháp yếu (MD5, SHA1).
 * Không dùng salt (theo mô phỏng của đề cương).
 */
const hashVulnerable = (password: string, method: 'md5' | 'sha1'): string => {
  if (method === 'md5') {
    return crypto.MD5(password).toString();
  }
  // Mặc định là SHA1
  return crypto.SHA1(password).toString();
};

/**
 * Hash password với phương pháp mạnh (bcrypt, argon2).
 * Các thư viện này đã tự động tạo và nhúng salt vào chuỗi hash.
 */
const hashSecure = async (password: string, method: 'bcrypt' | 'argon2'): Promise<string> => {
  if (method === 'bcrypt') {
    return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  }
  // Mặc định là argon2
  return argon2.hash(password);
};

/**
 * So sánh password (vulnerable).
 */
const compareVulnerable = (plain: string, hash: string, method: 'md5' | 'sha1'): boolean => {
  const hashedPlain = hashVulnerable(plain, method);
  // So sánh chuỗi hash
  return hash === hashedPlain;
};

/**
 * So sánh password (secure).
 */
const compareSecure = async (plain: string, hash: string, method: 'bcrypt' | 'argon2'): Promise<boolean> => {
  if (method === 'bcrypt') {
    return bcrypt.compare(plain, hash);
  }
  // Mặc định là argon2
  return argon2.verify(hash, plain);
};

// Xuất ra HashService
export const HashService = {
  /**
   * Băm mật khẩu dựa trên phương thức được chọn.
   */
  hash: async (password: string, method: HashMethod): Promise<string> => {
    if (method === 'md5' || method === 'sha1') {
      return hashVulnerable(password, method);
    }
    return hashSecure(password, method);
  },
  
  /**
   * So sánh mật khẩu (plain text) với chuỗi đã băm (hash)
   * dựa trên phương thức đã lưu.
   */
  compare: async (plain: string, hash: string, method: HashMethod): Promise<boolean> => {
    if (method === 'md5' || method === 'sha1') {
      return compareVulnerable(plain, hash, method);
    }
    return compareSecure(plain, hash, method);
  }
};
import { z } from "zod";

const phoneRegex = /^0\d{9,10}$/;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILES = 5;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

export const infoStepSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập họ tên").max(200, "Họ tên quá dài"),
  phone: z.string().regex(phoneRegex, "Số điện thoại không hợp lệ (VD: 0901234567)"),
  email: z.union([z.literal(""), z.string().email("Email không hợp lệ")]).optional(),
});

export const scheduleStepSchema = z.object({
  date: z.string().min(1, "Vui lòng chọn ngày").refine((val) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(val) >= today;
  }, "Không thể chọn ngày trong quá khứ"),
  time: z.string().min(1, "Vui lòng chọn giờ"),
  branch: z.string().min(1, "Vui lòng chọn chi nhánh"),
});

export function validateFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return `"${file.name}" không phải ảnh hợp lệ`;
  }
  if (file.size > MAX_FILE_SIZE) {
    return `"${file.name}" vượt quá 5MB`;
  }
  return null;
}

export type InfoErrors = Partial<Record<"name" | "phone" | "email", string>>;
export type ScheduleErrors = Partial<Record<"date" | "time" | "branch", string>>;

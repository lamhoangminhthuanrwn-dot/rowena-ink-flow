import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseFileUploadOptions {
  maxFiles: number;
  validateFn?: (file: File) => string | null;
}

export function useFileUpload({ maxFiles, validateFn }: UseFileUploadOptions) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const addFiles = useCallback(
    (fileList: FileList | File[]) => {
      const incoming = Array.from(fileList);
      const remaining = maxFiles - files.length;
      if (remaining <= 0) {
        toast.error(`Tối đa ${maxFiles} ảnh`);
        return;
      }
      const toAdd = incoming.slice(0, remaining);
      const validFiles: File[] = [];
      for (const file of toAdd) {
        if (validateFn) {
          const err = validateFn(file);
          if (err) {
            toast.error(err);
            continue;
          }
        }
        validFiles.push(file);
      }
      if (incoming.length > remaining) {
        toast.warning(`Chỉ thêm được ${remaining} ảnh nữa`);
      }
      if (validFiles.length === 0) return;

      setFiles((prev) => [...prev, ...validFiles]);
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () =>
          setPreviews((prev) => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      });
    },
    [files.length, maxFiles, validateFn]
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const uploadAll = useCallback(
    async (
      bucket: string,
      pathGenerator: (file: File, index: number) => string
    ): Promise<string[]> => {
      setUploading(true);
      const uploadedPaths: string[] = [];
      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const path = pathGenerator(file, i);
          const { error } = await supabase.storage
            .from(bucket)
            .upload(path, file, { upsert: true });
          if (error) {
            console.error("Upload error:", error);
          } else {
            uploadedPaths.push(path);
          }
        }
      } finally {
        setUploading(false);
      }
      return uploadedPaths;
    },
    [files]
  );

  const reset = useCallback(() => {
    setFiles([]);
    setPreviews([]);
  }, []);

  return {
    files,
    previews,
    uploading,
    addFiles,
    removeFile,
    uploadAll,
    reset,
    canAddMore: files.length < maxFiles,
  };
}

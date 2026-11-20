
export type UploadPurpose = "signup" | "profile" | "service";

interface UploadResponse {
  success?: boolean;
  url?: string;
  message?: string;
}

export async function uploadImage(
  file: File,
  purpose: UploadPurpose
): Promise<string> {
  const formData = new FormData();

  formData.append("image", file);
  formData.append("purpose", purpose);

  const response = await fetch("/api/upload-image", {
    method: "POST",
    body: formData,
    credentials: "same-origin",
  });

  const result = (await response.json().catch(() => null)) as
    | UploadResponse
    | null;

  if (!response.ok || typeof result?.url !== "string") {
    throw new Error(
      result?.message || "Image upload failed."
    );
  }

  return result.url;
}

export async function uploadServiceImage(
  file: File
): Promise<string> {
  return uploadImage(file, "service");
}

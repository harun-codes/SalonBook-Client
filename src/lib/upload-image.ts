
export async function uploadServiceImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/upload-image", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || !data.url) {
    throw new Error(data.message || "Image upload failed");
  }

  return data.url;
}

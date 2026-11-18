import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.IMAGEBB_API;

    if (!apiKey) {
      return NextResponse.json(
        { message: "IMAGEBB_API is not configured." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { message: "No image file was provided." },
        { status: 400 }
      );
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Please upload a valid image file." },
        { status: 400 }
      );
    }

    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Image size must be less than 5MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await image.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    const uploadData = new FormData();
    uploadData.append("key", apiKey);
    uploadData.append("image", base64Image);

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: uploadData,
    });

    const data = await response.json();

    if (!response.ok || !data.success || !data.data?.url) {
      return NextResponse.json(
        {
          message: data.error?.message || "Image upload failed.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: data.data.url,
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to upload image." },
      { status: 500 }
    );
  }
}
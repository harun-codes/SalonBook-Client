
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";


type UploadPurpose = "signup" | "profile" | "service";

function isValidImage(buffer: Buffer, mimeType: string): boolean {
  if (mimeType === "image/jpeg") {
    return (
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff
    );
  }

  if (mimeType === "image/png") {
    return (
      buffer.length >= 8 &&
      buffer.subarray(0, 8).equals(
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
      )
    );
  }

  if (mimeType === "image/webp") {
    return (
      buffer.length >= 12 &&
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP"
    );
  }

  return false;
}

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

    const purpose = formData.get("purpose");
    const image = formData.get("image");

    if (
      purpose !== "signup" &&
      purpose !== "profile" &&
      purpose !== "service"
    ) {
      return NextResponse.json(
        { message: "Invalid image upload purpose." },
        { status: 400 }
      );
    }

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (purpose !== "signup") {
      if (!session) {
        return NextResponse.json(
          { message: "Authentication required. Please sign in." },
          { status: 401 }
        );
      }

      if (session.user.isBlocked === true) {
        return NextResponse.json(
          { message: "Your account has been blocked." },
          { status: 403 }
        );
      }

      if (
        purpose === "service" &&
        session.user.role?.toLowerCase() !== "admin"
      ) {
        return NextResponse.json(
          { message: "Only administrators can upload service images." },
          { status: 403 }
        );
      }
    }

    if (!(image instanceof File)) {
      return NextResponse.json(
        { message: "No image file was provided." },
        { status: 400 }
      );
    }

    if (image.size === 0 || image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Image size must be greater than 0 and less than 5MB." },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json(
        { message: "Only JPG, PNG and WEBP images are allowed." },
        { status: 400 }
      );
    }

    const arrayBuffer = await image.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    if (!isValidImage(imageBuffer, image.type)) {
      return NextResponse.json(
        { message: "Invalid image file." },
        { status: 400 }
      );
    }

    const uploadData = new FormData();

    uploadData.append("key", apiKey);
    uploadData.append("image", imageBuffer.toString("base64"));

    const response = await fetch(
      "https://api.imgbb.com/1/upload",
      {
        method: "POST",
        body: uploadData,
        signal: AbortSignal.timeout(20000),
      }
    );

    const result = await response.json().catch(() => null);

    if (
      !response.ok ||
      !result?.success ||
      typeof result?.data?.url !== "string"
    ) {
      return NextResponse.json(
        {
          message:
            result?.error?.message || "Image upload failed.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.data.url,
    });
  } catch (error) {
    console.error("Image upload error:", error);

    return NextResponse.json(
      { message: "Failed to upload image. Please try again." },
      { status: 500 }
    );
  }
}

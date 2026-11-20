
"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function GlobalError({
  error,
  reset,
}: GlobalErrorProps) {

  useEffect(() => {
    console.error("SalonBook Root Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#F8FAF9",
          color: "#172B24",
        }}
      >
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "480px",
              padding: "40px 28px",
              textAlign: "center",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2E8E4",
              borderRadius: "24px",
              boxShadow: "0 10px 35px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                width: "76px",
                height: "76px",
                margin: "0 auto 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "22px",
                backgroundColor: "#FEECEC",
                color: "#DC2626",
                fontSize: "38px",
                fontWeight: "bold",
              }}
            >
              !
            </div>

            <h1
              style={{
                margin: "0 0 14px",
                fontSize: "28px",
                fontWeight: 700,
              }}
            >
              Application Error
            </h1>

            <p
              style={{
                margin: 0,
                color: "#64748B",
                fontSize: "15px",
                lineHeight: 1.8,
              }}
            >
              Something unexpected happened while starting
              SalonBook. Please try reloading the application.
            </p>

            {error.digest && (
              <p
                style={{
                  marginTop: "16px",
                  color: "#64748B",
                  fontSize: "12px",
                }}
              >
                Error Reference: {error.digest}
              </p>
            )}

            <button
              type="button"
              onClick={reset}
              style={{
                width: "100%",
                marginTop: "28px",
                padding: "15px 20px",
                border: "none",
                borderRadius: "12px",
                backgroundColor: "#075E46",
                color: "#FFFFFF",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Reload SalonBook
            </button>

            <p
              style={{
                marginTop: "28px",
                marginBottom: 0,
                color: "#075E46",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              SalonBook | Beauty & Wellness
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}

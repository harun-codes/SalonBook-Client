
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Copy, Check, KeyRound } from "lucide-react";

export default function TestJWTPage() {
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTestJWT = async () => {
    try {
      setLoading(true);
      setMessage("");
      setToken("");
      setCopied(false);

      const { data, error } = await authClient.token();

      if (error) {
        setMessage("JWT Error: " + error.message);
        return;
      }

      if (data?.token) {
        setToken(data.token);
        setMessage("JWT Token generated successfully!");
      } else {
        setMessage("JWT Token not found.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
    } catch {
      setMessage("Unable to copy token. Please copy it manually.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary">
          <KeyRound className="h-7 w-7" />
        </div>

        <h1 className="mt-5 text-center text-2xl font-bold text-foreground">
          Better Auth JWT Test
        </h1>

        <p className="mt-3 text-center text-sm leading-6 text-muted-foreground">
          Generate your authentication token to test the SalonBook backend APIs.
        </p>

        <button
          onClick={handleTestJWT}
          disabled={loading}
          className="mt-7 w-full rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Generating Token..." : "Generate JWT Token"}
        </button>

        {message && (
          <div
            role="status"
            className={`mt-5 rounded-lg p-3 text-center text-sm font-medium ${
              token
                ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
                : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        {token && (
          <div className="mt-6 space-y-3">

            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">
                Your JWT Token
              </label>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950 dark:text-green-300">
                Generated
              </span>
            </div>

            <textarea
              value={token}
              readOnly
              rows={6}
              spellCheck={false}
              className="w-full resize-none break-all rounded-xl border border-border bg-muted p-4 font-mono text-xs leading-6 text-foreground outline-none"
            />

            <button
              onClick={handleCopyToken}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary bg-secondary px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Token Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy JWT Token
                </>
              )}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              Use this token in Postman Authorization → Bearer Token.
              Do not share this token with anyone.
            </p>

          </div>
        )}

      </div>
    </main>
  );
}

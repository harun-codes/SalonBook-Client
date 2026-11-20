
interface InlineLoaderProps {
  label?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-9 w-9 border-[3px]",
};

export default function InlineLoader({
  label = "Processing...",
  size = "md",
}: InlineLoaderProps) {
  return (
    <div
      className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground"
      role="status"
      aria-live="polite"
    >
      <span
        className={`animate-spin rounded-full border-[#075E46] border-t-transparent dark:border-[#A7E8C5] dark:border-t-transparent ${sizeClasses[size]}`}
      />

      <span>{label}</span>
    </div>
  );
}

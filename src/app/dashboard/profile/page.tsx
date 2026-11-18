
export default function CustomerProfilePage() {
  return (
    <div>
      <p className="text-sm font-semibold text-primary">
        CUSTOMER DASHBOARD
      </p>

      <h1 className="mt-2 text-2xl font-bold text-foreground">
        My Profile
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        Manage your personal information.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-card p-10 text-center">
        <h2 className="font-semibold text-foreground">
          Profile Management
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Your profile settings will appear here.
        </p>
      </div>
    </div>
  );
}

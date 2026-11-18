
export default function MyAppointmentsPage() {
  return (
    <div>
      <p className="text-sm font-semibold text-primary">
        CUSTOMER DASHBOARD
      </p>

      <h1 className="mt-2 text-2xl font-bold text-foreground">
        My Appointments
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        View and manage your salon appointments.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-card p-10 text-center">
        <h2 className="font-semibold text-foreground">
          Appointment Management
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Your appointment records will appear here.
        </p>
      </div>
    </div>
  );
}

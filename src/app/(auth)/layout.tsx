export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">
            Siniestros<span className="text-accent">YA</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Seguimiento de siniestros de seguros
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}

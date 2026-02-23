import BottomNav from "@/components/ui/BottomNav";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base" style={{ paddingBottom: "calc(4rem + env(safe-area-inset-bottom))" }}>
      {children}
      <BottomNav />
    </div>
  );
}

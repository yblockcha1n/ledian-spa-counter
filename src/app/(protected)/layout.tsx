import BottomNav from "@/components/ui/BottomNav";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-base" style={{ minHeight: "100dvh", paddingTop: "env(safe-area-inset-top)", paddingBottom: "calc(4rem + env(safe-area-inset-bottom))" }}>
      {children}
      <BottomNav />
    </div>
  );
}

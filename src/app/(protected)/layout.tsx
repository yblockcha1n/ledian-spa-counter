import BottomNav from "@/components/ui/BottomNav";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-base" style={{ minHeight: "100dvh", paddingTop: "env(safe-area-inset-top)", paddingBottom: "calc(4rem + env(safe-area-inset-bottom))" }}>
      {/* ステータスバー後ろをスクロールコンテンツが透けないよう塞ぐ */}
      <div className="fixed top-0 left-0 right-0 bg-base z-40" style={{ height: "env(safe-area-inset-top)" }} />
      {children}
      <BottomNav />
    </div>
  );
}

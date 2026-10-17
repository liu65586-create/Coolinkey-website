import { Outlet } from "react-router-dom";
import { DraftPreviewBanner } from "../DraftPreviewBanner";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export function Layout() {
  return (
    <div className="min-h-dvh bg-page text-text">
      <DraftPreviewBanner />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

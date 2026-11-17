import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import SocialRail from "./SocialRail";
import QuoteDrawer from "./QuoteDrawer";
import ScrollProgressBar from "./ScrollProgressBar";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <ScrollProgressBar />
      <Navbar />
      <SocialRail />
      <QuoteDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

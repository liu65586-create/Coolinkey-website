import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CookieConsentBanner } from "./components/CookieConsentBanner";
import { GeoRegionSync } from "./components/GeoRegionSync";
import { Layout } from "./components/layout/Layout";
import { CmsProvider } from "./context/CmsContext";
import { GeoIpProvider } from "./context/GeoIpContext";
import { ShoppingRegionProvider } from "./context/ShoppingRegionContext";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { CookiePolicy } from "./pages/CookiePolicy";
import { Home } from "./pages/Home";
import { Privacy } from "./pages/Privacy";
import { Product } from "./pages/Product";

export default function App() {
  return (
    <GeoIpProvider>
      <CmsProvider>
        <ShoppingRegionProvider>
          <GeoRegionSync />
          <BrowserRouter>
            <CookieConsentBanner />
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="/product/:slug?" element={<Product />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ShoppingRegionProvider>
      </CmsProvider>
    </GeoIpProvider>
  );
}

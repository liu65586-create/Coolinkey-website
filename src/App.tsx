import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CookieConsentBanner } from "./components/CookieConsentBanner";
import { DraftPreviewSync } from "./components/DraftPreviewSync";
import { GeoRegionSync } from "./components/GeoRegionSync";
import { PageMeta } from "./components/PageMeta";
import { Layout } from "./components/layout/Layout";
import { CmsProvider } from "./context/CmsContext";
import { GeoIpProvider } from "./context/GeoIpContext";
import { PreviewDraftProvider } from "./context/PreviewDraftContext";
import { ShoppingRegionProvider } from "./context/ShoppingRegionContext";
import { SiteConfigProvider } from "./context/SiteConfigContext";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { CookiePolicy } from "./pages/CookiePolicy";
import { Home } from "./pages/Home";
import { Privacy } from "./pages/Privacy";
import { Admin } from "./pages/Admin";
import { Product } from "./pages/Product";
import { Support } from "./pages/Support";

export default function App() {
  return (
    <PreviewDraftProvider>
      <GeoIpProvider>
        <CmsProvider>
          <SiteConfigProvider>
            <ShoppingRegionProvider>
              <GeoRegionSync />
              <BrowserRouter>
                <DraftPreviewSync />
                <PageMeta />
                <CookieConsentBanner />
                <Routes>
                  <Route path="/admin" element={<Admin />} />
                  <Route element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="product/:slug?" element={<Product />} />
                    <Route path="support" element={<Support />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="privacy" element={<Privacy />} />
                    <Route path="cookie-policy" element={<CookiePolicy />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </ShoppingRegionProvider>
          </SiteConfigProvider>
        </CmsProvider>
      </GeoIpProvider>
    </PreviewDraftProvider>
  );
}

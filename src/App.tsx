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
import { Contact } from "./pages/Contact";
import { CookiePolicy } from "./pages/CookiePolicy";
import { Privacy } from "./pages/Privacy";
import { Admin } from "./pages/Admin";
import { SitePage } from "./pages/SitePage";

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
                    <Route index element={<SitePage />} />
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

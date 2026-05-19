import { BrowserRouter, Routes, Route } from "react-router-dom";

import FarmFreshDairyWebsite from "./Pages/FarmFreshDairyWebsite";
import Subscribe from "./Pages/Subscribe";
import PrivacyPolicy from "./PrivacyPolicy";
import RefundPolicy from "./RefundPolicy";
import ShippingPolicy from "./ShippingPolicy";
import Terms from "./Terms";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FarmFreshDairyWebsite />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/terms" element={<Terms />} />
      </Routes>
    </BrowserRouter>
  );
}
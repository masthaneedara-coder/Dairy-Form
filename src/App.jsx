import { Routes, Route } from "react-router-dom";

import FarmFreshDairyWebsite from "./Pages/FarmFreshDairyWebsite";
import Subscribe from "./Pages/Subscribe";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<FarmFreshDairyWebsite />}
      />

      <Route
        path="/subscribe"
        element={<Subscribe />}
      />
    </Routes>
  );
}
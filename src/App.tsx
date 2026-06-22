import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { AiEventLogPage } from "@/pages/AiEventLogPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { VehicleListPage } from "@/pages/VehicleListPage";
import { VehicleFormPage } from "@/pages/VehicleFormPage";
import { PlaceholderPage } from "@/pages/PlaceholderPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<AiEventLogPage />} />
        <Route
          path="alarmbox-call"
          element={<PlaceholderPage title="Alarmbox Call Log" />}
        />
        <Route
          path="alarmbox-event"
          element={<PlaceholderPage title="Alarmbox Event Log" />}
        />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="vehicles" element={<VehicleListPage />} />
        <Route path="vehicles/new" element={<VehicleFormPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

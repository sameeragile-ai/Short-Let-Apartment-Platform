import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { DeviceShell } from './components/DeviceShell';
import { ExploreScreen } from './screens/ExploreScreen';
import { ApartmentDetailScreen } from './screens/ApartmentDetailScreen';
import { ShowroomScreen } from './screens/ShowroomScreen';
import { FurnitureDetailScreen } from './screens/FurnitureDetailScreen';
import { CartScreen } from './screens/CartScreen';
import { MyStayScreen } from './screens/MyStayScreen';
import { OrdersScreen } from './screens/OrdersScreen';
import { MessagesScreen } from './screens/MessagesScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { LandlordPortfolioScreen } from './screens/landlord/LandlordPortfolioScreen';
import { LandlordPropertiesScreen } from './screens/landlord/LandlordPropertiesScreen';
import { ContributePropertyScreen } from './screens/landlord/ContributePropertyScreen';
import { InvestScreen } from './screens/landlord/InvestScreen';
import { StatementsScreen } from './screens/landlord/StatementsScreen';
import { AdminOverviewScreen } from './screens/admin/AdminOverviewScreen';
import { AdminListingsScreen } from './screens/admin/AdminListingsScreen';
import { AdminPipelineScreen } from './screens/admin/AdminPipelineScreen';
import { AdminApplicationsScreen } from './screens/admin/AdminApplicationsScreen';
import { AdminOperationsScreen } from './screens/admin/AdminOperationsScreen';

export default function App() {
  return (
    <HashRouter>
      <DeviceShell>
        <Routes>
          {/* Guest / Buyer Routes */}
          <Route path="/" element={<ExploreScreen />} />
          <Route path="/apartments/:id" element={<ApartmentDetailScreen />} />
          <Route path="/showroom" element={<ShowroomScreen />} />
          <Route path="/showroom/:id" element={<FurnitureDetailScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/stay" element={<MyStayScreen />} />
          <Route path="/orders" element={<OrdersScreen />} />
          <Route path="/messages" element={<MessagesScreen />} />

          {/* Shared Utility Routes */}
          <Route path="/notifications" element={<NotificationsScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />

          {/* Landlord / Investor Routes */}
          <Route path="/landlord" element={<LandlordPortfolioScreen />} />
          <Route path="/landlord/properties" element={<LandlordPropertiesScreen />} />
          <Route path="/landlord/contribute" element={<ContributePropertyScreen />} />
          <Route path="/landlord/invest" element={<InvestScreen />} />
          <Route path="/landlord/statements" element={<StatementsScreen />} />

          {/* Admin / Operations Routes */}
          <Route path="/admin" element={<AdminOverviewScreen />} />
          <Route path="/admin/listings" element={<AdminListingsScreen />} />
          <Route path="/admin/pipeline" element={<AdminPipelineScreen />} />
          <Route path="/admin/applications" element={<AdminApplicationsScreen />} />
          <Route path="/admin/operations" element={<AdminOperationsScreen />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DeviceShell>
    </HashRouter>
  );
}

import { Routes, Route } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';

import { PageLayoutAll, RouteGuard } from './components';
import { Error404, Home, OrderCheckMain, OrderCheckNew, DayReportMain, DayReportNew, ProductMain, ProductNew, DayReportCatMain, DayReportCatNew, SummaryMain, AdminPageMain, AdminPageNew, AdminTopMain, AdminTopNew } from './pages';

import { appRoles } from './config/authConfig';
import { IPublicClientApplication } from "@azure/msal-browser";

import './styles/App.css';

const Pages = () => {
    return (
        <Routes>
            {/* Home */}
            <Route path="/" element={<Home />} />
            {/* order_check */}
            <Route path="/:invcp/order" element={<RouteGuard roles={[appRoles.Super, appRoles.Admin, appRoles.All_CRUD, appRoles.All_CRU, appRoles.All_CR, appRoles.All_R]}><OrderCheckMain /></RouteGuard>} />
            <Route path="/:invcp/order/new" element={<RouteGuard roles={[appRoles.Super, appRoles.Admin, appRoles.All_CRUD, appRoles.All_CRU, appRoles.All_CR]}><OrderCheckNew /></RouteGuard>} />
            <Route path="/:invcp/order/edit/:id" element={<RouteGuard roles={[appRoles.Super, appRoles.Admin, appRoles.All_CRUD, appRoles.All_CRU, appRoles.All_CR, appRoles.All_R]}><OrderCheckNew /></RouteGuard>} />
            {/* master (Product・Category) */}
            <Route path="/:invcp/master/product/:index" element={<RouteGuard roles={[appRoles.Super, appRoles.Admin, appRoles.All_CRUD, appRoles.All_CRU, appRoles.All_CR, appRoles.All_R]}><ProductMain /></RouteGuard>} />
            <Route path="/:invcp/master/product/:index/new" element={<RouteGuard roles={[appRoles.Super, appRoles.Admin, appRoles.All_CRUD, appRoles.All_CRU, appRoles.All_CR]}><ProductNew /></RouteGuard>} />
            <Route path="/:invcp/master/product/:index/edit/:id" element={<RouteGuard roles={[appRoles.Super, appRoles.Admin, appRoles.All_CRUD, appRoles.All_CRU, appRoles.All_CR, appRoles.All_R]}><ProductNew /></RouteGuard>} />
            {/* master (DayReport) */}
            <Route path="/:invcp/master/report/:index" element={<RouteGuard roles={[appRoles.Super, appRoles.Admin, appRoles.All_CRUD, appRoles.All_CRU, appRoles.All_CR, appRoles.All_R]}><DayReportCatMain /></RouteGuard>} />
            <Route path="/:invcp/master/report/:index/new" element={<RouteGuard roles={[appRoles.Super, appRoles.Admin, appRoles.All_CRUD, appRoles.All_CRU, appRoles.All_CR]}><DayReportCatNew /></RouteGuard>} />
            <Route path="/:invcp/master/report/:index/edit/:id" element={<RouteGuard roles={[appRoles.Super, appRoles.Admin, appRoles.All_CRUD, appRoles.All_CRU, appRoles.All_CR, appRoles.All_R]}><DayReportCatNew /></RouteGuard>} />
            {/* DayReport */}
            <Route path="/:invcp/day_report/:index" element={<RouteGuard roles={[appRoles.Super, appRoles.Admin, appRoles.All_CRUD, appRoles.All_CRU, appRoles.All_CR, appRoles.All_R]}><DayReportMain /></RouteGuard>} />
            <Route path="/:invcp/day_report/:index/new" element={<RouteGuard roles={[appRoles.Super, appRoles.Admin, appRoles.All_CRUD, appRoles.All_CRU, appRoles.All_CR]}><DayReportNew /></RouteGuard>} />
            <Route path="/:invcp/day_report/:index/edit/:id" element={<RouteGuard roles={[appRoles.Super, appRoles.Admin, appRoles.All_CRUD, appRoles.All_CRU, appRoles.All_CR, appRoles.All_R]}><DayReportNew /></RouteGuard>} />
            {/* Summary */}
            <Route path="/:invcp/summary/:index" element={<RouteGuard roles={[appRoles.Super, appRoles.Admin, appRoles.All_CRUD, appRoles.All_CRU, appRoles.All_CR, appRoles.All_R]}><SummaryMain /></RouteGuard>} />
            {/* 管理ページ (ページ内) */}
            <Route path="/:invcp/admin/:index" element={<RouteGuard roles={[appRoles.Super, appRoles.Admin]}><AdminPageMain /></RouteGuard>} />
            <Route path="/:invcp/admin/:index/new" element={<RouteGuard roles={[appRoles.Super, appRoles.Admin]}><AdminPageNew /></RouteGuard>} />
            <Route path="/:invcp/admin/:index/edit/:id" element={<RouteGuard roles={[appRoles.Super, appRoles.Admin]}><AdminPageNew /></RouteGuard>} />
            {/* 管理ページ (全体) */}
            <Route path="/admin/:index" element={<RouteGuard roles={[appRoles.Super]}><AdminTopMain /></RouteGuard>} />
            <Route path="/admin/:index/new" element={<RouteGuard roles={[appRoles.Super]}><AdminTopNew /></RouteGuard>} />
            <Route path="/admin/:index/edit/:id" element={<RouteGuard roles={[appRoles.Super]}><AdminTopNew /></RouteGuard>} />

            {/* Error */}
            <Route path='/*' element={<Error404 />} />
        </Routes>
    );
};

/**
 * msal-react is built on the React context API and all parts of your app that require authentication must be
 * wrapped in the MsalProvider component. You will first need to initialize an instance of PublicClientApplication
 * then pass this to MsalProvider as a prop. All components underneath MsalProvider will have access to the
 * PublicClientApplication instance via context as well as all hooks and components provided by msal-react. For more, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
type AppProps = {
    instance: IPublicClientApplication;
};
const App = ({ instance }: AppProps) => {
    return (
        <MsalProvider instance={instance}>
            <PageLayoutAll>
                <Pages />
            </PageLayoutAll>
        </MsalProvider>
    );
};

export default App;

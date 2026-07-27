import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Loader from './components/common/Loader';
import ProtectedRoute from './components/routes/ProtectedRoute';
import AppShell from './components/layout/AppShell';
import NotFound from './pages/NotFound/NotFound';

const Login = lazy(() => import('./pages/auth/Login/Login'));
const LeadCapture = lazy(() => import('./pages/public/LeadCapture/LeadCapture'));
const LeadsList = lazy(() => import('./pages/leads/LeadsList/LeadsList'));
const NewLead = lazy(() => import('./pages/leads/NewLead/NewLead'));
const LeadDetail = lazy(() => import('./pages/leads/LeadDetail/LeadDetail'));
const Users = lazy(() => import('./pages/admin/Users/Users'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<LeadCapture />} />
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<LeadsList />} />
            <Route path="/leads/new" element={<NewLead />} />
            <Route path="/leads/:id" element={<LeadDetail />} />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute roles={['admin']}>
                  <Users />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

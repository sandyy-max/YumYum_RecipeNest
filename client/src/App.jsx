import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { UserShell } from './components/UserShell.jsx';
import { ChefShell } from './components/ChefShell.jsx';
import { AdminShell } from './components/AdminShell.jsx';
import { Landing } from './pages/Landing.jsx';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import { Home } from './pages/Home.jsx';
import { Recipes } from './pages/Recipes.jsx';
import { RecipeDetail } from './pages/RecipeDetail.jsx';
import { Staff } from './pages/Staff.jsx';
import { About } from './pages/About.jsx';
import { Contact } from './pages/Contact.jsx';
import { Saved } from './pages/Saved.jsx';
import { Profile } from './pages/Profile.jsx';
import { ChefDashboard } from './pages/chef/ChefDashboard.jsx';
import { ChefRecipeForm } from './pages/chef/ChefRecipeForm.jsx';
import { AdminDashboard } from './pages/admin/AdminDashboard.jsx';
import { AdminUsers } from './pages/admin/AdminUsers.jsx';
import { AdminChefs } from './pages/admin/AdminChefs.jsx';
import { AdminPending } from './pages/admin/AdminPending.jsx';
import { AdminAnalytics } from './pages/admin/AdminAnalytics.jsx';
import { AdminContacts } from './pages/admin/AdminContacts.jsx';

function RootRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="yy-loading">Loading…</div>;
  if (!user) return <Landing />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'chef') return <Navigate to="/chef/dashboard" replace />;
  return <Navigate to="/home" replace />;
}

function PostLoginRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="yy-loading">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'chef') return <Navigate to="/chef/dashboard" replace />;
  return <Navigate to="/home" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRoute />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/redirect" element={<PostLoginRedirect />} />
      <Route path="/staff" element={<Staff />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/recipes" element={<Recipes />} />
      <Route path="/recipes/:id" element={<RecipeDetail />} />

      <Route
        element={
          <ProtectedRoute roles={['user']}>
            <UserShell />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/home/recipes" element={<Recipes showHeader={false} backTo="/home" />} />
        <Route path="/home/recipes/:id" element={<RecipeDetail showHeader={false} backTo="/home/recipes" />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route
        element={
          <ProtectedRoute roles={['chef', 'admin']}>
            <ChefShell />
          </ProtectedRoute>
        }
      >
        <Route path="/chef/dashboard" element={<ChefDashboard />} />
        <Route path="/chef/recipes/new" element={<ChefRecipeForm />} />
        <Route path="/chef/recipes/:id/edit" element={<ChefRecipeForm />} />
        <Route path="/chef/profile" element={<Profile />} />
      </Route>

      <Route
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminShell />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/chefs" element={<AdminChefs />} />
        <Route path="/admin/recipes/pending" element={<AdminPending />} />
        <Route path="/admin/contacts" element={<AdminContacts />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

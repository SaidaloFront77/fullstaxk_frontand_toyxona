  import React from 'react';
  import { Routes, Route } from 'react-router-dom';

  import Home from '../pages/UserHome';
  import Login from '../pages/auth/Login';
  import Register from '../pages/auth/Register';

  import Toyxonalar from '../pages/admin/Toyxonalar';
  import Owners from '../pages/admin/Owners';
  import Bronlar from '../pages/admin/Bronlar';
  import AddOwner from '../pages/admin/AddOwner';
  import AdminEditToyxona from '../pages/admin/EditToyxona';
  import AddToyxona from '../pages/admin/AddToyxona';

  import OwnerEditToyxona from '../pages/owner/EditToyxona';
  import OwnerBronlar from '../pages/owner/Bronlar';
  import EditToyxona from '../pages/owner/EditToyxona';

  import UserHome from '../pages/user/Home';
  import ToyxonaSingle from '../pages/user/ToyxonaSingle';
  import BronQilish from '../pages/user/BronQilish';
  import MeningBronlarim from '../pages/user/MeningBronlarim';

  import ProtectedRoute from '../components/ProtectedRoute';
  import AdminLayout from '../layouts/AdminLayout';
  import OwnerLayout from '../layouts/OwnerLayout';
  import OwnerAddToyxona from '../pages/owner/AddToyxona';
  import AdminToyxonaSingle from '../pages/admin/ToyxonaSingle'; 
import OwnerMyToyxona from '../pages/owner/OwnerMyToyxona';
import OwnerMyToyxonalar from '../pages/owner/OwnerMyToyxona';
import HomeSimple from '../pages/UserHome';
import HomeFiltered from '../pages/user/Home';


  const AppRoutes = () => (
    <Routes>
      {/* Umumiy */}
      <Route path="/" element={<HomeSimple />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin with layout */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route path="toyxona/:id" element={<AdminToyxonaSingle />} />
        <Route path="toyxonalar" element={<Toyxonalar />} />
        <Route path="add-toyxona" element={<AddToyxona />} />
        <Route path="owners" element={<Owners />} />
        <Route path="add-owner" element={<AddOwner />} />
        <Route path="bronlar" element={<Bronlar />} />
        <Route path="edit-toyxona/:id" element={<AdminEditToyxona />} />
      </Route>

      {/* Owner with layout */}
 <Route path="/owner" element={
  <ProtectedRoute allowedRoles={['egasi']}>
    <OwnerLayout />
  </ProtectedRoute>
}>
  <Route path="toyxonalar" element={<OwnerMyToyxona />} />
  <Route path="edit-toyxona/:id" element={<EditToyxona />} />
  <Route path="bronlar" element={<OwnerBronlar />} />
  <Route path="add-toyxona" element={<OwnerAddToyxona />} />
  <Route path="my-toyxona" element={<OwnerMyToyxona />} />
  <Route path="edit-toyxona" element={<EditToyxona />} />
  <Route path="/owner/edit-toyxona/:id" element={<EditToyxona />} />
  <Route path="/owner/my-toyxonalar" element={<OwnerMyToyxonalar />} />

</Route>

      {/* Foydalanuvchi */}
      <Route path="/user/home" element={
        <ProtectedRoute allowedRoles={['user']}>
          <HomeFiltered />
        </ProtectedRoute>
      } />
      <Route path="/toyxona/:id" element={
        <ProtectedRoute allowedRoles={['user']}>
          <ToyxonaSingle />
        </ProtectedRoute>
      } />
      <Route path="/toyxona/:id/bron" element={
        <ProtectedRoute allowedRoles={['user']}>
          <BronQilish />
        </ProtectedRoute>
      } />
      <Route path="/user/bronlar" element={
        <ProtectedRoute allowedRoles={['user']}>
          <MeningBronlarim />
        </ProtectedRoute>
      } />
    </Routes>
  );

  export default AppRoutes;

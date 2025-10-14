import { Routes, Route } from 'react-router-dom';
import AuthPage from '../pages/AuthPage';
import GroupOption from '../pages/group/GroupOption';
import JoinGroup from '../pages/group/JoinGroup';
import CreateGroup from '../pages/group/CreateGroup';
import AppLayout from '../layout/AppLayout';
import ConditionalRedirect from './ConditionalRedirect';
import ProtectedRoute from './ProtectedRoute';
import {TokenHandler} from '../components/ TokenHandler';

const Router = () => (
  <Routes>
    <Route path="/" element={<AuthPage />} />
    <Route path="/auth/*" element={<AuthPage />} />
    <Route path="/auth/callback" element={<TokenHandler />} /> 
    <Route path="/redirect" element={<ConditionalRedirect />} />

    {/* Protected routes - require authentication */}
    <Route 
      path='/group' 
      element={
        <ProtectedRoute>
          <GroupOption />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/group/create" 
      element={
        <ProtectedRoute>
          <CreateGroup />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/group/join" 
      element={
        <ProtectedRoute>
          <JoinGroup />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/files" 
      element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/provider-dashboard" 
      element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      } 
    />
  </Routes>
);

export default Router;
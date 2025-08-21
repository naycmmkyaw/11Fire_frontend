import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import SignUp from '../pages/auth/SignUp';
import SignIn from '../pages/auth/SignIn';
import GroupOption from '../pages/group/GroupOption';
import JoinGroup from '../pages/group/JoinGroup';
import CreateGroup from '../pages/group/CreateGroup';
import RoleOption from '../pages/group/RoleOption';
import AppLayout from './AppLayout';

const Router = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/auth/signin" replace />} />
    <Route path="/auth/signup" element={<SignUp />} />
    <Route path="/auth/signin" element={<SignIn />} />

    <Route path='/group' element={<GroupOption />} />
    <Route path="/group/create" element={<CreateGroup />} />
    <Route path="/group/join" element={<JoinGroup />} />
    <Route path="/role" element={<RoleOption />} />

    <Route path="/files" element={<AppLayout />} />
  </Routes>
);

export default Router;
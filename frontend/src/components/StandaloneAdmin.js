/**
 * @deprecated This component is deprecated. Use AdminPanel.js instead.
 * This file is kept temporarily for reference and will be removed in future updates.
 * Please update any routes or references to use AdminPanel component.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';

const StandaloneAdmin = () => {
  // Redirect to the new AdminPanel component
  return <Navigate to="/admin" replace />;
};

export default StandaloneAdmin;

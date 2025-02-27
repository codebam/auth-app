"use client";
import React from 'react';

const LoginButton: React.FC = () => {
  const handleLogin = () => {
    // Redirect to the Cloudflare Worker's login endpoint
    window.location.href = 'https://auth-worker.codebam.workers.dev/api/auth/login';
  };

  return (
    <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
      Login with GitHub
    </button>
  );
};

export default LoginButton;

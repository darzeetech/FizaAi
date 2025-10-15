// pages/CollectivePage.tsx

import CollectivePublic from './CollectivePublic';
import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

const CollectivePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('fizaaiuser');

    if (user) {
      navigate('/'); // redirect to home if user exists
    }
  }, [navigate]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <CollectivePublic />
    </div>
  );
};

export default CollectivePage;

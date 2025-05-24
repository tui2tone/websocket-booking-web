'use client';

import RoomLists from '@/components/Admin/RoomLists';
import PageHeader from '@/components/PageHeader';
import PageLayout from '@/layouts/PageLayout';
import React from 'react';

const AdminPage = () => {
  return (
    <PageLayout>
      <PageHeader title="Admin Panel" description="Hostel Booking System" currentView={-1} />
      <RoomLists />
    </PageLayout>
  );
};

export default AdminPage;
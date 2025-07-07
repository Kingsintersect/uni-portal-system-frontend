import React from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Roles } from '@/config'
import { loginSessionKey } from '@/lib/definitions'
import { verifySession } from '@/lib/server.utils'
import TeacherDashboardClient from './TeacherDashboardClient'

const TeacherDashboardPage = async () => {
  const session = await verifySession(loginSessionKey);
  console.log("Session in Teacher Dashboard Page:", session);

  return (
    <ProtectedRoute allowedRoles={[Roles.TEACHER]}>
      <TeacherDashboardClient accessToken={session.access_token} />
    </ProtectedRoute>
  );
}

export default TeacherDashboardPage;

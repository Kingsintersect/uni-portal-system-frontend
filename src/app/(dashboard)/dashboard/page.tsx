import { loginSessionKey } from '@/lib/definitions';
import { verifySession } from '@/lib/server.utils';
import { redirect } from 'next/navigation';

const Dashboard = async () => {
   const session = await verifySession(loginSessionKey);
   console.log('session.user.role', session.user.role);
   const basePath = `/dashboard/${(session.user.role).toLowerCase()}`;

   return redirect(`${basePath}`);
}

export default Dashboard
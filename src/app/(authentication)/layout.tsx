import { SITE_NAME } from '@/config';
import { Metadata } from 'next';
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
   title: `${SITE_NAME} - Login Form`,
   description: "Login to your dashboard to continue your education",
};

type LayoutProps = {
   children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {

   return (
      <>{children}</>
   )
}

export default Layout
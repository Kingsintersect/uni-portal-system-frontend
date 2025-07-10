import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <head></head>
      <body>
        <main className="root">
          <div className="root-container">
            <div className="wrapper">
              <Header />
              {children}
              <Footer />
            </div>
          </div>
        </main>
      </body>
    </html>
  );
};

export default Layout;

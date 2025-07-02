"use client";

import { useAuth } from "@/contexts/AuthContext";
import CompleteApplicationForm from "./components/CompleteApplicationForm";
import ApplicationStatusCard from "./components/ApplicationStatusCard";
import ContentLoader from "@/components/ui/content-loader";

const StudentApplicationPage = () => {
   const { user, loading } = useAuth();

   if (loading) {
      return (
         <ContentLoader />
      );
   }

   return (
      <>
         {user?.is_applied ? (
            <div className="flex flex-col items-center justify-center py-10">
               <div className="w-full max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto px-4">
                  <ApplicationStatusCard student={user} />
               </div>
            </div>
         ) : (
            <CompleteApplicationForm />
         )}
      </>
   );
};

export default StudentApplicationPage;

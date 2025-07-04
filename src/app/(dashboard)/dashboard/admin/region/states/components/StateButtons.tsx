"use client";

import { DeleteSingleState } from "@/app/actions/server.admin";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { notify } from "@/contexts/ToastProvider";
import { extractErrorMessages } from "@/lib/errorsHandler";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export const DeleteState = ({ access_token, id }: { access_token: string, id: string }) => {
   console.log('id', id)
   const router = useRouter();
   const handleStateDelete = async (id: string) => {
      const { error, success }: any = await DeleteSingleState(access_token, id);
      if (error) {
         const errorMessages = extractErrorMessages(error);
         errorMessages.forEach((msg) => {
            notify({ message: msg, variant: "error", timeout: 10000 });
         });
         return;
      }
      if (success) {
         notify({ message: 'Deleted Successfully.', variant: "success", timeout: 5000 })
         router.refresh();
         hardReload();
      }
   }
   const hardReload = () => {
      window.location.reload();
   };

   return (
      <>
         <span className="" onClick={() => handleStateDelete(id)}>
            <DropdownMenuItem>
               <TrashIcon className="w-5" />
               <span className="inline-block">Delete</span>
            </DropdownMenuItem>
         </span>
      </>
   )
}
"use client";
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { CheckCircle, CircleAlert, XCircle } from "lucide-react";

type AdmissionStatusType = 'admitted' | 'pending' | 'not admitted';
export type StatusType = 0 | 1 | 2;

export function AdmissionStatus({ admissionStatus }: { admissionStatus: AdmissionStatusType }) {
   const status = admissionStatusConfig[admissionStatus];

   if (!status || !status.icon) {
      return (
         <Card className="bg-gray-100">
            <CardContent>
               <div className="text-lg text-red-500 font-bold">Invalid Admission Status: {admissionStatus}</div>
            </CardContent>
         </Card>
      );
   }

   const Icon = status.icon;

   return (
      <Card className={status.backgroundColor}>
         <CardContent>
            <div className="grid grid-cols-1">
               <div className="text-lg mb-5 text-slate-500 font-bold">ADMISSION STATUS</div>
               <div className="flex items-center gap-3">
                  <Icon className={`h-14 w-14 ${status.iconColor}`} />
                  <span className={`${status.textColor} text-2xl`}>{status.message}</span>
               </div>
            </div>
         </CardContent>
      </Card>
   );
}

export function StatusCheckCard({
   dataStatus,
   admission,
   title,
   url = "#",
   // flag,
}: {
   dataStatus: StatusType;
   admission: AdmissionStatusType;
   title: string;
   url?: string;
   // flag?: string;
}) {
   const statusKey = Number(dataStatus) as StatusType;

   const status = statusConfig[statusKey];

   if (status === undefined) {
      return (
         <Card className="bg-gray-100">
            <CardContent>
               <div className="p-4 text-center text-red-600 font-semibold">
                  Unknown status: {dataStatus}
               </div>
            </CardContent>
         </Card>
      );
   }

   const Icon = status.icon;
   const isLinkActive = admission === "admitted" && statusKey === 0;

   return (
      <Card className={status.backgroundColor}>
         <CardContent>
            <Link href={isLinkActive ? url : "#"}>
               <div className="grid grid-cols-1">
                  <div className="text-lg mb-5 text-slate-500 font-bold">{title}</div>
                  <div className="flex items-center gap-3">
                     <Icon className={`h-14 w-14 ${status.iconColor}`} />
                     <span className={`${status.textColor} text-2xl`}>{status.message}</span>
                  </div>
               </div>
            </Link>
         </CardContent>
      </Card>
   );
}


const statusConfig = {
   1: {
      iconColor: "text-green-400 dark:text-green-200",
      textColor: "text-green-500",
      backgroundColor: "bg-[#e1fff4]",
      message: "Paid",
      icon: CheckCircle,
   },
   0: {
      iconColor: "text-red-400 dark:text-red-200",
      textColor: "text-red-500",
      backgroundColor: "bg-[#fff4f4]",
      message: "Not Paid",
      icon: XCircle
   },
   2: {
      iconColor: "text-lime-400 dark:text-lime-200",
      textColor: "text-lime-500",
      backgroundColor: "bg-lime-50",
      message: "PART PAID",
      icon: CheckCircle,
   },
}

const admissionStatusConfig = {
   admitted: {
      iconColor: "text-green-400 dark:text-green-200",
      textColor: "text-green-500",
      backgroundColor: "bg-[#e1fff4]",
      message: "GRANTED",
      icon: CheckCircle,
   },
   pending: {
      iconColor: "text-cyan-400 dark:text-cyan-200",
      textColor: "text-cyan-500",
      backgroundColor: "bg-[#e6f6f8]",
      message: "PENDING",
      icon: CircleAlert
   },
   "not admitted": {
      iconColor: "text-red-400 dark:text-red-200",
      textColor: "text-red-500",
      backgroundColor: "bg-[#fff4f4]",
      message: "DENAIED",
      icon: XCircle
   }
};
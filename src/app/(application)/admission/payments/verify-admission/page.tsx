"use client";

import { CenteredSection } from '@/components/Section'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { verifyApplicationPurchase } from '@/app/actions/student'
import { notify } from '@/contexts/ToastProvider'
import { baseUrl } from '@/config'
import Banner from '../componenets/Banner';
import Loader from '@/components/application/Loader';
import { Button } from '@/components/ui/button';

const VerifyApplicationPayment = () => {
   const searchParams = useSearchParams();
   const transRef = searchParams.get('transRef');

   const router = useRouter();
   const [refrenceNumber, setRefrenceNumber] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [copied, setCopied] = useState(false);
   const [isClient, setIsClient] = useState(false);

   useEffect(() => {
      async function verifyPayment() {
         const ref = Array.isArray(transRef) ? transRef[0] : transRef;
         setIsLoading(true);
         const { error, success } = await verifyApplicationPurchase(String(ref));
         if (success) {
            setIsLoading(false);
            setRefrenceNumber(String(ref));
            notify({ message: success.message, variant: "success", timeout: 5000 })
         }
         if (error) {
            setIsLoading(false);
            console.log('error', error)
            notify({ message: "Something went wrong", variant: "error", timeout: 5000 });
         }
      }
      setIsClient(true);
      verifyPayment();
   }, [transRef, router])

   const handleCopy = () => {
      if (isClient) {
         navigator.clipboard.writeText(refrenceNumber);
         setCopied(true);
         setTimeout(() => {
            setCopied(false)
         }, 5000)
      }
   }
   const handleRedirect = () => {
      router.push(`${baseUrl}/auth/signin`);
      router.refresh();
   }

   return (
      <div className="container flex items-center justify-center min-h-screen text-black">
         <CenteredSection classList='min-h-[450px] w-[50vw] mx-auto p-0' title={''}>
            <Banner />
            <h1 className='text-2xl my-2'>Verifying your payment</h1>

            <div className='flex flex-col items-center justify-center space-y-10'>
               {isLoading && <Loader />}
               {refrenceNumber &&
                  (<>
                     <h3 className="text-orange-600 text-lg -mb-7 mt-5 py-1 px-7 rounded-full border">{refrenceNumber}</h3>
                     <Button onClick={handleCopy} variant={'default'} className='py-1 rounded-full'>{copied ? "copied" : "click to copy"}</Button>
                     <div className="w-[60%] mx-auto">
                        <Button onClick={handleRedirect} variant={'destructive'} className='w-full'>continue</Button>
                     </div>
                  </>)
               }
            </div>
         </CenteredSection>
      </div>
   )
}

export default VerifyApplicationPayment
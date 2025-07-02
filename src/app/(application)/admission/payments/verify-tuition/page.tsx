"use client";
import { CenteredSection } from '@/components/Section'
import { useEffect, useState } from 'react'
import { VerifyTuitionFeePayment } from '@/app/actions/student'
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from 'next/navigation'
import { notify } from '@/contexts/ToastProvider'
import Loader from '@/components/application/Loader';
import { baseUrl } from '@/config'
import Banner from '../componenets/Banner';

const VerifyTuition = () => {
   const searchParams = useSearchParams();

   const transRef = searchParams.get('transRef');
   const transAmount = searchParams.get('transAmount');
   const currency = searchParams.get('currency');

   const router = useRouter();
   const [isLoading, setIsLoading] = useState(false);
   const { access_token } = useAuth();

   useEffect(() => {
      async function verifyPayment(access: string, ref: string) {
         setIsLoading(true);
         const { error, success } = await VerifyTuitionFeePayment(access, ref);
         if (success) {
            setIsLoading(false);
            notify({ message: success.message, variant: "success", timeout: 5000 })
            router.push(`${baseUrl}/dashboard/student/profile`);
            router.refresh();
         }
         if (error) {
            setIsLoading(false);
            console.log('error', error)
            notify({ message: "Something went wrong", variant: "error", timeout: 5000 });
         }
      }

      if (transRef && access_token) {
         const ref = Array.isArray(transRef) ? transRef[0] : transRef;
         verifyPayment(access_token, ref);
      }
   }, [transRef, access_token, router])

   return (
      <div className="container flex items-center justify-center min-h-screen text-black">
         <CenteredSection classList='min-h-[450px] w-[50vw] mx-auto p-0' title={''}>
            <Banner />
            <h1 className='text-2xl my-2'>Verifying your payment</h1>

            <div className='flex flex-col items-center justify-center space-y-10'>
               {isLoading && <Loader />}
               {transRef &&
                  (<div className='w-full py-10 px-20 space-y-5'>
                     <div className="flex justify-between items-center">
                        <div className='text-xl font-bold text-orange-900'>Transaction Ref</div>       <div>{transRef && transRef}</div>
                     </div>
                     <div className="flex justify-between items-center">
                        <div className='text-xl font-bold text-orange-900'>Transaction Amount</div>    <div>{transAmount && transAmount}</div>
                     </div>
                     <div className="flex justify-between items-center">
                        <div className='text-xl font-bold text-orange-900'>Currency</div>              <div>{currency && currency}</div>
                     </div>
                  </div>)
               }
            </div>
         </CenteredSection>
      </div>
   )
}

export default VerifyTuition

// 'use client';

// import { SubmitHandler, useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import Link from 'next/link';
// import { Loader2 } from 'lucide-react';
// import { z } from 'zod';
// import { cn } from '@/lib/utils';
// import { InputFormField } from '@/components/ui/inputs/FormFields';
// // import { useSignInMutation } from '@/hooks/useSignInMutation';
// import AuthPageTemplate from './component/AuthPageTemplate';
// // import { SigninSchema } from './signin/signin.types';
// import { signInSchema, SignInSchemaType } from '@/schemas/auth-schemas';

// type SigninFormData = z.infer<typeof signInSchema>;

// export default function AuthPage() {
//     const { mutate, isPending } = useSignInMutation();

//     const {
//         register,
//         handleSubmit,
//         formState: { errors, isSubmitting, isValid },
//     } = useForm<SigninFormData>({
//         resolver: zodResolver(signInSchema),
//         defaultValues: {
//             email: '',
//             // reference: '',
//             password: ''
//         }
//     });

//     const onSubmit: SubmitHandler<SignInSchemaType> = (data) => {
//         mutate(data); // React Query mutation handles toast and session update
//     };

//     return (
//         <AuthPageTemplate title={'LOGIN'} subTitle={'Please sign in to your account for more adventure!'}>
//             <form onSubmit={handleSubmit(onSubmit)} className={cn(`block w-full space-y-4 md:space-y-6 text-left`)}>
//                 <div className="grid grid-cols-1 gap-5">
//                     <InputFormField<SigninFormData>
//                         type="text"
//                         id={'email'}
//                         label="Email or Reference number"
//                         name="email"
//                         register={register}
//                         error={errors.email}
//                     />
//                     <InputFormField<SigninFormData>
//                         type="password"
//                         id={'password'}
//                         label="Enter strong password"
//                         name="password"
//                         register={register}
//                         error={errors.password}
//                     />
//                 </div>

//                 <div className="w-full flex item-center justify-between my-2 py-2">
//                     <div className="text-site-a">
//                         <div className="flex items-center mb-4 gap-1">
//                             <input
//                                 id={"remember"}
//                                 type="checkbox"
//                                 className={cn("peer/checkbox1 w-5 h-5 border-2 border-gray-300 focus:ring-0 dark:bg-gray-700 dark:border-gray-600")}
//                             />
//                             <label
//                                 htmlFor={`remember`}
//                                 className={cn("peer-checked/checkbox1:text-orange-400 peer-checked/checkbox1:font-bold block ms-2 font-normal text-gray-900 dark:text-gray-300")}
//                             >
//                                 Remember me
//                             </label>
//                         </div>
//                     </div>
//                     <Link href={"/auth/forgot-password"} className="text-site-a">Forgot password?</Link>
//                 </div>

//                 <button
//                     type="submit"
//                     disabled={!isValid || isSubmitting || isPending}
//                     className="mt-4 w-full bg-site-b text-white px-4 py-2 rounded hover:bg-site-b/80 flex gap-3 justify-center items-center disabled:bg-gray-600 disabled:cursor-not-allowed"
//                 >
//                     {(isSubmitting || isPending)
//                         ? (
//                             <>
//                                 <span>Processing...</span>
//                                 <Loader2 className="animate-spin text-lg ml-5" />
//                             </>
//                         )
//                         : ('Sign in')
//                     }
//                 </button>
//                 <div className="w-full text-left mt-4">
//                     New to our platform?
//                     <Link href={"/auth/signup"} className="text-site-a font-semibold"> Apply for an admission</Link>
//                 </div>
//             </form>
//         </AuthPageTemplate>
//     );
// }

import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page

"use client";

import React from 'react';
import Image from 'next/image';
import { CheckCircle, BookDashed } from "lucide-react";
import { motion } from 'framer-motion';
import { HandCoins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { baseUrl } from '@/config';

// Primary color: #701401 (deep burgundy)
// Complementary colors: #014670 (deep blue), #407010 (olive green)

const ApplicationStatusCard = ({ student }: { student: StudentType }) => {
	const isApplied = student?.is_applied === 1;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="w-full rounded-xl overflow-hidden shadow-lg"
		>
			{/* Header section with gradient background */}
			<div className={`px-6 py-4 ${isApplied ? 'bg-gradient-to-r from-green-700 to-green-500' : 'bg-gradient-to-r from-[#701401] to-[#9B1D0A]'}`}>
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold text-white">
						{isApplied ? 'You Have Successfully Appllied' : 'Complete Your Application Form'}
					</h2>
					{isApplied ? (
						<CheckCircle className="h-10 w-10 text-white" />
					) : (
						<BookDashed className="h-10 w-10 text-white" />
					)}
				</div>

				{!isApplied && (
					<div className="mt-2">
						<p className="text-white text-sm">Amount:</p>
						<p className="text-white text-3xl font-bold">
							{'30,000'}
						</p>
					</div>
				)}
			</div>

			{/* Body section */}
			<div className="bg-white p-6">
				{/* Image section */}
				<div className="relative w-full h-64 rounded-lg overflow-hidden mb-6">
					<Image
						src={isApplied ? '/payments/payment2.jpg' : '/payments/payment3.jpg'}
						alt={'Acceptance payment image'}
						fill
						style={{ objectFit: "cover" }}
						className="transition-transform hover:scale-105 duration-300"
					/>
					{!isApplied &&
						(
							<div className='absolute z-20 inset-0 w-full h-full flex items-center justify-center'>
								<div className="py-7 px-4 bg-red-50 dark:bg-red-800/50 rounded-xl text-center">
									<div className="inline-flex justify-center items-center w-16 h-16 bg-red-100 dark:bg-red-700 rounded-full mb-2">
										<HandCoins className="h-8 w-8 text-red-500 dark:text-red-400" />
									</div>
									<h3 className="text-xl font-medium text-red-700 dark:text-red-300 mb-2">Application Yet To Be completed...</h3>
									<Button variant={"destructive"} asChild className='animate-bounce'>
										<Link href={`${baseUrl}/dashboard/student/complete-application`} className='text-white'>
											COMPLETE YOUR APPLICATION
										</Link>
									</Button>
								</div>
							</div>
						)
					}
				</div>

				{/* Message */}
				<p className="text-red-400 text-xl mb-6 text-center font-bold animate-bounce">
					{isApplied
						? 'Check your email Regularly for your admission letter!'
						: 'Pleass complete your application form to proceed.'}
				</p>

				{/* Button section - only show if not fully paid */}
				{/* {!isApplied && (
					<div className="flex justify-center">
						<button
							onClick={() => handleOpenModal(true)}
							className="px-6 py-3 bg-[#701401] hover:bg-[#8A1A01] text-white font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#701401] focus:ring-opacity-50"
						>
							{'Pay Acceptance Fee'}
						</button>
					</div>
				)} */}
			</div>
		</motion.div>
	);
};

export default ApplicationStatusCard;
"use client";
import Link from "next/link";
import React from "react";
import AppLogo from "./application/AppLogo";

const Header = () => {

	return (
		<header className="absolute top-0 left-0 right-0 w-full z-50 bg-transparent flex flex-wrap justify-between items-center px-4 py-2">
			<div className="flex w-full flex-wrap justify-between items-center">
				<div
					className="text-3xl font-bold text-site-a hover:opacity-50 cursor-pointer mx-auto sm:mx-0"
				>
					<AppLogo
						image_url={'/logo/logo.jpg'}
						classList=''
						Img_container_style='w-10 h-10'
						logo_text={"COOU Admission Portal"}
					/>
				</div>

				<div className="flex items-center space-x-4 mt-4 sm:mt-0 flex-1 sm:flex-none">
					{/* User area */}
					<Link href={""}></Link>
				</div>
			</div>
		</header>
	);
};

export default Header;

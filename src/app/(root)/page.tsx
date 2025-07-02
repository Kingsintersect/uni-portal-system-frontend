import Announcements from "@/components/Announcements";
import CampusHighlights from "@/components/CampusHighlights";
import FeaturedPrograms from "@/components/FeaturedPrograms";
import HeroCarousel from "@/components/HeroCarousel";
import UpcomingEvents from "@/components/UpcomingEvents";

export default function Home() {
	return (
		<main className="min-h-screen">
			<HeroCarousel />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<FeaturedPrograms />
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
					<div className="lg:col-span-2">
						<Announcements />
					</div>
					<div>
						<UpcomingEvents />
					</div>
				</div>
				<CampusHighlights />
			</div>
		</main>
	);
}

// can you geenrate a university portal landing page in nextjs14 typescript environment with shadcn and tailwindcss - v4.it has to have a full page image carousel and a few landing page Content.consider separation of concerns.and make it well structured and buatifull with these colors #23608c and #d25400


// import AppCarousel from "@/components/application/AppCarousel";

// export default function Home() {
//   return (
//     <AppCarousel classList="m-h-sreen" />
//   );
// }

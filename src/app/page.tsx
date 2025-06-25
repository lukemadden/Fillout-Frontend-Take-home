"use client";

import { useState } from "react";
import PageNavigation from "@/components/PageNavigation";

export default function Home() {
	const [activePageId, setActivePageId] = useState("1");
	const [pageTitles, setPageTitles] = useState<Record<string, string>>({
		"1": "Info",
		"2": "Details",
		"3": "Other",
		"4": "Ending",
	});

	return (
		<div className="min-h-screen flex flex-col bg-[#444444]">
			<PageNavigation
				activePageId={activePageId}
				onPageSelect={setActivePageId}
				onPageUpdate={(pages) => {
					// Update the page titles mapping when pages change
					const newTitles = { ...pageTitles }; // Start with the existing titles
					pages.forEach((page) => {
						newTitles[page.id] = page.title;
					});
					setPageTitles(newTitles);
				}}
			/>

			<main className="flex-grow flex flex-col items-center justify-center p-4">
				<div
					className="max-w-md w-full p-6 bg-white shadow-md"
					role="tabpanel"
					id={`tabpanel-${activePageId}`}
					aria-labelledby={`tab-${activePageId}`}
				>
					<h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
						{pageTitles[activePageId] || "Unknown Page"}
					</h1>
					<p className="text-gray-600">
						This is a demonstration of the page navigation component. Try
						dragging pages to reorder them, select and click on the menu for a
						context menu, or hover between pages to add a new one. You can also
						click the &apos;Add page&apos; button to create a new page.
					</p>
				</div>
			</main>
		</div>
	);
}

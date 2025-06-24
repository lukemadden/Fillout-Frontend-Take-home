"use client";

import { useState } from "react";
import PageNavigation from "@/components/PageNavigation";

export default function Home() {
	const [activePageId, setActivePageId] = useState("1");

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<PageNavigation
				activePageId={activePageId}
				onPageSelect={setActivePageId}
			/>

			<main className="flex-grow flex flex-col items-center justify-center p-4">
				<div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
					<h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
						Page: {activePageId}
					</h1>
					<p className="text-gray-600">
						This is a demonstration of the page navigation component. Try
						dragging pages to reorder them, right-click for a context menu, or
						hover between pages to add a new one.
					</p>
				</div>
			</main>
		</div>
	);
}

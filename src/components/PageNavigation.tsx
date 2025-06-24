"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";

interface Page {
	id: string;
	title: string;
	icon?: string; // Optional icon path
}

interface ContextMenuProps {
	x: number;
	y: number;
	page: Page;
	onRename: (page: Page) => void;
	onDuplicate: (page: Page) => void;
	onDelete: (page: Page) => void;
	onClose: () => void;
}

const ContextMenu = ({
	x,
	y,
	page,
	onRename,
	onDuplicate,
	onDelete,
	onClose,
}: ContextMenuProps) => {
	return createPortal(
		<>
			<div className="fixed inset-0 z-40" onClick={onClose} />
			<div
				className="fixed z-50 bg-white rounded-md shadow-lg py-1 w-40 text-sm"
				style={{ left: `${x}px`, top: `${y}px` }}
			>
				<button
					className="w-full text-left px-4 py-2 hover:bg-gray-100"
					onClick={() => {
						onRename(page);
						onClose();
					}}
				>
					Rename
				</button>
				<button
					className="w-full text-left px-4 py-2 hover:bg-gray-100"
					onClick={() => {
						onDuplicate(page);
						onClose();
					}}
				>
					Duplicate
				</button>
				<button
					className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
					onClick={() => {
						onDelete(page);
						onClose();
					}}
				>
					Delete
				</button>
			</div>
		</>,
		document.body
	);
};

interface PageNavigationProps {
	activePageId: string;
	onPageSelect: (pageId: string) => void;
}

export default function PageNavigation({
	activePageId,
	onPageSelect,
}: PageNavigationProps) {
	const [pages, setPages] = useState<Page[]>([
		{ id: "1", title: "Info", icon: "/icons/circle-info.png" },
		{ id: "2", title: "Details", icon: "/icons/file-text.png" },
		{ id: "3", title: "Other", icon: "/icons/file-text.png" },
		{ id: "4", title: "Ending", icon: "/icons/circle-check.png" },
	]);

	const [contextMenu, setContextMenu] = useState<{
		x: number;
		y: number;
		pageId: string;
	} | null>(null);

	const [draggedItem, setDraggedItem] = useState<number | null>(null);
	const [dragOverItem, setDragOverItem] = useState<number | null>(null);

	// Simplified drag and drop handlers
	const handleDragStart = (e: React.DragEvent, position: number) => {
		setDraggedItem(position);
	};

	const handleDragOver = (e: React.DragEvent, position: number) => {
		e.preventDefault();
		setDragOverItem(position);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (draggedItem === null || dragOverItem === null) return;
		if (draggedItem === dragOverItem) return;

		// Create a copy of the pages array
		const newPages = [...pages];
		// Remove the dragged item
		const draggedItemContent = newPages.splice(draggedItem, 1)[0];
		// Add it at the new position
		newPages.splice(dragOverItem, 0, draggedItemContent);

		// Update the state with the new array
		setPages(newPages);
		setDraggedItem(null);
		setDragOverItem(null);
	};

	const handleDragEnd = (e: React.DragEvent) => {
		// If we have both draggedItem and dragOverItem, and the drop event didn't fire
		// we'll handle the reordering here as a fallback
		if (
			draggedItem !== null &&
			dragOverItem !== null &&
			draggedItem !== dragOverItem
		) {
			const newPages = [...pages];
			const draggedItemContent = newPages.splice(draggedItem, 1)[0];
			newPages.splice(dragOverItem, 0, draggedItemContent);
			setPages(newPages);
		}

		setDraggedItem(null);
		setDragOverItem(null);
	};

	// Context menu functionality
	const handleContextMenu = (e: React.MouseEvent, pageId: string) => {
		e.preventDefault();
		setContextMenu({ x: e.clientX, y: e.clientY, pageId });
	};

	const closeContextMenu = () => {
		setContextMenu(null);
	};

	const handleRename = (page: Page) => {
		// This would typically open a modal for renaming
		console.log(`Rename page: ${page.title}`);
	};

	const handleDuplicate = (page: Page) => {
		const pageIndex = pages.findIndex((p) => p.id === page.id);
		const newPage = {
			id: Date.now().toString(),
			title: `${page.title} (Copy)`,
			icon: page.icon, // Duplicate the icon as well
		};

		const newPages = [...pages];
		newPages.splice(pageIndex + 1, 0, newPage);
		setPages(newPages);
	};

	const handleDelete = (page: Page) => {
		if (pages.length <= 1) return; // Don't delete the last page

		setPages(pages.filter((p) => p.id !== page.id));

		// If the active page is deleted, select the first page
		if (activePageId === page.id) {
			const newActivePageId =
				pages[0].id === page.id ? pages[1].id : pages[0].id;
			onPageSelect(newActivePageId);
		}
	};

	// Add new page functionality
	const handleAddPage = (index: number) => {
		const newPage = {
			id: Date.now().toString(),
			title: `New Page`,
			icon: "/icons/file-text.png", // Default icon for new pages
		};

		const newPages = [...pages];
		newPages.splice(index + 1, 0, newPage);
		setPages(newPages);
	};

	return (
		<div className="w-full bg-[#444444] p-[50px]">
			<div className="w-full bg-[#f9fafb] shadow-sm border-b border-gray-200 rounded-md">
				<div className="max-w-7xl pl-[20px] pr-[20px] py-[20px]">
					<div className="flex items-center">
						<div className="flex-grow overflow-x-auto hide-scrollbar">
							<div
								className="flex space-x-1"
								onDragOver={(e) => e.preventDefault()}
							>
								{pages.map((page, index) => (
									<div
										key={page.id}
										className="flex items-center relative"
										onDragOver={(e) => handleDragOver(e, index)}
										onDrop={(e) => handleDrop(e)}
									>
										<div
											className={`group relative h-[32px] w-auto px-3 flex items-center justify-center rounded-md cursor-pointer select-none text-[14px] font-medium text-[#1A1A1A]
                    ${
											activePageId === page.id
												? "bg-blue-50 text-blue-600"
												: "hover:text-gray-700 hover:bg-gray-50"
										} ${draggedItem === index ? "opacity-50" : ""}`}
											onClick={() => onPageSelect(page.id)}
											onContextMenu={(e) => handleContextMenu(e, page.id)}
											draggable="true"
											onDragStart={(e) => handleDragStart(e, index)}
											onDragEnd={(e) => handleDragEnd(e)}
										>
											<div className="flex flex-row items-center">
												{page.icon && (
													<img
														src={page.icon}
														alt="icon"
														className="w-5 h-5 mr-[6px]"
													/>
												)}
												<span>{page.title}</span>
											</div>
										</div>

										{/* Add page button */}
										<div className="relative px-1">
											<button
												className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500"
												onClick={() => handleAddPage(index)}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													className="w-4 h-4"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M12 4v16m8-8H4"
													/>
												</svg>
											</button>
										</div>

										{/* Visual indicator for drag target */}
										{dragOverItem === index && draggedItem !== index && (
											<div
												className="absolute h-[32px] w-1 bg-blue-500 left-0"
												style={{
													left: dragOverItem > draggedItem! ? "100%" : "0",
													transform: "translateX(-50%)",
												}}
											/>
										)}
									</div>
								))}
							</div>
						</div>

						{/* Add page button at the end */}
						<div className="ml-4">
							<button
								className="px-3 py-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-[14px] font-medium"
								onClick={() => handleAddPage(pages.length - 1)}
							>
								Add Page
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Context menu */}
			{contextMenu && (
				<ContextMenu
					x={contextMenu.x}
					y={contextMenu.y}
					page={pages.find((p) => p.id === contextMenu.pageId)!}
					onRename={handleRename}
					onDuplicate={handleDuplicate}
					onDelete={handleDelete}
					onClose={closeContextMenu}
				/>
			)}
		</div>
	);
}

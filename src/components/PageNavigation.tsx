"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";

interface Page {
	id: string;
	title: string;
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
		{ id: "1", title: "Info" },
		{ id: "2", title: "Details" },
		{ id: "3", title: "Other" },
		{ id: "4", title: "Ending" },
	]);

	const [contextMenu, setContextMenu] = useState<{
		x: number;
		y: number;
		pageId: string;
	} | null>(null);
	const [draggedPageId, setDraggedPageId] = useState<string | null>(null);
	const [hoverIndex, setHoverIndex] = useState<number | null>(null);

	// Drag and drop functionality
	const handleDragStart = (e: React.DragEvent, pageId: string) => {
		setDraggedPageId(pageId);
		// Make the drag image transparent
		const dragImage = document.createElement("div");
		dragImage.style.width = "0";
		dragImage.style.height = "0";
		document.body.appendChild(dragImage);
		e.dataTransfer.setDragImage(dragImage, 0, 0);
		e.dataTransfer.effectAllowed = "move";
	};

	const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
		e.preventDefault();
		if (draggedPageId) {
			setHoverIndex(targetIndex);
		}
	};

	const handleDrop = (targetIndex: number) => {
		if (!draggedPageId) return;

		const draggedIndex = pages.findIndex((page) => page.id === draggedPageId);
		if (draggedIndex === -1) return;

		const newPages = [...pages];
		const [removedPage] = newPages.splice(draggedIndex, 1);
		newPages.splice(targetIndex, 0, removedPage);

		setPages(newPages);
		setDraggedPageId(null);
		setHoverIndex(null);
	};

	const handleDragEnd = () => {
		setDraggedPageId(null);
		setHoverIndex(null);
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
		};

		const newPages = [...pages];
		newPages.splice(index + 1, 0, newPage);
		setPages(newPages);
	};

	return (
		<div className="w-full bg-white shadow-sm border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center h-16">
					<div className="flex-grow overflow-x-auto hide-scrollbar">
						<div className="flex space-x-1">
							{pages.map((page, index) => (
								<div key={page.id} className="flex items-center">
									<div
										className={`group relative px-4 py-2 rounded-md cursor-pointer select-none
                    ${
											activePageId === page.id
												? "bg-blue-50 text-blue-600"
												: "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
										}`}
										onClick={() => onPageSelect(page.id)}
										onContextMenu={(e) => handleContextMenu(e, page.id)}
										draggable
										onDragStart={(e) => handleDragStart(e, page.id)}
										onDragOver={(e) => handleDragOver(e, index)}
										onDrop={() => handleDrop(index)}
										onDragEnd={handleDragEnd}
									>
										<span
											className={`${
												draggedPageId === page.id ? "opacity-50" : ""
											}`}
										>
											{page.title}
										</span>
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

									{/* Indicator for drag target */}
									{hoverIndex === index && draggedPageId !== page.id && (
										<div className="absolute h-full w-1 bg-blue-500 left-0 top-0"></div>
									)}
								</div>
							))}
						</div>
					</div>

					{/* Add page button at the end */}
					<div className="ml-4">
						<button
							className="px-3 py-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-medium"
							onClick={() => handleAddPage(pages.length - 1)}
						>
							Add Page
						</button>
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


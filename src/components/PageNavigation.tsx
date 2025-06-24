"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

interface Page {
	id: string;
	title: string;
	icon: string;
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
		{ id: "1", title: "Info", icon: "/icons/circle-info.svg" },
		{ id: "2", title: "Details", icon: "/icons/file-text.svg" },
		{ id: "3", title: "Other", icon: "/icons/file-text.svg" },
		{ id: "4", title: "Ending", icon: "/icons/circle-check.svg" },
	]);

	const [contextMenu, setContextMenu] = useState<{
		x: number;
		y: number;
		pageId: string;
	} | null>(null);

	const [draggedItem, setDraggedItem] = useState<number | null>(null);
	const [dragOverItem, setDragOverItem] = useState<number | null>(null);

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

		const newPages = [...pages];
		const draggedItemContent = newPages.splice(draggedItem, 1)[0];
		newPages.splice(dragOverItem, 0, draggedItemContent);

		setPages(newPages);
		setDraggedItem(null);
		setDragOverItem(null);
	};

	const handleDragEnd = (e: React.DragEvent) => {
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

	const handleContextMenu = (e: React.MouseEvent, pageId: string) => {
		e.preventDefault();
		setContextMenu({ x: e.clientX, y: e.clientY, pageId });
	};

	const closeContextMenu = () => {
		setContextMenu(null);
	};

	const handleRename = (page: Page) => {
		console.log(`Rename page: ${page.title}`);
	};

	const handleDuplicate = (page: Page) => {
		const pageIndex = pages.findIndex((p) => p.id === page.id);
		const newPage = {
			id: Date.now().toString(),
			title: `${page.title} (Copy)`,
			icon: page.icon,
		};

		const newPages = [...pages];
		newPages.splice(pageIndex + 1, 0, newPage);
		setPages(newPages);
	};

	const handleDelete = (page: Page) => {
		if (pages.length <= 1) return;

		setPages(pages.filter((p) => p.id !== page.id));

		if (activePageId === page.id) {
			const newActivePageId =
				pages[0].id === page.id ? pages[1].id : pages[0].id;
			onPageSelect(newActivePageId);
		}
	};

	const handleAddPage = (index: number) => {
		const newPage = {
			id: Date.now().toString(),
			title: `New Page`,
			icon: "/icons/file-text.svg",
		};

		const newPages = [...pages];
		newPages.splice(index + 1, 0, newPage);
		setPages(newPages);
	};

	// Function to render the SVG icons inline
	const renderIcon = (iconType: string, isActive: boolean) => {
		const iconColor = isActive ? "#F59D0E" : "#8C93A1"; // Orange color when active

		switch (iconType) {
			case "/icons/circle-info.svg":
				return (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke={iconColor}
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="w-5 h-5 mr-[6px]"
					>
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="16" x2="12" y2="12" />
						<line x1="12" y1="8" x2="12.01" y2="8" />
					</svg>
				);
			case "/icons/file-text.svg":
				return (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke={iconColor}
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="w-5 h-5 mr-[6px]"
					>
						<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
						<polyline points="14 2 14 8 20 8" />
						<line x1="16" y1="13" x2="8" y2="13" />
						<line x1="16" y1="17" x2="8" y2="17" />
						<polyline points="10 9 9 9 8 9" />
					</svg>
				);
			case "/icons/circle-check.svg":
				return (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke={iconColor}
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="w-5 h-5 mr-[6px]"
					>
						<circle cx="12" cy="12" r="10" />
						<path d="M9 12l2 2 4-4" />
					</svg>
				);
			default:
				return null;
		}
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
											className={`group relative h-[32px] w-auto px-3 flex items-center justify-center rounded-md cursor-pointer select-none text-[14px] font-medium
                      ${
												activePageId === page.id
													? "bg-blue-50 text-[#1A1A1A] border border-[#2F72E2]"
													: "bg-[#9DA4B2] bg-opacity-15 text-[#677289] hover:bg-opacity-35 border border-transparent"
											} ${draggedItem === index ? "opacity-50" : ""}`}
											onClick={() => onPageSelect(page.id)}
											onContextMenu={(e) => handleContextMenu(e, page.id)}
											draggable="true"
											onDragStart={(e) => handleDragStart(e, index)}
											onDragEnd={(e) => handleDragEnd(e)}
										>
											<div className="flex flex-row items-center">
												{renderIcon(page.icon, activePageId === page.id)}
												<span>{page.title}</span>
											</div>
										</div>

										<div className="relative px-1">
											<button
												className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500"
												onClick={() => handleAddPage(index)}
											>
												<svg
													className="w-4 h-4"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													viewBox="0 0 24 24"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M12 4.5v15m7.5-7.5h-15"
													></path>
												</svg>
											</button>
										</div>

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

						<div className="ml-4">
							<button
								className="px-3 py-1.5 rounded-md bg-blue-50 text-[#F59D0E] hover:bg-blue-100 transition-colors text-[14px] font-medium"
								onClick={() => handleAddPage(pages.length - 1)}
							>
								Add Page
							</button>
						</div>
					</div>
				</div>
			</div>

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

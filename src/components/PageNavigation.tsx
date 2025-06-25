"use client";

import { renderIcon } from "@/utils/renderIcon";
import { useState, useEffect } from "react";
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
				className="fixed z-50 bg-white rounded-xl shadow-lg py-2 w-[240px] text-sm"
				style={{ left: `${x}px`, top: `${y}px` }}
			>
				<div className="px-4 py-1">
					<h3 className="text-[16px] font-medium text-[#1A1A1A] w-[62px] h-[24px]">
						Settings
					</h3>
				</div>

				<div className="border-t border-gray-200 mb-1"></div>

				<button
					className="w-full text-left px-4 py-2 hover:bg-gray-100 text-[#1A1A1A] flex items-center text-[14px]"
					onClick={() => {
						// Set as first page functionality
						onClose();
					}}
				>
					<img
						src="/icons/flag-2.svg"
						alt=""
						className="w-4 h-4 mr-2"
						style={{ width: "16px", height: "16px" }}
					/>
					<span>Set as first page</span>
				</button>

				<button
					className="w-full text-left px-4 py-2 hover:bg-gray-100 text-[#1A1A1A] flex items-center text-[14px]"
					onClick={() => {
						onRename(page);
						onClose();
					}}
				>
					<img
						src="/icons/pencil-line.svg"
						alt=""
						className="w-4 h-4 mr-2"
						style={{ width: "16px", height: "16px" }}
					/>
					<span>Rename</span>
				</button>

				<button
					className="w-full text-left px-4 py-2 hover:bg-gray-100 text-[#1A1A1A] flex items-center text-[14px]"
					onClick={() => {
						// Copy functionality
						onClose();
					}}
				>
					<img
						src="/icons/clipboard.svg"
						alt=""
						className="w-4 h-4 mr-2"
						style={{ width: "16px", height: "16px" }}
					/>
					<span>Copy</span>
				</button>

				<button
					className="w-full text-left px-4 py-2 hover:bg-gray-100 text-[#1A1A1A] flex items-center text-[14px]"
					onClick={() => {
						onDuplicate(page);
						onClose();
					}}
				>
					<img
						src="/icons/square-behind-square.svg"
						alt=""
						className="w-4 h-4 mr-2"
						style={{ width: "16px", height: "16px" }}
					/>
					<span>Duplicate</span>
				</button>

				<div className="my-1 border-t border-gray-200"></div>

				<button
					className="w-full text-left px-4 py-2 text-[#EF494F] hover:bg-gray-100 flex items-center text-[14px]"
					onClick={() => {
						onDelete(page);
						onClose();
					}}
				>
					<img
						src="/icons/trash-can.svg"
						alt=""
						className="w-4 h-4 mr-2"
						style={{ width: "16px", height: "16px" }}
					/>
					<span>Delete</span>
				</button>
			</div>
		</>,
		document.body
	);
};

interface PageNavigationProps {
	activePageId: string;
	onPageSelect: (pageId: string) => void;
	onPageUpdate?: (pages: Page[]) => void; // Notify parent of page changes
}

export default function PageNavigation({
	activePageId,
	onPageSelect,
	onPageUpdate,
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

	// Helper function to notify parent component about page changes
	const notifyPageUpdate = (newPages: Page[]) => {
		if (onPageUpdate) {
			onPageUpdate(newPages);
		}
	};

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
		notifyPageUpdate(newPages);
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
			notifyPageUpdate(newPages);
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
		notifyPageUpdate(newPages);
	};

	const handleDelete = (page: Page) => {
		if (pages.length <= 1) return;

		const newPages = pages.filter((p) => p.id !== page.id);
		setPages(newPages);
		notifyPageUpdate(newPages);

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
		notifyPageUpdate(newPages);

		onPageSelect(newPage.id);
	};

	// Call notifyPageUpdate on initial render to set up initial page titles
	useEffect(() => {
		notifyPageUpdate(pages);
	}, []);

	return (
		<section className="w-full bg-[#444444] p-[50px]">
			<div className="w-full bg-[#f9fafb] shadow-sm border-b border-gray-200">
				<div className="max-w-7xl pl-[20px] pr-[20px] py-[20px]">
					<div className="flex items-center">
						<div className="flex-grow overflow-x-auto overflow-y-auto hide-scrollbar">
							<div
								className="flex flex-wrap gap-x-2 gap-y-5"
								onDragOver={(e) => e.preventDefault()}
							>
								{pages.map((page, index) => (
									<div
										key={page.id}
										className="flex items-center"
										onDragOver={(e) => handleDragOver(e, index)}
										onDrop={(e) => handleDrop(e)}
									>
										<div
											className={`group relative h-[32px] w-auto px-3 flex items-center justify-center rounded-md cursor-pointer select-none font-medium box-border
                      ${
												activePageId === page.id
													? "bg-[#FFFFFF] text-[#1A1A1A] border border-[#2F72E2] text-[14px]"
													: "bg-[#9DA4B2] bg-opacity-15 text-[#677289] hover:bg-opacity-35 border border-transparent text-[14px]"
											} ${draggedItem === index ? "opacity-50" : ""}`}
											onClick={() => onPageSelect(page.id)}
											onContextMenu={(e) => handleContextMenu(e, page.id)}
											draggable="true"
											onDragStart={(e) => handleDragStart(e, index)}
											onDragEnd={(e) => handleDragEnd(e)}
										>
											<div className="flex flex-row items-center">
												{/* Use direct SVG rendering for each icon type */}
												{page.icon === "/icons/circle-info.svg" && (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 24 24"
														fill="none"
														stroke={
															activePageId === page.id ? "#F59D0E" : "#8C93A1"
														}
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
														className="w-4 h-4 mr-[6px]"
														style={{
															position: "relative",
															top: "-1px",
															verticalAlign: "middle",
														}}
													>
														<circle cx="12" cy="12" r="10" />
														<line x1="12" y1="16" x2="12" y2="12" />
														<line x1="12" y1="8" x2="12.01" y2="8" />
													</svg>
												)}

												{page.icon === "/icons/file-text.svg" && (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 24 24"
														fill="none"
														stroke={
															activePageId === page.id ? "#F59D0E" : "#8C93A1"
														}
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
														className="w-4 h-4 mr-[6px]"
														style={{
															position: "relative",
															top: "-1px",
															verticalAlign: "middle",
														}}
													>
														<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
														<polyline points="14 2 14 8 20 8" />
														<line x1="16" y1="13" x2="8" y2="13" />
														<line x1="16" y1="17" x2="8" y2="17" />
														<polyline points="10 9 9 9 8 9" />
													</svg>
												)}

												{page.icon === "/icons/circle-check.svg" && (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 24 24"
														fill="none"
														stroke={
															activePageId === page.id ? "#F59D0E" : "#8C93A1"
														}
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
														className="w-4 h-4 mr-[6px]"
														style={{
															position: "relative",
															top: "-1px",
															verticalAlign: "middle",
														}}
													>
														<circle cx="12" cy="12" r="10" />
														<path d="M9 12l2 2 4-4" />
													</svg>
												)}

												<span>{page.title}</span>

												{/* Show dot-menu icon only when the page is selected */}
												{activePageId === page.id && (
													<img
														src="/icons/dot-menu.svg"
														alt="Menu"
														className="w-4 h-4 ml-2 opacity-60"
														onClick={(e) => {
															e.stopPropagation();
															handleContextMenu(e, page.id);
														}}
													/>
												)}
											</div>
										</div>
										<div className="ml-[8px] flex items-center justify-center">
											<button
												className="opacity-0 hover:opacity-100 transition-opacity duration-200 w-4 h-4 flex items-center justify-center rounded-full text-gray-500"
												onClick={() => handleAddPage(index)}
											>
												<img
													src="/icons/plus-large.svg"
													alt="Add page"
													className="w-3 h-3"
													style={{
														filter: "brightness(0) saturate(100%)",
													}}
												/>
											</button>
										</div>

										{dragOverItem === index && draggedItem !== index && (
											<div
												className="absolute h-[32px] w-1 bg-blue-500"
												style={{
													left:
														dragOverItem > draggedItem!
															? "calc(100% - 8px)"
															: "0",
													transform: "translateX(-50%)",
												}}
											/>
										)}
									</div>
								))}

								<div
									className="flex items-center"
									onDragOver={(e) => {
										e.preventDefault();
										setDragOverItem(pages.length);
									}}
									onDrop={(e) => {
										e.preventDefault();
										if (draggedItem !== null) {
											const newPages = [...pages];
											const draggedItemContent = newPages.splice(
												draggedItem,
												1
											)[0];
											newPages.splice(pages.length, 0, draggedItemContent);
											setPages(newPages);
											notifyPageUpdate(newPages);
											setDraggedItem(null);
											setDragOverItem(null);
										}
									}}
								>
									<button
										className="h-[32px] px-3 flex items-center justify-center rounded-lg bg-[#FFFFFF] text-[#1A1A1A] hover:bg-[#9DA4B2] hover:bg-opacity-35 transition-colors font-medium gap-1 border border-[#E1E1E1] text-[14px]"
										onClick={() => handleAddPage(pages.length - 1)}
									>
										<img
											src="/icons/add-icon.svg"
											alt=""
											className="w-4 h-4"
											style={{
												position: "relative",
												top: "-1px",
												verticalAlign: "middle",
											}}
										/>
										<span className="inline-block">Add Page</span>
									</button>

									{dragOverItem === pages.length && (
										<div
											className="absolute h-[32px] w-1 bg-blue-500 left-0"
											style={{
												left: "0",
												transform: "translateX(-50%)",
											}}
										/>
									)}
								</div>
							</div>
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
		</section>
	);
}

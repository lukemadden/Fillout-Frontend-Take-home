"use client";

import { usePageNavigation } from "@/hooks/usePageNavigation";
import { ContextMenu, type Page } from "./ContextMenu";
import { COLORS, INITIAL_PAGES } from "@/constants/pageNavigation";

interface PageNavigationProps {
	activePageId: string;
	onPageSelect: (pageId: string) => void;
	onPageUpdate?: (pages: Page[]) => void;
}

export default function PageNavigation({
	activePageId,
	onPageSelect,
	onPageUpdate,
}: PageNavigationProps) {
	const {
		pages,
		contextMenu,
		draggedItem,
		dragOverItem,
		handleDragStart,
		handleDragOver,
		handleDrop,
		handleDragEnd,
		handleContextMenu,
		closeContextMenu,
		handleRename,
		handleDuplicate,
		handleDelete,
		handleAddPage,
	} = usePageNavigation(
		INITIAL_PAGES,
		activePageId,
		onPageSelect,
		onPageUpdate
	);

	return (
		<section
			className="w-full bg-[#444444] p-4 sm:p-[50px] sm:pb-0"
			role="region"
			aria-label="Page navigation"
		>
			<div className="w-full bg-[#f9fafb] shadow-sm border-b border-gray-200">
				<div className="max-w-7xl px-[20px] py-[20px]">
					<div className="flex items-start sm:items-center">
						<div className="flex-grow overflow-x-auto overflow-y-auto hide-scrollbar">
							<div
								className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-x-2 sm:gap-y-5"
								onDragOver={(e) => e.preventDefault()}
								role="tablist"
								aria-orientation="horizontal"
							>
								{pages.map((page, index) => (
									<div
										key={page.id}
										className="flex items-center w-full sm:w-auto relative"
										onDragOver={(e) => handleDragOver(e, index)}
										onDrop={(e) => handleDrop(e)}
										role="none"
									>
										<div
											className={`group relative h-[32px] w-full sm:w-auto px-3 flex items-center justify-between sm:justify-center rounded-md cursor-pointer select-none font-medium box-border
													${
														activePageId === page.id
															? `bg-[#FFFFFF] text-[${COLORS.ACTIVE_TEXT}] border border-[${COLORS.ACTIVE_BORDER}] text-[14px]`
															: `bg-[#9DA4B2] bg-opacity-15 text-[${COLORS.INACTIVE_TEXT}] hover:bg-opacity-35 border border-transparent text-[14px]`
													} ${draggedItem === index ? "opacity-50" : ""}`}
											onClick={() => onPageSelect(page.id)}
											onContextMenu={(e) => handleContextMenu(e, page.id)}
											draggable="true"
											onDragStart={(e) => handleDragStart(e, index)}
											onDragEnd={(e) => handleDragEnd(e)}
											role="tab"
											id={`tab-${page.id}`}
											aria-selected={activePageId === page.id}
											aria-controls={`tabpanel-${page.id}`}
											tabIndex={activePageId === page.id ? 0 : -1}
										>
											<div className="flex flex-row items-center">
												{/* Use direct SVG rendering for each icon type */}
												{page.icon === "/icons/circle-info.svg" && (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 24 24"
														fill="none"
														stroke={
															activePageId === page.id
																? COLORS.ACTIVE_ICON
																: COLORS.INACTIVE_ICON
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
															activePageId === page.id
																? COLORS.ACTIVE_ICON
																: COLORS.INACTIVE_ICON
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
															activePageId === page.id
																? COLORS.ACTIVE_ICON
																: COLORS.INACTIVE_ICON
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
											</div>

											{/* Show dot-menu icon only when the page is selected - moved outside of first div on mobile */}
											{activePageId === page.id && (
												<img
													src="/icons/dot-menu.svg"
													alt="Menu options"
													role="presentation"
													className="w-4 h-4 ml-2 opacity-60 sm:relative"
													onClick={(e) => {
														e.stopPropagation();
														handleContextMenu(e, page.id);
													}}
												/>
											)}
										</div>
										<div className="ml-[8px] flex items-center justify-center">
											<button
												className="opacity-0 hover:opacity-100 transition-opacity duration-200 w-4 h-4 flex items-center justify-center rounded-full text-gray-500"
												onClick={() => handleAddPage(index)}
												aria-label={`Add page after ${page.title}`}
											>
												<img
													src="/icons/plus-large.svg"
													alt="Add page"
													role="presentation"
													className="w-3 h-3"
													style={{
														filter: "brightness(0) saturate(100%)",
													}}
												/>
											</button>
										</div>

										{dragOverItem === index && draggedItem !== index && (
											<div
												className="absolute h-[32px] w-[1px] bg-[#2F72E2]"
												style={{
													left:
														dragOverItem > draggedItem!
															? "calc(100% - 8px)"
															: "0",
													transform: "translateX(-50%)",
												}}
												aria-hidden="true"
											/>
										)}
									</div>
								))}

								<div
									className="flex items-center w-full sm:w-auto mt-4 sm:mt-0 relative"
									onDragOver={(e) => {
										e.preventDefault();
										handleDragOver(e, pages.length);
									}}
									onDrop={handleDrop}
								>
									<button
										className="h-[32px] w-full sm:w-auto px-3 flex items-center justify-center rounded-lg bg-[#FFFFFF] text-[#1A1A1A] hover:bg-[#9DA4B2] hover:bg-opacity-35 transition-colors font-medium gap-1 border border-[#E1E1E1] text-[14px]"
										onClick={() => handleAddPage(pages.length - 1)}
										aria-label="Add new page"
									>
										<img
											src="/icons/add-icon.svg"
											alt="Add Page"
											role="presentation"
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
											className="absolute h-[32px] w-[1px] bg-[#2F72E2] left-0"
											style={{
												left: "0",
												transform: "translateX(-50%)",
											}}
											aria-hidden="true"
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

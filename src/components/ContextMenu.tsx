"use client";

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

export const ContextMenu = ({
	x,
	y,
	page,
	onRename,
	onDuplicate,
	onDelete,
	onClose,
}: ContextMenuProps) => {
	// Add a state to track window width for responsive positioning
	const [windowWidth, setWindowWidth] = useState(
		typeof window !== "undefined" ? window.innerWidth : 0
	);

	// Track window resizing
	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Determine if we're on mobile (screen width < 640px)
	const isMobile = windowWidth < 640;

	// Calculate position based on screen size
	const menuPosition = {
		left: isMobile ? "auto" : `${x}px`,
		right: isMobile ? "20px" : "auto",
		top: `${y}px`,
	};

	return createPortal(
		<>
			<div className="fixed inset-0 z-40" onClick={onClose} />
			<div
				className="fixed z-50 bg-white rounded-xl shadow-lg py-2 w-[240px] text-sm"
				style={menuPosition}
				role="menu"
				aria-label={`Options for ${page.title}`}
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
					role="menuitem"
				>
					<img
						src="/icons/flag-2.svg"
						alt=""
						role="presentation"
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
					role="menuitem"
				>
					<img
						src="/icons/pencil-line.svg"
						alt=""
						role="presentation"
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
					role="menuitem"
				>
					<img
						src="/icons/clipboard.svg"
						alt=""
						role="presentation"
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
					role="menuitem"
				>
					<img
						src="/icons/square-behind-square.svg"
						alt=""
						role="presentation"
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
					role="menuitem"
				>
					<img
						src="/icons/trash-can.svg"
						alt=""
						role="presentation"
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

// Also export the Page interface so it can be imported elsewhere
export type { Page };

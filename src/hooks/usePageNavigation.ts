import { useState, useEffect, useCallback } from "react";
import type { Page } from "@/components/ContextMenu";

export function usePageNavigation(
	initialPages: Page[],
	activePageId: string,
	onPageSelect: (pageId: string) => void,
	onPageUpdate?: (pages: Page[]) => void
) {
	const [pages, setPages] = useState<Page[]>(initialPages);
	const [draggedItem, setDraggedItem] = useState<number | null>(null);
	const [dragOverItem, setDragOverItem] = useState<number | null>(null);
	const [contextMenu, setContextMenu] = useState<{
		x: number;
		y: number;
		pageId: string;
	} | null>(null);

	// Notify parent component about page changes
	const notifyPageUpdate = useCallback(
		(newPages: Page[]) => {
			if (onPageUpdate) {
				onPageUpdate(newPages);
			}
		},
		[onPageUpdate]
	);

	// Initialize pages
	useEffect(() => {
		notifyPageUpdate(pages);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // We want this to run only once on mount

	const handleDragStart = useCallback(
		(e: React.DragEvent, position: number) => {
			setDraggedItem(position);
		},
		[]
	);

	const handleDragOver = useCallback((e: React.DragEvent, position: number) => {
		e.preventDefault();
		setDragOverItem(position);
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
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
		},
		[draggedItem, dragOverItem, pages, notifyPageUpdate]
	);

	const handleDragEnd = useCallback(
		(e: React.DragEvent) => {
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
		},
		[draggedItem, dragOverItem, pages, notifyPageUpdate]
	);

	const handleContextMenu = useCallback(
		(e: React.MouseEvent, pageId: string) => {
			e.preventDefault();
			setContextMenu({
				x: e.clientX,
				y: e.clientY,
				pageId,
			});
		},
		[]
	);

	const closeContextMenu = useCallback(() => {
		setContextMenu(null);
	}, []);

	const handleRename = useCallback((page: Page) => {
		console.log(`Rename page: ${page.title}`);
		// Implement actual rename functionality here
	}, []);

	const handleDuplicate = useCallback(
		(page: Page) => {
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
		},
		[pages, notifyPageUpdate]
	);

	const handleDelete = useCallback(
		(page: Page) => {
			if (pages.length <= 1) return;

			const newPages = pages.filter((p) => p.id !== page.id);
			setPages(newPages);
			notifyPageUpdate(newPages);

			if (activePageId === page.id) {
				const newActivePageId =
					pages[0].id === page.id ? pages[1].id : pages[0].id;
				onPageSelect(newActivePageId);
			}
		},
		[pages, activePageId, onPageSelect, notifyPageUpdate]
	);

	const handleAddPage = useCallback(
		(index: number) => {
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
		},
		[pages, onPageSelect, notifyPageUpdate]
	);

	return {
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
	};
}

/**
 * Renders an SVG icon based on the icon type and active state
 */
export const renderIcon = (iconType: string, isActive: boolean) => {
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

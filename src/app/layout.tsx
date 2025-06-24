import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

// Initialize the Inter font
const inter = Inter({
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Fillout Frontend Take-home",
	description: "Fillout Frontend Take-home Project",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={inter.className}>
			<body>{children}</body>
		</html>
	);
}

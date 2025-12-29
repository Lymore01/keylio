import { RootProvider } from "fumadocs-ui/provider/next";
import { Inter, Lexend } from "next/font/google";
import "./global.css";

const lexend = Lexend({
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-background">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}

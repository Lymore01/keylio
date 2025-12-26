import { baseOptions } from "@/lib/layout.shared";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { Metadata } from "next";

const metadata: Metadata = {
  title: "Keylio",
  description:
    "A modular, framework-agnostic authentication system for TypeScript",
};

export default function Layout({ children }: LayoutProps<"/">) {
  return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}

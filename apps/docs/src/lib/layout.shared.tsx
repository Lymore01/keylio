import Logo from "@/components/logo";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { FileText } from "lucide-react";

export function baseOptions(): BaseLayoutProps {
  return {
    githubUrl: "https://github.com/lymore01/keylio",
    nav: {
      title: <Logo />,
    },
    links: [
      {
        text: "Documentation",
        url: "/docs",
        active: "nested-url",
        icon: <FileText className="w-4 h-4" />,
      },
    ],
  };
}

import Logo from "@/components/logo";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { FileText, History } from "lucide-react";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Logo />,
    },
    links: [
      {
        text: "Docs",
        url: "/docs",
        active: "nested-url",
        icon: <FileText className="w-4 h-4" />,
      },

    ],
  };
}

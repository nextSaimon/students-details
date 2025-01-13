"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export function Breadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-1 text-sm text-gray-500">
        <li>
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
        </li>
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;

          return (
            <li key={href} className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
              {isLast ? (
                <span className="font-semibold text-gray-900">{segment}</span>
              ) : (
                <Link href={href} className="hover:text-blue-600">
                  {segment}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

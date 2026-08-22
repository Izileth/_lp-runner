import React from "react";
import type { Route } from "../../types";
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer";
import Breadcrumb, { BreadcrumbItem } from "../molecules/Breadcrumb";

interface PageLayoutProps {
    onNavigate: (route: Route) => void;
    currentRoute: Route;
    showFooterLinks?: boolean;
    breadcrumbItems?: BreadcrumbItem[];
    children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
    onNavigate,
    currentRoute,
    showFooterLinks = true,
    breadcrumbItems,
    children,
}) => {
    return (
        <div className="relative w-full min-h-screen bg-ivory text-black-main overflow-x-hidden font-sans flex flex-col justify-between">
            <div>
                {/* Navbar */}
                <Navbar onNavigate={onNavigate} currentRoute={currentRoute} />

                {/* Breadcrumb (Optional) */}
                {breadcrumbItems && breadcrumbItems.length > 0 && (
                    <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 pt-4">
                        <Breadcrumb items={breadcrumbItems} onNavigate={onNavigate} />
                    </div>
                )}

                {/* Main Content */}
                {children}
            </div>

            {/* Footer */}
            <Footer onNavigate={onNavigate} showLinks={showFooterLinks} />
        </div>
    );
};

export default PageLayout;

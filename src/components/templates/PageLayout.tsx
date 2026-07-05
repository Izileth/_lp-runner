import React from "react";
import type { Route } from "../../types";
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer";

interface PageLayoutProps {
    onNavigate: (route: Route) => void;
    currentRoute: Route;
    showFooterLinks?: boolean;
    children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
    onNavigate,
    currentRoute,
    showFooterLinks = true,
    children,
}) => {
    return (
        <div className="relative w-full min-h-screen bg-ivory text-black-main overflow-x-hidden font-sans flex flex-col justify-between">
            <div>
                {/* Navbar */}
                <Navbar onNavigate={onNavigate} currentRoute={currentRoute} />

                {/* Main Content */}
                {children}
            </div>

            {/* Footer */}
            <Footer onNavigate={onNavigate} showLinks={showFooterLinks} />
        </div>
    );
};

export default PageLayout;

import { useState } from "react";
import Home from "./pages/home";
import HeroYeezy from "./pages/product";
import About from "./pages/about";
import Fins from "./pages/fins";
import heroImage from "./assets/hero.png";

function App() {
    const [currentRoute, setCurrentRoute] = useState("home");

    const handleNavigate = (route: string) => {
        // Window scroll to top on navigation for better UX
        window.scrollTo({ top: 0, behavior: "instant" });
        setCurrentRoute(route);
    };

    const renderRoute = () => {
        switch (currentRoute) {
            case "home":
                return <Home onNavigate={handleNavigate} />;
            case "product":
                return (
                    <HeroYeezy
                        productImageUrl={heroImage}
                        productName="Foam RNNR Ararat"
                        onNavigate={handleNavigate}
                    />
                );
            case "about":
                return <About onNavigate={handleNavigate} />;
            case "fins":
                return <Fins onNavigate={handleNavigate} />;
            default:
                return <Home onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#F1EEE6]">
            {renderRoute()}
        </div>
    );
}

export default App;


import { useEffect, useRef } from "react";
import gsap from "gsap";

interface ContactProps {
    onNavigate: (route: string) => void;
}

export default function Contact({ onNavigate }: ContactProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                titleRef.current,
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.0, ease: "power4.out" }
            );

            gsap.fromTo(
                ".contact-info-block",
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: 0.8, delay: 0.3, ease: "power3.out" }
            );

            gsap.fromTo(
                ".contact-form-block",
                { opacity: 0, x: 30 },
                { opacity: 1, x: 0, duration: 0.8, delay: 0.3, ease: "power3.out" }
            );

            // Floating pills
            gsap.to(".floating-pill", {
                y: "random(-10, 10)",
                x: "random(-8, 8)",
                rotation: "random(-5, 5)",
                duration: "random(4, 6)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Custom minimal feedback
        alert("Inquiry submitted. Our team will contact you within 24 hours.");
    };

    return (
        <div ref={containerRef} className="relative w-full min-h-screen bg-ivory text-black-main overflow-x-hidden font-sans">
            {/* ---------- NAVBAR ---------- */}
            <header className="relative z-20 flex items-center justify-between px-6 sm:px-10 lg:px-14 py-6 sm:py-8">
                <button
                    onClick={() => onNavigate("home")}
                    className="flex items-center gap-[1px] text-lg sm:text-xl font-extrabold tracking-tight text-black-main select-none cursor-pointer"
                    aria-label="Runner home"
                >
                    <span className="inline-block scale-x-[-1]">R</span>
                    <span>unner</span>
                </button>

                <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold tracking-widest uppercase text-black-main">
                    <button onClick={() => onNavigate("product")} className="hover:opacity-60 transition-opacity cursor-pointer">
                        Shop
                    </button>
                    <span className="text-border-main">/</span>
                    <button onClick={() => onNavigate("fins")} className="hover:opacity-60 transition-opacity cursor-pointer">
                        Fins
                    </button>
                    <button onClick={() => onNavigate("about")} className="hover:opacity-60 transition-opacity cursor-pointer">
                        About
                    </button>
                    <button onClick={() => onNavigate("contact")} className="hover:opacity-60 transition-opacity cursor-pointer">
                        Contact
                    </button>
                </nav>

                <div className="flex items-center gap-3 sm:gap-4">
                    <span className="hidden sm:inline text-[11px] font-semibold tracking-widest uppercase text-black-main">
                        Account
                    </span>
                    <button 
                        onClick={() => onNavigate("product")}
                        className="flex items-center gap-2 border border-border-main rounded-full pl-4 pr-1.5 py-1.5 cursor-pointer bg-card-bg hover:bg-black-main hover:text-white transition-all duration-300"
                    >
                        <span className="text-[11px] font-semibold tracking-widest uppercase whitespace-nowrap">
                            Bag &middot; $0
                        </span>
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-black-main text-white text-[10px] font-bold">
                            0
                        </span>
                    </button>
                </div>
            </header>

            {/* ---------- MAIN SECTION ---------- */}
            <main className="relative max-w-5xl mx-auto px-6 pt-10 pb-20">
                {/* Decorative floating elements */}
                <span className="floating-pill pointer-events-none absolute left-[5%] top-[15%] w-10 h-6 rounded-full bg-card-bg border border-border-main opacity-85 rotate-[-10deg] blur-[0.5px]" />
                <span className="floating-pill pointer-events-none absolute right-[5%] top-[20%] w-12 h-7 rounded-full bg-card-bg border border-border-main opacity-70 rotate-[20deg] blur-[1px]" />

                <div className="text-center md:text-left">
                    <p className="text-[11px] font-bold tracking-widest uppercase text-gray-sec mb-2">
                        Get In Touch
                    </p>
                    <h1
                        ref={titleRef}
                        className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-black-main tracking-tighter mb-12 font-display"
                    >
                        CONTACT US
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-6">
                    {/* Contact Info Block */}
                    <div className="contact-info-block md:col-span-5 flex flex-col justify-between gap-8">
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-sec mb-4">Inquiries</h3>
                            <div className="flex flex-col gap-3">
                                <div>
                                    <p className="text-xs font-semibold text-black-main uppercase">General &amp; Orders</p>
                                    <a href="mailto:support@runnerspace.com" className="text-sm text-gray-sec hover:text-black-main transition-colors">support@runnerspace.com</a>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-black-main uppercase">Design Lab Collaboration</p>
                                    <a href="mailto:lab@runnerspace.com" className="text-sm text-gray-sec hover:text-black-main transition-colors">lab@runnerspace.com</a>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-sec mb-4">Office</h3>
                            <p className="text-sm text-black-main font-semibold">Runner Studio Headquarters</p>
                            <p className="text-xs text-gray-sec mt-1 leading-relaxed">
                                Av. Beira Mar Norte, 1200<br />
                                Florianópolis, SC, 88015-700<br />
                                Brazil
                            </p>
                        </div>

                        <div className="border-t border-border-main pt-6">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-black-main">
                                Available Mon &ndash; Fri / 9:00 &ndash; 18:00 GMT-3
                            </span>
                        </div>
                    </div>

                    {/* Contact Form Block */}
                    <form ref={formRef} onSubmit={handleSubmit} className="contact-form-block md:col-span-7 bg-card-bg border border-border-main rounded-xl p-8 sm:p-10 flex flex-col gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-wider text-gray-sec">Full Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    className="px-4 py-3 bg-ivory border border-border-main rounded-md text-sm text-black-main placeholder-gray-sec/50 outline-none focus:border-black-main transition-colors"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-gray-sec">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="john@example.com"
                                    className="px-4 py-3 bg-ivory border border-border-main rounded-md text-sm text-black-main placeholder-gray-sec/50 outline-none focus:border-black-main transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="subject" className="text-[10px] font-bold uppercase tracking-wider text-gray-sec">Subject</label>
                            <select
                                id="subject"
                                className="px-4 py-3 bg-ivory border border-border-main rounded-md text-sm text-black-main outline-none focus:border-black-main transition-colors"
                            >
                                <option>Order Support</option>
                                <option>Custom Design Inquiry</option>
                                <option>Fins Performance Tech</option>
                                <option>General Collaboration</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-wider text-gray-sec">Message</label>
                            <textarea
                                id="message"
                                rows={5}
                                required
                                placeholder="Describe your inquiry..."
                                className="px-4 py-3 bg-ivory border border-border-main rounded-md text-sm text-black-main placeholder-gray-sec/50 outline-none focus:border-black-main transition-colors resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-4 rounded-md bg-black-main text-white text-xs sm:text-sm font-bold tracking-widest uppercase py-4 hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer"
                        >
                            Submit Inquiry
                        </button>
                    </form>
                </div>
            </main>

            {/* ---------- FOOTER ---------- */}
            <footer className="border-t border-border-main px-6 sm:px-10 lg:px-14 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-gray-sec text-[11px] font-medium uppercase tracking-wider">
                <div className="flex items-center gap-6">
                    <button onClick={() => onNavigate("home")} className="hover:text-black-main transition-colors cursor-pointer">Home</button>
                    <button onClick={() => onNavigate("product")} className="hover:text-black-main transition-colors cursor-pointer">Sneakers</button>
                    <button onClick={() => onNavigate("fins")} className="hover:text-black-main transition-colors cursor-pointer">Fins</button>
                    <a href="#" className="hover:text-black-main transition-colors">Privacy</a>
                </div>
                <div>
                    &copy; 2026 Runner Space. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

import React, { useRef, useMemo } from "react";
import type { Route } from "../types";
import { useFloatingPills } from "../hooks/useFloatingPills";
import { usePageEntrance } from "../hooks/usePageEntrance";
import PageLayout from "../components/templates/PageLayout";
import FloatingPill from "../components/atoms/FloatingPill";
import ContactForm from "../components/organisms/ContactForm";

interface ContactProps {
    onNavigate: (route: Route) => void;
}

export const Contact: React.FC<ContactProps> = ({ onNavigate }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    // Apply floating animations to pills
    useFloatingPills(containerRef);

    // Entrance GSAP animation config
    const entranceAnimations = useMemo(
        () => [
            {
                target: titleRef,
                from: { y: 60, opacity: 0 },
                to: { y: 0, opacity: 1, duration: 1.0, ease: "power4.out" },
            },
            {
                target: ".contact-info-block",
                from: { opacity: 0, x: -30 },
                to: { opacity: 1, x: 0, duration: 0.8, delay: 0.3, ease: "power3.out" },
            },
            {
                target: ".contact-form-block",
                from: { opacity: 0, x: 30 },
                to: { opacity: 1, x: 0, duration: 0.8, delay: 0.3, ease: "power3.out" },
            },
        ],
        []
    );

    usePageEntrance(containerRef, entranceAnimations);

    const handleSubmitSuccess = () => {
        alert("Mensagem enviada. Nossa equipe de curadoria entrará em contato em até 24 horas.");
    };

    return (
        <PageLayout onNavigate={onNavigate} currentRoute="contact" showFooterLinks={true}>
            <main ref={containerRef} className="relative max-w-5xl mx-auto px-6 pt-10 pb-20">
                {/* Decorative floating elements */}
                <FloatingPill className="left-[5%] top-[15%] w-10 h-6 rotate-[-10deg]" />
                <FloatingPill className="right-[5%] top-[20%] w-12 h-7 rotate-[20deg] blur-[1px]" />

                <div className="text-center md:text-left">
                    <p className="text-[11px] font-bold tracking-widest uppercase text-gray-sec mb-2">
                        Fale Conosco
                    </p>
                    <h1
                        ref={titleRef}
                        className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-black-main tracking-tighter mb-12 font-display uppercase"
                    >
                        CONTATO
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-6">
                    {/* Contact Info Block */}
                    <div className="contact-info-block md:col-span-5 flex flex-col justify-between gap-8">
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-sec mb-4">Atendimento</h3>
                            <div className="flex flex-col gap-3">
                                <div>
                                    <p className="text-xs font-semibold text-black-main uppercase">Dúvidas Gerais &amp; Leilões</p>
                                    <a
                                        href="mailto:suporte@auctionplatform.com"
                                        className="text-sm text-gray-sec hover:text-black-main transition-colors"
                                    >
                                        suporte@auctionplatform.com
                                    </a>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-black-main uppercase">Curadoria &amp; Avaliação</p>
                                    <a
                                        href="mailto:curadoria@auctionplatform.com"
                                        className="text-sm text-gray-sec hover:text-black-main transition-colors"
                                    >
                                        curadoria@auctionplatform.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-sec mb-4">Sede Corporativa</h3>
                            <p className="text-sm text-black-main font-semibold">Auction Platform Headquarters</p>
                            <p className="text-xs text-gray-sec mt-1 leading-relaxed">
                                Av. Brigadeiro Faria Lima, 3000<br />
                                São Paulo, SP, 01451-000<br />
                                Brasil
                            </p>
                        </div>

                        <div className="border-t border-border-main pt-6">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-black-main">
                                Disponível Seg &ndash; Sex / 9:00 &ndash; 18:00 GMT-3
                            </span>
                        </div>
                    </div>

                    {/* Contact Form Organism */}
                    <ContactForm onSubmitSuccess={handleSubmitSuccess} />
                </div>
            </main>
        </PageLayout>
    );
};

export default Contact;

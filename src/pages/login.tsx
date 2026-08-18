import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/atoms/Logo";
import Button from "../components/atoms/Button";
import FloatingPill from "../components/atoms/FloatingPill";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import type { Route } from "../types";

export interface LoginProps {
    onNavigate: (route: Route) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
    const { signIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // Page entrance animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".auth-fade-up",
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    stagger: 0.1,
                    ease: "power3.out",
                    delay: 0.15,
                }
            );

            gsap.fromTo(
                ".auth-card",
                { y: 40, opacity: 0, scale: 0.98 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: "power3.out",
                    delay: 0.1,
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error: signInError } = await signIn(email, password);

        if (signInError) {
            setError(signInError);
            setLoading(false);

            // Shake animation on error
            if (formRef.current) {
                gsap.fromTo(
                    formRef.current,
                    { x: -8 },
                    {
                        x: 0,
                        duration: 0.5,
                        ease: "elastic.out(1, 0.3)",
                    }
                );
            }
        } else {
            // Success animation then navigate
            gsap.to(".auth-card", {
                y: -20,
                opacity: 0,
                scale: 0.96,
                duration: 0.4,
                ease: "power3.in",
                onComplete: () => onNavigate("home"),
            });
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative min-h-screen bg-ivory flex flex-col items-center justify-center overflow-hidden px-6 py-12"
        >
            {/* Decorative floating pills */}
            <FloatingPill className="left-[5%] top-[20%] w-10 h-6 rotate-[-20deg] opacity-40 floating-pill" />
            <FloatingPill className="right-[8%] top-[15%] w-14 h-8 rotate-[25deg] opacity-30 floating-pill" />
            <FloatingPill className="left-[15%] bottom-[25%] w-8 h-5 rotate-[12deg] blur-[1px] opacity-30 floating-pill" />
            <FloatingPill className="right-[12%] bottom-[20%] w-12 h-7 rotate-[-10deg] opacity-25 floating-pill" />

            {/* Background Wordmark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.02] overflow-hidden -z-10">
                <span className="text-[40vw] font-display font-black tracking-tighter leading-none">
                    R
                </span>
            </div>

            {/* Back to Home */}
            <button
                onClick={() => onNavigate("home")}
                className="auth-fade-up absolute top-8 left-8 flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-gray-sec hover:text-black-main transition-colors cursor-pointer group"
            >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Home
            </button>

            {/* Logo */}
            <div className="auth-fade-up mb-10">
                <Logo onClick={() => onNavigate("home")} />
            </div>

            {/* Auth Card */}
            <div className="auth-card w-full max-w-md">
                <div className="bg-card-bg border border-border-main rounded-2xl p-8 sm:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-sec">
                            WELCOME BACK
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-black-main mt-2">
                            SIGN IN
                        </h1>
                        <p className="text-xs text-gray-sec mt-2 leading-relaxed">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-xs text-red-600 font-medium text-center">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Email Field */}
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="login-email"
                                className="text-[10px] font-bold uppercase tracking-wider text-gray-sec"
                            >
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-sec/50" />
                                <input
                                    id="login-email"
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-ivory border border-border-main rounded-md text-sm text-black-main placeholder-gray-sec/50 outline-none focus:border-black-main transition-colors"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="login-password"
                                className="text-[10px] font-bold uppercase tracking-wider text-gray-sec"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-sec/50" />
                                <input
                                    id="login-password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 bg-ivory border border-border-main rounded-md text-sm text-black-main placeholder-gray-sec/50 outline-none focus:border-black-main transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-sec/50 hover:text-black-main transition-colors cursor-pointer"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            disabled={loading}
                            className="mt-2"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-border-main" />
                        <span className="text-[10px] font-bold tracking-widest text-gray-sec uppercase">
                            or
                        </span>
                        <div className="flex-1 h-px bg-border-main" />
                    </div>

                    {/* Switch to Register */}
                    <p className="text-center text-xs text-gray-sec">
                        Don't have an account?{" "}
                        <button
                            onClick={() => onNavigate("register" as Route)}
                            className="text-black-main font-bold hover:underline underline-offset-4 cursor-pointer transition-all"
                        >
                            Create Account
                        </button>
                    </p>
                </div>

                {/* Bottom branding */}
                <div className="text-center mt-6">
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-sec/50">
                        Runner Space · Secure Authentication
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/atoms/Logo";
import Button from "../components/atoms/Button";
import FloatingPill from "../components/atoms/FloatingPill";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Check } from "lucide-react";
import type { Route } from "../types";

export interface RegisterProps {
    onNavigate: (route: Route) => void;
}

export const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
    const { signUp } = useAuth();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // Password strength indicators
    const passwordChecks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
    };

    const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

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

        // Validations
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            shakeForm();
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            shakeForm();
            return;
        }

        setLoading(true);

        const { error: signUpError } = await signUp(email, password, fullName);

        if (signUpError) {
            setError(signUpError);
            setLoading(false);
            shakeForm();
        } else {
            setSuccess(true);
            setLoading(false);

            // Success animation
            gsap.fromTo(
                ".success-check",
                { scale: 0, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.6,
                    ease: "back.out(1.7)",
                }
            );
        }
    };

    const shakeForm = () => {
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
    };

    return (
        <div
            ref={containerRef}
            className="relative min-h-screen bg-ivory flex flex-col items-center justify-center overflow-hidden px-6 py-12"
        >
            {/* Decorative floating pills */}
            <FloatingPill className="left-[6%] top-[18%] w-12 h-7 rotate-[-18deg] opacity-35 floating-pill" />
            <FloatingPill className="right-[7%] top-[12%] w-10 h-6 rotate-[30deg] opacity-30 floating-pill" />
            <FloatingPill className="left-[20%] bottom-[15%] w-8 h-5 rotate-[8deg] blur-[1px] opacity-25 floating-pill" />
            <FloatingPill className="right-[15%] bottom-[22%] w-14 h-8 rotate-[-12deg] opacity-20 floating-pill" />

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
            <div className="auth-fade-up mb-8">
                <Logo onClick={() => onNavigate("home")} />
            </div>

            {/* Auth Card */}
            <div className="auth-card w-full max-w-md">
                <div className="bg-card-bg border border-border-main rounded-2xl p-8 sm:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
                    {!success ? (
                        <>
                            {/* Header */}
                            <div className="text-center mb-8">
                                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-sec">
                                    JOIN THE MOVEMENT
                                </span>
                                <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-black-main mt-2">
                                    CREATE ACCOUNT
                                </h1>
                                <p className="text-xs text-gray-sec mt-2 leading-relaxed">
                                    Sign up to start bidding and selling on Runner Space
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-xs text-red-600 font-medium text-center">
                                        {error}
                                    </p>
                                </div>
                            )}

                            {/* Form */}
                            <form
                                ref={formRef}
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-5"
                            >
                                {/* Full Name Field */}
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="register-name"
                                        className="text-[10px] font-bold uppercase tracking-wider text-gray-sec"
                                    >
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-sec/50" />
                                        <input
                                            id="register-name"
                                            type="text"
                                            required
                                            placeholder="John Doe"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-ivory border border-border-main rounded-md text-sm text-black-main placeholder-gray-sec/50 outline-none focus:border-black-main transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="register-email"
                                        className="text-[10px] font-bold uppercase tracking-wider text-gray-sec"
                                    >
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-sec/50" />
                                        <input
                                            id="register-email"
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
                                        htmlFor="register-password"
                                        className="text-[10px] font-bold uppercase tracking-wider text-gray-sec"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-sec/50" />
                                        <input
                                            id="register-password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            placeholder="Create a password"
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

                                    {/* Password Strength Indicator */}
                                    {password.length > 0 && (
                                        <div className="mt-2 space-y-2">
                                            {/* Strength bar */}
                                            <div className="flex gap-1">
                                                {[1, 2, 3].map((level) => (
                                                    <div
                                                        key={level}
                                                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                                            passwordStrength >= level
                                                                ? passwordStrength === 1
                                                                    ? "bg-red-400"
                                                                    : passwordStrength === 2
                                                                      ? "bg-amber-400"
                                                                      : "bg-emerald-400"
                                                                : "bg-border-main"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            {/* Check items */}
                                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                                                <span
                                                    className={`text-[10px] font-medium flex items-center gap-1 transition-colors ${
                                                        passwordChecks.length
                                                            ? "text-emerald-500"
                                                            : "text-gray-sec/50"
                                                    }`}
                                                >
                                                    <Check className="w-3 h-3" /> 8+ chars
                                                </span>
                                                <span
                                                    className={`text-[10px] font-medium flex items-center gap-1 transition-colors ${
                                                        passwordChecks.uppercase
                                                            ? "text-emerald-500"
                                                            : "text-gray-sec/50"
                                                    }`}
                                                >
                                                    <Check className="w-3 h-3" /> Uppercase
                                                </span>
                                                <span
                                                    className={`text-[10px] font-medium flex items-center gap-1 transition-colors ${
                                                        passwordChecks.number
                                                            ? "text-emerald-500"
                                                            : "text-gray-sec/50"
                                                    }`}
                                                >
                                                    <Check className="w-3 h-3" /> Number
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="register-confirm-password"
                                        className="text-[10px] font-bold uppercase tracking-wider text-gray-sec"
                                    >
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-sec/50" />
                                        <input
                                            id="register-confirm-password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            placeholder="Confirm your password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={`w-full pl-10 pr-12 py-3 bg-ivory border rounded-md text-sm text-black-main placeholder-gray-sec/50 outline-none transition-colors ${
                                                confirmPassword.length > 0 && password !== confirmPassword
                                                    ? "border-red-300 focus:border-red-400"
                                                    : confirmPassword.length > 0 && password === confirmPassword
                                                      ? "border-emerald-300 focus:border-emerald-400"
                                                      : "border-border-main focus:border-black-main"
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(!showConfirmPassword)
                                            }
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-sec/50 hover:text-black-main transition-colors cursor-pointer"
                                            aria-label={
                                                showConfirmPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            {showConfirmPassword ? (
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
                                            Creating account...
                                        </span>
                                    ) : (
                                        "Create Account"
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

                            {/* Switch to Login */}
                            <p className="text-center text-xs text-gray-sec">
                                Already have an account?{" "}
                                <button
                                    onClick={() => onNavigate("login" as Route)}
                                    className="text-black-main font-bold hover:underline underline-offset-4 cursor-pointer transition-all"
                                >
                                    Sign In
                                </button>
                            </p>
                        </>
                    ) : (
                        /* ====== Success State ====== */
                        <div className="text-center py-6">
                            <div className="success-check w-16 h-16 mx-auto mb-6 bg-black-main rounded-full flex items-center justify-center">
                                <Check className="w-8 h-8 text-ivory" />
                            </div>
                            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-sec">
                                ACCOUNT CREATED
                            </span>
                            <h2 className="text-2xl font-display font-black tracking-tight text-black-main mt-2">
                                CHECK YOUR EMAIL
                            </h2>
                            <p className="text-xs text-gray-sec mt-3 leading-relaxed max-w-xs mx-auto">
                                We've sent a confirmation link to <strong className="text-black-main">{email}</strong>.
                                Please verify your email to complete the registration.
                            </p>

                            <Button
                                onClick={() => onNavigate("login" as Route)}
                                variant="primary"
                                fullWidth
                                className="mt-8"
                            >
                                Go to Sign In
                            </Button>
                        </div>
                    )}
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

export default Register;

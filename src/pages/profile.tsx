import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import Button from "../components/atoms/Button";
import FloatingPill from "../components/atoms/FloatingPill";
import { User, Mail, Shield, Check, AlertCircle, Save, LogOut } from "lucide-react";
import type { Route } from "../types";

interface ProfileProps {
    onNavigate: (route: Route) => void;
}

interface ProfileData {
    id?: string;
    full_name: string;
    avatar_url?: string;
    updated_at?: string;
}

export const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
    const { user, signOut, loading: authLoading } = useAuth();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            onNavigate("login");
        }
    }, [user, authLoading, onNavigate]);

    // Fetch profile data
    useEffect(() => {
        if (!user) return;

        setEmail(user.email || "");

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                if (error && error.code !== "PGRST116") {
                    console.error("Error loading profile:", error);
                }

                if (data && data.full_name) {
                    setFullName(data.full_name);
                } else if (user.user_metadata?.full_name) {
                    setFullName(user.user_metadata.full_name);
                }
            } catch (err) {
                console.error("Unexpected error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    // Page entrance animation
    useEffect(() => {
        if (loading) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".profile-fade-up",
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    stagger: 0.1,
                    ease: "power3.out",
                    delay: 0.1,
                }
            );

            gsap.fromTo(
                ".profile-card",
                { y: 40, opacity: 0, scale: 0.98 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: "power3.out",
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [loading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setMessage(null);
        setSaving(true);

        try {
            // Update auth metadata
            const { error: authError } = await supabase.auth.updateUser({
                data: { full_name: fullName },
            });

            if (authError) throw authError;

            // Upsert into profiles table
            const profilePayload: ProfileData = {
                id: user.id,
                full_name: fullName,
                updated_at: new Date().toISOString(),
            };

            const { error: profileError } = await supabase
                .from("profiles")
                .upsert(profilePayload);

            if (profileError) {
                // If table doesn't exist yet, user metadata is still saved
                console.warn("Could not upsert into 'profiles' table, updated auth metadata instead:", profileError);
            }

            setMessage({ type: "success", text: "Profile updated successfully!" });

            // Pulse animation on success
            if (formRef.current) {
                gsap.fromTo(
                    formRef.current,
                    { scale: 0.99 },
                    { scale: 1, duration: 0.4, ease: "back.out(1.5)" }
                );
            }
        } catch (err: any) {
            setMessage({
                type: "error",
                text: err?.message || "Failed to update profile. Please try again.",
            });
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || (loading && user)) {
        return (
            <div className="min-h-screen bg-ivory flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-black-main border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-bold tracking-widest uppercase text-gray-sec">
                        Loading Profile...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-ivory flex flex-col justify-between relative overflow-hidden">
            {/* Header */}
            <Navbar onNavigate={onNavigate} currentRoute="profile" />

            {/* Decorative Floating Pills */}
            <FloatingPill className="left-[5%] top-[18%] w-12 h-7 rotate-[-15deg] opacity-35" />
            <FloatingPill className="right-[6%] top-[22%] w-14 h-8 rotate-[20deg] opacity-30" />
            <FloatingPill className="left-[12%] bottom-[30%] w-9 h-5 rotate-[10deg] opacity-25 blur-[1px]" />
            <FloatingPill className="right-[10%] bottom-[25%] w-10 h-6 rotate-[-8deg] opacity-20" />

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
                {/* Background Typography Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.02] overflow-hidden -z-10">
                    <span className="text-[35vw] font-display font-black tracking-tighter leading-none">
                        PROFILE
                    </span>
                </div>

                <div className="w-full max-w-xl">
                    {/* Header */}
                    <div className="profile-fade-up text-center mb-10">
                        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-sec">
                            ACCOUNT SETTINGS
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-black-main mt-2">
                            YOUR PROFILE
                        </h1>
                        <p className="text-xs text-gray-sec mt-2 leading-relaxed max-w-md mx-auto">
                            Manage your personal details and account settings across Runner Space
                        </p>
                    </div>

                    {/* Profile Card */}
                    <div className="profile-card bg-card-bg border border-border-main rounded-2xl p-8 sm:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
                        {/* Avatar Header Badge */}
                        <div className="flex items-center gap-4 pb-8 mb-8 border-b border-border-main">
                            <div className="w-16 h-16 rounded-full bg-black-main text-ivory flex items-center justify-center text-xl font-display font-bold">
                                {fullName ? fullName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-black-main leading-tight">
                                    {fullName || "User Profile"}
                                </h2>
                                <p className="text-xs text-gray-sec mt-0.5">{email}</p>
                                <span className="inline-flex items-center gap-1 mt-2 text-[9px] font-bold tracking-wider uppercase text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                    <Shield className="w-2.5 h-2.5" /> Verified User
                                </span>
                            </div>
                        </div>

                        {/* Status Alert */}
                        {message && (
                            <div
                                className={`mb-6 p-4 rounded-xl flex items-center gap-3 border text-xs font-medium ${
                                    message.type === "success"
                                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                        : "bg-red-50 border-red-200 text-red-700"
                                }`}
                            >
                                {message.type === "success" ? (
                                    <Check className="w-4 h-4 shrink-0" />
                                ) : (
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                )}
                                <span>{message.text}</span>
                            </div>
                        )}

                        {/* Form */}
                        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
                            {/* Full Name Input */}
                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="profile-fullname"
                                    className="text-[10px] font-bold uppercase tracking-wider text-gray-sec"
                                >
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-sec/50" />
                                    <input
                                        id="profile-fullname"
                                        type="text"
                                        required
                                        placeholder="Your full name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-ivory border border-border-main rounded-md text-sm text-black-main placeholder-gray-sec/50 outline-none focus:border-black-main transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Email Input (Read-only) */}
                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="profile-email"
                                    className="text-[10px] font-bold uppercase tracking-wider text-gray-sec flex items-center justify-between"
                                >
                                    <span>Email Address</span>
                                    <span className="text-[9px] text-gray-sec/70 font-normal">Managed by Auth</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-sec/50" />
                                    <input
                                        id="profile-email"
                                        type="email"
                                        disabled
                                        value={email}
                                        className="w-full pl-10 pr-4 py-3 bg-ivory/60 border border-border-main/60 rounded-md text-sm text-gray-sec cursor-not-allowed outline-none"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 pt-4 border-t border-border-main">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    fullWidth
                                    disabled={saving}
                                    className="flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" /> Save Changes
                                        </>
                                    )}
                                </Button>

                                <button
                                    type="button"
                                    onClick={async () => {
                                        await signOut();
                                        onNavigate("login");
                                    }}
                                    className="w-full sm:w-auto px-6 py-4 text-[11px] font-bold tracking-widest uppercase rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Footer branding */}
                    <div className="text-center mt-8">
                        <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-sec/50">
                            Runner Space · User Account Management
                        </span>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer onNavigate={onNavigate} />
        </div>
    );
};

export default Profile;

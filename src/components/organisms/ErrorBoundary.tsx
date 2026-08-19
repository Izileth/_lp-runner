import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, ArrowDown, RefreshCcw } from 'lucide-react';
import Button from '../atoms/Button';
import FloatingPill from '../atoms/FloatingPill';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="relative min-h-screen bg-black-main flex flex-col overflow-hidden px-6 sm:px-10 py-8">
                    {/* Decorative floating pills, dimmed for dark background */}
                    <FloatingPill className="left-[6%] top-[14%] w-10 h-6 rotate-[-20deg] opacity-10" />
                    <FloatingPill className="right-[8%] top-[10%] w-14 h-8 rotate-[25deg] opacity-10" />
                    <FloatingPill className="right-[20%] bottom-[12%] w-8 h-5 rotate-[12deg] opacity-10" />

                    <div className="flex flex-col flex-1 animate-fade-in-up">
                        {/* Top bar */}
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-red-400/80">
                                <AlertTriangle className="w-4 h-4" />
                                Falha detectada
                            </span>

                            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-ivory/40">
                                ALGO DEU ERRADO
                            </span>
                        </div>

                        {/* Main content */}
                        <div className="flex-1 flex flex-col justify-center gap-10 sm:gap-14 py-16">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 sm:gap-10">
                                {/* Giant stacked headline */}
                                <div className="leading-[0.82] -ml-1">
                                    <div className="font-display font-black tracking-tighter text-ivory text-[22vw] sm:text-[13vw]">
                                        ERRO
                                    </div>
                                    <div className="font-display font-black tracking-tighter text-ivory text-[22vw] sm:text-[13vw]">
                                        OPS!
                                    </div>
                                </div>

                                {/* Aside message */}
                                <p className="font-display italic text-2xl sm:text-3xl text-ivory/80 max-w-xs pt-2 sm:pt-4">
                                    (encontramos uma{" "}
                                    <span className="not-italic font-black">
                                        falha inesperada
                                    </span>
                                    , nossa equipe já foi notificada)
                                </p>
                            </div>

                            {/* Technical details, styled as a dark console panel */}
                            {this.state.error && (
                                <div className="w-full max-w-lg bg-ivory/[0.04] border border-ivory/10 p-4 rounded-lg text-left overflow-auto max-h-32">
                                    <p className="text-[10px] font-mono font-bold tracking-widest uppercase text-red-400/80 mb-1">
                                        Detalhes técnicos
                                    </p>
                                    <p className="text-[11px] font-mono text-ivory/50 break-words">
                                        {this.state.error.message}
                                    </p>
                                </div>
                            )}

                            {/* Arrows pointing to the CTA */}
                            <div className="flex items-center gap-4 sm:gap-6 pl-1">
                                <ArrowDown className="w-6 h-6 sm:w-8 sm:h-8 text-ivory/50" />
                                <ArrowDown className="w-6 h-6 sm:w-8 sm:h-8 text-ivory/50" />
                                <ArrowDown className="w-6 h-6 sm:w-8 sm:h-8 text-ivory/50" />
                            </div>

                            {/* CTA */}
                            <div>
                                <Button
                                    onClick={this.handleReset}
                                    variant="secondary"
                                    className="flex items-center justify-center gap-2"
                                >
                                    <RefreshCcw className="w-4 h-4" />
                                    Tentar Novamente
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
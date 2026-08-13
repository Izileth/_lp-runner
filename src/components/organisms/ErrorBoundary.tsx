import  { Component } from 'react';
import type {ErrorInfo, ReactNode} from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
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
                <div className="relative min-h-screen bg-ivory flex flex-col items-center justify-center overflow-hidden px-6 py-12">
                    {/* Decorative floating pills */}
                    <FloatingPill className="left-[5%] top-[20%] w-10 h-6 rotate-[-20deg] opacity-40" />
                    <FloatingPill className="right-[8%] top-[15%] w-14 h-8 rotate-[25deg] opacity-30" />
                    
                    {/* Background Wordmark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.02] overflow-hidden -z-10">
                        <span className="text-[25vw] font-display font-black tracking-tighter leading-none text-red-900">
                            ERRO
                        </span>
                    </div>

                    {/* Error Card */}
                    <div className="w-full max-w-md z-10 animate-fade-in-up">
                        <div className="bg-card-bg border border-red-200 rounded-2xl p-8 sm:p-10 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
                            
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 border border-red-100">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>

                            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-red-500 mb-2">
                                ALGO DEU ERRADO
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-black-main">
                                Falha Inesperada
                            </h1>
                            <p className="text-sm text-gray-sec mt-4 leading-relaxed mb-6 max-w-xs">
                                Desculpe, encontramos um erro inesperado ao processar sua requisição. Nossa equipe foi notificada.
                            </p>
                            
                            {/* Technical Details (Collapsed by default in a real app, shown for prototyping) */}
                            {this.state.error && (
                                <div className="w-full bg-red-50 p-4 rounded-lg text-left mb-6 overflow-auto max-h-32 border border-red-100">
                                    <p className="text-xs font-mono text-red-800 font-semibold mb-1">Detalhes Técnicos:</p>
                                    <p className="text-[10px] font-mono text-red-600 break-words">
                                        {this.state.error.message}
                                    </p>
                                </div>
                            )}

                            <Button
                                onClick={this.handleReset}
                                variant="primary"
                                fullWidth
                                className="!bg-black-main flex items-center justify-center gap-2"
                            >
                                <RefreshCcw className="w-4 h-4" />
                                Tentar Novamente
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

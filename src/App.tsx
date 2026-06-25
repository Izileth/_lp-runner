import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sphereRef = useRef<HTMLDivElement>(null)
  const [animationState, setAnimationState] = useState('Idle')

  // GSAP animations on load
  useGSAP(
    () => {
      // Intro animations
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      
      tl.from('.animate-title', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
      })
      .from('.animate-fade', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.15,
      }, '-=0.6')
      .from('.animate-card', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.2)'
      }, '-=0.4')

      // Floating animation for the background glows
      gsap.to('.glow-1', {
        x: '+=30',
        y: '+=20',
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
      gsap.to('.glow-2', {
        x: '-=40',
        y: '+=30',
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    },
    { scope: containerRef }
  )

  // Interactive GSAP trigger
  const runInteractiveDemo = (type: string) => {
    if (!sphereRef.current) return
    setAnimationState(type)

    if (type === 'spin') {
      gsap.to(sphereRef.current, {
        rotation: '+=360',
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => setAnimationState('Idle')
      })
    } else if (type === 'bounce') {
      gsap.timeline()
        .to(sphereRef.current, {
          y: -50,
          scaleY: 0.85,
          duration: 0.3,
          ease: 'power1.out'
        })
        .to(sphereRef.current, {
          y: 0,
          scaleY: 1,
          duration: 0.5,
          ease: 'bounce.out',
          onComplete: () => setAnimationState('Idle')
        })
    } else if (type === 'pulse') {
      gsap.timeline()
        .to(sphereRef.current, {
          scale: 1.3,
          filter: 'drop-shadow(0 0 35px rgba(139, 92, 246, 0.9))',
          duration: 0.4,
          ease: 'power2.out'
        })
        .to(sphereRef.current, {
          scale: 1,
          filter: 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.4))',
          duration: 0.4,
          ease: 'power2.in',
          onComplete: () => setAnimationState('Idle')
        })
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden bg-dark text-slate-100 font-sans">
      
      {/* Cosmic background glows */}
      <div className="glow-1 absolute top-[10%] left-[10%] w-[35rem] h-[35rem] rounded-full bg-primary/20 blur-[120px] pointer-events-none -z-10" />
      <div className="glow-2 absolute bottom-[20%] right-[10%] w-[40rem] h-[40rem] rounded-full bg-secondary/10 blur-[130px] pointer-events-none -z-10" />

      {/* Header / Navbar */}
      <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-display font-extrabold text-white text-lg tracking-wider shadow-lg shadow-primary/20">
              LP
            </div>
            <span className="font-display font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              LP SPACE
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Recursos</a>
            <a href="#sandbox" className="hover:text-white transition-colors">Laboratório GSAP</a>
            <a href="#docs" className="hover:text-white transition-colors">Documentação</a>
          </nav>

          <a 
            href="#sandbox" 
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-medium text-sm flex items-center gap-2 hover:border-white/20 active:scale-95"
          >
            Testar Demo
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center flex flex-col items-center">
          
          <div className="animate-fade inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-xs font-semibold uppercase tracking-wider mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Tailwind CSS v4 & GSAP Configurados
          </div>

          <h1 className="animate-title font-display text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1] mb-6">
            Construa o Futuro com{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Interfaces Vivas
            </span>
          </h1>

          <p className="animate-title text-lg md:text-xl text-slate-400 max-w-2xl font-light leading-relaxed mb-12">
            A união perfeita do poder do <strong>React 19</strong>, da elegância e velocidade do <strong>Tailwind CSS v4</strong> e a fluidez inigualável das animações do <strong>GSAP</strong>.
          </p>

          <div className="animate-fade flex flex-wrap justify-center gap-4 mb-24">
            <a 
              href="#sandbox" 
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-base shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Iniciar Experimento
            </a>
            <a 
              href="#features" 
              className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-semibold text-base text-white"
            >
              Saiba Mais
            </a>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-16 border-t border-white/10">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Arquitetura de Alto Padrão</h2>
            <p className="text-slate-400 max-w-lg mx-auto">Tudo o que você precisa configurado de forma otimizada para máxima produtividade.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Tailwind Card */}
            <div className="animate-card p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-primary/30 transition-all hover:bg-white/[0.04] group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold mb-3">Tailwind v4</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Nova engine CSS-first super otimizada. Customização nativa via CSS variáveis sem a necessidade de arquivos adicionais de configuração.
              </p>
            </div>

            {/* GSAP Card */}
            <div className="animate-card p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-secondary/30 transition-all hover:bg-white/[0.04] group">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold mb-3">GSAP & React Hooks</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Integração perfeita usando `@gsap/react`. Use hooks inteligentes para gerenciar e animar elementos sem vazamento de memória ou inconsistências.
              </p>
            </div>

            {/* Project Cleaned Card */}
            <div className="animate-card p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all hover:bg-white/[0.04] group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold mb-3">Projeto Limpo</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Foram removidos todos os arquivos e estilos padrão desnecessários do boilerplate. Estrutura pronta para você começar a criar seu próprio código.
              </p>
            </div>

          </div>
        </section>

        {/* GSAP Sandbox Section */}
        <section id="sandbox" className="py-20 border-t border-white/10">
          <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 p-8 md:p-12 relative">
            <div className="absolute top-4 right-4 text-xs font-mono text-slate-500 bg-white/5 px-2.5 py-1 rounded-md">
              GSAP Sandbox v1.0
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-display text-3xl font-bold mb-4">Laboratório Interativo</h2>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Interaja com os controles abaixo para ver o GSAP gerenciando animações em tempo real com alta performance física e renderização acelerada.
                </p>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => runInteractiveDemo('spin')} 
                    className="w-full text-left px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-between group"
                  >
                    <span className="font-medium text-sm">Girar Elemento</span>
                    <span className="text-xs text-primary group-hover:translate-x-1 transition-transform">Executar →</span>
                  </button>
                  <button 
                    onClick={() => runInteractiveDemo('bounce')} 
                    className="w-full text-left px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-between group"
                  >
                    <span className="font-medium text-sm">Efeito Bounce (Gravidade)</span>
                    <span className="text-xs text-primary group-hover:translate-x-1 transition-transform">Executar →</span>
                  </button>
                  <button 
                    onClick={() => runInteractiveDemo('pulse')} 
                    className="w-full text-left px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-between group"
                  >
                    <span className="font-medium text-sm">Super Glow & Escala</span>
                    <span className="text-xs text-primary group-hover:translate-x-1 transition-transform">Executar →</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-8 bg-white/[0.01] border border-white/5 rounded-2xl min-h-[300px] relative overflow-hidden">
                {/* Sphere container */}
                <div 
                  ref={sphereRef}
                  className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-secondary shadow-lg flex items-center justify-center cursor-pointer select-none transition-shadow"
                  style={{ filter: 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.4))' }}
                  onClick={() => runInteractiveDemo('pulse')}
                >
                  <div className="w-24 h-24 rounded-full bg-dark/60 backdrop-blur-sm flex items-center justify-center">
                    <span className="font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-2xl tracking-widest animate-pulse">
                      AGY
                    </span>
                  </div>
                </div>
                
                <div className="mt-8 text-xs font-mono text-slate-400">
                  Estado: <span className="text-primary font-bold">{animationState}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-sm text-slate-500 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-display font-semibold text-slate-300">LP SPACE</span>
            <span className="text-slate-600">|</span>
            <span>Feito sob medida por Antigravity</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition-colors">GitHub</a>
            <a href="https://tailwindcss.com" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition-colors">Tailwind CSS</a>
            <a href="https://gsap.com" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition-colors">GSAP</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

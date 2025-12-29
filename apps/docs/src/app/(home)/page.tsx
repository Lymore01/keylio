import { CheckCircle, Github, Infinity } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-200 selection:bg-cyan-100 dark:selection:bg-cyan-900 transition-colors duration-300 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:96px_96px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent" />
        <div className="absolute top-[20%] left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      </div>

      <main className="relative z-10">
        <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 tracking-tight text-slate-900 dark:text-white">
            Modern authentication without the complexity
          </h1>

          <p className="text-base md:text-xl text-center text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Keylio provides a simple, secure, and type-safe authentication
            solution for Node.js applications.
          </p>

          <div className="flex flex-col items-center gap-8 mt-10">
            <div className="flex items-center gap-4">
              <Link
                href="/docs"
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-md font-medium transition-transform hover:scale-102 active:scale-95"
              >
                <span>Get Started</span>
              </Link>
              <div className="flex items-center gap-4 px-4">
                <a
                  href="https://github.com/lymore01/keylio"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a
                  href="https://www.npmjs.com/package/keylio"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-[#CB3837] transition-colors"
                >
                  <NpmIcon />
                </a>
              </div>
            </div>

            <div className="relative group cursor-text">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/50 to-blue-500/50 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500" />
              <div className="relative flex items-center gap-4 px-8 py-4 bg-slate-950 rounded-lg font-mono text-sm text-slate-300 border border-slate-800 shadow-2xl">
                <div className="flex gap-1.5 opacity-50">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <div className="w-px h-4 bg-slate-800 mx-2" />
                <div className="flex items-center gap-2">
                  <span className="text-cyan-500">❯</span>
                  <span className="text-slate-100">
                    npm install keylio@beta
                  </span>
                  <span className="w-2 h-4 bg-cyan-500/50 animate-pulse ml-1" />
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto my-20">
            <div className="relative group">
              <div className="absolute -inset-1 bg-cyan-500 rounded-2xl blur opacity-20 dark:opacity-10 group-hover:opacity-30 dark:group-hover:opacity-20 transition duration-1000" />
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden shadow-2xl text-slate-200">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-700" />
                    <div className="w-3 h-3 rounded-full bg-slate-700" />
                    <div className="w-3 h-3 rounded-full bg-slate-700" />
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    utils/auth.ts
                  </span>
                </div>
                <pre className="text-sm font-mono leading-relaxed overflow-x-auto">
                  <code>
                    <span className="text-purple-400">import</span>{" "}
                    <span className="text-yellow-200">{`{ prisma }`}</span>{" "}
                    <span className="text-purple-400">from</span>{" "}
                    <span className="text-green-400">"@/lib/prisma"</span>;
                    {"\n"}
                    <span className="text-purple-400">import</span>{" "}
                    <span className="text-yellow-200">{`{ Keylio }`}</span>{" "}
                    <span className="text-purple-400">from</span>{" "}
                    <span className="text-green-400">"keylio"</span>;{"\n"}
                    <span className="text-purple-400">import</span>{" "}
                    <span className="text-yellow-200">{`{ prismaAdapter }`}</span>{" "}
                    <span className="text-purple-400">from</span>{" "}
                    <span className="text-green-400">
                      "keylio/adapters/prisma"
                    </span>
                    ;{"\n\n"}
                    <span className="text-purple-400">const</span>{" "}
                    <span className="text-blue-400">keylio</span>{" "}
                    <span className="text-purple-400">=</span>{" "}
                    <span className="text-purple-400">new</span>{" "}
                    <span className="text-yellow-200">Keylio</span>({`{`}
                    {"\n"}
                    {"  "}adapter:{" "}
                    <span className="text-blue-300">prismaAdapter</span>
                    (prisma),{"\n"}
                    {"  "}session: {`{`}
                    {"\n"}
                    {"    "}secret:{" "}
                    <span className="text-blue-300">process</span>.
                    <span className="text-blue-300">env</span>.AUTH_SECRET,
                    {"\n"}
                    {"  "}
                    {`}`},{"\n"}
                    {`}`});
                  </code>
                </pre>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 mb-20 text-slate-600 dark:text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-cyan-500" />
              <span>Type-Safe (Trust me bro)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-cyan-500" />
              <span>Well-tested</span>
            </div>
            <div className="flex items-center gap-2">
              <Infinity className="w-5 h-5 text-cyan-500" />
              <span>Caffeine Consumed</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 mb-16">
            <Link
              className="relative group"
              href="https://github.com/lymore01"
              target="_blank"
              rel="noreferrer"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500" />
              <img
                src="https://github.com/lymore01.png"
                alt="Creator"
                className="relative w-14 h-14 rounded-full border-2 border-white dark:border-slate-900 shadow-xl"
              />
              <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-[10px] text-white px-1.5 py-0.5 rounded-full border-2 border-white dark:border-slate-900 font-bold">
                DEV
              </div>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center max-w-xs leading-relaxed">
              Forged by{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                Lymore
              </span>
              <br />
              <span className="text-xs opacity-75 italic">
                "I write bugs so you don't have to."
              </span>
            </p>
          </div>

          <footer className="text-center pt-16 pb-12 border-t border-slate-200 dark:border-zinc-800/50">
            <div className="max-w-2xl mx-auto space-y-4">
              <p className="text-slate-500 dark:text-zinc-400 text-sm italic">
                "Built with blood, sweat, and several dozen 'final_final_v2'
                commits."
              </p>

              <div className="text-[10px] text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em] leading-relaxed">
                <p>
                  Disclaimer: Keylio is not responsible for any productivity
                  spikes, improved sleep quality, or the sudden urge to delete
                  your old auth boilerplates.
                </p>
                <p className="mt-2">
                  If you find a bug, it&apos;s actually an undocumented feature.
                  Please report it anyway.
                </p>
              </div>

              <div className="flex justify-center gap-6 pt-6 text-slate-500 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-white transition-colors">
                <span className="text-xs">MIT Licensed</span>
                <span className="text-xs">•</span>
                <span className="text-xs">No Trackers</span>
                <span className="text-xs">•</span>
                <span className="text-xs">Zero Bloat</span>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

function NpmIcon() {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" className="w-6 h-6">
      <path d="M0 0v256h256V0H0zm64 224H32V32h128v192h-32V64H96v160H64v-32z" />
    </svg>
  );
}

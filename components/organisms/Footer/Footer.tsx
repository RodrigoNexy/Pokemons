'use client'

export function Footer() {
    return (
        <footer className="bg-pokedex-red border-t-4 border-pokedex-red-dark shadow-2xl relative overflow-hidden mt-auto">
            <div className="absolute top-0 left-0 right-0 h-1 bg-pokedex-red-dark shadow-inner"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-row items-center justify-center gap-8 md:gap-16">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-900 rounded-full border-4 border-gray-700 shadow-lg hover:border-gray-600 transition-colors flex-shrink-0"></div>

                    <div className="flex flex-col items-center gap-2 md:gap-3 flex-1 max-w-xs">
                        <div className="flex gap-2 md:gap-3">
                            <div className="w-10 h-5 md:w-12 md:h-6 bg-blue-600 rounded border-2 border-blue-500 shadow-inner"></div>
                            <div className="w-10 h-5 md:w-12 md:h-6 bg-blue-400 rounded border-2 border-blue-300 shadow-inner"></div>
                        </div>
                        <div className="w-full max-w-28 md:max-w-32 h-16 md:h-20 bg-green-500 rounded-lg border-4 border-white shadow-lg flex items-center justify-center">
                            <div className="w-20 h-10 md:w-24 md:h-14 bg-green-400 rounded border-2 border-white/50"></div>
                        </div>
                    </div>

                    <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
                        <div className="absolute inset-0 bg-gray-900 rounded-lg border-4 border-gray-700 shadow-inner"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-8 md:w-2.5 md:h-10 bg-gray-700 rounded-full"></div>
                            <div className="absolute w-8 h-2 md:w-10 md:h-2.5 bg-gray-700 rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center border-t border-white/20 pt-4">
                    <p className="font-mono text-xs text-white/80">
                        Vai dar tudo certo!
                    </p>
                </div>
            </div>
        </footer>
    )
}

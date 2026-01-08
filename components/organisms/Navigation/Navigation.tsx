'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/atoms'
import { ROUTES } from '@/lib/constants/routes'

export function Navigation() {
  const { isAuthenticated, user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <>
      <nav className="bg-pokedex-red border-b-4 border-pokedex-red-dark shadow-2xl relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-8">
              <Link
                href={ROUTES.HOME}
                className="font-mono font-bold text-2xl text-white hover:text-yellow-200 transition-colors flex items-center gap-3 group"
                onClick={closeMenu}
              >
                <div className="w-12 h-12 bg-blue-400 rounded-full border-4 border-white shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                </div>
                <div className="flex gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-lg shadow-green-500/50"></div>
                  <div className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-white shadow-lg shadow-yellow-400/50"></div>
                  <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-lg shadow-red-500/50"></div>
                </div>
              </Link>

              {isAuthenticated && (
                <div className="hidden md:flex items-center gap-4 ml-4">
                  <Link
                    href={ROUTES.POKEDEX}
                    className="font-mono font-bold text-white hover:text-yellow-200 transition-all px-4 py-2 rounded-lg hover:bg-pokedex-red-dark/60 border-2 border-transparent hover:border-white/30"
                  >
                    POKÉMONS
                  </Link>
                  <Link
                    href={ROUTES.FAVORITES}
                    className="font-mono font-bold text-white hover:text-yellow-200 transition-all px-4 py-2 rounded-lg hover:bg-pokedex-red-dark/60 border-2 border-transparent hover:border-white/30"
                  >
                    FAVORITOS
                  </Link>
                  <Link
                    href={ROUTES.BATTLE}
                    className="font-mono font-bold text-white hover:text-yellow-200 transition-all px-4 py-2 rounded-lg hover:bg-pokedex-red-dark/60 border-2 border-transparent hover:border-white/30"
                  >
                    LUTA
                  </Link>
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <div className="bg-white/25 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-white/40 shadow-inner">
                    <span className="font-mono font-bold text-sm text-white drop-shadow-md">
                      {user?.name || user?.email}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="font-mono font-bold uppercase text-sm px-4 py-2 bg-white text-pokedex-red hover:bg-yellow-200 border-2 border-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    SAIR
                  </button>
                </>
              ) : (
                <>
                  <Link href={ROUTES.LOGIN}>
                    <button className="font-mono font-bold uppercase text-sm px-4 py-2 bg-white/20 text-white border-2 border-white/50 hover:bg-white/30 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                      ENTRAR
                    </button>
                  </Link>
                  <Link href={ROUTES.REGISTER}>
                    <button className="font-mono font-bold uppercase text-sm px-4 py-2 bg-white text-pokedex-red hover:bg-yellow-200 border-2 border-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                      CADASTRAR
                    </button>
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2 text-white hover:text-yellow-200 transition-colors z-30"
              aria-label="Menu"
            >
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-pokedex-red-dark shadow-inner"></div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={closeMenu}
            ></motion.div>

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 bg-pokedex-red border-l-4 border-pokedex-red-dark shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-mono font-bold text-2xl text-white drop-shadow-lg">MENU</h2>
                  <button
                    onClick={closeMenu}
                    className="w-10 h-10 flex items-center justify-center text-white hover:text-yellow-200 transition-colors"
                    aria-label="Fechar menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {isAuthenticated && (
                  <div className="space-y-4">
                    <Link
                      href={ROUTES.POKEDEX}
                      onClick={closeMenu}
                      className="block font-mono font-bold text-white hover:text-yellow-200 transition-all px-4 py-3 rounded-lg hover:bg-pokedex-red-dark/60 border-2 border-transparent hover:border-white/30"
                    >
                      POKÉMONS
                    </Link>
                    <Link
                      href={ROUTES.FAVORITES}
                      onClick={closeMenu}
                      className="block font-mono font-bold text-white hover:text-yellow-200 transition-all px-4 py-3 rounded-lg hover:bg-pokedex-red-dark/60 border-2 border-transparent hover:border-white/30"
                    >
                      FAVORITOS
                    </Link>
                    <Link
                      href={ROUTES.BATTLE}
                      onClick={closeMenu}
                      className="block font-mono font-bold text-white hover:text-yellow-200 transition-all px-4 py-3 rounded-lg hover:bg-pokedex-red-dark/60 border-2 border-transparent hover:border-white/30"
                    >
                      LUTA
                    </Link>
                  </div>
                )}

                {isAuthenticated ? (
                  <div className="pt-6 border-t-2 border-white/30 space-y-4">
                    <div className="bg-white/25 backdrop-blur-sm px-4 py-3 rounded-lg border-2 border-white/40 shadow-inner">
                      <p className="font-mono font-bold text-sm text-white drop-shadow-md mb-1">USUÁRIO</p>
                      <span className="font-mono text-sm text-white">
                        {user?.name || user?.email}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        closeMenu()
                        logout()
                      }}
                      className="w-full font-mono font-bold uppercase text-sm px-4 py-3 bg-white text-pokedex-red hover:bg-yellow-200 border-2 border-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      SAIR
                    </button>
                  </div>
                ) : (
                  <div className="pt-6 border-t-2 border-white/30 space-y-4">
                    <Link href={ROUTES.LOGIN} onClick={closeMenu}>
                      <button className="w-full font-mono font-bold uppercase text-sm px-4 py-3 bg-white/20 text-white border-2 border-white/50 hover:bg-white/30 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                        ENTRAR
                      </button>
                    </Link>
                    <Link href={ROUTES.REGISTER} onClick={closeMenu}>
                      <button className="w-full font-mono font-bold uppercase text-sm px-4 py-3 bg-white text-pokedex-red hover:bg-yellow-200 border-2 border-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                        CADASTRAR
                      </button>
                    </Link>
                  </div>
                )}

                <div className="pt-6 border-t-2 border-white/30 flex justify-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-lg"></div>
                  <div className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-white shadow-lg"></div>
                  <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-lg"></div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

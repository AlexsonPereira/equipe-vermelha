import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

// Folha que sobe de baixo no celular e vira um diálogo centralizado em telas maiores.
export default function FolhaAcao({ aberta, titulo, onFechar, children }) {
  return (
    <AnimatePresence>
      {aberta && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onFechar}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={titulo}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full sm:max-w-md bg-surface-dark border-t sm:border border-white/10 rounded-t-3xl sm:rounded-2xl px-5 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="w-10 h-1.5 bg-white/20 rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex items-start justify-between gap-4 mb-4">
              <h2 className="text-xl font-bold text-white">{titulo}</h2>
              <button
                onClick={onFechar}
                aria-label="Fechar"
                className="w-10 h-10 -mr-2 -mt-1 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

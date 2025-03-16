"use client"

import { motion } from "framer-motion"
import { Brain, Skull, Clock } from "lucide-react"

interface RoomDifficultyProps {
  difficulty: number
}

export function RoomDifficulty({ difficulty }: RoomDifficultyProps) {
  // Calcular valores para cada categoría basados en la dificultad
  const mental = Math.min(5, Math.max(1, difficulty + (Math.random() > 0.5 ? 0 : 1)))
  const physical = Math.min(5, Math.max(1, difficulty - (Math.random() > 0.5 ? 1 : 0)))
  const fear = Math.min(5, Math.max(1, difficulty + (Math.random() > 0.5 ? 1 : 0)))

  const categories = [
    { name: "Dificultad Mental", value: mental, icon: <Brain className="h-5 w-5 text-brand-gold" /> },
    { name: "Dificultad Física", value: physical, icon: <Clock className="h-5 w-5 text-brand-gold" /> },
    { name: "Factor Miedo", value: fear, icon: <Skull className="h-5 w-5 text-brand-gold" /> },
  ]

  return (
    <div className="bg-brand-dark/60 backdrop-blur-sm border border-brand-gold/20 rounded-lg p-4 horror-card">
      <h3 className="text-lg font-bold mb-3">Nivel de Dificultad</h3>

      <div className="space-y-4">
        {categories.map((category, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {category.icon}
                <span className="ml-2 text-sm text-gray-300">{category.name}</span>
              </div>
              <span className="text-xs text-brand-gold">{category.value}/5</span>
            </div>

            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-brand-gold"
                initial={{ width: 0 }}
                animate={{ width: `${(category.value / 5) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-400">
          Tasa de escape: <span className="text-brand-gold font-bold">{100 - difficulty * 12}%</span>
        </p>
      </div>
    </div>
  )
}


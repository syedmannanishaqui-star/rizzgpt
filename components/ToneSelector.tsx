'use client'

interface ToneSelectorProps {
  selectedTone: string
  onToneChange: (tone: string) => void
}

const tones = [
  {
    id: 'subtle',
    name: 'Subtle',
    emoji: '😊',
    description: 'Friendly and light',
    color: 'from-blue-400 to-blue-600'
  },
  {
    id: 'moderate',
    name: 'Moderate',
    emoji: '😏',
    description: 'Playful and confident',
    color: 'from-purple-400 to-purple-600'
  },
  {
    id: 'bold',
    name: 'Bold',
    emoji: '😎',
    description: 'Direct and flirty',
    color: 'from-pink-400 to-pink-600'
  },
  {
    id: 'very-bold',
    name: 'Very Bold',
    emoji: '🔥',
    description: 'Maximum rizz',
    color: 'from-red-400 to-red-600'
  }
]

export default function ToneSelector({ selectedTone, onToneChange }: ToneSelectorProps) {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Vibe</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tones.map((tone) => (
          <button
            key={tone.id}
            onClick={() => onToneChange(tone.id)}
            className={`relative p-4 rounded-xl border-2 transition-all ${
              selectedTone === tone.id
                ? 'border-pink-500 shadow-lg scale-105'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">{tone.emoji}</div>
              <div className="font-semibold text-gray-900">{tone.name}</div>
              <div className="text-xs text-gray-500 mt-1">{tone.description}</div>
            </div>
            {selectedTone === tone.id && (
              <div className={`absolute inset-0 bg-gradient-to-r ${tone.color} opacity-10 rounded-xl`}></div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export const relations = ['Partner', 'Friend', 'Family', 'Colleague', 'Other']

export const moments = {
  self: [
    'A fresh start or new chapter',
    'Celebrating a personal milestone',
    'Finding calm & inner balance',
    'A birthday celebration',
    'A meaningful daily ritual',
  ],
  other: [
    'Birthday celebration',
    'Wedding or anniversary',
    'Career milestone or new venture',
    'New home or housewarming',
    'Just because & gratitude',
  ],
}

export const intentions = [
  { id: 'love-connection', name: 'Love & Connection', note: 'Warmth, affection, and deepening intimate bonds' },
  { id: 'confidence-power', name: 'Career & Confidence', note: 'Ambition, clarity, and bold self-trust' },
  { id: 'vitality-balance', name: 'Peace & Inner Balance', note: 'Grounding calm and mindful stillness' },
  { id: 'wealth-prosperity', name: 'Abundance & Good Fortune', note: 'Fruitful progress, prosperity, and discerning growth' },
]

export const questions = self => [
  'Who are we choosing for?',
  self ? 'What may I call you?' : 'What may I call them?',
  self ? 'What moment are we celebrating?' : 'What occasion are we celebrating?',
  'What feeling would you like this gift to carry?',
  'Shall we look at your astrological chart?',
]

export const prefaces = [
  'Every thoughtful gift begins with someone.',
  'A name makes this reading personal.',
  'Tell me a little about the moment.',
  'Choose the intention behind your gift.',
  'Birth details are completely optional.',
]

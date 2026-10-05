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
  { id: 'love-connection', name: 'Love & Connection', note: 'Affection and closeness' },
  { id: 'confidence-power', name: 'Career & Confidence', note: 'Clarity and self-belief' },
  { id: 'vitality-balance', name: 'Peace & Inner Balance', note: 'Calm and grounding' },
  { id: 'wealth-prosperity', name: 'Abundance & Good Fortune', note: 'Growth and possibility' },
]

export const questions = self => [
  'Who are we choosing for?',
  self ? 'What may I call you?' : 'What may I call them?',
  self ? 'What moment are we celebrating?' : 'What occasion are we celebrating?',
  'What feeling would you like this gift to carry?',
  self ? 'Shall we make it more personal?' : 'Shall we make their gift more personal?',
]

export const prefaces = [
  'Every thoughtful gift begins with someone.',
  'Let’s put a name to this chapter.',
  'Tell me a little about the moment.',
  'Choose the intention behind your gift.',
  'Birth details are completely optional.',
]

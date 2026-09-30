export const relations = ['Partner', 'Parent', 'Sibling', 'Friend', 'Colleague', 'Extended family', 'Other']
export const moments = {
  self: ['Starting something new', 'Building something meaningful', 'Growing what matters', 'Finding my balance', 'Exploring what is next'],
  other: ['A new beginning', 'A milestone', 'A bond', 'A new journey', 'Just them'],
}
export const intentions = [
  { id: 'love-connection', name: 'A deeper connection', note: 'Care, gratitude and bonds that last' },
  { id: 'confidence-power', name: 'Quiet confidence', note: 'Courage, direction and presence' },
  { id: 'vitality-balance', name: 'A gentler rhythm', note: 'Renewal, balance and room to breathe' },
  { id: 'wealth-prosperity', name: 'Room to flourish', note: 'Growth, possibility and purposeful progress' },
]
export const questions = self => [
  'Who are we choosing for?', self ? 'What may I call you?' : 'What may I call them?',
  self ? 'What is unfolding for you?' : 'What moment are we celebrating?',
  'What would you like this gift to carry?', 'Shall we make it a little more personal?',
]
export const prefaces = [
  'Every thoughtful gift begins with someone.', 'A name makes this conversation yours.',
  'Tell me a little about the moment.', 'Let the meaning lead the way.', 'Only what you feel comfortable sharing.',
]

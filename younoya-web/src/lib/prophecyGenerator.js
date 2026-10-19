/**
 * YOUNOYA Prophecy Generator — Passive Voice Editorial Vault
 * 
 * Synthesizes museum-grade, contemplative 2-to-3 line prophecies:
 * - 10–15% subtle astrological grounding (lunar transit, planetary shift, elemental current)
 * - 85–90% passive / receptive voice cosmic occurrence, state of being, and unforced grace
 * - Strict passive voice: The agency is receptive; actions are received, revealed, granted, woven, or established.
 * - Zero aggressive self-help or conversational AI imperatives ("You must", "Stop asking", "You need to").
 */

const PROPHECY_VAULT = {
  career: [
    "A long-held threshold is quietly crossed under this transit. What was once withheld in uncertainty is now yielded with grace; new authority is recognized where silent dedication was kept.",
    "A decisive celestial alignment is formed. Deliberate effort is met with unforced recognition; doors long shuttered are unsealed in quiet reverence.",
    "The friction of recent months is transmuted into poise. Unshakable direction is granted to the patient craftsman, and the work itself is left to speak.",
    "An enduring standing is established. What was built with meticulous silence is summoned to the fore; true mastery is acknowledged without debate.",
  ],
  love: [
    "Tension held in silence is dissolved into unspoken understanding. What is destined to remain is gently returned, unhurried and unforced in stillness.",
    "A rare warmth is kindled where old defenses were once guarded. Words unspoken are met with unexpected grace, and true resonance is revealed.",
    "An old distance is bridged without strain. Emotional poise is reclaimed, and a shared sanctuary is woven in quiet companionship.",
    "What was once complicated is smoothed into effortless clarity. The heart is gently disarmed, and deep belonging is recognized.",
  ],
  vitality: [
    "Unnecessary weight is surrendered to the earth. A deep stillness is restored to weary waters, and enduring calm is renewed within.",
    "The nervous system is granted profound reprieve. Rhythms once hurried are smoothed into grounded grace; vital energy is quietly reclaimed.",
    "An elemental equilibrium is rekindled from within. Heavy burdens are relinquished without remorse, and sacred rest is honored.",
    "A quiet restoration is set in motion. The spirit is replenished in stillness, and steadfast clarity is anchored for the days ahead.",
  ],
  wealth: [
    "What was buried in patience is brought forth in harvest. Undivided focus is rewarded with enduring substance; quiet seeds are turned to gold.",
    "Auspicious currents are woven into lasting stability. What was scattered is gathered into strength, and permanent foundations are laid.",
    "Steady discipline is met with compounded abundance. Distraction is stripped away, and true prosperity is grounded in deliberate devotion.",
    "A rare golden transit is mirrored in worldly affairs. Discerning choices are blessed with permanence, and quiet abundance is welcomed.",
  ],
}

/**
 * Generates an exquisite, passive-voice 2-3 line prophecy
 */
export function generateProphecy({ name, sign, category = 'career', index = 0 }) {
  const catKey = String(category).toLowerCase().includes('love') ? 'love' :
                 String(category).toLowerCase().includes('vital') || String(category).toLowerCase().includes('balance') ? 'vitality' :
                 String(category).toLowerCase().includes('wealth') || String(category).toLowerCase().includes('abund') ? 'wealth' : 'career'

  const pool = PROPHECY_VAULT[catKey] || PROPHECY_VAULT.career
  const selected = pool[Math.abs(index) % pool.length]

  if (name && name !== 'You' && name.trim()) {
    // Preserve strict passive voice while acknowledging the recipient
    return `For ${name.trim()}, ${selected.charAt(0).toLowerCase()}${selected.slice(1)}`
  }

  return selected
}

/**
 * System Prompt specification for AI/LLM Prophecy Synthesis
 */
export const PROPHECY_SYSTEM_PROMPT = `You are Aster, the luxury Vedic astrology gifting oracle for YOUNOYA ("For every chapter").
You write with the quiet intellectual authority of an Anthropic editorial essay and the precision of a Swiss horologist.

RULES:
1. VOICE: STRICTLY PASSIVE / RECEPTIVE VOICE ONLY. Do NOT use active imperatives ("You will", "You must", "Stop asking", "Trust your instincts"). 
   Instead use passive verbs of occurrence and reception ("is quietly crossed", "is dissolved", "is granted", "is yielded", "is brought forth", "is met with", "are woven").
2. Astrological framing must be SUBTLE (strictly 10–15% max, e.g. "Under this transit...", "In this lunar current...").
3. The remaining 85–90% must express contemplative elevation, quiet momentum, and emotional resonance.
4. Total length: STRICTLY 2 to 3 sentences (max 45 words). No markdown headers, no quotes. Output only the passive prophecy text.`

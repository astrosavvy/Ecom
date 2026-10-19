/**
 * YOUNOYA Prophecy Generator
 * Synthesizes high-voltage 2-to-3 line prophecies:
 * - 10–15% subtle astrological framing (lunar transit, planetary shift, elemental current)
 * - 85–90% thrilling personal future, day momentum, electric resonance, and emotional power
 * Designed to mesmerize readers into sharing on Instagram Stories and WhatsApp.
 */

const PROPHECY_VAULT = {
  career: [
    "Under your celestial transit, a quiet shift is clearing your path. What felt delayed was merely gathering force—trust your instincts over haste. Your season of effortless authority begins now.",
    "A decisive alignment is taking shape around you. Stop asking for permission to occupy the room you were built to lead. The doors opening this week won't close.",
    "The friction you felt recently wasn't resistance; it was recalibration. Your clarity is sharp, your direction is undisputed, and your next move will speak for itself.",
  ],
  love: [
    "Your current lunar cycle softens old defenses and invites profound truth. You don't need to chase what is meant to find you in stillness. Expect an unspoken understanding to bridge an old distance.",
    "A rare warmth surrounds your heart this season. The conversations you’ve been hesitant to have will be met with unexpected grace. Prepare to be truly seen.",
    "Your emotional frequency is shifting into quiet magnetic poise. What was once complicated is about to become effortlessly gentle and clear.",
  ],
  vitality: [
    "An elemental reset is taking hold of your days. You are letting go of burdens you were never asked to carry. Energy and calm are returning to you in equal measure.",
    "Your nervous system is finally exhaling. The quiet choices you make this week will ripple into months of sustained vitality and unshakeable peace.",
    "A grounded alignment is restoring your inner fire. Trust the slower rhythm—it is building the foundation for your most energized chapter yet.",
  ],
  wealth: [
    "Your planetary current is locking into auspicious alignment. The seeds you planted with quiet patience are about to break the surface. Auspicious momentum is on your side.",
    "A season of compounding returns is beginning. What felt like slow progress was deep rooting—now comes the undeniable harvest.",
    "A rare golden transit surrounds your ventures. Trust your discernment, eliminate the noise, and prepare to welcome enduring abundance.",
  ],
}

/**
 * Generates an electric, personalized 2-3 line prophecy
 */
export function generateProphecy({ name, sign, category = 'career', index = 0 }) {
  const catKey = String(category).toLowerCase().includes('love') ? 'love' :
                 String(category).toLowerCase().includes('vital') || String(category).toLowerCase().includes('balance') ? 'vitality' :
                 String(category).toLowerCase().includes('wealth') || String(category).toLowerCase().includes('abund') ? 'wealth' : 'career'

  const pool = PROPHECY_VAULT[catKey] || PROPHECY_VAULT.career
  const selected = pool[Math.abs(index) % pool.length]

  if (name && name !== 'You' && name.trim()) {
    // Gracefully personalize while maintaining poetic rhythm
    return selected.replace(/^Under your celestial transit/i, `Under ${name}'s celestial transit`)
                   .replace(/^A decisive alignment/i, `For ${name}, a decisive alignment`)
                   .replace(/^An elemental reset/i, `For ${name}, an elemental reset`)
  }

  return selected
}

/**
 * System Prompt specification for AI/LLM Prophecy Synthesis
 * Can be used by backend endpoints or edge functions
 */
export const PROPHECY_SYSTEM_PROMPT = `You are Aster, the luxury Vedic astrology gifting oracle for YOUNOYA ("For every chapter").
You combine Cartier-grade poise, quiet warmth, and electric experiential insight.
Synthesize a mesmerizing 2-to-3 sentence personal prophecy for the recipient.

RULES:
1. Astrological framing must be SUBTLE (strictly 10–15% max, e.g. "Under your current lunar transit...", "With your elemental fire grounding...").
2. The remaining 85–90% must be ELECTRIC, THRILLING, and FOCUS ON THEIR IMMEDIATE FUTURE, DAY MOMENTUM, and PERSONAL RESILIENCE.
3. Make it deeply emotional and addictive to share on Instagram and WhatsApp.
4. Total length: STRICTLY 2 to 3 sentences (max 45 words). No markdown headers, no quotes. Output only the prophecy.`

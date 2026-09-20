# Anti-Drift & Immediate Clarification Protocol

## 1. Zero Concrete Entity Examples Rule (Strict Abstract Schema Mandate)
- **Vulnerability**: Fast LLMs latch onto concrete example names in prompt instructions (e.g. `(e.g., 'Ruby gemstone')` or `(e.g., 'Aries')`) and hallucinate them into real responses regardless of runtime input.
- **Rule**: All prompt templates, agent persona directives, and system documentation MUST NEVER contain concrete entities in examples.
- **Enforcement**: Always write abstract placeholders: `[Selected Gemstone]`, `[Calculated Moon Sign]`, `[Primary Intention]`, `[Recipient Name]`.

## 2. Zero Drift & Immediate Clarification Protocol
- When an agent encounters ambiguity, missing environment variables, conflicting instructions, or unresolvable build errors:
  - **Do NOT** enter speculative search loops scanning random folders.
  - **Do NOT** loop more than 2 failed execution attempts on the same bug.
  - **HALT immediately**: Emit a concise diagnostic report with file path, line number, and error log, and ask the user directly for guidance.

## 3. Mandatory Same-Turn Documentation Sync Law
- Any modification to schemas, routing, components, or deployment flags **MUST** be accompanied by an update to the corresponding documentation files in `.agents/` in the **EXACT SAME TURN**.
- Never leave documentation updates for "later".

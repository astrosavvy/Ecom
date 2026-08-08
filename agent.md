# YOUNOYA Agent Execution Guidelines

## Core Rules for Agent Behavior

1. **User Edit Approval First**:
   - For any edit or feature requested by the user, ALWAYS perform research first, write an `implementation_plan.md` artifact, and **STOP to wait for explicit user approval** before executing code changes.

2. **2-Step Error Loop Limit**:
   - Do NOT get stuck in long debugging or build trial loops.
   - If an issue is not resolved after **2 execution steps**, STOP immediately, create a clear diagnostic report detailing the exact root cause, and present a proposed fix plan to the user.

3. **Single Commerce Backend & Theme Conventions**:
   - EverShop is the sole commerce system.
   - Storefront overrides live in `themes/younoya/`.
   - Custom features live in `extensions/`.

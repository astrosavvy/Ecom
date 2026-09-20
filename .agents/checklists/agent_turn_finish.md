# Agent Turn-Finish Checklist (STEP 4)

Before yielding the turn back to the user or concluding a work session:

- [ ] **1. Run Build Verification**: Run `npm run build` in `younoya-web/` (or from root). Confirm exit code 0.
- [ ] **2. Mandatory Same-Turn Doc Sync**: If any endpoint, component, schema, or asset was modified, update the matching `.agents/memory/`, `.agents/context/`, or `.agents/rules/` document.
- [ ] **3. Update CHECKPOINT.md**:
  - Update `Current Phase` and `Active Task`.
  - Add completed work to `Checkpoint History & Completed Milestones`.
  - Update `Active Roadmap & Immediate Next Steps` so the next agent knows what to do next.
  - Record test outputs and any blockers/questions.
- [ ] **4. Zero Residue Check**: Ensure no leftover temporary scratch scripts or dummy files are left in the repository.

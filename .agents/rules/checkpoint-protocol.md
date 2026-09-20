# CHECKPOINT PROTOCOL (MANDATORY SYSTEM LAW)

> [!IMPORTANT]
> **Universal Multi-Agent Law**:
> This protocol applies equally to **Cursor**, **Antigravity**, **Claude Code**, **Codex**, or any automated assistant working in this repository. It guarantees that an agent on any turn with 0 past conversation history immediately knows the exact project state and can pick up right from where the previous agent left off.

---

## 1. The Turn-Start Checkpoint Protocol (STEP 1 ON EVERY TURN)

Before executing any file write, code modification, terminal command, or design change:
1. **Read `.agents/CHECKPOINT.md`** using a file viewing tool.
2. Verify:
   - What is the **Current Active Phase**?
   - What was the **Last Completed Task** and when was it finished?
   - What are the **Immediate Next Steps**?
   - Are there any active **Blockers** or **Inviolable Constraints**?
3. Align your proposed action strictly with the immediate next step declared in `.agents/CHECKPOINT.md`.

---

## 2. The Turn-Finish Checkpoint Protocol (STEP 4 ON EVERY TURN)

Whenever you complete a task, milestone, or conversational turn:
1. **Update `.agents/CHECKPOINT.md`** in the exact same turn before yielding back to the user.
2. Ensure the following sections are updated:
   - **Executive Status**: Set Current Phase, Active Task, Last Agent name, and ISO timestamp.
   - **Completed Milestones**: Add the newly completed task with bulleted details of what was changed and verified.
   - **Active Work & Next Immediate Steps**: List the exact numbered next tasks so the next agent has immediate clarity.
   - **Verification Results**: Record test commands executed and their output (e.g. `npm run build` exit code 0).
   - **Blockers & Questions**: Document any open decisions or dependencies requiring user input.

---

## 3. Inviolable Anti-Drift Checkpoint Invariants

1. **No Phantom Tasks**: Never execute tasks that contradict the active roadmap in `.agents/CHECKPOINT.md` without explicit user request.
2. **Never Overwrite Without Reading**: Always view `.agents/CHECKPOINT.md` first; never blind-overwrite or truncate past milestone history.
3. **Cross-IDE Handoff Guarantee**: If Cursor was used on Turn N, Antigravity on Turn N+1 MUST read the exact checkpoint left by Cursor.

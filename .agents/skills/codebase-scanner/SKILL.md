---
name: codebase-scanner
description: Scans the entire codebase structure, analyzes dependencies, audits architecture patterns, and maps repository components. Use this when asked to review, audit, map, or check the project.
---

# Codebase Scanner Skill

## Goal
To efficiently map repository structures, identify architectural bottlenecks, locate outdated packages, and evaluate general pattern health across files without consuming excessive token limits.

## When to use this skill
- When the user asks for a codebase health check, audit, or review.
- When generating a high-level component map or system blueprint.
- When inspecting code quality, dead components, or compliance with design rules.

## How to execute the scan
1. **Analyze Structure**: Use the local repository mapper to trace the directory map. Ignore directories hidden by `.gitignore` (such as `node_modules`, `dist`, `.venv`).
2. **Inspect Core Settings**: Always check manifest files (`package.json`, `cargo.toml`, `requirements.txt`, or `go.mod`) to catalogue foundational dependencies.
3. **Trace Component Injections**: Look for central configuration initializers (e.g., database connectors, routing files, state provider wrappers).
4. **Identify Flaws**: Mark legacy patterns, unused mock classes, or inconsistent coding syntax that breaks local standards.
5. **Output Structure**: Present results as a structured Markdown summary listing the directory topology, dependency status, and an actionable list of layout fixes.

## Constraints
- CRITICAL: Never alter, edit, or delete any file during the codebase scan phase. This is a read-only reporting skill.
- Do not read long logic scripts completely line-by-line if a quick schema summary satisfies the prompt.

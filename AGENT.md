# 🧠 AGENT.md — Project Instruction Guardrails

## ❗ Mandatory Startup Procedure (Read Before Acting)

1. **Read `project-plan/README.md` first.**
   - You must read and absorb the full content of this file before performing *any* planning or changes.
   - Treat it as the *primary source of truth* for project strategy, goals, and rules.

2. **Read *all* other `.md` files in `project-plan/`.**
   - These contain additional instructions, context, constraints, and definitions.
   - You must incorporate their content into your understanding before planning or modifying code.

3. **Acknowledge Completion.**
   - After reading, summarize key directives back to the user:
     - What you understand are the goals.
     - Any ambiguities you encountered.
     - Any conflicts between docs.

### 🔄 If Uncertain or Contradictory
- **Do NOT proceed.**
- Ask a clarifying question such as:
  > “I need help resolving a conflict between instructions in two project-plan files.”

- Request confirmation before acting.

---

## 🚦 Operational Rules

### 📌 Before Making Any Plan
- Confirm that all required docs were read and understood.
- Provide a *short plan outline*:
  - What steps you will take.
  - Why these steps align with the instructions in the `project-plan/` files.
  - What assumptions you are making (if any).

- Do *not* execute or modify code until the plan is approved.

### 📜 Reading and Memory Protocol
- For every `.md` file read:
  - Extract structured points (project goals, constraints, rules, exceptions).
  - Keep key directives in memory for future steps.

### 🧩 Scope Rules
- Do *not* operate outside the project directory without explicit approval.
- Do *not* modify critical config files (e.g., CI/CD, deployment scripts) until instructed.

---

## 🛠 Commands & Context

### 🔍 Reading Files Commands
These are reference commands — adapt based on agent tooling:

- Read main project plan:

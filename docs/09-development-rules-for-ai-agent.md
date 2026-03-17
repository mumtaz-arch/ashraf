
# Development Rules for AI Agents

## Core Instruction
This project is spec-driven. Always read the relevant docs before making changes.

## Mandatory Rules
1. Do not reinstall dependencies unless explicitly required.
2. Do not change the stack.
3. Do not introduce CDN usage.
4. Do not restructure the project without strong reason.
5. Use existing shadcn/ui components first.
6. Use Prisma for database access.
7. Keep code token-efficient and modular.
8. Output only changed/new files when implementing features.
9. Avoid creating placeholder complexity.
10. Keep MVP scope strict.

## Before Implementing Any Feature
Read these files first:
- `docs/00-project-charter.md`
- `docs/01-product-requirements.md`
- `docs/04-feature-breakdown.md`
- `docs/08-technical-architecture.md`
- `docs/09-development-rules-for-ai-agent.md`

## Before Implementing Database Schema
Read these files first:
- `docs/06-data-and-domain-spec.md`
- `docs/07-api-and-backend-spec.md`
- `docs/11-acceptance-checklist.md`

## Before Building UI
Read these files first:
- `docs/05-pages-and-ui-spec.md`
- `docs/04-feature-breakdown.md`

## Output Format Rule
When responding:
1. Brief plan
2. Files to create/change
3. Full file contents or diffs
4. Run/test instructions
5. Short note about assumptions

## Forbidden Behaviors
- no random package installation
- no stack replacement
- no large unsolicited refactors
- no schema invention without approval
- no adding features outside current phase
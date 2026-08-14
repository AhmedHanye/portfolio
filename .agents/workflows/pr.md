---
description: Generate and create a GitHub PR for the current branch.
---

# Generate and Create PR

Create a GitHub PR using the `gh` CLI.

## Steps:

1. **State:** Target `main` as base. Check current branch name (`git branch --show-current`). Push branch if needed using `git push -u origin HEAD`. Check for uncommitted changes.
2. **Inspect Context:** Review commit history and diffs between `main` and HEAD (`git log main..HEAD --oneline` and `git diff main...HEAD`).
3. **Quality Gate (MANDATORY):**
   Execute quality gate before creating the PR:
   ```bash
   bun lint && bun typecheck
   ```
   If any check fails → **stop**, report errors, and do not create the PR.
4. **Draft Title & Body:**
   - **Title**: Conventional Commits format (`<type>(<scope>): <description>`).
   - **Body**: Concise markdown summary covering **What changed**, **Why**, and **Verification/Testing performed**.
5. **Create PR via CLI:**
   ```bash
   gh pr create --base main --title '<type>(<scope>): <description>' --body "$(cat <<'EOF'
   ## Overview
   <summary of changes>

   ## Key Changes
   - <bullet points>

   ## Verification
   - Passed `bun lint && bun typecheck`
   EOF
   )"
   ```
6. **Return PR URL** to the user.

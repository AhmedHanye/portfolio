# Generate and Create PR

Create a GitHub PR using the `gh` CLI.
Input context: Our conversation history, code changes, and `.github/pull_request_template.md`.

## Steps:

1. **State:** Target `main` as base. Push branch if needed using your terminal tool (`git push -u origin HEAD`). Check for uncommitted changes.
2. **Inspect:** Review commit history and diffs between base and HEAD using terminal commands or file reading tools.
3. **Draft Body:** Use `.github/pull_request_template.md`. Replace placeholders with concise details. No empty bullets.
4. **Draft Title:** Use Conventional Commits (`<type>(<scope>): <description>`).
   - Types: `feat`, `fix`, `perf`, `refactor`, `style`, `test`, `docs`, `build`, `ci`, `chore`.
5. **Create:**
   ```bash
   gh pr create --base main --title '<type>(<scope>): <description>' --body "$(cat <<'EOF'
   <markdown body>
   EOF
   )"
   ```
   Return the PR URL.

⚠️ **CRITICAL: Verification**
You MUST explicitly run this quality gate in the terminal tool before creating the PR. Wait for it to pass. If it fails, report errors and do not create the PR. Once passed, confirm it in the "Testing" section of the PR body:

```bash
bun lint && bun typecheck
```

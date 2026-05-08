## Context Discovery

Before writing the commit, you MUST use your tools (like `run_in_terminal` or `get_changed_files`) to gather context:

- Check current git status (`git status`).
- Check current git diff for staged and unstaged changes (`git diff HEAD`).
- Check current branch (`git branch --show-current`).
- Check recent commits for context (`git log --oneline -10`).

## Git Safety Protocol

- NEVER update git config.
- NEVER skip hooks (--no-verify) unless explicitly requested.
- CRITICAL: ALWAYS create NEW commits. NEVER use `git commit --amend` unless requested.
- Do not commit secrets (.env, etc).
- No interactive flags (-i).

## Your task

1. Analyze changes. Split into multiple atomic commits if there are multiple logical updates.
2. Write clear, concise commit messages:
   - Present tense, imperative mood ("Add feature", not "Added").
   - Subject line: max 100 chars, follow `@commitlint/config-conventional`.
   - Body: explain what and why. Prefix lines with `- `, max 150 chars.

### Commit Type Classification (First match wins)

| Type       | When to use                                                             |
| ---------- | ----------------------------------------------------------------------- |
| `feat`     | End-user-facing functionality (new UI, route)                           |
| `fix`      | Corrects a bug in user-facing behavior                                  |
| `perf`     | Runtime performance without changing behavior                            |
| `refactor` | Restructure code without behavior change                                |
| `style`    | Formatting/whitespace only                                              |
| `test`     | Tests/stories only (no prod code changes)                               |
| `docs`     | Documentation only                                                      |
| `build`    | Build system/deps (Next.js config, Tailwind plugins)                    |
| `ci`       | CI/CD config files                                                      |
| `chore`    | Tooling, dev config, Storybook addons                                   |

## Execution Strategy for Partial Commits

- Use `git apply --check --recount --whitespace=fix` via heredoc before applying patches.
- If applying fails, use `git add` and interactively unstage (`git restore --staged --patch`).

⚠️ **CRITICAL: Verification**
You MUST autonomously run the following quality gate using the `run_in_terminal` tool before suggesting or creating a commit. If any check fails, do NOT proceed with the commit. Instead, report the errors and help the user fix them:

```bash
bun lint && bun typecheck
```

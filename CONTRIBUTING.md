# Contributing to Declarative Benchmarks

Thank you for your interest in contributing to **Declarative Benchmarks**.  
This project follows strict standards for code quality, reproducibility, and commit conventions.  
Please read this guide carefully before opening a pull request.

---

# 📦 Project Setup

This project uses:

- **Node.js 24+**
- **pnpm 10+**
- **TypeScript**
- **ESM-only**
- **Husky + Commitlint + Conventional Commits**
- **GitHub Actions CI**

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/declarative-benchmarks.git
cd declarative-benchmarks
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Install Git hooks (Husky)

Husky is automatically installed via the `prepare` script:

```bash
pnpm prepare
```

This enables:

- Pre-commit linting
- Commit message validation (Conventional Commits)
- Automatic formatting

---

# 🧪 Available Scripts

All development commands are defined in `package.json`:

| Command          | Description                                                             |
| ---------------- | ----------------------------------------------------------------------- |
| `pnpm dev`       | Runs the benchmark CLI (dev version), use nodejs lts to run ts directly |
| `pnpm build`     | Builds the project using esbuild                                        |
| `pnpm lint`      | Runs ESLint                                                             |
| `pnpm lint:fix`  | Fixes ESLint issues                                                     |
| `pnpm typecheck` | Runs TypeScript type checking                                           |
| `pnpm format`    | Formats the code with Prettier                                          |
| `pnpm test`      | Runs Node.js test runner                                                |
| `pnpm bench`     | Runs the benchmark CLI (compiled version)                               |

---

# 📝 Commit Rules (Conventional Commits)

All commits **must** follow the **Conventional Commits** specification:

```
<type>(optional scope): <description>

[optional body]

[optional footer]
```

### Allowed types

- `feat` — New feature
- `fix` — Bug fix
- `docs` — Documentation changes
- `refactor` — Code refactor without behavior changes
- `perf` — Performance improvements
- `test` — Adding or fixing tests
- `build` — Build system changes
- `chore` — Maintenance tasks
- `ci` — CI/CD changes
- `style` — Formatting, no logic changes

### Examples

```
feat(core): add scenario-level overrides
fix(loader): resolve ESM path normalization issue
docs: improve manifest example
refactor: simplify benchmark runner pipeline
ci: add pnpm caching to workflow
```

Commitlint will **block commits** that do not follow these rules.

---

# 🔀 Pull Request Guidelines

Before opening a PR:

1. Ensure your branch is up to date with `main`
2. Run all checks locally:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

3. Ensure commits follow **Conventional Commits**
4. Ensure code is fully typed and documented
5. Add tests if your change affects behavior
6. Update documentation if needed

---

# 🧩 Benchmark Development Guidelines

If contributing new benchmark examples:

- Use `bench/example-*` naming
- Keep manifests minimal and readable
- Avoid domain-specific examples
- Prefer generic, reproducible cases

---

# 🛡️ CI/CD Requirements

All PRs must pass:

- Linting
- Type checking
- Tests
- Build
- Commitlint
- Dependency audit

The `validate` job in GitHub Actions enforces this.

The `release` job runs **only on main** and uses **semantic-release**.

---

# ⭐ Thank You

Your contributions help improve the benchmarking ecosystem and push forward a more explicit, reproducible, and developer-friendly approach to performance testing.

If you have questions or want to propose architectural improvements, feel free to open an issue.

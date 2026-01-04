# 📘 Recommended TypeScript template

This repository is a **TypeScript template** preconfigured with:

- **ESLint** for linting
- **Prettier** for formatting
- **Husky** for Git hooks
- **Conventional Commits** validation in pre-commit
- **Type checking** and **test scripts**
- Compatible with **pnpm**, **npm**, **yarn**, and **bun**

You can use **any package manager you prefer**. All commands shown below work the same way across tools.

---

### 🚀 Installation

Install dependencies using your preferred package manager:

```bash
pnpm install
# or npm install
# or yarn install
# or bun install
```

---

### 🔧 Initialize Husky

After installing dependencies, you must run the `prepare` script:

```bash
pnpm prepare
# or npm run prepare
# or yarn prepare
# or bun run prepare
```

Once initialized, **before every commit**, Husky will automatically:

- Run ESLint
- Format code with Prettier
- Check TypeScript types
- Run tests
- **Validate commit messages using Conventional Commits**

This ensures consistent, clean, and safe commits.

---

### 📝 Conventional Commits

This template enforces **Conventional Commits** automatically during `pre-commit`.  
If your commit message does not follow the standard, the commit will be rejected.

#### Common commit types

| Type          | Purpose                                        |
| ------------- | ---------------------------------------------- |
| **feat:**     | A new feature                                  |
| **fix:**      | A bug fix                                      |
| **docs:**     | Documentation changes                          |
| **style:**    | Formatting only (no code changes)              |
| **refactor:** | Code refactoring without behavior changes      |
| **test:**     | Adding or updating tests                       |
| **chore:**    | Maintenance tasks (configs, tooling, CI, etc.) |

---

### 📂 Available Scripts

You can run these commands with **pnpm**, **npm**, **yarn**, or **bun**.

#### 🔍 Lint

Runs ESLint to detect code issues.

```bash
pnpm lint
# or npm run lint
# or yarn lint
# or bun run lint
```

#### 🛠 Fix Lint Issues

Automatically fixes ESLint problems when possible.

```bash
pnpm lint:fix
# or npm run lint:fix
# or yarn lint:fix
# or bun run lint:fix
```

#### 🎨 Format

Formats the entire codebase using Prettier.

```bash
pnpm format
# or npm run format
# or yarn format
# or bun run format
```

#### 🧪 Type Check

Runs TypeScript’s type checker without emitting files.

```bash
pnpm typecheck
# or npm run typecheck
# or yarn typecheck
# or bun run typecheck
```

#### 🧪 Tests

Runs your Node.js test suite.

```bash
pnpm test
# or npm run test
# or yarn test
# or bun run test
```

---

### 🔄 Updating Dependencies

This project uses **strict versioning** (`save-exact=true`), so dependencies **do not update automatically**.  
If you want to update them, you must do it **manually** with your package manager:

```bash
pnpm update --latest
# or npm update
# or yarn upgrade --latest
# or bun update
```

This prevents inconsistent installations across machines and ensures full reproducibility.

---

### ⚛️ React / ⚡ Preact

If you plan to use **React** or **Preact**, make sure to **uncomment the corresponding sections** in:

- `eslint.config.js`
- `tsconfig.json` (only required for Preact)

#### React

- Uncomment the **React** block in `eslint.config.js`.
- No TypeScript changes needed.

#### Preact

- Uncomment the **Preact** block in `eslint.config.js`.
- In `tsconfig.json`, add or uncomment `"jsxImportSource": "preact"`

#### Recommendation

If your project uses React or Preact in a standard way, it’s **easier and more reliable** to start from an official template:

- **Vite + React**
- **Vite + Preact**
- Or any React framework template of your choice

---

### ⭐ Support

If this template helped you, consider giving it a star.

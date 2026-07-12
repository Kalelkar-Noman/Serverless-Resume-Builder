# Contributing to Serverless Resume Builder

Thank you for your interest in contributing to the Serverless Resume Builder! We welcome contributions from everyone.

## Getting Started

1. Fork the repository and clone it locally.
2. Run `npm install` to install all dependencies.
3. Start the development server using `npm run dev`.

## Making Changes

- Before creating a pull request, ensure that your code follows our formatting standards by running `npm run format`.
- Ensure there are no linting errors by running `npm run lint`.
- Ensure all tests pass by running `npm run test:ci`.
- Our CI pipeline will automatically run these checks on your PR.

## Commit Guidelines

We use `commitlint` to enforce conventional commit messages. Your commit messages should follow this format:

```
<type>[optional scope]: <description>
```

Examples:

- `feat(ui): add new dark mode template`
- `fix(pdf): resolve font loading issue`
- `docs: update readme`

If you ran `npm install`, Husky should have automatically set up the commit hook to check your commit messages.

## Legal Note

This project is a modified version of [OpenResume](https://github.com/xitanggg/open-resume) and is licensed under the AGPL-3.0 License. All contributions will be bound by this license.

# Contributing to Task Management Website

Thank you for your interest in contributing! Please follow these guidelines to ensure a smooth collaboration.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/task-management-website.git
   cd task-management-website
   ```
3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/original-owner/task-management-website.git
   ```
4. Install dependencies:
   ```bash
   npm install
   ```

## Development Process

### Creating a Feature Branch

Always create a new branch for your feature or fix:

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests

### Making Changes

1. Make your changes in the feature branch
2. Test your changes thoroughly:
   ```bash
   npm run dev
   ```
3. Build the project to ensure no errors:
   ```bash
   npm run build
   ```

### Commit Messages

Write clear, descriptive commit messages:

```bash
git commit -m "Add feature X that does Y"
```

Good commit message examples:
- "Add task filtering by priority"
- "Fix date picker display in dark mode"
- "Update README with setup instructions"

Avoid:
- "fix bug"
- "update"
- "asdf"

### Pushing Changes

```bash
git push origin feature/your-feature-name
```

## Submitting Pull Requests

1. Push your feature branch to your fork
2. Navigate to the original repository on GitHub
3. Click "New Pull Request"
4. Select your branch and fill in the PR template
5. Provide a clear description of your changes:
   - What does this PR do?
   - Why is it needed?
   - How should reviewers test this?

## Code Style Guidelines

### JavaScript/React

- Use ES6+ syntax
- Use functional components with Hooks
- Use PascalCase for component names
- Use camelCase for variables and functions
- Add JSDoc comments for complex functions
- Keep components small and focused

Example:
```jsx
/**
 * TaskCard - Displays a single task
 * @param {Object} task - Task data
 * @param {Function} onEdit - Callback for edit action
 */
const TaskCard = ({ task, onEdit }) => {
  return (
    <div className="bg-white rounded-lg p-4">
      <h3>{task.title}</h3>
      <button onClick={() => onEdit(task.id)}>Edit</button>
    </div>
  );
};
```

### CSS/Tailwind

- Use Tailwind CSS utility classes
- Avoid inline styles
- Maintain responsive design
- Use consistent spacing and sizing

### File Organization

```
component/
├── ComponentName.jsx
├── ComponentName.module.css (if needed)
└── hooks/
    └── useCustomHook.js
```

## Testing

While not mandatory, tests are encouraged:

```bash
npm run test
```

## Documentation

- Update README.md if adding new features
- Add comments for complex logic
- Document component props with JSDoc
- Include examples in documentation

## Before Submitting

- [ ] Code follows project style guidelines
- [ ] Changes have been tested locally
- [ ] New features have appropriate documentation
- [ ] No console errors or warnings
- [ ] Commit messages are clear and descriptive
- [ ] You've pulled the latest upstream changes

## Review Process

A maintainer will review your PR within a few days. They may:
- Request changes
- Ask clarifying questions
- Approve and merge

Be responsive to feedback and make requested changes promptly.

## Reporting Issues

Found a bug or have a suggestion? Please create an issue with:
- Clear title describing the issue
- Detailed description of the problem
- Steps to reproduce (for bugs)
- Expected vs. actual behavior
- Screenshots if applicable
- Browser and OS information

## Questions?

Feel free to:
- Open an issue with your question
- Start a discussion in the Discussions tab
- Contact the maintainers

## Code of Conduct

Please be respectful and constructive in all interactions. We're building this project together!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🎉

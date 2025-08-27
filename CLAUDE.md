# Context Engineering in React

## Introduction

This repository is meant for presenting a tech talk with this title, "Context
Engineering in React using AI"

Here are the talking points:

1.⁠ ⁠Prompting AI for Testable Components\
2.⁠ ⁠⁠Automated Debugging with AI\
3.⁠ ⁠⁠Refactoring Legacy Components\
4.⁠ ⁠⁠AI-Driven Component Decomposition

## Todo

- [x] Initialize the talk slides using [Marp](https://marp.app/)
- [ ] Write the slides based on the talking points
  - [ ] 1.⁠ ⁠Prompting AI for Testable Components
  - [ ] 2.⁠ ⁠⁠Automated Debugging with AI
  - [ ] 3.⁠ ⁠⁠Refactoring Legacy Components
  - [ ] 4.⁠ ⁠⁠AI-Driven Component Decomposition
- [ ] Prepare the demo app with a simple component rendered in the browser
- [ ] Prepare the testing infrastructure demo app with
      [Vitest Browser Mode](https://vitest.dev/guide/browser/)
  - [ ] Prepare the AI prompts to write the tests reliably under `docs/test-plans`
    directory
  - [ ] Prepare Legacy React Components for Testing
  - [ ] Prepare complex React Components for Testing

## Claude Code Automation Approaches

### Documentation Approach

Whenever writing documentation in Markdown, always remember to:

- Add a new line after the first header
- Add a new line by the end of the file

### TypeScript Approach

- Use TypeScript, so it should use .tsx instead of .js whenever applicable

### Project Management Approach

- Always update the corresponding Markdown plan document with the latest state
  of the completed steps

### Testing Approach

- Always use case insensitive regex to assert text in testing, avoid hardcoded
  strings because they are case sensitive

# Context Engineering in React Demo

A comprehensive demonstration of AI-powered React development workflows, covering testing, refactoring, and component decomposition.

## 🎯 Demo Overview

This project demonstrates "Context Engineering in React using AI" through four key areas:

1. **Prompting AI for Testable Components** - Generate comprehensive tests using AI
2. **Automated Debugging with AI** - Browser automation and visual debugging  
3. **Refactoring Legacy Components** - Transform class components to modern patterns
4. **AI-Driven Component Decomposition** - Break down complex components intelligently

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start the demo app
pnpm run dev

# Run tests
pnpm run test

# Run tests in browser mode
pnpm run test:browser
```

## 🎪 Demo Flow

### 1. **Start with the Slides**
```bash
# Open presentation slides
open deck.md  # or use Marp VS Code extension
```

### 2. **Demo App**
- Demo app runs at http://localhost:5173/
- Features the basic UserProfile component for live testing demos

### 3. **Live Demo Scenarios**

#### **Scenario A: AI-Powered Basic Testing**
```bash
# Show the current component
open src/App.tsx

# Use AI with the basic testing prompt
open docs/test-plans/basic-component-testing.md

# Process:
# 1. Copy the template prompt from the markdown file
# 2. Paste the UserProfile component code into AI
# 3. AI generates comprehensive tests
# 4. Run the generated tests
pnpm run test
```

#### **Scenario B: Legacy Component Refactoring**
```bash
# Show the legacy class component
open src/components/LegacyUserDashboard.jsx

# Use AI with legacy testing prompt
open docs/test-plans/legacy-component-testing.md

# Demonstrate:
# 1. AI analysis of legacy patterns
# 2. Refactoring from class to hooks
# 3. Before/after code comparison
# 4. Modern React patterns
```

#### **Scenario C: Complex Component Decomposition**
```bash
# Show the complex data table (300+ lines)
open src/components/ComplexDataTable.tsx

# Use AI with complex testing prompt  
open docs/test-plans/complex-component-testing.md

# Demonstrate:
# 1. AI identifying component responsibilities
# 2. Breaking down monolithic components
# 3. Separation boundary analysis
# 4. Creating focused, reusable components
```

### 4. **Interactive Testing Demo**
```bash
# Run tests in watch mode for live demo
pnpm run test

# Run in browser mode to show visual testing
pnpm run test:browser
```

## 📁 Project Structure

```
├── deck.md                           # Marp presentation slides
├── src/
│   ├── App.tsx                       # Basic UserProfile component
│   ├── UserProfile.test.tsx          # Example AI-generated tests
│   └── components/
│       ├── LegacyUserDashboard.jsx   # Class-based legacy component
│       └── ComplexDataTable.tsx     # Complex component for decomposition
├── docs/test-plans/                  # AI prompt templates
│   ├── basic-component-testing.md    # Standard component testing
│   ├── legacy-component-testing.md   # Legacy pattern testing
│   └── complex-component-testing.md  # Advanced component testing
└── vitest.config.ts                 # Browser testing configuration
```

## 🛠 Demo Commands

| Command | Purpose |
|---------|---------|
| `pnpm run dev` | Start demo app |
| `pnpm run test` | Run tests |
| `pnpm run test:browser` | Visual browser testing |
| `pnpm run build` | Build for production |
| `git log --oneline` | Show development progression |

## 🎯 Key Demo Points

1. **Context Overflow** → **Context Engineering** (concept transition)
2. **Basic UserProfile** → **AI-generated comprehensive tests**
3. **Legacy class component** → **AI-assisted modern refactoring**
4. **Complex data table** → **AI-driven component decomposition**
5. **Live test generation** → **Browser-based visual testing**

## 🧪 Testing Infrastructure

- **Vitest** with Browser Mode using Playwright
- **React Testing Library** for component testing
- **Real browser environment** for accurate testing
- **Visual debugging** with screenshots
- **Comprehensive test coverage** examples

## 💡 AI Prompt Engineering

The `docs/test-plans/` directory contains carefully crafted prompts for:
- Generating reliable, comprehensive tests
- Handling different component complexity levels
- Following React testing best practices
- Ensuring accessibility compliance
- Covering edge cases and error states

Perfect for demonstrating the power of AI-assisted React development! 🚀
```

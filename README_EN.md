English | [简体中文](./README.md)

# StatVerse 3D

A Three.js-based 3D statistics visualization tool for displaying interactive three-dimensional graphics of confidence intervals and parameter estimation.

## Features

- 🎨 3D visualization of statistical concepts
- 📊 Interactive confidence interval display
- 📈 Parameter estimation visualization
- 🎮 Real-time interactive controls
- 🔧 Parameter adjustment based on dat.GUI

## Tech Stack

- **Three.js** - 3D graphics rendering
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **dat.GUI** - Parameter control interface

## Installation

```bash
# Install dependencies with pnpm
pnpm install

# Or with npm
npm install

# Or with yarn
yarn install
```

## Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
StatVerse 3D/
├── src/
│   ├── main.ts                    # Application entry
│   ├── scene/
│   │   └── SceneManager.ts        # 3D scene management
│   ├── statistics/
│   │   └── Distribution.ts        # Statistical distributions
│   ├── visualizers/
│   │   ├── ConfidenceIntervalVisualizer.ts    # Confidence interval visualization
│   │   └── ParameterEstimationVisualizer.ts   # Parameter estimation visualization
│   └── ui/
│       └── UIController.ts        # UI controller
├── public/                        # Static assets
├── index.html                     # HTML entry
└── package.json                   # Project configuration
```

## License

MIT
English | [简体中文](./README.md)

# StatVerse 3D

A Three.js-based 3D statistics visualization tool for displaying interactive three-dimensional graphics of confidence intervals and parameter estimation.

## Features

- 🎨 3D visualization of statistical concepts
- 📊 Interactive confidence interval display
- 📈 Parameter estimation visualization
- 🎮 Real-time interactive controls
- 🔧 Parameter adjustment based on dat.GUI
- 📱 PWA support for installable offline experience

## Tech Stack

- **Three.js** - 3D graphics rendering
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **dat.GUI** - Parameter control interface
- **PWA** - Progressive Web App support

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

# Generate PWA icons
pnpm generate-icons
```

## PWA Support

This project can run as a Progressive Web App (PWA):

- ✅ Installable on desktop/mobile home screen
- ✅ Offline access support
- ✅ Automatic cache updates
- ✅ Cross-platform support (Windows, macOS, Linux, iOS, Android)

### Initial Setup

1. Install the Python dependency:
```bash
pip install Pillow
```

2. Generate the application icons:
```bash
python generate_icons.py
```

For detailed PWA configuration guidance, refer to [PWA_SETUP.md](./PWA_SETUP.md).

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
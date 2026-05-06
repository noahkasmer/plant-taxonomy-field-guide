# plant-taxonomy-field-guide

Offline-first Expo Router MVP for identifying and browsing Illinois plants.

## Development Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run start
```

3. Choose a target from the Expo CLI prompt, or run a platform-specific command:

```bash
npm run web
npm run ios
npm run android
```

## Available Checks

This scaffold currently does not define dedicated lint or test scripts. To verify the TypeScript project, run:

```bash
npx tsc --noEmit
```

## Structure

```text
app/                 Expo Router routes and layouts
src/components/      Reusable UI components
src/data/            Plant records and image manifests
src/screens/         Screen-level React Native views
src/types/           Shared TypeScript types
src/utils/           Plant lookup and media-rights helpers
assets/images/       Locally bundled plant images
```

This scaffold intentionally excludes any backend or authentication setup.

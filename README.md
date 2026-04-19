# machine-translation.ts

TS snippet for detecting machine translation.

## Usage

```ts
import { detectMachineTranslation } from './machine-translation';

const cleanup = detectMachineTranslation();

window.addEventListener('machineTranslationDetected', () => {
  // Machine translation detected!
});

```

## Demo

https://y14e.github.io/machine-translation-ts/

# machine-translation.ts
TS snippet for detecting machine translation.
## Installation
```ts
import { detectMachineTranslation } from './machine-translation';

const cleanup = detectMachineTranslation();

window.addEventListener('machineTranslationDetected', () => {
  // Machine translation detected!
});
```
## Demo
https://y14e.github.io/machine-translation-ts/

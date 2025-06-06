export function detectMachineTranslation() {
  const htmlElement = document.documentElement;
  const titleElement = document.getElementsByTagName('title')[0];
  const strategies = [
    {
      set: new Map([[htmlElement, ['class']]]),
      test: () => [...htmlElement.classList].some(className => /translated-(ltr|rtl)/.test(className)),
    },
    {
      set: new Map([[htmlElement, ['lang']]]),
      test: () => htmlElement.getAttribute('lang') !== navigator.language,
    },
    {
      set: new Map([[titleElement, ['_msttexthash']]]),
      test: () => titleElement.hasAttribute('_msttexthash'),
    },
  ];
  const observer = new MutationObserver(() => {
    if (strategies.some(strategy => strategy.test())) {
      window.dispatchEvent(new Event('machineTranslationDetected'));
      observer.disconnect();
    }
  });
  strategies.forEach(({ set }) => {
    for (const [element, attributes] of set.entries()) {
      observer.observe(element, {
        attributeFilter: attributes,
      });
    }
  });
}

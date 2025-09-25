export function detectMachineTranslation() {
  const html = document.documentElement;
  const title = document.getElementsByTagName('title')[0];
  const strategies = [
    {
      element: html,
      attribute: 'class',
      test: () => [...html.classList].some(className => /translated-(ltr|rtl)/.test(className)),
    },
    {
      element: html,
      attribute: 'lang',
      test: () => html.lang !== navigator.language,
    },
    {
      element: title,
      attribute: '_msttexthash',
      test: () => title.hasAttribute('_msttexthash'),
    },
  ];
  const observer = new MutationObserver(() => {
    if (strategies.some(strategy => strategy.test())) {
      window.dispatchEvent(new Event('machineTranslationDetected'));
      observer.disconnect();
    }
  });
  strategies.forEach(({ element, attribute }) => observer.observe(element, { attributeFilter: [attribute] }));
}

// window.addEventListener('DOMContentLoaded', detectMachineTranslation);

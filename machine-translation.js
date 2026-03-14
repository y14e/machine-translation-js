export function detectMachineTranslation() {
  const html = document.documentElement;
  const title = document.getElementsByTagName('title')[0];
  const strategies = [
    {
      attribute: 'class',
      element: html,
      test: () => [...html.classList].some((className) => /translated-(ltr|rtl)/.test(className)),
    },
    {
      attribute: 'lang',
      element: html,
      test: () => html.lang !== navigator.language,
    },
    {
      attribute: '_msttexthash',
      element: title,
      test: () => title.hasAttribute('_msttexthash'),
    },
  ];
  const observer = new MutationObserver(() => {
    if (strategies.some((strategy) => strategy.test())) {
      window.dispatchEvent(new Event('machineTranslationDetected'));
      observer.disconnect();
    }
  });
  strategies.forEach(({ attribute, element }) => observer.observe(element, { attributeFilter: [attribute] }));
}

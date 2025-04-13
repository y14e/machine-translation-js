export function detectMachineTranslation() {
  const htmlElement = document.documentElement;
  const titleElement = document.getElementsByTagName('title')[0];
  const strategies = [
    {
      element: htmlElement,
      attribute: 'class',
      test: () => [...htmlElement.classList].some(className => /translated-(ltr|rtl)/.test(className)),
    },
    {
      element: htmlElement,
      attribute: 'lang',
      test: () => htmlElement.getAttribute('lang') !== navigator.language,
    },
    {
      element: titleElement,
      attribute: '_msttexthash',
      test: () => titleElement.hasAttribute('_msttexthash'),
    },
  ];
  const observer = new MutationObserver(() => {
    if (strategies.some(strategy => strategy.test())) {
      window.dispatchEvent(new Event('machineTranslationDetected'));
      observer.disconnect();
    }
  });
  strategies.forEach(({ element, attribute }) => {
    observer.observe(element, { attributeFilter: [attribute] });
  });
}

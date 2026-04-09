export function detectMachineTranslation() {
  const html = document.documentElement;
  const title = document.getElementsByTagName('title')[0];
  const strategies = [
    {
      attribute: 'class',
      element: html,
      test: () => {
        return [...html.classList].some((className) => {
          return /translated-(ltr|rtl)/.test(className);
        });
      },
    },
    {
      attribute: '_msttexthash',
      element: title,
      test: () => {
        return title.hasAttribute('_msttexthash');
      },
    },
    {
      attribute: 'lang',
      element: html,
      test: () => {
        return new Intl.Locale(html.lang).language !== new Intl.Locale(navigator.language).language;
      },
    },
  ];
  const observer = new MutationObserver(() => {
    if (
      strategies.some((strategy) => {
        return strategy.test();
      })
    ) {
      window.dispatchEvent(new Event('machineTranslationDetected'));
      observer.disconnect();
    }
  });
  strategies.forEach(({ attribute, element }) => {
    observer.observe(element, { attributeFilter: [attribute] });
  });
  return () => {
    observer.disconnect();
  };
}

export function detectMachineTranslation(): () => void {
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

  const detect = (): void => {
    if (
      !strategies.some((strategy) => {
        return strategy.test();
      })
    ) {
      return;
    }
    window.dispatchEvent(new Event('machineTranslationDetected'));
    observer?.disconnect();
    observer = null;
  };

  let observer: MutationObserver | null = new MutationObserver(detect);

  for (const { attribute, element } of strategies) {
    observer?.observe(element, { attributeFilter: [attribute] });
  }

  return (): void => {
    observer?.disconnect();
    observer = null;
  };
}

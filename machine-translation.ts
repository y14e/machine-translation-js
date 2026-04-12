export function detectMachineTranslation(): () => void {
  const html = document.documentElement;
  const title = document.getElementsByTagName('title')[0];

  const strategies = [
    {
      attribute: 'class',
      element: html,
      test: () => [...html.classList].some((className) => /translated-(ltr|rtl)/.test(className)),
    },
    {
      attribute: '_msttexthash',
      element: title,
      test: () => title.hasAttribute('_msttexthash'),
    },
    {
      attribute: 'lang',
      element: html,
      test: () => {
        const htmlLanguage = new Intl.Locale(html.lang).language;
        const navigatorLanguage = new Intl.Locale(navigator.language).language;
        return htmlLanguage !== navigatorLanguage;
      },
    },
  ];

  const detect = (): void => {
    if (!strategies.some((strategy) => strategy.test())) return;

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

export function detectMachineTranslation(): () => void {
  const html = document.documentElement;
  const title = document.getElementsByTagName('title')[0];
  const strategies = [
    {
      attr: 'class',
      element: html,
      test: () => [...html.classList].some((className) => /translated-(ltr|rtl)/.test(className)),
    },
    {
      attr: '_msttexthash',
      element: title,
      test: () => title.hasAttribute('_msttexthash'),
    },
    {
      attr: 'lang',
      element: html,
      test: () => html.lang !== navigator.language,
    },
  ];
  const observer = new MutationObserver(() => {
    if (strategies.some((strategy) => strategy.test())) {
      window.dispatchEvent(new Event('machineTranslationDetected'));
      observer.disconnect();
    }
  });
  strategies.forEach(({ attr, element }) => observer.observe(element, { attributeFilter: [attr] }));
  return () => observer.disconnect();
}

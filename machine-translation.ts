export function detectMachineTranslation(): () => void {
  const html = document.documentElement;
  const title = document.getElementsByTagName('title')[0] as HTMLTitleElement;
  const language = new Intl.Locale(navigator.language).language;
  const strategies = [
    {
      attribute: 'class',
      element: html,
      test: () => [...html.classList].some((className: string) => /translated-(ltr|rtl)/.test(className)),
    },
    {
      attribute: '_msttexthash',
      element: title,
      test: () => title.hasAttribute('_msttexthash'),
    },
    {
      attribute: 'lang',
      element: html,
      test: () => new Intl.Locale(html.lang).language !== language,
    },
  ];

  let timer: number | undefined;

  const detect = (): void => {
    if (timer !== undefined) {
      return;
    }

    timer = requestAnimationFrame(() => {
      if (!strategies.some((strategy) => strategy.test())) {
        return;
      }

      window.dispatchEvent(new Event('machineTranslationDetected'));
      observer?.disconnect();
      observer = null;
    });
  };

  const map = new Map<Element, string[]>();

  for (const { attribute, element } of strategies) {
    (map.has(element) ? map.get(element) : map.set(element, []).get(element))?.push(attribute);
  }

  let observer: MutationObserver | null = new MutationObserver(detect);

  for (const [element, attributes] of map) {
    observer.observe(element, { attributeFilter: attributes });
  }

  return () => {
    observer?.disconnect();
    observer = null;

    if (timer !== undefined) {
      cancelAnimationFrame(timer);
      timer = undefined;
    }
  };
}

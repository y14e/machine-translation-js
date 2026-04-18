export function detectMachineTranslation(): () => void {
  const html = document.documentElement;
  const title = document.getElementsByTagName('title')[0];
  const language = new Intl.Locale(navigator.language).language;
  const strategies = [
    {
      attribute: 'class',
      element: html,
      test: (): boolean => {
        return [...html.classList].some((className: string): boolean => {
          return /translated-(ltr|rtl)/.test(className);
        });
      },
    },
    {
      attribute: '_msttexthash',
      element: title,
      test: (): boolean => {
        return title.hasAttribute('_msttexthash');
      },
    },
    {
      attribute: 'lang',
      element: html,
      test: (): boolean => {
        return new Intl.Locale(html.lang).language !== language;
      },
    },
  ];

  let timer: number | undefined;

  const detect = (): void => {
    if (timer !== undefined) {
      return;
    }

    timer = requestAnimationFrame((): void => {
      const translated = strategies.some((strategy): boolean => {
        return strategy.test();
      });

      if (!translated) {
        return;
      }

      window.dispatchEvent(new Event('machineTranslationDetected'));
      observer?.disconnect();
      observer = null;
    });
  };

  const attributeMap = new Map<Element, string[]>();

  for (const { element } of strategies) {
    if (!attributeMap.has(element)) {
      attributeMap.set(element, []);
    }
  }

  for (const { attribute, element } of strategies) {
    const list = attributeMap.get(element);

    if (list !== undefined) {
      list.push(attribute);
    }
  }

  let observer: MutationObserver | null = new MutationObserver(detect);

  for (const [element, attributes] of attributeMap) {
    observer.observe(element, { attributeFilter: attributes });
  }

  return (): void => {
    observer?.disconnect();
    observer = null;

    if (timer !== undefined) {
      cancelAnimationFrame(timer);
      timer = undefined;
    }
  };
}

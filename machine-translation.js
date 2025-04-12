export function detectMachineTranslation() {
  const htmlElement = document.documentElement;
  const titleElement = document.getElementsByTagName('title')[0];
  const observer = new MutationObserver(() => {
    if ([...htmlElement.classList].some(className => /translated-(ltr|rtl)/.test(className)) || titleElement.hasAttribute('_msttexthash')) {
      window.dispatchEvent(new Event('machineTranslationDetected'));
      observer.disconnect();
    }
  });
  new Map([
    [htmlElement, 'class'],
    [titleElement, '_msttexthash'],
  ]).forEach((attribute, element) => observer.observe(element, { attributeFilter: [attribute] }));
}

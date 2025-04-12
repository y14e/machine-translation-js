export function detectMachineTranslation() {
  const htmlElement = document.documentElement;
  const titleElement = document.getElementsByTagName('title')[0];
  const observer = new MutationObserver(() => {
    if ([...htmlElement.classList].some(className => /translated-(ltr|rtl)/.test(className)) || htmlElement.getAttribute('lang') !== navigator.language || titleElement.hasAttribute('_msttexthash')) {
      window.dispatchEvent(new Event('machineTranslationDetected'));
      observer.disconnect();
    }
  });
  new Map([
    [htmlElement, ['class', 'lang']],
    [titleElement, ['_msttexthash']],
  ]).forEach((attributes, element) => observer.observe(element, { attributeFilter: attributes }));
}

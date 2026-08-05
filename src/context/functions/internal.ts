/**
 * @internal
 */
export function findElement(element: HTMLElement | string | null, fallback: HTMLElement): HTMLElement {
    if (element instanceof HTMLElement) {
        return element;
    }

    if (null === element) {
        return fallback;
    }

    element = globalThis.document.querySelector(element) as HTMLElement | null;

    if (null === element) {
        throw new Error(`Element could not be found using selector "${element}".`);
    }

    return element as HTMLElement;
}
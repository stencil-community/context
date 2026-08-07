/**
 * @internal
 */
export function findElement(element: HTMLElement | string | null, fallback: HTMLElement): HTMLElement {
    if (null === element) {
        return fallback;
    }

    if ('string' !== typeof element) {
        return element;
    }
    
    return globalThis.document.querySelector(element) || throwError(`Element could not be found using selector "${element}".`);
}

/**
 * @internal
 */
export function throwError(error: Error | string): never {
    throw 'string' === typeof error ? new Error(error) : error;
}

import { ContextRoot } from '../utils/context-root';
import { findElement } from './internal';

let roots: WeakMap<HTMLElement, ContextRoot> | null = null;

/**
 * Create context root.
 *
 * If context root already exists on given element, function will silently skip initialization.
 *
 * @param {HTMLElement|string|null} target The target element or selector to use as context root. If not provided context root will be attached to the `document.documentElement`, that is, to the `<html>` HTML element.
 */
export function createContextRoot(target: HTMLElement | string | null = null): void {
    let element: HTMLElement = findElement(target, globalThis.document.documentElement);
    roots                    = roots || new WeakMap<HTMLElement, ContextRoot>();
    
    roots.set(element, roots.get(element) || new ContextRoot(element));
}

/**
 * Remove context root.
 *
 * If context root does not exist on given element, function will silently skip removal.
 *
 * @param {HTMLElement|string|null} target The target element or selector which is used as context root. If not provided `document.documentElement` will be used, that is, `<html>` HTML element.
 */
export function removeContextRoot(target: HTMLElement | string | null = null): void {
    let element: HTMLElement = findElement(target, globalThis.document.documentElement);

    roots?.get(element)?.destroy();
    roots?.delete(element);
}

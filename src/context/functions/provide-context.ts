import {
    Context,
    createContext,
}                          from '@lit/context';
import { ContextProvider } from '../controllers/context-provider';
import { findElement }     from './internal';

type ElementProvidersMap = Map<Context<unknown, unknown>, ContextProvider<Context<unknown, unknown>>>;

// Registry of all providers for given HTML element.
let providers: WeakMap<HTMLElement, ElementProvidersMap> = new WeakMap<HTMLElement, ElementProvidersMap>();

/**
 * Provide context to the HTML element.
 *
 * Use this function to provide a context value to a specific HTML element. The context value
 * will be available to any child elements that consume the same context.
 *
 * This is useful for providing globally accessible services to all subnodes without
 * flickering that occurs when rendering slotted content.
 *
 * However, you may use it to turn any HTMLElement into a context provider.
 *
 * If element already provides same context, previous value will be replaced with a new one.
 *
 * @param {Context|string} context A Context identifier value created via `createContext`, or string as service identifier.
 * @param {any} value Context value.
 * @param {HTMLElement|string|null} target The HTML element or selector to provide the context to. If not provided, context will be attached to the `document.documentElement`, that is, to the `<html>` HTML element.
 *
 * @throws {Error} If element is provided as selector and could not be found within document.
 */
export function provideContext<ValueType>(
    context: Context<unknown, ValueType> | string,
    value: ValueType,
    target: HTMLElement | string | null = null,
): void {
    context                  = 'string' === typeof context ? createContext(context) : context;
    let element: HTMLElement = findElement(target, globalThis.document.documentElement);

    if (!providers.has(element)) {
        providers.set(element, new Map());
    }

    let elementProviders: ElementProvidersMap = providers.get(element) as ElementProvidersMap;
    let triggerConnected: boolean             = false;

    if (!elementProviders.has(context as Context<unknown, ValueType>)) {
        elementProviders.set(context, new ContextProvider(element, {
            context:      context,
            initialValue: value,
        }));

        triggerConnected = true;
    }

    let provider: ContextProvider<Context<unknown, ValueType>> = elementProviders.get(context as Context<unknown, ValueType>) as ContextProvider<Context<unknown, ValueType>>;

    if (provider.value !== value) {
        provider.setValue(value, true);
    }

    if (triggerConnected) {
        provider.hostConnected();
    }
}
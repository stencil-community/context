import {
    Context,
    ContextRequestEvent,
    createContext,
}                      from '../context';
import { Deferred }    from '../utils/deferred';
import { findElement } from './internal';

/**
 * Consume context by triggering context request event from arbitrary HTML element.
 *
 * You may use this function to request context starting the search from the arbitrary HTML element. If
 * element is not provided, it will start search from `<body>` element which will, in general, look for
 * globally provided contexts.
 *
 * @param {Context|string} context A Context identifier value created via `createContext`, or string as service identifier.
 * @param {HTMLElement|string|null} target The target element or selector to dispatch the context event from. If not provided, `document.body`, that is `<body>` element will be used.
 *
 * @return {Promise} Resolved promise if context is found, or rejected, if requested context does not exist on ancestor elements.
 */
export async function consumeContext<ValueType>(
    context: Context<unknown, ValueType> | string,
    target: HTMLElement | string | null = null,
): Promise<ValueType> {
    let element: HTMLElement          = findElement(target, globalThis.document.body);
    let deferred: Deferred<ValueType> = new Deferred<ValueType>();

    element.dispatchEvent(new ContextRequestEvent<Context<unknown, ValueType>>(
        'string' === typeof context ? createContext(context) : context,
        element,
        (value: ValueType): void => {
            deferred.resolve(value);
        },
        false,
    ));

    Promise.resolve().then((): void => {
        if (deferred.pending) {
            deferred.reject(new Error(`Context "${context}" could not be found.`));
        }
    });

    return deferred.promise
}

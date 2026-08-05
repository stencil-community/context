import {
    Context,
    ContextCallback,
    ContextEvent as ContextConsumerEvent,
}                               from '@lit/context';
import { ContextProviderEvent } from '../controllers/context-provider';

export class ContextRoot {

    private _pending: PendingRequests = new PendingRequests();

    public constructor(private readonly _root: HTMLElement) {
        this._root.addEventListener('context-request', this._onContextRequest);
        this._root.addEventListener('context-provider', this._onContextProvider);
    }

    public destroy(): void {
        this._pending.clear();
        this._root.removeEventListener('context-request', this._onContextRequest);
        this._root.removeEventListener('context-provider', this._onContextProvider);
    }

    private _onContextRequest: OnContextRequestFn = (event: ContextConsumerEvent<Context<unknown, unknown>>): void => {
        let element: HTMLElement = (event.contextTarget ?? event.composedPath()[0]) as HTMLElement;

        // This is already tracked.
        if (this._pending.has(event.context, element, event.callback)) {
            return;
        }
        
        this._pending.set(event.context, element, event.callback, event.subscribe || false);
    }

    private _onContextProvider: OnContextProviderFn = (event: ContextProviderEvent<Context<unknown, unknown>>): void => {
        for (let {element, callback, subscribe} of this._pending.iterate(event.context)) {
            element.dispatchEvent(
                new ContextConsumerEvent(
                    event.context,
                    element,
                    callback,
                    subscribe,
                ),
            );
        }
    }
}


type OnContextRequestFn = (event: ContextConsumerEvent<Context<unknown, unknown>>) => void;
type OnContextProviderFn = (event: ContextProviderEvent<Context<unknown, unknown>>) => void;

type RequestsLedger = {
    callbacks: WeakMap<HTMLElement, WeakSet<ContextCallback<unknown>>>,
    requests: Array<{
        elementRef: WeakRef<HTMLElement>,
        callbackRef: WeakRef<ContextCallback<unknown>>,
        subscribe: boolean,
    }>
};

class PendingRequests {

    private _pending: Map<Context<unknown, unknown>, RequestsLedger> = new Map<Context<unknown, unknown>, RequestsLedger>();

    public has(context: Context<unknown, unknown>, element: HTMLElement, callback: ContextCallback<unknown>): boolean {
        let ledger: RequestsLedger | null = this._pending.get(context) || null;

        if (null === ledger) {
            return false;
        }

        return ledger.callbacks.get(element)?.has(callback) || false;
    }

    public set(
        context: Context<unknown, unknown>,
        element: HTMLElement,
        callback: ContextCallback<unknown>,
        subscribe: boolean,
    ): void {
        let ledger: RequestsLedger = this._pending.get(context) || {
            callbacks: new WeakMap<HTMLElement, WeakSet<ContextCallback<unknown>>>(),
            requests:  [],
        }

        // We already track this callback for element/context pair
        if (ledger.callbacks.get(element)?.has(callback)) {
            return;
        }

        if (!ledger.callbacks.has(element)) {
            ledger.callbacks.set(element, new WeakSet<ContextCallback<unknown>>());
        }

        (ledger.callbacks.get(element) as WeakSet<ContextCallback<unknown>>).add(callback);

        ledger.requests.push({
            elementRef: new WeakRef<HTMLElement>(element),
            callbackRef: new WeakRef<ContextCallback<unknown>>(callback),
            subscribe: subscribe
        })

        this._pending.set(context, ledger);
    }

    public *iterate(context: Context<unknown, unknown>): IterableIterator<any> {
        let ledger: RequestsLedger | null = this._pending.get(context) || null;

        if (null === ledger) {
            return;
        }

        this._pending.delete(context);

        for (let {elementRef, callbackRef, subscribe} of ledger.requests) {
            let element: HTMLElement | null = elementRef.deref() || null;
            let callback: ContextCallback<unknown> | null = callbackRef.deref() || null;

            if (element === null || callback === null) {
                continue;
            }

            yield { element, callback, subscribe };
        }
    }

    public clear(): void {
        this._pending.clear();
    }
}
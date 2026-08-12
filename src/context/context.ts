export type Context<KeyType, ValueType> = KeyType & { __context__: ValueType };

export type ContextType<Key extends Context<unknown, unknown>> = Key extends Context<unknown, infer ValueType> ? ValueType : never;

export function createContext<ValueType, K = unknown>(key: K) {
    return key as Context<K, ValueType>;
}

export type ContextCallback<ValueType> = (
    value: ValueType,
    unsubscribe?: () => void,
) => void;

export class ContextRequestEvent<C extends Context<unknown, unknown>> extends Event {
    public readonly context: C;
    public readonly contextTarget: Element;
    public readonly callback: ContextCallback<ContextType<C>>;
    public readonly subscribe?: boolean;

    /**
     *
     * @param context the context key to request
     * @param contextTarget the original context target of the requester
     * @param callback the callback that should be invoked when the context with the specified key is available
     * @param subscribe when, true indicates we want to subscribe to future updates
     */
    public constructor(
        context: C,
        contextTarget: Element,
        callback: ContextCallback<ContextType<C>>,
        subscribe?: boolean,
    ) {
        super('context-request', {bubbles: true, composed: true});
        this.context       = context;
        this.contextTarget = contextTarget;
        this.callback      = callback;
        this.subscribe     = subscribe ?? false;
    }
}

/**
 * @see https://github.com/lit/lit/blob/main/packages/context/src/lib/controllers/context-provider.ts#L43
 */
export interface ContextProviderOptions<C extends Context<unknown, unknown>> {
    context: C;
    initialValue?: ContextType<C>;
}

/**
 * @see https://github.com/lit/lit/blob/main/packages/context/src/lib/controllers/context-provider.ts#L25
 */
export class ContextProviderEvent<C extends Context<unknown, unknown>> extends Event {

    public constructor(
        public readonly context: C,
        public readonly contextTarget: Element,
    ) {
        super('context-provider', {
            bubbles:  true,
            composed: true,
        });
    }
}
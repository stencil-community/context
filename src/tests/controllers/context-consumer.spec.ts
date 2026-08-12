import {
    Context,
    createContext,
    ContextConsumer,
    provideContext,
}                         from '../../';
import { createDocument } from '@stencil/mock-doc';
import {
    afterEach,
    beforeEach,
    expect,
    vi,
}                         from '@stencil/vitest';
import {
    describe,
    test,
}                         from 'vitest';

describe('ContextConsumer', (): void => {

    let document: Document;
    let context: Context<'foo', string>;
    let consumer: HTMLElement;
    let collected: string[];

    beforeEach((): void => {
        document  = createDocument(`
            <div id='provider'>
                <div id='consumer'></div>
            </div>
               
        `);
        context   = createContext('foo');
        consumer  = document.querySelector('#consumer') as HTMLElement;
        collected = [];

        vi.stubGlobal('document', document);
    });

    afterEach((): void => {
        vi.unstubAllGlobals();
    });

    test('It will consume context once.', (): void => {
        provideContext(context, 'bar');

        let controller: ContextConsumer<Context<'foo', string>> = new ContextConsumer(consumer, {
            context:   context,
            callback:  (value: string): void => {
                collected.push(value);
            },
            subscribe: false,
        });

        expect(collected.length).toStrictEqual(0);

        controller.hostConnected();

        expect(collected).toStrictEqual(['bar']);
        expect(controller.value).toStrictEqual('bar');

        provideContext(context, 'baz');

        expect(collected).toStrictEqual(['bar']);
        expect(controller.value).toStrictEqual('bar');
    });

    test('It will subscribe to context value change.', (): void => {
        provideContext(context, 'bar');

        let controller: ContextConsumer<Context<'foo', string>> = new ContextConsumer(consumer, {
            context:   context,
            callback:  (value: string): void => {
                collected.push(value);
            },
            subscribe: true,
        });

        expect(collected.length).toStrictEqual(0);

        controller.hostConnected();

        expect(collected).toStrictEqual(['bar']);
        expect(controller.value).toStrictEqual('bar');

        provideContext(context, 'baz');

        expect(collected).toStrictEqual(['bar', 'baz']);
        expect(controller.value).toStrictEqual('baz');
    });

    test('It will unsubscribe from context.', (): void => {
        provideContext(context, 'bar');

        let controller: ContextConsumer<Context<'foo', string>> = new ContextConsumer(consumer, {
            context:   context,
            callback:  (value: string): void => {
                collected.push(value);
            },
            subscribe: true,
        });

        expect(collected.length).toStrictEqual(0);

        controller.hostConnected();

        expect(collected).toStrictEqual(['bar']);
        expect(controller.value).toStrictEqual('bar');

        controller.hostDisconnected();

        provideContext(context, 'baz');

        expect(collected).toStrictEqual(['bar']);
        expect(controller.value).toStrictEqual('bar');
    });

    test('It will change provider.', (): void => {
        provideContext(context, 'bar');

        let controller: ContextConsumer<Context<'foo', string>> = new ContextConsumer(consumer, {
            context:   context,
            callback:  (value: string): void => {
                collected.push(value);
            },
            subscribe: true,
        });

        expect(collected.length).toStrictEqual(0);

        controller.hostConnected();

        expect(collected).toStrictEqual(['bar']);
        expect(controller.value).toStrictEqual('bar');

        provideContext(context, 'baz', document.querySelector('#provider') as HTMLElement);

        expect(collected).toStrictEqual(['bar', 'baz']);
        expect(controller.value).toStrictEqual('baz');
    });

});
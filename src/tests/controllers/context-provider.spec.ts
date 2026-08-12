import {
    Context,
    ContextRequestEvent,
    createContext,
    ContextProvider,
    consumeContext,
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

describe('ContextProvider', (): void => {

    let document: Document;
    let context: Context<'foo', string>;
    let provider: HTMLElement;
    let consumer: HTMLElement;

    beforeEach((): void => {
        document = createDocument(`
            <div id='provider'>
                <div id='consumer'></div>
            </div>
               
        `);
        context  = createContext('foo');
        provider = document.querySelector('#provider') as HTMLElement;
        consumer = document.querySelector('#consumer') as HTMLElement;

        vi.stubGlobal('document', document);
    });

    afterEach((): void => {
        vi.unstubAllGlobals();
    });

    test('It will provide context once.', async (): Promise<void> => {
        let controller: ContextProvider<Context<'foo', string>> = new ContextProvider(provider, {
            context:      context,
            initialValue: 'bar',
        });

        await expect(consumeContext(context, consumer)).rejects.toThrow('Context "foo" could not be found.');

        controller.hostConnected();

        await expect(consumeContext(context, consumer)).resolves.toBe('bar');
    });

    test('It will stop providing context.', async (): Promise<void> => {
        let controller: ContextProvider<Context<'foo', string>> = new ContextProvider(provider, {
            context:      context,
            initialValue: 'bar',
        });

        controller.hostConnected();

        await expect(consumeContext(context, consumer)).resolves.toBe('bar');

        controller.hostDisconnected();

        await expect(consumeContext(context, consumer)).rejects.toThrow('Context "foo" could not be found.');
    });

    test('It will provide value updated on subscribed consumer.', async (): Promise<void> => {
        let collected: string[]                                 = [];
        let controller: ContextProvider<Context<'foo', string>> = new ContextProvider(provider, {
            context:      context,
            initialValue: 'bar',
        });

        controller.hostConnected();

        consumer.dispatchEvent(new ContextRequestEvent(
            context,
            consumer,
            (value: string): void => {
                collected.push(value);
            },
            true,
        ));

        controller.setValue('baz');
        controller.setValue('qux');

        expect(collected).toStrictEqual(['bar', 'baz', 'qux']);
    });

    test('It will ignore unmatching context.', async (): Promise<void> => {
        let controller: ContextProvider<Context<'foo', string>> = new ContextProvider(provider, {
            context:      context,
            initialValue: 'bar',
        });

        controller.hostConnected();

        await expect(consumeContext(createContext('bar'), consumer)).rejects.toThrow('Context "bar" could not be found.');
    });

    test('It does not provide context to itself.', async (): Promise<void> => {
        let controller: ContextProvider<Context<'foo', string>> = new ContextProvider(provider, {
            context:      context,
            initialValue: 'bar',
        });

        controller.hostConnected();

        await expect(consumeContext(context, provider)).rejects.toThrow('Context "foo" could not be found.');
    });
});
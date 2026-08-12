import {
    Context,
    createContext,
    consumeContext,
    provideContext,
}                         from '../../';
import { createDocument } from '@stencil/mock-doc';
import {
    afterEach,
    beforeEach,
    vi,
}                         from '@stencil/vitest';
import {
    describe,
    expect,
    test,
}                         from 'vitest';

describe('createContextRoot() and removeContextRoot()', (): void => {

    let document: Document;
    let context: Context<'foo', string>;
    let consumer: HTMLElement;
    let provider: HTMLElement;

    beforeEach((): void => {
        document = createDocument(`
            <body>
                <div id='provider'></div>
                <div id='consumer'></div>
            </body>
        `);
        context  = createContext('foo');
        consumer = document.querySelector('#consumer') as HTMLElement;
        provider = document.querySelector('#provider') as HTMLElement;

        vi.stubGlobal('document', document);
    });

    afterEach((): void => {
        vi.unstubAllGlobals();
    });

    test('It will consume context using given element.', async (): Promise<void> => {
        provideContext(context, 'bar');

        await expect(consumeContext(context, consumer)).resolves.toStrictEqual('bar')
    });

    test('It will consume context using element selector.', async (): Promise<void> => {
        provideContext(context, 'bar');

        await expect(consumeContext(context, '#consumer')).resolves.toStrictEqual('bar')
    });

    test('It will fail to consume context.', async (): Promise<void> => {
        provideContext(context, 'bar', provider);

        await expect(consumeContext(context, consumer)).rejects.toThrow();
    });

    test('It will throw error for invalid selector.', async (): Promise<void> => {
        await expect(consumeContext(context, '#foo')).rejects.toThrow('Element could not be found using selector "#foo".');
    });

});
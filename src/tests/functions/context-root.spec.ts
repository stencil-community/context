import {
    Context,
    ContextRequestEvent,
    createContext,
    createContextRoot,
    removeContextRoot,
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
    let collected: string[];
    let consumer: HTMLElement;
    let provider: HTMLElement;

    beforeEach((): void => {
        document  = createDocument(`
            <div id='provider'>
                <div id='consumer'></div>
            </div>
        `);
        context   = createContext('foo');
        consumer  = document.querySelector('#consumer') as HTMLElement;
        provider  = document.querySelector('#provider') as HTMLElement;
        collected = [];

        vi.stubGlobal('document', document);
    });

    afterEach((): void => {
        vi.unstubAllGlobals();
    });

    test('It will create context root only once.', (): void => {
        createContextRoot();
        createContextRoot();

        consumer.dispatchEvent(new ContextRequestEvent(context, consumer, (value: string): void => {
            collected.push(value);
        }, true));

        provideContext(context, 'bar', provider);

        expect(collected).toStrictEqual(['bar']);
    });

    test('It will destroy context root', (): void => {
        createContextRoot();

        consumer.dispatchEvent(new ContextRequestEvent(context, consumer, (value: string): void => {
            collected.push(value);
        }, true));

        removeContextRoot();

        provideContext(context, 'bar', provider);

        expect(collected.length).toStrictEqual(0);
    });
});
import {
    Context,
    ContextEvent as ContextConsumerEvent,
    createContext,
} from '@lit/context';
import { createDocument }    from '@stencil/mock-doc';
import {
    afterEach,
    beforeEach,
    vi,
} from '@stencil/vitest';
import {
    describe,
    expect,
    test,
}                         from 'vitest';
import {
    createContextRoot,
    removeContextRoot,
} from '../../context/functions/context-root';
import { provideContext } from '../../context/functions/provide-context';

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
        consumer = document.querySelector('#consumer') as HTMLElement;
        provider = document.querySelector('#provider') as HTMLElement;
        collected = [];

        vi.stubGlobal('document', document);
    });

    afterEach((): void => {
        vi.unstubAllGlobals();
    });
    
    test('It will create context root only once.', async (): Promise<void> => {
        createContextRoot();
        createContextRoot();

        consumer.dispatchEvent(new ContextConsumerEvent(context, consumer, (value: string): void => {
            collected.push(value);
        }, true));

        await Promise.resolve();
        
        provideContext(context, 'bar', provider);

        await Promise.resolve();
        
        expect(collected).toStrictEqual(['bar']);
    });
    
    test('It will destroy context root', async (): Promise<void> => {
        createContextRoot();

        consumer.dispatchEvent(new ContextConsumerEvent(context, consumer, (value: string): void => {
            collected.push(value);
        }, true));

        await Promise.resolve();

        removeContextRoot();

        await Promise.resolve();

        provideContext(context, 'bar', provider);

        await Promise.resolve();

        expect(collected.length).toStrictEqual(0);
    });
});
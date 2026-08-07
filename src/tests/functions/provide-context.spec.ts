import {
    Context,
    createContext,
    ContextEvent as ContextConsumerEvent,
}                         from '@lit/context';
import { createDocument } from '@stencil/mock-doc';
import {
    beforeEach,
    afterEach,
    expect,
    vi,
}                         from '@stencil/vitest';
import {
    describe,
    test,
}                         from 'vitest';
import { provideContext } from '../../context/functions/provide-context';

describe('provideContext()', (): void => {

    let document: Document;
    let context: Context<'foo', string>;
    let collected: string[];

    beforeEach((): void => {
        document  = createDocument(`
            <div id='provider'>
                <div id='consumer'></div>
            </div>
            <div id="unsettled"></div>
        `);
        context   = createContext('foo');
        collected = [];

        vi.stubGlobal('document', document);
    });

    afterEach((): void => {
        vi.unstubAllGlobals();
    });

    test('It will provide context to the provider element by query selector.', (): void => {
        let consumer: HTMLElement = document.querySelector('#consumer') as HTMLElement;
        let unsettled: HTMLElement = document.querySelector('#unsettled') as HTMLElement;
        
        provideContext(context, 'bar', '#provider');
        
        consumer.dispatchEvent(new ContextConsumerEvent(context, consumer, (value: string): void => {
            collected.push(value);
        }));
        
        unsettled.dispatchEvent(new ContextConsumerEvent(context, consumer, (value: string): void => {
            collected.push(value);
        }))

        expect(collected).toStrictEqual(['bar']);
    });

    test('It will provide context to the document.', (): void => {
        let consumer: HTMLElement = document.querySelector('#consumer') as HTMLElement;
        let unsettled: HTMLElement = document.querySelector('#unsettled') as HTMLElement;

        provideContext(context, 'bar');

        consumer.dispatchEvent(new ContextConsumerEvent(context, consumer, (value: string): void => {
            collected.push(value);
        }));

        unsettled.dispatchEvent(new ContextConsumerEvent(context, consumer, (value: string): void => {
            collected.push(value);
        }))

        expect(collected).toStrictEqual(['bar', 'bar']);
    });
    
    test('It will provide context to the given element.', (): void => {
        let consumer: HTMLElement = document.querySelector('#consumer') as HTMLElement;
        
        provideContext(context, 'bar', document.querySelector('#provider') as HTMLElement);
        
        consumer.dispatchEvent(new ContextConsumerEvent(context, consumer, (value: string): void => {
            collected.push(value);
        }));

        expect(collected).toStrictEqual(['bar']);
    });
    
    test('It targets element correctly.', (): void => {
        let unsettled: HTMLElement = document.querySelector('#unsettled') as HTMLElement;

        provideContext(context, 'bar', '#provider');

        unsettled.dispatchEvent(new ContextConsumerEvent(context, unsettled, (value: string): void => {
            collected.push(value);
        }));

        expect(collected.length).toStrictEqual(0);
    });

    test('It updates same context with new value element correctly.', (): void => {
        let consumer: HTMLElement = document.querySelector('#consumer') as HTMLElement;

        provideContext(context, 'bar', '#provider');

        consumer.dispatchEvent(new ContextConsumerEvent(context, consumer, (value: string): void => {
            collected.push(value);
        }, true));

        expect(collected).toStrictEqual(['bar']);
        
        provideContext(context, 'baz', '#provider');
        
        expect(collected).toStrictEqual(['bar', 'baz']);
    });
    
    test('It throws exception when element could not be found', (): void => {
        expect((): void => provideContext(context, 'bar', '#nonexistent'))
            .toThrow(`Element could not be found using selector "#nonexistent".`);
    });
});
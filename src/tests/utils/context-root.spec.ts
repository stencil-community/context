import {
    Context,
    ContextEvent as ContextConsumerEvent,
    createContext,
}                               from '@lit/context';
import { createDocument }       from '@stencil/mock-doc';
import { beforeEach }           from '@stencil/vitest';
import {
    test,
    expect,
    describe,
}                               from 'vitest';
import { ContextProviderEvent } from '../../context/controllers/context-provider';
import { ContextRoot }          from '../../context/utils/context-root';

describe('ContextRoot', (): void => {

    describe('Context request settles.', (): void => {
        let document: Document;
        let root: HTMLElement;
        let provider: HTMLElement;
        let consumer: HTMLElement;
        let provided: Event[];
        let context: Context<'foo', string> = createContext('foo');

        beforeEach((): void => {
            document = createDocument(`
                <div id='root'>
                    <div id='provider'>
                        <div id='consumer'></div>              
                    </div>
                </div>`,
            );
            root     = document.getElementById('root') as HTMLElement;
            provider = document.getElementById('provider') as HTMLElement;
            consumer = document.getElementById('consumer') as HTMLElement;
            provided = [];

            ContextRoot.create(root);
        });

        test('It will provide context to consumer as soon provider is registered.', async (): Promise<void> => {

            consumer.dispatchEvent(new ContextConsumerEvent(context, consumer, (): void => {
                // noop.
            }, true));

            await Promise.resolve();

            expect(provided.length).toStrictEqual(0);

            provider.addEventListener('context-request', (event: Event): void => {
                provided.push(event);
            });

            provider.dispatchEvent(new ContextProviderEvent(context, provider))

            await Promise.resolve();

            expect(provided.length).toStrictEqual(1);
            expect(provided[0]).toBeInstanceOf(ContextConsumerEvent);
            expect(provided[0].target).toStrictEqual(consumer);
            expect((provided[0] as ContextConsumerEvent<Context<unknown, unknown>>).context).toStrictEqual(context);
            expect((provided[0] as ContextConsumerEvent<Context<unknown, unknown>>).subscribe).toStrictEqual(true);
        });

        test('It will provide context to consumer only once for same context and callback resolving first unsettled request', async (): Promise<void> => {
            let callback: () => void = (): void => {
            };

            consumer.dispatchEvent(new ContextConsumerEvent(context, consumer, callback, false));
            consumer.dispatchEvent(new ContextConsumerEvent(context, consumer, callback, true));

            await Promise.resolve();

            provider.addEventListener('context-request', (event: Event): void => {
                provided.push(event);
            });

            provider.dispatchEvent(new ContextProviderEvent(context, provider))

            await Promise.resolve();

            expect(provided.length).toStrictEqual(1);
            expect(provided[0]).toBeInstanceOf(ContextConsumerEvent);
            expect(provided[0].target).toStrictEqual(consumer);
            expect((provided[0] as ContextConsumerEvent<Context<unknown, unknown>>).context).toStrictEqual(context);
            expect((provided[0] as ContextConsumerEvent<Context<unknown, unknown>>).subscribe).toStrictEqual(false);
        });

        test('It will provide context to consumer for each callback', async (): Promise<void> => {
            consumer.dispatchEvent(new ContextConsumerEvent(context, consumer, (): void => {
            }, false));
            consumer.dispatchEvent(new ContextConsumerEvent(context, consumer, (): void => {
            }, true));

            await Promise.resolve();

            provider.addEventListener('context-request', (event: Event): void => {
                provided.push(event);
            });

            provider.dispatchEvent(new ContextProviderEvent(context, provider))

            await Promise.resolve();

            expect(provided.length).toStrictEqual(2);
        });
    });


    describe('Context request remains unsettled.', (): void => {

        test('It does not provide context to sibling consumer.', async (): Promise<void> => {
            let document: Document              = createDocument(`
                <div id='root'>
                    <div id='provider'></div>
                    <div id='consumer'></div>              
                </div>`,
            );
            let root: HTMLElement               = document.getElementById('root') as HTMLElement;
            let provider: HTMLElement           = document.getElementById('provider') as HTMLElement;
            let consumer: HTMLElement           = document.getElementById('consumer') as HTMLElement;
            let context: Context<'foo', string> = createContext('foo');
            let provided: Event[]               = [];

            ContextRoot.create(root);

            consumer.dispatchEvent(new ContextConsumerEvent(context, consumer, (): void => {
                // noop.
            }, true));

            await Promise.resolve();

            provider.addEventListener('context-request', (event: Event): void => {
                provided.push(event);
            });

            provider.dispatchEvent(new ContextProviderEvent(context, provider))

            await Promise.resolve();

            expect(provided.length).toStrictEqual(0);
        });

        test('It does not provide wrong context.', async (): Promise<void> => {
            let document: Document    = createDocument(`
                <div id='root'>
                    <div id='provider'>
                        <div id='consumer'></div>     
                    </div>                          
                </div>`,
            );
            let root: HTMLElement     = document.getElementById('root') as HTMLElement;
            let provider: HTMLElement = document.getElementById('provider') as HTMLElement;
            let consumer: HTMLElement = document.getElementById('consumer') as HTMLElement;
            let provided: Event[]     = [];

            ContextRoot.create(root);

            consumer.dispatchEvent(new ContextConsumerEvent(createContext('foo'), consumer, (): void => {
                // noop.
            }, true));

            await Promise.resolve();

            provider.addEventListener('context-request', (event: Event): void => {
                provided.push(event);
            });

            provider.dispatchEvent(new ContextProviderEvent(createContext('bar'), provider))

            await Promise.resolve();

            expect(provided.length).toStrictEqual(0);
        });

        test('It does not provide context when destroyed.', async (): Promise<void> => {
            let document: Document              = createDocument(`
                <div id='root'>
                    <div id='provider'>
                        <div id='consumer'></div>     
                    </div>                          
                </div>`,
            );
            let root: HTMLElement               = document.getElementById('root') as HTMLElement;
            let provider: HTMLElement           = document.getElementById('provider') as HTMLElement;
            let consumer: HTMLElement           = document.getElementById('consumer') as HTMLElement;
            let provided: Event[]               = [];
            let context: Context<'foo', string> = createContext('foo');
            let contextRoot: ContextRoot        = ContextRoot.create(root);

            consumer.dispatchEvent(new ContextConsumerEvent(context, consumer, (): void => {
                // noop.
            }, true));

            await Promise.resolve();
            
            contextRoot.destroy();

            provider.addEventListener('context-request', (event: Event): void => {
                provided.push(event);
            });

            provider.dispatchEvent(new ContextProviderEvent(context, provider))

            await Promise.resolve();

            expect(provided.length).toStrictEqual(0);
        });

    })

});



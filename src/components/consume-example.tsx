import {
    Component,
    State,
    Host,
    h,
    ComponentInterface,
}                         from '@stencil/core';
import { Consume }        from '../context/decorator/consume';
import { consumeContext } from '../context/functions/consume-context';
import {
    ErrorLogger,
    logger,
    Logger,
}                         from './logger';

@Component({
    tag:    'consume-example',
    shadow: true,
})
export class ConsumeExample implements ComponentInterface {

    @State()
    @Consume('error_logger')
    private errorLogger!: ErrorLogger;

    @Consume(logger, {
        unprovided: 'wait',
    })
    private logger!: Logger;

    private handleClick = (): void => {
        this.errorLogger.error('Button clicked');
        this.logger.log('Clicked');

        consumeContext<ErrorLogger>('error_logger').then((logger: ErrorLogger) => {
            logger.error('From global consume-context');
        });
    }

    public render(): any {
        return (
            <Host>
                <button
                    onClick={this.handleClick}
                    type='button'
                >
                    Log Error
                </button>
                <slot />
            </Host>
        );
    }
}

import {
    Component,
    State,
    Host,
    h,
    ComponentInterface,
    Method,
}                  from '@stencil/core';
import { Consume } from '../../';
import {
    ErrorLogger,
    DebugLogger,
    DEBUG_LOGGER,
    ERROR_LOGGER,
}                  from './logger';

@Component({
    tag:    'consume-example',
    shadow: true,
})
export class ConsumeExample implements ComponentInterface {

    public static UNPROVIDED: 'ignore' | 'wait' | 'error' = 'ignore';

    public static SUBSCRIBE: boolean = false;

    @State()
    @Consume(ERROR_LOGGER, {
        unprovided: ConsumeExample.UNPROVIDED,
        subscribe:  ConsumeExample.SUBSCRIBE,
    })
    private _errorLogger!: ErrorLogger;

    @Consume(DEBUG_LOGGER, {
        unprovided: ConsumeExample.UNPROVIDED,
        subscribe:  ConsumeExample.SUBSCRIBE,
    })
    private _debugLogger!: DebugLogger;

    @Method()
    public async getDebugLogger(): Promise<DebugLogger> {
        return this._debugLogger;
    }

    @Method()
    public async getErrorLogger(): Promise<ErrorLogger> {
        return this._errorLogger;
    }

    public connectedCallback(): void {
        try {
            this._debugLogger.debug('Component connected!');
        } catch (error: unknown) {
            this._errorLogger.error('Debug logger not available in connected callback.');
        }
    }

    public componentWillLoad(): Promise<void> | void {
        try {
            this._debugLogger.debug('Component will load!');
        } catch (error: unknown) {
            this._errorLogger.error('Debug logger not available in componentWillLoad.');
        }
    }

    private _handleClick = (): void => {
        try {
            this._debugLogger.debug('Button clicked');
        } catch (error: unknown) {
            this._errorLogger.error('Debug logger not available in button click handler.');
        }
    }

    public render(): any {
        return (
            <Host>
                <button
                    onClick={this._handleClick}
                    type='button'
                >
                    Click to log.
                </button>
                <slot />
            </Host>
        );
    }
}

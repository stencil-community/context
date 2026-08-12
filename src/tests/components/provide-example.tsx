import {
    Component,
    Host,
    h,
    ComponentInterface,
    Prop,
}                  from '@stencil/core';
import { Provide } from '../../';
import {
    DebugLogger,
    DEBUG_LOGGER,
}                  from './logger';

@Component({
    tag:    'provide-example',
    shadow: true,
})
export class ProvideExample implements ComponentInterface {

    @Prop()
    public get section(): string {
        return this._logger.section;
    }

    public set section(value: string) {
        this._logger.section = value;
    }

    @Provide(DEBUG_LOGGER)
    private readonly _logger: DebugLogger = new DebugLogger();

    public render(): any {
        return (
            <Host>
                <slot />
            </Host>
        )
    }
}

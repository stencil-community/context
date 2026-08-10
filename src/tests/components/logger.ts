import {
    Context,
    createContext,
} from '@lit/context';

export class DebugLogger {

    public section: string = 'Unspecified';

    public emitted: string[] = [];

    public constructor(section?: string) {
        this.section = section ?? this.section;
    }

    public debug(message: string): void {
        message = `[DEBUG][${this.section}] ${message}`;
        console.debug(message);
        this.emitted.push(message);
    }
}

export class ErrorLogger {

    public section: string = 'Unspecified';

    public emitted: string[] = [];

    public constructor(section?: string) {
        this.section = section ?? this.section;
    }

    public error(message: string): void {
        message = `[ERROR][${this.section}] ${message}`;
        console.error(message);
        this.emitted.push(message);
    }
}


export const DEBUG_LOGGER: Context<unknown, DebugLogger> = createContext<DebugLogger>(Symbol.for('debug'));
export const ERROR_LOGGER: Context<unknown, ErrorLogger> = createContext<ErrorLogger>(Symbol.for('error'));
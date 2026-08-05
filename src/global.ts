import {
    createContextRoot,
    removeContextRoot,
    createContext,
    provideContext,
    consumeContext,
} from './index';

export default function global(): void {
    createContextRoot();

    (globalThis as any).createContextRoot = createContextRoot;
    (globalThis as any).removeContextRoot = removeContextRoot;
    (globalThis as any).createContext     = createContext;
    (globalThis as any).provideContext    = provideContext;
    (globalThis as any).consumeContext    = consumeContext;
}

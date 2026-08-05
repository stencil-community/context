type ResolveFn<T> = (value: T | PromiseLike<T>) => void;
type RejectFn = (reason?: any) => void;

/**
 * Deferred/promise object through which store will be provided.
 *
 * Inspired by: https://api.jquery.com/category/deferred-object/
 */
export class Deferred<T> implements Promise<T> {

    public readonly [Symbol.toStringTag]: string = 'Promise';

    public get pending(): boolean {
        return 'pending' === this._status;
    }

    public get fulfilled(): boolean {
        return 'pending' !== this._status;
    }

    public get resolved(): boolean {
        return 'resolved' === this._status;
    }

    public get rejected(): boolean {
        return 'rejected' === this._status;
    }

    private readonly _promise: Promise<T>;

    private _resolve!: ResolveFn<T>;

    private _reject!: RejectFn;

    private _status: 'pending' | 'resolved' | 'rejected' = 'pending';

    public constructor() {
        this._promise = new Promise<T>((resolve: ResolveFn<T>, reject: RejectFn): void => {
            this._resolve = resolve;
            this._reject  = reject;
        });
    }

    public get promise(): Promise<T> {
        return this._promise;
    }

    public resolve: ResolveFn<T> = (value: T | PromiseLike<T>): void => {
        this._resolve(value);
        this._status = 'resolved';
    };

    public reject: RejectFn = (reason?: any): void => {
        this._reject(reason);
        this._status = 'rejected';
    };

    public then<TResult1 = T, TResult2 = never>(onFulfilled?: ((value: T) => (PromiseLike<TResult1> | TResult1)) | undefined | null, onRejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | undefined | null): Promise<TResult1 | TResult2> {
        return this._promise.then(onFulfilled, onRejected);
    }

    public catch<TResult = never>(onRejected?: ((reason: any) => (PromiseLike<TResult> | TResult)) | undefined | null): Promise<T | TResult> {
        return this._promise.catch(onRejected);
    }

    public finally(onFinally?: (() => void) | undefined | null): Promise<T> {
        return this._promise.finally(onFinally);
    }
}

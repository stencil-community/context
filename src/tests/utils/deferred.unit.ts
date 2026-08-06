import { Deferred } from '../../context/utils/deferred';
import {
    describe,
    it,
    expect,
}                   from '@stencil/vitest';

describe('Deferred', (): void => {

    it('expect promise state to be "pending" on initialization', (): void => {
        let deferred: Deferred<void> = new Deferred<void>();

        expect(deferred.pending).toStrictEqual(true);

        deferred.resolve();

        expect(deferred.pending).toStrictEqual(false);
    });

    describe('Deferred.resolve', async (): Promise<void> => {

        it('expect to resolve resolve promise and set status to "resolved"', async (): Promise<void> => {
            let deferred: Deferred<boolean> = new Deferred<boolean>();

            expect(deferred.resolved).toStrictEqual(false);

            deferred.resolve(true);

            await expect(deferred.promise).resolves.toStrictEqual(true);
            await expect(deferred).resolves.toStrictEqual(true);

            expect(deferred.resolved).toStrictEqual(true);
        });
    });

    describe('Deferred.reject', (): void => {
        it('expect to reject the promise and set status to "rejected"', async (): Promise<void> => {
            let deferred: Deferred<any> = new Deferred<any>();
            let error: Error            = new Error();

            expect(deferred.rejected).toStrictEqual(false);

            deferred.reject(error);

            await expect(deferred.promise).rejects.toStrictEqual(error);
            await expect(deferred).rejects.toStrictEqual(error);


            expect(deferred.rejected).toStrictEqual(true);
        });
    });

    describe('Deferred.finally', (): void => {
        it('expect to invoke finally on resolve', (): Promise<void> => {
            let deferred: Deferred<boolean> = new Deferred<boolean>();

            return new Promise((resolve: () => void): void => {

                deferred.finally((): void => {
                    resolve();
                });

                deferred.resolve(true);
            });
        }, 10);

        it('expect to invoke finally on reject', (): Promise<void> => {
            let deferred: Deferred<any> = new Deferred<any>();

            return new Promise((resolve: () => void): void => {

                deferred.promise.then(() => {
                }).catch((): void => {
                    // noop.
                }).finally((): void => {
                    resolve();
                });

                deferred.reject();
            });
        }, 10);
    });

    describe('Deferred.fulfilled', (): void => {
        it('expect to fulfill promise on resolve', (): void => {
            let deferred: Deferred<void> = new Deferred<void>();

            expect(deferred.fulfilled).toStrictEqual(false);

            deferred.resolve();

            expect(deferred.fulfilled).toStrictEqual(true);
        });

        it('expect to fulfill promise on rejected', (): void => {
            let deferred: Deferred<any> = new Deferred<any>();

            expect(deferred.fulfilled).toStrictEqual(false);

            deferred.then((): void => {
                // noop.
            }).catch((): void => {
                // noop.
            });

            deferred.reject();

            expect(deferred.fulfilled).toStrictEqual(true);
        });
    });

});

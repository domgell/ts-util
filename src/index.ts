// -------------------------------------- assert ---------------------------------------

export function fail(msg?: string): never {
    throw new Error(msg);
}

export function assert(condition: boolean, msg?: string): asserts condition {
    if (!condition) {
        fail(msg);
    }
}

// ------------------------------------ TypedArray -------------------------------------

export type TypedArray =
    | Float32Array
    | Uint32Array
    | Int32Array
    | Uint16Array
    | Int16Array
    | Uint8Array
    | Int8Array
    | Uint8ClampedArray
    | Float64Array
    | BigInt64Array
    | BigUint64Array;

export type TypedArrayNonBigInt =
    | Float32Array
    | Uint32Array
    | Int32Array
    | Uint16Array
    | Int16Array
    | Uint8Array
    | Int8Array
    | Uint8ClampedArray
    | Float64Array

export function isTypedArray(obj: unknown): obj is TypedArray {
    return ArrayBuffer.isView(obj) && !(obj instanceof DataView);
}

export function isTypedArrayNonBigInt(obj: unknown): obj is TypedArrayNonBigInt {
    return isTypedArray(obj) && !(obj instanceof BigInt64Array || obj instanceof BigUint64Array);
}

// ------------------------------------- Is Array --------------------------------------

export function isArray(obj: unknown): obj is Array<any> {
    return Array.isArray(obj);
}

// ------------------------------- Array To Intersection -------------------------------

export type ArrayToIntersection<T extends any[]> =
    T extends [infer First, ...infer Rest]
        ? First & ArrayToIntersection<Rest>
        : {};

// ---------------------------------- Array To Union -----------------------------------

export type ArrayToUnion<T extends any[]> =
    T extends [infer First, ...infer Rest]
        ? First | ArrayToUnion<Rest>
        : {};

// ---------------------------------- Compose Mixins -----------------------------------

/**
 * Note: only `args[0]` will work with `instanceof`
 * @param args
 * @constructor
 */
export function ComposeMixins<T extends object[]>(...args: { [K in keyof T]: Constructor<T[K]> }): Constructor<ArrayToIntersection<T>> {
    return class extends (args[0] as Constructor) {
        constructor(...params: ConstructorParameters<Constructor<T[number]>>) {
            super(...params);

            for (let i = 1; i < args.length; i++) {
                const arg = args[i];
                Object.assign(this, new arg(...params));
            }
        }
    } as any;
}

// ------------------------------------ Constructor ------------------------------------

export type Constructor<T extends object = object> = new (...args: any[]) => T

// ----------------------------------- DeepReadonly ------------------------------------

export type DeepReadonly<T> =
    T extends (infer R)[] ? DeepReadonlyArray<R> :
        T extends Function ? T :
            T extends object ? DeepReadonlyObject<T> :
                T;

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {
}

type DeepReadonlyObject<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};

// -------------------------------------- Result ---------------------------------------

export type Result<T extends object, E = string> = T & { ok: true } | { ok: false, error: E }

export const Result = {
    ok<T extends object>(result: T): T & { ok: true } {
        result["ok"] = true;
        return result as T & { ok: true };
    },

    error<T>(error: T): { ok: false, error: T } {
        return {error, ok: false};
    },
};

// -------------------------------------- Expect ---------------------------------------

export function expected(expected: string, actual?: string): never {
    const msg = actual ? `Expected '${expected}' but got '${actual}'` : `Expected '${expected}'`;
    fail(msg);
}

export function expect(condition: boolean, expected: string, actual?: string): asserts condition {
    if (!condition) {
        const msg = actual ? `Expected '${expected}' but got '${actual}'` : `Expected '${expected}'`;
        fail(msg);
    }
}

// ------------------------------------ Assert Type ------------------------------------

export function assertType<const T>(obj: unknown): asserts obj is T {
}

// -------------------------------------- Unwrap ---------------------------------------

export type Unwrap<T> = {
    [K in keyof T]: T[K];
} & {};
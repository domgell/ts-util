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

export function isTypedArray(obj: unknown): obj is TypedArray {
    return ArrayBuffer.isView(obj) && !(obj instanceof DataView);
}

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

export type Result<T extends object> = T & { ok: true } | { ok: false, error: string }

export const Result = {
    ok<T extends object>(result: T): T & { ok: true } {
        result["ok"] = true;
        return result as T & { ok: true };
    },

    error(error: string): { ok: false, error: string } {
        return {error, ok: false};
    },
};
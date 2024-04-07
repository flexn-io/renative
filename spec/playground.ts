// type Obj<T extends string> = {
//     key: T;
// };

type Obj2<T extends string = string> = {
    key2: T;
};

type Obj<K extends string, T extends string = string> = {
    key: T;
    opts: ReadonlyArray<Obj2<K>>;
};

const getMagicKeys = <K extends string>(): K => {
    const koko: K = 'ddd' as K;
    return koko;
};

const createObjFromArr = <K extends string, T extends string>(arr: ReadonlyArray<Obj<T, K>>) => {
    const response: Partial<Record<K, Obj<T>>> = {};
    arr.forEach((v) => {
        response[v.key] = v;
    });
    return {
        response,
        getMagic: () => getMagicKeys<T>(),
    };
};

// type Bool = {
//     'foo-bar1': string;
//     'Foo-bar2': string;
//     'Foo-Bar3': string;
//     'foo_bar4': string;
// }

// type FB = Camel<keyof Bool>;

// const kk: FB = ''

// const createObjFromArr = <K extends string, T extends Record<K, Obj<K>>>(arr: ReadonlyArray<Obj<K>>) => {
//     const response: Record<K, Obj<K>> = {
//         fff: { key: '' },
//     };
//     arr.forEach((v) => {
//         response[v.key as K] = v;
//     });
//     return response;
// };

const payloadArr = [
    { key: 'key1', opts: [{ key2: 'hoooo' }] },
    { key: 'key2', opts: [{ key2: 'hoooo2' }, { key2: 'hoooo3' }] },
] as const;

const koko = createObjFromArr(payloadArr);

// type GetReturnType<Type> = Type extends (...args: never[]) => infer Return ? Return : never;

// type Type1 = GetReturnType<typeof koko.getMagic>;

// type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

// type MyTyp = Flatten<typeof payloadArr>;

// type Shite = typeof koko;
// type Bookla =
// type Bookla<T extends Record<K, Obj<T>>> = T
// const loko: Shite;
// const koo: MyTyp
console.log('JFJFJFJ', koko.getMagic());

export default class SDR {
    size: number;
    data: Uint32Array;
    constructor(size: number, indices?: number[]);
    get(index: number): number;
    set(index: number): void;
    clear(index: number): void;
    toString(wordSeparator?: string): any;
    population: number;
    sparsity: number;
    capacity: number;
    private static fromData(size, data);
    static union(a: SDR, b: SDR): SDR;
    static overlap(a: SDR, b: SDR): SDR;
    static match(a: SDR, b: SDR, score: number): boolean;
}

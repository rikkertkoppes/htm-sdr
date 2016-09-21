/** combinations - n choose k */
function nCk(n: number, k: number) {
    if (k > n / 2) {
        return this.nCk(n, n - k);
    }
    var total = 1;
    for (var i = 0; i < k; i++) {
        total *= (n - i) / (i + 1);
    }
    return total;
};


function leftPad(str, len: number, ch: string = ' ') {
    str = str + '';
    len = len - str.length;
    if (len <= 0) return str;
    var pad = '';
    while (true) {
        if (len & 1) pad += ch;
        len >>= 1;
        if (len) ch += ch;
        else break;
    }
    return pad + str;
}

/** popcount */
// var i = 63336,
//     wordbits = new Uint16Array(i);

// while (--i) {

// }

function popCount(x: number) {
    // return wordbits[n & 31] + wordbits[n >> 16];
    for (var count = 0; x; count++) {
        x &= x - 1;
    }
    return count;
}

function assertSameSize(a: SDR, b: SDR) {
    if (a.size !== b.size) {
        throw new Error('SDRs to union should have the same size');
    }
}

function assertInbounds(index: number, size: number) {
    if (index < 0 || index >= size) {
        throw new Error('index out of bounds ' + index + '. Size = ' + size);
    }
}

export default class SDR {
    private data: Uint32Array;

    /**
     * foo
     * @param {number}   public  size
     * @param {number[]} indices initial setup
     */
    constructor(public size: number, indices: number[] = []) {
        this.data = new Uint32Array(1 + ((size - 1) >> 5));
        indices.forEach(index => this.set(index));
    }

    public get(index: number): number {
        assertInbounds(index, this.size);
        var b = index >> 5; // 32 bits integer bucket: floor(index / 32)
        var i = index & 31; // 32 bits integer offset: index % 32
        var a = 1 << i; // filter
        return ((this.data[b] || 0) & a) >> i;
    }
    public set(index: number) {
        assertInbounds(index, this.size);
        var b = index >> 5; // 32 bits integer bucket: floor(index / 32)
        var i = index & 31; // 32 bits integer offset: index % 32
        var a = 1 << i; // word to add to existing
        this.data[b] = (this.data[b] || 0) | a;
    }
    public clear(index: number) {
        assertInbounds(index, this.size);
        var b = index >> 5; // 32 bits integer bucket: floor(index / 32)
        var i = index & 31; // 32 bits integer offset: index % 32
        var a = 1 << i; // word to clear to existing
        this.data[b] = (this.data[b] || 0) & ~a;
    }
    public toString() {
        return [].slice.call(this.data).map((d, i) => {
            //cut last word to length
            var l = (i == this.data.length - 1) ? (this.size & 31) : 32;
            return leftPad(d.toString(2), l, '0').split('').reverse().join('')
        }).join(' ');
    }

    get population(): number {
        return this.data.reduce((population, b) => {
            return population + popCount(b);
        }, 0);
    }

    get sparsity(): number {
        return this.population / this.size;
    }

    get capacity(): number {
        return nCk(this.size, this.population);
    }

    /** create an SDR from data */
    private static fromData(size, data: Uint32Array): SDR {
        var sdr = new SDR(size);
        sdr.data = data;
        return sdr;
    }

    /** returns a ∪ b */
    static union(a: SDR, b: SDR): SDR {
        assertSameSize(a, b);
        return SDR.fromData(a.size, a.data.map((w, i) => {
            return w | b.data[i];
        }));
    }
    /** returns a ∩ b */
    static overlap(a: SDR, b: SDR): SDR {
        assertSameSize(a, b);
        return SDR.fromData(a.size, a.data.map((w, i) => {
            return w & b.data[i];
        }));
    }
    /** determines whether a and b match based on an overlap population */
    static match(a: SDR, b: SDR, score: number): boolean {
        return SDR.overlap(a, b).population >= score;
    }
}
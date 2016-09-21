"use strict";
function nCk(n, k) {
    if (k > n / 2) {
        return this.nCk(n, n - k);
    }
    var total = 1;
    for (var i = 0; i < k; i++) {
        total *= (n - i) / (i + 1);
    }
    return total;
}
;
function leftPad(str, len, ch) {
    if (ch === void 0) { ch = ' '; }
    str = str + '';
    len = len - str.length;
    if (len <= 0)
        return str;
    var pad = '';
    while (true) {
        if (len & 1)
            pad += ch;
        len >>= 1;
        if (len)
            ch += ch;
        else
            break;
    }
    return pad + str;
}
function popCount(x) {
    for (var count = 0; x; count++) {
        x &= x - 1;
    }
    return count;
}
function assertSameSize(a, b) {
    if (a.size !== b.size) {
        throw new Error('SDRs to union should have the same size');
    }
}
function assertInbounds(index, size) {
    if (index < 0 || index >= size) {
        throw new Error('index out of bounds ' + index + '. Size = ' + size);
    }
}
var SDR = (function () {
    function SDR(size, indices) {
        var _this = this;
        if (indices === void 0) { indices = []; }
        this.size = size;
        this.data = new Uint32Array(1 + ((size - 1) >> 5));
        indices.forEach(function (index) { return _this.set(index); });
    }
    SDR.prototype.get = function (index) {
        assertInbounds(index, this.size);
        var b = index >> 5;
        var i = index & 31;
        var a = 1 << i;
        return ((this.data[b] || 0) & a) >> i;
    };
    SDR.prototype.set = function (index) {
        assertInbounds(index, this.size);
        var b = index >> 5;
        var i = index & 31;
        var a = 1 << i;
        this.data[b] = (this.data[b] || 0) | a;
    };
    SDR.prototype.clear = function (index) {
        assertInbounds(index, this.size);
        var b = index >> 5;
        var i = index & 31;
        var a = 1 << i;
        this.data[b] = (this.data[b] || 0) & ~a;
    };
    SDR.prototype.toString = function () {
        var _this = this;
        return [].slice.call(this.data).map(function (d, i) {
            var l = (i == _this.data.length - 1) ? (_this.size & 31) : 32;
            return leftPad(d.toString(2), l, '0').split('').reverse().join('');
        }).join(' ');
    };
    Object.defineProperty(SDR.prototype, "population", {
        get: function () {
            return this.data.reduce(function (population, b) {
                return population + popCount(b);
            }, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SDR.prototype, "sparsity", {
        get: function () {
            return this.population / this.size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SDR.prototype, "capacity", {
        get: function () {
            return nCk(this.size, this.population);
        },
        enumerable: true,
        configurable: true
    });
    SDR.fromData = function (size, data) {
        var sdr = new SDR(size);
        sdr.data = data;
        return sdr;
    };
    SDR.union = function (a, b) {
        assertSameSize(a, b);
        return SDR.fromData(a.size, a.data.map(function (w, i) {
            return w | b.data[i];
        }));
    };
    SDR.overlap = function (a, b) {
        assertSameSize(a, b);
        return SDR.fromData(a.size, a.data.map(function (w, i) {
            return w & b.data[i];
        }));
    };
    SDR.match = function (a, b, score) {
        return SDR.overlap(a, b).population >= score;
    };
    return SDR;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SDR;

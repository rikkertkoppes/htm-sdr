"use strict";
var chai_1 = require('chai');
var index_1 = require('../index');
describe('construction from ep2 examples', function () {
    it('should create an sdr 265, 5', function () {
        var sdr = new index_1.default(256, [0, 1, 2, 3, 4]);
        chai_1.expect(sdr.size).to.equal(256);
        chai_1.expect(sdr.population).to.equal(5);
        chai_1.expect(sdr.sparsity).to.equal(0.01953125);
        chai_1.expect(sdr.capacity).to.equal(8809549056);
    });
    it('should create an sdr 16, 5', function () {
        var sdr = new index_1.default(16, [0, 1, 2, 3, 4]);
        chai_1.expect(sdr.size).to.equal(16);
        chai_1.expect(sdr.population).to.equal(5);
        chai_1.expect(sdr.sparsity).to.equal(0.3125);
        chai_1.expect(sdr.capacity).to.equal(4368);
    });
    it('should create an sdr 16, 1', function () {
        var sdr = new index_1.default(16, [0]);
        chai_1.expect(sdr.size).to.equal(16);
        chai_1.expect(sdr.population).to.equal(1);
        chai_1.expect(sdr.sparsity).to.equal(0.0625);
        chai_1.expect(sdr.capacity).to.equal(16);
    });
    it('should create an sdr 256, 51', function () {
        var sdr = new index_1.default(256, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]);
        chai_1.expect(sdr.size).to.equal(256);
        chai_1.expect(sdr.population).to.equal(51);
        chai_1.expect(sdr.sparsity).to.equal(0.19921875);
        chai_1.expect(sdr.capacity).to.equal(2034388346356360300000000000000000000000000000000000000);
    });
});
describe('toString', function () {
    it('should cut to the actual length', function () {
        var sdr = new index_1.default(2, [0]);
        chai_1.expect(sdr.toString()).to.equal('10');
    });
    it('should cut to the actual length', function () {
        var sdr = new index_1.default(32, [0]);
        chai_1.expect(sdr.toString()).to.equal('10000000000000000000000000000000');
    });
    it('should not separate words of 32', function () {
        var sdr = new index_1.default(34, [0, 3]);
        chai_1.expect(sdr.toString()).to.equal('1001000000000000000000000000000000');
    });
    it('should separate with a custom separator', function () {
        var sdr = new index_1.default(34, [0, 3]);
        chai_1.expect(sdr.toString('|')).to.equal('10010000000000000000000000000000|00');
    });
});
describe('getting and setting', function () {
    it('should get if in bounds', function () {
        var sdr = new index_1.default(1);
        chai_1.expect(sdr.get(0)).to.equal(0);
    });
    it('should set if in bounds', function () {
        var sdr = new index_1.default(1);
        sdr.set(0);
        chai_1.expect(sdr.get(0)).to.equal(1);
    });
    it('should clear if in bounds', function () {
        var sdr = new index_1.default(1, [0]);
        sdr.clear(0);
        chai_1.expect(sdr.get(0)).to.equal(0);
    });
    it('should not get index out of bounds', function () {
        var sdr = new index_1.default(1);
        chai_1.expect(function () { return sdr.get(1); }).to.throw();
        chai_1.expect(function () { return sdr.get(-1); }).to.throw();
    });
    it('should not set index out of bounds', function () {
        var sdr = new index_1.default(1);
        chai_1.expect(function () { return sdr.set(1); }).to.throw();
        chai_1.expect(function () { return sdr.set(-1); }).to.throw();
    });
});
describe('construction with indices', function () {
    it('should set the first 4 bits', function () {
        var sdr = new index_1.default(16, [0, 1, 2, 3]);
        chai_1.expect(sdr.toString()).to.equal('1111000000000000');
    });
});
describe('union', function () {
    it('should union two SDRs', function () {
        var a = new index_1.default(16, [0, 1]);
        var b = new index_1.default(16, [0, 2]);
        var c = index_1.default.union(a, b);
        chai_1.expect(a.toString()).to.equal('1100000000000000');
        chai_1.expect(b.toString()).to.equal('1010000000000000');
        chai_1.expect(c.toString()).to.equal('1110000000000000');
        chai_1.expect(c.population).to.equal(3);
        chai_1.expect(c.size).to.equal(16);
    });
});
describe('overlap', function () {
    it('should overlap two SDRs', function () {
        var a = new index_1.default(16, [0, 1]);
        var b = new index_1.default(16, [0, 2]);
        var c = index_1.default.overlap(a, b);
        chai_1.expect(a.toString()).to.equal('1100000000000000');
        chai_1.expect(b.toString()).to.equal('1010000000000000');
        chai_1.expect(c.toString()).to.equal('1000000000000000');
        chai_1.expect(c.population).to.equal(1);
        chai_1.expect(c.size).to.equal(16);
    });
});

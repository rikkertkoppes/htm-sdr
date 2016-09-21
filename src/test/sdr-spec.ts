/// <reference path="../../typings/index.d.ts" />

import {expect} from 'chai';
import SDR from '../index';

describe('construction from ep2 examples', function() {
    it('should create an sdr 265, 5',function() {
        var sdr = new SDR(256,[0,1,2,3,4]);
        expect(sdr.size).to.equal(256);
        expect(sdr.population).to.equal(5);
        expect(sdr.sparsity).to.equal(0.01953125);
        expect(sdr.capacity).to.equal(8809549056);
    });
    it('should create an sdr 16, 5',function() {
        var sdr = new SDR(16,[0,1,2,3,4]);
        expect(sdr.size).to.equal(16);
        expect(sdr.population).to.equal(5);
        expect(sdr.sparsity).to.equal(0.3125);
        expect(sdr.capacity).to.equal(4368);
    });
    it('should create an sdr 16, 1',function() {
        var sdr = new SDR(16,[0]);
        expect(sdr.size).to.equal(16);
        expect(sdr.population).to.equal(1);
        expect(sdr.sparsity).to.equal(0.0625);
        expect(sdr.capacity).to.equal(16);
    });
    it('should create an sdr 256, 51',function() {
        var sdr = new SDR(256,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50]);
        expect(sdr.size).to.equal(256);
        expect(sdr.population).to.equal(51);
        expect(sdr.sparsity).to.equal(0.19921875);
        expect(sdr.capacity).to.equal(2034388346356360300000000000000000000000000000000000000);
    });
});

describe('toString', function() {
    it('should cut to the actual length', function() {
        var sdr = new SDR(2,[0]);
        expect(sdr.toString()).to.equal('10');
    });
    it('separate words of 32', function() {
        var sdr = new SDR(34,[0,3]);
        expect(sdr.toString()).to.equal('10010000000000000000000000000000 00');
    });
})

describe('getting and setting', function() {
    it('should get if in bounds', function() {
        var sdr = new SDR(1);
        expect(sdr.get(0)).to.equal(0);
    })
    it('should set if in bounds', function() {
        var sdr = new SDR(1);
        sdr.set(0);
        expect(sdr.get(0)).to.equal(1);
    })
    it('should clear if in bounds', function() {
        var sdr = new SDR(1,[0]);
        sdr.clear(0);
        expect(sdr.get(0)).to.equal(0);
    })
    it('should not get index out of bounds', function() {
        var sdr = new SDR(1);
        expect(() => sdr.get(1)).to.throw();
        expect(() => sdr.get(-1)).to.throw();
    })
    it('should not set index out of bounds', function() {
        var sdr = new SDR(1);
        expect(() => sdr.set(1)).to.throw();
        expect(() => sdr.set(-1)).to.throw();
    })
});

describe('construction with indices', function() {
    it('should set the first 4 bits', function() {
        var sdr = new SDR(16,[0,1,2,3]);
        expect(sdr.get(0)).to.equal(1);
        expect(sdr.get(1)).to.equal(1);
        expect(sdr.get(2)).to.equal(1);
        expect(sdr.get(3)).to.equal(1);
        expect(sdr.get(4)).to.equal(0);
        expect(sdr.get(5)).to.equal(0);
        expect(sdr.get(6)).to.equal(0);
        expect(sdr.get(7)).to.equal(0);
        expect(sdr.get(8)).to.equal(0);
        expect(sdr.get(10)).to.equal(0);
        expect(sdr.get(11)).to.equal(0);
        expect(sdr.get(12)).to.equal(0);
        expect(sdr.get(13)).to.equal(0);
        expect(sdr.get(14)).to.equal(0);
        expect(sdr.get(15)).to.equal(0);
    })
})

describe('union', function() {
    it('should union two SDRs', function() {
        var a = new SDR(16,[0,1]);
        var b = new SDR(16,[0,2]);
        var c = SDR.union(a,b);
        expect(c.get(0)).to.equal(1);
        expect(c.get(1)).to.equal(1);
        expect(c.get(2)).to.equal(1);
        expect(c.population).to.equal(3);
        expect(c.size).to.equal(16);
    })
})

describe('overlap', function() {
    it('should overlap two SDRs', function() {
        var a = new SDR(16,[0,1]);
        var b = new SDR(16,[0,2]);
        var c = SDR.overlap(a,b);
        expect(c.get(0)).to.equal(1);
        expect(c.get(1)).to.equal(0);
        expect(c.get(2)).to.equal(0);
        expect(c.population).to.equal(1);
        expect(c.size).to.equal(16);
    })
})
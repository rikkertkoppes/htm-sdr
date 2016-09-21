# SDR (Sparse Distributed Representation)

This is a js implementation of an SDR, which is a sparse bit array representing some value.

## API

- `new SDR(size, indices?)` Create a new SDR, optionally provide an array of bit indices to set
- `size` Returns the size of the SDR
- `population` Returns the population of the SDR, which is the numbers of bits set (Hamming Weight)
- `sparsity` Returns the fractional population
- `capacity` Returns the number of distinct representations the SDR can hold, calculated by the size and popuplation
- `get(index)` Gets the bit value at a given index
- `set(index)` Sets the bit value at a given index to 1
- `clear(index)` Sets the bit value at a given index to 0
- `toString()` Simple string representation of the internal structure, use only for debugging and be careful with large SDRs
- `SDR.union(a,b)` Returns the union of two SDRs
- `SDR.overlap(a,b)` Returns the overlap of two SDRs
- `SDR.match(a,b,score)` Determines if two SDRs match, based on whether the overlap population >= score
/// <reference types="node" />
import util from "util";
import { byte, uint8, int8, uint16, int16, uint32, int32, float, double, packed } from "../interfaces/Types.js";
/**
 * Represents a buffer reader.
 */
export declare class BufferReader {
    buffer: Buffer;
    offset: number;
    constructor(buffer: Buffer | string);
    [Symbol.toStringTag](): string;
    [util.inspect.custom](): Buffer;
    slice(start?: number, len?: number): BufferReader;
    /**
     * The number of bytes left in the buffer.
     */
    get left(): number;
    /**
     * The size of the buffer in bytes.
     */
    get size(): number;
    /**
     * Goto a certain position in the buffer.
     */
    goto(offset: number): void;
    /**
     * Jump a certain amount of bytes.
     */
    jump(bytes: number): number;
    /**
     * Read a Big-Endian unsigned 32 bit integer.
     */
    uint32BE(): uint32;
    /**
     * Read a Little-Endian unsigned 32 bit integer.
     */
    uint32LE(): uint32;
    /**
     * Read a Big-Endian 32 bit integer.
     */
    int32BE(): int32;
    /**
     * Read a Big-Endian 32 bit integer.
     */
    int32LE(): int32;
    /**
     * Read a Big-Endian unsigned 16 bit integer.
     */
    uint16BE(): uint16;
    /**
     * Read a Little-Endian unsigned 16 bit integer.
     */
    uint16LE(): uint16;
    /**
     * Read a Big-Endian 16 bit integer.
     */
    int16BE(): int16;
    /**
     * Read a Little-Endian 16 bit integer.
     */
    int16LE(): int16;
    /**
     * Read an unsigned 8 bit integer.
     */
    uint8(): uint8;
    /**
     * Read an 8 bit integer.
     */
    int8(): int8;
    /**
     * Read a single byte.
     */
    byte(): byte;
    /**
     * Read several bytes.
     */
    bytes(num: number): byte[];
    /**
     * Read a boolean.
     */
    bool(): boolean;
    /**
     * Read a Big-Endian 32 bit float.
     */
    floatBE(): float;
    /**
     * Read a Little-Endian 32 bit float.
     */
    floatLE(): float;
    /**
     * Read a Big-Endian 16 bit half-precision float.
     */
    float16BE(): float;
    /**
     * Read a Little-Endian 16 bit half-precision float.
     */
    float16LE(): float;
    /**
     * Read a Big-Endian 64 bit double.
     */
    doubleBE(): double;
    /**
     * Read a Little-Endian 64 bit double.
     */
    doubleLE(): double;
    /**
     * Read a packed integer.
     */
    packed(): packed;
    /**
     * Read a string with a known length.
     */
    string(length?: number): string;
    /**
     * Create a list of a structure.
     */
    list<T>(fn: (struct: BufferReader) => T, length?: number): T[];
}

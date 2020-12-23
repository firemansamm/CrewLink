/// <reference types="node" />
import util from "util";
import { BufferWriterOptions } from "../interfaces/BufferWriterOptions.js";
import { byte, uint8, int8, uint16, int16, uint32, int32, float, double, packed } from "../interfaces/Types.js";
/**
 * Represents a buffer writer.
 */
export declare class BufferWriter {
    buffer: Buffer;
    offset: number;
    options: BufferWriterOptions;
    constructor(options?: BufferWriterOptions);
    [Symbol.toStringTag](): string;
    [util.inspect.custom](): Buffer;
    [Symbol.iterator](item: number): number;
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
     * Expand the buffer to make room for the required amount of space.
     */
    expand(required?: number): this;
    /**
     * Pad empty bytes for unknown for unneeded data.
     */
    pad(bytes: number): this;
    /**
     * Write a Big-Endian unsigned 32 bit integer.
     */
    uint32BE(val: uint32): this;
    /**
     * Write a Little-Endian unsigned 32 bit integer.
     */
    uint32LE(val: uint32): this;
    /**
     * Write a Big-Endian 32 bit integer.
     */
    int32BE(val: int32): this;
    /**
     * Write a Little-Endian 32 bit integer.
     */
    int32LE(val: int32): this;
    /**
     * Write a Big-Endian unsigned 16 bit integer.
     */
    uint16BE(val: uint16): this;
    /**
     * Write a Little-Endian unsigned 16 bit integer.
     */
    uint16LE(val: uint16): this;
    /**
     * Write a Big-Endian 16 bit integer.
     */
    int16BE(val: int16): this;
    /**
     * Write a Little-Endian 16 bit integer.
     */
    int16LE(val: int16): this;
    /**
     * Write an unsigned 8 bit integer.
     */
    uint8(val: uint8): this;
    /**
     * Write a signed 8 bit integer.
     */
    int8(val: int8): this;
    /**
     * Write a singular byte. (Unsigned 8 bit integer)
     */
    byte(val: byte): this;
    /**
     * Read a boolean.
     */
    bool(val: boolean): this;
    /**
     * Write several bytes.
     */
    bytes(bytes: byte[]): any;
    /**
     * Write a buffer or buffer writer.
     */
    write(bytes: Buffer | BufferWriter): any;
    /**
     * Write a Big-Endian 32 bit float.
     */
    floatBE(val: float): this;
    /**
     * Write a Little-Endian 32 bit float.
     */
    floatLE(val: float): this;
    /**
     * Write a Big-Endian 16 bit half-precision float.
     */
    float16BE(val: float): BufferWriter;
    /**
     * Write a Little-Endian 16 bit half-precision float.
     */
    float16LE(val: float): BufferWriter;
    /**
     * Write a Big-Endian 64 bit double.
     */
    doubleBE(val: double): this;
    /**
     * Write a Little-Endian 64 bit double.
     */
    doubleLE(val: double): this;
    /**
     * Write a packed integer.
     */
    packed(val: packed): this;
    /**
     * Write a string with an unknown length
     */
    string(string: string, preflen?: boolean): this;
}

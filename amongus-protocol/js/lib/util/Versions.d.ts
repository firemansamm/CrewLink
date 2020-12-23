import { VersionInfo } from "../interfaces/VersionInfo.js";
export declare function EncodeVersion(info: VersionInfo): number;
export declare function DecodeVersion(version: number): VersionInfo;
export declare function FormatVersion(version: VersionInfo | number): any;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocaleDate = void 0;
var getLocaleDate = function (stamp, dateOptions) { return new Date(stamp).toLocaleString(undefined, dateOptions); };
exports.getLocaleDate = getLocaleDate;

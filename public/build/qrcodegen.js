"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["qrcodegen"],{

/***/ "./assets/js/qrcodegen-v1.7.0-es6.js":
/*!*******************************************!*\
  !*** ./assets/js/qrcodegen-v1.7.0-es6.js ***!
  \*******************************************/
/***/ (() => {

/*
 * QR Code generator library (compiled from TypeScript)
 *
 * Copyright (c) Project Nayuki. (MIT License)
 * https://www.nayuki.io/page/qr-code-generator-library
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * - The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 * - The Software is provided "as is", without warranty of any kind, express or
 *   implied, including but not limited to the warranties of merchantability,
 *   fitness for a particular purpose and noninfringement. In no event shall the
 *   authors or copyright holders be liable for any claim, damages or other
 *   liability, whether in an action of contract, tort or otherwise, arising from,
 *   out of or in connection with the Software or the use or other dealings in the
 *   Software.
 */


function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var qrcodegen;

(function (qrcodegen) {
  /*---- QR Code symbol class ----*/

  /*
   * A QR Code symbol, which is a type of two-dimension barcode.
   * Invented by Denso Wave and described in the ISO/IEC 18004 standard.
   * Instances of this class represent an immutable square grid of dark and light cells.
   * The class provides static factory functions to create a QR Code from text or binary data.
   * The class covers the QR Code Model 2 specification, supporting all versions (sizes)
   * from 1 to 40, all 4 error correction levels, and 4 character encoding modes.
   *
   * Ways to create a QR Code object:
   * - High level: Take the payload data and call QrCode.encodeText() or QrCode.encodeBinary().
   * - Mid level: Custom-make the list of segments and call QrCode.encodeSegments().
   * - Low level: Custom-make the array of data codeword bytes (including
   *   segment headers and final padding, excluding error correction codewords),
   *   supply the appropriate version number, and call the QrCode() constructor.
   * (Note that all ways require supplying the desired error correction level.)
   */
  var QrCode = /*#__PURE__*/function () {
    /*-- Constructor (low level) and fields --*/
    // Creates a new QR Code with the given version number,
    // error correction level, data codeword bytes, and mask number.
    // This is a low-level API that most users should not use directly.
    // A mid-level API is the encodeSegments() function.
    function QrCode( // The version number of this QR Code, which is between 1 and 40 (inclusive).
    // This determines the size of this barcode.
    version, // The error correction level used in this QR Code.
    errorCorrectionLevel, dataCodewords, // The index of the mask pattern used in this QR Code, which is between 0 and 7 (inclusive).
    // Even if a QR Code is created with automatic masking requested (mask = -1),
    // the resulting object still has a mask value between 0 and 7.
    mask) {
      _classCallCheck(this, QrCode);

      this.version = version;
      this.errorCorrectionLevel = errorCorrectionLevel;
      this.mask = mask; // The modules of this QR Code (false = light, true = dark).
      // Immutable after constructor finishes. Accessed through getModule().

      this.modules = []; // Indicates function modules that are not subjected to masking. Discarded when constructor finishes.

      this.isFunction = []; // Check scalar arguments

      if (version < QrCode.MIN_VERSION || version > QrCode.MAX_VERSION) throw "Version value out of range";
      if (mask < -1 || mask > 7) throw "Mask value out of range";
      this.size = version * 4 + 17; // Initialize both grids to be size*size arrays of Boolean false

      var row = [];

      for (var i = 0; i < this.size; i++) {
        row.push(false);
      }

      for (var _i = 0; _i < this.size; _i++) {
        this.modules.push(row.slice()); // Initially all light

        this.isFunction.push(row.slice());
      } // Compute ECC, draw modules


      this.drawFunctionPatterns();
      var allCodewords = this.addEccAndInterleave(dataCodewords);
      this.drawCodewords(allCodewords); // Do masking

      if (mask == -1) {
        // Automatically choose best mask
        var minPenalty = 1000000000;

        for (var _i2 = 0; _i2 < 8; _i2++) {
          this.applyMask(_i2);
          this.drawFormatBits(_i2);
          var penalty = this.getPenaltyScore();

          if (penalty < minPenalty) {
            mask = _i2;
            minPenalty = penalty;
          }

          this.applyMask(_i2); // Undoes the mask due to XOR
        }
      }

      if (mask < 0 || mask > 7) throw "Assertion error";
      this.mask = mask;
      this.applyMask(mask); // Apply the final choice of mask

      this.drawFormatBits(mask); // Overwrite old format bits

      this.isFunction = [];
    }
    /*-- Static factory functions (high level) --*/
    // Returns a QR Code representing the given Unicode text string at the given error correction level.
    // As a conservative upper bound, this function is guaranteed to succeed for strings that have 738 or fewer
    // Unicode code points (not UTF-16 code units) if the low error correction level is used. The smallest possible
    // QR Code version is automatically chosen for the output. The ECC level of the result may be higher than the
    // ecl argument if it can be done without increasing the version.


    _createClass(QrCode, [{
      key: "getModule",
      value:
      /*-- Accessor methods --*/
      // Returns the color of the module (pixel) at the given coordinates, which is false
      // for light or true for dark. The top left corner has the coordinates (x=0, y=0).
      // If the given coordinates are out of bounds, then false (light) is returned.
      function getModule(x, y) {
        return 0 <= x && x < this.size && 0 <= y && y < this.size && this.modules[y][x];
      }
      /*-- Private helper methods for constructor: Drawing function modules --*/
      // Reads this object's version field, and draws and marks all function modules.

    }, {
      key: "drawFunctionPatterns",
      value: function drawFunctionPatterns() {
        // Draw horizontal and vertical timing patterns
        for (var i = 0; i < this.size; i++) {
          this.setFunctionModule(6, i, i % 2 == 0);
          this.setFunctionModule(i, 6, i % 2 == 0);
        } // Draw 3 finder patterns (all corners except bottom right; overwrites some timing modules)


        this.drawFinderPattern(3, 3);
        this.drawFinderPattern(this.size - 4, 3);
        this.drawFinderPattern(3, this.size - 4); // Draw numerous alignment patterns

        var alignPatPos = this.getAlignmentPatternPositions();
        var numAlign = alignPatPos.length;

        for (var _i3 = 0; _i3 < numAlign; _i3++) {
          for (var j = 0; j < numAlign; j++) {
            // Don't draw on the three finder corners
            if (!(_i3 == 0 && j == 0 || _i3 == 0 && j == numAlign - 1 || _i3 == numAlign - 1 && j == 0)) this.drawAlignmentPattern(alignPatPos[_i3], alignPatPos[j]);
          }
        } // Draw configuration data


        this.drawFormatBits(0); // Dummy mask value; overwritten later in the constructor

        this.drawVersion();
      } // Draws two copies of the format bits (with its own error correction code)
      // based on the given mask and this object's error correction level field.

    }, {
      key: "drawFormatBits",
      value: function drawFormatBits(mask) {
        // Calculate error correction code and pack bits
        var data = this.errorCorrectionLevel.formatBits << 3 | mask; // errCorrLvl is uint2, mask is uint3

        var rem = data;

        for (var i = 0; i < 10; i++) {
          rem = rem << 1 ^ (rem >>> 9) * 0x537;
        }

        var bits = (data << 10 | rem) ^ 0x5412; // uint15

        if (bits >>> 15 != 0) throw "Assertion error"; // Draw first copy

        for (var _i4 = 0; _i4 <= 5; _i4++) {
          this.setFunctionModule(8, _i4, getBit(bits, _i4));
        }

        this.setFunctionModule(8, 7, getBit(bits, 6));
        this.setFunctionModule(8, 8, getBit(bits, 7));
        this.setFunctionModule(7, 8, getBit(bits, 8));

        for (var _i5 = 9; _i5 < 15; _i5++) {
          this.setFunctionModule(14 - _i5, 8, getBit(bits, _i5));
        } // Draw second copy


        for (var _i6 = 0; _i6 < 8; _i6++) {
          this.setFunctionModule(this.size - 1 - _i6, 8, getBit(bits, _i6));
        }

        for (var _i7 = 8; _i7 < 15; _i7++) {
          this.setFunctionModule(8, this.size - 15 + _i7, getBit(bits, _i7));
        }

        this.setFunctionModule(8, this.size - 8, true); // Always dark
      } // Draws two copies of the version bits (with its own error correction code),
      // based on this object's version field, iff 7 <= version <= 40.

    }, {
      key: "drawVersion",
      value: function drawVersion() {
        if (this.version < 7) return; // Calculate error correction code and pack bits

        var rem = this.version; // version is uint6, in the range [7, 40]

        for (var i = 0; i < 12; i++) {
          rem = rem << 1 ^ (rem >>> 11) * 0x1F25;
        }

        var bits = this.version << 12 | rem; // uint18

        if (bits >>> 18 != 0) throw "Assertion error"; // Draw two copies

        for (var _i8 = 0; _i8 < 18; _i8++) {
          var color = getBit(bits, _i8);
          var a = this.size - 11 + _i8 % 3;
          var b = Math.floor(_i8 / 3);
          this.setFunctionModule(a, b, color);
          this.setFunctionModule(b, a, color);
        }
      } // Draws a 9*9 finder pattern including the border separator,
      // with the center module at (x, y). Modules can be out of bounds.

    }, {
      key: "drawFinderPattern",
      value: function drawFinderPattern(x, y) {
        for (var dy = -4; dy <= 4; dy++) {
          for (var dx = -4; dx <= 4; dx++) {
            var dist = Math.max(Math.abs(dx), Math.abs(dy)); // Chebyshev/infinity norm

            var xx = x + dx;
            var yy = y + dy;
            if (0 <= xx && xx < this.size && 0 <= yy && yy < this.size) this.setFunctionModule(xx, yy, dist != 2 && dist != 4);
          }
        }
      } // Draws a 5*5 alignment pattern, with the center module
      // at (x, y). All modules must be in bounds.

    }, {
      key: "drawAlignmentPattern",
      value: function drawAlignmentPattern(x, y) {
        for (var dy = -2; dy <= 2; dy++) {
          for (var dx = -2; dx <= 2; dx++) {
            this.setFunctionModule(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) != 1);
          }
        }
      } // Sets the color of a module and marks it as a function module.
      // Only used by the constructor. Coordinates must be in bounds.

    }, {
      key: "setFunctionModule",
      value: function setFunctionModule(x, y, isDark) {
        this.modules[y][x] = isDark;
        this.isFunction[y][x] = true;
      }
      /*-- Private helper methods for constructor: Codewords and masking --*/
      // Returns a new byte string representing the given data with the appropriate error correction
      // codewords appended to it, based on this object's version and error correction level.

    }, {
      key: "addEccAndInterleave",
      value: function addEccAndInterleave(data) {
        var ver = this.version;
        var ecl = this.errorCorrectionLevel;
        if (data.length != QrCode.getNumDataCodewords(ver, ecl)) throw "Invalid argument"; // Calculate parameter numbers

        var numBlocks = QrCode.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver];
        var blockEccLen = QrCode.ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][ver];
        var rawCodewords = Math.floor(QrCode.getNumRawDataModules(ver) / 8);
        var numShortBlocks = numBlocks - rawCodewords % numBlocks;
        var shortBlockLen = Math.floor(rawCodewords / numBlocks); // Split data into blocks and append ECC to each block

        var blocks = [];
        var rsDiv = QrCode.reedSolomonComputeDivisor(blockEccLen);

        for (var i = 0, k = 0; i < numBlocks; i++) {
          var dat = data.slice(k, k + shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1));
          k += dat.length;
          var ecc = QrCode.reedSolomonComputeRemainder(dat, rsDiv);
          if (i < numShortBlocks) dat.push(0);
          blocks.push(dat.concat(ecc));
        } // Interleave (not concatenate) the bytes from every block into a single sequence


        var result = [];

        var _loop = function _loop(_i9) {
          blocks.forEach(function (block, j) {
            // Skip the padding byte in short blocks
            if (_i9 != shortBlockLen - blockEccLen || j >= numShortBlocks) result.push(block[_i9]);
          });
        };

        for (var _i9 = 0; _i9 < blocks[0].length; _i9++) {
          _loop(_i9);
        }

        if (result.length != rawCodewords) throw "Assertion error";
        return result;
      } // Draws the given sequence of 8-bit codewords (data and error correction) onto the entire
      // data area of this QR Code. Function modules need to be marked off before this is called.

    }, {
      key: "drawCodewords",
      value: function drawCodewords(data) {
        if (data.length != Math.floor(QrCode.getNumRawDataModules(this.version) / 8)) throw "Invalid argument";
        var i = 0; // Bit index into the data
        // Do the funny zigzag scan

        for (var right = this.size - 1; right >= 1; right -= 2) {
          // Index of right column in each column pair
          if (right == 6) right = 5;

          for (var vert = 0; vert < this.size; vert++) {
            // Vertical counter
            for (var j = 0; j < 2; j++) {
              var x = right - j; // Actual x coordinate

              var upward = (right + 1 & 2) == 0;
              var y = upward ? this.size - 1 - vert : vert; // Actual y coordinate

              if (!this.isFunction[y][x] && i < data.length * 8) {
                this.modules[y][x] = getBit(data[i >>> 3], 7 - (i & 7));
                i++;
              } // If this QR Code has any remainder bits (0 to 7), they were assigned as
              // 0/false/light by the constructor and are left unchanged by this method

            }
          }
        }

        if (i != data.length * 8) throw "Assertion error";
      } // XORs the codeword modules in this QR Code with the given mask pattern.
      // The function modules must be marked and the codeword bits must be drawn
      // before masking. Due to the arithmetic of XOR, calling applyMask() with
      // the same mask value a second time will undo the mask. A final well-formed
      // QR Code needs exactly one (not zero, two, etc.) mask applied.

    }, {
      key: "applyMask",
      value: function applyMask(mask) {
        if (mask < 0 || mask > 7) throw "Mask value out of range";

        for (var y = 0; y < this.size; y++) {
          for (var x = 0; x < this.size; x++) {
            var invert = void 0;

            switch (mask) {
              case 0:
                invert = (x + y) % 2 == 0;
                break;

              case 1:
                invert = y % 2 == 0;
                break;

              case 2:
                invert = x % 3 == 0;
                break;

              case 3:
                invert = (x + y) % 3 == 0;
                break;

              case 4:
                invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 == 0;
                break;

              case 5:
                invert = x * y % 2 + x * y % 3 == 0;
                break;

              case 6:
                invert = (x * y % 2 + x * y % 3) % 2 == 0;
                break;

              case 7:
                invert = ((x + y) % 2 + x * y % 3) % 2 == 0;
                break;

              default:
                throw "Assertion error";
            }

            if (!this.isFunction[y][x] && invert) this.modules[y][x] = !this.modules[y][x];
          }
        }
      } // Calculates and returns the penalty score based on state of this QR Code's current modules.
      // This is used by the automatic mask choice algorithm to find the mask pattern that yields the lowest score.

    }, {
      key: "getPenaltyScore",
      value: function getPenaltyScore() {
        var result = 0; // Adjacent modules in row having same color, and finder-like patterns

        for (var y = 0; y < this.size; y++) {
          var runColor = false;
          var runX = 0;
          var runHistory = [0, 0, 0, 0, 0, 0, 0];

          for (var x = 0; x < this.size; x++) {
            if (this.modules[y][x] == runColor) {
              runX++;
              if (runX == 5) result += QrCode.PENALTY_N1;else if (runX > 5) result++;
            } else {
              this.finderPenaltyAddHistory(runX, runHistory);
              if (!runColor) result += this.finderPenaltyCountPatterns(runHistory) * QrCode.PENALTY_N3;
              runColor = this.modules[y][x];
              runX = 1;
            }
          }

          result += this.finderPenaltyTerminateAndCount(runColor, runX, runHistory) * QrCode.PENALTY_N3;
        } // Adjacent modules in column having same color, and finder-like patterns


        for (var _x = 0; _x < this.size; _x++) {
          var _runColor = false;
          var runY = 0;
          var _runHistory = [0, 0, 0, 0, 0, 0, 0];

          for (var _y = 0; _y < this.size; _y++) {
            if (this.modules[_y][_x] == _runColor) {
              runY++;
              if (runY == 5) result += QrCode.PENALTY_N1;else if (runY > 5) result++;
            } else {
              this.finderPenaltyAddHistory(runY, _runHistory);
              if (!_runColor) result += this.finderPenaltyCountPatterns(_runHistory) * QrCode.PENALTY_N3;
              _runColor = this.modules[_y][_x];
              runY = 1;
            }
          }

          result += this.finderPenaltyTerminateAndCount(_runColor, runY, _runHistory) * QrCode.PENALTY_N3;
        } // 2*2 blocks of modules having same color


        for (var _y2 = 0; _y2 < this.size - 1; _y2++) {
          for (var _x2 = 0; _x2 < this.size - 1; _x2++) {
            var color = this.modules[_y2][_x2];
            if (color == this.modules[_y2][_x2 + 1] && color == this.modules[_y2 + 1][_x2] && color == this.modules[_y2 + 1][_x2 + 1]) result += QrCode.PENALTY_N2;
          }
        } // Balance of dark and light modules


        var dark = 0;

        var _iterator = _createForOfIteratorHelper(this.modules),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var row = _step.value;
            dark = row.reduce(function (sum, color) {
              return sum + (color ? 1 : 0);
            }, dark);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        var total = this.size * this.size; // Note that size is odd, so dark/total != 1/2
        // Compute the smallest integer k >= 0 such that (45-5k)% <= dark/total <= (55+5k)%

        var k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
        result += k * QrCode.PENALTY_N4;
        return result;
      }
      /*-- Private helper functions --*/
      // Returns an ascending list of positions of alignment patterns for this version number.
      // Each position is in the range [0,177), and are used on both the x and y axes.
      // This could be implemented as lookup table of 40 variable-length lists of integers.

    }, {
      key: "getAlignmentPatternPositions",
      value: function getAlignmentPatternPositions() {
        if (this.version == 1) return [];else {
          var numAlign = Math.floor(this.version / 7) + 2;
          var step = this.version == 32 ? 26 : Math.ceil((this.version * 4 + 4) / (numAlign * 2 - 2)) * 2;
          var result = [6];

          for (var pos = this.size - 7; result.length < numAlign; pos -= step) {
            result.splice(1, 0, pos);
          }

          return result;
        }
      } // Returns the number of data bits that can be stored in a QR Code of the given version number, after
      // all function modules are excluded. This includes remainder bits, so it might not be a multiple of 8.
      // The result is in the range [208, 29648]. This could be implemented as a 40-entry lookup table.

    }, {
      key: "finderPenaltyCountPatterns",
      value: // Can only be called immediately after a light run is added, and
      // returns either 0, 1, or 2. A helper function for getPenaltyScore().
      function finderPenaltyCountPatterns(runHistory) {
        var n = runHistory[1];
        if (n > this.size * 3) throw "Assertion error";
        var core = n > 0 && runHistory[2] == n && runHistory[3] == n * 3 && runHistory[4] == n && runHistory[5] == n;
        return (core && runHistory[0] >= n * 4 && runHistory[6] >= n ? 1 : 0) + (core && runHistory[6] >= n * 4 && runHistory[0] >= n ? 1 : 0);
      } // Must be called at the end of a line (row or column) of modules. A helper function for getPenaltyScore().

    }, {
      key: "finderPenaltyTerminateAndCount",
      value: function finderPenaltyTerminateAndCount(currentRunColor, currentRunLength, runHistory) {
        if (currentRunColor) {
          // Terminate dark run
          this.finderPenaltyAddHistory(currentRunLength, runHistory);
          currentRunLength = 0;
        }

        currentRunLength += this.size; // Add light border to final run

        this.finderPenaltyAddHistory(currentRunLength, runHistory);
        return this.finderPenaltyCountPatterns(runHistory);
      } // Pushes the given value to the front and drops the last value. A helper function for getPenaltyScore().

    }, {
      key: "finderPenaltyAddHistory",
      value: function finderPenaltyAddHistory(currentRunLength, runHistory) {
        if (runHistory[0] == 0) currentRunLength += this.size; // Add light border to initial run

        runHistory.pop();
        runHistory.unshift(currentRunLength);
      }
    }], [{
      key: "encodeText",
      value: function encodeText(text, ecl) {
        var segs = qrcodegen.QrSegment.makeSegments(text);
        return QrCode.encodeSegments(segs, ecl);
      } // Returns a QR Code representing the given binary data at the given error correction level.
      // This function always encodes using the binary segment mode, not any text mode. The maximum number of
      // bytes allowed is 2953. The smallest possible QR Code version is automatically chosen for the output.
      // The ECC level of the result may be higher than the ecl argument if it can be done without increasing the version.

    }, {
      key: "encodeBinary",
      value: function encodeBinary(data, ecl) {
        var seg = qrcodegen.QrSegment.makeBytes(data);
        return QrCode.encodeSegments([seg], ecl);
      }
      /*-- Static factory functions (mid level) --*/
      // Returns a QR Code representing the given segments with the given encoding parameters.
      // The smallest possible QR Code version within the given range is automatically
      // chosen for the output. Iff boostEcl is true, then the ECC level of the result
      // may be higher than the ecl argument if it can be done without increasing the
      // version. The mask number is either between 0 to 7 (inclusive) to force that
      // mask, or -1 to automatically choose an appropriate mask (which may be slow).
      // This function allows the user to create a custom sequence of segments that switches
      // between modes (such as alphanumeric and byte) to encode text in less space.
      // This is a mid-level API; the high-level API is encodeText() and encodeBinary().

    }, {
      key: "encodeSegments",
      value: function encodeSegments(segs, ecl) {
        var minVersion = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        var maxVersion = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 40;
        var mask = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : -1;
        var boostEcl = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
        if (!(QrCode.MIN_VERSION <= minVersion && minVersion <= maxVersion && maxVersion <= QrCode.MAX_VERSION) || mask < -1 || mask > 7) throw "Invalid value"; // Find the minimal version number to use

        var version;
        var dataUsedBits;

        for (version = minVersion;; version++) {
          var _dataCapacityBits = QrCode.getNumDataCodewords(version, ecl) * 8; // Number of data bits available


          var usedBits = QrSegment.getTotalBits(segs, version);

          if (usedBits <= _dataCapacityBits) {
            dataUsedBits = usedBits;
            break; // This version number is found to be suitable
          }

          if (version >= maxVersion) // All versions in the range could not fit the given data
            throw "Data too long";
        } // Increase the error correction level while the data still fits in the current version number


        for (var _i10 = 0, _arr = [QrCode.Ecc.MEDIUM, QrCode.Ecc.QUARTILE, QrCode.Ecc.HIGH]; _i10 < _arr.length; _i10++) {
          var newEcl = _arr[_i10];
          // From low to high
          if (boostEcl && dataUsedBits <= QrCode.getNumDataCodewords(version, newEcl) * 8) ecl = newEcl;
        } // Concatenate all segments to create the data bit string


        var bb = [];

        var _iterator2 = _createForOfIteratorHelper(segs),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var seg = _step2.value;
            appendBits(seg.mode.modeBits, 4, bb);
            appendBits(seg.numChars, seg.mode.numCharCountBits(version), bb);

            var _iterator3 = _createForOfIteratorHelper(seg.getData()),
                _step3;

            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                var b = _step3.value;
                bb.push(b);
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        if (bb.length != dataUsedBits) throw "Assertion error"; // Add terminator and pad up to a byte if applicable

        var dataCapacityBits = QrCode.getNumDataCodewords(version, ecl) * 8;
        if (bb.length > dataCapacityBits) throw "Assertion error";
        appendBits(0, Math.min(4, dataCapacityBits - bb.length), bb);
        appendBits(0, (8 - bb.length % 8) % 8, bb);
        if (bb.length % 8 != 0) throw "Assertion error"; // Pad with alternating bytes until data capacity is reached

        for (var padByte = 0xEC; bb.length < dataCapacityBits; padByte ^= 0xEC ^ 0x11) {
          appendBits(padByte, 8, bb);
        } // Pack bits into bytes in big endian


        var dataCodewords = [];

        while (dataCodewords.length * 8 < bb.length) {
          dataCodewords.push(0);
        }

        bb.forEach(function (b, i) {
          return dataCodewords[i >>> 3] |= b << 7 - (i & 7);
        }); // Create the QR Code object

        return new QrCode(version, ecl, dataCodewords, mask);
      }
    }, {
      key: "getNumRawDataModules",
      value: function getNumRawDataModules(ver) {
        if (ver < QrCode.MIN_VERSION || ver > QrCode.MAX_VERSION) throw "Version number out of range";
        var result = (16 * ver + 128) * ver + 64;

        if (ver >= 2) {
          var numAlign = Math.floor(ver / 7) + 2;
          result -= (25 * numAlign - 10) * numAlign - 55;
          if (ver >= 7) result -= 36;
        }

        if (!(208 <= result && result <= 29648)) throw "Assertion error";
        return result;
      } // Returns the number of 8-bit data (i.e. not error correction) codewords contained in any
      // QR Code of the given version number and error correction level, with remainder bits discarded.
      // This stateless pure function could be implemented as a (40*4)-cell lookup table.

    }, {
      key: "getNumDataCodewords",
      value: function getNumDataCodewords(ver, ecl) {
        return Math.floor(QrCode.getNumRawDataModules(ver) / 8) - QrCode.ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][ver] * QrCode.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver];
      } // Returns a Reed-Solomon ECC generator polynomial for the given degree. This could be
      // implemented as a lookup table over all possible parameter values, instead of as an algorithm.

    }, {
      key: "reedSolomonComputeDivisor",
      value: function reedSolomonComputeDivisor(degree) {
        if (degree < 1 || degree > 255) throw "Degree out of range"; // Polynomial coefficients are stored from highest to lowest power, excluding the leading term which is always 1.
        // For example the polynomial x^3 + 255x^2 + 8x + 93 is stored as the uint8 array [255, 8, 93].

        var result = [];

        for (var i = 0; i < degree - 1; i++) {
          result.push(0);
        }

        result.push(1); // Start off with the monomial x^0
        // Compute the product polynomial (x - r^0) * (x - r^1) * (x - r^2) * ... * (x - r^{degree-1}),
        // and drop the highest monomial term which is always 1x^degree.
        // Note that r = 0x02, which is a generator element of this field GF(2^8/0x11D).

        var root = 1;

        for (var _i11 = 0; _i11 < degree; _i11++) {
          // Multiply the current product by (x - r^i)
          for (var j = 0; j < result.length; j++) {
            result[j] = QrCode.reedSolomonMultiply(result[j], root);
            if (j + 1 < result.length) result[j] ^= result[j + 1];
          }

          root = QrCode.reedSolomonMultiply(root, 0x02);
        }

        return result;
      } // Returns the Reed-Solomon error correction codeword for the given data and divisor polynomials.

    }, {
      key: "reedSolomonComputeRemainder",
      value: function reedSolomonComputeRemainder(data, divisor) {
        var result = divisor.map(function (_) {
          return 0;
        });

        var _iterator4 = _createForOfIteratorHelper(data),
            _step4;

        try {
          var _loop2 = function _loop2() {
            var b = _step4.value;
            // Polynomial division
            var factor = b ^ result.shift();
            result.push(0);
            divisor.forEach(function (coef, i) {
              return result[i] ^= QrCode.reedSolomonMultiply(coef, factor);
            });
          };

          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            _loop2();
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        return result;
      } // Returns the product of the two given field elements modulo GF(2^8/0x11D). The arguments and result
      // are unsigned 8-bit integers. This could be implemented as a lookup table of 256*256 entries of uint8.

    }, {
      key: "reedSolomonMultiply",
      value: function reedSolomonMultiply(x, y) {
        if (x >>> 8 != 0 || y >>> 8 != 0) throw "Byte out of range"; // Russian peasant multiplication

        var z = 0;

        for (var i = 7; i >= 0; i--) {
          z = z << 1 ^ (z >>> 7) * 0x11D;
          z ^= (y >>> i & 1) * x;
        }

        if (z >>> 8 != 0) throw "Assertion error";
        return z;
      }
    }]);

    return QrCode;
  }();
  /*-- Constants and tables --*/
  // The minimum version number supported in the QR Code Model 2 standard.


  QrCode.MIN_VERSION = 1; // The maximum version number supported in the QR Code Model 2 standard.

  QrCode.MAX_VERSION = 40; // For use in getPenaltyScore(), when evaluating which mask is best.

  QrCode.PENALTY_N1 = 3;
  QrCode.PENALTY_N2 = 3;
  QrCode.PENALTY_N3 = 40;
  QrCode.PENALTY_N4 = 10;
  QrCode.ECC_CODEWORDS_PER_BLOCK = [// Version: (note that index 0 is for padding, and is set to an illegal value)
  //0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40    Error correction level
  [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30], [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28], [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30], [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]];
  QrCode.NUM_ERROR_CORRECTION_BLOCKS = [// Version: (note that index 0 is for padding, and is set to an illegal value)
  //0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40    Error correction level
  [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25], [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49], [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68], [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81]];
  qrcodegen.QrCode = QrCode; // Appends the given number of low-order bits of the given value
  // to the given buffer. Requires 0 <= len <= 31 and 0 <= val < 2^len.

  function appendBits(val, len, bb) {
    if (len < 0 || len > 31 || val >>> len != 0) throw "Value out of range";

    for (var i = len - 1; i >= 0; i--) {
      // Append bit by bit
      bb.push(val >>> i & 1);
    }
  } // Returns true iff the i'th bit of x is set to 1.


  function getBit(x, i) {
    return (x >>> i & 1) != 0;
  }
  /*---- Data segment class ----*/

  /*
   * A segment of character/binary/control data in a QR Code symbol.
   * Instances of this class are immutable.
   * The mid-level way to create a segment is to take the payload data
   * and call a static factory function such as QrSegment.makeNumeric().
   * The low-level way to create a segment is to custom-make the bit buffer
   * and call the QrSegment() constructor with appropriate values.
   * This segment class imposes no length restrictions, but QR Codes have restrictions.
   * Even in the most favorable conditions, a QR Code can only hold 7089 characters of data.
   * Any segment longer than this is meaningless for the purpose of generating QR Codes.
   */


  var QrSegment = /*#__PURE__*/function () {
    /*-- Constructor (low level) and fields --*/
    // Creates a new QR Code segment with the given attributes and data.
    // The character count (numChars) must agree with the mode and the bit buffer length,
    // but the constraint isn't checked. The given bit buffer is cloned and stored.
    function QrSegment( // The mode indicator of this segment.
    mode, // The length of this segment's unencoded data. Measured in characters for
    // numeric/alphanumeric/kanji mode, bytes for byte mode, and 0 for ECI mode.
    // Always zero or positive. Not the same as the data's bit length.
    numChars, // The data bits of this segment. Accessed through getData().
    bitData) {
      _classCallCheck(this, QrSegment);

      this.mode = mode;
      this.numChars = numChars;
      this.bitData = bitData;
      if (numChars < 0) throw "Invalid argument";
      this.bitData = bitData.slice(); // Make defensive copy
    }
    /*-- Static factory functions (mid level) --*/
    // Returns a segment representing the given binary data encoded in
    // byte mode. All input byte arrays are acceptable. Any text string
    // can be converted to UTF-8 bytes and encoded as a byte mode segment.


    _createClass(QrSegment, [{
      key: "getData",
      value:
      /*-- Methods --*/
      // Returns a new copy of the data bits of this segment.
      function getData() {
        return this.bitData.slice(); // Make defensive copy
      } // (Package-private) Calculates and returns the number of bits needed to encode the given segments at
      // the given version. The result is infinity if a segment has too many characters to fit its length field.

    }], [{
      key: "makeBytes",
      value: function makeBytes(data) {
        var bb = [];

        var _iterator5 = _createForOfIteratorHelper(data),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var b = _step5.value;
            appendBits(b, 8, bb);
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }

        return new QrSegment(QrSegment.Mode.BYTE, data.length, bb);
      } // Returns a segment representing the given string of decimal digits encoded in numeric mode.

    }, {
      key: "makeNumeric",
      value: function makeNumeric(digits) {
        if (!QrSegment.isNumeric(digits)) throw "String contains non-numeric characters";
        var bb = [];

        for (var i = 0; i < digits.length;) {
          // Consume up to 3 digits per iteration
          var n = Math.min(digits.length - i, 3);
          appendBits(parseInt(digits.substr(i, n), 10), n * 3 + 1, bb);
          i += n;
        }

        return new QrSegment(QrSegment.Mode.NUMERIC, digits.length, bb);
      } // Returns a segment representing the given text string encoded in alphanumeric mode.
      // The characters allowed are: 0 to 9, A to Z (uppercase only), space,
      // dollar, percent, asterisk, plus, hyphen, period, slash, colon.

    }, {
      key: "makeAlphanumeric",
      value: function makeAlphanumeric(text) {
        if (!QrSegment.isAlphanumeric(text)) throw "String contains unencodable characters in alphanumeric mode";
        var bb = [];
        var i;

        for (i = 0; i + 2 <= text.length; i += 2) {
          // Process groups of 2
          var temp = QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)) * 45;
          temp += QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i + 1));
          appendBits(temp, 11, bb);
        }

        if (i < text.length) // 1 character remaining
          appendBits(QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)), 6, bb);
        return new QrSegment(QrSegment.Mode.ALPHANUMERIC, text.length, bb);
      } // Returns a new mutable list of zero or more segments to represent the given Unicode text string.
      // The result may use various segment modes and switch modes to optimize the length of the bit stream.

    }, {
      key: "makeSegments",
      value: function makeSegments(text) {
        // Select the most efficient segment encoding automatically
        if (text == "") return [];else if (QrSegment.isNumeric(text)) return [QrSegment.makeNumeric(text)];else if (QrSegment.isAlphanumeric(text)) return [QrSegment.makeAlphanumeric(text)];else return [QrSegment.makeBytes(QrSegment.toUtf8ByteArray(text))];
      } // Returns a segment representing an Extended Channel Interpretation
      // (ECI) designator with the given assignment value.

    }, {
      key: "makeEci",
      value: function makeEci(assignVal) {
        var bb = [];
        if (assignVal < 0) throw "ECI assignment value out of range";else if (assignVal < 1 << 7) appendBits(assignVal, 8, bb);else if (assignVal < 1 << 14) {
          appendBits(2, 2, bb);
          appendBits(assignVal, 14, bb);
        } else if (assignVal < 1000000) {
          appendBits(6, 3, bb);
          appendBits(assignVal, 21, bb);
        } else throw "ECI assignment value out of range";
        return new QrSegment(QrSegment.Mode.ECI, 0, bb);
      } // Tests whether the given string can be encoded as a segment in numeric mode.
      // A string is encodable iff each character is in the range 0 to 9.

    }, {
      key: "isNumeric",
      value: function isNumeric(text) {
        return QrSegment.NUMERIC_REGEX.test(text);
      } // Tests whether the given string can be encoded as a segment in alphanumeric mode.
      // A string is encodable iff each character is in the following set: 0 to 9, A to Z
      // (uppercase only), space, dollar, percent, asterisk, plus, hyphen, period, slash, colon.

    }, {
      key: "isAlphanumeric",
      value: function isAlphanumeric(text) {
        return QrSegment.ALPHANUMERIC_REGEX.test(text);
      }
    }, {
      key: "getTotalBits",
      value: function getTotalBits(segs, version) {
        var result = 0;

        var _iterator6 = _createForOfIteratorHelper(segs),
            _step6;

        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var seg = _step6.value;
            var ccbits = seg.mode.numCharCountBits(version);
            if (seg.numChars >= 1 << ccbits) return Infinity; // The segment's length doesn't fit the field's bit width

            result += 4 + ccbits + seg.bitData.length;
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }

        return result;
      } // Returns a new array of bytes representing the given string encoded in UTF-8.

    }, {
      key: "toUtf8ByteArray",
      value: function toUtf8ByteArray(str) {
        str = encodeURI(str);
        var result = [];

        for (var i = 0; i < str.length; i++) {
          if (str.charAt(i) != "%") result.push(str.charCodeAt(i));else {
            result.push(parseInt(str.substr(i + 1, 2), 16));
            i += 2;
          }
        }

        return result;
      }
    }]);

    return QrSegment;
  }();
  /*-- Constants --*/
  // Describes precisely all strings that are encodable in numeric mode.


  QrSegment.NUMERIC_REGEX = /^[0-9]*$/; // Describes precisely all strings that are encodable in alphanumeric mode.

  QrSegment.ALPHANUMERIC_REGEX = /^[A-Z0-9 $%*+.\/:-]*$/; // The set of all legal characters in alphanumeric mode,
  // where each character value maps to the index in the string.

  QrSegment.ALPHANUMERIC_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";
  qrcodegen.QrSegment = QrSegment;
})(qrcodegen || (qrcodegen = {}));
/*---- Public helper enumeration ----*/


(function (qrcodegen) {
  var QrCode;

  (function (QrCode) {
    /*
     * The error correction level in a QR Code symbol. Immutable.
     */
    var Ecc = /*#__PURE__*/_createClass(
    /*-- Constructor and fields --*/
    function Ecc( // In the range 0 to 3 (unsigned 2-bit integer).
    ordinal, // (Package-private) In the range 0 to 3 (unsigned 2-bit integer).
    formatBits) {
      _classCallCheck(this, Ecc);

      this.ordinal = ordinal;
      this.formatBits = formatBits;
    });
    /*-- Constants --*/


    Ecc.LOW = new Ecc(0, 1); // The QR Code can tolerate about  7% erroneous codewords

    Ecc.MEDIUM = new Ecc(1, 0); // The QR Code can tolerate about 15% erroneous codewords

    Ecc.QUARTILE = new Ecc(2, 3); // The QR Code can tolerate about 25% erroneous codewords

    Ecc.HIGH = new Ecc(3, 2); // The QR Code can tolerate about 30% erroneous codewords

    QrCode.Ecc = Ecc;
  })(QrCode = qrcodegen.QrCode || (qrcodegen.QrCode = {}));
})(qrcodegen || (qrcodegen = {}));
/*---- Public helper enumeration ----*/


(function (qrcodegen) {
  var QrSegment;

  (function (QrSegment) {
    /*
     * Describes how a segment's data bits are interpreted. Immutable.
     */
    var Mode = /*#__PURE__*/function () {
      /*-- Constructor and fields --*/
      function Mode( // The mode indicator bits, which is a uint4 value (range 0 to 15).
      modeBits, // Number of character count bits for three different version ranges.
      numBitsCharCount) {
        _classCallCheck(this, Mode);

        this.modeBits = modeBits;
        this.numBitsCharCount = numBitsCharCount;
      }
      /*-- Method --*/
      // (Package-private) Returns the bit width of the character count field for a segment in
      // this mode in a QR Code at the given version number. The result is in the range [0, 16].


      _createClass(Mode, [{
        key: "numCharCountBits",
        value: function numCharCountBits(ver) {
          return this.numBitsCharCount[Math.floor((ver + 7) / 17)];
        }
      }]);

      return Mode;
    }();
    /*-- Constants --*/


    Mode.NUMERIC = new Mode(0x1, [10, 12, 14]);
    Mode.ALPHANUMERIC = new Mode(0x2, [9, 11, 13]);
    Mode.BYTE = new Mode(0x4, [8, 16, 16]);
    Mode.KANJI = new Mode(0x8, [8, 10, 12]);
    Mode.ECI = new Mode(0x7, [0, 0, 0]);
    QrSegment.Mode = Mode;
  })(QrSegment = qrcodegen.QrSegment || (qrcodegen.QrSegment = {}));
})(qrcodegen || (qrcodegen = {}));

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./assets/js/qrcodegen-v1.7.0-es6.js"));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QixFQUFvQixFQUFwQixFQUF3QixFQUF4QixFQUE0QixFQUE1QixFQUFnQyxFQUFoQyxFQUFvQyxFQUFwQyxFQUF3QyxFQUF4QyxFQUE0QyxFQUE1QyxFQUFnRCxFQUFoRCxFQUFvRCxFQUFwRCxFQUF3RCxFQUF4RCxFQUE0RCxFQUE1RCxFQUFnRSxFQUFoRSxFQUFvRSxFQUFwRSxFQUF3RSxFQUF4RSxFQUE0RSxFQUE1RSxFQUFnRixFQUFoRixFQUFvRixFQUFwRixFQUF3RixFQUF4RixFQUE0RixFQUE1RixFQUFnRyxFQUFoRyxFQUFvRyxFQUFwRyxFQUF3RyxFQUF4RyxFQUE0RyxFQUE1RyxFQUFnSCxFQUFoSCxFQUFvSCxFQUFwSCxFQUF3SCxFQUF4SCxFQUE0SCxFQUE1SCxFQUFnSSxFQUFoSSxFQUFvSSxFQUFwSSxFQUF3SSxFQUF4SSxFQUE0SSxFQUE1SSxFQUFnSixFQUFoSixFQUFvSixFQUFwSixFQUF3SixFQUF4SixFQUE0SixFQUE1SixFQUFnSyxFQUFoSyxDQUg2QixFQUk3QixDQUFDLENBQUMsQ0FBRixFQUFLLEVBQUwsRUFBUyxFQUFULEVBQWEsRUFBYixFQUFpQixFQUFqQixFQUFxQixFQUFyQixFQUF5QixFQUF6QixFQUE2QixFQUE3QixFQUFpQyxFQUFqQyxFQUFxQyxFQUFyQyxFQUF5QyxFQUF6QyxFQUE2QyxFQUE3QyxFQUFpRCxFQUFqRCxFQUFxRCxFQUFyRCxFQUF5RCxFQUF6RCxFQUE2RCxFQUE3RCxFQUFpRSxFQUFqRSxFQUFxRSxFQUFyRSxFQUF5RSxFQUF6RSxFQUE2RSxFQUE3RSxFQUFpRixFQUFqRixFQUFxRixFQUFyRixFQUF5RixFQUF6RixFQUE2RixFQUE3RixFQUFpRyxFQUFqRyxFQUFxRyxFQUFyRyxFQUF5RyxFQUF6RyxFQUE2RyxFQUE3RyxFQUFpSCxFQUFqSCxFQUFxSCxFQUFySCxFQUF5SCxFQUF6SCxFQUE2SCxFQUE3SCxFQUFpSSxFQUFqSSxFQUFxSSxFQUFySSxFQUF5SSxFQUF6SSxFQUE2SSxFQUE3SSxFQUFpSixFQUFqSixFQUFxSixFQUFySixFQUF5SixFQUF6SixFQUE2SixFQUE3SixFQUFpSyxFQUFqSyxDQUo2QixFQUs3QixDQUFDLENBQUMsQ0FBRixFQUFLLEVBQUwsRUFBUyxFQUFULEVBQWEsRUFBYixFQUFpQixFQUFqQixFQUFxQixFQUFyQixFQUF5QixFQUF6QixFQUE2QixFQUE3QixFQUFpQyxFQUFqQyxFQUFxQyxFQUFyQyxFQUF5QyxFQUF6QyxFQUE2QyxFQUE3QyxFQUFpRCxFQUFqRCxFQUFxRCxFQUFyRCxFQUF5RCxFQUF6RCxFQUE2RCxFQUE3RCxFQUFpRSxFQUFqRSxFQUFxRSxFQUFyRSxFQUF5RSxFQUF6RSxFQUE2RSxFQUE3RSxFQUFpRixFQUFqRixFQUFxRixFQUFyRixFQUF5RixFQUF6RixFQUE2RixFQUE3RixFQUFpRyxFQUFqRyxFQUFxRyxFQUFyRyxFQUF5RyxFQUF6RyxFQUE2RyxFQUE3RyxFQUFpSCxFQUFqSCxFQUFxSCxFQUFySCxFQUF5SCxFQUF6SCxFQUE2SCxFQUE3SCxFQUFpSSxFQUFqSSxFQUFxSSxFQUFySSxFQUF5SSxFQUF6SSxFQUE2SSxFQUE3SSxFQUFpSixFQUFqSixFQUFxSixFQUFySixFQUF5SixFQUF6SixFQUE2SixFQUE3SixFQUFpSyxFQUFqSyxDQUw2QixFQU03QixDQUFDLENBQUMsQ0FBRixFQUFLLEVBQUwsRUFBUyxFQUFULEVBQWEsRUFBYixFQUFpQixFQUFqQixFQUFxQixFQUFyQixFQUF5QixFQUF6QixFQUE2QixFQUE3QixFQUFpQyxFQUFqQyxFQUFxQyxFQUFyQyxFQUF5QyxFQUF6QyxFQUE2QyxFQUE3QyxFQUFpRCxFQUFqRCxFQUFxRCxFQUFyRCxFQUF5RCxFQUF6RCxFQUE2RCxFQUE3RCxFQUFpRSxFQUFqRSxFQUFxRSxFQUFyRSxFQUF5RSxFQUF6RSxFQUE2RSxFQUE3RSxFQUFpRixFQUFqRixFQUFxRixFQUFyRixFQUF5RixFQUF6RixFQUE2RixFQUE3RixFQUFpRyxFQUFqRyxFQUFxRyxFQUFyRyxFQUF5RyxFQUF6RyxFQUE2RyxFQUE3RyxFQUFpSCxFQUFqSCxFQUFxSCxF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O0FBQ0FBLElBQUFBLElBQUksQ0FBQ1ksWUFBTCxHQUFvQixJQUFJWixJQUFKLENBQVMsR0FBVCxFQUFjLENBQUMsQ0FBRCxFQUFJLEVBQUosRUFBUSxFQUFSLENBQWQsQ0FBcEI7QUFDQUEsSUFBQUEsSUFBSSxDQUFDQyxJQUFMLEdBQVksSUFBSUQsSUFBSixDQUFTLEdBQVQsRUFBYyxDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixDQUFkLENBQVo7QUFDQUEsSUFBQUEsSUFBSSxDQUFDNEIsS0FBTCxHQUFhLElBQUk1QixJQUFKLENBQVMsR0FBVCxFQUFjLENBQUMsQ0FBRCxFQUFJLEVBQUosRUFBUSxFQUFSLENBQWQsQ0FBYjtBQUNBQSxJQUFBQSxJQUFJLENBQUNpQixHQUFMLEdBQVcsSUFBSWpCLElBQUosQ0FBUyxHQUFULEVBQWMsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsQ0FBZCxDQUFYO0FBQ0F2QyxJQUFBQSxTQUFTLENBQUN1QyxJQUFWLEdBQWlCQSxJQUFqQjtBQUNILEdBNUJELEVBNEJHdkMsU0FBUyxHQUFHM0csU0FBUyxDQUFDMkcsU0FBVixLQUF3QjNHLFNBQVMsQ0FBQzJHLFNBQVYsR0FBc0IsRUFBOUMsQ0E1QmY7QUE2QkgsQ0EvQkQsRUErQkczRyxTQUFTLEtBQUtBLFNBQVMsR0FBRyxFQUFqQixDQS9CWiIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL2Fzc2V0cy9qcy9xcmNvZGVnZW4tdjEuNy4wLWVzNi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogUVIgQ29kZSBnZW5lcmF0b3IgbGlicmFyeSAoY29tcGlsZWQgZnJvbSBUeXBlU2NyaXB0KVxuICpcbiAqIENvcHlyaWdodCAoYykgUHJvamVjdCBOYXl1a2kuIChNSVQgTGljZW5zZSlcbiAqIGh0dHBzOi8vd3d3Lm5heXVraS5pby9wYWdlL3FyLWNvZGUtZ2VuZXJhdG9yLWxpYnJhcnlcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mXG4gKiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluXG4gKiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvXG4gKiB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZlxuICogdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKiAtIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiAgIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICogLSBUaGUgU29mdHdhcmUgaXMgcHJvdmlkZWQgXCJhcyBpc1wiLCB3aXRob3V0IHdhcnJhbnR5IG9mIGFueSBraW5kLCBleHByZXNzIG9yXG4gKiAgIGltcGxpZWQsIGluY2x1ZGluZyBidXQgbm90IGxpbWl0ZWQgdG8gdGhlIHdhcnJhbnRpZXMgb2YgbWVyY2hhbnRhYmlsaXR5LFxuICogICBmaXRuZXNzIGZvciBhIHBhcnRpY3VsYXIgcHVycG9zZSBhbmQgbm9uaW5mcmluZ2VtZW50LiBJbiBubyBldmVudCBzaGFsbCB0aGVcbiAqICAgYXV0aG9ycyBvciBjb3B5cmlnaHQgaG9sZGVycyBiZSBsaWFibGUgZm9yIGFueSBjbGFpbSwgZGFtYWdlcyBvciBvdGhlclxuICogICBsaWFiaWxpdHksIHdoZXRoZXIgaW4gYW4gYWN0aW9uIG9mIGNvbnRyYWN0LCB0b3J0IG9yIG90aGVyd2lzZSwgYXJpc2luZyBmcm9tLFxuICogICBvdXQgb2Ygb3IgaW4gY29ubmVjdGlvbiB3aXRoIHRoZSBTb2Z0d2FyZSBvciB0aGUgdXNlIG9yIG90aGVyIGRlYWxpbmdzIGluIHRoZVxuICogICBTb2Z0d2FyZS5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG52YXIgcXJjb2RlZ2VuO1xuKGZ1bmN0aW9uIChxcmNvZGVnZW4pIHtcbiAgICAvKi0tLS0gUVIgQ29kZSBzeW1ib2wgY2xhc3MgLS0tLSovXG4gICAgLypcbiAgICAgKiBBIFFSIENvZGUgc3ltYm9sLCB3aGljaCBpcyBhIHR5cGUgb2YgdHdvLWRpbWVuc2lvbiBiYXJjb2RlLlxuICAgICAqIEludmVudGVkIGJ5IERlbnNvIFdhdmUgYW5kIGRlc2NyaWJlZCBpbiB0aGUgSVNPL0lFQyAxODAwNCBzdGFuZGFyZC5cbiAgICAgKiBJbnN0YW5jZXMgb2YgdGhpcyBjbGFzcyByZXByZXNlbnQgYW4gaW1tdXRhYmxlIHNxdWFyZSBncmlkIG9mIGRhcmsgYW5kIGxpZ2h0IGNlbGxzLlxuICAgICAqIFRoZSBjbGFzcyBwcm92aWRlcyBzdGF0aWMgZmFjdG9yeSBmdW5jdGlvbnMgdG8gY3JlYXRlIGEgUVIgQ29kZSBmcm9tIHRleHQgb3IgYmluYXJ5IGRhdGEuXG4gICAgICogVGhlIGNsYXNzIGNvdmVycyB0aGUgUVIgQ29kZSBNb2RlbCAyIHNwZWNpZmljYXRpb24sIHN1cHBvcnRpbmcgYWxsIHZlcnNpb25zIChzaXplcylcbiAgICAgKiBmcm9tIDEgdG8gNDAsIGFsbCA0IGVycm9yIGNvcnJlY3Rpb24gbGV2ZWxzLCBhbmQgNCBjaGFyYWN0ZXIgZW5jb2RpbmcgbW9kZXMuXG4gICAgICpcbiAgICAgKiBXYXlzIHRvIGNyZWF0ZSBhIFFSIENvZGUgb2JqZWN0OlxuICAgICAqIC0gSGlnaCBsZXZlbDogVGFrZSB0aGUgcGF5bG9hZCBkYXRhIGFuZCBjYWxsIFFyQ29kZS5lbmNvZGVUZXh0KCkgb3IgUXJDb2RlLmVuY29kZUJpbmFyeSgpLlxuICAgICAqIC0gTWlkIGxldmVsOiBDdXN0b20tbWFrZSB0aGUgbGlzdCBvZiBzZWdtZW50cyBhbmQgY2FsbCBRckNvZGUuZW5jb2RlU2VnbWVudHMoKS5cbiAgICAgKiAtIExvdyBsZXZlbDogQ3VzdG9tLW1ha2UgdGhlIGFycmF5IG9mIGRhdGEgY29kZXdvcmQgYnl0ZXMgKGluY2x1ZGluZ1xuICAgICAqICAgc2VnbWVudCBoZWFkZXJzIGFuZCBmaW5hbCBwYWRkaW5nLCBleGNsdWRpbmcgZXJyb3IgY29ycmVjdGlvbiBjb2Rld29yZHMpLFxuICAgICAqICAgc3VwcGx5IHRoZSBhcHByb3ByaWF0ZSB2ZXJzaW9uIG51bWJlciwgYW5kIGNhbGwgdGhlIFFyQ29kZSgpIGNvbnN0cnVjdG9yLlxuICAgICAqIChOb3RlIHRoYXQgYWxsIHdheXMgcmVxdWlyZSBzdXBwbHlpbmcgdGhlIGRlc2lyZWQgZXJyb3IgY29ycmVjdGlvbiBsZXZlbC4pXG4gICAgICovXG4gICAgY2xhc3MgUXJDb2RlIHtcbiAgICAgICAgLyotLSBDb25zdHJ1Y3RvciAobG93IGxldmVsKSBhbmQgZmllbGRzIC0tKi9cbiAgICAgICAgLy8gQ3JlYXRlcyBhIG5ldyBRUiBDb2RlIHdpdGggdGhlIGdpdmVuIHZlcnNpb24gbnVtYmVyLFxuICAgICAgICAvLyBlcnJvciBjb3JyZWN0aW9uIGxldmVsLCBkYXRhIGNvZGV3b3JkIGJ5dGVzLCBhbmQgbWFzayBudW1iZXIuXG4gICAgICAgIC8vIFRoaXMgaXMgYSBsb3ctbGV2ZWwgQVBJIHRoYXQgbW9zdCB1c2VycyBzaG91bGQgbm90IHVzZSBkaXJlY3RseS5cbiAgICAgICAgLy8gQSBtaWQtbGV2ZWwgQVBJIGlzIHRoZSBlbmNvZGVTZWdtZW50cygpIGZ1bmN0aW9uLlxuICAgICAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgLy8gVGhlIHZlcnNpb24gbnVtYmVyIG9mIHRoaXMgUVIgQ29kZSwgd2hpY2ggaXMgYmV0d2VlbiAxIGFuZCA0MCAoaW5jbHVzaXZlKS5cbiAgICAgICAgLy8gVGhpcyBkZXRlcm1pbmVzIHRoZSBzaXplIG9mIHRoaXMgYmFyY29kZS5cbiAgICAgICAgdmVyc2lvbiwgXG4gICAgICAgIC8vIFRoZSBlcnJvciBjb3JyZWN0aW9uIGxldmVsIHVzZWQgaW4gdGhpcyBRUiBDb2RlLlxuICAgICAgICBlcnJvckNvcnJlY3Rpb25MZXZlbCwgZGF0YUNvZGV3b3JkcywgXG4gICAgICAgIC8vIFRoZSBpbmRleCBvZiB0aGUgbWFzayBwYXR0ZXJuIHVzZWQgaW4gdGhpcyBRUiBDb2RlLCB3aGljaCBpcyBiZXR3ZWVuIDAgYW5kIDcgKGluY2x1c2l2ZSkuXG4gICAgICAgIC8vIEV2ZW4gaWYgYSBRUiBDb2RlIGlzIGNyZWF0ZWQgd2l0aCBhdXRvbWF0aWMgbWFza2luZyByZXF1ZXN0ZWQgKG1hc2sgPSAtMSksXG4gICAgICAgIC8vIHRoZSByZXN1bHRpbmcgb2JqZWN0IHN0aWxsIGhhcyBhIG1hc2sgdmFsdWUgYmV0d2VlbiAwIGFuZCA3LlxuICAgICAgICBtYXNrKSB7XG4gICAgICAgICAgICB0aGlzLnZlcnNpb24gPSB2ZXJzaW9uO1xuICAgICAgICAgICAgdGhpcy5lcnJvckNvcnJlY3Rpb25MZXZlbCA9IGVycm9yQ29ycmVjdGlvbkxldmVsO1xuICAgICAgICAgICAgdGhpcy5tYXNrID0gbWFzaztcbiAgICAgICAgICAgIC8vIFRoZSBtb2R1bGVzIG9mIHRoaXMgUVIgQ29kZSAoZmFsc2UgPSBsaWdodCwgdHJ1ZSA9IGRhcmspLlxuICAgICAgICAgICAgLy8gSW1tdXRhYmxlIGFmdGVyIGNvbnN0cnVjdG9yIGZpbmlzaGVzLiBBY2Nlc3NlZCB0aHJvdWdoIGdldE1vZHVsZSgpLlxuICAgICAgICAgICAgdGhpcy5tb2R1bGVzID0gW107XG4gICAgICAgICAgICAvLyBJbmRpY2F0ZXMgZnVuY3Rpb24gbW9kdWxlcyB0aGF0IGFyZSBub3Qgc3ViamVjdGVkIHRvIG1hc2tpbmcuIERpc2NhcmRlZCB3aGVuIGNvbnN0cnVjdG9yIGZpbmlzaGVzLlxuICAgICAgICAgICAgdGhpcy5pc0Z1bmN0aW9uID0gW107XG4gICAgICAgICAgICAvLyBDaGVjayBzY2FsYXIgYXJndW1lbnRzXG4gICAgICAgICAgICBpZiAodmVyc2lvbiA8IFFyQ29kZS5NSU5fVkVSU0lPTiB8fCB2ZXJzaW9uID4gUXJDb2RlLk1BWF9WRVJTSU9OKVxuICAgICAgICAgICAgICAgIHRocm93IFwiVmVyc2lvbiB2YWx1ZSBvdXQgb2YgcmFuZ2VcIjtcbiAgICAgICAgICAgIGlmIChtYXNrIDwgLTEgfHwgbWFzayA+IDcpXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJNYXNrIHZhbHVlIG91dCBvZiByYW5nZVwiO1xuICAgICAgICAgICAgdGhpcy5zaXplID0gdmVyc2lvbiAqIDQgKyAxNztcbiAgICAgICAgICAgIC8vIEluaXRpYWxpemUgYm90aCBncmlkcyB0byBiZSBzaXplKnNpemUgYXJyYXlzIG9mIEJvb2xlYW4gZmFsc2VcbiAgICAgICAgICAgIGxldCByb3cgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaXplOyBpKyspXG4gICAgICAgICAgICAgICAgcm93LnB1c2goZmFsc2UpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNpemU7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMubW9kdWxlcy5wdXNoKHJvdy5zbGljZSgpKTsgLy8gSW5pdGlhbGx5IGFsbCBsaWdodFxuICAgICAgICAgICAgICAgIHRoaXMuaXNGdW5jdGlvbi5wdXNoKHJvdy5zbGljZSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIENvbXB1dGUgRUNDLCBkcmF3IG1vZHVsZXNcbiAgICAgICAgICAgIHRoaXMuZHJhd0Z1bmN0aW9uUGF0dGVybnMoKTtcbiAgICAgICAgICAgIGNvbnN0IGFsbENvZGV3b3JkcyA9IHRoaXMuYWRkRWNjQW5kSW50ZXJsZWF2ZShkYXRhQ29kZXdvcmRzKTtcbiAgICAgICAgICAgIHRoaXMuZHJhd0NvZGV3b3JkcyhhbGxDb2Rld29yZHMpO1xuICAgICAgICAgICAgLy8gRG8gbWFza2luZ1xuICAgICAgICAgICAgaWYgKG1hc2sgPT0gLTEpIHsgLy8gQXV0b21hdGljYWxseSBjaG9vc2UgYmVzdCBtYXNrXG4gICAgICAgICAgICAgICAgbGV0IG1pblBlbmFsdHkgPSAxMDAwMDAwMDAwO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgODsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlNYXNrKGkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdGb3JtYXRCaXRzKGkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwZW5hbHR5ID0gdGhpcy5nZXRQZW5hbHR5U2NvcmUoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBlbmFsdHkgPCBtaW5QZW5hbHR5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXNrID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pblBlbmFsdHkgPSBwZW5hbHR5O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlNYXNrKGkpOyAvLyBVbmRvZXMgdGhlIG1hc2sgZHVlIHRvIFhPUlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYXNrIDwgMCB8fCBtYXNrID4gNylcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkFzc2VydGlvbiBlcnJvclwiO1xuICAgICAgICAgICAgdGhpcy5tYXNrID0gbWFzaztcbiAgICAgICAgICAgIHRoaXMuYXBwbHlNYXNrKG1hc2spOyAvLyBBcHBseSB0aGUgZmluYWwgY2hvaWNlIG9mIG1hc2tcbiAgICAgICAgICAgIHRoaXMuZHJhd0Zvcm1hdEJpdHMobWFzayk7IC8vIE92ZXJ3cml0ZSBvbGQgZm9ybWF0IGJpdHNcbiAgICAgICAgICAgIHRoaXMuaXNGdW5jdGlvbiA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIC8qLS0gU3RhdGljIGZhY3RvcnkgZnVuY3Rpb25zIChoaWdoIGxldmVsKSAtLSovXG4gICAgICAgIC8vIFJldHVybnMgYSBRUiBDb2RlIHJlcHJlc2VudGluZyB0aGUgZ2l2ZW4gVW5pY29kZSB0ZXh0IHN0cmluZyBhdCB0aGUgZ2l2ZW4gZXJyb3IgY29ycmVjdGlvbiBsZXZlbC5cbiAgICAgICAgLy8gQXMgYSBjb25zZXJ2YXRpdmUgdXBwZXIgYm91bmQsIHRoaXMgZnVuY3Rpb24gaXMgZ3VhcmFudGVlZCB0byBzdWNjZWVkIGZvciBzdHJpbmdzIHRoYXQgaGF2ZSA3Mzggb3IgZmV3ZXJcbiAgICAgICAgLy8gVW5pY29kZSBjb2RlIHBvaW50cyAobm90IFVURi0xNiBjb2RlIHVuaXRzKSBpZiB0aGUgbG93IGVycm9yIGNvcnJlY3Rpb24gbGV2ZWwgaXMgdXNlZC4gVGhlIHNtYWxsZXN0IHBvc3NpYmxlXG4gICAgICAgIC8vIFFSIENvZGUgdmVyc2lvbiBpcyBhdXRvbWF0aWNhbGx5IGNob3NlbiBmb3IgdGhlIG91dHB1dC4gVGhlIEVDQyBsZXZlbCBvZiB0aGUgcmVzdWx0IG1heSBiZSBoaWdoZXIgdGhhbiB0aGVcbiAgICAgICAgLy8gZWNsIGFyZ3VtZW50IGlmIGl0IGNhbiBiZSBkb25lIHdpdGhvdXQgaW5jcmVhc2luZyB0aGUgdmVyc2lvbi5cbiAgICAgICAgc3RhdGljIGVuY29kZVRleHQodGV4dCwgZWNsKSB7XG4gICAgICAgICAgICBjb25zdCBzZWdzID0gcXJjb2RlZ2VuLlFyU2VnbWVudC5tYWtlU2VnbWVudHModGV4dCk7XG4gICAgICAgICAgICByZXR1cm4gUXJDb2RlLmVuY29kZVNlZ21lbnRzKHNlZ3MsIGVjbCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmV0dXJucyBhIFFSIENvZGUgcmVwcmVzZW50aW5nIHRoZSBnaXZlbiBiaW5hcnkgZGF0YSBhdCB0aGUgZ2l2ZW4gZXJyb3IgY29ycmVjdGlvbiBsZXZlbC5cbiAgICAgICAgLy8gVGhpcyBmdW5jdGlvbiBhbHdheXMgZW5jb2RlcyB1c2luZyB0aGUgYmluYXJ5IHNlZ21lbnQgbW9kZSwgbm90IGFueSB0ZXh0IG1vZGUuIFRoZSBtYXhpbXVtIG51bWJlciBvZlxuICAgICAgICAvLyBieXRlcyBhbGxvd2VkIGlzIDI5NTMuIFRoZSBzbWFsbGVzdCBwb3NzaWJsZSBRUiBDb2RlIHZlcnNpb24gaXMgYXV0b21hdGljYWxseSBjaG9zZW4gZm9yIHRoZSBvdXRwdXQuXG4gICAgICAgIC8vIFRoZSBFQ0MgbGV2ZWwgb2YgdGhlIHJlc3VsdCBtYXkgYmUgaGlnaGVyIHRoYW4gdGhlIGVjbCBhcmd1bWVudCBpZiBpdCBjYW4gYmUgZG9uZSB3aXRob3V0IGluY3JlYXNpbmcgdGhlIHZlcnNpb24uXG4gICAgICAgIHN0YXRpYyBlbmNvZGVCaW5hcnkoZGF0YSwgZWNsKSB7XG4gICAgICAgICAgICBjb25zdCBzZWcgPSBxcmNvZGVnZW4uUXJTZWdtZW50Lm1ha2VCeXRlcyhkYXRhKTtcbiAgICAgICAgICAgIHJldHVybiBRckNvZGUuZW5jb2RlU2VnbWVudHMoW3NlZ10sIGVjbCk7XG4gICAgICAgIH1cbiAgICAgICAgLyotLSBTdGF0aWMgZmFjdG9yeSBmdW5jdGlvbnMgKG1pZCBsZXZlbCkgLS0qL1xuICAgICAgICAvLyBSZXR1cm5zIGEgUVIgQ29kZSByZXByZXNlbnRpbmcgdGhlIGdpdmVuIHNlZ21lbnRzIHdpdGggdGhlIGdpdmVuIGVuY29kaW5nIHBhcmFtZXRlcnMuXG4gICAgICAgIC8vIFRoZSBzbWFsbGVzdCBwb3NzaWJsZSBRUiBDb2RlIHZlcnNpb24gd2l0aGluIHRoZSBnaXZlbiByYW5nZSBpcyBhdXRvbWF0aWNhbGx5XG4gICAgICAgIC8vIGNob3NlbiBmb3IgdGhlIG91dHB1dC4gSWZmIGJvb3N0RWNsIGlzIHRydWUsIHRoZW4gdGhlIEVDQyBsZXZlbCBvZiB0aGUgcmVzdWx0XG4gICAgICAgIC8vIG1heSBiZSBoaWdoZXIgdGhhbiB0aGUgZWNsIGFyZ3VtZW50IGlmIGl0IGNhbiBiZSBkb25lIHdpdGhvdXQgaW5jcmVhc2luZyB0aGVcbiAgICAgICAgLy8gdmVyc2lvbi4gVGhlIG1hc2sgbnVtYmVyIGlzIGVpdGhlciBiZXR3ZWVuIDAgdG8gNyAoaW5jbHVzaXZlKSB0byBmb3JjZSB0aGF0XG4gICAgICAgIC8vIG1hc2ssIG9yIC0xIHRvIGF1dG9tYXRpY2FsbHkgY2hvb3NlIGFuIGFwcHJvcHJpYXRlIG1hc2sgKHdoaWNoIG1heSBiZSBzbG93KS5cbiAgICAgICAgLy8gVGhpcyBmdW5jdGlvbiBhbGxvd3MgdGhlIHVzZXIgdG8gY3JlYXRlIGEgY3VzdG9tIHNlcXVlbmNlIG9mIHNlZ21lbnRzIHRoYXQgc3dpdGNoZXNcbiAgICAgICAgLy8gYmV0d2VlbiBtb2RlcyAoc3VjaCBhcyBhbHBoYW51bWVyaWMgYW5kIGJ5dGUpIHRvIGVuY29kZSB0ZXh0IGluIGxlc3Mgc3BhY2UuXG4gICAgICAgIC8vIFRoaXMgaXMgYSBtaWQtbGV2ZWwgQVBJOyB0aGUgaGlnaC1sZXZlbCBBUEkgaXMgZW5jb2RlVGV4dCgpIGFuZCBlbmNvZGVCaW5hcnkoKS5cbiAgICAgICAgc3RhdGljIGVuY29kZVNlZ21lbnRzKHNlZ3MsIGVjbCwgbWluVmVyc2lvbiA9IDEsIG1heFZlcnNpb24gPSA0MCwgbWFzayA9IC0xLCBib29zdEVjbCA9IHRydWUpIHtcbiAgICAgICAgICAgIGlmICghKFFyQ29kZS5NSU5fVkVSU0lPTiA8PSBtaW5WZXJzaW9uICYmIG1pblZlcnNpb24gPD0gbWF4VmVyc2lvbiAmJiBtYXhWZXJzaW9uIDw9IFFyQ29kZS5NQVhfVkVSU0lPTilcbiAgICAgICAgICAgICAgICB8fCBtYXNrIDwgLTEgfHwgbWFzayA+IDcpXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJJbnZhbGlkIHZhbHVlXCI7XG4gICAgICAgICAgICAvLyBGaW5kIHRoZSBtaW5pbWFsIHZlcnNpb24gbnVtYmVyIHRvIHVzZVxuICAgICAgICAgICAgbGV0IHZlcnNpb247XG4gICAgICAgICAgICBsZXQgZGF0YVVzZWRCaXRzO1xuICAgICAgICAgICAgZm9yICh2ZXJzaW9uID0gbWluVmVyc2lvbjs7IHZlcnNpb24rKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFDYXBhY2l0eUJpdHMgPSBRckNvZGUuZ2V0TnVtRGF0YUNvZGV3b3Jkcyh2ZXJzaW9uLCBlY2wpICogODsgLy8gTnVtYmVyIG9mIGRhdGEgYml0cyBhdmFpbGFibGVcbiAgICAgICAgICAgICAgICBjb25zdCB1c2VkQml0cyA9IFFyU2VnbWVudC5nZXRUb3RhbEJpdHMoc2VncywgdmVyc2lvbik7XG4gICAgICAgICAgICAgICAgaWYgKHVzZWRCaXRzIDw9IGRhdGFDYXBhY2l0eUJpdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVVzZWRCaXRzID0gdXNlZEJpdHM7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrOyAvLyBUaGlzIHZlcnNpb24gbnVtYmVyIGlzIGZvdW5kIHRvIGJlIHN1aXRhYmxlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh2ZXJzaW9uID49IG1heFZlcnNpb24pIC8vIEFsbCB2ZXJzaW9ucyBpbiB0aGUgcmFuZ2UgY291bGQgbm90IGZpdCB0aGUgZ2l2ZW4gZGF0YVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBcIkRhdGEgdG9vIGxvbmdcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEluY3JlYXNlIHRoZSBlcnJvciBjb3JyZWN0aW9uIGxldmVsIHdoaWxlIHRoZSBkYXRhIHN0aWxsIGZpdHMgaW4gdGhlIGN1cnJlbnQgdmVyc2lvbiBudW1iZXJcbiAgICAgICAgICAgIGZvciAoY29uc3QgbmV3RWNsIG9mIFtRckNvZGUuRWNjLk1FRElVTSwgUXJDb2RlLkVjYy5RVUFSVElMRSwgUXJDb2RlLkVjYy5ISUdIXSkgeyAvLyBGcm9tIGxvdyB0byBoaWdoXG4gICAgICAgICAgICAgICAgaWYgKGJvb3N0RWNsICYmIGRhdGFVc2VkQml0cyA8PSBRckNvZGUuZ2V0TnVtRGF0YUNvZGV3b3Jkcyh2ZXJzaW9uLCBuZXdFY2wpICogOClcbiAgICAgICAgICAgICAgICAgICAgZWNsID0gbmV3RWNsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQ29uY2F0ZW5hdGUgYWxsIHNlZ21lbnRzIHRvIGNyZWF0ZSB0aGUgZGF0YSBiaXQgc3RyaW5nXG4gICAgICAgICAgICBsZXQgYmIgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3Qgc2VnIG9mIHNlZ3MpIHtcbiAgICAgICAgICAgICAgICBhcHBlbmRCaXRzKHNlZy5tb2RlLm1vZGVCaXRzLCA0LCBiYik7XG4gICAgICAgICAgICAgICAgYXBwZW5kQml0cyhzZWcubnVtQ2hhcnMsIHNlZy5tb2RlLm51bUNoYXJDb3VudEJpdHModmVyc2lvbiksIGJiKTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGIgb2Ygc2VnLmdldERhdGEoKSlcbiAgICAgICAgICAgICAgICAgICAgYmIucHVzaChiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiYi5sZW5ndGggIT0gZGF0YVVzZWRCaXRzKVxuICAgICAgICAgICAgICAgIHRocm93IFwiQXNzZXJ0aW9uIGVycm9yXCI7XG4gICAgICAgICAgICAvLyBBZGQgdGVybWluYXRvciBhbmQgcGFkIHVwIHRvIGEgYnl0ZSBpZiBhcHBsaWNhYmxlXG4gICAgICAgICAgICBjb25zdCBkYXRhQ2FwYWNpdHlCaXRzID0gUXJDb2RlLmdldE51bURhdGFDb2Rld29yZHModmVyc2lvbiwgZWNsKSAqIDg7XG4gICAgICAgICAgICBpZiAoYmIubGVuZ3RoID4gZGF0YUNhcGFjaXR5Qml0cylcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkFzc2VydGlvbiBlcnJvclwiO1xuICAgICAgICAgICAgYXBwZW5kQml0cygwLCBNYXRoLm1pbig0LCBkYXRhQ2FwYWNpdHlCaXRzIC0gYmIubGVuZ3RoKSwgYmIpO1xuICAgICAgICAgICAgYXBwZW5kQml0cygwLCAoOCAtIGJiLmxlbmd0aCAlIDgpICUgOCwgYmIpO1xuICAgICAgICAgICAgaWYgKGJiLmxlbmd0aCAlIDggIT0gMClcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkFzc2VydGlvbiBlcnJvclwiO1xuICAgICAgICAgICAgLy8gUGFkIHdpdGggYWx0ZXJuYXRpbmcgYnl0ZXMgdW50aWwgZGF0YSBjYXBhY2l0eSBpcyByZWFjaGVkXG4gICAgICAgICAgICBmb3IgKGxldCBwYWRCeXRlID0gMHhFQzsgYmIubGVuZ3RoIDwgZGF0YUNhcGFjaXR5Qml0czsgcGFkQnl0ZSBePSAweEVDIF4gMHgxMSlcbiAgICAgICAgICAgICAgICBhcHBlbmRCaXRzKHBhZEJ5dGUsIDgsIGJiKTtcbiAgICAgICAgICAgIC8vIFBhY2sgYml0cyBpbnRvIGJ5dGVzIGluIGJpZyBlbmRpYW5cbiAgICAgICAgICAgIGxldCBkYXRhQ29kZXdvcmRzID0gW107XG4gICAgICAgICAgICB3aGlsZSAoZGF0YUNvZGV3b3Jkcy5sZW5ndGggKiA4IDwgYmIubGVuZ3RoKVxuICAgICAgICAgICAgICAgIGRhdGFDb2Rld29yZHMucHVzaCgwKTtcbiAgICAgICAgICAgIGJiLmZvckVhY2goKGIsIGkpID0+IGRhdGFDb2Rld29yZHNbaSA+Pj4gM10gfD0gYiA8PCAoNyAtIChpICYgNykpKTtcbiAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgUVIgQ29kZSBvYmplY3RcbiAgICAgICAgICAgIHJldHVybiBuZXcgUXJDb2RlKHZlcnNpb24sIGVjbCwgZGF0YUNvZGV3b3JkcywgbWFzayk7XG4gICAgICAgIH1cbiAgICAgICAgLyotLSBBY2Nlc3NvciBtZXRob2RzIC0tKi9cbiAgICAgICAgLy8gUmV0dXJucyB0aGUgY29sb3Igb2YgdGhlIG1vZHVsZSAocGl4ZWwpIGF0IHRoZSBnaXZlbiBjb29yZGluYXRlcywgd2hpY2ggaXMgZmFsc2VcbiAgICAgICAgLy8gZm9yIGxpZ2h0IG9yIHRydWUgZm9yIGRhcmsuIFRoZSB0b3AgbGVmdCBjb3JuZXIgaGFzIHRoZSBjb29yZGluYXRlcyAoeD0wLCB5PTApLlxuICAgICAgICAvLyBJZiB0aGUgZ2l2ZW4gY29vcmRpbmF0ZXMgYXJlIG91dCBvZiBib3VuZHMsIHRoZW4gZmFsc2UgKGxpZ2h0KSBpcyByZXR1cm5lZC5cbiAgICAgICAgZ2V0TW9kdWxlKHgsIHkpIHtcbiAgICAgICAgICAgIHJldHVybiAwIDw9IHggJiYgeCA8IHRoaXMuc2l6ZSAmJiAwIDw9IHkgJiYgeSA8IHRoaXMuc2l6ZSAmJiB0aGlzLm1vZHVsZXNbeV1beF07XG4gICAgICAgIH1cbiAgICAgICAgLyotLSBQcml2YXRlIGhlbHBlciBtZXRob2RzIGZvciBjb25zdHJ1Y3RvcjogRHJhd2luZyBmdW5jdGlvbiBtb2R1bGVzIC0tKi9cbiAgICAgICAgLy8gUmVhZHMgdGhpcyBvYmplY3QncyB2ZXJzaW9uIGZpZWxkLCBhbmQgZHJhd3MgYW5kIG1hcmtzIGFsbCBmdW5jdGlvbiBtb2R1bGVzLlxuICAgICAgICBkcmF3RnVuY3Rpb25QYXR0ZXJucygpIHtcbiAgICAgICAgICAgIC8vIERyYXcgaG9yaXpvbnRhbCBhbmQgdmVydGljYWwgdGltaW5nIHBhdHRlcm5zXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2l6ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRGdW5jdGlvbk1vZHVsZSg2LCBpLCBpICUgMiA9PSAwKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEZ1bmN0aW9uTW9kdWxlKGksIDYsIGkgJSAyID09IDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRHJhdyAzIGZpbmRlciBwYXR0ZXJucyAoYWxsIGNvcm5lcnMgZXhjZXB0IGJvdHRvbSByaWdodDsgb3ZlcndyaXRlcyBzb21lIHRpbWluZyBtb2R1bGVzKVxuICAgICAgICAgICAgdGhpcy5kcmF3RmluZGVyUGF0dGVybigzLCAzKTtcbiAgICAgICAgICAgIHRoaXMuZHJhd0ZpbmRlclBhdHRlcm4odGhpcy5zaXplIC0gNCwgMyk7XG4gICAgICAgICAgICB0aGlzLmRyYXdGaW5kZXJQYXR0ZXJuKDMsIHRoaXMuc2l6ZSAtIDQpO1xuICAgICAgICAgICAgLy8gRHJhdyBudW1lcm91cyBhbGlnbm1lbnQgcGF0dGVybnNcbiAgICAgICAgICAgIGNvbnN0IGFsaWduUGF0UG9zID0gdGhpcy5nZXRBbGlnbm1lbnRQYXR0ZXJuUG9zaXRpb25zKCk7XG4gICAgICAgICAgICBjb25zdCBudW1BbGlnbiA9IGFsaWduUGF0UG9zLmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtQWxpZ247IGkrKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbnVtQWxpZ247IGorKykge1xuICAgICAgICAgICAgICAgICAgICAvLyBEb24ndCBkcmF3IG9uIHRoZSB0aHJlZSBmaW5kZXIgY29ybmVyc1xuICAgICAgICAgICAgICAgICAgICBpZiAoIShpID09IDAgJiYgaiA9PSAwIHx8IGkgPT0gMCAmJiBqID09IG51bUFsaWduIC0gMSB8fCBpID09IG51bUFsaWduIC0gMSAmJiBqID09IDApKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3QWxpZ25tZW50UGF0dGVybihhbGlnblBhdFBvc1tpXSwgYWxpZ25QYXRQb3Nbal0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIERyYXcgY29uZmlndXJhdGlvbiBkYXRhXG4gICAgICAgICAgICB0aGlzLmRyYXdGb3JtYXRCaXRzKDApOyAvLyBEdW1teSBtYXNrIHZhbHVlOyBvdmVyd3JpdHRlbiBsYXRlciBpbiB0aGUgY29uc3RydWN0b3JcbiAgICAgICAgICAgIHRoaXMuZHJhd1ZlcnNpb24oKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBEcmF3cyB0d28gY29waWVzIG9mIHRoZSBmb3JtYXQgYml0cyAod2l0aCBpdHMgb3duIGVycm9yIGNvcnJlY3Rpb24gY29kZSlcbiAgICAgICAgLy8gYmFzZWQgb24gdGhlIGdpdmVuIG1hc2sgYW5kIHRoaXMgb2JqZWN0J3MgZXJyb3IgY29ycmVjdGlvbiBsZXZlbCBmaWVsZC5cbiAgICAgICAgZHJhd0Zvcm1hdEJpdHMobWFzaykge1xuICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIGVycm9yIGNvcnJlY3Rpb24gY29kZSBhbmQgcGFjayBiaXRzXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5lcnJvckNvcnJlY3Rpb25MZXZlbC5mb3JtYXRCaXRzIDw8IDMgfCBtYXNrOyAvLyBlcnJDb3JyTHZsIGlzIHVpbnQyLCBtYXNrIGlzIHVpbnQzXG4gICAgICAgICAgICBsZXQgcmVtID0gZGF0YTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKylcbiAgICAgICAgICAgICAgICByZW0gPSAocmVtIDw8IDEpIF4gKChyZW0gPj4+IDkpICogMHg1MzcpO1xuICAgICAgICAgICAgY29uc3QgYml0cyA9IChkYXRhIDw8IDEwIHwgcmVtKSBeIDB4NTQxMjsgLy8gdWludDE1XG4gICAgICAgICAgICBpZiAoYml0cyA+Pj4gMTUgIT0gMClcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkFzc2VydGlvbiBlcnJvclwiO1xuICAgICAgICAgICAgLy8gRHJhdyBmaXJzdCBjb3B5XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSA1OyBpKyspXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRGdW5jdGlvbk1vZHVsZSg4LCBpLCBnZXRCaXQoYml0cywgaSkpO1xuICAgICAgICAgICAgdGhpcy5zZXRGdW5jdGlvbk1vZHVsZSg4LCA3LCBnZXRCaXQoYml0cywgNikpO1xuICAgICAgICAgICAgdGhpcy5zZXRGdW5jdGlvbk1vZHVsZSg4LCA4LCBnZXRCaXQoYml0cywgNykpO1xuICAgICAgICAgICAgdGhpcy5zZXRGdW5jdGlvbk1vZHVsZSg3LCA4LCBnZXRCaXQoYml0cywgOCkpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDk7IGkgPCAxNTsgaSsrKVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RnVuY3Rpb25Nb2R1bGUoMTQgLSBpLCA4LCBnZXRCaXQoYml0cywgaSkpO1xuICAgICAgICAgICAgLy8gRHJhdyBzZWNvbmQgY29weVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA4OyBpKyspXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRGdW5jdGlvbk1vZHVsZSh0aGlzLnNpemUgLSAxIC0gaSwgOCwgZ2V0Qml0KGJpdHMsIGkpKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSA4OyBpIDwgMTU7IGkrKylcbiAgICAgICAgICAgICAgICB0aGlzLnNldEZ1bmN0aW9uTW9kdWxlKDgsIHRoaXMuc2l6ZSAtIDE1ICsgaSwgZ2V0Qml0KGJpdHMsIGkpKTtcbiAgICAgICAgICAgIHRoaXMuc2V0RnVuY3Rpb25Nb2R1bGUoOCwgdGhpcy5zaXplIC0gOCwgdHJ1ZSk7IC8vIEFsd2F5cyBkYXJrXG4gICAgICAgIH1cbiAgICAgICAgLy8gRHJhd3MgdHdvIGNvcGllcyBvZiB0aGUgdmVyc2lvbiBiaXRzICh3aXRoIGl0cyBvd24gZXJyb3IgY29ycmVjdGlvbiBjb2RlKSxcbiAgICAgICAgLy8gYmFzZWQgb24gdGhpcyBvYmplY3QncyB2ZXJzaW9uIGZpZWxkLCBpZmYgNyA8PSB2ZXJzaW9uIDw9IDQwLlxuICAgICAgICBkcmF3VmVyc2lvbigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnZlcnNpb24gPCA3KVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIC8vIENhbGN1bGF0ZSBlcnJvciBjb3JyZWN0aW9uIGNvZGUgYW5kIHBhY2sgYml0c1xuICAgICAgICAgICAgbGV0IHJlbSA9IHRoaXMudmVyc2lvbjsgLy8gdmVyc2lvbiBpcyB1aW50NiwgaW4gdGhlIHJhbmdlIFs3LCA0MF1cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTI7IGkrKylcbiAgICAgICAgICAgICAgICByZW0gPSAocmVtIDw8IDEpIF4gKChyZW0gPj4+IDExKSAqIDB4MUYyNSk7XG4gICAgICAgICAgICBjb25zdCBiaXRzID0gdGhpcy52ZXJzaW9uIDw8IDEyIHwgcmVtOyAvLyB1aW50MThcbiAgICAgICAgICAgIGlmIChiaXRzID4+PiAxOCAhPSAwKVxuICAgICAgICAgICAgICAgIHRocm93IFwiQXNzZXJ0aW9uIGVycm9yXCI7XG4gICAgICAgICAgICAvLyBEcmF3IHR3byBjb3BpZXNcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gZ2V0Qml0KGJpdHMsIGkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSB0aGlzLnNpemUgLSAxMSArIGkgJSAzO1xuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSBNYXRoLmZsb29yKGkgLyAzKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEZ1bmN0aW9uTW9kdWxlKGEsIGIsIGNvbG9yKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEZ1bmN0aW9uTW9kdWxlKGIsIGEsIGNvbG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBEcmF3cyBhIDkqOSBmaW5kZXIgcGF0dGVybiBpbmNsdWRpbmcgdGhlIGJvcmRlciBzZXBhcmF0b3IsXG4gICAgICAgIC8vIHdpdGggdGhlIGNlbnRlciBtb2R1bGUgYXQgKHgsIHkpLiBNb2R1bGVzIGNhbiBiZSBvdXQgb2YgYm91bmRzLlxuICAgICAgICBkcmF3RmluZGVyUGF0dGVybih4LCB5KSB7XG4gICAgICAgICAgICBmb3IgKGxldCBkeSA9IC00OyBkeSA8PSA0OyBkeSsrKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZHggPSAtNDsgZHggPD0gNDsgZHgrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0ID0gTWF0aC5tYXgoTWF0aC5hYnMoZHgpLCBNYXRoLmFicyhkeSkpOyAvLyBDaGVieXNoZXYvaW5maW5pdHkgbm9ybVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4eCA9IHggKyBkeDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeXkgPSB5ICsgZHk7XG4gICAgICAgICAgICAgICAgICAgIGlmICgwIDw9IHh4ICYmIHh4IDwgdGhpcy5zaXplICYmIDAgPD0geXkgJiYgeXkgPCB0aGlzLnNpemUpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEZ1bmN0aW9uTW9kdWxlKHh4LCB5eSwgZGlzdCAhPSAyICYmIGRpc3QgIT0gNCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIERyYXdzIGEgNSo1IGFsaWdubWVudCBwYXR0ZXJuLCB3aXRoIHRoZSBjZW50ZXIgbW9kdWxlXG4gICAgICAgIC8vIGF0ICh4LCB5KS4gQWxsIG1vZHVsZXMgbXVzdCBiZSBpbiBib3VuZHMuXG4gICAgICAgIGRyYXdBbGlnbm1lbnRQYXR0ZXJuKHgsIHkpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGR5ID0gLTI7IGR5IDw9IDI7IGR5KyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBkeCA9IC0yOyBkeCA8PSAyOyBkeCsrKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEZ1bmN0aW9uTW9kdWxlKHggKyBkeCwgeSArIGR5LCBNYXRoLm1heChNYXRoLmFicyhkeCksIE1hdGguYWJzKGR5KSkgIT0gMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gU2V0cyB0aGUgY29sb3Igb2YgYSBtb2R1bGUgYW5kIG1hcmtzIGl0IGFzIGEgZnVuY3Rpb24gbW9kdWxlLlxuICAgICAgICAvLyBPbmx5IHVzZWQgYnkgdGhlIGNvbnN0cnVjdG9yLiBDb29yZGluYXRlcyBtdXN0IGJlIGluIGJvdW5kcy5cbiAgICAgICAgc2V0RnVuY3Rpb25Nb2R1bGUoeCwgeSwgaXNEYXJrKSB7XG4gICAgICAgICAgICB0aGlzLm1vZHVsZXNbeV1beF0gPSBpc0Rhcms7XG4gICAgICAgICAgICB0aGlzLmlzRnVuY3Rpb25beV1beF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIC8qLS0gUHJpdmF0ZSBoZWxwZXIgbWV0aG9kcyBmb3IgY29uc3RydWN0b3I6IENvZGV3b3JkcyBhbmQgbWFza2luZyAtLSovXG4gICAgICAgIC8vIFJldHVybnMgYSBuZXcgYnl0ZSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBnaXZlbiBkYXRhIHdpdGggdGhlIGFwcHJvcHJpYXRlIGVycm9yIGNvcnJlY3Rpb25cbiAgICAgICAgLy8gY29kZXdvcmRzIGFwcGVuZGVkIHRvIGl0LCBiYXNlZCBvbiB0aGlzIG9iamVjdCdzIHZlcnNpb24gYW5kIGVycm9yIGNvcnJlY3Rpb24gbGV2ZWwuXG4gICAgICAgIGFkZEVjY0FuZEludGVybGVhdmUoZGF0YSkge1xuICAgICAgICAgICAgY29uc3QgdmVyID0gdGhpcy52ZXJzaW9uO1xuICAgICAgICAgICAgY29uc3QgZWNsID0gdGhpcy5lcnJvckNvcnJlY3Rpb25MZXZlbDtcbiAgICAgICAgICAgIGlmIChkYXRhLmxlbmd0aCAhPSBRckNvZGUuZ2V0TnVtRGF0YUNvZGV3b3Jkcyh2ZXIsIGVjbCkpXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJJbnZhbGlkIGFyZ3VtZW50XCI7XG4gICAgICAgICAgICAvLyBDYWxjdWxhdGUgcGFyYW1ldGVyIG51bWJlcnNcbiAgICAgICAgICAgIGNvbnN0IG51bUJsb2NrcyA9IFFyQ29kZS5OVU1fRVJST1JfQ09SUkVDVElPTl9CTE9DS1NbZWNsLm9yZGluYWxdW3Zlcl07XG4gICAgICAgICAgICBjb25zdCBibG9ja0VjY0xlbiA9IFFyQ29kZS5FQ0NfQ09ERVdPUkRTX1BFUl9CTE9DS1tlY2wub3JkaW5hbF1bdmVyXTtcbiAgICAgICAgICAgIGNvbnN0IHJhd0NvZGV3b3JkcyA9IE1hdGguZmxvb3IoUXJDb2RlLmdldE51bVJhd0RhdGFNb2R1bGVzKHZlcikgLyA4KTtcbiAgICAgICAgICAgIGNvbnN0IG51bVNob3J0QmxvY2tzID0gbnVtQmxvY2tzIC0gcmF3Q29kZXdvcmRzICUgbnVtQmxvY2tzO1xuICAgICAgICAgICAgY29uc3Qgc2hvcnRCbG9ja0xlbiA9IE1hdGguZmxvb3IocmF3Q29kZXdvcmRzIC8gbnVtQmxvY2tzKTtcbiAgICAgICAgICAgIC8vIFNwbGl0IGRhdGEgaW50byBibG9ja3MgYW5kIGFwcGVuZCBFQ0MgdG8gZWFjaCBibG9ja1xuICAgICAgICAgICAgbGV0IGJsb2NrcyA9IFtdO1xuICAgICAgICAgICAgY29uc3QgcnNEaXYgPSBRckNvZGUucmVlZFNvbG9tb25Db21wdXRlRGl2aXNvcihibG9ja0VjY0xlbik7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgayA9IDA7IGkgPCBudW1CbG9ja3M7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBkYXQgPSBkYXRhLnNsaWNlKGssIGsgKyBzaG9ydEJsb2NrTGVuIC0gYmxvY2tFY2NMZW4gKyAoaSA8IG51bVNob3J0QmxvY2tzID8gMCA6IDEpKTtcbiAgICAgICAgICAgICAgICBrICs9IGRhdC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgY29uc3QgZWNjID0gUXJDb2RlLnJlZWRTb2xvbW9uQ29tcHV0ZVJlbWFpbmRlcihkYXQsIHJzRGl2KTtcbiAgICAgICAgICAgICAgICBpZiAoaSA8IG51bVNob3J0QmxvY2tzKVxuICAgICAgICAgICAgICAgICAgICBkYXQucHVzaCgwKTtcbiAgICAgICAgICAgICAgICBibG9ja3MucHVzaChkYXQuY29uY2F0KGVjYykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSW50ZXJsZWF2ZSAobm90IGNvbmNhdGVuYXRlKSB0aGUgYnl0ZXMgZnJvbSBldmVyeSBibG9jayBpbnRvIGEgc2luZ2xlIHNlcXVlbmNlXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2Nrc1swXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGJsb2Nrcy5mb3JFYWNoKChibG9jaywgaikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBTa2lwIHRoZSBwYWRkaW5nIGJ5dGUgaW4gc2hvcnQgYmxvY2tzXG4gICAgICAgICAgICAgICAgICAgIGlmIChpICE9IHNob3J0QmxvY2tMZW4gLSBibG9ja0VjY0xlbiB8fCBqID49IG51bVNob3J0QmxvY2tzKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goYmxvY2tbaV0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggIT0gcmF3Q29kZXdvcmRzKVxuICAgICAgICAgICAgICAgIHRocm93IFwiQXNzZXJ0aW9uIGVycm9yXCI7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIC8vIERyYXdzIHRoZSBnaXZlbiBzZXF1ZW5jZSBvZiA4LWJpdCBjb2Rld29yZHMgKGRhdGEgYW5kIGVycm9yIGNvcnJlY3Rpb24pIG9udG8gdGhlIGVudGlyZVxuICAgICAgICAvLyBkYXRhIGFyZWEgb2YgdGhpcyBRUiBDb2RlLiBGdW5jdGlvbiBtb2R1bGVzIG5lZWQgdG8gYmUgbWFya2VkIG9mZiBiZWZvcmUgdGhpcyBpcyBjYWxsZWQuXG4gICAgICAgIGRyYXdDb2Rld29yZHMoZGF0YSkge1xuICAgICAgICAgICAgaWYgKGRhdGEubGVuZ3RoICE9IE1hdGguZmxvb3IoUXJDb2RlLmdldE51bVJhd0RhdGFNb2R1bGVzKHRoaXMudmVyc2lvbikgLyA4KSlcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkludmFsaWQgYXJndW1lbnRcIjtcbiAgICAgICAgICAgIGxldCBpID0gMDsgLy8gQml0IGluZGV4IGludG8gdGhlIGRhdGFcbiAgICAgICAgICAgIC8vIERvIHRoZSBmdW5ueSB6aWd6YWcgc2NhblxuICAgICAgICAgICAgZm9yIChsZXQgcmlnaHQgPSB0aGlzLnNpemUgLSAxOyByaWdodCA+PSAxOyByaWdodCAtPSAyKSB7IC8vIEluZGV4IG9mIHJpZ2h0IGNvbHVtbiBpbiBlYWNoIGNvbHVtbiBwYWlyXG4gICAgICAgICAgICAgICAgaWYgKHJpZ2h0ID09IDYpXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0ID0gNTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB2ZXJ0ID0gMDsgdmVydCA8IHRoaXMuc2l6ZTsgdmVydCsrKSB7IC8vIFZlcnRpY2FsIGNvdW50ZXJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAyOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSByaWdodCAtIGo7IC8vIEFjdHVhbCB4IGNvb3JkaW5hdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVwd2FyZCA9ICgocmlnaHQgKyAxKSAmIDIpID09IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB5ID0gdXB3YXJkID8gdGhpcy5zaXplIC0gMSAtIHZlcnQgOiB2ZXJ0OyAvLyBBY3R1YWwgeSBjb29yZGluYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNGdW5jdGlvblt5XVt4XSAmJiBpIDwgZGF0YS5sZW5ndGggKiA4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2R1bGVzW3ldW3hdID0gZ2V0Qml0KGRhdGFbaSA+Pj4gM10sIDcgLSAoaSAmIDcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGlzIFFSIENvZGUgaGFzIGFueSByZW1haW5kZXIgYml0cyAoMCB0byA3KSwgdGhleSB3ZXJlIGFzc2lnbmVkIGFzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAwL2ZhbHNlL2xpZ2h0IGJ5IHRoZSBjb25zdHJ1Y3RvciBhbmQgYXJlIGxlZnQgdW5jaGFuZ2VkIGJ5IHRoaXMgbWV0aG9kXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaSAhPSBkYXRhLmxlbmd0aCAqIDgpXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJBc3NlcnRpb24gZXJyb3JcIjtcbiAgICAgICAgfVxuICAgICAgICAvLyBYT1JzIHRoZSBjb2Rld29yZCBtb2R1bGVzIGluIHRoaXMgUVIgQ29kZSB3aXRoIHRoZSBnaXZlbiBtYXNrIHBhdHRlcm4uXG4gICAgICAgIC8vIFRoZSBmdW5jdGlvbiBtb2R1bGVzIG11c3QgYmUgbWFya2VkIGFuZCB0aGUgY29kZXdvcmQgYml0cyBtdXN0IGJlIGRyYXduXG4gICAgICAgIC8vIGJlZm9yZSBtYXNraW5nLiBEdWUgdG8gdGhlIGFyaXRobWV0aWMgb2YgWE9SLCBjYWxsaW5nIGFwcGx5TWFzaygpIHdpdGhcbiAgICAgICAgLy8gdGhlIHNhbWUgbWFzayB2YWx1ZSBhIHNlY29uZCB0aW1lIHdpbGwgdW5kbyB0aGUgbWFzay4gQSBmaW5hbCB3ZWxsLWZvcm1lZFxuICAgICAgICAvLyBRUiBDb2RlIG5lZWRzIGV4YWN0bHkgb25lIChub3QgemVybywgdHdvLCBldGMuKSBtYXNrIGFwcGxpZWQuXG4gICAgICAgIGFwcGx5TWFzayhtYXNrKSB7XG4gICAgICAgICAgICBpZiAobWFzayA8IDAgfHwgbWFzayA+IDcpXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJNYXNrIHZhbHVlIG91dCBvZiByYW5nZVwiO1xuICAgICAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLnNpemU7IHkrKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5zaXplOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGludmVydDtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChtYXNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJ0ID0gKHggKyB5KSAlIDIgPT0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnQgPSB5ICUgMiA9PSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludmVydCA9IHggJSAzID09IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJ0ID0gKHggKyB5KSAlIDMgPT0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnQgPSAoTWF0aC5mbG9vcih4IC8gMykgKyBNYXRoLmZsb29yKHkgLyAyKSkgJSAyID09IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJ0ID0geCAqIHkgJSAyICsgeCAqIHkgJSAzID09IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJ0ID0gKHggKiB5ICUgMiArIHggKiB5ICUgMykgJSAyID09IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJ0ID0gKCh4ICsgeSkgJSAyICsgeCAqIHkgJSAzKSAlIDIgPT0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IFwiQXNzZXJ0aW9uIGVycm9yXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzRnVuY3Rpb25beV1beF0gJiYgaW52ZXJ0KVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2R1bGVzW3ldW3hdID0gIXRoaXMubW9kdWxlc1t5XVt4XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2FsY3VsYXRlcyBhbmQgcmV0dXJucyB0aGUgcGVuYWx0eSBzY29yZSBiYXNlZCBvbiBzdGF0ZSBvZiB0aGlzIFFSIENvZGUncyBjdXJyZW50IG1vZHVsZXMuXG4gICAgICAgIC8vIFRoaXMgaXMgdXNlZCBieSB0aGUgYXV0b21hdGljIG1hc2sgY2hvaWNlIGFsZ29yaXRobSB0byBmaW5kIHRoZSBtYXNrIHBhdHRlcm4gdGhhdCB5aWVsZHMgdGhlIGxvd2VzdCBzY29yZS5cbiAgICAgICAgZ2V0UGVuYWx0eVNjb3JlKCkge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IDA7XG4gICAgICAgICAgICAvLyBBZGphY2VudCBtb2R1bGVzIGluIHJvdyBoYXZpbmcgc2FtZSBjb2xvciwgYW5kIGZpbmRlci1saWtlIHBhdHRlcm5zXG4gICAgICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuc2l6ZTsgeSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJ1bkNvbG9yID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgbGV0IHJ1blggPSAwO1xuICAgICAgICAgICAgICAgIGxldCBydW5IaXN0b3J5ID0gWzAsIDAsIDAsIDAsIDAsIDAsIDBdO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5zaXplOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubW9kdWxlc1t5XVt4XSA9PSBydW5Db2xvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcnVuWCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJ1blggPT0gNSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gUXJDb2RlLlBFTkFMVFlfTjE7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChydW5YID4gNSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmluZGVyUGVuYWx0eUFkZEhpc3RvcnkocnVuWCwgcnVuSGlzdG9yeSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJ1bkNvbG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSB0aGlzLmZpbmRlclBlbmFsdHlDb3VudFBhdHRlcm5zKHJ1bkhpc3RvcnkpICogUXJDb2RlLlBFTkFMVFlfTjM7XG4gICAgICAgICAgICAgICAgICAgICAgICBydW5Db2xvciA9IHRoaXMubW9kdWxlc1t5XVt4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1blggPSAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSB0aGlzLmZpbmRlclBlbmFsdHlUZXJtaW5hdGVBbmRDb3VudChydW5Db2xvciwgcnVuWCwgcnVuSGlzdG9yeSkgKiBRckNvZGUuUEVOQUxUWV9OMztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEFkamFjZW50IG1vZHVsZXMgaW4gY29sdW1uIGhhdmluZyBzYW1lIGNvbG9yLCBhbmQgZmluZGVyLWxpa2UgcGF0dGVybnNcbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5zaXplOyB4KyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcnVuQ29sb3IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBsZXQgcnVuWSA9IDA7XG4gICAgICAgICAgICAgICAgbGV0IHJ1bkhpc3RvcnkgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMF07XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLnNpemU7IHkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tb2R1bGVzW3ldW3hdID09IHJ1bkNvbG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBydW5ZKys7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocnVuWSA9PSA1KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBRckNvZGUuUEVOQUxUWV9OMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHJ1blkgPiA1KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5kZXJQZW5hbHR5QWRkSGlzdG9yeShydW5ZLCBydW5IaXN0b3J5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcnVuQ29sb3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IHRoaXMuZmluZGVyUGVuYWx0eUNvdW50UGF0dGVybnMocnVuSGlzdG9yeSkgKiBRckNvZGUuUEVOQUxUWV9OMztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bkNvbG9yID0gdGhpcy5tb2R1bGVzW3ldW3hdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcnVuWSA9IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IHRoaXMuZmluZGVyUGVuYWx0eVRlcm1pbmF0ZUFuZENvdW50KHJ1bkNvbG9yLCBydW5ZLCBydW5IaXN0b3J5KSAqIFFyQ29kZS5QRU5BTFRZX04zO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gMioyIGJsb2NrcyBvZiBtb2R1bGVzIGhhdmluZyBzYW1lIGNvbG9yXG4gICAgICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuc2l6ZSAtIDE7IHkrKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5zaXplIC0gMTsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gdGhpcy5tb2R1bGVzW3ldW3hdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29sb3IgPT0gdGhpcy5tb2R1bGVzW3ldW3ggKyAxXSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPT0gdGhpcy5tb2R1bGVzW3kgKyAxXVt4XSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPT0gdGhpcy5tb2R1bGVzW3kgKyAxXVt4ICsgMV0pXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gUXJDb2RlLlBFTkFMVFlfTjI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQmFsYW5jZSBvZiBkYXJrIGFuZCBsaWdodCBtb2R1bGVzXG4gICAgICAgICAgICBsZXQgZGFyayA9IDA7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiB0aGlzLm1vZHVsZXMpXG4gICAgICAgICAgICAgICAgZGFyayA9IHJvdy5yZWR1Y2UoKHN1bSwgY29sb3IpID0+IHN1bSArIChjb2xvciA/IDEgOiAwKSwgZGFyayk7XG4gICAgICAgICAgICBjb25zdCB0b3RhbCA9IHRoaXMuc2l6ZSAqIHRoaXMuc2l6ZTsgLy8gTm90ZSB0aGF0IHNpemUgaXMgb2RkLCBzbyBkYXJrL3RvdGFsICE9IDEvMlxuICAgICAgICAgICAgLy8gQ29tcHV0ZSB0aGUgc21hbGxlc3QgaW50ZWdlciBrID49IDAgc3VjaCB0aGF0ICg0NS01ayklIDw9IGRhcmsvdG90YWwgPD0gKDU1KzVrKSVcbiAgICAgICAgICAgIGNvbnN0IGsgPSBNYXRoLmNlaWwoTWF0aC5hYnMoZGFyayAqIDIwIC0gdG90YWwgKiAxMCkgLyB0b3RhbCkgLSAxO1xuICAgICAgICAgICAgcmVzdWx0ICs9IGsgKiBRckNvZGUuUEVOQUxUWV9ONDtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgLyotLSBQcml2YXRlIGhlbHBlciBmdW5jdGlvbnMgLS0qL1xuICAgICAgICAvLyBSZXR1cm5zIGFuIGFzY2VuZGluZyBsaXN0IG9mIHBvc2l0aW9ucyBvZiBhbGlnbm1lbnQgcGF0dGVybnMgZm9yIHRoaXMgdmVyc2lvbiBudW1iZXIuXG4gICAgICAgIC8vIEVhY2ggcG9zaXRpb24gaXMgaW4gdGhlIHJhbmdlIFswLDE3NyksIGFuZCBhcmUgdXNlZCBvbiBib3RoIHRoZSB4IGFuZCB5IGF4ZXMuXG4gICAgICAgIC8vIFRoaXMgY291bGQgYmUgaW1wbGVtZW50ZWQgYXMgbG9va3VwIHRhYmxlIG9mIDQwIHZhcmlhYmxlLWxlbmd0aCBsaXN0cyBvZiBpbnRlZ2Vycy5cbiAgICAgICAgZ2V0QWxpZ25tZW50UGF0dGVyblBvc2l0aW9ucygpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnZlcnNpb24gPT0gMSlcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBudW1BbGlnbiA9IE1hdGguZmxvb3IodGhpcy52ZXJzaW9uIC8gNykgKyAyO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0ZXAgPSAodGhpcy52ZXJzaW9uID09IDMyKSA/IDI2IDpcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5jZWlsKCh0aGlzLnZlcnNpb24gKiA0ICsgNCkgLyAobnVtQWxpZ24gKiAyIC0gMikpICogMjtcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gWzZdO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHBvcyA9IHRoaXMuc2l6ZSAtIDc7IHJlc3VsdC5sZW5ndGggPCBudW1BbGlnbjsgcG9zIC09IHN0ZXApXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5zcGxpY2UoMSwgMCwgcG9zKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFJldHVybnMgdGhlIG51bWJlciBvZiBkYXRhIGJpdHMgdGhhdCBjYW4gYmUgc3RvcmVkIGluIGEgUVIgQ29kZSBvZiB0aGUgZ2l2ZW4gdmVyc2lvbiBudW1iZXIsIGFmdGVyXG4gICAgICAgIC8vIGFsbCBmdW5jdGlvbiBtb2R1bGVzIGFyZSBleGNsdWRlZC4gVGhpcyBpbmNsdWRlcyByZW1haW5kZXIgYml0cywgc28gaXQgbWlnaHQgbm90IGJlIGEgbXVsdGlwbGUgb2YgOC5cbiAgICAgICAgLy8gVGhlIHJlc3VsdCBpcyBpbiB0aGUgcmFuZ2UgWzIwOCwgMjk2NDhdLiBUaGlzIGNvdWxkIGJlIGltcGxlbWVudGVkIGFzIGEgNDAtZW50cnkgbG9va3VwIHRhYmxlLlxuICAgICAgICBzdGF0aWMgZ2V0TnVtUmF3RGF0YU1vZHVsZXModmVyKSB7XG4gICAgICAgICAgICBpZiAodmVyIDwgUXJDb2RlLk1JTl9WRVJTSU9OIHx8IHZlciA+IFFyQ29kZS5NQVhfVkVSU0lPTilcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlZlcnNpb24gbnVtYmVyIG91dCBvZiByYW5nZVwiO1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9ICgxNiAqIHZlciArIDEyOCkgKiB2ZXIgKyA2NDtcbiAgICAgICAgICAgIGlmICh2ZXIgPj0gMikge1xuICAgICAgICAgICAgICAgIGNvbnN0IG51bUFsaWduID0gTWF0aC5mbG9vcih2ZXIgLyA3KSArIDI7XG4gICAgICAgICAgICAgICAgcmVzdWx0IC09ICgyNSAqIG51bUFsaWduIC0gMTApICogbnVtQWxpZ24gLSA1NTtcbiAgICAgICAgICAgICAgICBpZiAodmVyID49IDcpXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCAtPSAzNjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghKDIwOCA8PSByZXN1bHQgJiYgcmVzdWx0IDw9IDI5NjQ4KSlcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkFzc2VydGlvbiBlcnJvclwiO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZXR1cm5zIHRoZSBudW1iZXIgb2YgOC1iaXQgZGF0YSAoaS5lLiBub3QgZXJyb3IgY29ycmVjdGlvbikgY29kZXdvcmRzIGNvbnRhaW5lZCBpbiBhbnlcbiAgICAgICAgLy8gUVIgQ29kZSBvZiB0aGUgZ2l2ZW4gdmVyc2lvbiBudW1iZXIgYW5kIGVycm9yIGNvcnJlY3Rpb24gbGV2ZWwsIHdpdGggcmVtYWluZGVyIGJpdHMgZGlzY2FyZGVkLlxuICAgICAgICAvLyBUaGlzIHN0YXRlbGVzcyBwdXJlIGZ1bmN0aW9uIGNvdWxkIGJlIGltcGxlbWVudGVkIGFzIGEgKDQwKjQpLWNlbGwgbG9va3VwIHRhYmxlLlxuICAgICAgICBzdGF0aWMgZ2V0TnVtRGF0YUNvZGV3b3Jkcyh2ZXIsIGVjbCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoUXJDb2RlLmdldE51bVJhd0RhdGFNb2R1bGVzKHZlcikgLyA4KSAtXG4gICAgICAgICAgICAgICAgUXJDb2RlLkVDQ19DT0RFV09SRFNfUEVSX0JMT0NLW2VjbC5vcmRpbmFsXVt2ZXJdICpcbiAgICAgICAgICAgICAgICAgICAgUXJDb2RlLk5VTV9FUlJPUl9DT1JSRUNUSU9OX0JMT0NLU1tlY2wub3JkaW5hbF1bdmVyXTtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZXR1cm5zIGEgUmVlZC1Tb2xvbW9uIEVDQyBnZW5lcmF0b3IgcG9seW5vbWlhbCBmb3IgdGhlIGdpdmVuIGRlZ3JlZS4gVGhpcyBjb3VsZCBiZVxuICAgICAgICAvLyBpbXBsZW1lbnRlZCBhcyBhIGxvb2t1cCB0YWJsZSBvdmVyIGFsbCBwb3NzaWJsZSBwYXJhbWV0ZXIgdmFsdWVzLCBpbnN0ZWFkIG9mIGFzIGFuIGFsZ29yaXRobS5cbiAgICAgICAgc3RhdGljIHJlZWRTb2xvbW9uQ29tcHV0ZURpdmlzb3IoZGVncmVlKSB7XG4gICAgICAgICAgICBpZiAoZGVncmVlIDwgMSB8fCBkZWdyZWUgPiAyNTUpXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJEZWdyZWUgb3V0IG9mIHJhbmdlXCI7XG4gICAgICAgICAgICAvLyBQb2x5bm9taWFsIGNvZWZmaWNpZW50cyBhcmUgc3RvcmVkIGZyb20gaGlnaGVzdCB0byBsb3dlc3QgcG93ZXIsIGV4Y2x1ZGluZyB0aGUgbGVhZGluZyB0ZXJtIHdoaWNoIGlzIGFsd2F5cyAxLlxuICAgICAgICAgICAgLy8gRm9yIGV4YW1wbGUgdGhlIHBvbHlub21pYWwgeF4zICsgMjU1eF4yICsgOHggKyA5MyBpcyBzdG9yZWQgYXMgdGhlIHVpbnQ4IGFycmF5IFsyNTUsIDgsIDkzXS5cbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGVncmVlIC0gMTsgaSsrKVxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKDApO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goMSk7IC8vIFN0YXJ0IG9mZiB3aXRoIHRoZSBtb25vbWlhbCB4XjBcbiAgICAgICAgICAgIC8vIENvbXB1dGUgdGhlIHByb2R1Y3QgcG9seW5vbWlhbCAoeCAtIHJeMCkgKiAoeCAtIHJeMSkgKiAoeCAtIHJeMikgKiAuLi4gKiAoeCAtIHJee2RlZ3JlZS0xfSksXG4gICAgICAgICAgICAvLyBhbmQgZHJvcCB0aGUgaGlnaGVzdCBtb25vbWlhbCB0ZXJtIHdoaWNoIGlzIGFsd2F5cyAxeF5kZWdyZWUuXG4gICAgICAgICAgICAvLyBOb3RlIHRoYXQgciA9IDB4MDIsIHdoaWNoIGlzIGEgZ2VuZXJhdG9yIGVsZW1lbnQgb2YgdGhpcyBmaWVsZCBHRigyXjgvMHgxMUQpLlxuICAgICAgICAgICAgbGV0IHJvb3QgPSAxO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZWdyZWU7IGkrKykge1xuICAgICAgICAgICAgICAgIC8vIE11bHRpcGx5IHRoZSBjdXJyZW50IHByb2R1Y3QgYnkgKHggLSByXmkpXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCByZXN1bHQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2pdID0gUXJDb2RlLnJlZWRTb2xvbW9uTXVsdGlwbHkocmVzdWx0W2pdLCByb290KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGogKyAxIDwgcmVzdWx0Lmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtqXSBePSByZXN1bHRbaiArIDFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByb290ID0gUXJDb2RlLnJlZWRTb2xvbW9uTXVsdGlwbHkocm9vdCwgMHgwMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIC8vIFJldHVybnMgdGhlIFJlZWQtU29sb21vbiBlcnJvciBjb3JyZWN0aW9uIGNvZGV3b3JkIGZvciB0aGUgZ2l2ZW4gZGF0YSBhbmQgZGl2aXNvciBwb2x5bm9taWFscy5cbiAgICAgICAgc3RhdGljIHJlZWRTb2xvbW9uQ29tcHV0ZVJlbWFpbmRlcihkYXRhLCBkaXZpc29yKSB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gZGl2aXNvci5tYXAoXyA9PiAwKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYiBvZiBkYXRhKSB7IC8vIFBvbHlub21pYWwgZGl2aXNpb25cbiAgICAgICAgICAgICAgICBjb25zdCBmYWN0b3IgPSBiIF4gcmVzdWx0LnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goMCk7XG4gICAgICAgICAgICAgICAgZGl2aXNvci5mb3JFYWNoKChjb2VmLCBpKSA9PiByZXN1bHRbaV0gXj0gUXJDb2RlLnJlZWRTb2xvbW9uTXVsdGlwbHkoY29lZiwgZmFjdG9yKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIC8vIFJldHVybnMgdGhlIHByb2R1Y3Qgb2YgdGhlIHR3byBnaXZlbiBmaWVsZCBlbGVtZW50cyBtb2R1bG8gR0YoMl44LzB4MTFEKS4gVGhlIGFyZ3VtZW50cyBhbmQgcmVzdWx0XG4gICAgICAgIC8vIGFyZSB1bnNpZ25lZCA4LWJpdCBpbnRlZ2Vycy4gVGhpcyBjb3VsZCBiZSBpbXBsZW1lbnRlZCBhcyBhIGxvb2t1cCB0YWJsZSBvZiAyNTYqMjU2IGVudHJpZXMgb2YgdWludDguXG4gICAgICAgIHN0YXRpYyByZWVkU29sb21vbk11bHRpcGx5KHgsIHkpIHtcbiAgICAgICAgICAgIGlmICh4ID4+PiA4ICE9IDAgfHwgeSA+Pj4gOCAhPSAwKVxuICAgICAgICAgICAgICAgIHRocm93IFwiQnl0ZSBvdXQgb2YgcmFuZ2VcIjtcbiAgICAgICAgICAgIC8vIFJ1c3NpYW4gcGVhc2FudCBtdWx0aXBsaWNhdGlvblxuICAgICAgICAgICAgbGV0IHogPSAwO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDc7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgeiA9ICh6IDw8IDEpIF4gKCh6ID4+PiA3KSAqIDB4MTFEKTtcbiAgICAgICAgICAgICAgICB6IF49ICgoeSA+Pj4gaSkgJiAxKSAqIHg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoeiA+Pj4gOCAhPSAwKVxuICAgICAgICAgICAgICAgIHRocm93IFwiQXNzZXJ0aW9uIGVycm9yXCI7XG4gICAgICAgICAgICByZXR1cm4gejtcbiAgICAgICAgfVxuICAgICAgICAvLyBDYW4gb25seSBiZSBjYWxsZWQgaW1tZWRpYXRlbHkgYWZ0ZXIgYSBsaWdodCBydW4gaXMgYWRkZWQsIGFuZFxuICAgICAgICAvLyByZXR1cm5zIGVpdGhlciAwLCAxLCBvciAyLiBBIGhlbHBlciBmdW5jdGlvbiBmb3IgZ2V0UGVuYWx0eVNjb3JlKCkuXG4gICAgICAgIGZpbmRlclBlbmFsdHlDb3VudFBhdHRlcm5zKHJ1bkhpc3RvcnkpIHtcbiAgICAgICAgICAgIGNvbnN0IG4gPSBydW5IaXN0b3J5WzFdO1xuICAgICAgICAgICAgaWYgKG4gPiB0aGlzLnNpemUgKiAzKVxuICAgICAgICAgICAgICAgIHRocm93IFwiQXNzZXJ0aW9uIGVycm9yXCI7XG4gICAgICAgICAgICBjb25zdCBjb3JlID0gbiA+IDAgJiYgcnVuSGlzdG9yeVsyXSA9PSBuICYmIHJ1bkhpc3RvcnlbM10gPT0gbiAqIDMgJiYgcnVuSGlzdG9yeVs0XSA9PSBuICYmIHJ1bkhpc3RvcnlbNV0gPT0gbjtcbiAgICAgICAgICAgIHJldHVybiAoY29yZSAmJiBydW5IaXN0b3J5WzBdID49IG4gKiA0ICYmIHJ1bkhpc3RvcnlbNl0gPj0gbiA/IDEgOiAwKVxuICAgICAgICAgICAgICAgICsgKGNvcmUgJiYgcnVuSGlzdG9yeVs2XSA+PSBuICogNCAmJiBydW5IaXN0b3J5WzBdID49IG4gPyAxIDogMCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTXVzdCBiZSBjYWxsZWQgYXQgdGhlIGVuZCBvZiBhIGxpbmUgKHJvdyBvciBjb2x1bW4pIG9mIG1vZHVsZXMuIEEgaGVscGVyIGZ1bmN0aW9uIGZvciBnZXRQZW5hbHR5U2NvcmUoKS5cbiAgICAgICAgZmluZGVyUGVuYWx0eVRlcm1pbmF0ZUFuZENvdW50KGN1cnJlbnRSdW5Db2xvciwgY3VycmVudFJ1bkxlbmd0aCwgcnVuSGlzdG9yeSkge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRSdW5Db2xvcikgeyAvLyBUZXJtaW5hdGUgZGFyayBydW5cbiAgICAgICAgICAgICAgICB0aGlzLmZpbmRlclBlbmFsdHlBZGRIaXN0b3J5KGN1cnJlbnRSdW5MZW5ndGgsIHJ1bkhpc3RvcnkpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRSdW5MZW5ndGggPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VycmVudFJ1bkxlbmd0aCArPSB0aGlzLnNpemU7IC8vIEFkZCBsaWdodCBib3JkZXIgdG8gZmluYWwgcnVuXG4gICAgICAgICAgICB0aGlzLmZpbmRlclBlbmFsdHlBZGRIaXN0b3J5KGN1cnJlbnRSdW5MZW5ndGgsIHJ1bkhpc3RvcnkpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmluZGVyUGVuYWx0eUNvdW50UGF0dGVybnMocnVuSGlzdG9yeSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUHVzaGVzIHRoZSBnaXZlbiB2YWx1ZSB0byB0aGUgZnJvbnQgYW5kIGRyb3BzIHRoZSBsYXN0IHZhbHVlLiBBIGhlbHBlciBmdW5jdGlvbiBmb3IgZ2V0UGVuYWx0eVNjb3JlKCkuXG4gICAgICAgIGZpbmRlclBlbmFsdHlBZGRIaXN0b3J5KGN1cnJlbnRSdW5MZW5ndGgsIHJ1bkhpc3RvcnkpIHtcbiAgICAgICAgICAgIGlmIChydW5IaXN0b3J5WzBdID09IDApXG4gICAgICAgICAgICAgICAgY3VycmVudFJ1bkxlbmd0aCArPSB0aGlzLnNpemU7IC8vIEFkZCBsaWdodCBib3JkZXIgdG8gaW5pdGlhbCBydW5cbiAgICAgICAgICAgIHJ1bkhpc3RvcnkucG9wKCk7XG4gICAgICAgICAgICBydW5IaXN0b3J5LnVuc2hpZnQoY3VycmVudFJ1bkxlbmd0aCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyotLSBDb25zdGFudHMgYW5kIHRhYmxlcyAtLSovXG4gICAgLy8gVGhlIG1pbmltdW0gdmVyc2lvbiBudW1iZXIgc3VwcG9ydGVkIGluIHRoZSBRUiBDb2RlIE1vZGVsIDIgc3RhbmRhcmQuXG4gICAgUXJDb2RlLk1JTl9WRVJTSU9OID0gMTtcbiAgICAvLyBUaGUgbWF4aW11bSB2ZXJzaW9uIG51bWJlciBzdXBwb3J0ZWQgaW4gdGhlIFFSIENvZGUgTW9kZWwgMiBzdGFuZGFyZC5cbiAgICBRckNvZGUuTUFYX1ZFUlNJT04gPSA0MDtcbiAgICAvLyBGb3IgdXNlIGluIGdldFBlbmFsdHlTY29yZSgpLCB3aGVuIGV2YWx1YXRpbmcgd2hpY2ggbWFzayBpcyBiZXN0LlxuICAgIFFyQ29kZS5QRU5BTFRZX04xID0gMztcbiAgICBRckNvZGUuUEVOQUxUWV9OMiA9IDM7XG4gICAgUXJDb2RlLlBFTkFMVFlfTjMgPSA0MDtcbiAgICBRckNvZGUuUEVOQUxUWV9ONCA9IDEwO1xuICAgIFFyQ29kZS5FQ0NfQ09ERVdPUkRTX1BFUl9CTE9DSyA9IFtcbiAgICAgICAgLy8gVmVyc2lvbjogKG5vdGUgdGhhdCBpbmRleCAwIGlzIGZvciBwYWRkaW5nLCBhbmQgaXMgc2V0IHRvIGFuIGlsbGVnYWwgdmFsdWUpXG4gICAgICAgIC8vMCwgIDEsICAyLCAgMywgIDQsICA1LCAgNiwgIDcsICA4LCAgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNSwgMTYsIDE3LCAxOCwgMTksIDIwLCAyMSwgMjIsIDIzLCAyNCwgMjUsIDI2LCAyNywgMjgsIDI5LCAzMCwgMzEsIDMyLCAzMywgMzQsIDM1LCAzNiwgMzcsIDM4LCAzOSwgNDAgICAgRXJyb3IgY29ycmVjdGlvbiBsZXZlbFxuICAgICAgICBbLTEsIDcsIDEwLCAxNSwgMjAsIDI2LCAxOCwgMjAsIDI0LCAzMCwgMTgsIDIwLCAyNCwgMjYsIDMwLCAyMiwgMjQsIDI4LCAzMCwgMjgsIDI4LCAyOCwgMjgsIDMwLCAzMCwgMjYsIDI4LCAzMCwgMzAsIDMwLCAzMCwgMzAsIDMwLCAzMCwgMzAsIDMwLCAzMCwgMzAsIDMwLCAzMCwgMzBdLFxuICAgICAgICBbLTEsIDEwLCAxNiwgMjYsIDE4LCAyNCwgMTYsIDE4LCAyMiwgMjIsIDI2LCAzMCwgMjIsIDIyLCAyNCwgMjQsIDI4LCAyOCwgMjYsIDI2LCAyNiwgMjYsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4XSxcbiAgICAgICAgWy0xLCAxMywgMjIsIDE4LCAyNiwgMTgsIDI0LCAxOCwgMjIsIDIwLCAyNCwgMjgsIDI2LCAyNCwgMjAsIDMwLCAyNCwgMjgsIDI4LCAyNiwgMzAsIDI4LCAzMCwgMzAsIDMwLCAzMCwgMjgsIDMwLCAzMCwgMzAsIDMwLCAzMCwgMzAsIDMwLCAzMCwgMzAsIDMwLCAzMCwgMzAsIDMwLCAzMF0sXG4gICAgICAgIFstMSwgMTcsIDI4LCAyMiwgMTYsIDIyLCAyOCwgMjYsIDI2LCAyNCwgMjgsIDI0LCAyOCwgMjIsIDI0LCAyNCwgMzAsIDI4LCAyOCwgMjYsIDI4LCAzMCwgMjQsIDMwLCAzMCwgMzAsIDMwLCAzMCwgMzAsIDMwLCAzMCwgMzAsIDMwLCAzMCwgMzAsIDMwLCAzMCwgMzAsIDMwLCAzMCwgMzBdLFxuICAgIF07XG4gICAgUXJDb2RlLk5VTV9FUlJPUl9DT1JSRUNUSU9OX0JMT0NLUyA9IFtcbiAgICAgICAgLy8gVmVyc2lvbjogKG5vdGUgdGhhdCBpbmRleCAwIGlzIGZvciBwYWRkaW5nLCBhbmQgaXMgc2V0IHRvIGFuIGlsbGVnYWwgdmFsdWUpXG4gICAgICAgIC8vMCwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwxMCwgMTEsIDEyLCAxMywgMTQsIDE1LCAxNiwgMTcsIDE4LCAxOSwgMjAsIDIxLCAyMiwgMjMsIDI0LCAyNSwgMjYsIDI3LCAyOCwgMjksIDMwLCAzMSwgMzIsIDMzLCAzNCwgMzUsIDM2LCAzNywgMzgsIDM5LCA0MCAgICBFcnJvciBjb3JyZWN0aW9uIGxldmVsXG4gICAgICAgIFstMSwgMSwgMSwgMSwgMSwgMSwgMiwgMiwgMiwgMiwgNCwgNCwgNCwgNCwgNCwgNiwgNiwgNiwgNiwgNywgOCwgOCwgOSwgOSwgMTAsIDEyLCAxMiwgMTIsIDEzLCAxNCwgMTUsIDE2LCAxNywgMTgsIDE5LCAxOSwgMjAsIDIxLCAyMiwgMjQsIDI1XSxcbiAgICAgICAgWy0xLCAxLCAxLCAxLCAyLCAyLCA0LCA0LCA0LCA1LCA1LCA1LCA4LCA5LCA5LCAxMCwgMTAsIDExLCAxMywgMTQsIDE2LCAxNywgMTcsIDE4LCAyMCwgMjEsIDIzLCAyNSwgMjYsIDI4LCAyOSwgMzEsIDMzLCAzNSwgMzcsIDM4LCA0MCwgNDMsIDQ1LCA0NywgNDldLFxuICAgICAgICBbLTEsIDEsIDEsIDIsIDIsIDQsIDQsIDYsIDYsIDgsIDgsIDgsIDEwLCAxMiwgMTYsIDEyLCAxNywgMTYsIDE4LCAyMSwgMjAsIDIzLCAyMywgMjUsIDI3LCAyOSwgMzQsIDM0LCAzNSwgMzgsIDQwLCA0MywgNDUsIDQ4LCA1MSwgNTMsIDU2LCA1OSwgNjIsIDY1LCA2OF0sXG4gICAgICAgIFstMSwgMSwgMSwgMiwgNCwgNCwgNCwgNSwgNiwgOCwgOCwgMTEsIDExLCAxNiwgMTYsIDE4LCAxNiwgMTksIDIxLCAyNSwgMjUsIDI1LCAzNCwgMzAsIDMyLCAzNSwgMzcsIDQwLCA0MiwgNDUsIDQ4LCA1MSwgNTQsIDU3LCA2MCwgNjMsIDY2LCA3MCwgNzQsIDc3LCA4MV0sXG4gICAgXTtcbiAgICBxcmNvZGVnZW4uUXJDb2RlID0gUXJDb2RlO1xuICAgIC8vIEFwcGVuZHMgdGhlIGdpdmVuIG51bWJlciBvZiBsb3ctb3JkZXIgYml0cyBvZiB0aGUgZ2l2ZW4gdmFsdWVcbiAgICAvLyB0byB0aGUgZ2l2ZW4gYnVmZmVyLiBSZXF1aXJlcyAwIDw9IGxlbiA8PSAzMSBhbmQgMCA8PSB2YWwgPCAyXmxlbi5cbiAgICBmdW5jdGlvbiBhcHBlbmRCaXRzKHZhbCwgbGVuLCBiYikge1xuICAgICAgICBpZiAobGVuIDwgMCB8fCBsZW4gPiAzMSB8fCB2YWwgPj4+IGxlbiAhPSAwKVxuICAgICAgICAgICAgdGhyb3cgXCJWYWx1ZSBvdXQgb2YgcmFuZ2VcIjtcbiAgICAgICAgZm9yIChsZXQgaSA9IGxlbiAtIDE7IGkgPj0gMDsgaS0tKSAvLyBBcHBlbmQgYml0IGJ5IGJpdFxuICAgICAgICAgICAgYmIucHVzaCgodmFsID4+PiBpKSAmIDEpO1xuICAgIH1cbiAgICAvLyBSZXR1cm5zIHRydWUgaWZmIHRoZSBpJ3RoIGJpdCBvZiB4IGlzIHNldCB0byAxLlxuICAgIGZ1bmN0aW9uIGdldEJpdCh4LCBpKSB7XG4gICAgICAgIHJldHVybiAoKHggPj4+IGkpICYgMSkgIT0gMDtcbiAgICB9XG4gICAgLyotLS0tIERhdGEgc2VnbWVudCBjbGFzcyAtLS0tKi9cbiAgICAvKlxuICAgICAqIEEgc2VnbWVudCBvZiBjaGFyYWN0ZXIvYmluYXJ5L2NvbnRyb2wgZGF0YSBpbiBhIFFSIENvZGUgc3ltYm9sLlxuICAgICAqIEluc3RhbmNlcyBvZiB0aGlzIGNsYXNzIGFyZSBpbW11dGFibGUuXG4gICAgICogVGhlIG1pZC1sZXZlbCB3YXkgdG8gY3JlYXRlIGEgc2VnbWVudCBpcyB0byB0YWtlIHRoZSBwYXlsb2FkIGRhdGFcbiAgICAgKiBhbmQgY2FsbCBhIHN0YXRpYyBmYWN0b3J5IGZ1bmN0aW9uIHN1Y2ggYXMgUXJTZWdtZW50Lm1ha2VOdW1lcmljKCkuXG4gICAgICogVGhlIGxvdy1sZXZlbCB3YXkgdG8gY3JlYXRlIGEgc2VnbWVudCBpcyB0byBjdXN0b20tbWFrZSB0aGUgYml0IGJ1ZmZlclxuICAgICAqIGFuZCBjYWxsIHRoZSBRclNlZ21lbnQoKSBjb25zdHJ1Y3RvciB3aXRoIGFwcHJvcHJpYXRlIHZhbHVlcy5cbiAgICAgKiBUaGlzIHNlZ21lbnQgY2xhc3MgaW1wb3NlcyBubyBsZW5ndGggcmVzdHJpY3Rpb25zLCBidXQgUVIgQ29kZXMgaGF2ZSByZXN0cmljdGlvbnMuXG4gICAgICogRXZlbiBpbiB0aGUgbW9zdCBmYXZvcmFibGUgY29uZGl0aW9ucywgYSBRUiBDb2RlIGNhbiBvbmx5IGhvbGQgNzA4OSBjaGFyYWN0ZXJzIG9mIGRhdGEuXG4gICAgICogQW55IHNlZ21lbnQgbG9uZ2VyIHRoYW4gdGhpcyBpcyBtZWFuaW5nbGVzcyBmb3IgdGhlIHB1cnBvc2Ugb2YgZ2VuZXJhdGluZyBRUiBDb2Rlcy5cbiAgICAgKi9cbiAgICBjbGFzcyBRclNlZ21lbnQge1xuICAgICAgICAvKi0tIENvbnN0cnVjdG9yIChsb3cgbGV2ZWwpIGFuZCBmaWVsZHMgLS0qL1xuICAgICAgICAvLyBDcmVhdGVzIGEgbmV3IFFSIENvZGUgc2VnbWVudCB3aXRoIHRoZSBnaXZlbiBhdHRyaWJ1dGVzIGFuZCBkYXRhLlxuICAgICAgICAvLyBUaGUgY2hhcmFjdGVyIGNvdW50IChudW1DaGFycykgbXVzdCBhZ3JlZSB3aXRoIHRoZSBtb2RlIGFuZCB0aGUgYml0IGJ1ZmZlciBsZW5ndGgsXG4gICAgICAgIC8vIGJ1dCB0aGUgY29uc3RyYWludCBpc24ndCBjaGVja2VkLiBUaGUgZ2l2ZW4gYml0IGJ1ZmZlciBpcyBjbG9uZWQgYW5kIHN0b3JlZC5cbiAgICAgICAgY29uc3RydWN0b3IoXG4gICAgICAgIC8vIFRoZSBtb2RlIGluZGljYXRvciBvZiB0aGlzIHNlZ21lbnQuXG4gICAgICAgIG1vZGUsIFxuICAgICAgICAvLyBUaGUgbGVuZ3RoIG9mIHRoaXMgc2VnbWVudCdzIHVuZW5jb2RlZCBkYXRhLiBNZWFzdXJlZCBpbiBjaGFyYWN0ZXJzIGZvclxuICAgICAgICAvLyBudW1lcmljL2FscGhhbnVtZXJpYy9rYW5qaSBtb2RlLCBieXRlcyBmb3IgYnl0ZSBtb2RlLCBhbmQgMCBmb3IgRUNJIG1vZGUuXG4gICAgICAgIC8vIEFsd2F5cyB6ZXJvIG9yIHBvc2l0aXZlLiBOb3QgdGhlIHNhbWUgYXMgdGhlIGRhdGEncyBiaXQgbGVuZ3RoLlxuICAgICAgICBudW1DaGFycywgXG4gICAgICAgIC8vIFRoZSBkYXRhIGJpdHMgb2YgdGhpcyBzZWdtZW50LiBBY2Nlc3NlZCB0aHJvdWdoIGdldERhdGEoKS5cbiAgICAgICAgYml0RGF0YSkge1xuICAgICAgICAgICAgdGhpcy5tb2RlID0gbW9kZTtcbiAgICAgICAgICAgIHRoaXMubnVtQ2hhcnMgPSBudW1DaGFycztcbiAgICAgICAgICAgIHRoaXMuYml0RGF0YSA9IGJpdERhdGE7XG4gICAgICAgICAgICBpZiAobnVtQ2hhcnMgPCAwKVxuICAgICAgICAgICAgICAgIHRocm93IFwiSW52YWxpZCBhcmd1bWVudFwiO1xuICAgICAgICAgICAgdGhpcy5iaXREYXRhID0gYml0RGF0YS5zbGljZSgpOyAvLyBNYWtlIGRlZmVuc2l2ZSBjb3B5XG4gICAgICAgIH1cbiAgICAgICAgLyotLSBTdGF0aWMgZmFjdG9yeSBmdW5jdGlvbnMgKG1pZCBsZXZlbCkgLS0qL1xuICAgICAgICAvLyBSZXR1cm5zIGEgc2VnbWVudCByZXByZXNlbnRpbmcgdGhlIGdpdmVuIGJpbmFyeSBkYXRhIGVuY29kZWQgaW5cbiAgICAgICAgLy8gYnl0ZSBtb2RlLiBBbGwgaW5wdXQgYnl0ZSBhcnJheXMgYXJlIGFjY2VwdGFibGUuIEFueSB0ZXh0IHN0cmluZ1xuICAgICAgICAvLyBjYW4gYmUgY29udmVydGVkIHRvIFVURi04IGJ5dGVzIGFuZCBlbmNvZGVkIGFzIGEgYnl0ZSBtb2RlIHNlZ21lbnQuXG4gICAgICAgIHN0YXRpYyBtYWtlQnl0ZXMoZGF0YSkge1xuICAgICAgICAgICAgbGV0IGJiID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGIgb2YgZGF0YSlcbiAgICAgICAgICAgICAgICBhcHBlbmRCaXRzKGIsIDgsIGJiKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUXJTZWdtZW50KFFyU2VnbWVudC5Nb2RlLkJZVEUsIGRhdGEubGVuZ3RoLCBiYik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmV0dXJucyBhIHNlZ21lbnQgcmVwcmVzZW50aW5nIHRoZSBnaXZlbiBzdHJpbmcgb2YgZGVjaW1hbCBkaWdpdHMgZW5jb2RlZCBpbiBudW1lcmljIG1vZGUuXG4gICAgICAgIHN0YXRpYyBtYWtlTnVtZXJpYyhkaWdpdHMpIHtcbiAgICAgICAgICAgIGlmICghUXJTZWdtZW50LmlzTnVtZXJpYyhkaWdpdHMpKVxuICAgICAgICAgICAgICAgIHRocm93IFwiU3RyaW5nIGNvbnRhaW5zIG5vbi1udW1lcmljIGNoYXJhY3RlcnNcIjtcbiAgICAgICAgICAgIGxldCBiYiA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaWdpdHMubGVuZ3RoOykgeyAvLyBDb25zdW1lIHVwIHRvIDMgZGlnaXRzIHBlciBpdGVyYXRpb25cbiAgICAgICAgICAgICAgICBjb25zdCBuID0gTWF0aC5taW4oZGlnaXRzLmxlbmd0aCAtIGksIDMpO1xuICAgICAgICAgICAgICAgIGFwcGVuZEJpdHMocGFyc2VJbnQoZGlnaXRzLnN1YnN0cihpLCBuKSwgMTApLCBuICogMyArIDEsIGJiKTtcbiAgICAgICAgICAgICAgICBpICs9IG47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV3IFFyU2VnbWVudChRclNlZ21lbnQuTW9kZS5OVU1FUklDLCBkaWdpdHMubGVuZ3RoLCBiYik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmV0dXJucyBhIHNlZ21lbnQgcmVwcmVzZW50aW5nIHRoZSBnaXZlbiB0ZXh0IHN0cmluZyBlbmNvZGVkIGluIGFscGhhbnVtZXJpYyBtb2RlLlxuICAgICAgICAvLyBUaGUgY2hhcmFjdGVycyBhbGxvd2VkIGFyZTogMCB0byA5LCBBIHRvIFogKHVwcGVyY2FzZSBvbmx5KSwgc3BhY2UsXG4gICAgICAgIC8vIGRvbGxhciwgcGVyY2VudCwgYXN0ZXJpc2ssIHBsdXMsIGh5cGhlbiwgcGVyaW9kLCBzbGFzaCwgY29sb24uXG4gICAgICAgIHN0YXRpYyBtYWtlQWxwaGFudW1lcmljKHRleHQpIHtcbiAgICAgICAgICAgIGlmICghUXJTZWdtZW50LmlzQWxwaGFudW1lcmljKHRleHQpKVxuICAgICAgICAgICAgICAgIHRocm93IFwiU3RyaW5nIGNvbnRhaW5zIHVuZW5jb2RhYmxlIGNoYXJhY3RlcnMgaW4gYWxwaGFudW1lcmljIG1vZGVcIjtcbiAgICAgICAgICAgIGxldCBiYiA9IFtdO1xuICAgICAgICAgICAgbGV0IGk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpICsgMiA8PSB0ZXh0Lmxlbmd0aDsgaSArPSAyKSB7IC8vIFByb2Nlc3MgZ3JvdXBzIG9mIDJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcCA9IFFyU2VnbWVudC5BTFBIQU5VTUVSSUNfQ0hBUlNFVC5pbmRleE9mKHRleHQuY2hhckF0KGkpKSAqIDQ1O1xuICAgICAgICAgICAgICAgIHRlbXAgKz0gUXJTZWdtZW50LkFMUEhBTlVNRVJJQ19DSEFSU0VULmluZGV4T2YodGV4dC5jaGFyQXQoaSArIDEpKTtcbiAgICAgICAgICAgICAgICBhcHBlbmRCaXRzKHRlbXAsIDExLCBiYik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaSA8IHRleHQubGVuZ3RoKSAvLyAxIGNoYXJhY3RlciByZW1haW5pbmdcbiAgICAgICAgICAgICAgICBhcHBlbmRCaXRzKFFyU2VnbWVudC5BTFBIQU5VTUVSSUNfQ0hBUlNFVC5pbmRleE9mKHRleHQuY2hhckF0KGkpKSwgNiwgYmIpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBRclNlZ21lbnQoUXJTZWdtZW50Lk1vZGUuQUxQSEFOVU1FUklDLCB0ZXh0Lmxlbmd0aCwgYmIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJldHVybnMgYSBuZXcgbXV0YWJsZSBsaXN0IG9mIHplcm8gb3IgbW9yZSBzZWdtZW50cyB0byByZXByZXNlbnQgdGhlIGdpdmVuIFVuaWNvZGUgdGV4dCBzdHJpbmcuXG4gICAgICAgIC8vIFRoZSByZXN1bHQgbWF5IHVzZSB2YXJpb3VzIHNlZ21lbnQgbW9kZXMgYW5kIHN3aXRjaCBtb2RlcyB0byBvcHRpbWl6ZSB0aGUgbGVuZ3RoIG9mIHRoZSBiaXQgc3RyZWFtLlxuICAgICAgICBzdGF0aWMgbWFrZVNlZ21lbnRzKHRleHQpIHtcbiAgICAgICAgICAgIC8vIFNlbGVjdCB0aGUgbW9zdCBlZmZpY2llbnQgc2VnbWVudCBlbmNvZGluZyBhdXRvbWF0aWNhbGx5XG4gICAgICAgICAgICBpZiAodGV4dCA9PSBcIlwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIGVsc2UgaWYgKFFyU2VnbWVudC5pc051bWVyaWModGV4dCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtRclNlZ21lbnQubWFrZU51bWVyaWModGV4dCldO1xuICAgICAgICAgICAgZWxzZSBpZiAoUXJTZWdtZW50LmlzQWxwaGFudW1lcmljKHRleHQpKVxuICAgICAgICAgICAgICAgIHJldHVybiBbUXJTZWdtZW50Lm1ha2VBbHBoYW51bWVyaWModGV4dCldO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiBbUXJTZWdtZW50Lm1ha2VCeXRlcyhRclNlZ21lbnQudG9VdGY4Qnl0ZUFycmF5KHRleHQpKV07XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmV0dXJucyBhIHNlZ21lbnQgcmVwcmVzZW50aW5nIGFuIEV4dGVuZGVkIENoYW5uZWwgSW50ZXJwcmV0YXRpb25cbiAgICAgICAgLy8gKEVDSSkgZGVzaWduYXRvciB3aXRoIHRoZSBnaXZlbiBhc3NpZ25tZW50IHZhbHVlLlxuICAgICAgICBzdGF0aWMgbWFrZUVjaShhc3NpZ25WYWwpIHtcbiAgICAgICAgICAgIGxldCBiYiA9IFtdO1xuICAgICAgICAgICAgaWYgKGFzc2lnblZhbCA8IDApXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJFQ0kgYXNzaWdubWVudCB2YWx1ZSBvdXQgb2YgcmFuZ2VcIjtcbiAgICAgICAgICAgIGVsc2UgaWYgKGFzc2lnblZhbCA8ICgxIDw8IDcpKVxuICAgICAgICAgICAgICAgIGFwcGVuZEJpdHMoYXNzaWduVmFsLCA4LCBiYik7XG4gICAgICAgICAgICBlbHNlIGlmIChhc3NpZ25WYWwgPCAoMSA8PCAxNCkpIHtcbiAgICAgICAgICAgICAgICBhcHBlbmRCaXRzKDIsIDIsIGJiKTtcbiAgICAgICAgICAgICAgICBhcHBlbmRCaXRzKGFzc2lnblZhbCwgMTQsIGJiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGFzc2lnblZhbCA8IDEwMDAwMDApIHtcbiAgICAgICAgICAgICAgICBhcHBlbmRCaXRzKDYsIDMsIGJiKTtcbiAgICAgICAgICAgICAgICBhcHBlbmRCaXRzKGFzc2lnblZhbCwgMjEsIGJiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkVDSSBhc3NpZ25tZW50IHZhbHVlIG91dCBvZiByYW5nZVwiO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBRclNlZ21lbnQoUXJTZWdtZW50Lk1vZGUuRUNJLCAwLCBiYik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVGVzdHMgd2hldGhlciB0aGUgZ2l2ZW4gc3RyaW5nIGNhbiBiZSBlbmNvZGVkIGFzIGEgc2VnbWVudCBpbiBudW1lcmljIG1vZGUuXG4gICAgICAgIC8vIEEgc3RyaW5nIGlzIGVuY29kYWJsZSBpZmYgZWFjaCBjaGFyYWN0ZXIgaXMgaW4gdGhlIHJhbmdlIDAgdG8gOS5cbiAgICAgICAgc3RhdGljIGlzTnVtZXJpYyh0ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gUXJTZWdtZW50Lk5VTUVSSUNfUkVHRVgudGVzdCh0ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBUZXN0cyB3aGV0aGVyIHRoZSBnaXZlbiBzdHJpbmcgY2FuIGJlIGVuY29kZWQgYXMgYSBzZWdtZW50IGluIGFscGhhbnVtZXJpYyBtb2RlLlxuICAgICAgICAvLyBBIHN0cmluZyBpcyBlbmNvZGFibGUgaWZmIGVhY2ggY2hhcmFjdGVyIGlzIGluIHRoZSBmb2xsb3dpbmcgc2V0OiAwIHRvIDksIEEgdG8gWlxuICAgICAgICAvLyAodXBwZXJjYXNlIG9ubHkpLCBzcGFjZSwgZG9sbGFyLCBwZXJjZW50LCBhc3RlcmlzaywgcGx1cywgaHlwaGVuLCBwZXJpb2QsIHNsYXNoLCBjb2xvbi5cbiAgICAgICAgc3RhdGljIGlzQWxwaGFudW1lcmljKHRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiBRclNlZ21lbnQuQUxQSEFOVU1FUklDX1JFR0VYLnRlc3QodGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgLyotLSBNZXRob2RzIC0tKi9cbiAgICAgICAgLy8gUmV0dXJucyBhIG5ldyBjb3B5IG9mIHRoZSBkYXRhIGJpdHMgb2YgdGhpcyBzZWdtZW50LlxuICAgICAgICBnZXREYXRhKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYml0RGF0YS5zbGljZSgpOyAvLyBNYWtlIGRlZmVuc2l2ZSBjb3B5XG4gICAgICAgIH1cbiAgICAgICAgLy8gKFBhY2thZ2UtcHJpdmF0ZSkgQ2FsY3VsYXRlcyBhbmQgcmV0dXJucyB0aGUgbnVtYmVyIG9mIGJpdHMgbmVlZGVkIHRvIGVuY29kZSB0aGUgZ2l2ZW4gc2VnbWVudHMgYXRcbiAgICAgICAgLy8gdGhlIGdpdmVuIHZlcnNpb24uIFRoZSByZXN1bHQgaXMgaW5maW5pdHkgaWYgYSBzZWdtZW50IGhhcyB0b28gbWFueSBjaGFyYWN0ZXJzIHRvIGZpdCBpdHMgbGVuZ3RoIGZpZWxkLlxuICAgICAgICBzdGF0aWMgZ2V0VG90YWxCaXRzKHNlZ3MsIHZlcnNpb24pIHtcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSAwO1xuICAgICAgICAgICAgZm9yIChjb25zdCBzZWcgb2Ygc2Vncykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNjYml0cyA9IHNlZy5tb2RlLm51bUNoYXJDb3VudEJpdHModmVyc2lvbik7XG4gICAgICAgICAgICAgICAgaWYgKHNlZy5udW1DaGFycyA+PSAoMSA8PCBjY2JpdHMpKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gSW5maW5pdHk7IC8vIFRoZSBzZWdtZW50J3MgbGVuZ3RoIGRvZXNuJ3QgZml0IHRoZSBmaWVsZCdzIGJpdCB3aWR0aFxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSA0ICsgY2NiaXRzICsgc2VnLmJpdERhdGEubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZXR1cm5zIGEgbmV3IGFycmF5IG9mIGJ5dGVzIHJlcHJlc2VudGluZyB0aGUgZ2l2ZW4gc3RyaW5nIGVuY29kZWQgaW4gVVRGLTguXG4gICAgICAgIHN0YXRpYyB0b1V0ZjhCeXRlQXJyYXkoc3RyKSB7XG4gICAgICAgICAgICBzdHIgPSBlbmNvZGVVUkkoc3RyKTtcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0ci5jaGFyQXQoaSkgIT0gXCIlXCIpXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpKTtcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocGFyc2VJbnQoc3RyLnN1YnN0cihpICsgMSwgMiksIDE2KSk7XG4gICAgICAgICAgICAgICAgICAgIGkgKz0gMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qLS0gQ29uc3RhbnRzIC0tKi9cbiAgICAvLyBEZXNjcmliZXMgcHJlY2lzZWx5IGFsbCBzdHJpbmdzIHRoYXQgYXJlIGVuY29kYWJsZSBpbiBudW1lcmljIG1vZGUuXG4gICAgUXJTZWdtZW50Lk5VTUVSSUNfUkVHRVggPSAvXlswLTldKiQvO1xuICAgIC8vIERlc2NyaWJlcyBwcmVjaXNlbHkgYWxsIHN0cmluZ3MgdGhhdCBhcmUgZW5jb2RhYmxlIGluIGFscGhhbnVtZXJpYyBtb2RlLlxuICAgIFFyU2VnbWVudC5BTFBIQU5VTUVSSUNfUkVHRVggPSAvXltBLVowLTkgJCUqKy5cXC86LV0qJC87XG4gICAgLy8gVGhlIHNldCBvZiBhbGwgbGVnYWwgY2hhcmFjdGVycyBpbiBhbHBoYW51bWVyaWMgbW9kZSxcbiAgICAvLyB3aGVyZSBlYWNoIGNoYXJhY3RlciB2YWx1ZSBtYXBzIHRvIHRoZSBpbmRleCBpbiB0aGUgc3RyaW5nLlxuICAgIFFyU2VnbWVudC5BTFBIQU5VTUVSSUNfQ0hBUlNFVCA9IFwiMDEyMzQ1Njc4OUFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaICQlKistLi86XCI7XG4gICAgcXJjb2RlZ2VuLlFyU2VnbWVudCA9IFFyU2VnbWVudDtcbn0pKHFyY29kZWdlbiB8fCAocXJjb2RlZ2VuID0ge30pKTtcbi8qLS0tLSBQdWJsaWMgaGVscGVyIGVudW1lcmF0aW9uIC0tLS0qL1xuKGZ1bmN0aW9uIChxcmNvZGVnZW4pIHtcbiAgICB2YXIgUXJDb2RlO1xuICAgIChmdW5jdGlvbiAoUXJDb2RlKSB7XG4gICAgICAgIC8qXG4gICAgICAgICAqIFRoZSBlcnJvciBjb3JyZWN0aW9uIGxldmVsIGluIGEgUVIgQ29kZSBzeW1ib2wuIEltbXV0YWJsZS5cbiAgICAgICAgICovXG4gICAgICAgIGNsYXNzIEVjYyB7XG4gICAgICAgICAgICAvKi0tIENvbnN0cnVjdG9yIGFuZCBmaWVsZHMgLS0qL1xuICAgICAgICAgICAgY29uc3RydWN0b3IoXG4gICAgICAgICAgICAvLyBJbiB0aGUgcmFuZ2UgMCB0byAzICh1bnNpZ25lZCAyLWJpdCBpbnRlZ2VyKS5cbiAgICAgICAgICAgIG9yZGluYWwsIFxuICAgICAgICAgICAgLy8gKFBhY2thZ2UtcHJpdmF0ZSkgSW4gdGhlIHJhbmdlIDAgdG8gMyAodW5zaWduZWQgMi1iaXQgaW50ZWdlcikuXG4gICAgICAgICAgICBmb3JtYXRCaXRzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcmRpbmFsID0gb3JkaW5hbDtcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1hdEJpdHMgPSBmb3JtYXRCaXRzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qLS0gQ29uc3RhbnRzIC0tKi9cbiAgICAgICAgRWNjLkxPVyA9IG5ldyBFY2MoMCwgMSk7IC8vIFRoZSBRUiBDb2RlIGNhbiB0b2xlcmF0ZSBhYm91dCAgNyUgZXJyb25lb3VzIGNvZGV3b3Jkc1xuICAgICAgICBFY2MuTUVESVVNID0gbmV3IEVjYygxLCAwKTsgLy8gVGhlIFFSIENvZGUgY2FuIHRvbGVyYXRlIGFib3V0IDE1JSBlcnJvbmVvdXMgY29kZXdvcmRzXG4gICAgICAgIEVjYy5RVUFSVElMRSA9IG5ldyBFY2MoMiwgMyk7IC8vIFRoZSBRUiBDb2RlIGNhbiB0b2xlcmF0ZSBhYm91dCAyNSUgZXJyb25lb3VzIGNvZGV3b3Jkc1xuICAgICAgICBFY2MuSElHSCA9IG5ldyBFY2MoMywgMik7IC8vIFRoZSBRUiBDb2RlIGNhbiB0b2xlcmF0ZSBhYm91dCAzMCUgZXJyb25lb3VzIGNvZGV3b3Jkc1xuICAgICAgICBRckNvZGUuRWNjID0gRWNjO1xuICAgIH0pKFFyQ29kZSA9IHFyY29kZWdlbi5RckNvZGUgfHwgKHFyY29kZWdlbi5RckNvZGUgPSB7fSkpO1xufSkocXJjb2RlZ2VuIHx8IChxcmNvZGVnZW4gPSB7fSkpO1xuLyotLS0tIFB1YmxpYyBoZWxwZXIgZW51bWVyYXRpb24gLS0tLSovXG4oZnVuY3Rpb24gKHFyY29kZWdlbikge1xuICAgIHZhciBRclNlZ21lbnQ7XG4gICAgKGZ1bmN0aW9uIChRclNlZ21lbnQpIHtcbiAgICAgICAgLypcbiAgICAgICAgICogRGVzY3JpYmVzIGhvdyBhIHNlZ21lbnQncyBkYXRhIGJpdHMgYXJlIGludGVycHJldGVkLiBJbW11dGFibGUuXG4gICAgICAgICAqL1xuICAgICAgICBjbGFzcyBNb2RlIHtcbiAgICAgICAgICAgIC8qLS0gQ29uc3RydWN0b3IgYW5kIGZpZWxkcyAtLSovXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIC8vIFRoZSBtb2RlIGluZGljYXRvciBiaXRzLCB3aGljaCBpcyBhIHVpbnQ0IHZhbHVlIChyYW5nZSAwIHRvIDE1KS5cbiAgICAgICAgICAgIG1vZGVCaXRzLCBcbiAgICAgICAgICAgIC8vIE51bWJlciBvZiBjaGFyYWN0ZXIgY291bnQgYml0cyBmb3IgdGhyZWUgZGlmZmVyZW50IHZlcnNpb24gcmFuZ2VzLlxuICAgICAgICAgICAgbnVtQml0c0NoYXJDb3VudCkge1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZUJpdHMgPSBtb2RlQml0cztcbiAgICAgICAgICAgICAgICB0aGlzLm51bUJpdHNDaGFyQ291bnQgPSBudW1CaXRzQ2hhckNvdW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyotLSBNZXRob2QgLS0qL1xuICAgICAgICAgICAgLy8gKFBhY2thZ2UtcHJpdmF0ZSkgUmV0dXJucyB0aGUgYml0IHdpZHRoIG9mIHRoZSBjaGFyYWN0ZXIgY291bnQgZmllbGQgZm9yIGEgc2VnbWVudCBpblxuICAgICAgICAgICAgLy8gdGhpcyBtb2RlIGluIGEgUVIgQ29kZSBhdCB0aGUgZ2l2ZW4gdmVyc2lvbiBudW1iZXIuIFRoZSByZXN1bHQgaXMgaW4gdGhlIHJhbmdlIFswLCAxNl0uXG4gICAgICAgICAgICBudW1DaGFyQ291bnRCaXRzKHZlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm51bUJpdHNDaGFyQ291bnRbTWF0aC5mbG9vcigodmVyICsgNykgLyAxNyldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qLS0gQ29uc3RhbnRzIC0tKi9cbiAgICAgICAgTW9kZS5OVU1FUklDID0gbmV3IE1vZGUoMHgxLCBbMTAsIDEyLCAxNF0pO1xuICAgICAgICBNb2RlLkFMUEhBTlVNRVJJQyA9IG5ldyBNb2RlKDB4MiwgWzksIDExLCAxM10pO1xuICAgICAgICBNb2RlLkJZVEUgPSBuZXcgTW9kZSgweDQsIFs4LCAxNiwgMTZdKTtcbiAgICAgICAgTW9kZS5LQU5KSSA9IG5ldyBNb2RlKDB4OCwgWzgsIDEwLCAxMl0pO1xuICAgICAgICBNb2RlLkVDSSA9IG5ldyBNb2RlKDB4NywgWzAsIDAsIDBdKTtcbiAgICAgICAgUXJTZWdtZW50Lk1vZGUgPSBNb2RlO1xuICAgIH0pKFFyU2VnbWVudCA9IHFyY29kZWdlbi5RclNlZ21lbnQgfHwgKHFyY29kZWdlbi5RclNlZ21lbnQgPSB7fSkpO1xufSkocXJjb2RlZ2VuIHx8IChxcmNvZGVnZW4gPSB7fSkpO1xuIl0sIm5hbWVzIjpbInFyY29kZWdlbiIsIlFyQ29kZSIsInZlcnNpb24iLCJlcnJvckNvcnJlY3Rpb25MZXZlbCIsImRhdGFDb2Rld29yZHMiLCJtYXNrIiwibW9kdWxlcyIsImlzRnVuY3Rpb24iLCJNSU5fVkVSU0lPTiIsIk1BWF9WRVJTSU9OIiwic2l6ZSIsInJvdyIsImkiLCJwdXNoIiwic2xpY2UiLCJkcmF3RnVuY3Rpb25QYXR0ZXJucyIsImFsbENvZGV3b3JkcyIsImFkZEVjY0FuZEludGVybGVhdmUiLCJkcmF3Q29kZXdvcmRzIiwibWluUGVuYWx0eSIsImFwcGx5TWFzayIsImRyYXdGb3JtYXRCaXRzIiwicGVuYWx0eSIsImdldFBlbmFsdHlTY29yZSIsIngiLCJ5Iiwic2V0RnVuY3Rpb25Nb2R1bGUiLCJkcmF3RmluZGVyUGF0dGVybiIsImFsaWduUGF0UG9zIiwiZ2V0QWxpZ25tZW50UGF0dGVyblBvc2l0aW9ucyIsIm51bUFsaWduIiwibGVuZ3RoIiwiaiIsImRyYXdBbGlnbm1lbnRQYXR0ZXJuIiwiZHJhd1ZlcnNpb24iLCJkYXRhIiwiZm9ybWF0Qml0cyIsInJlbSIsImJpdHMiLCJnZXRCaXQiLCJjb2xvciIsImEiLCJiIiwiTWF0aCIsImZsb29yIiwiZHkiLCJkeCIsImRpc3QiLCJtYXgiLCJhYnMiLCJ4eCIsInl5IiwiaXNEYXJrIiwidmVyIiwiZWNsIiwiZ2V0TnVtRGF0YUNvZGV3b3JkcyIsIm51bUJsb2NrcyIsIk5VTV9FUlJPUl9DT1JSRUNUSU9OX0JMT0NLUyIsIm9yZGluYWwiLCJibG9ja0VjY0xlbiIsIkVDQ19DT0RFV09SRFNfUEVSX0JMT0NLIiwicmF3Q29kZXdvcmRzIiwiZ2V0TnVtUmF3RGF0YU1vZHVsZXMiLCJudW1TaG9ydEJsb2NrcyIsInNob3J0QmxvY2tMZW4iLCJibG9ja3MiLCJyc0RpdiIsInJlZWRTb2xvbW9uQ29tcHV0ZURpdmlzb3IiLCJrIiwiZGF0IiwiZWNjIiwicmVlZFNvbG9tb25Db21wdXRlUmVtYWluZGVyIiwiY29uY2F0IiwicmVzdWx0IiwiZm9yRWFjaCIsImJsb2NrIiwicmlnaHQiLCJ2ZXJ0IiwidXB3YXJkIiwiaW52ZXJ0IiwicnVuQ29sb3IiLCJydW5YIiwicnVuSGlzdG9yeSIsIlBFTkFMVFlfTjEiLCJmaW5kZXJQZW5hbHR5QWRkSGlzdG9yeSIsImZpbmRlclBlbmFsdHlDb3VudFBhdHRlcm5zIiwiUEVOQUxUWV9OMyIsImZpbmRlclBlbmFsdHlUZXJtaW5hdGVBbmRDb3VudCIsInJ1blkiLCJQRU5BTFRZX04yIiwiZGFyayIsInJlZHVjZSIsInN1bSIsInRvdGFsIiwiY2VpbCIsIlBFTkFMVFlfTjQiLCJzdGVwIiwicG9zIiwic3BsaWNlIiwibiIsImNvcmUiLCJjdXJyZW50UnVuQ29sb3IiLCJjdXJyZW50UnVuTGVuZ3RoIiwicG9wIiwidW5zaGlmdCIsInRleHQiLCJzZWdzIiwiUXJTZWdtZW50IiwibWFrZVNlZ21lbnRzIiwiZW5jb2RlU2VnbWVudHMiLCJzZWciLCJtYWtlQnl0ZXMiLCJtaW5WZXJzaW9uIiwibWF4VmVyc2lvbiIsImJvb3N0RWNsIiwiZGF0YVVzZWRCaXRzIiwiZGF0YUNhcGFjaXR5Qml0cyIsInVzZWRCaXRzIiwiZ2V0VG90YWxCaXRzIiwiRWNjIiwiTUVESVVNIiwiUVVBUlRJTEUiLCJISUdIIiwibmV3RWNsIiwiYmIiLCJhcHBlbmRCaXRzIiwibW9kZSIsIm1vZGVCaXRzIiwibnVtQ2hhcnMiLCJudW1DaGFyQ291bnRCaXRzIiwiZ2V0RGF0YSIsIm1pbiIsInBhZEJ5dGUiLCJkZWdyZWUiLCJyb290IiwicmVlZFNvbG9tb25NdWx0aXBseSIsImRpdmlzb3IiLCJtYXAiLCJfIiwiZmFjdG9yIiwic2hpZnQiLCJjb2VmIiwieiIsInZhbCIsImxlbiIsImJpdERhdGEiLCJNb2RlIiwiQllURSIsImRpZ2l0cyIsImlzTnVtZXJpYyIsInBhcnNlSW50Iiwic3Vic3RyIiwiTlVNRVJJQyIsImlzQWxwaGFudW1lcmljIiwidGVtcCIsIkFMUEhBTlVNRVJJQ19DSEFSU0VUIiwiaW5kZXhPZiIsImNoYXJBdCIsIkFMUEhBTlVNRVJJQyIsIm1ha2VOdW1lcmljIiwibWFrZUFscGhhbnVtZXJpYyIsInRvVXRmOEJ5dGVBcnJheSIsImFzc2lnblZhbCIsIkVDSSIsIk5VTUVSSUNfUkVHRVgiLCJ0ZXN0IiwiQUxQSEFOVU1FUklDX1JFR0VYIiwiY2NiaXRzIiwiSW5maW5pdHkiLCJzdHIiLCJlbmNvZGVVUkkiLCJjaGFyQ29kZUF0IiwiTE9XIiwibnVtQml0c0NoYXJDb3VudCIsIktBTkpJIl0sInNvdXJjZVJvb3QiOiIifQ==
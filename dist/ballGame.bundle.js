/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/classes/Board.ts":
/*!******************************!*\
  !*** ./src/classes/Board.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ \"./src/config.ts\");\n/* harmony import */ var _Field__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Field */ \"./src/classes/Field.ts\");\n\n\nvar Board = /** @class */ (function () {\n    function Board() {\n        this.fields = [];\n        this.ballSelected = { is: false, field: null };\n        this.pathFinding = { todoArr: [], check: true, startField: null };\n        this.showBoard();\n    }\n    Board.prototype.showBoard = function () {\n        for (var i = 0; i < _config__WEBPACK_IMPORTED_MODULE_0__[\"default\"].board.height; i++) {\n            for (var j = 0; j < _config__WEBPACK_IMPORTED_MODULE_0__[\"default\"].board.width; j++) {\n                var field = new _Field__WEBPACK_IMPORTED_MODULE_1__[\"default\"](j, i);\n                this.fields.push(field);\n            }\n        }\n    };\n    Board.prototype.randomPlaceBalls = function () {\n        var freeFields;\n        for (var i = 0; i < _config__WEBPACK_IMPORTED_MODULE_0__[\"default\"].balls.quantityPerRound; i++) {\n            freeFields = this.fields.filter(function (f) { return f.canPlace; }); // only blank fields\n            var randColor = Math.floor(Math.random() * 6.99);\n            var randomField = Math.floor(Math.random() * (freeFields.length - 0.01));\n            var color = _config__WEBPACK_IMPORTED_MODULE_0__[\"default\"].balls.colors[randColor];\n            var field = freeFields[randomField];\n            field.placeBall(color);\n            field.canPlace = false;\n        }\n    };\n    Board.prototype.resetPathFinding = function () {\n        this.pathFinding = { todoArr: [], check: true };\n        for (var _i = 0, _a = this.fields; _i < _a.length; _i++) {\n            var field = _a[_i];\n            field.pathFinding = { searchVal: -1, canTrack: true };\n        }\n    };\n    Board.prototype.findPath = function (startPos, desiredPos, currIteration) {\n        var _this = this;\n        var surroundingFields = {\n            top: this.fields.find(function (f) {\n                return f.position.x === startPos.x && f.position.y === startPos.y - 1;\n            }),\n            bottom: this.fields.find(function (f) {\n                return f.position.x === startPos.x && f.position.y === startPos.y + 1;\n            }),\n            left: this.fields.find(function (f) {\n                return f.position.x === startPos.x - 1 && f.position.y === startPos.y;\n            }),\n            right: this.fields.find(function (f) {\n                return f.position.x === startPos.x + 1 && f.position.y === startPos.y;\n            })\n        };\n        for (var _i = 0, _a = Object.values(surroundingFields); _i < _a.length; _i++) {\n            var field = _a[_i];\n            if (!field)\n                continue;\n            if (JSON.stringify(field.position) === JSON.stringify(desiredPos)) { // found desired field\n                // highlight end and start position\n                field.highlight();\n                this.pathFinding.startField.highlight();\n                this.pathFinding = { todoArr: [], check: false };\n                this.highlightPath(desiredPos);\n                return;\n            }\n            if (!field.canPlace || !field.pathFinding.canTrack)\n                continue;\n            field.pathFinding.canTrack = false;\n            field.pathFinding.searchVal = currIteration;\n            field.insertNum(currIteration); // TODO: delete this line if pathfinding works\n            this.pathFinding.todoArr.push({ pos: field.position, num: currIteration + 1 });\n        }\n        this.pathFinding.todoArr.forEach(function (variation, i) {\n            setTimeout(function () {\n                if (!_this.pathFinding.check)\n                    return;\n                _this.pathFinding.todoArr.splice(i, 1);\n                _this.findPath(variation.pos, desiredPos, variation.num);\n            }, 0); // this doesn't work without timeout\n        });\n    };\n    Board.prototype.highlightPath = function (currentPos) {\n        var surroundingFields = {\n            top: this.fields.find(function (f) {\n                return f.position.x === currentPos.x && f.position.y === currentPos.y - 1;\n            }),\n            bottom: this.fields.find(function (f) {\n                return f.position.x === currentPos.x && f.position.y === currentPos.y + 1;\n            }),\n            left: this.fields.find(function (f) {\n                return f.position.x === currentPos.x - 1 && f.position.y === currentPos.y;\n            }),\n            right: this.fields.find(function (f) {\n                return f.position.x === currentPos.x + 1 && f.position.y === currentPos.y;\n            })\n        };\n        var goes = null;\n        for (var _i = 0, _a = Object.values(surroundingFields); _i < _a.length; _i++) {\n            var surroundField = _a[_i];\n            if (!surroundField)\n                continue;\n            if (!goes && surroundField.pathFinding.searchVal > 0)\n                goes = surroundField;\n            if (surroundField.pathFinding.searchVal > 0 && surroundField.pathFinding.searchVal < goes.pathFinding.searchVal)\n                goes = surroundField;\n        }\n        if (!goes)\n            return;\n        goes.highlight();\n        if (goes.pathFinding.searchVal !== 1)\n            this.highlightPath(goes.position);\n    };\n    return Board;\n}());\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Board);\n\n\n//# sourceURL=webpack://kulki2/./src/classes/Board.ts?");

/***/ }),

/***/ "./src/classes/Field.ts":
/*!******************************!*\
  !*** ./src/classes/Field.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ \"./src/config.ts\");\n/* harmony import */ var _main__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../main */ \"./src/main.ts\");\n\n\nvar Field = /** @class */ (function () {\n    function Field(x, y) {\n        var _this = this;\n        this.position = { x: x, y: y };\n        this.div = document.createElement(\"div\");\n        this.canPlace = true;\n        this.pathFinding = { canTrack: true, searchVal: -1 };\n        this.ballColor = null;\n        this.div.classList.add(\"field\");\n        this.div.onmousedown = function () { return _this.onmouseDown(); };\n        this.div.onmousedown = function () { return _this.onmouseDown(); };\n        _config__WEBPACK_IMPORTED_MODULE_0__[\"default\"].board.div.appendChild(this.div);\n    }\n    Field.prototype.onmouseDown = function () {\n        if (!this.ballColor)\n            return;\n        _main__WEBPACK_IMPORTED_MODULE_1__.board.ballSelected = { is: true, field: this };\n        _main__WEBPACK_IMPORTED_MODULE_1__.board.pathFinding.startField = this;\n    };\n    Field.prototype.onmouseenter = function () {\n        if (!_main__WEBPACK_IMPORTED_MODULE_1__.board.ballSelected.is || !this.canPlace)\n            return;\n        // board.resetPathFinding()\n        this.pathFinding = { canTrack: false, searchVal: -1 }; // TODO: warning on this\n        _main__WEBPACK_IMPORTED_MODULE_1__.board.findPath(_main__WEBPACK_IMPORTED_MODULE_1__.board.ballSelected.field.position, this.position, 1);\n    };\n    Field.prototype.placeBall = function (color) {\n        var ball = document.createElement('div');\n        ball.classList.add(\"ball\");\n        var colorValue = _config__WEBPACK_IMPORTED_MODULE_0__[\"default\"].balls.colorsMap.find(function (c) { return c.key === color; }).value;\n        ball.style.backgroundColor = colorValue;\n        this.ballColor = color;\n        this.div.appendChild(ball);\n    };\n    Field.prototype.clearDiv = function () {\n        this.div.innerHTML = \"\";\n    };\n    Field.prototype.insertNum = function (num) {\n        this.div.innerHTML = num + \"\";\n    };\n    Field.prototype.highlight = function () {\n        this.div.style.backgroundColor = \"red\";\n    };\n    Field.prototype.unhighlight = function () {\n        this.div.style.backgroundColor = \"transparent\";\n    };\n    return Field;\n}());\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Field);\n\n\n//# sourceURL=webpack://kulki2/./src/classes/Field.ts?");

/***/ }),

/***/ "./src/config.ts":
/*!***********************!*\
  !*** ./src/config.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    board: {\n        div: document.getElementById(\"game\"),\n        height: 9,\n        width: 9\n    },\n    balls: {\n        quantityPerRound: 3,\n        colors: [\"r\", \"g\", \"b\", \"o\", \"w\", \"d\", \"p\"],\n        colorsMap: [\n            {\n                key: \"r\",\n                value: \"#d22\"\n            },\n            {\n                key: \"g\",\n                value: \"#2d2\"\n            },\n            {\n                key: \"b\",\n                value: \"#22d\"\n            },\n            {\n                key: \"o\",\n                value: \"#ffa500\"\n            },\n            {\n                key: \"w\",\n                value: \"#fff\"\n            },\n            {\n                key: \"d\",\n                value: \"#232323\"\n            },\n            {\n                key: \"p\",\n                value: \"#6a0dad\"\n            }\n        ]\n    }\n});\n\n\n//# sourceURL=webpack://kulki2/./src/config.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"board\": () => (/* binding */ board)\n/* harmony export */ });\n/* harmony import */ var _classes_Board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./classes/Board */ \"./src/classes/Board.ts\");\n\n// export let board = undefined\nvar board = new _classes_Board__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\nfunction startGame() {\n    board.randomPlaceBalls();\n}\nstartGame();\n\n\n//# sourceURL=webpack://kulki2/./src/main.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	
/******/ })()
;
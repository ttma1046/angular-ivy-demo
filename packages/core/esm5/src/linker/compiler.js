/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '../di/injectable';
import { InjectionToken } from '../di/injection_token';
import { NgModuleFactory as NgModuleFactoryR3 } from '../render3/ng_module_ref';
/**
 * Combination of NgModuleFactory and ComponentFactorys.
 *
 * \@publicApi
 * @template T
 */
var /**
 * Combination of NgModuleFactory and ComponentFactorys.
 *
 * \@publicApi
 * @template T
 */
ModuleWithComponentFactories = /** @class */ (function () {
    function ModuleWithComponentFactories(ngModuleFactory, componentFactories) {
        this.ngModuleFactory = ngModuleFactory;
        this.componentFactories = componentFactories;
    }
    return ModuleWithComponentFactories;
}());
/**
 * Combination of NgModuleFactory and ComponentFactorys.
 *
 * \@publicApi
 * @template T
 */
export { ModuleWithComponentFactories };
if (false) {
    /** @type {?} */
    ModuleWithComponentFactories.prototype.ngModuleFactory;
    /** @type {?} */
    ModuleWithComponentFactories.prototype.componentFactories;
}
/**
 * @return {?}
 */
function _throwError() {
    throw new Error("Runtime compiler is not loaded");
}
/** @type {?} */
var Compiler_compileModuleSync__PRE_R3__ = /** @type {?} */ (_throwError);
/** @type {?} */
export var Compiler_compileModuleSync__POST_R3__ = function (moduleType) {
    return new NgModuleFactoryR3(moduleType);
};
/** @type {?} */
var Compiler_compileModuleSync = Compiler_compileModuleSync__PRE_R3__;
/** @type {?} */
var Compiler_compileModuleAsync__PRE_R3__ = /** @type {?} */ (_throwError);
/** @type {?} */
export var Compiler_compileModuleAsync__POST_R3__ = function (moduleType) {
    return Promise.resolve(Compiler_compileModuleSync__POST_R3__(moduleType));
};
/** @type {?} */
var Compiler_compileModuleAsync = Compiler_compileModuleAsync__PRE_R3__;
/** @type {?} */
var Compiler_compileModuleAndAllComponentsSync__PRE_R3__ = /** @type {?} */ (_throwError);
/** @type {?} */
export var Compiler_compileModuleAndAllComponentsSync__POST_R3__ = function (moduleType) {
    return new ModuleWithComponentFactories(Compiler_compileModuleSync__POST_R3__(moduleType), []);
};
/** @type {?} */
var Compiler_compileModuleAndAllComponentsSync = Compiler_compileModuleAndAllComponentsSync__PRE_R3__;
/** @type {?} */
var Compiler_compileModuleAndAllComponentsAsync__PRE_R3__ = /** @type {?} */ (_throwError);
/** @type {?} */
export var Compiler_compileModuleAndAllComponentsAsync__POST_R3__ = function (moduleType) {
    return Promise.resolve(Compiler_compileModuleAndAllComponentsSync__POST_R3__(moduleType));
};
/** @type {?} */
var Compiler_compileModuleAndAllComponentsAsync = Compiler_compileModuleAndAllComponentsAsync__PRE_R3__;
/**
 * Low-level service for running the angular compiler during runtime
 * to create {\@link ComponentFactory}s, which
 * can later be used to create and render a Component instance.
 *
 * Each `\@NgModule` provides an own `Compiler` to its injector,
 * that will use the directives/pipes of the ng module for compilation
 * of components.
 *
 * \@publicApi
 */
var Compiler = /** @class */ (function () {
    function Compiler() {
        /**
         * Compiles the given NgModule and all of its components. All templates of the components listed
         * in `entryComponents` have to be inlined.
         */
        this.compileModuleSync = Compiler_compileModuleSync;
        /**
         * Compiles the given NgModule and all of its components
         */
        this.compileModuleAsync = Compiler_compileModuleAsync;
        /**
         * Same as {\@link #compileModuleSync} but also creates ComponentFactories for all components.
         */
        this.compileModuleAndAllComponentsSync = Compiler_compileModuleAndAllComponentsSync;
        /**
         * Same as {\@link #compileModuleAsync} but also creates ComponentFactories for all components.
         */
        this.compileModuleAndAllComponentsAsync = Compiler_compileModuleAndAllComponentsAsync;
    }
    /**
     * Clears all caches.
     */
    /**
     * Clears all caches.
     * @return {?}
     */
    Compiler.prototype.clearCache = /**
     * Clears all caches.
     * @return {?}
     */
    function () { };
    /**
     * Clears the cache for the given component/ngModule.
     */
    /**
     * Clears the cache for the given component/ngModule.
     * @param {?} type
     * @return {?}
     */
    Compiler.prototype.clearCacheFor = /**
     * Clears the cache for the given component/ngModule.
     * @param {?} type
     * @return {?}
     */
    function (type) { };
    /**
     * Returns the id for a given NgModule, if one is defined and known to the compiler.
     */
    /**
     * Returns the id for a given NgModule, if one is defined and known to the compiler.
     * @param {?} moduleType
     * @return {?}
     */
    Compiler.prototype.getModuleId = /**
     * Returns the id for a given NgModule, if one is defined and known to the compiler.
     * @param {?} moduleType
     * @return {?}
     */
    function (moduleType) { return undefined; };
    Compiler.decorators = [
        { type: Injectable },
    ];
    return Compiler;
}());
export { Compiler };
if (false) {
    /**
     * Compiles the given NgModule and all of its components. All templates of the components listed
     * in `entryComponents` have to be inlined.
     * @type {?}
     */
    Compiler.prototype.compileModuleSync;
    /**
     * Compiles the given NgModule and all of its components
     * @type {?}
     */
    Compiler.prototype.compileModuleAsync;
    /**
     * Same as {\@link #compileModuleSync} but also creates ComponentFactories for all components.
     * @type {?}
     */
    Compiler.prototype.compileModuleAndAllComponentsSync;
    /**
     * Same as {\@link #compileModuleAsync} but also creates ComponentFactories for all components.
     * @type {?}
     */
    Compiler.prototype.compileModuleAndAllComponentsAsync;
}
/** @typedef {?} */
var CompilerOptions;
export { CompilerOptions };
/** *
 * Token to provide CompilerOptions in the platform injector.
 *
 * \@publicApi
  @type {?} */
export var COMPILER_OPTIONS = new InjectionToken('compilerOptions');
/**
 * A factory for creating a Compiler
 *
 * \@publicApi
 * @abstract
 */
var /**
 * A factory for creating a Compiler
 *
 * \@publicApi
 * @abstract
 */
CompilerFactory = /** @class */ (function () {
    function CompilerFactory() {
    }
    return CompilerFactory;
}());
/**
 * A factory for creating a Compiler
 *
 * \@publicApi
 * @abstract
 */
export { CompilerFactory };
if (false) {
    /**
     * @abstract
     * @param {?=} options
     * @return {?}
     */
    CompilerFactory.prototype.createCompiler = function (options) { };
}
//# sourceMappingURL=compiler.js.map
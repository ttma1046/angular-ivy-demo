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
import { NG_INJECTABLE_DEF, NG_INJECTOR_DEF } from '../render3/fields';
/**
 * Information about how a type or `InjectionToken` interfaces with the DI system.
 *
 * At a minimum, this includes a `factory` which defines how to create the given type `T`, possibly
 * requesting injection of other types if necessary.
 *
 * Optionally, a `providedIn` parameter specifies that the given type belongs to a particular
 * `InjectorDef`, `NgModule`, or a special scope (e.g. `'root'`). A value of `null` indicates
 * that the injectable does not belong to any scope.
 *
 * NOTE: This is a private type and should not be exported
 * @record
 * @template T
 */
export function InjectableDef() { }
/**
 * Specifies that the given type belongs to a particular injector:
 * - `InjectorType` such as `NgModule`,
 * - `'root'` the root injector
 * - `'any'` all injectors.
 * - `null`, does not belong to any injector. Must be explicitly listed in the injector
 *   `providers`.
 * @type {?}
 */
InjectableDef.prototype.providedIn;
/**
 * Factory method to execute to create an instance of the injectable.
 * @type {?}
 */
InjectableDef.prototype.factory;
/**
 * In a case of no explicit injector, a location where the instance of the injectable is stored.
 * @type {?}
 */
InjectableDef.prototype.value;
/**
 * Information about the providers to be included in an `Injector` as well as how the given type
 * which carries the information should be created by the DI system.
 *
 * An `InjectorDef` can import other types which have `InjectorDefs`, forming a deep nested
 * structure of providers with a defined priority (identically to how `NgModule`s also have
 * an import/dependency structure).
 *
 * NOTE: This is a private type and should not be exported
 * @record
 * @template T
 */
export function InjectorDef() { }
/** @type {?} */
InjectorDef.prototype.factory;
/** @type {?} */
InjectorDef.prototype.providers;
/** @type {?} */
InjectorDef.prototype.imports;
/**
 * A `Type` which has an `InjectableDef` static field.
 *
 * `InjectableDefType`s contain their own Dependency Injection metadata and are usable in an
 * `InjectorDef`-based `StaticInjector.
 *
 * \@publicApi
 * @record
 * @template T
 */
export function InjectableType() { }
/**
 * Opaque type whose structure is highly version dependent. Do not rely on any properties.
 * @type {?}
 */
InjectableType.prototype.ngInjectableDef;
/**
 * A type which has an `InjectorDef` static field.
 *
 * `InjectorDefTypes` can be used to configure a `StaticInjector`.
 *
 * \@publicApi
 * @record
 * @template T
 */
export function InjectorType() { }
/**
 * Opaque type whose structure is highly version dependent. Do not rely on any properties.
 * @type {?}
 */
InjectorType.prototype.ngInjectorDef;
/**
 * Describes the `InjectorDef` equivalent of a `ModuleWithProviders`, an `InjectorDefType` with an
 * associated array of providers.
 *
 * Objects of this type can be listed in the imports section of an `InjectorDef`.
 *
 * NOTE: This is a private type and should not be exported
 * @record
 * @template T
 */
export function InjectorTypeWithProviders() { }
/** @type {?} */
InjectorTypeWithProviders.prototype.ngModule;
/** @type {?|undefined} */
InjectorTypeWithProviders.prototype.providers;
/**
 * Construct an `InjectableDef` which defines how a token will be constructed by the DI system, and
 * in which injectors (if any) it will be available.
 *
 * This should be assigned to a static `ngInjectableDef` field on a type, which will then be an
 * `InjectableType`.
 *
 * Options:
 * * `providedIn` determines which injectors will include the injectable, by either associating it
 *   with an `\@NgModule` or other `InjectorType`, or by specifying that this injectable should be
 *   provided in the `'root'` injector, which will be the application-level injector in most apps.
 * * `factory` gives the zero argument function which will create an instance of the injectable.
 *   The factory can call `inject` to access the `Injector` and request injection of dependencies.
 *
 * \@publicApi
 * @template T
 * @param {?} opts
 * @return {?}
 */
export function defineInjectable(opts) {
    return /** @type {?} */ ((/** @type {?} */ ({
        providedIn: /** @type {?} */ (opts.providedIn) || null, factory: opts.factory, value: undefined,
    })));
}
/**
 * Construct an `InjectorDef` which configures an injector.
 *
 * This should be assigned to a static `ngInjectorDef` field on a type, which will then be an
 * `InjectorType`.
 *
 * Options:
 *
 * * `factory`: an `InjectorType` is an instantiable type, so a zero argument `factory` function to
 *   create the type must be provided. If that factory function needs to inject arguments, it can
 *   use the `inject` function.
 * * `providers`: an optional array of providers to add to the injector. Each provider must
 *   either have a factory or point to a type which has an `ngInjectableDef` static property (the
 *   type must be an `InjectableType`).
 * * `imports`: an optional array of imports of other `InjectorType`s or `InjectorTypeWithModule`s
 *   whose providers will also be added to the injector. Locally provided types will override
 *   providers from imports.
 *
 * \@publicApi
 * @param {?} options
 * @return {?}
 */
export function defineInjector(options) {
    return /** @type {?} */ ((/** @type {?} */ ({
        factory: options.factory, providers: options.providers || [], imports: options.imports || [],
    })));
}
/**
 * Read the `ngInjectableDef` type in a way which is immune to accidentally reading inherited value.
 *
 * @template T
 * @param {?} type type which may have `ngInjectableDef`
 * @return {?}
 */
export function getInjectableDef(type) {
    return type.hasOwnProperty(NG_INJECTABLE_DEF) ? (/** @type {?} */ (type))[NG_INJECTABLE_DEF] : null;
}
/**
 * Read the `ngInjectorDef` type in a way which is immune to accidentally reading inherited value.
 *
 * @template T
 * @param {?} type type which may have `ngInjectorDef`
 * @return {?}
 */
export function getInjectorDef(type) {
    return type.hasOwnProperty(NG_INJECTOR_DEF) ? (/** @type {?} */ (type))[NG_INJECTOR_DEF] : null;
}
//# sourceMappingURL=defs.js.map
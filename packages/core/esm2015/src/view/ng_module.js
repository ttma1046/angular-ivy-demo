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
import { getInjectableDef } from '../di/defs';
import { resolveForwardRef } from '../di/forward_ref';
import { INJECTOR, Injector } from '../di/injector';
import { setCurrentInjector } from '../di/injector_compatibility';
import { APP_ROOT } from '../di/scope';
import { NgModuleRef } from '../linker/ng_module_factory';
import { stringify } from '../util';
import { splitDepsDsl, tokenKey } from './util';
/** @type {?} */
const UNDEFINED_VALUE = new Object();
/** @type {?} */
const InjectorRefTokenKey = tokenKey(Injector);
/** @type {?} */
const INJECTORRefTokenKey = tokenKey(INJECTOR);
/** @type {?} */
const NgModuleRefTokenKey = tokenKey(NgModuleRef);
/**
 * @param {?} flags
 * @param {?} token
 * @param {?} value
 * @param {?} deps
 * @return {?}
 */
export function moduleProvideDef(flags, token, value, deps) {
    // Need to resolve forwardRefs as e.g. for `useValue` we
    // lowered the expression and then stopped evaluating it,
    // i.e. also didn't unwrap it.
    value = resolveForwardRef(value);
    /** @type {?} */
    const depDefs = splitDepsDsl(deps, stringify(token));
    return {
        // will bet set by the module definition
        index: -1,
        deps: depDefs, flags, token, value
    };
}
/**
 * @param {?} providers
 * @return {?}
 */
export function moduleDef(providers) {
    /** @type {?} */
    const providersByKey = {};
    /** @type {?} */
    const modules = [];
    /** @type {?} */
    let isRoot = false;
    for (let i = 0; i < providers.length; i++) {
        /** @type {?} */
        const provider = providers[i];
        if (provider.token === APP_ROOT && provider.value === true) {
            isRoot = true;
        }
        if (provider.flags & 1073741824 /* TypeNgModule */) {
            modules.push(provider.token);
        }
        provider.index = i;
        providersByKey[tokenKey(provider.token)] = provider;
    }
    return {
        // Will be filled later...
        factory: null,
        providersByKey,
        providers,
        modules,
        isRoot,
    };
}
/**
 * @param {?} data
 * @return {?}
 */
export function initNgModule(data) {
    /** @type {?} */
    const def = data._def;
    /** @type {?} */
    const providers = data._providers = new Array(def.providers.length);
    for (let i = 0; i < def.providers.length; i++) {
        /** @type {?} */
        const provDef = def.providers[i];
        if (!(provDef.flags & 4096 /* LazyProvider */)) {
            // Make sure the provider has not been already initialized outside this loop.
            if (providers[i] === undefined) {
                providers[i] = _createProviderInstance(data, provDef);
            }
        }
    }
}
/**
 * @param {?} data
 * @param {?} depDef
 * @param {?=} notFoundValue
 * @return {?}
 */
export function resolveNgModuleDep(data, depDef, notFoundValue = Injector.THROW_IF_NOT_FOUND) {
    /** @type {?} */
    const former = setCurrentInjector(data);
    try {
        if (depDef.flags & 8 /* Value */) {
            return depDef.token;
        }
        if (depDef.flags & 2 /* Optional */) {
            notFoundValue = null;
        }
        if (depDef.flags & 1 /* SkipSelf */) {
            return data._parent.get(depDef.token, notFoundValue);
        }
        /** @type {?} */
        const tokenKey = depDef.tokenKey;
        switch (tokenKey) {
            case InjectorRefTokenKey:
            case INJECTORRefTokenKey:
            case NgModuleRefTokenKey:
                return data;
        }
        /** @type {?} */
        const providerDef = data._def.providersByKey[tokenKey];
        /** @type {?} */
        let injectableDef;
        if (providerDef) {
            /** @type {?} */
            let providerInstance = data._providers[providerDef.index];
            if (providerInstance === undefined) {
                providerInstance = data._providers[providerDef.index] =
                    _createProviderInstance(data, providerDef);
            }
            return providerInstance === UNDEFINED_VALUE ? undefined : providerInstance;
        }
        else if ((injectableDef = getInjectableDef(depDef.token)) && targetsModule(data, injectableDef)) {
            /** @type {?} */
            const index = data._providers.length;
            data._def.providersByKey[depDef.tokenKey] = {
                flags: 1024 /* TypeFactoryProvider */ | 4096 /* LazyProvider */,
                value: injectableDef.factory,
                deps: [], index,
                token: depDef.token,
            };
            data._providers[index] = UNDEFINED_VALUE;
            return (data._providers[index] =
                _createProviderInstance(data, data._def.providersByKey[depDef.tokenKey]));
        }
        else if (depDef.flags & 4 /* Self */) {
            return notFoundValue;
        }
        return data._parent.get(depDef.token, notFoundValue);
    }
    finally {
        setCurrentInjector(former);
    }
}
/**
 * @param {?} ngModule
 * @param {?} scope
 * @return {?}
 */
function moduleTransitivelyPresent(ngModule, scope) {
    return ngModule._def.modules.indexOf(scope) > -1;
}
/**
 * @param {?} ngModule
 * @param {?} def
 * @return {?}
 */
function targetsModule(ngModule, def) {
    return def.providedIn != null && (moduleTransitivelyPresent(ngModule, def.providedIn) ||
        def.providedIn === 'root' && ngModule._def.isRoot);
}
/**
 * @param {?} ngModule
 * @param {?} providerDef
 * @return {?}
 */
function _createProviderInstance(ngModule, providerDef) {
    /** @type {?} */
    let injectable;
    switch (providerDef.flags & 201347067 /* Types */) {
        case 512 /* TypeClassProvider */:
            injectable = _createClass(ngModule, providerDef.value, providerDef.deps);
            break;
        case 1024 /* TypeFactoryProvider */:
            injectable = _callFactory(ngModule, providerDef.value, providerDef.deps);
            break;
        case 2048 /* TypeUseExistingProvider */:
            injectable = resolveNgModuleDep(ngModule, providerDef.deps[0]);
            break;
        case 256 /* TypeValueProvider */:
            injectable = providerDef.value;
            break;
    }
    // The read of `ngOnDestroy` here is slightly expensive as it's megamorphic, so it should be
    // avoided if possible. The sequence of checks here determines whether ngOnDestroy needs to be
    // checked. It might not if the `injectable` isn't an object or if NodeFlags.OnDestroy is already
    // set (ngOnDestroy was detected statically).
    if (injectable !== UNDEFINED_VALUE && injectable != null && typeof injectable === 'object' &&
        !(providerDef.flags & 131072 /* OnDestroy */) && typeof injectable.ngOnDestroy === 'function') {
        providerDef.flags |= 131072 /* OnDestroy */;
    }
    return injectable === undefined ? UNDEFINED_VALUE : injectable;
}
/**
 * @param {?} ngModule
 * @param {?} ctor
 * @param {?} deps
 * @return {?}
 */
function _createClass(ngModule, ctor, deps) {
    /** @type {?} */
    const len = deps.length;
    switch (len) {
        case 0:
            return new ctor();
        case 1:
            return new ctor(resolveNgModuleDep(ngModule, deps[0]));
        case 2:
            return new ctor(resolveNgModuleDep(ngModule, deps[0]), resolveNgModuleDep(ngModule, deps[1]));
        case 3:
            return new ctor(resolveNgModuleDep(ngModule, deps[0]), resolveNgModuleDep(ngModule, deps[1]), resolveNgModuleDep(ngModule, deps[2]));
        default:
            /** @type {?} */
            const depValues = new Array(len);
            for (let i = 0; i < len; i++) {
                depValues[i] = resolveNgModuleDep(ngModule, deps[i]);
            }
            return new ctor(...depValues);
    }
}
/**
 * @param {?} ngModule
 * @param {?} factory
 * @param {?} deps
 * @return {?}
 */
function _callFactory(ngModule, factory, deps) {
    /** @type {?} */
    const len = deps.length;
    switch (len) {
        case 0:
            return factory();
        case 1:
            return factory(resolveNgModuleDep(ngModule, deps[0]));
        case 2:
            return factory(resolveNgModuleDep(ngModule, deps[0]), resolveNgModuleDep(ngModule, deps[1]));
        case 3:
            return factory(resolveNgModuleDep(ngModule, deps[0]), resolveNgModuleDep(ngModule, deps[1]), resolveNgModuleDep(ngModule, deps[2]));
        default:
            /** @type {?} */
            const depValues = Array(len);
            for (let i = 0; i < len; i++) {
                depValues[i] = resolveNgModuleDep(ngModule, deps[i]);
            }
            return factory(...depValues);
    }
}
/**
 * @param {?} ngModule
 * @param {?} lifecycles
 * @return {?}
 */
export function callNgModuleLifecycle(ngModule, lifecycles) {
    /** @type {?} */
    const def = ngModule._def;
    /** @type {?} */
    const destroyed = new Set();
    for (let i = 0; i < def.providers.length; i++) {
        /** @type {?} */
        const provDef = def.providers[i];
        if (provDef.flags & 131072 /* OnDestroy */) {
            /** @type {?} */
            const instance = ngModule._providers[i];
            if (instance && instance !== UNDEFINED_VALUE) {
                /** @type {?} */
                const onDestroy = instance.ngOnDestroy;
                if (typeof onDestroy === 'function' && !destroyed.has(instance)) {
                    onDestroy.apply(instance);
                    destroyed.add(instance);
                }
            }
        }
    }
}
//# sourceMappingURL=ng_module.js.map
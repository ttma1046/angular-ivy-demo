/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { PlatformRef } from './application_ref';
import { StaticProvider } from './di';
/**
 * This platform has to be included in any other platform
 *
 * @publicApi
 */
export declare const platformCore: (extraProviders?: StaticProvider[] | undefined) => PlatformRef;

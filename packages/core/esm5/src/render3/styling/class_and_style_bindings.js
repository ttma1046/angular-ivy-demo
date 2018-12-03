/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { RendererStyleFlags3, isProceduralRenderer } from '../interfaces/renderer';
import { NO_CHANGE } from '../tokens';
import { getRootContext } from '../util';
import { BoundPlayerFactory } from './player_factory';
import { addPlayerInternal, allocPlayerContext, createEmptyStylingContext, getPlayerContext } from './util';
/** @type {?} */
var EMPTY_ARR = [];
/** @type {?} */
var EMPTY_OBJ = {};
/**
 * Creates a styling context template where styling information is stored.
 * Any styles that are later referenced using `updateStyleProp` must be
 * passed in within this function. Initial values for those styles are to
 * be declared after all initial style properties are declared (this change in
 * mode between declarations and initial styles is made possible using a special
 * enum value found in `definition.ts`).
 *
 * @param {?=} initialClassDeclarations a list of class declarations and initial class values
 *    that are used later within the styling context.
 *
 *    -> ['foo', 'bar', SPECIAL_ENUM_VAL, 'foo', true]
 *       This implies that `foo` and `bar` will be later styled and that the `foo`
 *       class will be applied to the element as an initial class since it's true
 * @param {?=} initialStyleDeclarations a list of style declarations and initial style values
 *    that are used later within the styling context.
 *
 *    -> ['width', 'height', SPECIAL_ENUM_VAL, 'width', '100px']
 *       This implies that `width` and `height` will be later styled and that the `width`
 *       property has an initial value of `100px`.
 *
 * @param {?=} styleSanitizer
 * @param {?=} onlyProcessSingleClasses
 * @return {?}
 */
export function createStylingContextTemplate(initialClassDeclarations, initialStyleDeclarations, styleSanitizer, onlyProcessSingleClasses) {
    /** @type {?} */
    var initialStylingValues = [null];
    /** @type {?} */
    var context = createEmptyStylingContext(null, styleSanitizer, initialStylingValues);
    /** @type {?} */
    var stylesLookup = {};
    /** @type {?} */
    var classesLookup = {};
    /** @type {?} */
    var totalStyleDeclarations = 0;
    if (initialStyleDeclarations) {
        /** @type {?} */
        var hasPassedDeclarations = false;
        for (var i = 0; i < initialStyleDeclarations.length; i++) {
            /** @type {?} */
            var v = /** @type {?} */ (initialStyleDeclarations[i]);
            // this flag value marks where the declarations end the initial values begin
            if (v === 1 /* VALUES_MODE */) {
                hasPassedDeclarations = true;
            }
            else {
                /** @type {?} */
                var prop = /** @type {?} */ (v);
                if (hasPassedDeclarations) {
                    /** @type {?} */
                    var value = /** @type {?} */ (initialStyleDeclarations[++i]);
                    initialStylingValues.push(value);
                    stylesLookup[prop] = initialStylingValues.length - 1;
                }
                else {
                    totalStyleDeclarations++;
                    stylesLookup[prop] = 0;
                }
            }
        }
    }
    // make where the class offsets begin
    context[4 /* ClassOffsetPosition */] = totalStyleDeclarations;
    /** @type {?} */
    var initialStaticClasses = onlyProcessSingleClasses ? [] : null;
    if (initialClassDeclarations) {
        /** @type {?} */
        var hasPassedDeclarations = false;
        for (var i = 0; i < initialClassDeclarations.length; i++) {
            /** @type {?} */
            var v = /** @type {?} */ (initialClassDeclarations[i]);
            // this flag value marks where the declarations end the initial values begin
            if (v === 1 /* VALUES_MODE */) {
                hasPassedDeclarations = true;
            }
            else {
                /** @type {?} */
                var className = /** @type {?} */ (v);
                if (hasPassedDeclarations) {
                    /** @type {?} */
                    var value = /** @type {?} */ (initialClassDeclarations[++i]);
                    initialStylingValues.push(value);
                    classesLookup[className] = initialStylingValues.length - 1;
                    initialStaticClasses && initialStaticClasses.push(className);
                }
                else {
                    classesLookup[className] = 0;
                }
            }
        }
    }
    /** @type {?} */
    var styleProps = Object.keys(stylesLookup);
    /** @type {?} */
    var classNames = Object.keys(classesLookup);
    /** @type {?} */
    var classNamesIndexStart = styleProps.length;
    /** @type {?} */
    var totalProps = styleProps.length + classNames.length;
    /** @type {?} */
    var maxLength = totalProps * 4 /* Size */ * 2 + 8 /* SingleStylesStartPosition */;
    // we need to fill the array from the start so that we can access
    // both the multi and the single array positions in the same loop block
    for (var i = 8 /* SingleStylesStartPosition */; i < maxLength; i++) {
        context.push(null);
    }
    /** @type {?} */
    var singleStart = 8 /* SingleStylesStartPosition */;
    /** @type {?} */
    var multiStart = totalProps * 4 /* Size */ + 8 /* SingleStylesStartPosition */;
    // fill single and multi-level styles
    for (var i = 0; i < totalProps; i++) {
        /** @type {?} */
        var isClassBased_1 = i >= classNamesIndexStart;
        /** @type {?} */
        var prop = isClassBased_1 ? classNames[i - classNamesIndexStart] : styleProps[i];
        /** @type {?} */
        var indexForInitial = isClassBased_1 ? classesLookup[prop] : stylesLookup[prop];
        /** @type {?} */
        var initialValue = initialStylingValues[indexForInitial];
        /** @type {?} */
        var indexForMulti = i * 4 /* Size */ + multiStart;
        /** @type {?} */
        var indexForSingle = i * 4 /* Size */ + singleStart;
        /** @type {?} */
        var initialFlag = prepareInitialFlag(prop, isClassBased_1, styleSanitizer || null);
        setFlag(context, indexForSingle, pointers(initialFlag, indexForInitial, indexForMulti));
        setProp(context, indexForSingle, prop);
        setValue(context, indexForSingle, null);
        setPlayerBuilderIndex(context, indexForSingle, 0);
        /** @type {?} */
        var flagForMulti = initialFlag | (initialValue !== null ? 1 /* Dirty */ : 0 /* None */);
        setFlag(context, indexForMulti, pointers(flagForMulti, indexForInitial, indexForSingle));
        setProp(context, indexForMulti, prop);
        setValue(context, indexForMulti, null);
        setPlayerBuilderIndex(context, indexForMulti, 0);
    }
    /** @type {?} */
    var masterFlag = pointers(0, 0, multiStart) |
        (onlyProcessSingleClasses ? 16 /* OnlyProcessSingleClasses */ : 0);
    setFlag(context, 3 /* MasterFlagPosition */, masterFlag);
    setContextDirty(context, initialStylingValues.length > 1);
    if (initialStaticClasses) {
        context[6 /* PreviousOrCachedMultiClassValue */] = initialStaticClasses.join(' ');
    }
    return context;
}
/**
 * Sets and resolves all `multi` styling on an `StylingContext` so that they can be
 * applied to the element once `renderStyleAndClassBindings` is called.
 *
 * All missing styles/class (any values that are not provided in the new `styles`
 * or `classes` params) will resolve to `null` within their respective positions
 * in the context.
 *
 * @param {?} context The styling context that will be updated with the
 *    newly provided style values.
 * @param {?} classesInput The key/value map of CSS class names that will be used for the update.
 * @param {?=} stylesInput The key/value map of CSS styles that will be used for the update.
 * @return {?}
 */
export function updateStylingMap(context, classesInput, stylesInput) {
    stylesInput = stylesInput || null;
    /** @type {?} */
    var element = /** @type {?} */ (((context[5 /* ElementPosition */])));
    /** @type {?} */
    var classesPlayerBuilder = classesInput instanceof BoundPlayerFactory ?
        new ClassAndStylePlayerBuilder(/** @type {?} */ (classesInput), element, 1 /* Class */) :
        null;
    /** @type {?} */
    var stylesPlayerBuilder = stylesInput instanceof BoundPlayerFactory ?
        new ClassAndStylePlayerBuilder(/** @type {?} */ (stylesInput), element, 2 /* Style */) :
        null;
    /** @type {?} */
    var classesValue = classesPlayerBuilder ? /** @type {?} */ (((/** @type {?} */ (classesInput)))).value :
        classesInput;
    /** @type {?} */
    var stylesValue = stylesPlayerBuilder ? stylesInput["value"] : stylesInput;
    /** @type {?} */
    var ignoreAllClassUpdates = limitToSingleClasses(context) || classesValue === NO_CHANGE ||
        classesValue === context[6 /* PreviousOrCachedMultiClassValue */];
    /** @type {?} */
    var ignoreAllStyleUpdates = stylesValue === NO_CHANGE || stylesValue === context[7 /* PreviousMultiStyleValue */];
    if (ignoreAllClassUpdates && ignoreAllStyleUpdates)
        return;
    context[6 /* PreviousOrCachedMultiClassValue */] = classesValue;
    context[7 /* PreviousMultiStyleValue */] = stylesValue;
    /** @type {?} */
    var classNames = EMPTY_ARR;
    /** @type {?} */
    var applyAllClasses = false;
    /** @type {?} */
    var playerBuildersAreDirty = false;
    /** @type {?} */
    var classesPlayerBuilderIndex = classesPlayerBuilder ? 1 /* ClassMapPlayerBuilderPosition */ : 0;
    if (hasPlayerBuilderChanged(context, classesPlayerBuilder, 1 /* ClassMapPlayerBuilderPosition */)) {
        setPlayerBuilder(context, classesPlayerBuilder, 1 /* ClassMapPlayerBuilderPosition */);
        playerBuildersAreDirty = true;
    }
    /** @type {?} */
    var stylesPlayerBuilderIndex = stylesPlayerBuilder ? 3 /* StyleMapPlayerBuilderPosition */ : 0;
    if (hasPlayerBuilderChanged(context, stylesPlayerBuilder, 3 /* StyleMapPlayerBuilderPosition */)) {
        setPlayerBuilder(context, stylesPlayerBuilder, 3 /* StyleMapPlayerBuilderPosition */);
        playerBuildersAreDirty = true;
    }
    // each time a string-based value pops up then it shouldn't require a deep
    // check of what's changed.
    if (!ignoreAllClassUpdates) {
        if (typeof classesValue == 'string') {
            classNames = classesValue.split(/\s+/);
            // this boolean is used to avoid having to create a key/value map of `true` values
            // since a classname string implies that all those classes are added
            applyAllClasses = true;
        }
        else {
            classNames = classesValue ? Object.keys(classesValue) : EMPTY_ARR;
        }
    }
    /** @type {?} */
    var classes = /** @type {?} */ ((classesValue || EMPTY_OBJ));
    /** @type {?} */
    var styleProps = stylesValue ? Object.keys(stylesValue) : EMPTY_ARR;
    /** @type {?} */
    var styles = stylesValue || EMPTY_OBJ;
    /** @type {?} */
    var classesStartIndex = styleProps.length;
    /** @type {?} */
    var multiStartIndex = getMultiStartIndex(context);
    /** @type {?} */
    var dirty = false;
    /** @type {?} */
    var ctxIndex = multiStartIndex;
    /** @type {?} */
    var propIndex = 0;
    /** @type {?} */
    var propLimit = styleProps.length + classNames.length;
    // the main loop here will try and figure out how the shape of the provided
    // styles differ with respect to the context. Later if the context/styles/classes
    // are off-balance then they will be dealt in another loop after this one
    while (ctxIndex < context.length && propIndex < propLimit) {
        /** @type {?} */
        var isClassBased_2 = propIndex >= classesStartIndex;
        /** @type {?} */
        var processValue = (!isClassBased_2 && !ignoreAllStyleUpdates) || (isClassBased_2 && !ignoreAllClassUpdates);
        // when there is a cache-hit for a string-based class then we should
        // avoid doing any work diffing any of the changes
        if (processValue) {
            /** @type {?} */
            var adjustedPropIndex = isClassBased_2 ? propIndex - classesStartIndex : propIndex;
            /** @type {?} */
            var newProp = isClassBased_2 ? classNames[adjustedPropIndex] : styleProps[adjustedPropIndex];
            /** @type {?} */
            var newValue = isClassBased_2 ? (applyAllClasses ? true : classes[newProp]) : styles[newProp];
            /** @type {?} */
            var playerBuilderIndex = isClassBased_2 ? classesPlayerBuilderIndex : stylesPlayerBuilderIndex;
            /** @type {?} */
            var prop = getProp(context, ctxIndex);
            if (prop === newProp) {
                /** @type {?} */
                var value = getValue(context, ctxIndex);
                /** @type {?} */
                var flag = getPointers(context, ctxIndex);
                setPlayerBuilderIndex(context, ctxIndex, playerBuilderIndex);
                if (hasValueChanged(flag, value, newValue)) {
                    setValue(context, ctxIndex, newValue);
                    playerBuildersAreDirty = playerBuildersAreDirty || !!playerBuilderIndex;
                    /** @type {?} */
                    var initialValue = getInitialValue(context, flag);
                    // there is no point in setting this to dirty if the previously
                    // rendered value was being referenced by the initial style (or null)
                    if (hasValueChanged(flag, initialValue, newValue)) {
                        setDirty(context, ctxIndex, true);
                        dirty = true;
                    }
                }
            }
            else {
                /** @type {?} */
                var indexOfEntry = findEntryPositionByProp(context, newProp, ctxIndex);
                if (indexOfEntry > 0) {
                    /** @type {?} */
                    var valueToCompare = getValue(context, indexOfEntry);
                    /** @type {?} */
                    var flagToCompare = getPointers(context, indexOfEntry);
                    swapMultiContextEntries(context, ctxIndex, indexOfEntry);
                    if (hasValueChanged(flagToCompare, valueToCompare, newValue)) {
                        /** @type {?} */
                        var initialValue = getInitialValue(context, flagToCompare);
                        setValue(context, ctxIndex, newValue);
                        if (hasValueChanged(flagToCompare, initialValue, newValue)) {
                            setDirty(context, ctxIndex, true);
                            playerBuildersAreDirty = playerBuildersAreDirty || !!playerBuilderIndex;
                            dirty = true;
                        }
                    }
                }
                else {
                    /** @type {?} */
                    var newFlag = prepareInitialFlag(newProp, isClassBased_2, getStyleSanitizer(context));
                    playerBuildersAreDirty = playerBuildersAreDirty || !!playerBuilderIndex;
                    insertNewMultiProperty(context, ctxIndex, isClassBased_2, newProp, newFlag, newValue, playerBuilderIndex);
                    dirty = true;
                }
            }
        }
        ctxIndex += 4 /* Size */;
        propIndex++;
    }
    // this means that there are left-over values in the context that
    // were not included in the provided styles/classes and in this
    // case the  goal is to "remove" them from the context (by nullifying)
    while (ctxIndex < context.length) {
        /** @type {?} */
        var flag = getPointers(context, ctxIndex);
        /** @type {?} */
        var isClassBased_3 = (flag & 2 /* Class */) === 2 /* Class */;
        /** @type {?} */
        var processValue = (!isClassBased_3 && !ignoreAllStyleUpdates) || (isClassBased_3 && !ignoreAllClassUpdates);
        if (processValue) {
            /** @type {?} */
            var value = getValue(context, ctxIndex);
            /** @type {?} */
            var doRemoveValue = valueExists(value, isClassBased_3);
            if (doRemoveValue) {
                setDirty(context, ctxIndex, true);
                setValue(context, ctxIndex, null);
                /** @type {?} */
                var playerBuilderIndex = isClassBased_3 ? classesPlayerBuilderIndex : stylesPlayerBuilderIndex;
                setPlayerBuilderIndex(context, ctxIndex, playerBuilderIndex);
                dirty = true;
            }
        }
        ctxIndex += 4 /* Size */;
    }
    /** @type {?} */
    var sanitizer = getStyleSanitizer(context);
    while (propIndex < propLimit) {
        /** @type {?} */
        var isClassBased_4 = propIndex >= classesStartIndex;
        /** @type {?} */
        var processValue = (!isClassBased_4 && !ignoreAllStyleUpdates) || (isClassBased_4 && !ignoreAllClassUpdates);
        if (processValue) {
            /** @type {?} */
            var adjustedPropIndex = isClassBased_4 ? propIndex - classesStartIndex : propIndex;
            /** @type {?} */
            var prop = isClassBased_4 ? classNames[adjustedPropIndex] : styleProps[adjustedPropIndex];
            /** @type {?} */
            var value = isClassBased_4 ? (applyAllClasses ? true : classes[prop]) : styles[prop];
            /** @type {?} */
            var flag = prepareInitialFlag(prop, isClassBased_4, sanitizer) | 1 /* Dirty */;
            /** @type {?} */
            var playerBuilderIndex = isClassBased_4 ? classesPlayerBuilderIndex : stylesPlayerBuilderIndex;
            context.push(flag, prop, value, playerBuilderIndex);
            dirty = true;
        }
        propIndex++;
    }
    if (dirty) {
        setContextDirty(context, true);
    }
    if (playerBuildersAreDirty) {
        setContextPlayersDirty(context, true);
    }
}
/**
 * Sets and resolves a single styling property/value on the provided `StylingContext` so
 * that they can be applied to the element once `renderStyleAndClassBindings` is called.
 *
 * Note that prop-level styling values are considered higher priority than any styling that
 * has been applied using `updateStylingMap`, therefore, when styling values are rendered
 * then any styles/classes that have been applied using this function will be considered first
 * (then multi values second and then initial values as a backup).
 *
 * @param {?} context The styling context that will be updated with the
 *    newly provided style value.
 * @param {?} index The index of the property which is being updated.
 * @param {?} input
 * @return {?}
 */
export function updateStyleProp(context, index, input) {
    /** @type {?} */
    var singleIndex = 8 /* SingleStylesStartPosition */ + index * 4 /* Size */;
    /** @type {?} */
    var currValue = getValue(context, singleIndex);
    /** @type {?} */
    var currFlag = getPointers(context, singleIndex);
    /** @type {?} */
    var value = (input instanceof BoundPlayerFactory) ? input.value : input;
    // didn't change ... nothing to make a note of
    if (hasValueChanged(currFlag, currValue, value)) {
        /** @type {?} */
        var isClassBased_5 = (currFlag & 2 /* Class */) === 2 /* Class */;
        /** @type {?} */
        var element = /** @type {?} */ (((context[5 /* ElementPosition */])));
        /** @type {?} */
        var playerBuilder = input instanceof BoundPlayerFactory ?
            new ClassAndStylePlayerBuilder(/** @type {?} */ (input), element, isClassBased_5 ? 1 /* Class */ : 2 /* Style */) :
            null;
        /** @type {?} */
        var value_1 = /** @type {?} */ ((playerBuilder ? (/** @type {?} */ (input)).value : input));
        /** @type {?} */
        var currPlayerIndex = getPlayerBuilderIndex(context, singleIndex);
        /** @type {?} */
        var playerBuildersAreDirty = false;
        /** @type {?} */
        var playerBuilderIndex = playerBuilder ? currPlayerIndex : 0;
        if (hasPlayerBuilderChanged(context, playerBuilder, currPlayerIndex)) {
            /** @type {?} */
            var newIndex = setPlayerBuilder(context, playerBuilder, currPlayerIndex);
            playerBuilderIndex = playerBuilder ? newIndex : 0;
            setPlayerBuilderIndex(context, singleIndex, playerBuilderIndex);
            playerBuildersAreDirty = true;
        }
        // the value will always get updated (even if the dirty flag is skipped)
        setValue(context, singleIndex, value_1);
        /** @type {?} */
        var indexForMulti = getMultiOrSingleIndex(currFlag);
        /** @type {?} */
        var valueForMulti = getValue(context, indexForMulti);
        if (!valueForMulti || hasValueChanged(currFlag, valueForMulti, value_1)) {
            /** @type {?} */
            var multiDirty = false;
            /** @type {?} */
            var singleDirty = true;
            // only when the value is set to `null` should the multi-value get flagged
            if (!valueExists(value_1, isClassBased_5) && valueExists(valueForMulti, isClassBased_5)) {
                multiDirty = true;
                singleDirty = false;
            }
            setDirty(context, indexForMulti, multiDirty);
            setDirty(context, singleIndex, singleDirty);
            setContextDirty(context, true);
        }
        if (playerBuildersAreDirty) {
            setContextPlayersDirty(context, true);
        }
    }
}
/**
 * This method will toggle the referenced CSS class (by the provided index)
 * within the given context.
 *
 * @param {?} context The styling context that will be updated with the
 *    newly provided class value.
 * @param {?} index The index of the CSS class which is being updated.
 * @param {?} addOrRemove Whether or not to add or remove the CSS class
 * @return {?}
 */
export function updateClassProp(context, index, addOrRemove) {
    /** @type {?} */
    var adjustedIndex = index + context[4 /* ClassOffsetPosition */];
    updateStyleProp(context, adjustedIndex, addOrRemove);
}
/**
 * Renders all queued styling using a renderer onto the given element.
 *
 * This function works by rendering any styles (that have been applied
 * using `updateStylingMap`) and any classes (that have been applied using
 * `updateStyleProp`) onto the provided element using the provided renderer.
 * Just before the styles/classes are rendered a final key/value style map
 * will be assembled (if `styleStore` or `classStore` are provided).
 *
 * @param {?} context The styling context that will be used to determine
 *      what styles will be rendered
 * @param {?} renderer the renderer that will be used to apply the styling
 * @param {?} rootOrView
 * @param {?} isFirstRender
 * @param {?=} classesStore if provided, the updated class values will be applied
 *    to this key/value map instead of being renderered via the renderer.
 * @param {?=} stylesStore if provided, the updated style values will be applied
 *    to this key/value map instead of being renderered via the renderer.
 * @return {?} number the total amount of players that got queued for animation (if any)
 */
export function renderStyleAndClassBindings(context, renderer, rootOrView, isFirstRender, classesStore, stylesStore) {
    /** @type {?} */
    var totalPlayersQueued = 0;
    if (isContextDirty(context)) {
        /** @type {?} */
        var flushPlayerBuilders = context[3 /* MasterFlagPosition */] & 8 /* PlayerBuildersDirty */;
        /** @type {?} */
        var native = /** @type {?} */ ((context[5 /* ElementPosition */]));
        /** @type {?} */
        var multiStartIndex = getMultiStartIndex(context);
        /** @type {?} */
        var styleSanitizer = getStyleSanitizer(context);
        /** @type {?} */
        var onlySingleClasses = limitToSingleClasses(context);
        for (var i = 8 /* SingleStylesStartPosition */; i < context.length; i += 4 /* Size */) {
            // there is no point in rendering styles that have not changed on screen
            if (isDirty(context, i)) {
                /** @type {?} */
                var prop = getProp(context, i);
                /** @type {?} */
                var value = getValue(context, i);
                /** @type {?} */
                var flag = getPointers(context, i);
                /** @type {?} */
                var playerBuilder = getPlayerBuilder(context, i);
                /** @type {?} */
                var isClassBased_6 = flag & 2 /* Class */ ? true : false;
                /** @type {?} */
                var isInSingleRegion = i < multiStartIndex;
                /** @type {?} */
                var readInitialValue = !isClassBased_6 || !onlySingleClasses;
                /** @type {?} */
                var valueToApply = value;
                // VALUE DEFER CASE 1: Use a multi value instead of a null single value
                // this check implies that a single value was removed and we
                // should now defer to a multi value and use that (if set).
                if (isInSingleRegion && !valueExists(valueToApply, isClassBased_6)) {
                    /** @type {?} */
                    var multiIndex = getMultiOrSingleIndex(flag);
                    valueToApply = getValue(context, multiIndex);
                }
                // VALUE DEFER CASE 2: Use the initial value if all else fails (is falsy)
                // the initial value will always be a string or null,
                // therefore we can safely adopt it incase there's nothing else
                // note that this should always be a falsy check since `false` is used
                // for both class and style comparisons (styles can't be false and false
                // classes are turned off and should therefore defer to their initial values)
                if (!valueExists(valueToApply, isClassBased_6) && readInitialValue) {
                    valueToApply = getInitialValue(context, flag);
                }
                /** @type {?} */
                var doApplyValue = isFirstRender ? valueToApply : true;
                if (doApplyValue) {
                    if (isClassBased_6) {
                        setClass(native, prop, valueToApply ? true : false, renderer, classesStore, playerBuilder);
                    }
                    else {
                        /** @type {?} */
                        var sanitizer = (flag & 4 /* Sanitize */) ? styleSanitizer : null;
                        setStyle(native, prop, /** @type {?} */ (valueToApply), renderer, sanitizer, stylesStore, playerBuilder);
                    }
                }
                setDirty(context, i, false);
            }
        }
        if (flushPlayerBuilders) {
            /** @type {?} */
            var rootContext = Array.isArray(rootOrView) ? getRootContext(rootOrView) : /** @type {?} */ (rootOrView);
            /** @type {?} */
            var playerContext = /** @type {?} */ ((getPlayerContext(context)));
            /** @type {?} */
            var playersStartIndex = playerContext[0 /* NonBuilderPlayersStart */];
            for (var i = 1 /* PlayerBuildersStartPosition */; i < playersStartIndex; i += 2 /* PlayerAndPlayerBuildersTupleSize */) {
                /** @type {?} */
                var builder = /** @type {?} */ (playerContext[i]);
                /** @type {?} */
                var playerInsertionIndex = i + 1 /* PlayerOffsetPosition */;
                /** @type {?} */
                var oldPlayer = /** @type {?} */ (playerContext[playerInsertionIndex]);
                if (builder) {
                    /** @type {?} */
                    var player = builder.buildPlayer(oldPlayer, isFirstRender);
                    if (player !== undefined) {
                        if (player != null) {
                            /** @type {?} */
                            var wasQueued = addPlayerInternal(playerContext, rootContext, /** @type {?} */ (native), player, playerInsertionIndex);
                            wasQueued && totalPlayersQueued++;
                        }
                        if (oldPlayer) {
                            oldPlayer.destroy();
                        }
                    }
                }
                else if (oldPlayer) {
                    // the player builder has been removed ... therefore we should delete the associated
                    // player
                    oldPlayer.destroy();
                }
            }
            setContextPlayersDirty(context, false);
        }
        setContextDirty(context, false);
    }
    return totalPlayersQueued;
}
/**
 * This function renders a given CSS prop/value entry using the
 * provided renderer. If a `store` value is provided then
 * that will be used a render context instead of the provided
 * renderer.
 *
 * @param {?} native the DOM Element
 * @param {?} prop the CSS style property that will be rendered
 * @param {?} value the CSS style value that will be rendered
 * @param {?} renderer
 * @param {?} sanitizer
 * @param {?=} store an optional key/value map that will be used as a context to render styles on
 * @param {?=} playerBuilder
 * @return {?}
 */
function setStyle(native, prop, value, renderer, sanitizer, store, playerBuilder) {
    value = sanitizer && value ? sanitizer(prop, value) : value;
    if (store || playerBuilder) {
        if (store) {
            store.setValue(prop, value);
        }
        if (playerBuilder) {
            playerBuilder.setValue(prop, value);
        }
    }
    else if (value) {
        ngDevMode && ngDevMode.rendererSetStyle++;
        isProceduralRenderer(renderer) ?
            renderer.setStyle(native, prop, value, RendererStyleFlags3.DashCase) :
            native['style'].setProperty(prop, value);
    }
    else {
        ngDevMode && ngDevMode.rendererRemoveStyle++;
        isProceduralRenderer(renderer) ?
            renderer.removeStyle(native, prop, RendererStyleFlags3.DashCase) :
            native['style'].removeProperty(prop);
    }
}
/**
 * This function renders a given CSS class value using the provided
 * renderer (by adding or removing it from the provided element).
 * If a `store` value is provided then that will be used a render
 * context instead of the provided renderer.
 *
 * @param {?} native the DOM Element
 * @param {?} className
 * @param {?} add
 * @param {?} renderer
 * @param {?=} store an optional key/value map that will be used as a context to render styles on
 * @param {?=} playerBuilder
 * @return {?}
 */
function setClass(native, className, add, renderer, store, playerBuilder) {
    if (store || playerBuilder) {
        if (store) {
            store.setValue(className, add);
        }
        if (playerBuilder) {
            playerBuilder.setValue(className, add);
        }
    }
    else if (add) {
        ngDevMode && ngDevMode.rendererAddClass++;
        isProceduralRenderer(renderer) ? renderer.addClass(native, className) :
            native['classList'].add(className);
    }
    else {
        ngDevMode && ngDevMode.rendererRemoveClass++;
        isProceduralRenderer(renderer) ? renderer.removeClass(native, className) :
            native['classList'].remove(className);
    }
}
/**
 * @param {?} context
 * @param {?} index
 * @param {?} isDirtyYes
 * @return {?}
 */
function setDirty(context, index, isDirtyYes) {
    /** @type {?} */
    var adjustedIndex = index >= 8 /* SingleStylesStartPosition */ ? (index + 0 /* FlagsOffset */) : index;
    if (isDirtyYes) {
        (/** @type {?} */ (context[adjustedIndex])) |= 1 /* Dirty */;
    }
    else {
        (/** @type {?} */ (context[adjustedIndex])) &= ~1 /* Dirty */;
    }
}
/**
 * @param {?} context
 * @param {?} index
 * @return {?}
 */
function isDirty(context, index) {
    /** @type {?} */
    var adjustedIndex = index >= 8 /* SingleStylesStartPosition */ ? (index + 0 /* FlagsOffset */) : index;
    return ((/** @type {?} */ (context[adjustedIndex])) & 1 /* Dirty */) == 1 /* Dirty */;
}
/**
 * @param {?} context
 * @param {?} index
 * @return {?}
 */
function isClassBased(context, index) {
    /** @type {?} */
    var adjustedIndex = index >= 8 /* SingleStylesStartPosition */ ? (index + 0 /* FlagsOffset */) : index;
    return ((/** @type {?} */ (context[adjustedIndex])) & 2 /* Class */) == 2 /* Class */;
}
/**
 * @param {?} context
 * @param {?} index
 * @return {?}
 */
function isSanitizable(context, index) {
    /** @type {?} */
    var adjustedIndex = index >= 8 /* SingleStylesStartPosition */ ? (index + 0 /* FlagsOffset */) : index;
    return ((/** @type {?} */ (context[adjustedIndex])) & 4 /* Sanitize */) == 4 /* Sanitize */;
}
/**
 * @param {?} configFlag
 * @param {?} staticIndex
 * @param {?} dynamicIndex
 * @return {?}
 */
function pointers(configFlag, staticIndex, dynamicIndex) {
    return (configFlag & 31 /* BitMask */) | (staticIndex << 5 /* BitCountSize */) |
        (dynamicIndex << (14 /* BitCountSize */ + 5 /* BitCountSize */));
}
/**
 * @param {?} context
 * @param {?} flag
 * @return {?}
 */
function getInitialValue(context, flag) {
    /** @type {?} */
    var index = getInitialIndex(flag);
    return /** @type {?} */ (context[2 /* InitialStylesPosition */][index]);
}
/**
 * @param {?} flag
 * @return {?}
 */
function getInitialIndex(flag) {
    return (flag >> 5 /* BitCountSize */) & 16383 /* BitMask */;
}
/**
 * @param {?} flag
 * @return {?}
 */
function getMultiOrSingleIndex(flag) {
    /** @type {?} */
    var index = (flag >> (14 /* BitCountSize */ + 5 /* BitCountSize */)) & 16383 /* BitMask */;
    return index >= 8 /* SingleStylesStartPosition */ ? index : -1;
}
/**
 * @param {?} context
 * @return {?}
 */
function getMultiStartIndex(context) {
    return /** @type {?} */ (getMultiOrSingleIndex(context[3 /* MasterFlagPosition */]));
}
/**
 * @param {?} context
 * @return {?}
 */
function getStyleSanitizer(context) {
    return context[1 /* StyleSanitizerPosition */];
}
/**
 * @param {?} context
 * @param {?} index
 * @param {?} prop
 * @return {?}
 */
function setProp(context, index, prop) {
    context[index + 1 /* PropertyOffset */] = prop;
}
/**
 * @param {?} context
 * @param {?} index
 * @param {?} value
 * @return {?}
 */
function setValue(context, index, value) {
    context[index + 2 /* ValueOffset */] = value;
}
/**
 * @param {?} context
 * @param {?} builder
 * @param {?} index
 * @return {?}
 */
function hasPlayerBuilderChanged(context, builder, index) {
    /** @type {?} */
    var playerContext = /** @type {?} */ ((context[0 /* PlayerContext */]));
    if (builder) {
        if (!playerContext || index === 0) {
            return true;
        }
    }
    else if (!playerContext) {
        return false;
    }
    return playerContext[index] !== builder;
}
/**
 * @param {?} context
 * @param {?} builder
 * @param {?} insertionIndex
 * @return {?}
 */
function setPlayerBuilder(context, builder, insertionIndex) {
    /** @type {?} */
    var playerContext = context[0 /* PlayerContext */] || allocPlayerContext(context);
    if (insertionIndex > 0) {
        playerContext[insertionIndex] = builder;
    }
    else {
        insertionIndex = playerContext[0 /* NonBuilderPlayersStart */];
        playerContext.splice(insertionIndex, 0, builder, null);
        playerContext[0 /* NonBuilderPlayersStart */] +=
            2 /* PlayerAndPlayerBuildersTupleSize */;
    }
    return insertionIndex;
}
/**
 * @param {?} context
 * @param {?} index
 * @param {?} playerBuilderIndex
 * @return {?}
 */
function setPlayerBuilderIndex(context, index, playerBuilderIndex) {
    context[index + 3 /* PlayerBuilderIndexOffset */] = playerBuilderIndex;
}
/**
 * @param {?} context
 * @param {?} index
 * @return {?}
 */
function getPlayerBuilderIndex(context, index) {
    return (/** @type {?} */ (context[index + 3 /* PlayerBuilderIndexOffset */])) || 0;
}
/**
 * @param {?} context
 * @param {?} index
 * @return {?}
 */
function getPlayerBuilder(context, index) {
    /** @type {?} */
    var playerBuilderIndex = getPlayerBuilderIndex(context, index);
    if (playerBuilderIndex) {
        /** @type {?} */
        var playerContext = context[0 /* PlayerContext */];
        if (playerContext) {
            return /** @type {?} */ (playerContext[playerBuilderIndex]);
        }
    }
    return null;
}
/**
 * @param {?} context
 * @param {?} index
 * @param {?} flag
 * @return {?}
 */
function setFlag(context, index, flag) {
    /** @type {?} */
    var adjustedIndex = index === 3 /* MasterFlagPosition */ ? index : (index + 0 /* FlagsOffset */);
    context[adjustedIndex] = flag;
}
/**
 * @param {?} context
 * @param {?} index
 * @return {?}
 */
function getPointers(context, index) {
    /** @type {?} */
    var adjustedIndex = index === 3 /* MasterFlagPosition */ ? index : (index + 0 /* FlagsOffset */);
    return /** @type {?} */ (context[adjustedIndex]);
}
/**
 * @param {?} context
 * @param {?} index
 * @return {?}
 */
function getValue(context, index) {
    return /** @type {?} */ (context[index + 2 /* ValueOffset */]);
}
/**
 * @param {?} context
 * @param {?} index
 * @return {?}
 */
function getProp(context, index) {
    return /** @type {?} */ (context[index + 1 /* PropertyOffset */]);
}
/**
 * @param {?} context
 * @return {?}
 */
export function isContextDirty(context) {
    return isDirty(context, 3 /* MasterFlagPosition */);
}
/**
 * @param {?} context
 * @return {?}
 */
export function limitToSingleClasses(context) {
    return context[3 /* MasterFlagPosition */] & 16 /* OnlyProcessSingleClasses */;
}
/**
 * @param {?} context
 * @param {?} isDirtyYes
 * @return {?}
 */
export function setContextDirty(context, isDirtyYes) {
    setDirty(context, 3 /* MasterFlagPosition */, isDirtyYes);
}
/**
 * @param {?} context
 * @param {?} isDirtyYes
 * @return {?}
 */
export function setContextPlayersDirty(context, isDirtyYes) {
    if (isDirtyYes) {
        (/** @type {?} */ (context[3 /* MasterFlagPosition */])) |= 8 /* PlayerBuildersDirty */;
    }
    else {
        (/** @type {?} */ (context[3 /* MasterFlagPosition */])) &= ~8 /* PlayerBuildersDirty */;
    }
}
/**
 * @param {?} context
 * @param {?} prop
 * @param {?=} startIndex
 * @return {?}
 */
function findEntryPositionByProp(context, prop, startIndex) {
    for (var i = (startIndex || 0) + 1 /* PropertyOffset */; i < context.length; i += 4 /* Size */) {
        /** @type {?} */
        var thisProp = context[i];
        if (thisProp == prop) {
            return i - 1 /* PropertyOffset */;
        }
    }
    return -1;
}
/**
 * @param {?} context
 * @param {?} indexA
 * @param {?} indexB
 * @return {?}
 */
function swapMultiContextEntries(context, indexA, indexB) {
    /** @type {?} */
    var tmpValue = getValue(context, indexA);
    /** @type {?} */
    var tmpProp = getProp(context, indexA);
    /** @type {?} */
    var tmpFlag = getPointers(context, indexA);
    /** @type {?} */
    var tmpPlayerBuilderIndex = getPlayerBuilderIndex(context, indexA);
    /** @type {?} */
    var flagA = tmpFlag;
    /** @type {?} */
    var flagB = getPointers(context, indexB);
    /** @type {?} */
    var singleIndexA = getMultiOrSingleIndex(flagA);
    if (singleIndexA >= 0) {
        /** @type {?} */
        var _flag = getPointers(context, singleIndexA);
        /** @type {?} */
        var _initial = getInitialIndex(_flag);
        setFlag(context, singleIndexA, pointers(_flag, _initial, indexB));
    }
    /** @type {?} */
    var singleIndexB = getMultiOrSingleIndex(flagB);
    if (singleIndexB >= 0) {
        /** @type {?} */
        var _flag = getPointers(context, singleIndexB);
        /** @type {?} */
        var _initial = getInitialIndex(_flag);
        setFlag(context, singleIndexB, pointers(_flag, _initial, indexA));
    }
    setValue(context, indexA, getValue(context, indexB));
    setProp(context, indexA, getProp(context, indexB));
    setFlag(context, indexA, getPointers(context, indexB));
    setPlayerBuilderIndex(context, indexA, getPlayerBuilderIndex(context, indexB));
    setValue(context, indexB, tmpValue);
    setProp(context, indexB, tmpProp);
    setFlag(context, indexB, tmpFlag);
    setPlayerBuilderIndex(context, indexB, tmpPlayerBuilderIndex);
}
/**
 * @param {?} context
 * @param {?} indexStartPosition
 * @return {?}
 */
function updateSinglePointerValues(context, indexStartPosition) {
    for (var i = indexStartPosition; i < context.length; i += 4 /* Size */) {
        /** @type {?} */
        var multiFlag = getPointers(context, i);
        /** @type {?} */
        var singleIndex = getMultiOrSingleIndex(multiFlag);
        if (singleIndex > 0) {
            /** @type {?} */
            var singleFlag = getPointers(context, singleIndex);
            /** @type {?} */
            var initialIndexForSingle = getInitialIndex(singleFlag);
            /** @type {?} */
            var flagValue = (isDirty(context, singleIndex) ? 1 /* Dirty */ : 0 /* None */) |
                (isClassBased(context, singleIndex) ? 2 /* Class */ : 0 /* None */) |
                (isSanitizable(context, singleIndex) ? 4 /* Sanitize */ : 0 /* None */);
            /** @type {?} */
            var updatedFlag = pointers(flagValue, initialIndexForSingle, i);
            setFlag(context, singleIndex, updatedFlag);
        }
    }
}
/**
 * @param {?} context
 * @param {?} index
 * @param {?} classBased
 * @param {?} name
 * @param {?} flag
 * @param {?} value
 * @param {?} playerIndex
 * @return {?}
 */
function insertNewMultiProperty(context, index, classBased, name, flag, value, playerIndex) {
    /** @type {?} */
    var doShift = index < context.length;
    // prop does not exist in the list, add it in
    context.splice(index, 0, flag | 1 /* Dirty */ | (classBased ? 2 /* Class */ : 0 /* None */), name, value, playerIndex);
    if (doShift) {
        // because the value was inserted midway into the array then we
        // need to update all the shifted multi values' single value
        // pointers to point to the newly shifted location
        updateSinglePointerValues(context, index + 4 /* Size */);
    }
}
/**
 * @param {?} value
 * @param {?=} isClassBased
 * @return {?}
 */
function valueExists(value, isClassBased) {
    if (isClassBased) {
        return value ? true : false;
    }
    return value !== null;
}
/**
 * @param {?} name
 * @param {?} isClassBased
 * @param {?=} sanitizer
 * @return {?}
 */
function prepareInitialFlag(name, isClassBased, sanitizer) {
    if (isClassBased) {
        return 2 /* Class */;
    }
    else if (sanitizer && sanitizer(name)) {
        return 4 /* Sanitize */;
    }
    return 0 /* None */;
}
/**
 * @param {?} flag
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function hasValueChanged(flag, a, b) {
    /** @type {?} */
    var isClassBased = flag & 2 /* Class */;
    /** @type {?} */
    var hasValues = a && b;
    /** @type {?} */
    var usesSanitizer = flag & 4 /* Sanitize */;
    // the toString() comparison ensures that a value is checked
    // ... otherwise (during sanitization bypassing) the === comparsion
    // would fail since a new String() instance is created
    if (!isClassBased && hasValues && usesSanitizer) {
        // we know for sure we're dealing with strings at this point
        return (/** @type {?} */ (a)).toString() !== (/** @type {?} */ (b)).toString();
    }
    // everything else is safe to check with a normal equality check
    return a !== b;
}
/**
 * @template T
 */
var /**
 * @template T
 */
ClassAndStylePlayerBuilder = /** @class */ (function () {
    function ClassAndStylePlayerBuilder(factory, _element, _type) {
        this._element = _element;
        this._type = _type;
        this._values = {};
        this._dirty = false;
        this._factory = /** @type {?} */ (factory);
    }
    /**
     * @param {?} prop
     * @param {?} value
     * @return {?}
     */
    ClassAndStylePlayerBuilder.prototype.setValue = /**
     * @param {?} prop
     * @param {?} value
     * @return {?}
     */
    function (prop, value) {
        if (this._values[prop] !== value) {
            this._values[prop] = value;
            this._dirty = true;
        }
    };
    /**
     * @param {?} currentPlayer
     * @param {?} isFirstRender
     * @return {?}
     */
    ClassAndStylePlayerBuilder.prototype.buildPlayer = /**
     * @param {?} currentPlayer
     * @param {?} isFirstRender
     * @return {?}
     */
    function (currentPlayer, isFirstRender) {
        // if no values have been set here then this means the binding didn't
        // change and therefore the binding values were not updated through
        // `setValue` which means no new player will be provided.
        if (this._dirty) {
            /** @type {?} */
            var player = this._factory.fn(this._element, this._type, /** @type {?} */ ((this._values)), isFirstRender, currentPlayer || null);
            this._values = {};
            this._dirty = false;
            return player;
        }
        return undefined;
    };
    return ClassAndStylePlayerBuilder;
}());
/**
 * @template T
 */
export { ClassAndStylePlayerBuilder };
if (false) {
    /** @type {?} */
    ClassAndStylePlayerBuilder.prototype._values;
    /** @type {?} */
    ClassAndStylePlayerBuilder.prototype._dirty;
    /** @type {?} */
    ClassAndStylePlayerBuilder.prototype._factory;
    /** @type {?} */
    ClassAndStylePlayerBuilder.prototype._element;
    /** @type {?} */
    ClassAndStylePlayerBuilder.prototype._type;
}
//# sourceMappingURL=class_and_style_bindings.js.map
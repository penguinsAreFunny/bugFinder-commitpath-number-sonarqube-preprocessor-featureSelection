"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullFilterPreprocessor = void 0;
var bugfinder_framework_1 = require("bugfinder-framework");
var inversify_1 = require("inversify");
var TYPES_1 = require("./TYPES");
var bugfinder_commitpath_quantifier_sonarqube_1 = require("bugfinder-commitpath-quantifier-sonarqube");
var underscore_1 = __importDefault(require("underscore"));
var NullFilterPreprocessor = /** @class */ (function () {
    function NullFilterPreprocessor() {
    }
    NullFilterPreprocessor.prototype.preprocess = function (quantifications, annotations) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var data, target, keys, featureNames, targetNames, dataset;
            return __generator(this, function (_d) {
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info("Preprocessing quantifications and annotations. Generating dataset...");
                data = [];
                target = [];
                keys = [];
                featureNames = [];
                targetNames = [];
                // @formatter:on
                // setting feature names
                this.setFeatureNames(featureNames);
                (_b = this.logger) === null || _b === void 0 ? void 0 : _b.info("FeatureNames set. Got " + featureNames.length + " feature names.");
                // setting target names
                targetNames.push("Fixes");
                (_c = this.logger) === null || _c === void 0 ? void 0 : _c.info("TargetNames set. Got " + targetNames.length + " target names.");
                // setting data and target
                this.setDataAndTarget(quantifications, annotations, data, target, keys);
                // transforming infinity and -infinity values needed for DB as JSON saves infinity as null
                this.transformInfinityValues(data);
                this.transformInfinityValues(target);
                // validate calculated data and target
                this.validate(data, target, featureNames);
                dataset = new bugfinder_framework_1.DatasetAP(data, target, keys, featureNames, targetNames, this.description, this.traceAP);
                return [2 /*return*/, dataset];
            });
        });
    };
    NullFilterPreprocessor.prototype.transformInfinityValues = function (array2d) {
        for (var x = 0; x < array2d.length; x++) {
            var array = array2d[x];
            for (var y = 0; y < array.length; y++) {
                var val = array[y];
                if (val == Infinity) {
                    array2d[x][y] = Number.MAX_SAFE_INTEGER;
                }
                else if (val == -Infinity) {
                    array2d[x][y] = Number.MIN_SAFE_INTEGER;
                }
            }
        }
    };
    NullFilterPreprocessor.prototype.setFeatureNames = function (featureNames) {
        var e_1, _a;
        var ignoreFeaturesMap = new Map();
        if (this.ignoreFeatures) {
            try {
                for (var _b = __values(this.ignoreFeatures), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var ignore = _c.value;
                    ignoreFeaturesMap.set(ignore, true);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        // setting feature names
        // @formatter:off
        this.pushFeatureNames(featureNames, "minVal", ignoreFeaturesMap);
        this.pushFeatureNames(featureNames, "maxVal", ignoreFeaturesMap);
        this.pushFeatureNames(featureNames, "meanVal", ignoreFeaturesMap);
        this.pushFeatureNames(featureNames, "minDiff", ignoreFeaturesMap);
        this.pushFeatureNames(featureNames, "maxDiff", ignoreFeaturesMap);
        this.pushFeatureNames(featureNames, "meanDiff", ignoreFeaturesMap);
        this.pushFeatureNames(featureNames, "minRelDiff", ignoreFeaturesMap);
        this.pushFeatureNames(featureNames, "maxRelDiff", ignoreFeaturesMap);
        this.pushFeatureNames(featureNames, "meanRelDiff", ignoreFeaturesMap);
        // @formatter:on
    };
    NullFilterPreprocessor.prototype.setDataAndTarget = function (quantifications, annotations, data, target, keys) {
        var e_2, _a;
        var _this = this;
        var _b, _c, _d;
        // @formatter:off
        var minValMap = new Map();
        var maxValMap = new Map();
        var meanValMap = new Map();
        var minDiffMap = new Map();
        var maxDiffMap = new Map();
        var meanDiffMap = new Map();
        var minRelDiffMap = new Map();
        var maxRelDiffMap = new Map();
        var meanRelDiffMap = new Map();
        // @formatter:on
        if (this.ignoreFeatures) {
            try {
                for (var _e = __values(this.ignoreFeatures), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var ignore = _f.value;
                    if (ignore.startsWith("minVal")) {
                        minValMap.set(this.sliceBeginLowerCase(ignore, 6), true);
                    }
                    else if (ignore.startsWith("maxVal")) {
                        maxValMap.set(this.sliceBeginLowerCase(ignore, 6), true);
                    }
                    else if (ignore.startsWith("meanVal")) {
                        meanValMap.set(this.sliceBeginLowerCase(ignore, 7), true);
                    }
                    else if (ignore.startsWith("minDiff")) {
                        minDiffMap.set(this.sliceBeginLowerCase(ignore, 7), true);
                    }
                    else if (ignore.startsWith("maxDiff")) {
                        maxDiffMap.set(this.sliceBeginLowerCase(ignore, 7), true);
                    }
                    else if (ignore.startsWith("meanDiff")) {
                        meanDiffMap.set(this.sliceBeginLowerCase(ignore, 8), true);
                    }
                    else if (ignore.startsWith("minRelDiff")) {
                        minRelDiffMap.set(this.sliceBeginLowerCase(ignore, 10), true);
                    }
                    else if (ignore.startsWith("maxRelDiff")) {
                        maxRelDiffMap.set(this.sliceBeginLowerCase(ignore, 10), true);
                    }
                    else if (ignore.startsWith("meanRelDiff")) {
                        meanRelDiffMap.set(this.sliceBeginLowerCase(ignore, 11), true);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        // setting data values and target values
        (_b = this.logger) === null || _b === void 0 ? void 0 : _b.info("Setting data and target arrays...");
        quantifications.toArray().forEach(function (el) {
            if (el.val == null)
                return;
            if (_this.ignorePath(el.key.path.path)) {
                return;
            }
            // setting target
            var annotation = annotations.getVal(el.key);
            if (annotation == null)
                return;
            target.push([annotation]);
            // setting data
            var feature = [];
            // @formatter:off
            _this.pushToFeature(feature, el.val.minVal, minValMap);
            _this.pushToFeature(feature, el.val.maxVal, maxValMap);
            _this.pushToFeature(feature, el.val.meanVal, meanValMap);
            _this.pushToFeature(feature, el.val.minDiff, minDiffMap);
            _this.pushToFeature(feature, el.val.maxDiff, maxDiffMap);
            _this.pushToFeature(feature, el.val.meanDiff, meanDiffMap);
            _this.pushToFeature(feature, el.val.minRelDiff, minRelDiffMap);
            _this.pushToFeature(feature, el.val.maxRelDiff, maxRelDiffMap);
            _this.pushToFeature(feature, el.val.meanRelDiff, meanRelDiffMap);
            // @formatter:on
            data.push(feature);
            // setting key
            keys.push(el.key.key());
        });
        (_c = this.logger) === null || _c === void 0 ? void 0 : _c.info("Got " + data.length + " samples. Feature dimension: " + ((_d = data[0]) === null || _d === void 0 ? void 0 : _d.length));
    };
    /**
     * Tests whether path should be ignored.
     * @param path
     * @private
     */
    NullFilterPreprocessor.prototype.ignorePath = function (path) {
        var e_3, _a;
        try {
            for (var _b = __values(this.ignorePaths), _c = _b.next(); !_c.done; _c = _b.next()) {
                var ignore = _c.value;
                if (ignore.test(path)) {
                    return true;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return false;
    };
    /**
     * Validates data and target array.
     * Logs if target and data do not have same size.
     * Logs if samples have null values.
     * Logs if different feature arrays do not have same size.
     * Logs if samples have Number.MAX_SAFE_INTEGER / MIN_SAFE_INTEGER alias transformed +/- infinity values.
     * @param data
     * @param target
     * @param featureNames
     * @private
     */
    NullFilterPreprocessor.prototype.validate = function (data, target, featureNames) {
        var e_4, _a, e_5, _b, e_6, _c, e_7, _d, e_8, _e;
        var _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        // check if target and feature array has same # samples | should not happen though
        if (data.length != target.length) {
            (_f = this.logger) === null || _f === void 0 ? void 0 : _f.error("Found " + data.length + " feature samples but " + target.length + " target samples." +
                "This must be an error as both need to have same size!");
        }
        // check if each sample always has the same dimension
        var featureDim = data[0].length;
        try {
            for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                var feature = data_1_1.value;
                if (feature.length != featureDim) {
                    (_g = this.logger) === null || _g === void 0 ? void 0 : _g.error("Feature dimension is not constant in all samples!");
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        // check if each target always has the same dimension
        var targetDim = target[0].length;
        try {
            for (var target_1 = __values(target), target_1_1 = target_1.next(); !target_1_1.done; target_1_1 = target_1.next()) {
                var annotation = target_1_1.value;
                if (annotation.length != targetDim) {
                    (_h = this.logger) === null || _h === void 0 ? void 0 : _h.error("Target dimension is not constant in all samples!");
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (target_1_1 && !target_1_1.done && (_b = target_1.return)) _b.call(target_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
        // null values found in dimensions
        var nullDimensions = new Map();
        var nullIdxes = [];
        try {
            for (var data_2 = __values(data), data_2_1 = data_2.next(); !data_2_1.done; data_2_1 = data_2.next()) {
                var feature = data_2_1.value;
                for (var i = 0; i < feature.length; i++) {
                    if (feature[i] == null) {
                        nullDimensions.set(i, true);
                        nullIdxes.push(i);
                    }
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (data_2_1 && !data_2_1.done && (_c = data_2.return)) _c.call(data_2);
            }
            finally { if (e_6) throw e_6.error; }
        }
        var nullDims = [];
        nullDimensions.forEach(function (val, key) {
            nullDims.push(key);
        });
        // filter samples with null values?
        var nullSamples = [];
        for (var i = 0; i < data.length; i++) {
            var feature = data[i];
            try {
                for (var feature_1 = (e_7 = void 0, __values(feature)), feature_1_1 = feature_1.next(); !feature_1_1.done; feature_1_1 = feature_1.next()) {
                    var val = feature_1_1.value;
                    if (val == null) {
                        nullSamples.push(i);
                        break;
                    }
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (feature_1_1 && !feature_1_1.done && (_d = feature_1.return)) _d.call(feature_1);
                }
                finally { if (e_7) throw e_7.error; }
            }
        }
        var countBy = underscore_1.default.countBy(nullIdxes, function (el) {
            return el;
        });
        var keyCount = [];
        for (var key in countBy) {
            keyCount.push({ key: featureNames[key], numSamples: countBy[key] });
        }
        if (keyCount.length == 0) {
            (_j = this.logger) === null || _j === void 0 ? void 0 : _j.info("Found 0 samples with null values in feature");
        }
        else {
            (_k = this.logger) === null || _k === void 0 ? void 0 : _k.info("Found #samples with null values in feature: ", keyCount);
            (_l = this.logger) === null || _l === void 0 ? void 0 : _l.info("If you would like to set ignoreFeatures add the following array to your" +
                " ignoreFeature injection", keyCount.map(function (el) {
                return el.key;
            }));
        }
        (_m = this.logger) === null || _m === void 0 ? void 0 : _m.info(keyCount.length + " of " + featureNames.length + " feature dimensions contain" +
            " null values.");
        if (nullSamples.length > 0)
            (_o = this.logger) === null || _o === void 0 ? void 0 : _o.warn(nullSamples.length + " of " + data.length + " samples have null values.", nullSamples);
        // check features for +/-infinity values (transformed: Number.MAX_SAFE_INTEGER / MIN_SAFE_INTEGER
        var infinityIdxes = new Map();
        var samplesWithInfinity = 0;
        try {
            for (var data_3 = __values(data), data_3_1 = data_3.next(); !data_3_1.done; data_3_1 = data_3.next()) {
                var feature = data_3_1.value;
                var samplesHasInfinity = false;
                for (var i = 0; i < feature.length; i++) {
                    if (feature[i] == Number.MAX_SAFE_INTEGER || feature[i] == Number.MIN_SAFE_INTEGER) {
                        infinityIdxes.set(i, true);
                        if (!samplesHasInfinity) {
                            samplesWithInfinity++;
                            samplesHasInfinity = true;
                        }
                    }
                }
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (data_3_1 && !data_3_1.done && (_e = data_3.return)) _e.call(data_3);
            }
            finally { if (e_8) throw e_8.error; }
        }
        var infinityFeatures = [];
        infinityIdxes.forEach(function (val, key) {
            infinityFeatures.push(featureNames[key]);
        });
        (_p = this.logger) === null || _p === void 0 ? void 0 : _p.info("Found " + samplesWithInfinity + " samples with +/- infinity values");
        (_q = this.logger) === null || _q === void 0 ? void 0 : _q.info(infinityFeatures.length + " out of " + featureNames.length + " features contain " +
            "+/- infinity values");
        if (infinityFeatures.length > 0)
            (_r = this.logger) === null || _r === void 0 ? void 0 : _r.info("If you would like to set ignoreFeatures to filter +/- infinity values" +
                " add the following array to your ignoreFeature injection", infinityFeatures);
    };
    /**
     * Pushes values of all keys in SonarQubeMeasures into feature-array
     * @param feature
     * @param data
     * @param ignoreFeatureMap Map of names stored in Measure of a key in SonarQubeMeasures.
     * f.e.: "min_val_classes" -> true
     * @private
     */
    NullFilterPreprocessor.prototype.pushToFeature = function (feature, data, ignoreFeatureMap) {
        var dummy = new bugfinder_commitpath_quantifier_sonarqube_1.SonarQubeMeasures();
        for (var prop in dummy) {
            if (ignoreFeatureMap.get(prop)) {
                continue;
            }
            var val = data[prop].value == null ? null : data[prop].value;
            feature.push(val);
        }
    };
    NullFilterPreprocessor.prototype.pushFeatureNames = function (featureNames, prefix, ignoreMap) {
        var dummy = new bugfinder_commitpath_quantifier_sonarqube_1.SonarQubeMeasures();
        for (var property in dummy) {
            var name_1 = prefix + property.charAt(0).toUpperCase() + property.slice(1);
            if (ignoreMap.get(name_1))
                continue;
            featureNames.push(prefix + property.charAt(0).toUpperCase() + property.slice(1));
        }
    };
    NullFilterPreprocessor.prototype.sliceBeginLowerCase = function (string, start) {
        var slice = string.slice(start);
        return slice[0].toLowerCase() + slice.slice(1);
    };
    __decorate([
        (0, inversify_1.optional)(),
        (0, inversify_1.inject)(bugfinder_framework_1.SHARED_TYPES.logger),
        __metadata("design:type", Object)
    ], NullFilterPreprocessor.prototype, "logger", void 0);
    __decorate([
        (0, inversify_1.inject)(TYPES_1.BUGFINDER_COMMITPATH_PREDECESSORS_PREPROCESSOR_NULLFILTER_TYPES.traceAP),
        __metadata("design:type", Object)
    ], NullFilterPreprocessor.prototype, "traceAP", void 0);
    __decorate([
        (0, inversify_1.inject)(TYPES_1.BUGFINDER_COMMITPATH_PREDECESSORS_PREPROCESSOR_NULLFILTER_TYPES.description),
        __metadata("design:type", String)
    ], NullFilterPreprocessor.prototype, "description", void 0);
    __decorate([
        (0, inversify_1.optional)(),
        (0, inversify_1.inject)(TYPES_1.BUGFINDER_COMMITPATH_PREDECESSORS_PREPROCESSOR_NULLFILTER_TYPES.ignoreFeatures),
        __metadata("design:type", Array)
    ], NullFilterPreprocessor.prototype, "ignoreFeatures", void 0);
    __decorate([
        (0, inversify_1.optional)(),
        (0, inversify_1.inject)(TYPES_1.BUGFINDER_COMMITPATH_PREDECESSORS_PREPROCESSOR_NULLFILTER_TYPES.ignorePaths),
        __metadata("design:type", Array)
    ], NullFilterPreprocessor.prototype, "ignorePaths", void 0);
    NullFilterPreprocessor = __decorate([
        (0, inversify_1.injectable)()
    ], NullFilterPreprocessor);
    return NullFilterPreprocessor;
}());
exports.NullFilterPreprocessor = NullFilterPreprocessor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTnVsbEZpbHRlclByZXByb2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9OdWxsRmlsdGVyUHJlcHJvY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkRBQWdHO0FBRWhHLHVDQUF1RDtBQUN2RCxpQ0FBd0Y7QUFFeEYsdUdBQTRFO0FBRTVFLDBEQUEwQjtBQUcxQjtJQUFBO0lBb1VBLENBQUM7SUFuVFMsMkNBQVUsR0FBaEIsVUFBaUIsZUFBeUUsRUFDekUsV0FBNEM7Ozs7O2dCQUN6RCxNQUFBLElBQUksQ0FBQyxNQUFNLDBDQUFFLElBQUksQ0FBQyxzRUFBc0UsQ0FBQyxDQUFBO2dCQUVuRixJQUFJLEdBQTRCLEVBQUUsQ0FBQTtnQkFDbEMsTUFBTSxHQUEwQixFQUFFLENBQUE7Z0JBQ2xDLElBQUksR0FBNEIsRUFBRSxDQUFBO2dCQUNsQyxZQUFZLEdBQW9CLEVBQUUsQ0FBQTtnQkFDbEMsV0FBVyxHQUFxQixFQUFFLENBQUE7Z0JBQ3hDLGdCQUFnQjtnQkFFaEIsd0JBQXdCO2dCQUN4QixJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFBO2dCQUNsQyxNQUFBLElBQUksQ0FBQyxNQUFNLDBDQUFFLElBQUksQ0FBQywyQkFBeUIsWUFBWSxDQUFDLE1BQU0sb0JBQWlCLENBQUMsQ0FBQTtnQkFFaEYsdUJBQXVCO2dCQUN2QixXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO2dCQUN6QixNQUFBLElBQUksQ0FBQyxNQUFNLDBDQUFFLElBQUksQ0FBQywwQkFBd0IsV0FBVyxDQUFDLE1BQU0sbUJBQWdCLENBQUMsQ0FBQTtnQkFFN0UsMEJBQTBCO2dCQUMxQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFF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
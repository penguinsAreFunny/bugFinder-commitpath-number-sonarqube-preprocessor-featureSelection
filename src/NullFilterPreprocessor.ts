import {Dataset, LocalityMap, Preprocessor, SHARED_TYPES, TraceAP} from "bugfinder-framework";
import {CommitPath} from "bugfinder-localityrecorder-commitpath";
import {inject, injectable, optional} from "inversify";
import {BUGFINDER_COMMITPATH_PREDECESSORS_PREPROCESSOR_NULLFILTER_TYPES} from "./TYPES";
import {SonarQubePredecessorMeasurement} from "bugfinder-commitpath-quantifier-sonarqubepredecessors";
import {SonarQubeMeasures} from "bugfinder-commitpath-quantifier-sonarqube";
import {Logger} from "ts-log";
import _ from "underscore"

@injectable()
export class NullFilterPreprocessor implements Preprocessor<CommitPath, number, SonarQubePredecessorMeasurement> {

    @optional() @inject(SHARED_TYPES.logger)
    logger?: Logger

    @inject(BUGFINDER_COMMITPATH_PREDECESSORS_PREPROCESSOR_NULLFILTER_TYPES.traceAP)
    traceAP: TraceAP

    @inject(BUGFINDER_COMMITPATH_PREDECESSORS_PREPROCESSOR_NULLFILTER_TYPES.description)
    description: string

    @optional() @inject(BUGFINDER_COMMITPATH_PREDECESSORS_PREPROCESSOR_NULLFILTER_TYPES.ignoreFeatures)
    ignoreFeatures?: string[]

    @optional() @inject(BUGFINDER_COMMITPATH_PREDECESSORS_PREPROCESSOR_NULLFILTER_TYPES.ignorePaths)
    ignorePaths?: RegExp[]

    async preprocess(quantifications: LocalityMap<CommitPath, SonarQubePredecessorMeasurement>,
                     annotations: LocalityMap<CommitPath, number>): Promise<Dataset> {
        this.logger?.info("Preprocessing quantifications and annotations. Generating dataset...")
        // @formatter:off
        const data        : Array<number[]> = []
        const target      : Array<number[]> = []
        const keys        : string[]        = []
        const featureNames: string[]        = []
        const targetNames : string[]        = []
        // @formatter:on

        // setting feature names
        this.setFeatureNames(featureNames)
        this.logger?.info(`FeatureNames set. Got ${featureNames.length} feature names.`)

        // setting target names
        targetNames.push("Fixes")
        this.logger?.info(`TargetNames set. Got ${targetNames.length} target names.`)

        // setting data and target
        this.setDataAndTarget(quantifications, annotations, data, target, keys)

        // transforming infinity and -infinity values needed for DB as JSON saves infinity as null
        this.transformInfinityValues(data)
        this.transformInfinityValues(target)

        // validate calculated data and target
        this.validate(data, target, featureNames)

        const dataset = new Dataset(data, target, keys, featureNames, targetNames, this.description, this.traceAP)
        return dataset
    }

    private transformInfinityValues(array2d: Array<number[]>) {
        for (let x = 0; x < array2d.length; x++) {
            const array = array2d[x]

            for (let y = 0; y < array.length; y++) {
                const val = array[y]
                if (val == Infinity) {
                    array2d[x][y] = Number.MAX_SAFE_INTEGER
                } else if (val == -Infinity) {
                    array2d[x][y] = Number.MIN_SAFE_INTEGER
                }
            }
        }
    }

    private setFeatureNames(featureNames: string[]) {
        const ignoreFeaturesMap = new Map<string, boolean>()
        if (this.ignoreFeatures) {
            for (const ignore of this.ignoreFeatures) {
                ignoreFeaturesMap.set(ignore, true)
            }
        }

        // setting feature names
        // @formatter:off
        this.pushFeatureNames(featureNames, "minVal"     , ignoreFeaturesMap)
        this.pushFeatureNames(featureNames, "maxVal"     , ignoreFeaturesMap)
        this.pushFeatureNames(featureNames, "meanVal"    , ignoreFeaturesMap)
        this.pushFeatureNames(featureNames, "minDiff"    , ignoreFeaturesMap)
        this.pushFeatureNames(featureNames, "maxDiff"    , ignoreFeaturesMap)
        this.pushFeatureNames(featureNames, "meanDiff"   , ignoreFeaturesMap)
        this.pushFeatureNames(featureNames, "minRelDiff" , ignoreFeaturesMap)
        this.pushFeatureNames(featureNames, "maxRelDiff" , ignoreFeaturesMap)
        this.pushFeatureNames(featureNames, "meanRelDiff", ignoreFeaturesMap)
        // @formatter:on
    }

    private setDataAndTarget(quantifications: LocalityMap<CommitPath, SonarQubePredecessorMeasurement>,
                             annotations: LocalityMap<CommitPath, number>,
                             data: Array<number[]>, target: Array<number[]>, keys: string[]) {
        // @formatter:off
        const minValMap         = new Map<string, boolean>()
        const maxValMap         = new Map<string, boolean>()
        const meanValMap        = new Map<string, boolean>()
        const minDiffMap        = new Map<string, boolean>()
        const maxDiffMap        = new Map<string, boolean>()
        const meanDiffMap       = new Map<string, boolean>()
        const minRelDiffMap     = new Map<string, boolean>()
        const maxRelDiffMap     = new Map<string, boolean>()
        const meanRelDiffMap    = new Map<string, boolean>()
        // @formatter:on

        if (this.ignoreFeatures) {
            for (const ignore of this.ignoreFeatures) {

                if (ignore.startsWith("minVal")) {
                    minValMap.set(this.sliceBeginLowerCase(ignore, 6), true)
                } else if (ignore.startsWith("maxVal")) {
                    maxValMap.set(this.sliceBeginLowerCase(ignore, 6), true)
                } else if (ignore.startsWith("meanVal")) {
                    meanValMap.set(this.sliceBeginLowerCase(ignore, 7), true)
                } else if (ignore.startsWith("minDiff")) {
                    minDiffMap.set(this.sliceBeginLowerCase(ignore, 7), true)
                } else if (ignore.startsWith("maxDiff")) {
                    maxDiffMap.set(this.sliceBeginLowerCase(ignore, 7), true)
                } else if (ignore.startsWith("meanDiff")) {
                    meanDiffMap.set(this.sliceBeginLowerCase(ignore, 8), true)
                } else if (ignore.startsWith("minRelDiff")) {
                    minRelDiffMap.set(this.sliceBeginLowerCase(ignore, 10), true)
                } else if (ignore.startsWith("maxRelDiff")) {
                    maxRelDiffMap.set(this.sliceBeginLowerCase(ignore, 10), true)
                } else if (ignore.startsWith("meanRelDiff")) {
                    meanRelDiffMap.set(this.sliceBeginLowerCase(ignore, 11), true)
                }

            }
        }

        // setting data values and target values
        this.logger?.info(`Setting data and target arrays...`)
        quantifications.toArray().forEach(el => {
            if (el.val == null) return
            if (this.ignorePath(el.key.path.path)) {
                return
            }

            // setting target
            const annotation = annotations.getVal(el.key)
            if (annotation == null) return
            target.push([annotation])

            // setting data
            const feature = []
            // @formatter:off
            this.pushToFeature(feature, el.val.minVal     , minValMap)
            this.pushToFeature(feature, el.val.maxVal     , maxValMap)
            this.pushToFeature(feature, el.val.meanVal    , meanValMap)
            this.pushToFeature(feature, el.val.minDiff    , minDiffMap)
            this.pushToFeature(feature, el.val.maxDiff    , maxDiffMap)
            this.pushToFeature(feature, el.val.meanDiff   , meanDiffMap)
            this.pushToFeature(feature, el.val.minRelDiff , minRelDiffMap)
            this.pushToFeature(feature, el.val.maxRelDiff , maxRelDiffMap)
            this.pushToFeature(feature, el.val.meanRelDiff, meanRelDiffMap)
            // @formatter:on
            data.push(feature)

            // setting key
            keys.push(el.key.key())

        })
        this.logger?.info(`Got ${data.length} samples. Feature dimension: ${data[0]?.length}`)

    }

    /**
     * Tests whether path should be ignored.
     * @param path
     * @private
     */
    private ignorePath(path: string): boolean {
        for (const ignore of this.ignorePaths) {
            if (ignore.test(path)) {
                return true
            }
        }
        return false
    }

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
    private validate(data: Array<number[]>, target: Array<number[]>, featureNames: string[]) {
        // check if target and feature array has same # samples | should not happen though
        if (data.length != target.length) {
            this.logger?.error(`Found ${data.length} feature samples but ${target.length} target samples.` +
                `This must be an error as both need to have same size!`)
        }
        // check if each sample always has the same dimension
        const featureDim = data[0].length
        for (const feature of data) {
            if (feature.length != featureDim) {
                this.logger?.error(`Feature dimension is not constant in all samples!`)
            }
        }
        // check if each target always has the same dimension
        const targetDim = target[0].length
        for (const annotation of target) {
            if (annotation.length != targetDim) {
                this.logger?.error("Target dimension is not constant in all samples!")
            }
        }
        // null values found in dimensions
        const nullDimensions = new Map<number, boolean>()
        const nullIdxes = []
        for (const feature of data) {
            for (let i = 0; i < feature.length; i++) {
                if (feature[i] == null) {
                    nullDimensions.set(i, true)
                    nullIdxes.push(i)
                }
            }
        }

        const nullDims = []
        nullDimensions.forEach((val, key) => {
            nullDims.push(key)
        })

        // filter samples with null values?
        const nullSamples = []
        for (let i = 0; i < data.length; i++) {
            const feature = data[i]
            for (const val of feature) {
                if (val == null) {
                    nullSamples.push(i)
                    break
                }
            }
        }

        const countBy = _.countBy(nullIdxes, (el) => {
            return el
        })
        const keyCount: { key: string, numSamples: number }[] = []
        for (const key in countBy) {
            keyCount.push({key: featureNames[key], numSamples: countBy[key]})
        }

        if (keyCount.length == 0) {
            this.logger?.info("Found 0 samples with null values in feature")
        } else {
            this.logger?.info("Found #samples with null values in feature: ", keyCount)
            this.logger?.info("If you would like to set ignoreFeatures add the following array to your" +
                " ignoreFeature injection", keyCount.map(el => {
                return el.key
            }))
        }
        this.logger?.info(`${keyCount.length} of ${featureNames.length} feature dimensions contain` +
            ` null values.`)
        if (nullSamples.length > 0)
            this.logger?.warn(`${nullSamples.length} of ${data.length} samples have null values.`, nullSamples)

        // check features for +/-infinity values (transformed: Number.MAX_SAFE_INTEGER / MIN_SAFE_INTEGER
        let infinityIdxes = new Map<number, boolean>()
        let samplesWithInfinity = 0
        for (const feature of data) {
            let samplesHasInfinity = false
            for (let i = 0; i < feature.length; i++) {

                if (feature[i] == Number.MAX_SAFE_INTEGER || feature[i] == Number.MIN_SAFE_INTEGER) {
                    infinityIdxes.set(i, true)
                    if (!samplesHasInfinity) {
                        samplesWithInfinity++
                        samplesHasInfinity = true
                    }
                }
            }
        }
        const infinityFeatures = []
        infinityIdxes.forEach((val, key) => {
            infinityFeatures.push(featureNames[key])
        })
        this.logger?.info(`Found ${samplesWithInfinity} samples with +/- infinity values`)
        this.logger?.info(`${infinityFeatures.length} out of ${featureNames.length} features contain ` +
            "+/- infinity values")
        if (infinityFeatures.length > 0)
            this.logger?.info("If you would like to set ignoreFeatures to filter +/- infinity values" +
                " add the following array to your ignoreFeature injection", infinityFeatures)
    }

    /**
     * Pushes values of all keys in SonarQubeMeasures into feature-array
     * @param feature
     * @param data
     * @param ignoreFeatureMap Map of names stored in Measure of a key in SonarQubeMeasures.
     * f.e.: "min_val_classes" -> true
     * @private
     */
    private pushToFeature(feature: number[], data: SonarQubeMeasures, ignoreFeatureMap: Map<string, boolean>) {
        const dummy = new SonarQubeMeasures()

        for (const prop in dummy) {
            if (ignoreFeatureMap.get(prop)) {
                continue
            }
            const val = data[prop].value == null ? null : data[prop].value
            feature.push(val)
        }
    }

    private pushFeatureNames(featureNames: string[], prefix: string, ignoreMap: Map<string, boolean>) {
        const dummy = new SonarQubeMeasures()
        for (const property in dummy) {

            const name = prefix + property.charAt(0).toUpperCase() + property.slice(1)
            if (ignoreMap.get(name))
                continue
            featureNames.push(prefix + property.charAt(0).toUpperCase() + property.slice(1))

        }
    }

    private sliceBeginLowerCase(string: string, start: number): string {
        const slice = string.slice(start)
        return slice[0].toLowerCase() + slice.slice(1)
    }
}
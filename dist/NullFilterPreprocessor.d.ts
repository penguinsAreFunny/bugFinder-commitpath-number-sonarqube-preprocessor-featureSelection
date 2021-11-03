import { Dataset, LocalityMap, Preprocessor, TraceAP } from "bugfinder-framework";
import { CommitPath } from "bugfinder-localityrecorder-commitpath";
import { SonarQubePredecessorMeasurement } from "bugfinder-commitpath-quantifier-sonarqubepredecessors";
import { Logger } from "ts-log";
export declare class NullFilterPreprocessor implements Preprocessor<CommitPath, number, SonarQubePredecessorMeasurement> {
    logger?: Logger;
    traceAP: TraceAP;
    description: string;
    ignoreFeatures?: string[];
    ignorePaths?: RegExp[];
    preprocess(quantifications: LocalityMap<CommitPath, SonarQubePredecessorMeasurement>, annotations: LocalityMap<CommitPath, number>): Promise<Dataset>;
    private transformInfinityValues;
    private setFeatureNames;
    private setDataAndTarget;
    /**
     * Tests whether path should be ignored.
     * @param path
     * @private
     */
    private ignorePath;
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
    private validate;
    /**
     * Pushes values of all keys in SonarQubeMeasures into feature-array
     * @param feature
     * @param data
     * @param ignoreFeatureMap Map of names stored in Measure of a key in SonarQubeMeasures.
     * f.e.: "min_val_classes" -> true
     * @private
     */
    private pushToFeature;
    private pushFeatureNames;
    private sliceBeginLowerCase;
}

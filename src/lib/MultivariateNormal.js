
import * as tf from "@tensorflow/tfjs";


export class MultivariateNormal {
    constructor(mean, covariance) {
        this.mean = tf.tensor(mean).reshape([mean.length, 1]);
        this.covariance = tf.tensor(covariance);
    }

    sample() {
        const numSamples = this.mean.shape[0];
        let singleNormal = tf.randomNormal([numSamples,1], 0, 1);
        let result = tf.dot(this.covariance, singleNormal);
        result = tf.add(result, this.mean);
        return result.arraySync();
    }
}

import * as tf from "@tensorflow/tfjs";


export class MultivariateNormal {
    constructor(mean, covariance) {
        this.mean = tf.tensor(mean);
        this.covariance = tf.tensor(covariance);
    }

    sample(numSamples) {
        const numDimensions = this.mean.shape[0];
        let singleNormal = tf.randomNormal([numSamples, numDimensions]);
        return tf.matMul(singleNormal, this.covariance) + this.mean;
    }
}
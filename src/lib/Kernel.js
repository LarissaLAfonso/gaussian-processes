import * as tf from "@tensorflow/tfjs";

export var Kernel = {
    linear: function (x, y) {
        x = tf.tensor(x);
        y = tf.tensor(y);
        return tf.matMul(x, y, false, true);
    },
    polynomial: function (x, y, degree) {
        x = tf.tensor(x);
        y = tf.tensor(y);
        return tf.pow(tf.matMul(x, y, false, true), degree);
    },
    squaredExponential: function (x, y, lengthScale) {
        x = tf.tensor(x);
        y = tf.tensor(y);
        var diff = tf.sub(x, y);
        var dotDiff = tf.matMul(diff, diff, false, true);
        var scaledDiff = tf.div(dotDiff, lengthScale*lengthScale*2);
        return tf.exp(scaledDiff);
    },
    rationalQuadratic: function (x, y, alpha, lengthScale) {
        x = tf.tensor(x);
        y = tf.tensor(y);
        var diff = tf.sub(x, y);
        var dotDiff = tf.matMul(diff, diff, false, true);
        var scaledDiff = tf.div(dotDiff, lengthScale*lengthScale*alpha*2);
        return tf.pow(tf.add(1, scaledDiff), -alpha);
    },
    periodic: function (x, y, period, lengthScale) {
        x = tf.tensor(x);
        y = tf.tensor(y);
        var diff = tf.sub(x, y);
        var dotDiff = tf.sqrt(tf.matMul(diff, diff, false, true));
        var scaledDiff = tf.div(Math.PI*dotDiff, period);
        return tf.exp(-2*lengthScale*tf.square(tf.sin(scaledDiff)));
    }
}
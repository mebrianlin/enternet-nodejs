var sylvester = require('sylvester');
var Matrix = sylvester.Matrix;
var KalmanFilter = require('kalmanjs').default;

module.exports = {
    kalman1d: kalman1d,
    kalman2d: kalman2d
};

function kalman1d(parameter) {
    var kf = new KalmanFilter(parameter);

    function filter(measurement) {
        return kf.filter(measurement);
    }

    return {
        filter: filter
    };
}

function kalman2d() {
    // Settings //////////////////////////////////////

    // The decay errodes the assumption that velocity
    // never changes.  This is the only unique addition
    // I made to the proceedure.  If you set it to zero,
    // the filter will act just like the one we designed
    // in class which means it strives to find a consitent
    // velocitiy.  Over time this will cause it to assume
    // the mouse is moving very slowly with lots of noise.
    // Set too high and the predicted fit will mirror the
    // noisy data it recieves.  When at a nice setting,
    // the fit will be resposive and will do a nice job
    // of smoothing out the function noise.

    var decay = 0.003;

    // I use the uncertainty matrix, R to add random noise
    // to the known position of the mouse.  The higher the
    // values, the more noise, which can be seen by the
    // spread of the orange points on the canvas.
    //
    // If you adjust this number you will often need to
    // compensate by changing the decay so that the prediction
    // function remains smooth and reasonable.  However, as
    // these measurements get noisier we are left with a
    // choice between slower tracking (due to uncertainty)
    // and unrealistic tracking because the data is too noisy.

    var R = Matrix.Diagonal([0.02, 0.02]);


    // initial state (location and velocity)
    // I haven't found much reason to play with these
    // in general the model will update pretty quickly
    // to any entry point.

    var x = $M([
        [0],
        [0],
        [0],
        [0]
    ]);

    // external motion
    // I have not played with this at all, just
    // added like a udacity zombie.

    var u = $M([
        [0],
        [0],
        [0],
        [0]
    ]);

    // initial uncertainty
    // I don't see any reason to play with this
    // like the entry point it quickly adjusts
    // itself to the behavior of the mouse
    var P = Matrix.Random(4, 4);

    // measurement function (4D -> 2D)
    // This one has to be this way to make things run
    var H = $M([
        [1, 0, 0, 0],
        [0, 1, 0, 0]
    ]);

    // identity matrix
    var I = Matrix.I(4);

    // To determine dt
    var time = Date.now();

    // Event Loop //////////////////////////////////////
    function filter(xMeasure, yMeasure) {
        if (xMeasure === null || yMeasure === null) {
            console.error('Missing measured input.');
            console.log('x:', xMeasure);
            console.log('y:', yMeasure);
        }
        // change in time
        var now = Date.now();
        var dt = now - time;
        time = now;

        // Derive the next state
        var F = $M([[1, 0, dt, 0],
                    [0, 1, 0, dt],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1]
        ]);

        // decay confidence
        // to account for change in velocity
        P = P.map(function(x) {
            return x * (1 + decay * dt);
        });

        // prediction
        x = F.x(x).add(u);
        P = F.x(P).x(F.transpose());

        // measurement update
        var Z = $M([[xMeasure, yMeasure]]);
        var y = Z.transpose().subtract(H.x(x));
        var S = H.x(P).x(H.transpose()).add(R);

        var K = P.x(H.transpose()).x(S.inverse());

        x = x.add(K.x(y));
        P = I.subtract(K.x(H)).x(P);

        return {
            x: x.e(1, 1),
            y: x.e(2, 1)
        };
    }

    return {
        filter: filter
    };
}

window['requestAnimationFrame'] = (function () {
    return window['requestAnimationFrame'] || window['webkitRequestAnimationFrame'] || window['mozRequestAnimationFrame'] || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

var SoftEngine;
(function (SoftEngine) {
    var Color4 = (function () {
        function Color4(initialR, initialG, initialB, initialA) {
            this.r = initialR;
            this.g = initialG;
            this.b = initialB;
            this.a = initialA;
        }
        Color4.prototype.toString = function () {
            return '{R: ' + this.r + ' G:' + this.g + ' B:' + this.b + ' A:' + this.a + '}';
        };
        return Color4;
    })();
    SoftEngine.Color4 = Color4;

    var Vector2 = (function () {
        function Vector2(initialX, initialY) {
            this.x = initialX;
            this.y = initialY;
        }
        Vector2.prototype.toString = function () {
            return '{X: ' + this.x + ' Y:' + this.y + '}';
        };
        Vector2.prototype.add = function (vector) {
            return new Vector2(this.x + vector.x, this.y + vector.y);
        };
        Vector2.prototype.subtract = function (vector) {
            return new Vector2(this.x - vector.x, this.y - vector.y);
        };
        Vector2.prototype.negate = function () {
            return new Vector2(-this.x, -this.y);
        };
        Vector2.prototype.scale = function (scale) {
            return new Vector2(this.x * scale, this.y * scale);
        };
        Vector2.prototype.equals = function (vector) {
            return this.x === vector.x && this.y === vector.y;
        };
        Vector2.prototype.length = function () {
            return Math.sqrt(this.lengthSquared());
        };
        Vector2.prototype.lengthSquared = function () {
            return this.x * this.x + this.y * this.y;
        };
        Vector2.prototype.normalize = function () {
            var len = this.length();
            if (len === 0) {
                return;
            }
            var num = 1.0 / len;
            this.x *= num;
            this.y *= num;
        };
        Vector2.Zero = function () {
            return new Vector2(0, 0);
        };
        Vector2.Copy = function (vector) {
            return new Vector2(vector.x, vector.y);
        };
        Vector2.Normalize = function (vector) {
            var newVector = Vector2.Copy(vector);
            newVector.normalize();
            return newVector;
        };
        Vector2.Minimize = function (left, right) {
            var x = Math.min(left.x, right.x);
            var y = Math.min(left.y, right.y);
            return new Vector2(x, y);
        };
        Vector2.Maximize = function (left, right) {
            var x = Math.max(left.x, right.x);
            var y = Math.max(left.y, right.y);
            return new Vector2(x, y);
        };
        Vector2.Transform = function (vector, transformation) {
            var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]);
            var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]);
            return new Vector2(x, y);
        };
        Vector2.Distance = function (vector1, vector2) {
            return Math.sqrt(Vector2.DistanceSquared(vector1, vector2));
        };
        Vector2.DistanceSquared = function (vector1, vector2) {
            var x = vector1.x - vector2.x;
            var y = vector1.y - vector2.y;
            return (x * x) + (y * y);
        };
        return Vector2;
    })();
    SoftEngine.Vector2 = Vector2;

    var Vector3 = (function () {
        function Vector3(initialX, initialY, initialZ) {
            this.x = initialX;
            this.y = initialY;
            this.z = initialZ;
        }
        Vector3.prototype.toString = function () {
            return '{X: ' + this.x + ' Y:' + this.y + ' Z:' + this.z + '}';
        };
        Vector3.prototype.add = function (vector) {
            return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
        };
        Vector3.prototype.subtract = function (vector) {
            return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
        };
        Vector3.prototype.negate = function () {
            return new Vector3(-this.x, -this.y, -this.z);
        };
        Vector3.prototype.scale = function (scale) {
            return new Vector3(this.x * scale, this.y * scale, this.z * scale);
        };
        Vector3.prototype.equals = function (vector) {
            return this.x === vector.x && this.y === vector.y && this.z === vector.z;
        };
        Vector3.prototype.multiply = function (vector) {
            return new Vector3(this.x * vector.x, this.y * vector.y, this.z * vector.z);
        };
        Vector3.prototype.divide = function (vector) {
            return new Vector3(this.x / vector.x, this.y / vector.y, this.z / vector.z);
        };
        Vector3.prototype.length = function () {
            return Math.sqrt(this.lengthSquared());
        };
        Vector3.prototype.lengthSquared = function () {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        };
        Vector3.prototype.normalize = function () {
            var len = this.length();
            if (len === 0) {
                return;
            }
            var num = 1.0 / len;
            this.x *= num;
            this.y *= num;
            this.z *= num;
        };

        Vector3.FromArray = function (array, offset) {
            if (typeof offset === "undefined") { offset = 0; }
            return new Vector3(array[offset], array[offset + 1], array[offset + 2]);
        };
        Vector3.Zero = function () {
            return new Vector3(0, 0, 0);
        };
        Vector3.Up = function () {
            return new Vector3(0, 1, 0);
        };
        Vector3.Copy = function (vector) {
            return new Vector3(vector.x, vector.y, vector.z);
        };
        Vector3.TransformCoordinates = function (vector, transformation) {
            var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]) + transformation.m[12];
            var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]) + transformation.m[13];
            var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]) + transformation.m[14];
            var w = (vector.x * transformation.m[3]) + (vector.y * transformation.m[7]) + (vector.z * transformation.m[11]) + transformation.m[15];
            return new Vector3(x / w, y / w, z / w);
        };
        Vector3.TransformNormal = function (vector, transformation) {
            var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]);
            var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]);
            var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]);
            return new Vector3(x, y, z);
        };
        Vector3.Dot = function (left, right) {
            return left.x * right.x + left.y * right.y + left.z * right.z;
        };
        Vector3.Cross = function (left, right) {
            var x = left.y * right.z - left.z * right.y;
            var y = left.z * right.x - left.x * right.z;
            var z = left.x * right.y - left.y * right.x;
            return new Vector3(x, y, z);
        };
        Vector3.Normalize = function (vector) {
            var newVector = Vector3.Copy(vector);
            newVector.normalize();
            return newVector;
        };
        Vector3.Distance = function (vector1, vector2) {
            return Math.sqrt(Vector3.DistanceSquared(vector1, vector2));
        };
        Vector3.DistanceSquared = function (vector1, vector2) {
            var x = vector1.x - vector2.x;
            var y = vector1.y - vector2.y;
            var z = vector1.z - vector2.z;
            return (x * x) + (y * y) + (z * z);
        };
        return Vector3;
    })();
    SoftEngine.Vector3 = Vector3;

    var Matrix = (function () {
        function Matrix() {
            this.m = [];
        }
        Matrix.prototype.isIdentity = function () {
            return this.equals(Matrix.Identity());
        };
        Matrix.prototype.determinant = function () {
            var temp1 = (this.m[10] * this.m[15]) - (this.m[11] * this.m[14]);
            var temp2 = (this.m[9] * this.m[15]) - (this.m[11] * this.m[13]);
            var temp3 = (this.m[9] * this.m[14]) - (this.m[10] * this.m[13]);
            var temp4 = (this.m[8] * this.m[15]) - (this.m[11] * this.m[12]);
            var temp5 = (this.m[8] * this.m[14]) - (this.m[10] * this.m[12]);
            var temp6 = (this.m[8] * this.m[13]) - (this.m[9] * this.m[12]);
            return ((((this.m[0] * (((this.m[5] * temp1) - (this.m[6] * temp2)) + (this.m[7] * temp3))) - (this.m[1] * (((this.m[4] * temp1) - (this.m[6] * temp4)) + (this.m[7] * temp5)))) + (this.m[2] * (((this.m[4] * temp2) - (this.m[5] * temp4)) + (this.m[7] * temp6)))) - (this.m[3] * (((this.m[4] * temp3) - (this.m[5] * temp5)) + (this.m[6] * temp6))));
        };
        Matrix.prototype.toArray = function () {
            return this.m;
        };
        Matrix.prototype.invert = function () {
            var l1 = this.m[0];
            var l2 = this.m[1];
            var l3 = this.m[2];
            var l4 = this.m[3];
            var l5 = this.m[4];
            var l6 = this.m[5];
            var l7 = this.m[6];
            var l8 = this.m[7];
            var l9 = this.m[8];
            var l10 = this.m[9];
            var l11 = this.m[10];
            var l12 = this.m[11];
            var l13 = this.m[12];
            var l14 = this.m[13];
            var l15 = this.m[14];
            var l16 = this.m[15];
            var l17 = (l11 * l16) - (l12 * l15);
            var l18 = (l10 * l16) - (l12 * l14);
            var l19 = (l10 * l15) - (l11 * l14);
            var l20 = (l9 * l16) - (l12 * l13);
            var l21 = (l9 * l15) - (l11 * l13);
            var l22 = (l9 * l14) - (l10 * l13);
            var l23 = ((l6 * l17) - (l7 * l18)) + (l8 * l19);
            var l24 = -(((l5 * l17) - (l7 * l20)) + (l8 * l21));
            var l25 = ((l5 * l18) - (l6 * l20)) + (l8 * l22);
            var l26 = -(((l5 * l19) - (l6 * l21)) + (l7 * l22));
            var l27 = 1.0 / ((((l1 * l23) + (l2 * l24)) + (l3 * l25)) + (l4 * l26));
            var l28 = (l7 * l16) - (l8 * l15);
            var l29 = (l6 * l16) - (l8 * l14);
            var l30 = (l6 * l15) - (l7 * l14);
            var l31 = (l5 * l16) - (l8 * l13);
            var l32 = (l5 * l15) - (l7 * l13);
            var l33 = (l5 * l14) - (l6 * l13);
            var l34 = (l7 * l12) - (l8 * l11);
            var l35 = (l6 * l12) - (l8 * l10);
            var l36 = (l6 * l11) - (l7 * l10);
            var l37 = (l5 * l12) - (l8 * l9);
            var l38 = (l5 * l11) - (l7 * l9);
            var l39 = (l5 * l10) - (l6 * l9);
            this.m[0] = l23 * l27;
            this.m[4] = l24 * l27;
            this.m[8] = l25 * l27;
            this.m[12] = l26 * l27;
            this.m[1] = -(((l2 * l17) - (l3 * l18)) + (l4 * l19)) * l27;
            this.m[5] = (((l1 * l17) - (l3 * l20)) + (l4 * l21)) * l27;
            this.m[9] = -(((l1 * l18) - (l2 * l20)) + (l4 * l22)) * l27;
            this.m[13] = (((l1 * l19) - (l2 * l21)) + (l3 * l22)) * l27;
            this.m[2] = (((l2 * l28) - (l3 * l29)) + (l4 * l30)) * l27;
            this.m[6] = -(((l1 * l28) - (l3 * l31)) + (l4 * l32)) * l27;
            this.m[10] = (((l1 * l29) - (l2 * l31)) + (l4 * l33)) * l27;
            this.m[14] = -(((l1 * l30) - (l2 * l32)) + (l3 * l33)) * l27;
            this.m[3] = -(((l2 * l34) - (l3 * l35)) + (l4 * l36)) * l27;
            this.m[7] = (((l1 * l34) - (l3 * l37)) + (l4 * l38)) * l27;
            this.m[11] = -(((l1 * l35) - (l2 * l37)) + (l4 * l39)) * l27;
            this.m[15] = (((l1 * l36) - (l2 * l38)) + (l3 * l39)) * l27;
        };
        Matrix.prototype.multiply = function (matrix) {
            var result = new Matrix();
            result.m[0] = this.m[0] * matrix.m[0] + this.m[1] * matrix.m[4] + this.m[2] * matrix.m[8] + this.m[3] * matrix.m[12];
            result.m[1] = this.m[0] * matrix.m[1] + this.m[1] * matrix.m[5] + this.m[2] * matrix.m[9] + this.m[3] * matrix.m[13];
            result.m[2] = this.m[0] * matrix.m[2] + this.m[1] * matrix.m[6] + this.m[2] * matrix.m[10] + this.m[3] * matrix.m[14];
            result.m[3] = this.m[0] * matrix.m[3] + this.m[1] * matrix.m[7] + this.m[2] * matrix.m[11] + this.m[3] * matrix.m[15];
            result.m[4] = this.m[4] * matrix.m[0] + this.m[5] * matrix.m[4] + this.m[6] * matrix.m[8] + this.m[7] * matrix.m[12];
            result.m[5] = this.m[4] * matrix.m[1] + this.m[5] * matrix.m[5] + this.m[6] * matrix.m[9] + this.m[7] * matrix.m[13];
            result.m[6] = this.m[4] * matrix.m[2] + this.m[5] * matrix.m[6] + this.m[6] * matrix.m[10] + this.m[7] * matrix.m[14];
            result.m[7] = this.m[4] * matrix.m[3] + this.m[5] * matrix.m[7] + this.m[6] * matrix.m[11] + this.m[7] * matrix.m[15];
            result.m[8] = this.m[8] * matrix.m[0] + this.m[9] * matrix.m[4] + this.m[10] * matrix.m[8] + this.m[11] * matrix.m[12];
            result.m[9] = this.m[8] * matrix.m[1] + this.m[9] * matrix.m[5] + this.m[10] * matrix.m[9] + this.m[11] * matrix.m[13];
            result.m[10] = this.m[8] * matrix.m[2] + this.m[9] * matrix.m[6] + this.m[10] * matrix.m[10] + this.m[11] * matrix.m[14];
            result.m[11] = this.m[8] * matrix.m[3] + this.m[9] * matrix.m[7] + this.m[10] * matrix.m[11] + this.m[11] * matrix.m[15];
            result.m[12] = this.m[12] * matrix.m[0] + this.m[13] * matrix.m[4] + this.m[14] * matrix.m[8] + this.m[15] * matrix.m[12];
            result.m[13] = this.m[12] * matrix.m[1] + this.m[13] * matrix.m[5] + this.m[14] * matrix.m[9] + this.m[15] * matrix.m[13];
            result.m[14] = this.m[12] * matrix.m[2] + this.m[13] * matrix.m[6] + this.m[14] * matrix.m[10] + this.m[15] * matrix.m[14];
            result.m[15] = this.m[12] * matrix.m[3] + this.m[13] * matrix.m[7] + this.m[14] * matrix.m[11] + this.m[15] * matrix.m[15];
            return result;
        };
        Matrix.prototype.equals = function (value) {
            return this.m[0] === value.m[0] && this.m[1] === value.m[1] && this.m[2] === value.m[2] && this.m[3] === value.m[3] && this.m[4] === value.m[4] && this.m[5] === value.m[5] && this.m[6] === value.m[6] && this.m[7] === value.m[7] && this.m[8] === value.m[8] && this.m[9] === value.m[9] && this.m[10] === value.m[10] && this.m[11] === value.m[11] && this.m[12] === value.m[12] && this.m[13] === value.m[13] && this.m[14] === value.m[14] && this.m[15] === value.m[15];
        };
        Matrix.FromValues = function (initialM11, initialM12, initialM13, initialM14, initialM21, initialM22, initialM23, initialM24, initialM31, initialM32, initialM33, initialM34, initialM41, initialM42, initialM43, initialM44) {
            var result = new Matrix();
            result.m[0] = initialM11;
            result.m[1] = initialM12;
            result.m[2] = initialM13;
            result.m[3] = initialM14;
            result.m[4] = initialM21;
            result.m[5] = initialM22;
            result.m[6] = initialM23;
            result.m[7] = initialM24;
            result.m[8] = initialM31;
            result.m[9] = initialM32;
            result.m[10] = initialM33;
            result.m[11] = initialM34;
            result.m[12] = initialM41;
            result.m[13] = initialM42;
            result.m[14] = initialM43;
            result.m[15] = initialM44;
            return result;
        };
        Matrix.Identity = function () {
            return Matrix.FromValues(1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0);
        };
        Matrix.Zero = function () {
            return Matrix.FromValues(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        };
        Matrix.Copy = function (matrix) {
            return Matrix.FromValues(matrix.m[0], matrix.m[1], matrix.m[2], matrix.m[3], matrix.m[4], matrix.m[5], matrix.m[6], matrix.m[7], matrix.m[8], matrix.m[9], matrix.m[10], matrix.m[11], matrix.m[12], matrix.m[13], matrix.m[14], matrix.m[15]);
        };
        Matrix.RotationX = function (angle) {
            var result = Matrix.Zero();
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            result.m[0] = 1.0;
            result.m[15] = 1.0;
            result.m[5] = c;
            result.m[10] = c;
            result.m[9] = -s;
            result.m[6] = s;
            return result;
        };
        Matrix.RotationY = function (angle) {
            var result = Matrix.Zero();
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            result.m[5] = 1.0;
            result.m[15] = 1.0;
            result.m[0] = c;
            result.m[2] = -s;
            result.m[8] = s;
            result.m[10] = c;
            return result;
        };
        Matrix.RotationZ = function (angle) {
            var result = Matrix.Zero();
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            result.m[10] = 1.0;
            result.m[15] = 1.0;
            result.m[0] = c;
            result.m[1] = s;
            result.m[4] = -s;
            result.m[5] = c;
            return result;
        };
        Matrix.RotationAxis = function (axis, angle) {
            var s = Math.sin(-angle);
            var c = Math.cos(-angle);
            var c1 = 1 - c;
            axis.normalize();
            var result = Matrix.Zero();
            result.m[0] = (axis.x * axis.x) * c1 + c;
            result.m[1] = (axis.x * axis.y) * c1 - (axis.z * s);
            result.m[2] = (axis.x * axis.z) * c1 + (axis.y * s);
            result.m[3] = 0.0;
            result.m[4] = (axis.y * axis.x) * c1 + (axis.z * s);
            result.m[5] = (axis.y * axis.y) * c1 + c;
            result.m[6] = (axis.y * axis.z) * c1 - (axis.x * s);
            result.m[7] = 0.0;
            result.m[8] = (axis.z * axis.x) * c1 - (axis.y * s);
            result.m[9] = (axis.z * axis.y) * c1 + (axis.x * s);
            result.m[10] = (axis.z * axis.z) * c1 + c;
            result.m[11] = 0.0;
            result.m[15] = 1.0;
            return result;
        };
        Matrix.RotationYawPitchRoll = function (yaw, pitch, roll) {
            return Matrix.RotationZ(roll).multiply(Matrix.RotationX(pitch)).multiply(Matrix.RotationY(yaw));
        };
        Matrix.Scaling = function (x, y, z) {
            var result = Matrix.Zero();
            result.m[0] = x;
            result.m[5] = y;
            result.m[10] = z;
            result.m[15] = 1.0;
            return result;
        };
        Matrix.Translation = function (x, y, z) {
            var result = Matrix.Identity();
            result.m[12] = x;
            result.m[13] = y;
            result.m[14] = z;
            return result;
        };
        Matrix.LookAtLH = function (eye, target, up) {
            var zAxis = target.subtract(eye);
            zAxis.normalize();
            var xAxis = Vector3.Cross(up, zAxis);
            xAxis.normalize();
            var yAxis = Vector3.Cross(zAxis, xAxis);
            yAxis.normalize();
            var ex = -Vector3.Dot(xAxis, eye);
            var ey = -Vector3.Dot(yAxis, eye);
            var ez = -Vector3.Dot(zAxis, eye);
            return Matrix.FromValues(xAxis.x, yAxis.x, zAxis.x, 0, xAxis.y, yAxis.y, zAxis.y, 0, xAxis.z, yAxis.z, zAxis.z, 0, ex, ey, ez, 1);
        };
        Matrix.PerspectiveLH = function (width, height, znear, zfar) {
            var matrix = Matrix.Zero();
            matrix.m[0] = (2.0 * znear) / width;
            matrix.m[1] = matrix.m[2] = matrix.m[3] = 0.0;
            matrix.m[5] = (2.0 * znear) / height;
            matrix.m[4] = matrix.m[6] = matrix.m[7] = 0.0;
            matrix.m[10] = -zfar / (znear - zfar);
            matrix.m[8] = matrix.m[9] = 0.0;
            matrix.m[11] = 1.0;
            matrix.m[12] = matrix.m[13] = matrix.m[15] = 0.0;
            matrix.m[14] = (znear * zfar) / (znear - zfar);
            return matrix;
        };
        Matrix.PerspectiveFovLH = function (fov, aspect, znear, zfar) {
            var matrix = Matrix.Zero();
            var tan = 1.0 / (Math.tan(fov * 0.5));
            matrix.m[0] = tan / aspect;
            matrix.m[1] = matrix.m[2] = matrix.m[3] = 0.0;
            matrix.m[5] = tan;
            matrix.m[4] = matrix.m[6] = matrix.m[7] = 0.0;
            matrix.m[8] = matrix.m[9] = 0.0;
            matrix.m[10] = -zfar / (znear - zfar);
            matrix.m[11] = 1.0;
            matrix.m[12] = matrix.m[13] = matrix.m[15] = 0.0;
            matrix.m[14] = (znear * zfar) / (znear - zfar);
            return matrix;
        };
        Matrix.Transpose = function (matrix) {
            var result = new Matrix();
            result.m[0] = matrix.m[0];
            result.m[1] = matrix.m[4];
            result.m[2] = matrix.m[8];
            result.m[3] = matrix.m[12];
            result.m[4] = matrix.m[1];
            result.m[5] = matrix.m[5];
            result.m[6] = matrix.m[9];
            result.m[7] = matrix.m[13];
            result.m[8] = matrix.m[2];
            result.m[9] = matrix.m[6];
            result.m[10] = matrix.m[10];
            result.m[11] = matrix.m[14];
            result.m[12] = matrix.m[3];
            result.m[13] = matrix.m[7];
            result.m[14] = matrix.m[11];
            result.m[15] = matrix.m[15];
            return result;
        };
        return Matrix;
    })();
    SoftEngine.Matrix = Matrix;

    var Camera = (function () {
        function Camera() {
            this.Position = Vector3.Zero();
            this.Target = Vector3.Zero();
        }
        return Camera;
    })();
    SoftEngine.Camera = Camera;

    var Mesh = (function () {
        function Mesh(name, verticesCount, facesCount) {
            this.name = name;
            this.Vertices = new Array(verticesCount);
            this.Faces = new Array(facesCount);
            this.Rotation = new Vector3(0, 0, 0);
            this.Position = new Vector3(0, 0, 0);
        }
        Mesh.prototype.computeFacesNormals = function () {
            for (var indexFaces = 0; indexFaces < this.Faces.length; indexFaces++) {
                var currentFace = this.Faces[indexFaces];

                var vertexA = this.Vertices[currentFace.A];
                var vertexB = this.Vertices[currentFace.B];
                var vertexC = this.Vertices[currentFace.C];

                this.Faces[indexFaces].Normal = (vertexA.Normal.add(vertexB.Normal.add(vertexC.Normal))).scale(1 / 3);
                this.Faces[indexFaces].Normal.normalize();
            }
        };
        return Mesh;
    })();
    SoftEngine.Mesh = Mesh;

    var Texture = (function () {
        function Texture(filename, width, height) {
            this.width = width;
            this.height = height;
            this.load(filename);
        }
        Texture.prototype.load = function (filename) {
            var _this = this;
            var imageTexture = new Image();
            imageTexture.height = this.height;
            imageTexture.width = this.width;
            imageTexture.onload = function () {
                var internalCanvas = document.createElement("canvas");
                internalCanvas.width = _this.width;
                internalCanvas.height = _this.height;
                var internalContext = internalCanvas.getContext("2d");
                internalContext.drawImage(imageTexture, 0, 0);
                _this.internalBuffer = internalContext.getImageData(0, 0, _this.width, _this.height);
            };
            imageTexture.src = filename;
        };

        Texture.prototype.map = function (tu, tv) {
            if (this.internalBuffer) {
                var u = Math.floor(Math.abs(((tu * this.width) % this.width)));
                var v = Math.floor(Math.abs(((tv * this.height) % this.height)));

                var pos = (u + v * this.width) * 4;

                var r = this.internalBuffer.data[pos];
                var g = this.internalBuffer.data[pos + 1];
                var b = this.internalBuffer.data[pos + 2];
                var a = this.internalBuffer.data[pos + 3];

                return new Color4(r / 255.0, g / 255.0, b / 255.0, a / 255.0);
            } else {
                return new Color4(1, 1, 1, 1);
            }
        };
        return Texture;
    })();
    SoftEngine.Texture = Texture;

    var Device = (function () {
        function Device(canvas) {
            this.workingCanvas = canvas;
            this.workingWidth = canvas.width;
            this.workingHeight = canvas.height;
            this.workingContext = this.workingCanvas.getContext('2d');
            this.depthbuffer = new Array(this.workingWidth * this.workingHeight);
        }
        Device.prototype.clear = function () {
            this.workingContext.clearRect(0, 0, this.workingWidth, this.workingHeight);
            this.backbuffer = this.workingContext.getImageData(0, 0, this.workingWidth, this.workingHeight);

            for (var i = 0; i < this.depthbuffer.length; i++) {
                this.depthbuffer[i] = 10000000;
            }
        };

        Device.prototype.putPixel = function (x, y, z, color) {
            this.backbufferdata = this.backbuffer.data;
            var index = Math.floor(x) + Math.floor(y) * this.workingWidth;
            var index4 = index * 4;

            if (this.depthbuffer[index] < z) {
                return;
            }

            this.depthbuffer[index] = z;

            this.backbufferdata[index4] = color.r * 255;
            this.backbufferdata[index4 + 1] = color.g * 255;
            this.backbufferdata[index4 + 2] = color.b * 255;
            this.backbufferdata[index4 + 3] = color.a * 255;
        };

        Device.prototype.drawPoint = function (point, color) {
            if (point.x >= 0 && point.y >= 0 && point.x < this.workingWidth && point.y < this.workingHeight) {
                this.putPixel(point.x, point.y, point.z, color);
            }
        };

        Device.prototype.present = function () {
            this.workingContext.putImageData(this.backbuffer, 0, 0);
        };

        Device.prototype.clamp = function (value, min, max) {
            if (typeof min === "undefined") { min = 0; }
            if (typeof max === "undefined") { max = 1; }
            return Math.max(min, Math.min(value, max));
        };

        Device.prototype.interpolate = function (min, max, gradient) {
            return min + (max - min) * this.clamp(gradient);
        };

        Device.prototype.project = function (vertex, transMat, world) {
            var point2d = Vector3.TransformCoordinates(vertex.Coordinates, transMat);
            var point3DWorld = Vector3.TransformCoordinates(vertex.Coordinates, world);
            var normal3DWorld = Vector3.TransformCoordinates(vertex.Normal, world);

            var x = point2d.x * this.workingWidth + this.workingWidth / 2.0;
            var y = -point2d.y * this.workingHeight + this.workingHeight / 2.0;

            return {
                Coordinates: new Vector3(x, y, point2d.z),
                Normal: normal3DWorld,
                WorldCoordinates: point3DWorld,
                TextureCoordinates: vertex.TextureCoordinates
            };
        };

        Device.prototype.computeNDotL = function (vertex, normal, lightPosition) {
            var lightDirection = lightPosition.subtract(vertex);
            normal.normalize();
            lightDirection.normalize();
            return Math.max(0, Vector3.Dot(normal, lightDirection));
        };

        Device.prototype.processScanLine = function (data, va, vb, vc, vd, color, texture) {
            var pa = va.Coordinates;
            var pb = vb.Coordinates;
            var pc = vc.Coordinates;
            var pd = vd.Coordinates;

            var gradient1 = pa.y != pb.y ? (data.currentY - pa.y) / (pb.y - pa.y) : 1;
            var gradient2 = pc.y != pd.y ? (data.currentY - pc.y) / (pd.y - pc.y) : 1;

            var sx = Math.floor(this.interpolate(pa.x, pb.x, gradient1));
            var ex = Math.floor(this.interpolate(pc.x, pd.x, gradient2));

            var z1 = this.interpolate(pa.z, pb.z, gradient1);
            var z2 = this.interpolate(pc.z, pd.z, gradient2);

            var snl = this.interpolate(data.ndotla, data.ndotlb, gradient1);
            var enl = this.interpolate(data.ndotlc, data.ndotld, gradient2);

            var su = this.interpolate(data.ua, data.ub, gradient1);
            var eu = this.interpolate(data.uc, data.ud, gradient2);
            var sv = this.interpolate(data.va, data.vb, gradient1);
            var ev = this.interpolate(data.vc, data.vd, gradient2);

            for (var x = sx; x < ex; x++) {
                var gradient = (x - sx) / (ex - sx);

                var z = this.interpolate(z1, z2, gradient);
                var ndotl = this.interpolate(snl, enl, gradient);
                var u = this.interpolate(su, eu, gradient);
                var v = this.interpolate(sv, ev, gradient);

                var textureColor;

                if (texture) {
                    textureColor = texture.map(u, v);
                } else {
                    textureColor = new Color4(1, 1, 1, 1);
                }

                this.drawPoint(new Vector3(x, data.currentY, z), new Color4(color.r * ndotl * textureColor.r, color.g * ndotl * textureColor.g, color.b * ndotl * textureColor.b, 1));
            }
        };

        Device.prototype.drawTriangle = function (v1, v2, v3, color, texture) {
            var temp;

            if (v1.Coordinates.y > v2.Coordinates.y) {
                temp = v2;
                v2 = v1;
                v1 = temp;
            }

            if (v2.Coordinates.y > v3.Coordinates.y) {
                temp = v2;
                v2 = v3;
                v3 = temp;
            }

            if (v1.Coordinates.y > v2.Coordinates.y) {
                temp = v2;
                v2 = v1;
                v1 = temp;
            }

            var p1 = v1.Coordinates;
            var p2 = v2.Coordinates;
            var p3 = v3.Coordinates;

            var lightPos = new Vector3(0, 10, 10);

            var nl1 = this.computeNDotL(v1.WorldCoordinates, v1.Normal, lightPos);
            var nl2 = this.computeNDotL(v2.WorldCoordinates, v2.Normal, lightPos);
            var nl3 = this.computeNDotL(v3.WorldCoordinates, v3.Normal, lightPos);

            var data = {};

            var dP1P2;
            var dP1P3;

            if (p2.y - p1.y > 0) {
                dP1P2 = (p2.x - p1.x) / (p2.y - p1.y);
            } else {
                dP1P2 = 0;
            }

            if (p3.y - p1.y > 0) {
                dP1P3 = (p3.x - p1.x) / (p3.y - p1.y);
            } else {
                dP1P3 = 0;
            }

            if (dP1P2 > dP1P3) {
                for (var y = Math.floor(p1.y); y <= Math.floor(p3.y); y++) {
                    data.currentY = y;

                    if (y < p2.y) {
                        data.ndotla = nl1;
                        data.ndotlb = nl3;
                        data.ndotlc = nl1;
                        data.ndotld = nl2;

                        data.ua = v1.TextureCoordinates.x;
                        data.ub = v3.TextureCoordinates.x;
                        data.uc = v1.TextureCoordinates.x;
                        data.ud = v2.TextureCoordinates.x;

                        data.va = v1.TextureCoordinates.y;
                        data.vb = v3.TextureCoordinates.y;
                        data.vc = v1.TextureCoordinates.y;
                        data.vd = v2.TextureCoordinates.y;

                        this.processScanLine(data, v1, v3, v1, v2, color, texture);
                    } else {
                        data.ndotla = nl1;
                        data.ndotlb = nl3;
                        data.ndotlc = nl2;
                        data.ndotld = nl3;

                        data.ua = v1.TextureCoordinates.x;
                        data.ub = v3.TextureCoordinates.x;
                        data.uc = v2.TextureCoordinates.x;
                        data.ud = v3.TextureCoordinates.x;

                        data.va = v1.TextureCoordinates.y;
                        data.vb = v3.TextureCoordinates.y;
                        data.vc = v2.TextureCoordinates.y;
                        data.vd = v3.TextureCoordinates.y;

                        this.processScanLine(data, v1, v3, v2, v3, color, texture);
                    }
                }
            } else {
                for (var y = Math.floor(p1.y); y <= Math.floor(p3.y); y++) {
                    data.currentY = y;

                    if (y < p2.y) {
                        data.ndotla = nl1;
                        data.ndotlb = nl2;
                        data.ndotlc = nl1;
                        data.ndotld = nl3;

                        data.ua = v1.TextureCoordinates.x;
                        data.ub = v2.TextureCoordinates.x;
                        data.uc = v1.TextureCoordinates.x;
                        data.ud = v3.TextureCoordinates.x;

                        data.va = v1.TextureCoordinates.y;
                        data.vb = v2.TextureCoordinates.y;
                        data.vc = v1.TextureCoordinates.y;
                        data.vd = v3.TextureCoordinates.y;

                        this.processScanLine(data, v1, v2, v1, v3, color, texture);
                    } else {
                        data.ndotla = nl2;
                        data.ndotlb = nl3;
                        data.ndotlc = nl1;
                        data.ndotld = nl3;

                        data.ua = v2.TextureCoordinates.x;
                        data.ub = v3.TextureCoordinates.x;
                        data.uc = v1.TextureCoordinates.x;
                        data.ud = v3.TextureCoordinates.x;

                        data.va = v2.TextureCoordinates.y;
                        data.vb = v3.TextureCoordinates.y;
                        data.vc = v1.TextureCoordinates.y;
                        data.vd = v3.TextureCoordinates.y;

                        this.processScanLine(data, v2, v3, v1, v3, color, texture);
                    }
                }
            }
        };

        Device.prototype.render = function (camera, meshes) {
            var viewMatrix = Matrix.LookAtLH(camera.Position, camera.Target, Vector3.Up());
            var projectionMatrix = Matrix.PerspectiveFovLH(0.78, this.workingWidth / this.workingHeight, 0.01, 1.0);

            for (var index = 0; index < meshes.length; index++) {
                var cMesh = meshes[index];
                var worldMatrix = Matrix.RotationYawPitchRoll(cMesh.Rotation.y, cMesh.Rotation.x, cMesh.Rotation.z).multiply(Matrix.Translation(cMesh.Position.x, cMesh.Position.y, cMesh.Position.z));

                var worldView = worldMatrix.multiply(viewMatrix);
                var transformMatrix = worldView.multiply(projectionMatrix);

                for (var indexFaces = 0; indexFaces < cMesh.Faces.length; indexFaces++) {
                    var currentFace = cMesh.Faces[indexFaces];
                    var transformedNormal = Vector3.TransformNormal(currentFace.Normal, worldView);

                    if (transformedNormal.z < 0) {
                        var vertexA = cMesh.Vertices[currentFace.A];
                        var vertexB = cMesh.Vertices[currentFace.B];
                        var vertexC = cMesh.Vertices[currentFace.C];

                        var pixelA = this.project(vertexA, transformMatrix, worldMatrix);
                        var pixelB = this.project(vertexB, transformMatrix, worldMatrix);
                        var pixelC = this.project(vertexC, transformMatrix, worldMatrix);

                        var color = 1.0;
                        this.drawTriangle(pixelA, pixelB, pixelC, new Color4(color, color, color, 1), cMesh.Texture);
                    }
                }
            }
        };

        Device.prototype.LoadJSONFileAsync = function (fileName, callback) {
            var jsonObject = {};
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('GET', fileName, true);
            var that = this;
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    jsonObject = JSON.parse(xmlhttp.responseText);
                    callback(that.CreateMeshesFromJSON(jsonObject));
                }
            };
            xmlhttp.send(null);
        };

        Device.prototype.CreateMeshesFromJSON = function (jsonObject) {
            var meshes = [];
            var materials = [];

            for (var materialIndex = 0; materialIndex < jsonObject.materials.length; materialIndex++) {
                var material = {};

                material.Name = jsonObject.materials[materialIndex].name;
                material.ID = jsonObject.materials[materialIndex].id;

                if (jsonObject.materials[materialIndex].diffuseTexture) {
                    material.DiffuseTextureName = jsonObject.materials[materialIndex].diffuseTexture.name;
                }

                materials[material.ID] = material;
            }

            for (var meshIndex = 0; meshIndex < jsonObject.meshes.length; meshIndex++) {
                var verticesArray = jsonObject.meshes[meshIndex].vertices;
                var indicesArray = jsonObject.meshes[meshIndex].indices;

                var uvCount = jsonObject.meshes[meshIndex].uvCount;
                var verticesStep = 1;

                switch (uvCount) {
                    case 0:
                        verticesStep = 6;
                        break;
                    case 1:
                        verticesStep = 8;
                        break;
                    case 2:
                        verticesStep = 10;
                        break;
                }

                var verticesCount = verticesArray.length / verticesStep;
                var facesCount = indicesArray.length / 3;
                var mesh = new Mesh(jsonObject.meshes[meshIndex].name, verticesCount, facesCount);

                for (var index = 0; index < verticesCount; index++) {
                    var x = verticesArray[index * verticesStep];
                    var y = verticesArray[index * verticesStep + 1];
                    var z = verticesArray[index * verticesStep + 2];

                    var nx = verticesArray[index * verticesStep + 3];
                    var ny = verticesArray[index * verticesStep + 4];
                    var nz = verticesArray[index * verticesStep + 5];

                    mesh.Vertices[index] = {
                        Coordinates: new Vector3(x, y, z),
                        Normal: new Vector3(nx, ny, nz)
                    };

                    if (uvCount > 0) {
                        var u = verticesArray[index * verticesStep + 6];
                        var v = verticesArray[index * verticesStep + 7];
                        mesh.Vertices[index].TextureCoordinates = new Vector2(u, v);
                    } else {
                        mesh.Vertices[index].TextureCoordinates = new Vector2(0, 0);
                    }
                }

                for (var index = 0; index < facesCount; index++) {
                    var a = indicesArray[index * 3];
                    var b = indicesArray[index * 3 + 1];
                    var c = indicesArray[index * 3 + 2];
                    mesh.Faces[index] = { A: a, B: b, C: c };
                }

                var position = jsonObject.meshes[meshIndex].position;
                mesh.Position = new Vector3(position[0], position[1], position[2]);

                if (uvCount > 0) {
                    var meshTextureID = jsonObject.meshes[meshIndex].materialId;
                    var meshTextureName = materials[meshTextureID].DiffuseTextureName;
                    mesh.Texture = new Texture('../models/' + meshTextureName, 512, 512);
                }

                mesh.computeFacesNormals();

                meshes.push(mesh);
            }
            return meshes;
        };
        return Device;
    })();
    SoftEngine.Device = Device;
})(SoftEngine || (SoftEngine = {}));

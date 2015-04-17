/**
 * Created by JunHo on 2015-03-29.
 */
var SoftEngine;
(function(W){
    W['requestAnimationFrame'] = (function(){
        return W['requestAnimationFrame'] ||
            W['webkitRequestAnimationFrame'] ||
            W['mozRequestAnimationFrame'] ||
            function(callback){
                W.setTimeout( callback, 1000 / 60 );
            };
    })();
})(this);
(function(SoftEngine){
    var Color4 = (function(){
        function Color4( initialR, initialG, initialB, initialA ){
            this.r = initialR;
            this.g = initialG;
            this.b = initialB;
            this.a = initialA;
        }
        Color4.prototype.toString = function(){
            return '{R: ' + this.r + ', G: ' + this.g + ', B: ' + this.b + ', A: ' + this.a + '}';
        };
        return Color4;
    })();
    SoftEngine.Color4 = Color4;

    var Vector2 = (function(){
        function Vector2( initialX, initialY ){
            this.x = initialX;
            this.y = initialY;
        }
        Vector2.prototype.toString = function(){
            return '{X: ' + this.x + ', Y: ' + this.y + '}';
        };
        Vector2.prototype.add = function(vector){
            return new Vector2( this.x + vector.x, this.y + vector.y );
        };
        Vector2.prototype.subtract = function(vector){
            return new Vector2( this.x - vector.x, this.y - vector.y );
        };
        Vector2.prototype.negate = function(){
            return new Vector2( -this.x, -this.y );
        };
        Vector2.prototype.scale = function(scale){
            return new Vector2( this.x * scale, this.y * scale );
        };
        Vector2.prototype.equals = function(vector){
            return this.x === vector.x && this.y === vector.y;
        };
        Vector2.prototype.length = function(){
            return Math.sqrt(this.lengthSquared());
        };
        Vector2.prototype.lengthSquared = function(){
            return this.x * this.x + this.y * this.y;
        };
        Vector2.prototype.normalize = function(){
            var len = this.length();
            if( len === 0 ) return;
            var num = 1.0 / len;
            this.x *= num;
            this.y *= num;
        };
        Vector2.Zero = function(){
            return new Vector2( 0, 0 );
        };
        Vector2.Copy = function(vector){
            return new Vector2( vector.x, vector.y );
        };
        Vector2.Normalize = function(vector){
            var newVector = Vector2.Copy(vector);
            newVector.normalize();
            return newVector;
        };
        Vector2.Minimize = function( left, right ){
            var x = Math.min( left.x, right.x );
            var y = Math.min( left.y, right.y );
            return new Vector2( x, y );
        };
        Vector2.Maximize = function( left, right ){
            var x = Math.max( left.x, right.x );
            var y = Math.max( left.y, right.y );
            return new Vector2( x, y );
        };
        Vector2.Transform = function( vector, transformation ){
            var x = vector.x * transformation.m[0] + vector.y * transformation.m[4];
            var y = vector.x * transformation.m[1] + vector.y * transformation.m[5];
            return new Vector2( x, y );
        };
        Vector2.Distance = function( vector1, vector2 ){
            return Math.sqrt(Vector2.DistanceSquared( vector1, vector2 ));
        };
        Vector2.DistanceSquared = function( vector1, vector2 ){
            var x = vector1.x - vector2.x;
            var y = vector1.y - vector2.y;
            return x * x + y * y;
        };
        return Vector2;
    })();
    SoftEngine.Vector2 = Vector2;

    var Vector3 = (function(){
        function Vector3( initialX, initialY, initialZ ){
            this.x = initialX;
            this.y = initialY;
            this.z = initialZ;
        }
        Vector3.prototype.toString = function(){
            return '{X: ' + this.x + ', Y: ' + this.y + ', Z: ' + this.z + '}';
        };
        Vector3.prototype.add = function(vector){
            return new Vector3( this.x + vector.x, this.y + vector.y, this.z + vector.z );
        };
        Vector3.prototype.subtract = function(vector){
            return new Vector3( this.x - vector.x, this.y - vector.y, this.z - vector.z );
        };
        Vector3.prototype.negate = function(){
            return new Vector3( -this.x, -this.y, -this.z );
        };
        Vector3.prototype.scale = function(scale){
            return new Vector3( this.x * scale, this.y * scale, this.z * scale );
        };
        Vector3.prototype.equals = function(vector){
            return this.x === vector.x && this.y === vector.y && this.z === vector.z;
        };
        Vector3.prototype.multiply = function(vector){
            return new Vector3( this.x * vector.x, this.y * vector.y, this.z * vector.z );
        };
        Vector3.prototype.divide = function(vector){
            return new Vector3( this.x / vector.x, this.y / vector.y, this.z / vector.z );
        };
        Vector3.prototype.length = function(){
            return Math.sqrt(this.lengthSquared());
        };
        Vector3.prototype.lengthSquared = function(){
            return this.x * this.x + this.y * this.y + this.z * this.z;
        };
        Vector3.prototype.normalize = function(){
            var len = this.length();
            if( len === 0 ) return;
            var num = 1.0 / len;
            this.x *= num;
            this.y *= num;
            this.z *= num;
        };
        Vector3.FromArray = function( array, offset ){
            if( !offset ) offset = 0;
            return new Vector3( array[offset], array[offset + 1], array[offset + 2] );
        };
        Vector3.Zero = function(){
            return new Vector3( 0, 0, 0 );
        };
        Vector3.Up = function(){
            return new Vector3( 0, 1.0, 0 );
        };
        Vector3.Copy = function(vector){
            return new Vector3( vector.x, vector.y, vector.z );
        };
        Vector3.TransformCoordinates = function( vector, transformation ){
            var x = vector.x * transformation.m[0] + vector.y * transformation.m[4] + vector.z * transformation.m[8]  + transformation.m[12];
            var y = vector.x * transformation.m[1] + vector.y * transformation.m[5] + vector.z * transformation.m[9]  + transformation.m[13];
            var z = vector.x * transformation.m[2] + vector.y * transformation.m[6] + vector.z * transformation.m[10] + transformation.m[14];
            var w = vector.x * transformation.m[3] + vector.y * transformation.m[7] + vector.z * transformation.m[11] + transformation.m[15];
            return new Vector3( x / w, y / w, z / w );
        };
        Vector3.TransformNormal = function( vector, transformation ){
            var x = vector.x * transformation.m[0] + vector.y * transformation.m[4] + vector.z * transformation.m[8];
            var y = vector.x * transformation.m[1] + vector.y * transformation.m[5] + vector.z * transformation.m[9];
            var z = vector.x * transformation.m[2] + vector.y * transformation.m[6] + vector.z * transformation.m[10];
            return new Vector3( x, y, z );
        };
        Vector3.Dot = function( left, right ){
            return left.x * right.x + left.y * right.y + left.z * right.z;
        };
        Vector3.Cross = function( left, right ){
            var x = left.y * right.z - left.z * right.y;
            var y = left.z * right.x - left.x * right.z;
            var z = left.x * right.y - left.y * right.x;
            return new Vector3( x, y, z );
        };
        Vector3.Normalize = function(vector){
            var newVector = Vector3.Copy(vector);
            newVector.normalize();
            return newVector;
        };
        Vector3.Distance = function( vector1, vector2 ){
            return Math.sqrt(Vector3.DistanceSquared( vector1, vector2 ));
        };
        Vector3.DistanceSquared = function( vector1, vector2 ){
            var x = vector1.x - vector2.x;
            var y = vector1.y - vector2.y;
            var z = vector1.z - vector2.z;
            return x * x + y * y + z * z;
        };
        return Vector3;
    })();
    SoftEngine.Vector3 = Vector3;

    var Matrix = (function(){
        function Matrix(){
            this.m = [];
        }
        Matrix.prototype.isIdentity = function(){
            return this.equals(Matrix.Identity);
        };
        Matrix.prototype.determinant = function(){
            var temp1 = this.m[10] * this.m[15] - this.m[11] * this.m[14];
            var temp2 = this.m[9]  * this.m[15] - this.m[11] * this.m[13];
            var temp3 = this.m[9]  * this.m[14] - this.m[10] * this.m[13];
            var temp4 = this.m[8]  * this.m[15] - this.m[11] * this.m[12];
            var temp5 = this.m[8]  * this.m[14] - this.m[10] * this.m[12];
            var temp6 = this.m[8]  * this.m[13] - this.m[9]  * this.m[12];
            return ((((this.m[0] * (((this.m[5] * temp1) - (this.m[6] * temp2)) + (this.m[7] * temp3))) - (this.m[1] * (((this.m[4] * temp1) - (this.m[6] * temp4)) + (this.m[7] * temp5)))) + (this.m[2] * (((this.m[4] * temp2) - (this.m[5] * temp4)) + (this.m[7] * temp6)))) - (this.m[3] * (((this.m[4] * temp3) - (this.m[5] * temp5)) + (this.m[6] * temp6))));
        };
        Matrix.prototype.toArray = function(){
            return this.m;
        };
        Matrix.prototype.invert = function () {
            var l1  = this.m[0];
            var l2  = this.m[1];
            var l3  = this.m[2];
            var l4  = this.m[3];
            var l5  = this.m[4];
            var l6  = this.m[5];
            var l7  = this.m[6];
            var l8  = this.m[7];
            var l9  = this.m[8];
            var l10 = this.m[9];
            var l11 = this.m[10];
            var l12 = this.m[11];
            var l13 = this.m[12];
            var l14 = this.m[13];
            var l15 = this.m[14];
            var l16 = this.m[15];
            var l17 = l11 * l16 - l12 * l15;
            var l18 = l10 * l16 - l12 * l14;
            var l19 = l10 * l15 - l11 * l14;
            var l20 = l9 * l16 - l12 * l13;
            var l21 = l9 * l15 - l11 * l13;
            var l22 = l9 * l14 - l10 * l13;
            var l23 = ( l6 * l17 - l7 * l18 ) + ( l8 * l19 );
            var l24 = -( ( l5 * l17 - l7 * l20 ) + ( l8 * l21 ) );
            var l25 = ( l5 * l18 - l6 * l20 ) + ( l8 * l22 );
            var l26 = -( ( l5 * l19 - l6 * l21 ) + ( l7 * l22 ) );
            var l27 = 1.0 / ((((l1 * l23) + (l2 * l24)) + (l3 * l25)) + (l4 * l26));
            var l28 = l7 * l16 - l8 * l15;
            var l29 = l6 * l16 - l8 * l14;
            var l30 = l6 * l15 - l7 * l14;
            var l31 = l5 * l16 - l8 * l13;
            var l32 = l5 * l15 - l7 * l13;
            var l33 = l5 * l14 - l6 * l13;
            var l34 = l7 * l12 - l8 * l11;
            var l35 = l6 * l12 - l8 * l10;
            var l36 = l6 * l11 - l7 * l10;
            var l37 = l5 * l12 - l8 * l9;
            var l38 = l5 * l11 - l7 * l9;
            var l39 = l5 * l10 - l6 * l9;
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
        Matrix.prototype.multiply = function(matrix) {
            var result = new Matrix();
            result.m[0]  = this.m[0]  * matrix.m[0] + this.m[1]  * matrix.m[4] + this.m[2]  * matrix.m[8]  + this.m[3]  * matrix.m[12];
            result.m[1]  = this.m[0]  * matrix.m[1] + this.m[1]  * matrix.m[5] + this.m[2]  * matrix.m[9]  + this.m[3]  * matrix.m[13];
            result.m[2]  = this.m[0]  * matrix.m[2] + this.m[1]  * matrix.m[6] + this.m[2]  * matrix.m[10] + this.m[3]  * matrix.m[14];
            result.m[3]  = this.m[0]  * matrix.m[3] + this.m[1]  * matrix.m[7] + this.m[2]  * matrix.m[11] + this.m[3]  * matrix.m[15];
            result.m[4]  = this.m[4]  * matrix.m[0] + this.m[5]  * matrix.m[4] + this.m[6]  * matrix.m[8]  + this.m[7]  * matrix.m[12];
            result.m[5]  = this.m[4]  * matrix.m[1] + this.m[5]  * matrix.m[5] + this.m[6]  * matrix.m[9]  + this.m[7]  * matrix.m[13];
            result.m[6]  = this.m[4]  * matrix.m[2] + this.m[5]  * matrix.m[6] + this.m[6]  * matrix.m[10] + this.m[7]  * matrix.m[14];
            result.m[7]  = this.m[4]  * matrix.m[3] + this.m[5]  * matrix.m[7] + this.m[6]  * matrix.m[11] + this.m[7]  * matrix.m[15];
            result.m[8]  = this.m[8]  * matrix.m[0] + this.m[9]  * matrix.m[4] + this.m[10] * matrix.m[8]  + this.m[11] * matrix.m[12];
            result.m[9]  = this.m[8]  * matrix.m[1] + this.m[9]  * matrix.m[5] + this.m[10] * matrix.m[9]  + this.m[11] * matrix.m[13];
            result.m[10] = this.m[8]  * matrix.m[2] + this.m[9]  * matrix.m[6] + this.m[10] * matrix.m[10] + this.m[11] * matrix.m[14];
            result.m[11] = this.m[8]  * matrix.m[3] + this.m[9]  * matrix.m[7] + this.m[10] * matrix.m[11] + this.m[11] * matrix.m[15];
            result.m[12] = this.m[12] * matrix.m[0] + this.m[13] * matrix.m[4] + this.m[14] * matrix.m[8]  + this.m[15] * matrix.m[12];
            result.m[13] = this.m[12] * matrix.m[1] + this.m[13] * matrix.m[5] + this.m[14] * matrix.m[9]  + this.m[15] * matrix.m[13];
            result.m[14] = this.m[12] * matrix.m[2] + this.m[13] * matrix.m[6] + this.m[14] * matrix.m[10] + this.m[15] * matrix.m[14];
            result.m[15] = this.m[12] * matrix.m[3] + this.m[13] * matrix.m[7] + this.m[14] * matrix.m[11] + this.m[15] * matrix.m[15];
            return result;
        };
        Matrix.prototype.equals = function(matrix){
            return this.m[0]  === matrix.m[0]  && this.m[1]  === matrix.m[1]  && this.m[2]  === matrix.m[2]  && this.m[3]  === matrix.m[3]  &&
                this.m[4]  === matrix.m[4]  && this.m[5]  === matrix.m[5]  && this.m[6]  === matrix.m[6]  && this.m[7]  === matrix.m[7]  &&
                this.m[8]  === matrix.m[8]  && this.m[9]  === matrix.m[9]  && this.m[10] === matrix.m[10] && this.m[11] === matrix.m[11] &&
                this.m[12] === matrix.m[12] && this.m[13] === matrix.m[13] && this.m[14] === matrix.m[14] && this.m[15] === matrix.m[15];
        };
        Matrix.FromValues = function( initialM11, initialM12, initialM13, initialM14,
                                      initialM21, initialM22, initialM23, initialM24,
                                      initialM31, initialM32, initialM33, initialM34,
                                      initialM41, initialM42, initialM43, initialM44 ){
            var result = new Matrix();
            result.m[0]  = initialM11;
            result.m[1]  = initialM12;
            result.m[2]  = initialM13;
            result.m[3]  = initialM14;
            result.m[4]  = initialM21;
            result.m[5]  = initialM22;
            result.m[6]  = initialM23;
            result.m[7]  = initialM24;
            result.m[8]  = initialM31;
            result.m[9]  = initialM32;
            result.m[10] = initialM33;
            result.m[11] = initialM34;
            result.m[12] = initialM41;
            result.m[13] = initialM42;
            result.m[14] = initialM43;
            result.m[15] = initialM44;
            return result;
        };
        Matrix.Identity = function(){
            return Matrix.FromValues( 1.0, 0.0, 0.0, 0.0,
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0);
        };
        Matrix.Zero = function(){
            return Matrix.FromValues( 0.0, 0.0, 0.0, 0.0,
                0.0, 0.0, 0.0, 0.0,
                0.0, 0.0, 0.0, 0.0,
                0.0, 0.0, 0.0, 0.0 );
        };
        Matrix.Copy = function(matrix){
            return Matrix.FromValues( matrix.m[0],  matrix.m[1],  matrix.m[2],  matrix.m[3],
                matrix.m[4],  matrix.m[5],  matrix.m[6],  matrix.m[7],
                matrix.m[8],  matrix.m[9],  matrix.m[10], matrix.m[11],
                matrix.m[12], matrix.m[13], matrix.m[14], matrix.m[15] );
        };
        Matrix.RotationX = function(angle){
            var result = Matrix.Zero();
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            result.m[0]  = 1.0;
            result.m[15] = 1.0;
            result.m[5]  = c;
            result.m[10] = c;
            result.m[9]  = -s;
            result.m[6]  = s;
            return result;
        };
        Matrix.RotationY = function(angle){
            var result = Matrix.Zero();
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            result.m[5]  = 1.0;
            result.m[15] = 1.0;
            result.m[0]  = c;
            result.m[2]  = -s;
            result.m[8]  = s;
            result.m[10] = c;
            return result;
        };
        Matrix.RotationZ = function(angle){
            var result = Matrix.Zero();
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            result.m[10] = 1.0;
            result.m[15] = 1.0;
            result.m[0]  = c;
            result.m[1]  = s;
            result.m[4]  = -s;
            result.m[5]  = c;
            return result;
        };
        Matrix.RotationAxis = function( axis, angle ){
            var s = Math.sin(-angle);
            var c = Math.cos(-angle);
            var c1 = 1 - c;
            var result = Matrix.Zero();
            axis.normalize();
            result.m[0]  = ( axis.x * axis.x ) * c1 + c;
            result.m[1]  = ( axis.x * axis.y ) * c1 - ( axis.z * s );
            result.m[2]  = ( axis.x * axis.z ) * c1 + ( axis.y * s );
            result.m[3]  = 0.0;
            result.m[4]  = ( axis.y * axis.x ) * c1 + ( axis.z * s );
            result.m[5]  = ( axis.y * axis.y ) * c1 + c;
            result.m[6]  = ( axis.y * axis.z ) * c1 - ( axis.x * s );
            result.m[7]  = 0.0;
            result.m[8]  = ( axis.z * axis.x ) * c1 - ( axis.y * s );
            result.m[9]  = ( axis.z * axis.y ) * c1 + ( axis.x * s );
            result.m[10] = ( axis.z * axis.z ) * c1 + c;
            result.m[11] = 0.0;
            result.m[15] = 1.0;
            return result;
        };
        Matrix.RotationYawPitchRoll = function( yaw, pitch, roll ){
            return Matrix.RotationZ(roll).multiply(Matrix.RotationX(pitch)).multiply(Matrix.RotationY(yaw));
        };
        Matrix.Scaling = function( x, y, z ){
            var result = Matrix.Zero();
            result.m[0]  = x;
            result.m[5]  = y;
            result.m[10] = z;
            result.m[15] = 1.0;
            return result;
        };
        Matrix.Translation = function( x, y, z ){
            var result = Matrix.Identity();
            result.m[12] = x;
            result.m[13] = y;
            result.m[14] = z;
            return result;
        };
        Matrix.LookAtLH = function( eye, target, up ){
            var zAxis = target.subtract(eye);
            zAxis.normalize();
            var xAxis = Vector3.Cross( up, zAxis);
            xAxis.normalize();
            var yAxis = Vector3.Cross( zAxis, xAxis);
            yAxis.normalize();
            var ex = -Vector3.Dot( xAxis, eye );
            var ey = -Vector3.Dot( yAxis, eye );
            var ez = -Vector3.Dot( zAxis, eye );
            return Matrix.FromValues( xAxis.x, yAxis.x, zAxis.x, 0,
                xAxis.y, yAxis.y, zAxis.y, 0,
                xAxis.z, yAxis.z, zAxis.z, 0,
                ex,      ey,      ez,      1 );
        };
        Matrix.PerspectiveLH = function( width, height, znear, zfar ){
            var result = Matrix.Zero();
            result.m[0] = ( 2.0 * znear ) / width;
            result.m[5] = ( 2.0 * znear ) / height;
            result.m[10] = -zfar / ( znear - zfar );
            result.m[11] = 1.0;
            result.m[14] = ( znear * zfar ) / ( znear - zfar );
            return result;
        };
        Matrix.PerspectiveFovLH = function( fov, aspect, znear, zfar ){
            var result = Matrix.Zero();
            var tan = 1.0 / Math.tan( fov * 0.5 );
            result.m[0] = tan / aspect;
            result.m[5] = tan;
            result.m[10] = -zfar / ( znear - zfar );
            result.m[11] = 1.0;
            result.m[14] = ( znear * zfar ) / ( znear - zfar );
            return result;
        };
        Matrix.Transpose = function( matrix ){
            var result = new Matrix();
            result.m[0]  = matrix.m[0];
            result.m[1]  = matrix.m[4];
            result.m[2]  = matrix.m[8];
            result.m[3]  = matrix.m[12];
            result.m[4]  = matrix.m[1];
            result.m[5]  = matrix.m[5];
            result.m[6]  = matrix.m[9];
            result.m[7]  = matrix.m[13];
            result.m[8]  = matrix.m[2];
            result.m[9]  = matrix.m[6];
            result.m[10] = matrix.m[10];
            result.m[11] = matrix.m[14];
            result.m[12] = matrix.m[3];
            result.m[13] = matrix.m[7];
            result.m[14] = matrix.m[11];
            result.m[15] = matrix.m[15];
            return result;
        }
        return Matrix;
    })();
    SoftEngine.Matrix = Matrix;

    var Camera = (function(){
        function Camera(){
            this.Position = Vector3.Zero();
            this.Target = Vector3.Zero();
        }
        return Camera;
    })();
    SoftEngine.Camera = Camera;

    var Mesh = (function(){
        function Mesh( name, verticesCount, facesCount ){
            this.name = name;
            this.Vertices = new Array(verticesCount);
            this.Faces = new Array(facesCount);
            this.Rotation = Vector3.Zero();
            this.Position = Vector3.Zero();
        }
        Mesh.prototype.computeFacesNormals = function(){
            for( var indexFaces = 0; indexFaces < this.Faces.length; indexFaces++ ){
                var currentFace = this.Faces[indexFaces];

                var vertexA = this.Vertices[currentFace.A];
                var vertexB = this.Vertices[currentFace.B];
                var vertexC = this.Vertices[currentFace.C];

                this.Faces[indexFaces].Normal = ( vertexA.Normal.add( vertexB.Normal.add( vertexC.Normal ) ) ).scale( 1 / 3 );
                this.Faces[indexFaces].Normal.normalize();
            }
        };
        return Mesh;
    })();
    SoftEngine.Mesh = Mesh;

    var Texture = (function(){
        // 고정 크기의 Texture 사용 ( 512x512, 1024x1024, ... )
        function Texture( filename, width, height ){
            this.width = width;
            this.height = height;
            this.load(filename);
        }
        Texture.prototype.load = function(filename){
            var _this = this;
            var imageTexture = new Image();
            imageTexture.height = this.height;
            imageTexture.width = this.width;
            imageTexture.onload = function(){
                var internalCanvas = document.createElement('canvas');
                internalCanvas.width = _this.width;
                internalCanvas.height = _this.height;
                var internalContext = internalCanvas.getContext('2d');
                internalContext.drawImage( imageTexture, 0, 0 );
                _this.internalBuffer = internalContext.getImageData( 0, 0, _this.width, _this.height );
            };
            imageTexture.src = filename;
        };
        // Blender에서 생성한 U & V 좌표를 사용해 texture에 대응하는 픽셀의 색상을 반환.
        Texture.prototype.map = function( tu, tv ){
            if( this.internalBuffer ){
                // % 연산자를 사용하여 필요시 텍스쳐 반복 처리
                var u = Math.floor( Math.abs( (tu * this.width ) % this.width ) );
                var v = Math.floor( Math.abs( (tv * this.height) % this.height ) );
                var pos = ( u + v * this.width ) * 4;

                var r = this.internalBuffer.data[pos];
                var g = this.internalBuffer.data[pos + 1];
                var b = this.internalBuffer.data[pos + 2];
                var a = this.internalBuffer.data[pos + 3];

                return new Color4( r / 255.0, g / 255.0, b / 255.0, a / 255.0 );
            }
            // 이미지가 아직 로드되지 않은 경우
            else{
                return new Color4( 1, 1, 1, 1 );
            }
        };
        return Texture;
    })();
    SoftEngine.Texture = Texture;

    var Device = (function(){
        function Device(canvas){
            // 참고: back buffer의 크기는 화면에 그리는 픽셀( width * height ) * 4 ( r, g, b, a )와 같다.
            this.workingCanvas = canvas;
            this.workingWidth = canvas.width;
            this.workingHeight = canvas.height;
            this.workingContext = this.workingCanvas.getContext('2d');
            this.depthbuffer = new Array( this.workingWidth * this.workingHeight );
        }
        // 특정 색으로 back buffer를 clear하기 위해 호출.
        Device.prototype.clear = function(){
            // 기본적으로 검은 색으로 clear
            this.workingContext.clearRect( 0, 0, this.workingWidth, this.workingHeight );
            // 일단 검은 색으로 clear한 후, back buffer에 image data를 백업.
            this.backbuffer = this.workingContext.getImageData( 0, 0, this.workingWidth, this.workingHeight );
            // depth buffer 를 clear
            for( var i = 0; i < this.depthbuffer.length; i++ ){
                // 가능한 가장 큰 값으로 할당.
                this.depthbuffer[i] = 10000000;
            }
        };
        // 모든게 준비되었으면 back buffer를 front buffer로 flush.
        Device.prototype.present = function(){
            this.workingContext.putImageData( this.backbuffer, 0, 0 );
        };
        // 특정 x, y 좌표에 픽셀을 삽입.
        Device.prototype.putPixel = function( x, y, z, color ){
            this.backbufferdata = this.backbuffer.data;
            // back buffer의 data 배열에서 cell index를 얻어온다.
            var index = ( Math.floor(x) + Math.floor(y) * this.workingWidth );
            var index4 = index * 4;

            if( this.depthbuffer[index] < z ){
                return; // z가 뒤에 있다면 그리지 않는다.
            }

            this.depthbuffer[index] = z;

            // 배열의 RGBA를 할당
            this.backbufferdata[index4]     = color.r * 255;
            this.backbufferdata[index4 + 1] = color.g * 255;
            this.backbufferdata[index4 + 2] = color.b * 255;
            this.backbufferdata[index4 + 3] = color.a * 255;
        };
        // 얻어온 3D 좌표들을 transform matrix를 이용하여 2D 좌표로 변환.
        // 또한 같은 좌표들과 normal들을 3D world의 정점으로 변환.
        Device.prototype.project = function( vertex, transMat, world ){
            // 좌표를 2D 공간으로 변환.
            var point2d = Vector3.TransformCoordinates( vertex.Coordinates, transMat );
            // 좌표와 normal을 3D World 정점으로 변환
            var point3DWorld = Vector3.TransformCoordinates( vertex.Coordinates, world );
            var normal3DWorld = Vector3.TransformCoordinates( vertex.Normal, world );

            // 변환된 좌표는 화면의 중앙의 시작 좌표를 가지고 있으나.
            // 좌상단이 0, 0인 일반적인 좌표로 변환.
            var x = point2d.x * this.workingWidth + this.workingWidth / 2.0;
            var y = -point2d.y * this.workingHeight + this.workingHeight / 2.0;

            return {
                Coordinates: new Vector3( x, y, point2d.z ),
                Normal:normal3DWorld,
                WorldCoordinates:point3DWorld,
                TextureCoordinates:vertex.TextureCoordinates
            };
        };
        // putPixel 을 호출하기 전에 영역을 체크.
        Device.prototype.drawPoint = function( point, color ){
            // screen 상에 보여지는지 체크
            if( point.x >= 0 && point.y >= 0 && point.x < this.workingWidth && point.y < this.workingHeight ){
                // point를 그린다.
                this.putPixel( point.x, point.y, point.z, color );
            }
        };
        // 0과 1사이의 값으로 Clamping
        Device.prototype.clamp = function( value, min, max ){
            if( typeof min === 'undefined' ) min = 0;
            if( typeof max === 'undefined' ) max = 1;
            return Math.max( min, Math.min( value, max ) );
        };
        // 두 Vertex 사이의 값을 보간
        // min은 시작점, max는 끝점.
        // gradient는 두 점 사이의 %
        Device.prototype.interpolate = function( min, max, gradient ){
            return min + ( max - min ) * this.clamp(gradient);
        };
        // light vector와 normal vector 사이의 각도의 코사인을 연산
        // 0과 1 사이의 값을 반환
        Device.prototype.computeNDotL = function( vertex, normal, lightPosition ){
            var lightDirection = lightPosition.subtract(vertex);
            normal.normalize();
            lightDirection.normalize();
            return Math.max( 0, Vector3.Dot( normal, lightDirection ) );
        };
        // 좌에서 우로 2 점 사이에 라인을 그린다.
        // papd -> pcpd
        // pa, pb, pc, pd 는 정렬된 상태여야 한다.
        Device.prototype.processScanLine = function( data, va, vb, vc, vd, color, texture ){
            var pa = va.Coordinates;
            var pb = vb.Coordinates;
            var pc = vc.Coordinates;
            var pd = vd.Coordinates;

            // Y 덕분에 starting X( sx ) 또는 ending X ( ex ) 처럼 다른 값을 계산하기 위한 gradient를 계산 할 수가 있다.
            // pa.Y가 pb.Y와 같거나 pc.Y가 pd.Y와 같다면 gradient는 강제로 1로 처리.
            var gradient1 = pa.y != pb.y ? ( data.currentY - pa.y ) / ( pb.y - pa.y ) : 1;
            var gradient2 = pc.y != pd.y ? ( data.currentY - pc.y ) / ( pd.y - pc.y ) : 1;

            var sx = Math.floor(this.interpolate( pa.x, pb.x, gradient1 ));
            var ex = Math.floor(this.interpolate( pc.x, pd.x, gradient2 ));

            // 시작 Z & 종료 Z
            var z1 = this.interpolate( pa.z, pb.z, gradient1 );
            var z2 = this.interpolate( pc.z, pd.z, gradient2 );

            // Y 상의 normal 보간
            var snl = this.interpolate( data.ndotla, data.ndotlb, gradient1 );
            var enl = this.interpolate( data.ndotlc, data.ndotld, gradient2 );

            // Y 상의 텍스쳐 좌표 보간
            var su = this.interpolate( data.ua, data.ub, gradient1 );
            var eu = this.interpolate( data.uc, data.ud, gradient2 );
            var sv = this.interpolate( data.va, data.vb, gradient1 );
            var ev = this.interpolate( data.vc, data.vd, gradient2 );

            // 좌측( sx )에서 우측( ex )으로 라인을 그린다.
            for( var x = sx; x < ex; x++ ){
                var gradient = ( x - sx ) / ( ex - sx );

                // X상의 Z, normal, texture 좌표를 보간.
                var z = this.interpolate( z1, z2, gradient );
                var ndotl = this.interpolate( snl, enl, gradient );
                var u = this.interpolate( su, eu, gradient );
                var v = this.interpolate( sv, ev, gradient );

                var textureColor;

                if(texture){
                    textureColor = texture.map( u, v );
                }else{
                    textureColor = new Color4( 1, 1, 1, 1 );
                }

                // color 값을 texture 컬러와 조명 vector, normal vector 사이각의 코사인을 사용하도록 변경.
                this.drawPoint( new Vector3( x, data.currentY, z ),
                    new Color4( color.r * ndotl * textureColor.r,
                                color.g * ndotl * textureColor.g,
                                color.b * ndotl * textureColor.b,
                                1 )
                );
            }
        };
        Device.prototype.drawTriangle = function( v1, v2, v3, color, texture ){
            // 순서대로 점들을 정렬하기 위해 p1, p2, p3은 스크린상에서 같은 순서이어야 한다.
            // p1은 항상 상단에 위치. ( Y값이 가장 작은 )
            // p2는 p1과 p3 사이에 위치. ( Y값이 )
            var temp;
            if( v1.Coordinates.y > v2.Coordinates.y ){
                temp = v2;
                v2 = v1;
                v1 = temp;
            }
            if( v2.Coordinates.y > v3.Coordinates.y ){
                temp = v2;
                v2 = v3;
                v3 = temp;
            }
            if( v1.Coordinates.y > v2.Coordinates.y ){
                temp = v2;
                v2 = v1;
                v1 = temp;
            }
            var p1 = v1.Coordinates;
            var p2 = v2.Coordinates;
            var p3 = v3.Coordinates;

            // light 위치
            var lightPos = new Vector3( 0, 10, 10 );

            // light vector와 normal vector 사이각의 코사인을 계산하여
            // 0과 1사의 값으로 색의 강도로 사용
            var nl1 = this.computeNDotL( v1.WorldCoordinates, v1.Normal, lightPos );
            var nl2 = this.computeNDotL( v2.WorldCoordinates, v2.Normal, lightPos );
            var nl3 = this.computeNDotL( v3.WorldCoordinates, v3.Normal, lightPos );
            var data = {};

            // 라인의 방향을 계산
            var dP1P2, dP1P3;

            // http://en.wikipedia.org/wiki/Slope
            // 경사면을 계산
            if( p2.y - p1.y > 0 ){
                dP1P2 = ( p2.x - p1.x ) / ( p2.y - p1.y );
            }else{
                dP1P2 = 0;
            }
            if( p3.y - p1.y > 0 ){
                dP1P3 = ( p3.x - p1.x ) / ( p3.y - p1.y );
            }else{
                dP1P3 = 0;
            }

            var y;

            // P1
            // -
            // --
            // - -
            // -  -
            // -   - P2
            // -  -
            // - -
            // --
            // -
            // P3
            if( dP1P2 > dP1P3 ){
                for( y = Math.floor(p1.y); y <= Math.floor(p3.y); y++ ){
                    data.currentY = y;

                    if( y < p2.y ){
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

                        this.processScanLine( data, v1, v3, v1, v2, color, texture );
                    }else{
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

                        this.processScanLine( data, v1, v3, v2, v3, color, texture );
                    }
                }
            }
            //       P1
            //        -
            //       --
            //      - -
            //     -  -
            // P2 -   -
            //     -  -
            //      - -
            //       --
            //        -
            //       P3
            else{
                for( y = Math.floor(p1.y); y <= Math.floor(p3.y); y++ ){
                    data.currentY = y;

                    if( y < p2.y ){
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

                        this.processScanLine( data, v1, v2, v1, v3, color, texture );
                    }else{
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

                        this.processScanLine( data, v2, v3, v1, v3, color, texture );
                    }
                }
            }
        };
        Device.prototype.drawLine = function( point0, point1 ){
            // 두 점 사이의 거리.
            var dist = point1.subtract(point0).length();
            // 두 점 사이의 거리가 2 pixel 보다 작다면 중단.
            if( dist < 2 ) return;
            // 두 점 사이의 가운데 점을 찾아냄.
            var middlePoint = point0.add( point1.subtract(point0).scale(0.5) );
            // 가운데 점을 screen에 그린다.
            this.drawPoint(middlePoint);
            // 첫번째 점과 가운데 점 사이와 가운데 점과 두번째 점 사이에 점을 재귀호출.
            this.drawLine( point0, middlePoint );
            this.drawLine( middlePoint, point1 );
        };
        // Bresenham's line algorithm
        // http://en.wikipedia.org/wiki/Bresenham's_line_algorithm
        Device.prototype.drawBline = function( point0, point1 ){
            var x0 = Math.floor(point0.x);
            var y0 = Math.floor(point0.y);
            var x1 = Math.floor(point1.x);
            var y1 = Math.floor(point1.y);

            // 거리
            var dx = Math.abs( x1 - x0 );
            var dy = Math.abs( y1 - y0 );

            // 방향.
            var sx = ( x0 < x1 ) ? 1 : -1;
            var sy = ( y0 < y1 ) ? 1 : -1;
            var err = dx - dy;
            while( true ){
                this.drawPoint( new Vector2( x0, y0 ) );
                if( x0 == x1 && y0 == y1 ) break;

                var e2 = 2 * err;
                if( e2 > -dy ){
                    err -= dy;
                    x0 += sx;
                }
                if( e2 < dx ){
                    err += dx;
                    y0 += sy;
                }
            }
        };
        // 각 프레임 사이의 각 vertex의 투영을 연산하는 엔진의 메인 메소드.
        Device.prototype.render = function( camera, meshes ){
            // 이 부분을 이해하기 위해서는 Matrix에 대한 이해가 필요.
            var viewMatrix = Matrix.LookAtLH( camera.Position, camera.Target, Vector3.Up() );
            var projectionMatrix = Matrix.PerspectiveFovLH( 0.78, this.workingWidth / this.workingHeight, 0.01, 1.0 );
            for( var index = 0; index < meshes.length; index++ ){
                // 처리할 mesh.
                var cMesh = meshes[index];

                // transiton 전에 mesh 의 rotation, position이 적용된 matrix를 얻어온다.
                var worldMatrix = Matrix.RotationYawPitchRoll( cMesh.Rotation.y, cMesh.Rotation.x, cMesh.Rotation.z).multiply( Matrix.Translation( cMesh.Position.x, cMesh.Position.y, cMesh.Position.z ) );
                var worldView = worldMatrix.multiply(viewMatrix);

                // view matrix와 projection matrix를 적용한 matrix를 얻어온다.
                var transformMatrix = worldView.multiply(projectionMatrix);

                for( var indexFaces = 0; indexFaces < cMesh.Faces.length; indexFaces++ ){
                    // 그릴 삼각형 평면.
                    var currentFace = cMesh.Faces[indexFaces];

                    var transformedNormal = Vector3.TransformNormal( currentFace.Normal, worldView );

                    if( transformedNormal.z < 0 ){
                        var vertexA = cMesh.Vertices[currentFace.A];
                        var vertexB = cMesh.Vertices[currentFace.B];
                        var vertexC = cMesh.Vertices[currentFace.C];

                        // 3D 좌표 A, B, C를 2D 좌표 공간에 투영.
                        var pixelA = this.project( vertexA, transformMatrix, worldMatrix );
                        var pixelB = this.project( vertexB, transformMatrix, worldMatrix );
                        var pixelC = this.project( vertexC, transformMatrix, worldMatrix );

                        var color = 1.0;

                        // screen에 draw!
                        this.drawTriangle( pixelA, pixelB, pixelC, new Color4( color, color, color, 1 ), cMesh.Texture );
                    }
                }
            }
        };
        // 비동기로 JSON 파일을 로드하고 파싱하여
        // 생성한 Mesh들의 배열을 callback에 넘겨줌.
        Device.prototype.LoadJSONFileAsync = function( filename, callback ){
            var jsonObject = {};
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open( 'GET', filename, true );
            var that = this;
            xmlhttp.onreadystatechange = function(){
                if( xmlhttp.readyState == 4 && xmlhttp.status == 200 ){
                    jsonObject = JSON.parse(xmlhttp.responseText);
                    callback(that.CreateMeshesFromJSON(jsonObject));
                }
            };
            xmlhttp.send(null);
        };
        Device.prototype.CreateMeshesFromJSON = function(jsonObject){
            var meshes = [];
            var materials = [];

            for( var materialIndex = 0; materialIndex < jsonObject.materials.length; materialIndex++ ){
                var material = {};

                material.Name = jsonObject.materials[materialIndex].name;
                material.ID = jsonObject.materials[materialIndex].id;
                if( jsonObject.materials[materialIndex].diffuseTexture ){
                    material.DiffuseTextureName = 'models/' + jsonObject.materials[materialIndex].diffuseTexture.name;
                }
                materials[material.ID] = material;
            }

            for( var meshIndex = 0; meshIndex < jsonObject.meshes.length; meshIndex++ ){
                var verticesArray = jsonObject.meshes[meshIndex].vertices;
                // Faces
                var indicesArray = jsonObject.meshes[meshIndex].indices;
                var uvCount = jsonObject.meshes[meshIndex].uvCount;
                var verticesStep = 1;

                // Vertex 마다 Texture의 좌표 갯수에 따라
                // Vertex 배열의 6, 8, 10 으로 이동.
                switch(uvCount){
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

                // 필요한 Vertex 정보의 갯수.
                var verticesCount = verticesArray.length / verticesStep;
                // Face의 갯수는 논리적으로 indicesArray 배열의 크기를 3( A, B, C )으로 나눈 숫자.
                var facesCount = indicesArray.length / 3;
                var mesh = new Mesh( jsonObject.meshes[meshIndex].name, verticesCount, facesCount );

                var index;

                // 먼저 Mesh의 Vertex 배열을 처리.
                for( index = 0; index < verticesCount; index++ ){
                    var x = verticesArray[index * verticesStep];
                    var y = verticesArray[index * verticesStep + 1];
                    var z = verticesArray[index * verticesStep + 2];

                    // blender에서 뽑아낸 normal 정보를 처리.
                    var nx = verticesArray[index * verticesStep + 3];
                    var ny = verticesArray[index * verticesStep + 4];
                    var nz = verticesArray[index * verticesStep + 5];

                    mesh.Vertices[index] = {
                        Coordinates: new Vector3( x, y, z ),
                        Normal: new Vector3( nx, ny, nz )
                    };

                    if( uvCount > 0 ){
                        // 텍스쳐 좌표를 얻어옴
                        var u = verticesArray[index * verticesStep + 6];
                        var v = verticesArray[index * verticesStep + 7];
                        mesh.Vertices[index].TextureCoordinates = new Vector2( u, v );
                    }else{
                        mesh.Vertices[index].TextureCoordinates = new Vector2( 0, 0 );
                    }
                }

                // Face 배열을 처리.
                for( index = 0; index < facesCount; index++ ){
                    var a = indicesArray[index * 3];
                    var b = indicesArray[index * 3 + 1];
                    var c = indicesArray[index * 3 + 2];
                    mesh.Faces[index] = {A:a, B:b, C:c};
                }

                // Blender에서 설정한 position
                var position = jsonObject.meshes[meshIndex].position;
                mesh.Position = new Vector3( position[0], position[1], position[2] );

                if( uvCount > 0 ){
                    var meshTextureID = jsonObject.meshes[meshIndex].materialId;
                    var meshTextureName = materials[meshTextureID].DiffuseTextureName;
                    mesh.Texture = new Texture( meshTextureName, 512, 512 );
                }

                mesh.computeFacesNormals();

                meshes.push(mesh);
            }
            return meshes;
        };
        return Device;
    })();
    SoftEngine.Device = Device;
})( SoftEngine || ( SoftEngine = {} ) );
window['requestAnimationFrame'] = (function(){
    return window['requestAnimationFrame'] ||
        window['webkitRequestAnimationFrame'] ||
        window['mozRequestAnimationFrame'] ||
        function(callback){
            window.setTimeout( callback, 1000 / 60 );
        };
})();

module SoftEngine {
    export class Color4 {
        r:number;
        g:number;
        b:number;
        a:number;

        constructor( initialR:number, initialG:number, initialB:number, initialA:number ) {
            this.r = initialR;
            this.g = initialG;
            this.b = initialB;
            this.a = initialA;
        }

        public toString():string {
            return '{R: ' + this.r + ' G:' + this.g + ' B:' + this.b + ' A:' + this.a + '}';
        }
    }

    export class Vector2 {
        x:number;
        y:number;

        constructor( initialX:number, initialY:number ) {
            this.x = initialX;
            this.y = initialY;
        }

        public toString():string {
            return '{X: ' + this.x + ' Y:' + this.y + '}';
        }
        public add( vector:Vector2 ):Vector2 {
            return new Vector2( this.x + vector.x, this.y + vector.y);
        }
        public subtract( vector:Vector2 ):Vector2 {
            return new Vector2( this.x - vector.x, this.y - vector.y );
        }
        public negate():Vector2 {
            return new Vector2( -this.x, -this.y );
        }
        public scale(scale:number):Vector2 {
            return new Vector2( this.x * scale, this.y * scale );
        }
        public equals( vector:Vector2 ):boolean {
            return this.x === vector.x && this.y === vector.y;
        }
        public length():number {
            return Math.sqrt( this.lengthSquared() );
        }
        public lengthSquared():number {
            return this.x * this.x + this.y * this.y;
        }
        public normalize():void {
            var len:number = this.length();
            if (len === 0) {
                return;
            }
            var num:number = 1.0 / len;
            this.x *= num;
            this.y *= num;
        }
        static Zero():Vector2 {
            return new Vector2( 0, 0 );
        }
        static Copy( vector:Vector2 ):Vector2 {
            return new Vector2( vector.x, vector.y);
        }
        static Normalize( vector:Vector2 ):Vector2 {
            var newVector:Vector2 = Vector2.Copy( vector );
            newVector.normalize();
            return newVector;
        }
        static Minimize( left:Vector2, right:Vector2 ):Vector2 {
            var x:number = Math.min( left.x, right.x );
            var y:number = Math.min( left.y, right.y );
            return new Vector2( x, y );
        }
        static Maximize( left:Vector2, right:Vector2 ):Vector2 {
            var x:number = Math.max( left.x, right.x );
            var y:number = Math.max( left.y, right.y );
            return new Vector2( x, y );
        }
        static Transform( vector:Vector2, transformation:Matrix ):Vector2 {
            var x:number = ( vector.x * transformation.m[0] ) + ( vector.y * transformation.m[4] );
            var y:number = ( vector.x * transformation.m[1] ) + ( vector.y * transformation.m[5] );
            return new Vector2( x, y );
        }
        static Distance( vector1:Vector2, vector2:Vector2 ):number {
            return Math.sqrt( Vector2.DistanceSquared( vector1, vector2 ) );
        }
        static DistanceSquared( vector1:Vector2, vector2:Vector2 ):number {
            var x:number = vector1.x - vector2.x;
            var y:number = vector1.y - vector2.y;
            return ( x * x ) + ( y * y );
        }
    }

    export class Vector3 {
        x:number;
        y:number;
        z:number;

        constructor( initialX:number, initialY:number, initialZ:number ) {
            this.x = initialX;
            this.y = initialY;
            this.z = initialZ;
        }

        public toString():string {
            return '{X: ' + this.x + ' Y:' + this.y + ' Z:' + this.z + '}';
        }
        public add( vector:Vector3 ):Vector3 {
            return new Vector3( this.x + vector.x, this.y + vector.y, this.z + vector.z );
        }
        public subtract( vector:Vector3):Vector3 {
            return new Vector3( this.x - vector.x, this.y - vector.y, this.z - vector.z );
        }
        public negate():Vector3 {
            return new Vector3( -this.x, -this.y, -this.z );
        }
        public scale(scale:number): Vector3 {
            return new Vector3( this.x * scale, this.y * scale, this.z * scale );
        }
        public equals( vector:Vector3 ):boolean {
            return this.x === vector.x && this.y === vector.y && this.z === vector.z;
        }
        public multiply( vector:Vector3 ):Vector3 {
            return new Vector3( this.x * vector.x, this.y * vector.y, this.z * vector.z );
        }
        public divide( vector:Vector3 ):Vector3 {
            return new Vector3( this.x / vector.x, this.y / vector.y, this.z / vector.z );
        }
        public length():number {
            return Math.sqrt( this.lengthSquared() );
        }
        public lengthSquared():number {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        }
        public normalize():void {
            var len:number = this.length();
            if (len === 0) {
                return;
            }
            var num:number = 1.0 / len;
            this.x *= num;
            this.y *= num;
            this.z *= num;
        }

        static FromArray( array:number[], offset:number = 0 ):Vector3 {
            return new Vector3( array[offset], array[offset + 1], array[offset + 2] );
        }
        static Zero():Vector3 {
            return new Vector3( 0, 0, 0 );
        }
        static Up():Vector3 {
            return new Vector3( 0, 1, 0 );
        }
        static Copy( vector:Vector3 ):Vector3 {
            return new Vector3( vector.x, vector.y, vector.z );
        }
        static TransformCoordinates( vector:Vector3, transformation:Matrix ):Vector3 {
            var x:number = ( vector.x * transformation.m[0] ) + ( vector.y * transformation.m[4] ) + ( vector.z * transformation.m[8] ) + transformation.m[12];
            var y:number = ( vector.x * transformation.m[1] ) + ( vector.y * transformation.m[5] ) + ( vector.z * transformation.m[9] ) + transformation.m[13];
            var z:number = ( vector.x * transformation.m[2] ) + ( vector.y * transformation.m[6] ) + ( vector.z * transformation.m[10] ) + transformation.m[14];
            var w:number = ( vector.x * transformation.m[3] ) + ( vector.y * transformation.m[7] ) + ( vector.z * transformation.m[11] ) + transformation.m[15];
            return new Vector3( x / w, y / w, z / w );
        }
        static TransformNormal( vector:Vector3, transformation:Matrix ):Vector3 {
            var x:number = ( vector.x * transformation.m[0] ) + ( vector.y * transformation.m[4] ) + ( vector.z * transformation.m[8] );
            var y:number = ( vector.x * transformation.m[1] ) + ( vector.y * transformation.m[5] ) + ( vector.z * transformation.m[9] );
            var z:number = ( vector.x * transformation.m[2] ) + ( vector.y * transformation.m[6] ) + ( vector.z * transformation.m[10] );
            return new Vector3(x, y, z);
        }
        static Dot( left:Vector3, right:Vector3 ):number {
            return left.x * right.x + left.y * right.y + left.z * right.z;
        }
        static Cross( left:Vector3, right:Vector3 ):Vector3 {
            var x:number = left.y * right.z - left.z * right.y;
            var y:number = left.z * right.x - left.x * right.z;
            var z:number = left.x * right.y - left.y * right.x;
            return new Vector3( x, y, z );
        }
        static Normalize( vector:Vector3 ):Vector3 {
            var newVector:Vector3 = Vector3.Copy( vector );
            newVector.normalize();
            return newVector;
        }
        static Distance( vector1:Vector3, vector2:Vector3 ):number {
            return Math.sqrt( Vector3.DistanceSquared( vector1, vector2 ) );
        }
        static DistanceSquared( vector1:Vector3, vector2:Vector3 ):number {
            var x:number = vector1.x - vector2.x;
            var y:number = vector1.y - vector2.y;
            var z:number = vector1.z - vector2.z;
            return ( x * x ) + ( y * y ) + ( z * z );
        }
    }

    export class Matrix {
        m:number[];

        constructor() {
            this.m = [];
        }

        public isIdentity():boolean {
            return this.equals( Matrix.Identity() );
        }
        public determinant():number {
            var temp1:number = ( this.m[10] * this.m[15] ) - ( this.m[11] * this.m[14] );
            var temp2:number = ( this.m[9] * this.m[15] ) - ( this.m[11] * this.m[13] );
            var temp3:number = ( this.m[9] * this.m[14] ) - ( this.m[10] * this.m[13] );
            var temp4:number = ( this.m[8] * this.m[15] ) - ( this.m[11] * this.m[12] );
            var temp5:number = ( this.m[8] * this.m[14] ) - ( this.m[10] * this.m[12] );
            var temp6:number = ( this.m[8] * this.m[13] ) - ( this.m[9] * this.m[12] );
            return ((((this.m[0] * (((this.m[5] * temp1) - (this.m[6] * temp2)) + (this.m[7] * temp3))) - (this.m[1] * (((this.m[4] * temp1) - (this.m[6] * temp4)) + (this.m[7] * temp5)))) + (this.m[2] * (((this.m[4] * temp2) - (this.m[5] * temp4)) + (this.m[7] * temp6)))) - (this.m[3] * (((this.m[4] * temp3) - (this.m[5] * temp5)) + (this.m[6] * temp6))));
        }
        public toArray():number[] {
            return this.m;
        }
        public invert():void {
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
        }
        public multiply( matrix:Matrix):Matrix {
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
        }
        public equals( value:Matrix ):boolean {
            return this.m[0] === value.m[0] && this.m[1] === value.m[1] && this.m[2] === value.m[2] && this.m[3] === value.m[3] && this.m[4] === value.m[4] && this.m[5] === value.m[5] && this.m[6] === value.m[6] && this.m[7] === value.m[7] && this.m[8] === value.m[8] && this.m[9] === value.m[9] && this.m[10] === value.m[10] && this.m[11] === value.m[11] && this.m[12] === value.m[12] && this.m[13] === value.m[13] && this.m[14] === value.m[14] && this.m[15] === value.m[15];
        }
        static FromValues( initialM11:number, initialM12:number, initialM13:number, initialM14:number, initialM21:number, initialM22:number, initialM23:number, initialM24:number, initialM31:number, initialM32:number, initialM33:number, initialM34:number, initialM41:number, initialM42:number, initialM43:number, initialM44:number):Matrix {
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
        }
        static Identity():Matrix {
            return Matrix.FromValues( 1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0 );
        }
        static Zero():Matrix {
            return Matrix.FromValues( 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 );
        }
        static Copy( matrix:Matrix):Matrix {
            return Matrix.FromValues( matrix.m[0], matrix.m[1], matrix.m[2], matrix.m[3], matrix.m[4], matrix.m[5], matrix.m[6], matrix.m[7], matrix.m[8], matrix.m[9], matrix.m[10], matrix.m[11], matrix.m[12], matrix.m[13], matrix.m[14], matrix.m[15] );
        }
        static RotationX( angle:number ):Matrix {
            var result:Matrix = Matrix.Zero();
            var s:number = Math.sin( angle );
            var c:number = Math.cos( angle );
            result.m[0] = 1.0;
            result.m[15] = 1.0;
            result.m[5] = c;
            result.m[10] = c;
            result.m[9] = -s;
            result.m[6] = s;
            return result;
        }
        static RotationY( angle:number ):Matrix {
            var result:Matrix = Matrix.Zero();
            var s:number = Math.sin( angle );
            var c:number = Math.cos( angle );
            result.m[5] = 1.0;
            result.m[15] = 1.0;
            result.m[0] = c;
            result.m[2] = -s;
            result.m[8] = s;
            result.m[10] = c;
            return result;
        }
        static RotationZ( angle:number ):Matrix {
            var result:Matrix = Matrix.Zero();
            var s:number = Math.sin( angle );
            var c:number = Math.cos( angle );
            result.m[10] = 1.0;
            result.m[15] = 1.0;
            result.m[0] = c;
            result.m[1] = s;
            result.m[4] = -s;
            result.m[5] = c;
            return result;
        }
        static RotationAxis( axis:Vector3, angle:number ):Matrix {
            var s:number = Math.sin( -angle );
            var c:number = Math.cos( -angle );
            var c1:number = 1 - c;
            axis.normalize();
            var result:Matrix = Matrix.Zero();
            result.m[0] = ( axis.x * axis.x ) * c1 + c;
            result.m[1] = ( axis.x * axis.y ) * c1 - ( axis.z * s );
            result.m[2] = ( axis.x * axis.z ) * c1 + ( axis.y * s );
            result.m[3] = 0.0;
            result.m[4] = ( axis.y * axis.x ) * c1 + ( axis.z * s );
            result.m[5] = ( axis.y * axis.y ) * c1 + c;
            result.m[6] = ( axis.y * axis.z ) * c1 - ( axis.x * s );
            result.m[7] = 0.0;
            result.m[8] = ( axis.z * axis.x ) * c1 - ( axis.y * s );
            result.m[9] = ( axis.z * axis.y ) * c1 + ( axis.x * s );
            result.m[10] = ( axis.z * axis.z ) * c1 + c;
            result.m[11] = 0.0;
            result.m[15] = 1.0;
            return result;
        }
        static RotationYawPitchRoll( yaw:number, pitch:number, roll:number):Matrix {
            return Matrix.RotationZ( roll ).multiply( Matrix.RotationX( pitch ) ).multiply( Matrix.RotationY( yaw ) );
        }
        static Scaling( x:number, y:number, z:number ):Matrix {
            var result:Matrix = Matrix.Zero();
            result.m[0] = x;
            result.m[5] = y;
            result.m[10] = z;
            result.m[15] = 1.0;
            return result;
        }
        static Translation( x:number, y:number, z:number ):Matrix {
            var result:Matrix = Matrix.Identity();
            result.m[12] = x;
            result.m[13] = y;
            result.m[14] = z;
            return result;
        }
        static LookAtLH( eye:Vector3, target:Vector3, up:Vector3 ):Matrix {
            var zAxis:Vector3 = target.subtract( eye );
            zAxis.normalize();
            var xAxis:Vector3 = Vector3.Cross( up, zAxis );
            xAxis.normalize();
            var yAxis:Vector3 = Vector3.Cross( zAxis, xAxis );
            yAxis.normalize();
            var ex:number = -Vector3.Dot( xAxis, eye );
            var ey:number = -Vector3.Dot( yAxis, eye );
            var ez:number = -Vector3.Dot( zAxis, eye );
            return Matrix.FromValues( xAxis.x, yAxis.x, zAxis.x, 0, xAxis.y, yAxis.y, zAxis.y, 0, xAxis.z, yAxis.z, zAxis.z, 0, ex, ey, ez, 1 );
        }
        static PerspectiveLH( width:number, height:number, znear:number, zfar:number ):Matrix {
            var matrix:Matrix = Matrix.Zero();
            matrix.m[0] = ( 2.0 * znear ) / width;
            matrix.m[1] = matrix.m[2] = matrix.m[3] = 0.0;
            matrix.m[5] = ( 2.0 * znear ) / height;
            matrix.m[4] = matrix.m[6] = matrix.m[7] = 0.0;
            matrix.m[10] = -zfar / ( znear - zfar );
            matrix.m[8] = matrix.m[9] = 0.0;
            matrix.m[11] = 1.0;
            matrix.m[12] = matrix.m[13] = matrix.m[15] = 0.0;
            matrix.m[14] = ( znear * zfar ) / ( znear - zfar );
            return matrix;
        }
        static PerspectiveFovLH( fov:number, aspect:number, znear:number, zfar:number ):Matrix {
            var matrix:Matrix = Matrix.Zero();
            var tan:number = 1.0 / ( Math.tan( fov * 0.5 ) );
            matrix.m[0] = tan / aspect;
            matrix.m[1] = matrix.m[2] = matrix.m[3] = 0.0;
            matrix.m[5] = tan;
            matrix.m[4] = matrix.m[6] = matrix.m[7] = 0.0;
            matrix.m[8] = matrix.m[9] = 0.0;
            matrix.m[10] = -zfar / ( znear - zfar );
            matrix.m[11] = 1.0;
            matrix.m[12] = matrix.m[13] = matrix.m[15] = 0.0;
            matrix.m[14] = ( znear * zfar ) / ( znear - zfar );
            return matrix;
        }
        static Transpose( matrix:Matrix ):Matrix {
            var result:Matrix = new Matrix();
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
        }
    }

    export interface Face {
        A:number;
        B:number;
        C:number;
        Normal?:Vector3;
    }

    export interface Material {
        Name?:string;
        ID?:number;
        DiffuseTextureName?:number;
    }

    export class Camera {
        Position:Vector3;
        Target:Vector3;

        constructor() {
            this.Position = Vector3.Zero();
            this.Target = Vector3.Zero();
        }
    }

    export interface Vertex {
        Normal:Vector3;
        Coordinates:Vector3;
        WorldCoordinates?:Vector3;
        TextureCoordinates?:Vector2;
    }

    export class Mesh {
        Position:Vector3;
        Rotation:Vector3;
        Vertices:Vertex[];
        Faces:Face[];
        Texture:Texture;

        constructor( public name:string, verticesCount:number, facesCount:number) {
            this.Vertices = new Array( verticesCount );
            this.Faces = new Array( facesCount );
            this.Rotation = new Vector3( 0, 0, 0 );
            this.Position = new Vector3( 0, 0, 0 );
        }

        public computeFacesNormals():void {
            for ( var indexFaces = 0; indexFaces < this.Faces.length; indexFaces++ ) {
                var currentFace:Face = this.Faces[indexFaces];

                var vertexA:Vertex = this.Vertices[currentFace.A];
                var vertexB:Vertex = this.Vertices[currentFace.B];
                var vertexC:Vertex = this.Vertices[currentFace.C];

                this.Faces[indexFaces].Normal = ( vertexA.Normal.add( vertexB.Normal.add( vertexC.Normal ) ) ).scale( 1 / 3) ;
                this.Faces[indexFaces].Normal.normalize();
            }
        }
    }

    export class Texture {
        width:number;
        height:number;
        internalBuffer:ImageData;

        constructor( filename:string, width:number, height:number ) {
            this.width = width;
            this.height = height;
            this.load( filename );
        }

        public load( filename:string ):void {
            var imageTexture:HTMLImageElement = new Image();
            imageTexture.height = this.height;
            imageTexture.width = this.width;
            imageTexture.onload = () => {
                var internalCanvas:HTMLCanvasElement = document.createElement("canvas");
                internalCanvas.width = this.width;
                internalCanvas.height = this.height;
                var internalContext:CanvasRenderingContext2D = internalCanvas.getContext("2d");
                internalContext.drawImage( imageTexture, 0, 0 );
                this.internalBuffer = internalContext.getImageData( 0, 0, this.width, this.height );
            };
            imageTexture.src = filename;
        }

        public map( tu:number, tv:number ):Color4 {
            if ( this.internalBuffer ) {
                var u:number = Math.floor( Math.abs( ( ( tu * this.width ) % this.width ) ) );
                var v:number = Math.floor( Math.abs( ( ( tv * this.height ) % this.height ) ) );

                var pos:number = ( u + v * this.width ) * 4;

                var r:number = this.internalBuffer.data[pos];
                var g:number = this.internalBuffer.data[pos + 1];
                var b:number = this.internalBuffer.data[pos + 2];
                var a:number = this.internalBuffer.data[pos + 3];

                return new Color4( r / 255.0, g / 255.0, b / 255.0, a / 255.0 );
            } else {
                return new Color4( 1, 1, 1, 1 );
            }
        }
    }

    export interface ScanLineData {
        currentY?:number;
        ndotla?:number;
        ndotlb?:number;
        ndotlc?:number;
        ndotld?:number;

        ua?:number;
        ub?:number;
        uc?:number;
        ud?:number;

        va?:number;
        vb?:number;
        vc?:number;
        vd?:number;
    }

    export class Device {
        private backbuffer:ImageData;
        private workingCanvas:HTMLCanvasElement;
        private workingContext:CanvasRenderingContext2D;
        private workingWidth:number;
        private workingHeight:number;
        private backbufferdata:Uint8Array;
        private depthbuffer:number[];

        constructor( canvas:HTMLCanvasElement ) {
            this.workingCanvas = canvas;
            this.workingWidth = canvas.width;
            this.workingHeight = canvas.height;
            this.workingContext = this.workingCanvas.getContext( '2d' );
            this.depthbuffer = new Array( this.workingWidth * this.workingHeight );
        }

        public clear():void {
            this.workingContext.clearRect( 0, 0, this.workingWidth, this.workingHeight );
            this.backbuffer = this.workingContext.getImageData( 0, 0, this.workingWidth, this.workingHeight );

            for ( var i = 0; i < this.depthbuffer.length; i++ ) {
                this.depthbuffer[i] = 10000000;
            }
        }

        public putPixel( x:number, y:number, z:number, color:Color4 ):void {
            this.backbufferdata = this.backbuffer.data;
            var index:number = Math.floor( x ) + Math.floor( y ) * this.workingWidth;
            var index4:number = index * 4;

            if ( this.depthbuffer[index] < z ) {
                return;
            }

            this.depthbuffer[index] = z;

            this.backbufferdata[index4] = color.r * 255;
            this.backbufferdata[index4 + 1] = color.g * 255;
            this.backbufferdata[index4 + 2] = color.b * 255;
            this.backbufferdata[index4 + 3] = color.a * 255;
        }

        public drawPoint( point:Vector3, color:Color4):void {
            if ( point.x >= 0 && point.y >= 0 && point.x < this.workingWidth && point.y < this.workingHeight ) {
                this.putPixel( point.x, point.y, point.z, color );
            }
        }

        public present():void {
            this.workingContext.putImageData( this.backbuffer, 0, 0 );
        }

        public clamp( value:number, min:number = 0, max:number = 1 ):number {
            return Math.max( min, Math.min( value, max ) );
        }

        public interpolate( min:number, max:number, gradient:number ) {
            return min + ( max - min ) * this.clamp( gradient );
        }

        public project( vertex:Vertex, transMat:Matrix, world:Matrix ):Vertex {
            var point2d:Vector3 = Vector3.TransformCoordinates( vertex.Coordinates, transMat );
            var point3DWorld:Vector3 = Vector3.TransformCoordinates( vertex.Coordinates, world );
            var normal3DWorld:Vector3 = Vector3.TransformCoordinates( vertex.Normal, world );

            var x:number = point2d.x * this.workingWidth + this.workingWidth / 2.0;
            var y:number = -point2d.y * this.workingHeight + this.workingHeight / 2.0;

            return {
                Coordinates:new Vector3( x, y, point2d.z ),
                Normal:normal3DWorld,
                WorldCoordinates:point3DWorld,
                TextureCoordinates:vertex.TextureCoordinates
            };
        }

        public computeNDotL( vertex:Vector3, normal:Vector3, lightPosition:Vector3):number {
            var lightDirection:Vector3 = lightPosition.subtract( vertex );
            normal.normalize();
            lightDirection.normalize();
            return Math.max( 0, Vector3.Dot( normal, lightDirection ) );
        }

        public processScanLine( data:ScanLineData, va:Vertex, vb:Vertex, vc:Vertex, vd:Vertex, color:Color4, texture?:Texture ):void {
            var pa:Vector3 = va.Coordinates;
            var pb:Vector3 = vb.Coordinates;
            var pc:Vector3 = vc.Coordinates;
            var pd:Vector3 = vd.Coordinates;

            var gradient1:number = pa.y != pb.y ? ( data.currentY - pa.y ) / ( pb.y - pa.y ) : 1;
            var gradient2:number = pc.y != pd.y ? ( data.currentY - pc.y ) / ( pd.y - pc.y ) : 1;

            var sx:number = Math.floor( this.interpolate( pa.x, pb.x, gradient1 ) );
            var ex:number = Math.floor( this.interpolate( pc.x, pd.x, gradient2 ) );

            var z1:number = this.interpolate( pa.z, pb.z, gradient1 );
            var z2:number = this.interpolate( pc.z, pd.z, gradient2 );

            var snl:number = this.interpolate( data.ndotla, data.ndotlb, gradient1 );
            var enl:number = this.interpolate( data.ndotlc, data.ndotld, gradient2 );

            var su:number = this.interpolate( data.ua, data.ub, gradient1 );
            var eu:number = this.interpolate( data.uc, data.ud, gradient2 );
            var sv:number = this.interpolate( data.va, data.vb, gradient1 );
            var ev:number = this.interpolate( data.vc, data.vd, gradient2 );

            for ( var x:number = sx; x < ex; x++ ) {
                var gradient:number = ( x - sx ) / ( ex - sx );

                var z:number = this.interpolate( z1, z2, gradient );
                var ndotl:number = this.interpolate( snl, enl, gradient );
                var u:number = this.interpolate( su, eu, gradient );
                var v:number = this.interpolate( sv, ev, gradient );

                var textureColor:Color4;

                if ( texture ) {
                    textureColor = texture.map(u, v);
                } else {
                    textureColor = new Color4(1, 1, 1, 1);
                }

                this.drawPoint( new Vector3( x, data.currentY, z ), new Color4( color.r * ndotl * textureColor.r, color.g * ndotl * textureColor.g, color.b * ndotl * textureColor.b, 1 ) );
            }
        }

        public drawTriangle( v1:Vertex, v2:Vertex, v3:Vertex, color:Color4, texture?:Texture ):void {
            var temp:Vertex;

            if ( v1.Coordinates.y > v2.Coordinates.y ) {
                temp = v2;
                v2 = v1;
                v1 = temp;
            }

            if ( v2.Coordinates.y > v3.Coordinates.y ) {
                temp = v2;
                v2 = v3;
                v3 = temp;
            }

            if ( v1.Coordinates.y > v2.Coordinates.y ) {
                temp = v2;
                v2 = v1;
                v1 = temp;
            }

            var p1:Vector3 = v1.Coordinates;
            var p2:Vector3 = v2.Coordinates;
            var p3:Vector3 = v3.Coordinates;

            var lightPos:Vector3 = new Vector3(0, 10, 10);

            var nl1:number = this.computeNDotL( v1.WorldCoordinates, v1.Normal, lightPos );
            var nl2:number = this.computeNDotL( v2.WorldCoordinates, v2.Normal, lightPos );
            var nl3:number = this.computeNDotL( v3.WorldCoordinates, v3.Normal, lightPos );

            var data:ScanLineData = {};

            var dP1P2:number;
            var dP1P3:number;

            if ( p2.y - p1.y > 0 ) {
                dP1P2 = (p2.x - p1.x) / (p2.y - p1.y);
            } else {
                dP1P2 = 0;
            }

            if ( p3.y - p1.y > 0 ) {
                dP1P3 = (p3.x - p1.x) / (p3.y - p1.y);
            } else {
                dP1P3 = 0;
            }

            if ( dP1P2 > dP1P3 ) {
                for ( var y:number = Math.floor( p1.y ); y <= Math.floor( p3.y ); y++ ) {
                    data.currentY = y;

                    if ( y < p2.y ) {
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

                        this.processScanLine( data, v1, v3, v2, v3, color, texture );
                    }
                }
            } else {
                for (var y:number = Math.floor( p1.y ); y <= Math.floor( p3.y ); y++ ) {
                    data.currentY = y;

                    if ( y < p2.y ) {
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

                        this.processScanLine( data, v2, v3, v1, v3, color, texture );
                    }
                }
            }
        }

        public render( camera: Camera, meshes: Mesh[] ):void {
            var viewMatrix:Matrix = Matrix.LookAtLH( camera.Position, camera.Target, Vector3.Up() );
            var projectionMatrix:Matrix = Matrix.PerspectiveFovLH( 0.78, this.workingWidth / this.workingHeight, 0.01, 1.0 );

            for ( var index:number = 0; index < meshes.length; index++ ) {
                var cMesh:Mesh = meshes[index];
                var worldMatrix:Matrix = Matrix.RotationYawPitchRoll(
                    cMesh.Rotation.y, cMesh.Rotation.x, cMesh.Rotation.z )
                    .multiply( Matrix.Translation(
                        cMesh.Position.x, cMesh.Position.y, cMesh.Position.z ) );

                var worldView:Matrix = worldMatrix.multiply( viewMatrix );
                var transformMatrix:Matrix = worldView.multiply( projectionMatrix );

                for ( var indexFaces:number = 0; indexFaces < cMesh.Faces.length; indexFaces++ ) {
                    var currentFace:Face = cMesh.Faces[indexFaces];
                    var transformedNormal:Vector3 = Vector3.TransformNormal( currentFace.Normal, worldView );

                    if ( transformedNormal.z < 0 ) {
                        var vertexA:Vertex = cMesh.Vertices[currentFace.A];
                        var vertexB:Vertex = cMesh.Vertices[currentFace.B];
                        var vertexC:Vertex = cMesh.Vertices[currentFace.C];

                        var pixelA:Vertex = this.project( vertexA, transformMatrix, worldMatrix );
                        var pixelB:Vertex = this.project( vertexB, transformMatrix, worldMatrix );
                        var pixelC:Vertex = this.project( vertexC, transformMatrix, worldMatrix );

                        var color = 1.0;
                        this.drawTriangle( pixelA, pixelB, pixelC, new Color4( color, color, color, 1 ), cMesh.Texture );
                    }
                }
            }
        }

        public LoadJSONFileAsync( fileName:string, callback:(result:Mesh[]) => any ):void {
            var jsonObject:any = {};
            var xmlhttp:XMLHttpRequest = new XMLHttpRequest();
            xmlhttp.open( 'GET', fileName, true );
            var that:any = this;
            xmlhttp.onreadystatechange = function () {
                if ( xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
                    jsonObject = JSON.parse( xmlhttp.responseText );
                    callback( that.CreateMeshesFromJSON( jsonObject ) );
                }
            };
            xmlhttp.send( null );
        }

        public CreateMeshesFromJSON( jsonObject:any ):Mesh[] {
            var meshes:Mesh[] = [];
            var materials:Material[] = [];

            for ( var materialIndex:number = 0; materialIndex < jsonObject.materials.length; materialIndex++ ) {
                var material:Material = {};

                material.Name = jsonObject.materials[materialIndex].name;
                material.ID = jsonObject.materials[materialIndex].id;

                if ( jsonObject.materials[materialIndex].diffuseTexture ) {
                    material.DiffuseTextureName = jsonObject.materials[materialIndex].diffuseTexture.name;
                }

                materials[material.ID] = material;
            }

            for ( var meshIndex:number = 0; meshIndex < jsonObject.meshes.length; meshIndex++ ) {
                var verticesArray:number[] = jsonObject.meshes[meshIndex].vertices;
                var indicesArray:number[] = jsonObject.meshes[meshIndex].indices;

                var uvCount:number = jsonObject.meshes[meshIndex].uvCount;
                var verticesStep:number = 1;

                switch ( uvCount ) {
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

                var verticesCount:number = verticesArray.length / verticesStep;
                var facesCount:number = indicesArray.length / 3;
                var mesh:Mesh = new Mesh( jsonObject.meshes[meshIndex].name, verticesCount, facesCount );

                for ( var index:number = 0; index < verticesCount; index++ ) {
                    var x:number = verticesArray[index * verticesStep];
                    var y:number = verticesArray[index * verticesStep + 1];
                    var z:number = verticesArray[index * verticesStep + 2];

                    var nx:number = verticesArray[index * verticesStep + 3];
                    var ny:number = verticesArray[index * verticesStep + 4];
                    var nz:number = verticesArray[index * verticesStep + 5];

                    mesh.Vertices[index] = {
                        Coordinates:new Vector3( x, y, z ),
                        Normal:new Vector3( nx, ny, nz )
                    };

                    if ( uvCount > 0 ) {
                        var u:number = verticesArray[index * verticesStep + 6];
                        var v:number = verticesArray[index * verticesStep + 7];
                        mesh.Vertices[index].TextureCoordinates = new Vector2( u, v );
                    } else {
                        mesh.Vertices[index].TextureCoordinates = new Vector2( 0, 0 );
                    }
                }

                for ( var index:number = 0; index < facesCount; index++ ) {
                    var a:number = indicesArray[index * 3];
                    var b:number = indicesArray[index * 3 + 1];
                    var c:number = indicesArray[index * 3 + 2];
                    mesh.Faces[index] = {A: a, B: b, C: c};
                }

                var position:number[] = jsonObject.meshes[meshIndex].position;
                mesh.Position = new Vector3( position[0], position[1], position[2] );

                if ( uvCount > 0 ) {
                    var meshTextureID:string = jsonObject.meshes[meshIndex].materialId;
                    var meshTextureName:string = <string>materials[meshTextureID].DiffuseTextureName;
                    mesh.Texture = new Texture( '../models/' + meshTextureName, 512, 512);
                }

                mesh.computeFacesNormals();

                meshes.push(mesh);
            }
            return meshes;
        }
    }
}
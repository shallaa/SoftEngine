/**
 * Created by JunHo on 2015-03-29.
 */
var SoftEngine;
(function(SoftEngine){
    var Device = (function(){
        function Device(canvas){
            this.workingCanvas = canvas;
            this.workingWidth = canvas.width;
            this.workingHeight = canvas.height;
            this.workingContext = this.workingCanvas.getContext('2d');
        }
        Device.prototype.clear = function(){
            this.workingContext.clearRect( 0, 0, this.workingWidth, this.workingHeight );
            this.backbuffer = this.workingContext.getImageData( 0, 0, this.workingWidth, this.workingHeight );
        };
        Device.prototype.present = function(){
            this.workingContext.putImageData( this.backbuffer, 0, 0 );
        };
        Device.prototype.putPixel = function( x, y, color ){
            this.backbufferdata = this.backbuffer.data;
            var index = ( ( x >> 0 ) + ( y >> 0 ) * this.workingWidth ) * 4;
            this.backbufferdata[index] = color.r * 255;
            this.backbufferdata[index + 1] = color.g * 255;
            this.backbufferdata[index + 2] = color.b * 255;
            this.backbufferdata[index + 3] = color.a * 255;
        };
        Device.prototype.project = function( coord, transMat ){
            var point = BABYLON.Vector3.TransformCoordinates( coord, transMat );
            var x = point.x * this.workingWidth + this.workingWidth / 2.0 >> 0;
            var y = -point.y * this.workingHeight + this.workingHeight / 2.0 >> 0;
            return new BABYLON.Vector2( x, y );
        };
        Device.prototype.drawPoint = function(point){
            if( point.x >= 0 && point.y >= 0 && point.x < this.workingWidth && point.y < this.workingHeight ){
                this.putPixel( point.x, point.y, new BABYLON.Color4( 1, 1, 0, 1 ) );
            }
        };
        Device.prototype.drawLine = function( point0, point1 ){
            var dist = point1.subtract(point0).length();
            if( dist < 2 ) return;
            var middlePoint = point0.add( point1.subtract(point0).scale(0.5) );
            this.drawPoint(middlePoint);
            this.drawLine( point0, middlePoint );
            this.drawLine( middlePoint, point1 );
        };
        Device.prototype.drawBline = function( point0, point1 ){
            var x0 = point0.x >> 0;
            var y0 = point0.y >> 0;
            var x1 = point1.x >> 0;
            var y1 = point1.y >> 0;
            var dx = Math.abs( x1 - x0 );
            var dy = Math.abs( y1 - y0 );
            var sx = ( x0 < x1 ) ? 1 : -1;
            var sy = ( y0 < y1 ) ? 1 : -1;
            var err = dx - dy;
            while( true ){
                this.drawPoint( new BABYLON.Vector2( x0, y0 ) );
                if( x0 == x1 && y0 == y1 ){
                    break;
                }
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
        Device.prototype.render = function( camera, meshes ){
            var viewMatrix = BABYLON.Matrix.LookAtLH( camera.Position, camera.Target, BABYLON.Vector3.Up() );
            var projectionMatrix = BABYLON.Matrix.PerspectiveFovLH( 0.78, this.workingWidth / this.workingHeight, 0.01, 1.0 );
            var i = 0, j = meshes.length, k, l;
            for( ; i < j; i++ ){
                var cMesh = meshes[i];
                var worldMatrix = BABYLON.Matrix.RotationYawPitchRoll( cMesh.Rotation.y, cMesh.Rotation.x, cMesh.Rotation.z).multiply(
                    BABYLON.Matrix.Translation( cMesh.Position.x, cMesh.Position.y, cMesh.Position.z )
                );
                var transformMatrix = worldMatrix.multiply(viewMatrix).multiply(projectionMatrix);
                k = 0, l = cMesh.Faces.length;
                for( ; k < l; k++ ){
                    var currentFace = cMesh.Faces[k];
                    var vertexA = cMesh.Vertices[currentFace.A];
                    var vertexB = cMesh.Vertices[currentFace.B];
                    var vertexC = cMesh.Vertices[currentFace.C];
                    var pixelA = this.project( vertexA, transformMatrix );
                    var pixelB = this.project( vertexB, transformMatrix );
                    var pixelC = this.project( vertexC, transformMatrix );
                    this.drawBline( pixelA, pixelB );
                    this.drawBline( pixelB, pixelC );
                    this.drawBline( pixelC, pixelA );
                }
            }
        };
        return Device;
    })();
    SoftEngine.Device = Device;

    var Camera = (function(){
        function Camera(){
            this.Position = BABYLON.Vector3.Zero();
            this.Target = BABYLON.Vector3.Zero();
        }
        return Camera;
    })();
    SoftEngine.Camera = Camera;

    var Mesh = (function(){
        function Mesh( name, verticesCount, facesCount ){
            this.name = name;
            this.Vertices = new Array(verticesCount);
            this.Faces = new Array(facesCount);
            this.Rotation = BABYLON.Vector3.Zero();
            this.Position = BABYLON.Vector3.Zero();
        }
        return Mesh;
    })();
    SoftEngine.Mesh = Mesh;
})( SoftEngine || ( SoftEngine = {} ) );
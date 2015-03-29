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
            this.depthbuffer = new Array( this.workingWidth * this.workingHeight );
        }
        Device.prototype.clear = function(){
            this.workingContext.clearRect( 0, 0, this.workingWidth, this.workingHeight );
            this.backbuffer = this.workingContext.getImageData( 0, 0, this.workingWidth, this.workingHeight );
            var i = 0, j = this.depthbuffer.length;
            for( ; i < j; i++ ){
                this.depthbuffer[i] = 10000000;
            }
        };
        Device.prototype.present = function(){
            this.workingContext.putImageData( this.backbuffer, 0, 0 );
        };
        Device.prototype.putPixel = function( x, y, z, color ){
            this.backbufferdata = this.backbuffer.data;
            var index = ( x >> 0 ) + ( y >> 0 ) * this.workingWidth;
            var index4 = index * 4;

            if( this.depthbuffer[index] < z ){
                return;
            }

            this.depthbuffer[index] = z;

            this.backbufferdata[index4] = color.r * 255;
            this.backbufferdata[index4 + 1] = color.g * 255;
            this.backbufferdata[index4 + 2] = color.b * 255;
            this.backbufferdata[index4 + 3] = color.a * 255;
        };
        Device.prototype.project = function( coord, transMat ){
            var point = BABYLON.Vector3.TransformCoordinates( coord, transMat );
            var x = point.x * this.workingWidth + this.workingWidth / 2.0;
            var y = -point.y * this.workingHeight + this.workingHeight / 2.0;
            return new BABYLON.Vector3( x, y, point.z );
        };
        Device.prototype.drawPoint = function( point, color ){
            if( point.x >= 0 && point.y >= 0 && point.x < this.workingWidth && point.y < this.workingHeight ){
                this.putPixel( point.x, point.y, point.z, color );
            }
        };
        Device.prototype.clamp = function( value, min, max ){
            if( typeof min === 'undefined' ) min = 0;
            if( typeof max === 'undefined' ) max = 1;
            return Math.max( min, Math.min( value, max ) );
        };
        Device.prototype.interpolate = function( min, max, gradient ){
            return min + ( max - min ) * this.clamp(gradient);
        };
        Device.prototype.processScanLine = function( y, pa, pb, pc, pd, color ){
            var gradient1 = pa.y != pb.y ? ( y - pa.y ) / ( pb.y - pa.y ) : 1;
            var gradient2 = pc.y != pd.y ? ( y - pc.y ) / ( pd.y - pc.y ) : 1;

            var sx = this.interpolate( pa.x, pb.x, gradient1 ) >> 0;
            var ex = this.interpolate( pc.x, pd.x, gradient2 ) >> 0;

            var z1 = this.interpolate( pa.z, pb.z, gradient1 );
            var z2 = this.interpolate( pc.z, pd.z, gradient2 );

            var i = sx;
            for( ; i < ex; i++ ){
                var gradient = ( i - sx ) / ( ex - sx );
                var z = this.interpolate( z1, z2, gradient );
                this.drawPoint( new BABYLON.Vector3( i, y, z ), color );
            }
        };
        Device.prototype.drawTriangle = function( p1, p2, p3, color ){
            var temp;
            if( p1.y > p2.y ){
                temp = p2;
                p2 = p1;
                p1 = temp;
            }
            if( p2.y > p3.y ){
                var temp = p2;
                p2 = p3;
                p3 = temp;
            }
            if( p2.y > p2.y ){
                temp = p2;
                p2 = p1;
                p1 = temp;
            }

            var dP1P2, dP1P3;

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

            var i, j;

            if( dP1P2 > dP1P3 ){
                i = p1.y >> 0, j = p3.y >> 0;
                for( ; i < j; i++ ){
                    if( i < p2.y ){
                        this.processScanLine( i, p1, p3, p1, p2, color );
                    }else{
                        this.processScanLine( i, p1, p3, p2, p3, color );
                    }
                }
            }else{
                i = p1.y >> 0, j = p3.y >> 0;
                for( ; i < j; i++ ){
                    if( i < p2.y ){
                        this.processScanLine( i, p1, p2, p1, p3, color );
                    }else{
                        this.processScanLine( i, p2, p3, p1, p3, color );
                    }
                }
            }
        };
        Device.prototype.LoadJSONFileAsync = function( fileName, callback ){
            var jsonObject = {};
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open( 'GET', fileName, true );
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
            var meshes = [], i = 0, j = jsonObject.meshes.length;
            for( ; i < j; i++ ){
                var verticesArray = jsonObject.meshes[i].vertices;
                var indicesArray = jsonObject.meshes[i].indices;
                var uvCount = jsonObject.meshes[i].uvCount;
                var verticesStep = 1;
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
                var verticeCount = verticesArray.length / verticesStep;
                var facesCount = indicesArray.length / 3;
                var mesh = new SoftEngine.Mesh( jsonObject.meshes[i].name, verticeCount, facesCount );
                var k = 0;
                for( ; k < verticeCount; k++ ){
                    var x = verticesArray[k * verticesStep];
                    var y = verticesArray[k * verticesStep + 1];
                    var z = verticesArray[k * verticesStep + 2];
                    mesh.Vertices[k] = new BABYLON.Vector3( x, y, z );
                }
                k = 0;
                for( ; k < facesCount; k++ ){
                    var a = indicesArray[k * 3];
                    var b = indicesArray[k * 3 + 1];
                    var c = indicesArray[k * 3 + 2];
                    mesh.Faces[k] = {A:a, B:b, C:c};
                }
                var position = jsonObject.meshes[i].position;
                mesh.Position = new BABYLON.Vector3( position[0], position[1], position[2] );
                meshes.push(mesh);
            }
            return meshes;
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

                    var color = 0.25 + ( ( k % l ) / l ) * 0.75;
                    this.drawTriangle( pixelA, pixelB, pixelC, new BABYLON.Color4( color, color, color, 1 ) );
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
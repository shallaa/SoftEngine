/**
 * Created by JunHo on 2015-04-23.
 */

THREE.JSONLoader = function(manager){

    this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.JSONLoader.prototype = {

    constructor:THREE.ObjectLoader,

    load:function( url, onLoad, onProgress, onError ){

        var scope = this;

        var loader = new THREE.XHRLoader(scope.manager);
        loader.setCrossOrigin(this.crossOrigin);
        loader.load( url, function(text){

            onLoad( scope.parse( JSON.parse(text) ) );
        }, onProgress, onError );

    },

    setCrossOrigin:function(value){

        this.crossOrigin = value;

    },

    parse:function(json){

        var materials = this.parseMaterials(json);

        var meshes = this.parseObjects( json, materials );

        return meshes;

    },

    parseMaterials:function(json){

        var materials = {};

        for( var i = 0, l = json.materials.length; i < l; i++ ){

            var data = json.materials[i];

            var texture = THREE.ImageUtils.loadTexture( '../models/' + data.diffuseTexture.name );
            texture.flipY = false;

            var material = new THREE.MeshLambertMaterial({map:texture});
            material.color.fromArray(data.diffuse);
            material.name = data.name;
            material.id = data.id;
            material.opacity = data.alpha;

            materials[data.id] = material;

        }

        return materials;

    },

    parseGeometry:function(json){

        var verticesArray = json.vertices;

        var indicesArray = json.indices;

        var uvCount = json.uvCount;

        var verticesStep = 1;

        switch( uvCount ){
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

        var geometry = new THREE.BufferGeometry;

        var positions = [];

        var normals = [];

        var uvs = [];

        var indices = [];

        var i = 0;

        for( ; i < verticeCount; i++ ){

            var x = verticesArray[i * verticesStep];

            var y = verticesArray[i * verticesStep + 1];

            var z = verticesArray[i * verticesStep + 2];

            var nx = verticesArray[i * verticesStep + 3];

            var ny = verticesArray[i * verticesStep + 4];

            var nz = verticesArray[i * verticesStep + 5];

            positions.push( x, y, z );
            normals.push( nx, ny, nz );

            if( uvCount > 0 ){

                var u = verticesArray[i * verticesStep + 6];

                var v = verticesArray[i * verticesStep + 7];

                uvs.push( u, v );

            }else{

                uvs.push( 0, 0 );

            }
        }

        for( i = 0; i < facesCount; i++ ){

            var a = indicesArray[i * 3 + 2];

            var b = indicesArray[i * 3 + 1];

            var c = indicesArray[i * 3 ];

            indices.push( a, b, c );

        }

        geometry.addAttribute( 'index', new THREE.BufferAttribute( new Uint16Array(indices), 1 ) );

        geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array(positions), 3 ) );

        geometry.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array(normals), 3 ) );

        geometry.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array(uvs), 2 ) );

        return geometry;

    },

    parseObjects:function( json, materials ){

        var datas = json.meshes;

        var meshes = [];

        for( var i = 0, l = datas.length; i < l; i++ ){

            var data = datas[i];

            var geometry = this.parseGeometry(data);

            var mesh = new THREE.Mesh( geometry, materials[data.materialId] );
            mesh.name = data.name;
            mesh.position.set( data.position[0], data.position[1], data.position[2] );
            mesh.rotation.fromArray(data.rotation);

            meshes.push(mesh);

        }

        return meshes;

    }
};
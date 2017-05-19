/* global AFRAME, THREE */
if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Cubemap component for A-Frame.
 */
AFRAME.registerComponent('cubemap', {
  schema: {
    folder: {
      type: 'string',
    },
    edgeLength: {
      type: 'int',
      default: 5000,
    },
    urls: {
      type: 'array',
    }
  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) {
    // entity data
    var el = this.el;
    var data = this.data;

    // Path to the folder containing the 6 cubemap images
    var srcPath = data.folder;
    if (srcPath === '')
      srcPath = undefined;

    // Cubemap image files must follow this naming scheme
    // from: http://threejs.org/docs/index.html#Reference/Textures/CubeTexture
    var urls = this.data.urls;
    if (urls.length === 0)
      urls = [
        'posx.jpg', 'negx.jpg',
        'posy.jpg', 'negy.jpg',
        'posz.jpg', 'negz.jpg'
      ];
    else if (urls.length !== 6)
      throw new Error('aframe-cubemap-component: "urls" attribute must' +
          'contain array of six elements, got ' + urls.length + ' instead');

    // Code that follows is adapted from 'Skybox and environment map in Three.js' by Roman Liutikov
    // http://blog.romanliutikov.com/post/58705840698/skybox-and-environment-map-in-threejs

    // Create loader, set folder path, and load cubemap textures
    var loader = new THREE.CubeTextureLoader();
    loader.setPath(srcPath);

    var cubemap = loader.load(urls, function onLoad() {
      el.emit('cubemapLoaded', undefined, false);
    });

    cubemap.format = THREE.RGBFormat;

    var shader = THREE.ShaderLib['cube']; // init cube shader from built-in lib

    // Create shader material
    var skyBoxShader = new THREE.ShaderMaterial({
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      depthWrite: false,
      side: THREE.BackSide,
    });

    // Clone ShaderMaterial (necessary for multiple cubemaps)
    var skyBoxMaterial = skyBoxShader.clone();
    skyBoxMaterial.uniforms['tCube'].value = cubemap; // Apply cubemap textures to shader uniforms

    // Set skybox dimensions
    var edgeLength = data.edgeLength;
    var skyBoxGeometry = new THREE.CubeGeometry(edgeLength, edgeLength, edgeLength);

    // Set entity's object3D
    el.setObject3D('cubemap', new THREE.Mesh(skyBoxGeometry, skyBoxMaterial));
  },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () {
    this.el.removeObject3D('cubemap');
  }
});

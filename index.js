if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Cubemap component for A-Frame.
 */
AFRAME.registerComponent('cubemap', {
  schema: {
    type: "string"
  },

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () {
    // entity data
    var el = this.el;
    var data = this.data;

    // Path to the folder containing the 6 cubemap images
    var srcPath = data;

    // Cubemap image files must follow this naming scheme
    var urls = [
      'posx.jpg', 'negx.jpg',
      'posy.jpg', 'negy.jpg',
      'posz.jpg', 'negz.jpg'
    ];


    // Code that follows is adapted from "Skybox and environment map in Three.js" by Roman Liutikov
    // http://blog.romanliutikov.com/post/58705840698/skybox-and-environment-map-in-threejs

    // Create loader, set folder path, and load cubemap textures
    var loader = new THREE.CubeTextureLoader();
    loader.setPath( srcPath );

    var cubemap = loader.load( urls );
    cubemap.format = THREE.RGBFormat;

    var shader = THREE.ShaderLib['cube']; // init cube shader from built-in lib
    shader.uniforms['tCube'].value = cubemap; // apply textures to shader

    // create shader material
    var skyBoxMaterial = new THREE.ShaderMaterial( {
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      depthWrite: false,
      side: THREE.BackSide
    });

    // Skybox dimensions arbitrarily set to 1000x1000x1000
    var skyboxGeometry = new THREE.CubeGeometry(1000, 1000, 1000);

    // Set entity's object3D
    el.setObject3D('mesh', new THREE.Mesh(skyboxGeometry,skyBoxMaterial));

  }
});

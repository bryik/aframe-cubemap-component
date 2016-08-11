/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

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
	      type: 'string'
	    },
	    edgeLength: {
	      type: 'int',
	      default: 5000
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

	    // Cubemap image files must follow this naming scheme
	    // from: http://threejs.org/docs/index.html#Reference/Textures/CubeTexture
	    var urls = [
	      'posx.jpg', 'negx.jpg',
	      'posy.jpg', 'negy.jpg',
	      'posz.jpg', 'negz.jpg'
	    ];

	    // Code that follows is adapted from "Skybox and environment map in Three.js" by Roman Liutikov
	    // http://blog.romanliutikov.com/post/58705840698/skybox-and-environment-map-in-threejs

	    // Create loader, set folder path, and load cubemap textures
	    var loader = new THREE.CubeTextureLoader();
	    loader.setPath(srcPath);

	    var cubemap = loader.load(urls);
	    cubemap.format = THREE.RGBFormat;

	    var shader = THREE.ShaderLib['cube']; // init cube shader from built-in lib

	    // Create shader material
	    var skyBoxShader = new THREE.ShaderMaterial({
	      fragmentShader: shader.fragmentShader,
	      vertexShader: shader.vertexShader,
	      uniforms: shader.uniforms,
	      depthWrite: false,
	      side: THREE.BackSide
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


/***/ }
/******/ ]);
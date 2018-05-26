/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

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
    },
    ext: {
      type: 'string',
      default: 'jpg'
    },
    transparent: {
      type: 'boolean',
      default: false
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
      'posx', 'negx',
      'posy', 'negy',
      'posz', 'negz'
    ];
    // Apply extension
    urls = urls.map(function(val) {
      return val + "." + data.ext;
    });

    // Code that follows is adapted from "Skybox and environment map in Three.js" by Roman Liutikov
    // http://blog.romanliutikov.com/post/58705840698/skybox-and-environment-map-in-threejs

    var shader = THREE.ShaderLib['cube']; // init cube shader from built-in lib

    // Create shader material
    var skyBoxShader = new THREE.ShaderMaterial({
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      depthWrite: false,
      side: THREE.BackSide,
      transparent: data.transparent
    });

    // Set skybox dimensions
    var edgeLength = data.edgeLength;
    var skyBoxGeometry = new THREE.CubeGeometry(edgeLength, edgeLength, edgeLength);

    // Create loader, set folder path, and load cubemap textures
    var loader = new THREE.CubeTextureLoader();
    loader.setPath(srcPath);
    loader.load(urls, function(texture) {
      // Clone ShaderMaterial (necessary for multiple cubemaps)
      var skyBoxMaterial = skyBoxShader.clone();
      skyBoxMaterial.uniforms['tCube'].value = texture; // Apply cubemap textures to shader uniforms

      // Set entity's object3D
      el.setObject3D('cubemap', new THREE.Mesh(skyBoxGeometry, skyBoxMaterial));
    });

  },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () {
    this.el.removeObject3D('cubemap');
  }
});


/***/ })
/******/ ]);
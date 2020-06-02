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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* global AFRAME, THREE */\nif (typeof AFRAME === \"undefined\") {\n  throw new Error(\n    \"Component attempted to register before AFRAME was available.\"\n  );\n}\n\n/**\n * Cubemap component for A-Frame.\n *\n * Adapted from \"Skybox and environment map in Three.js\" by Roman Liutikov\n * https://web.archive.org/web/20160206163422/https://blog.romanliutikov.com/post/58705840698/skybox-and-environment-map-in-threejs\n *\n */\nAFRAME.registerComponent(\"cubemap\", {\n  schema: {\n    folder: {\n      type: \"string\",\n    },\n    edgeLength: {\n      type: \"int\",\n      default: 5000,\n    },\n    ext: {\n      type: \"string\",\n      default: \"jpg\",\n    },\n  },\n\n  /**\n   * Called once when the component is initialized.\n   * Used to set up initial state and instantiate variables.\n   */\n  init: function () {\n    // entity data\n    const el = this.el;\n    const data = this.data;\n\n    // A Cubemap can be rendered as a mesh composed of a BoxBufferGeometry and\n    // ShaderMaterial. EdgeLength will scale the mesh\n    this.geometry = new THREE.BoxBufferGeometry(1, 1, 1);\n\n    // Now for the ShaderMaterial.\n    const shader = THREE.ShaderLib[\"cube\"];\n    // Note: cloning the material is necessary to prevent the cube shader's\n    // uniforms from being mutated. If the material was not cloned, all cubemaps\n    // in the scene would share the same uniforms (and look identical).\n    this.material = new THREE.ShaderMaterial({\n      fragmentShader: shader.fragmentShader,\n      vertexShader: shader.vertexShader,\n      uniforms: shader.uniforms,\n      depthWrite: false,\n      side: THREE.BackSide,\n    }).clone();\n    // Threejs seems to have removed the 'tCube' uniform.\n    // Workaround from: https://stackoverflow.com/a/59454999/6591491\n    Object.defineProperty(this.material, \"envMap\", {\n      get: function () {\n        return this.uniforms.envMap.value;\n      },\n    });\n    // A dummy texture is needed (otherwise the shader will be invalid and spew\n    // a million errors)\n    this.material.uniforms[\"envMap\"].value = new THREE.Texture();\n    this.loader = new THREE.CubeTextureLoader();\n\n    // We can create the mesh now and update the material with a texture later on\n    // in the update lifecycle handler.\n    this.mesh = new THREE.Mesh(this.geometry, this.material);\n    this.mesh.scale.set(data.edgeLength, data.edgeLength, data.edgeLength);\n    el.setObject3D(\"cubemap\", this.mesh);\n  },\n\n  /**\n   * Called when component is attached and when component data changes.\n   * Generally modifies the entity based on the data.\n   */\n  update: function (oldData) {\n    // entity data\n    const el = this.el;\n    const data = this.data;\n    const rendererSystem = el.sceneEl.systems.renderer;\n\n    if (data.edgeLength !== oldData.edgeLength) {\n      // Update the size of the skybox.\n      this.mesh.scale.set(data.edgeLength, data.edgeLength, data.edgeLength);\n    }\n\n    if (data.ext !== oldData.ext || data.folder !== oldData.folder) {\n      // File extension and/or folder property have changed, so reload textures.\n\n      // Determine the URLs to load.\n      let urls;\n      // srcPath is either a literal path to a folder, or a selector to an <a-cubemap>\n      // asset.\n      const srcPath = data.folder;\n      if (srcPath && srcPath[0] === \"#\") {\n        // srcPath is a selector to an <a-cubemap> asset\n        const assetEl = document.querySelector(srcPath);\n        if (assetEl === null) {\n          // Bail out\n          console.error(\n            \"cubemap component given a selector to a non-existent asset:\",\n            srcPath\n          );\n          return;\n        }\n        urls = assetEl.srcs;\n      } else {\n        // srcPath is a folder path\n        this.loader.setPath(srcPath);\n        // Cubemap image files must follow this naming scheme\n        // from: https://threejs.org/docs/index.html#api/en/textures/CubeTexture\n        urls = [\"posx\", \"negx\", \"posy\", \"negy\", \"posz\", \"negz\"];\n        // Apply extension\n        urls = urls.map(function (val) {\n          return val + \".\" + data.ext;\n        });\n      }\n\n      // Load textures\n      this.loader.load(urls, onTextureLoad.bind(this));\n\n      function onTextureLoad(texture) {\n        if (srcPath !== this.data.folder) {\n          // The texture that just finished loading no longer matches the folder\n          // set on this component. This can happen when the user calls setAttribute()\n          // to change folders multiple times in quick succession.\n          texture.dispose();\n          return;\n        }\n        // Have the renderer system set texture encoding as in A-Frame core.\n        // https://github.com/bryik/aframe-cubemap-component/issues/13#issuecomment-626238202\n        rendererSystem.applyColorCorrection(texture);\n\n        // Apply cubemap texture to shader uniforms and dispose of the old texture.\n        const oldTexture = this.material.uniforms[\"envMap\"].value;\n        this.material.uniforms[\"envMap\"].value = texture;\n        if (oldTexture) {\n          oldTexture.dispose();\n        }\n\n        // Tell the world that the cubemap texture has loaded.\n        el.emit(\"cubemapLoaded\");\n      }\n    }\n  },\n\n  /**\n   * Called when a component is removed (e.g., via removeAttribute).\n   * Generally undoes all modifications to the entity.\n   */\n  remove: function () {\n    this.geometry.dispose();\n    this.material.uniforms[\"envMap\"].value.dispose();\n    this.material.dispose();\n    this.el.removeObject3D(\"cubemap\");\n  },\n});\n\n\n//# sourceURL=webpack:///./index.js?");

/***/ })

/******/ });
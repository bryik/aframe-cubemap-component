/* global AFRAME, THREE */
if (typeof AFRAME === "undefined") {
  throw new Error(
    "Component attempted to register before AFRAME was available."
  );
}

/**
 * Cubemap component for A-Frame.
 *
 * Adapted from "Skybox and environment map in Three.js" by Roman Liutikov
 * https://web.archive.org/web/20160206163422/https://blog.romanliutikov.com/post/58705840698/skybox-and-environment-map-in-threejs
 *
 */
AFRAME.registerComponent("cubemap", {
  schema: {
    folder: {
      type: "string",
    },
    edgeLength: {
      type: "int",
      default: 5000,
    },
    ext: {
      type: "string",
      default: "jpg",
    },
  },

  /**
   * Called once when the component is initialized.
   * Used to set up initial state and instantiate variables.
   */
  init: function () {
    // entity data
    const el = this.el;
    const data = this.data;

    // A Cubemap can be rendered as a mesh composed of a BoxBufferGeometry and
    // ShaderMaterial. EdgeLength will scale the mesh
    this.geometry = new THREE.BoxGeometry(1, 1, 1);

    // Now for the ShaderMaterial.
    const shader = THREE.ShaderLib["cube"];
    // Note: cloning the material is necessary to prevent the cube shader's
    // uniforms from being mutated. If the material was not cloned, all cubemaps
    // in the scene would share the same uniforms (and look identical).
    this.material = new THREE.ShaderMaterial({
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      depthWrite: false,
      side: THREE.BackSide,
      transparent: true
    }).clone();
    
    //https://github.com/mrdoob/three.js/wiki/Migration-Guide#145--146
    //they changed the name of the uniform from tCube to envMap, this variable helps us keep track of the name across three js versions
    this.envMapUniformName = this.material.uniforms["envMap"] ? "envMap" : "tCube";
  

    // Threejs seems to have removed the 'tCube' uniform.
    // Workaround from: https://stackoverflow.com/a/59454999/6591491
    
    Object.defineProperty(this.material, "envMap", {
      get: function () {
          return this.uniforms.envMap ? this.uniforms.envMap.value : this.uniforms.tCube.value;
      },
    });

    // A dummy texture is needed (otherwise the shader will be invalid and spew
    // a million errors)
    
  //   this.material.uniforms["envMap"].value = new THREE.Texture();
    this.material.uniforms[this.envMapUniformName].value = new THREE.Texture();

    this.loader = new THREE.CubeTextureLoader();

    // We can create the mesh now and update the material with a texture later on
    // in the update lifecycle handler.
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.scale.set(data.edgeLength, data.edgeLength, data.edgeLength);
    el.setObject3D("cubemap", this.mesh);
  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) {
    // entity data
    const el = this.el;
    const data = this.data;
    const rendererSystem = el.sceneEl.systems.renderer;

    if (data.edgeLength !== oldData.edgeLength) {
      // Update the size of the skybox.
      this.mesh.scale.set(data.edgeLength, data.edgeLength, data.edgeLength);
    }

    if (data.ext !== oldData.ext || data.folder !== oldData.folder) {
      // File extension and/or folder property have changed, so reload textures.

      // Determine the URLs to load.
      let urls;
      // srcPath is either a literal path to a folder, or a selector to an <a-cubemap>
      // asset.
      const srcPath = data.folder;
      if (srcPath && srcPath[0] === "#") {
        // srcPath is a selector to an <a-cubemap> asset
        const assetEl = document.querySelector(srcPath);
        if (assetEl === null) {
          // Bail out
          console.error(
            "cubemap component given a selector to a non-existent asset:",
            srcPath
          );
          return;
        }
        urls = assetEl.srcs;
      } else {
        // srcPath is a folder path
        this.loader.setPath(srcPath);
        // Cubemap image files must follow this naming scheme
        // from: https://threejs.org/docs/index.html#api/en/textures/CubeTexture
        urls = ["posx", "negx", "posy", "negy", "posz", "negz"];
        // Apply extension
        urls = urls.map(function (val) {
          return val + "." + data.ext;
        });
      }

      // Load textures
      this.loader.load(urls, onTextureLoad.bind(this));

      function onTextureLoad(texture) {
        if (srcPath !== this.data.folder) {
          // The texture that just finished loading no longer matches the folder
          // set on this component. This can happen when the user calls setAttribute()
          // to change folders multiple times in quick succession.
          texture.dispose();
          return;
        }
        // Have the renderer system set texture encoding as in A-Frame core.
        // https://github.com/bryik/aframe-cubemap-component/issues/13#issuecomment-626238202
        rendererSystem.applyColorCorrection(texture);

        // Apply cubemap texture to shader uniforms and dispose of the old texture.
        const oldTexture = this.material.uniforms[this.envMapUniformName].value;
        this.material.uniforms[this.envMapUniformName].value = texture;
        if (oldTexture) {
          oldTexture.dispose();
        }

        // Tell the world that the cubemap texture has loaded.
        el.emit("cubemapLoaded");
      }
    }
  },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () {
    this.geometry.dispose();
    this.material.uniforms[this.envMapUniformName].value.dispose();
    this.material.dispose();
    this.el.removeObject3D("cubemap");
  },
});
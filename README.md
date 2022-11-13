## aframe-cubemap-component

<p align="center">
  <img src="preview.png"/>
</p>

An [A-Frame](https://aframe.io) component for creating a skybox from a cubemap.

### Properties

|  Property  |                      Description                      | Default Value |
| :--------: | :---------------------------------------------------: | :-----------: |
|   folder   | Path to the folder holding your cubemap or a selector |     none      |
| edgeLength |         Controls the dimensions of the skybox         |     5000      |
|    ext     |                  The image extension                  |      jpg      |

By default, the height, width, and depth of the skybox are set to 5000. In other words, the dimensions of the skybox are 5000x5000x5000.

**Note:** `folder` can also be an ID to an `<a-cubemap>` asset. See `./examples/tests/a-assets/`.

### Events

|     Name      |                 Description                 |
| :-----------: | :-----------------------------------------: |
| cubemapLoaded | Emitted when a texture has finished loading |

### Usage

Attach the component to an entity using the path to the folder holding your cubemap as the attribute.

```html
<a-entity cubemap="folder: /examples/assets/Yokohama3/"></a-entity>
```

Inside the folder, the component assumes the following naming scheme:

```javascript
// prettier-ignore
const urls = [
  'posx.jpg', 'negx.jpg',
  'posy.jpg', 'negy.jpg',
  'posz.jpg', 'negz.jpg'
];
```

This is the scheme used by Three.js's [CubeTexture](http://threejs.org/docs/index.html#Reference/Textures/CubeTexture). If your cubemap images do not follow this scheme, you will need to rename them (or fork this repo and alter the above in index.js).

The Yokohama cubemap texture is the work of [Emil Persson, aka Humus](http://www.humus.name). Check out his website, it is a good source for [cubemap textures](http://www.humus.name/index.php?page=Textures). IIRC, I got the milky way texture from uschi0815 on the [Kerbal Space Program forum](http://forum.kerbalspaceprogram.com/index.php?/topic/128932-milky-way-panorama-as-skybox-for-texturereplacer/).

To modify the size of the resulting skybox, use the edgeLength property.

```html
<a-entity cubemap="folder: /assets/Yokohama3/; edgeLength: 1000"></a-entity>
```

#### Browser Installation

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/1.3.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-cubemap-component@2.1.1/index.js"></script>
</head>

<body>
  <a-scene>
    <a-entity cubemap="folder: /examples/assets/Yokohama3/"></a-entity>
  </a-scene>
</body>
```

## FAQ

### Can this component display stereoscopic cubemaps?

No. However, it's not too difficult to achieve this with a little bit of JavaScript. The trick is to split a stereo cubemap into two separate cubemaps, one for each eye, and render them with separate entities. Then use JS to fetch each entity's `object3D` and set the left to layer 1 and the right to layer 2. [Here is an example](https://github.com/bryik/aframe-metaverse-contest/blob/gh-pages/examples/fushimi-inari.html#L31).

## Local Development

Clone the repo and `cd` into it

```bash
git clone git@github.com:bryik/aframe-cubemap-component.git
cd aframe-cubemap-component
```

Install dependencies:

```bash
npm i
```

To run the examples locally:

```bash
npm start
```

This should start a local dev server, go to [http://localhost:3000/examples/](http://localhost:3000/examples/) to inspect the examples. To stop the server, hit `CONTROL-C`.

### Distribution

Prior to version 3.0.0, this component used a Browserify workflow. This was fine until it prevented upgrading to A-Frame v 1.3.0 which was needed to [resolve a rendering issue](https://github.com/bryik/aframe-cubemap-component/issues/39#issuecomment-1312806990). Since this component has no external dependencies and webpack is annoying to setup, I decided to go for a low-tech solution.

Users can pin specific versions by altering the unpkg URL:

```
https://unpkg.com/aframe-cubemap-component@2.1.1/index.js
```

### Contributing

PRs are welcome. Opening an issue to discuss large changes beforehand is a good idea.

For more information, take a look at [A-Frame's contributing guide](https://github.com/aframevr/aframe/blob/master/CONTRIBUTING.md), specifically the [steps for contributing code](https://github.com/aframevr/aframe/blob/master/CONTRIBUTING.md#contribute-code-to-a-frame).

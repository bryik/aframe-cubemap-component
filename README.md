## aframe-cubemap-component

An [A-Frame](https://aframe.io) component for creating a skybox from a cubemap.

### Properties

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
|   src    | Folder path |     None      |

### Usage

Attach the component to an entity using the path to the folder holding your cubemap as the attribute.

```html
  <a-entity cubemap="/assets/Yokohama3/"></a-entity>
```

Inside the folder, the component assumes the following naming scheme:

```javascript
  var urls = [
    'posx.jpg', 'negx.jpg',
    'posy.jpg', 'negy.jpg',
    'posz.jpg', 'negz.jpg'
  ];
```

This is the scheme used by Three.js's [CubeTexture](http://threejs.org/docs/index.html#Reference/Textures/CubeTexture). If your cubemap images do not follow this scheme, you will need to rename them (or fork this repo and alter the above in index.js).

The Yokohama cubemap texture is the work of [Emil Persson, aka Humus](http://www.humus.name). Check out his website, it is a good source for [cubemap textures](http://www.humus.name/index.php?page=Textures).

#### Browser Installation

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.2.0/aframe.min.js"></script>
  <script src="https://rawgit.com/bryik/aframe-cubemap-component/master/dist/aframe-cubemap-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity cubemap="exampleProp: exampleVal"></a-entity>
  </a-scene>
</body>
```



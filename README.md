## aframe-cubemap-component

An [A-Frame](https://aframe.io) component for creating a skybox from a cubemap.

### Properties

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
|   src    |             |               |

### Usage

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

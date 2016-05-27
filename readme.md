The A-Frame component boilerplate offers automatic gh-pages generation, but it does not work for me (on Windows). I had to put this together manually, so it may be a bit messy.

### Asset path issue

Note to self: ensure folder paths are prefaced with ".." and have no whitespace. Twice now I've pushed gh-pages after seeing the examples load on a local server only to find 404 errors on Github.

Bad:

```html
<a-entity cubemap="folder: /assets/Yokohama3/"></a-entity>
```

Good:

```html
<a-entity cubemap="folder:../assets/Yokohama3/"></a-entity>
```

Handling src paths as strings probably isn't the best way to do it, so I might change the component schema in the future.

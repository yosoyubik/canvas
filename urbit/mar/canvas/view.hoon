/+  *canvas
|_  =canvas-view
++  grow
  |%
  ++  noun  canvas-view
  --
::
++  grab
  |%
  ++  noun  ^canvas-view
  ++  json
    |=  jon=^json
    (json-to-canvas-view jon)
  --
--

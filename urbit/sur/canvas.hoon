|%
+$  canvas-type
  $?  %mesh
      %mesh-welcome
      %mesh-martian
      %mesh-bitcoin
      %mesh-hashtag
      %mesh-sigil
      %mesh-tmdw
      %mesh-tile
      %mesh-yc-hn
      %mesh-crypto
      %mesh-guy
      %draw
      %map-europe-europe
      %map-africa-africa
      %map-us-counties
      %map-us-states
  ==
::
+$  image-type   ?(%svg %png)
+$  arc          [filled=? color=@t]
+$  form         [strokes=(list [@t @t]) line-width=@t style-stroke=@t]
+$  mesh         (map @t arc)
+$  draw         (list form)
+$  metadata     [name=@t type=canvas-type location=ship saved=? private=?]
+$  location     [host=ship canvas=@t]
::
+$  canvas
  $%  [%mesh =mesh =metadata]
      [%draw =draw =metadata]
  ==
::
+$  stroke
  $%  [%mesh id=@t =arc]
      [%draw =form]
  ==
::
+$  canvas-action
  $%  [%paint location=@p name=@t strokes=(list stroke)]
      [%init gallery=(list canvas)]
      [%load name=@t =canvas]
      [%join =ship name=@t]
      [%leave =ship name=@t]
      [%create =canvas]
      [%share name=@t =path type=image-type]
      [%save =ship name=@t image=@t last=? type=image-type]
  ==
::
+$  canvas-update
  $%  [%paint location=@p name=@t strokes=(list stroke) who=@p]
      [%load name=@t =canvas]
  ==
::
+$  canvas-view
  $%  [%init ~]
      [%load name=@t =canvas]
      [%paint location=@p name=@t strokes=(list stroke)]
      [%join =ship name=@t]
      [%leave =ship name=@t]
      [%create =canvas]
      [%file file=@t]
      [%share name=@t =path type=image-type]
      [%save =ship name=@t image=@t last=? type=image-type]
  ==
::
+$  canvas-view-response
  $%  canvas-action
      [%file file=@t]
      [%init-frontend gallery=(list canvas) chats=(list path)]
  ==
--

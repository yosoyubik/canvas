|%
+$  template
  $?  %draw
      %mesh
      %mesh-welcome
      %mesh-homer
      %mesh-monkey
      %mesh-hackathon
      %mesh-dumas
  ==
::
+$  image-type   ?(%svg %png)
+$  arc          [color=@t when=(unit time) who=(unit @p)]
+$  form         [strokes=(list [@t @t]) line-width=@t style-stroke=@t]
+$  mesh         (map @t arc)
+$  draw         (list form)
+$  mesh-pixel   ?(%hexa %squa)
+$  metadata
  $:  name=@t
      =template
      location=ship
      file=(unit @t)
      private=?
      width=@ud
      height=@ud
      columns=@ud
      mesh=(unit mesh-pixel)
  ==
::
+$  location     [host=ship canvas=@t]
::
+$  canvas
  $%  [%mesh =mesh =metadata]
      [%draw =draw =metadata]
  ==
::
+$  stroke
  $%  [%mesh id=@t arc=(unit arc)]
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
      [%save =ship name=@t file=@t]
  ==
::
+$  canvas-update
  $%  [%paint location=@p name=@t strokes=(list stroke) who=@p]
      [%load name=@t =canvas]
  ==
::
+$  canvas-view-response
  $%  canvas-action
      [%init-frontend gallery=(list canvas) chats=(list path)]
  ==
--

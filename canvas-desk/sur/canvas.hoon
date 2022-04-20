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
+$  location     [host=ship name=@t]
+$  metadata-0
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
+$  metadata
  $:  lockup=(unit @dr)
      metadata-0
  ==
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
::  TODO: refactor actions and diffs
::
+$  canvas-action
  $%  [%paint =location strokes=(list stroke)]
      [%init gallery=(list canvas)]
      [%load connected=? name=@t =canvas artists=(map ship @ud)]
      [%join =ship name=@t]
      [%leave =ship name=@t]
      [%create =canvas]
      [%share name=@t =path type=image-type]
      [%save =ship name=@t file=@t]
      [%unlock name=@t]
      [%kick =ship name=@t]
      [%remove =ship name=@t]
      [%expand =location rows=(unit @ud) cols=(unit @ud)]
  ==
::
+$  canvas-diff
  $%  [%paint =location strokes=(list stroke) who=@p]
      [%load name=@t =canvas artists=(map ship @ud)]
      [%expand =location width=(unit @ud) height=(unit @ud)]
  ==
::  TODO: refactor actions and diffs
::
+$  canvas-view-response
  $%  [%expand =location width=(unit @ud) height=(unit @ud)]
      [%paint =location strokes=(list stroke)]
      [%load connected=? name=@t =canvas artists=(map ship @ud)]
    ::
      $:  %init-frontend
          gallery=(list [connected=? canvas])
          chats=(list path)
          artists=(map location (map ship @ud))
  ==  ==
--

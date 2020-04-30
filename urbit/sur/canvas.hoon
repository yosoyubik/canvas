|%
+$  canvas-type  ?(%mesh %map %draw)
+$  arc          [filled=? color=@t]
+$  form         [strokes=(list [@t @t]) line-width=@t style-stroke=@t]
+$  mesh         (map @ud arc)
+$  draw         (list form)
+$  metadata     [name=@t type=canvas-type location=ship saved=?]
+$  location     [host=ship canvas=@t]
+$  canvas
  $%  [%mesh =mesh =metadata]
      [%map =mesh =metadata]
      [%draw =draw =metadata]
  ==
::
+$  stroke
  $%  [%mesh id=@ud =arc]
      [%map id=@ud =arc]
      [%draw =form]
  ==
::
+$  canvas-response
  $%  [%paint arc]
  ==
::
+$  canvas-action
  $%  [%paint location=@p name=@t strokes=(list stroke)]
      [%init gallery=(list canvas)]
      [%load name=@t =canvas]
      [%join =ship name=@t]
      [%leave =ship name=@t]
      [%create =canvas]
      [%share name=@t =path]
      [%save =ship name=@t svg=@t last=?]
  ==
::
+$  canvas-update
  $%  [%paint location=@p name=@t strokes=(list stroke)]
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
      [%share name=@t =path]
      [%save =ship name=@t svg=@t last=?]
  ==
::
+$  canvas-view-response
  $%  canvas-action
      [%file file=@t]
      [%init-frontend gallery=(list canvas) chats=(list path)]
  ==
--

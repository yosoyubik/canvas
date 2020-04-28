|%
+$  canvas-type  ?(%mesh %map %draw)
+$  arc          [filled=? color=@t]
+$  form         [strokes=(list [@t @t]) line-width=@t style-stroke=@t]
+$  mesh         (map @ud arc)
+$  draw         (list form)
+$  metadata     [name=@t type=canvas-type location=ship]
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
      :: [%init gallery=(list [@tas mesh metadata])]
      [%load name=@t =canvas]
      [%join =ship name=@t]
      [%leave =ship name=@t]
      [%create =canvas]
      ::  TODO: add chat name
      ::
      [%share name=@t]
      [%save name=@t svg=@t]
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
      ::  TODO: add chat name
      ::
      [%share name=@t]
      [%save name=@t svg=@t]
  ==
::
+$  canvas-view-response
  $%  canvas-action
  ==
--

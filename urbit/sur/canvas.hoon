|%
+$  arc          [id=@ud filled=?]
+$  mesh         (map @ud ?)
+$  canvas-type  ?(%mesh)
+$  metadata     [name=@t type=canvas-type location=ship]
+$  location     [host=ship canvas=@t]
+$  canvas
  $%  [%mesh =mesh =metadata]
      :: [%free id=@t name=@t data=*]
  ==
::
+$  stroke
  $%  [%mesh =arc]
  ==
::
+$  canvas-response
  $%  [%paint arc]
  ==
::
+$  canvas-action
  $%  [%paint strokes=(list [location=@p name=@t =stroke])]
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
  $%  [%paint (list [location=@p name=@t =stroke])]
      [%load name=@t =canvas]
  ==
::
+$  canvas-view
  $%  [%init ~]
      [%load name=@t =canvas]
      [%paint (list [location=@p name=@t =stroke])]
      [%join =ship name=@t]
      [%leave =ship name=@t]
      [%create =metadata]
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

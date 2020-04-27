|%
+$  arc          [filled=? color=@t]
+$  mesh         (map @ud arc)
+$  canvas-type  ?(%mesh %map)
+$  metadata     [name=@t type=canvas-type location=ship]
+$  location     [host=ship canvas=@t]
+$  canvas
  $%  [%mesh =mesh =metadata]
      [%map =mesh =metadata]
      :: [%free id=@t name=@t data=*]
  ==
::
+$  stroke
  $%  [%mesh id=@ud =arc]
      [%map id=@ud =arc]
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

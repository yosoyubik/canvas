::  Types
::
|%
+$  arc       [id=@ud filled=?]
+$  hexagons  (map @ud ?)
::
+$  canvas-response
  $%  [%paint arc]
  ==
::
+$  canvas-action
  $%  [%paint id=@t =arc]
      [%init id=@t =hexagons]
      [%join =ship id=@t]
      [%create id=@t]
  ==
::
+$  canvas-update
  $%  canvas-action
  ==
--

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
  $%  [%paint =arc]
      [%init =hexagons]
  ==
::
+$  canvas-update
  $%  canvas-action
  ==
--

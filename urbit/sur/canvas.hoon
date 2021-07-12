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








:: |%
:: +$  template
::   $?  %mesh
::       %mesh-welcome
::       %mesh-martian
::       %mesh-bitcoin
::       %mesh-homer
::       %mesh-hashtag
::       %mesh-sigil
::       %mesh-tmdw
::       %mesh-tile
::       %mesh-yc-hn
::       %mesh-crypto
::       %mesh-guy
::       %mesh-public
::       %mesh-life
::       %draw
::       %map-europe-europe
::       %map-africa-africa
::       %map-us-counties
::       %map-us-states
::   ==
:: ::
:: +$  image-type   ?(%svg %png)
:: +$  mesh-type    ?(%hexa %squa)
:: +$  arc          [filled=? color=@t when=(unit time) who=(unit @p)]
:: +$  form         [strokes=(list [@t @t]) line-width=@t style-stroke=@t]
:: +$  mesh         (map @t arc)
:: +$  draw         (list form)
:: +$  metadata
::   $:  name=@t
::       =template
::       where=ship
::       private=?
::       width=@ud
::       height=@ud
::       file=(unit @t)
::       mesh=(unit mesh-type)
::   ==
:: ::
:: +$  location     [host=ship canvas=@t]
:: ::
:: +$  canvas
::   $%  [%mesh =mesh =metadata]
::       [%draw =draw =metadata]
::   ==
:: ::
:: +$  stroke
::   $%  [%mesh id=@t =arc]
::       [%draw =form]
::   ==
:: ::
:: +$  canvas-action
::   $%  [%paint where=@p name=@t strokes=(list stroke)]
::       [%clear where=@p name=@t strokes=(list id=@t)]
::       [%init gallery=(list canvas)]
::       [%load name=@t =canvas]
::       [%join =ship name=@t]
::       [%leave =ship name=@t]
::       [%create =canvas]
::       [%share name=@t =path type=image-type]
::       :: [%save =ship name=@t image=@t last=? type=image-type]
::   ==
:: ::
:: +$  canvas-update
::   $%  [%paint where=@p name=@t strokes=(list stroke) who=@p]
::       [%clear where=@p name=@t strokes=(list id=@t) who=@p]
::       [%load name=@t =canvas]
::   ==
:: ::
:: :: +$  canvas-view
:: ::   $%  [%init ~]
:: ::       [%load name=@t =canvas]
:: ::       [%paint where=@p name=@t strokes=(list stroke)]
:: ::       [%join =ship name=@t]
:: ::       [%leave =ship name=@t]
:: ::       [%create =canvas]
:: ::       :: [%file file=@t]
:: ::       :: [%share name=@t =path type=image-type]
:: ::       :: [%save =ship name=@t image=@t last=? type=image-type]
:: ::   ==
:: ::
:: +$  canvas-view-response
::   $%  canvas-action
::       :: [%file file=@t]
::       [%init-frontend gallery=(list canvas) chats=(list path)]
::   ==
:: --


/-  *canvas
/+  base64
|%
++  json-to-canvas-view
  |=  jon=json
  ^-  canvas-view
  =,  dejs:format
  |^  (parse-json jon)
  ::
  ++  parse-json
    %-  of
    :~  [%init ul]
        [%paint paint]
        [%join subscription]
        [%leave subscription]
        [%create create]
        [%share share]
        [%save save]
    ==
  ::
  ++  create
    |^
    %-  of
    :~  [%mesh metadata]
        [%draw metadata]
    ==
    ::
    ++  metadata
      %-  ot
      :~  ['canvas' ul]
        ::
          :-  'metadata'
          %-  ot
          :~  ['name' so]
              ['type' (cu canvas-type so)]
              ['location' (su ;~(pfix sig fed:ag))]
              ['saved' bo]
              ['private' bo]
      ==  ==
    ::
    --
  ::
  ++  paint
    |^
    %-  ot
    :~  ['location' (su ;~(pfix sig fed:ag))]
        ['canvas-name' so]
      ::
        :-  'strokes'
        %-  ar
        %-  of
        :~  [%mesh arc-data]
            [%draw form-data]
    ==  ==
    ::
    ++  arc-data
      (ot ~[['id' so] ['filled' bo] ['color' so]])
    ::
    ++  form-data
      %-  ot
      :~  =;  coords-parser
            ['coords' (cu coords-parser (ar (ar no)))]
          |=  l=(list (list @t))
          ^-  (list [@t @t])
          %+  turn  l
          |=  coords=(list @t)
          ^-  [@t @t]
          ?>  ?=([@t @t ~] coords)
          [i.coords i.t.coords]
        ::
          ['lineWidth' so]
          ['strokeStyle' so]
      ==
    --
  ::
  ++  subscription
    (ot ~[['ship' (su ;~(pfix sig fed:ag))] ['canvas-name' so]])
  ::
  ++  save
    %-  ot
    :~  ['location' (su ;~(pfix sig fed:ag))]
        ['canvas-name' so]
        ['svg' so]
        ['last' bo]
        ['type' (cu image-type so)]
    ==
  ::
  ++  share
    (ot ~[['canvas-name' so] ['chat-path' pa] ['type' (cu image-type so)]])
  --
::
++  canvas-view-response-to-json
  |=  act=canvas-view-response
  ^-  json
  =,  enjs:format
  |^
  %+  frond  -.act
  ?+     -.act  ~|(%action-not-supported !!)
      %init-frontend
    %-  pairs
    %+  weld
      ['chats' a+(turn chats.act path)]~
    :_  ~
    :-  'canvas'
    %-  pairs
    %+  turn
      gallery.act
    |=  =canvas
    ^-  [@t json]
    :-  name.metadata.canvas
    %-  pairs
    %+  weld
      (canvas-to-json canvas)
    ['metadata' (pairs (metadata-to-json metadata.canvas))]~
  ::
      %load
    %-  pairs
    %+  weld
      (canvas-to-json canvas.act)
    (metadata-to-json metadata.canvas.act)
  ::
      %file
    :: FIXME: from the failed attempt of watching the image directory
    :: a+(turn files.act path)
    s+file.act
  ::
      %paint
    %-  pairs
    ^-  (list [@t json])
    :~  ['name' s+name.act]
        ['location' s+(scot %p location.act)]
      ::
        =;  pairs-of-strokes
          ['strokes' a+(turn strokes.act pairs-of-strokes)]
        |=  =stroke
        ^-  json
        (pairs (stroke-to-json stroke))
    ==
  ==
  ::
  ++  canvas-to-json
    |=  =canvas
    ^-  (list [@t json])
    =,  enjs:format
    :_  ~
    :-  'data'
    ?-    -.canvas
        %mesh
      %-  pairs
      %-  zing
      (turn ~(tap by mesh.canvas) arc-to-json)
    ::
        %draw
      :-  %a
      %+  turn  draw.canvas
      |=  =form
      ^-  json
      :-  %a
      %+  weld
        (form-strokes-to-json strokes.form)
      :_  ~
      %-  pairs
      :~  ['lineWidth' s+line-width.form]
          ['strokeStyle' s+style-stroke.form]
      ==
    ==
  ::
  ++  metadata-to-json
    |=  =metadata
    ^-  (list [@t json])
    :~  ['name' s+name.metadata]
        ['location' s+(scot %p location.metadata)]
        ['type' s+type.metadata]
        ['saved' b+saved.metadata]
        ['private' b+private.metadata]
    ==
  ::
  ++  arc-to-json
    |=  [id=@t =arc]
    ^-  (list [@t json])
    :_  ~
    :-  id
    %-  pairs:enjs:format
    ^-  (list [@t json])
    ~[['fill' b+filled.arc] ['color' s+color.arc]]
  ::
  ++  stroke-to-json
    |=  =stroke
    ^-  (list [@t json])
    ?-    -.stroke
        %mesh
      :~  ['id' s+id.stroke]
          ['fill' b+filled.arc.stroke]
          ['color' s+color.arc.stroke]
      ==
    ::
        %draw
      :~  ['lineWidth' s+line-width.form.stroke]
          ['styleStroke' s+style-stroke.form.stroke]
          ['strokes' a+(form-strokes-to-json strokes.form.stroke)]
      ==
    ==
  ::
  ++  form-strokes-to-json
    |=  strokes=(list [@t @t])
    ^-  (list json)
    %+  turn  strokes
    |=  [x=@t y=@t]
    ^-  json
    a+~[s+x s+y]
  --
--

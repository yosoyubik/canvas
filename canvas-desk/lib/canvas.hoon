/-  *canvas
|%
++  json-to-canvas-view
  |=  jon=json
  ^-  canvas-action
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
        [%unlock unlock]
        [%remove subscription]
        [%expand expand]
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
          %-  ou
          :~  ['lockup' (uf ~ (mu (cu @dr ni)))]
              ['name' (un so)]
              ['template' (un (cu template so))]
              ['location' (un (su ;~(pfix sig fed:ag)))]
              ['file' (uf ~ (mu so))]
              ['private' (un bo)]
              ['width' (un ni)]
              ['height' (un ni)]
              ['columns' (un ni)]
              ['mesh' (uf ~ (mu (cu mesh-pixel so)))]
      ==  ==
    --
  ::
  ++  paint
    |^
    %-  ot
    :~  :-  'location'
        %-  ot
        :~  ['host' (su ;~(pfix sig fed:ag))]
            ['name' so]
        ==
      ::
        :-  'strokes'
        %-  ar
        %-  of
        :~  [%mesh arc-data]
            [%draw form-data]
    ==  ==
    ::
    ++  arc-data
      |=  =json
      ?>  ?=(%o -.json)
       ^-  [@t (unit arc)]
      ?:  =(~(wyt by p.json) 1)
        %.  json
        (ou ~[['id' (un no)] [*@t (uf ~ ul)]])
      :-  ((ou ['id' (un no)]~) json)
      %-  some
      %.  json
      %-  ou
      :~  ['color' (un so)]
          ['when' (uf ~ (mu (cu from-unix-ms:chrono:userlib ni)))]
          ['who' (uf ~ (mu (su fed:ag)))]
      ==
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
  ++  unlock
    (ot ['canvas-name' so]~)
  ::
  ++  save
    %-  ot
    :~  ['location' (su ;~(pfix sig fed:ag))]
        ['canvas-name' so]
        ['file' so]
    ==
  ::
  ++  share
    %-  ot
    :~  ['canvas-name' so]
        ['chat-path' pa]
        ['type' (cu image-type so)]
    ==
  ::
  ++  expand
    %-  ot
    :~  :-  'location'
        %-  ot
        :~  ['host' (su ;~(pfix sig fed:ag))]
            ['name' so]
        ==
      ::
        ['dimensions' (ou ~[['rows' (uf ~ (mu ni))] ['cols' (uf ~ (mu ni))]])]
    ==
  --
::
++  canvas-view-response-to-json
  |=  act=canvas-view-response
  ^-  json
  =,  enjs:format
  |^
  %+  frond  -.act
  ?-     -.act
      %init-frontend
    %-  pairs
    %+  weld
      :: TODO
      :: ['artists' (artists-to-json artists.act)]~
      ['chats' a+(turn chats.act path)]~
    :_  ~
    :-  'canvas'
    %-  pairs
    %+  turn
      gallery.act
    |=  [connected=? =canvas]
    ^-  [@t json]
    :-  %-  crip
        ;:  weld
          (trip (scot %p location.metadata.canvas))
          "/"
          (trip name.metadata.canvas)
        ==
    %-  pairs
    %+  weld
      (canvas-to-json canvas)
    :~  ^-  [@t json]  ['connected' b+connected]
        ^-  [@t json]  ['metadata' (pairs (metadata-to-json metadata.canvas))]
    ==
  ::
      %load
    %-  pairs
    ;:  weld
      (canvas-to-json canvas.act)
      ['connected' b+connected.act]~
      (metadata-to-json metadata.canvas.act)
    ==
  ::
      %paint
    %-  pairs
    ^-  (list [@t json])
    :~  ['name' s+name.location.act]
        ['location' s+(scot %p host.location.act)]
      ::
        =;  pairs-of-strokes
          ['strokes' a+(turn strokes.act pairs-of-strokes)]
        |=  =stroke
        ^-  json
        (pairs (stroke-to-json stroke who.act))
    ==
  ::
      %expand
    %-  pairs
    ^-  (list [@t json])
    :~  ['name' s+name.location.act]
        ['location' s+(scot %p host.location.act)]
        ['width' ?~(width.act ~ (numb u.width.act))]
        ['height' ?~(height.act ~ (numb u.height.act))]
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
      (topojson ~(tap by mesh.canvas))
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
    |=  metadata
    ^-  (list [@t json])
    :~  ['name' s+name]
        ['location' s+(scot %p location)]
        ['template' s+template]
        ['file' ?~(file ~ s+u.file)]
        ['private' b+private]
        ['width' (numb width)]
        ['height' (numb height)]
        ['columns' (numb columns)]
        ['mesh' ?~(mesh ~ s+u.mesh)]
        ['lockup' ?~(lockup ~ (numb (div u.lockup ~s1)))]
    ==
  ::
  ++  topojson
    |=  properties=(list [@t arc])
    ^-  json
    |^
    %-  pairs
    :~  ['arcs' a+~]
        ['transform' (pairs transform)]
        ['objects' (pairs objects)]
    ==
    ::
    ++  transform
      :~  ['scale' a+~[[n+~.1] [n+~.1]]]
          ['translate' a+~[[n+~.0] [n+~.0]]]
      ==
    ::
    ++  objects
      :_  ~
      :-  'pixels'
      %-  pairs
      :~  ['type' s+'GeometryCollection']
          ['geometries' a+(turn properties geometries)]
      ==
    ::
    ++  geometries
      |=  [id=@t =arc]
      ^-  json
      %-  pairs
      :~  ['id' n+id]
          ['type' s+'Polygon']
          ['arcs' a+~]
          ['properties' (arc-to-json id arc)]
      ==
    --
  ::
  ++  arc-to-json
    |=  [id=@t =arc]
    ^-  json
    %-  pairs
    ^-  (list [@t json])
    :~  ['id' n+id]
        ['color' s+color.arc]
        ['when' ?~(when.arc ~ (time u.when.arc))]
        ['who' ?~(who.arc ~ (ship u.who.arc))]
    ==
  ::
  ++  stroke-to-json
    |=  [=stroke who=@p]
    ^-  (list [@t json])
    ?-    -.stroke
        %mesh
      ?~  arc.stroke
        ['id' n+id.stroke]~
      =*  arc  u.arc.stroke
      :~  ['id' n+id.stroke]
          ['color' s+color.arc]
          ['when' ?~(when.arc ~ (time u.when.arc))]
          ['who' (ship who)]
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

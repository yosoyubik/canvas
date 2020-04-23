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
        [%join join]
        [%create create]
        [%share share]
        [%save save]
    ==
  ::
  ++  create
    %-  ot
    :~  ['name' so]
        ['type' (cu canvas-type so)]
        ['location' (su ;~(pfix sig fed:ag))]
    ==
  ::
  ++  paint
    %-  ot
    :~  ['canvas-name' so]
        ['location' (su ;~(pfix sig fed:ag))]
        :-  'stroke'
        %-  of
        [%mesh (ot ~[['id' ni] ['filled' bo]])]~
    ==
  ::
  ++  join
    (ot ~[['ship' (su fed:ag)] ['canvas-name' so]])
  ::
  ++  save
    (ot ~[['canvas-name' so] ['svg' so]])
  ::
  ++  share
    ::  TODO: add chat name
    ::
    (ot ['canvas-name' so]~)
  --
::
++  canvas-view-response-to-json
  |=  act=canvas-view-response
  ^-  json
  =,  enjs:format
  %+  frond  -.act
  ?+     -.act  ~|(%action-not-supported !!)
      %init
    :: :-  %a
    :: %+  turn  gallery.act
    :: |=  [@tas mesh =metadata]
    :: ^-  json
    :: (pairs ~[['name' s+name.metadata] ['type' s+type.metadata]])
    %-  pairs
    %+  turn  gallery.act
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
      %paint
    %-  pairs
    %+  weld
      (stroke-to-json stroke.act)
    ^-  (list [@t json])
    :~  ['name' s+name.act]
        ['location' s+(scot %p location.act)]
    ==
  ==
::
++  canvas-to-json
  |=  =canvas
  ^-  (list [@t json])
  =,  enjs:format
  ?-    -.canvas
      %mesh
    :_  ~
    :-  'data'
    %-  pairs
    %-  zing
    (turn ~(tap by mesh.canvas) arc-to-json)
  ::
  ==
::
++  metadata-to-json
  |=  =metadata
  ^-  (list [@t json])
  :~  ['name' s+name.metadata]
      ['location' s+(scot %p location.metadata)]
      ['type' s+type.metadata]
  ==
::
++  arc-to-json
  |=  arc
  ^-  (list [@t json])
  =,  format
  [(no:dejs (numb:enjs id)) b+filled]~
::
++  stroke-to-json
  |=  =stroke
  ^-  (list [@t json])
  =,  format
  ?-    -.stroke
      %mesh
    :~  ['id' (numb:enjs id.arc.stroke)]
        ['fill' b+filled.arc.stroke]
    ==
  ==
--

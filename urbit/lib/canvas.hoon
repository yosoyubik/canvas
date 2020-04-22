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
        :: [%load so]
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
    ==
  ::
  ++  paint
    %-  ot
    :~  ['canvas-name' so]
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
    (metadata-to-json metadata.canvas)
  ::
      %load
    %-  pairs
    %+  weld
      ['name' s+name.act]~
    (canvas-to-json canvas.act)
  ::
      %paint
    %-  pairs
    %+  weld
      ['name' s+name.act]~
    (stroke-to-json stroke.act)
  ==
::
++  canvas-to-json
  |=  =canvas
  ^-  (list [@t json])
  =,  enjs:format
  ?-    -.canvas
      %mesh
    :~  ['type' s+'mesh']
        :-  'data'
        %-  pairs
        %-  zing
        (turn ~(tap by mesh.canvas) arc-to-json)
    ==
  ::
  ==
::
++  metadata-to-json
  |=  meta=metadata
  ^-  (list [@t json])
  =,  enjs:format
  ['metadata' (pairs ~[['name' s+name.meta] ['type' s+type.meta]])]~
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

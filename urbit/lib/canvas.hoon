/-  *canvas
/+  base64
|%
++  json-to-canvas-action
  |=  jon=json
  ^-  canvas-action
  =,  dejs:format
  |^  (parse-json jon)
  ::
  ++  parse-json
    %-  of
    :~  [%paint (ot ~[['id' ni] ['filled' bo]])]
    ==
  --
::
++  canvas-action-to-json
  |=  act=canvas-action
  ^-  json
  =,  enjs:format
  %+  frond  -.act
  %-  pairs
  ?-     -.act
      %init
    %-  zing
    (turn ~(tap by hexagons.act) arc-to-json)
  ::
      %paint
    (arc-to-json arc.act)
  ==
::
++  arc-to-json
  |=  =arc
  ^-  (list [@t json])
  =,  format
  [(no:dejs (numb:enjs id.arc)) b+filled.arc]~
  :: :~  ['id' (numb id.arc)]
  ::     ['filled' b+filled.arc]
  :: ==
--

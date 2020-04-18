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
    :~  [%paint paint]
        [%join join]
        [%create so]
        [%share share]
        [%save save]
    ==
  ::
  ++  paint
    (ot ~[['canvas-id' so] ['id' ni] ['filled' bo]])
  ::
  ++  join
    (ot ~[['ship' (su fed:ag)] ['canvas-id' so]])
  ::
  ++  save
    (ot ~[['canvas-id' so] ['svg' so]])
  ::
  ++  share
    (ot ['canvas-id' so]~)
  --
::
++  canvas-action-to-json
  |=  act=canvas-action
  ^-  json
  =,  enjs:format
  %+  frond  -.act

  ?+     -.act  ~|(%action-not-supported !!)
      %init
    %-  pairs
    %-  zing
    (turn ~(tap by hexagons.act) arc-to-json)
  ::
      %paint
    %+  frond  id.act
    (pairs (arc-to-json arc.act))
  ==
::
++  arc-to-json
  |=  =arc
  ^-  (list [@t json])
  =,  format
  [(no:dejs (numb:enjs id.arc)) b+filled.arc]~
--

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
    :~  [%test so]
    ==
  --
--

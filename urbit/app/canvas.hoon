::  canvas A Canvas app for Urbit
::
::    data:            scry command:
::    ------------    ----------------------------------------------
::    test           .^(canvas %gx /=canvas=/test/noun)
::
/-  *canvas
/+  *server, default-agent, verb, *canvas
::
/=  index
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/canvas/index
  /|  /html/
      /~  ~
  ==
/=  tile-js
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/canvas/js/tile
  /|  /js/
      /~  ~
  ==
/=  script
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/canvas/js/index
  /|  /js/
      /~  ~
  ==
/=  style
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/canvas/css/index
  /|  /css/
      /~  ~
  ==
/=  canvas-png
  /^  (map knot @)
  /:  /===/app/canvas/img  /_  /png/
/=  canvas-svg
  /^  (map knot @)
  /:  /===/app/canvas/svg  /_  /svg/
::  State
::
=>  |%
    +$  card  card:agent:gall
    ::
    +$  state
      $%  [%0 state-zero]
      ==
    ::
    +$  state-zero
      $:  mesh=hexagons
          test=?
      ==
    --
::
=|  state-zero
=*  state  -
::  Main
::
%+  verb  |
^-  agent:gall
=<  |_  =bowl:gall
    +*  this       .
        canvas-core  +>
        cc         ~(. canvas-core bowl)
        def        ~(. (default-agent this %|) bowl)
    ::
    ++  on-init
      ^-  (quip card _this)
      ~&  "innito"
      ~&  launch-poke
      :_  this
      :~  ::  Attaches tile to %launch app
          ::
          launch-poke
          ::  Connects %eyre to the app
          ::
          [%pass /bind/canvas %arvo %e %connect [~ /'~canvas'] %canvas]
      ==
    ++  on-poke
      |=  [=mark =vase]
      ^-  (quip card _this)
      ?>  (team:title our.bowl src.bowl)
      ?+    mark  (on-poke:def mark vase)
          %json
        ~&  "got poked"
        =^  cards  state
          (handle-json:cc !<(json vase))
        [cards this]
      ::
          %handle-http-request
        =+  !<([eyre-id=@ta =inbound-request:eyre] vase)
        :_  this
        %+  give-simple-payload:app  eyre-id
        %+  require-authorization:app  inbound-request
        poke-handle-http-request:cc
        ::
          %canvas-action
        =^  cards  state
          (handle-canvas-action:cc !<(canvas-action vase))
        [cards this]
      ==
    ::
    ++  on-watch
      |=  =path
      ^-  (quip card _this)
      :_  this
      ?+  path  ~|([%peer-canvas-strange path] !!)
        [%canvastile ~]    [%give %fact ~ %json !>(*json)]~
        [%primary *]       [%give %fact ~ %json !>(innit-load)]~
        [%http-response *]  ~
      ==
    ::
    ++  on-agent  on-agent:def
    ::
    ++  on-arvo
      |=  [=wire =sign-arvo]
      ^-  (quip card _this)
      ?.  ?=(%bound +<.sign-arvo)
        (on-arvo:def wire sign-arvo)
      [~ this]
    ::
    ++  on-save  on-save:def
    ++  on-load  on-load:def
    ++  on-leave  on-leave:def
    ++  on-peek   on-peek:def
    ++  on-fail   on-fail:def
    --
::
::
|_  bowl=bowl:gall
++  launch-poke
  ^-  card
  :*  %pass
      /launch/canvas
      %agent
      [our.bowl %launch]
      %poke
      %launch-action
      !>([%add %canvas /canvastile '/~canvas/js/tile.js'])
  ==
::
++  innit-load
  ^-  json
  (canvas-action-to-json %init mesh)
::
++  handle-json
  |=  jon=json
  ^-  (quip card _state)
  ?>  (team:title our.bowl src.bowl)
  (handle-canvas-action (json-to-canvas-action jon))
::
++  handle-canvas-action
  |=  act=canvas-action
  ^-  (quip card _state)
  |^
  ?-  -.act
      %paint  (handle-paint +.act)
      %init   (handle-init +.act)
  ==
  ::
  ++  handle-paint
    |=  =arc
    ^-  (quip card _state)
    `state(mesh (~(put by mesh) arc))
  ::
  ++  handle-init
    |=  =hexagons
    ^-  (quip card _state)
    `state(mesh hexagons)
  --
::
++  poke-handle-http-request
  |=  =inbound-request:eyre
  ^-  simple-payload:http
  =+  url=(parse-request-line url.request.inbound-request)
  ?+  site.url  not-found:gen
      [%'~canvas' %css %index ~]  (css-response:gen style)
      [%'~canvas' %js %tile ~]    (js-response:gen tile-js)
      [%'~canvas' %js %index ~]   (js-response:gen script)
  ::
      [%'~canvas' %img @t *]
    =/  name=@t  i.t.t.site.url
    =/  img  (~(get by canvas-png) name)
    ?~  img
      not-found:gen
    (png-response:gen (as-octs:mimes:html u.img))
  ::
      [%'~canvas' *]  (html-response:gen index)
  ==
--

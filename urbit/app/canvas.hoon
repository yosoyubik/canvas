::  canvas: A Canvas app for Urbit
::
::    data:            scry command:
::    ------------    ----------------------------------------------
::    mesh           .^(* %gx /=canvas=/mesh/id/noun)
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
      $:  canvas=(map @t hexagons)
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
      :_  this(canvas (~(put by canvas) ['0' ~]))
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
      ~&  path
      :_  this
      ?+    path  ~|([%peer-canvas-strange path] !!)
          [%canvastile ~]
        [%give %fact ~ %json !>(*json)]~
      ::
          [%primary *]
        [%give %fact ~ %json !>((canvas-action-to-json innit-load))]~
      ::
          [%http-response *]
        ~
      ::
          [%canvas ^]
        ~&  path
        =^  cards  state
           (send-init-canvas:cc i.t.path)
         cards
      ==
    ::
    ++  on-agent
      |=  [=wire =sign:agent:gall]
      ^-  (quip card _this)
      ~&  -.sign
      ?-    -.sign
          %poke-ack   (on-agent:def wire sign)
          %watch-ack  (on-agent:def wire sign)
          %kick       (on-agent:def wire sign)
      ::
          %fact
        =^  cards  state
          =*  vase  q.cage.sign
          ^-  (quip card _state)
          ?+    p.cage.sign  ~|([%canvas-bad-update-mark wire vase] !!)
              %canvas-action
            (handle-canvas-action:cc !<(canvas-action q.cage.sign))
          ==
        [cards this]
      ==
    ::
    ++  on-arvo
      |=  [=wire =sign-arvo]
      ^-  (quip card _this)
      ~&  [wire sign-arvo]
      ?:  ?=(%bound +<.sign-arvo)
        [~ this]
      (on-arvo:def wire sign-arvo)
    ::
    ++  on-save  on-save:def
    ++  on-load  on-load:def
    ++  on-leave  on-leave:def
    ::  +on-peek: read from app state
    ::
    ++  on-peek
      |=  =path
      ^-  (unit (unit cage))
      ?+  path  (on-peek:def path)
          [%x %mesh @t ~]  ``noun+!>((~(get by canvas) i.t.t.path))
      ==
    ::
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
++  subscribe
  |=  [=ship canvas-id=@t]
  ^-  card
  :*  %pass
      /subscribe/(scot %p ship)/(scot %da now.bowl)
      %agent
      [ship %canvas]
      %watch
      /canvas/(scot %tas canvas-id)
  ==
::
++  send-update
  |=  [canvas-id=@t =arc]
  ^-  card
  :*  %give
      %fact
      [/canvas/(scot %tas canvas-id)]~
      %canvas-action
      !>([%paint canvas-id arc])
  ==
::
++  innit-load
  ^-  canvas-action
  =/  mesh=(unit hexagons)  (~(get by canvas) '0')
  ~&  ["innit-load" mesh]
  [%init ['0' ?~(mesh ~ u.mesh)]]
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
    %init    (handle-init +.act)
    %paint   (handle-paint +.act)
    %join    (handle-join +.act)
    %create  (handle-create +.act)
  ==
  ::
  ++  handle-paint
    |=  [id=@t =arc]
    ^-  (quip card _state)
    ::  FIXME: remove
    ::
    :: =?  canvas  =(canvas ~)  (~(put by canvas) ['0' ~])
    =/  mesh=(unit hexagons)  (~(get by canvas) id)
    ?~  mesh  `state
    :: =.  canvas  (~(put by canvas) [id (~(put by u.mesh) arc)])
    :_  %_  state
            canvas
          %+  ~(put by canvas)  id
          ?.  filled.arc
            (~(del by u.mesh) id.arc)
          (~(put by u.mesh) arc)
        ==
    :: :_  state
    ?.  (team:title our.bowl src.bowl)
      ::  foreign
      ::
      ~&  "foreign, udpate my frontend"
      =/  data=json  (canvas-action-to-json [%paint id arc])
        :: (canvas-action-to-json [%init id (~(got by canvas) id)])
      [%give %fact [/primary]~ %json !>(data)]~
    ::  local
    ::
    ~&  'local, send to subscribers'
    [(send-update id arc)]~
  ::
  ++  handle-init
    |=  [id=@t mesh=hexagons]
    ^-  (quip card _state)
    =/  data=json  (canvas-action-to-json [%init id mesh])
    :-  [%give %fact [/primary]~ %json !>(data)]~
    state(canvas (~(put by canvas) [id mesh]))
  ::
  ++  handle-join
    |=  [=ship canvas-id=@t]
    ^-  (quip card _state)
    ~&  "subscribing..."
    :-  [(subscribe ship canvas-id)]~
    ::  TODO: do it after confirmation?
    ::
    state(canvas (~(put by canvas) [canvas-id ~]))
  ::
  ++  handle-create
   |=  id=@t
   ^-  (quip card _state)
   :-  ~
   state(canvas (~(put by canvas) [id ~]))
  --
::
++  send-init-canvas
  |=  canvas-id=@t
  ^-  (quip card _state)
  ~&  "send-init-canvas"
  ::   send canvas state
  ::
  :_  state
  [%give %fact ~ %canvas-action !>(innit-load)]~
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

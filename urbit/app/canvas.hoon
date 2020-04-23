::  canvas: A Canvas app for Urbit
::
::    data:            scry command:
::    ------------    ----------------------------------------------
::    canvas           .^(* %gx /=canvas=/canvas/<name>/noun)
::    gallery          .^(* %gx /=canvas=/gallery/noun)
::
/-  *canvas, *chat-store
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
      $:  gallery=(map @t canvas)
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
    ++  on-init  on-init:def
    ++  on-poke
      |=  [=mark =vase]
      ^-  (quip card _this)
      ?>  (team:title our.bowl src.bowl)
      ?+    mark  (on-poke:def mark vase)
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
      ::     [%canvastile ~]
      ::   [%give %fact ~ %json !>(*json)]~
      :: ::
      ::     [%primary *]
      ::   [%give %fact ~ %json !>((canvas-action-to-json innit-load))]~
      :: ::
      ::     [%http-response *]
      ::   ~
          [%updates ~]  ~
      ::
          [%canvas ^]
        ~&  [src.bowl path %canvas]
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
          ~&  p.cage.sign
          ?+    p.cage.sign  ~|([%canvas-bad-update-mark wire vase] !!)
              %canvas-update
            (handle-canvas-update:cc !<(canvas-update vase))
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
      ~&  scry+path
      ?+  path  (on-peek:def path)
          [%x %canvas @t ~]  ``noun+!>((~(got by gallery) i.t.t.path))
          [%x %gallery ~]    ``noun+!>(~(val by gallery))
      ==
    ::
    ++  on-fail   on-fail:def
    --
::
|_  bowl=bowl:gall
:: ++  launch-poke
::   ^-  card
::   :*  %pass
::       /launch/canvas
::       %agent
::       [our.bowl %launch]
::       %poke
::       %launch-action
::       !>([%add %canvas /canvastile '/~canvas/js/tile.js'])
::   ==
::
:: ++  innit-load
::   ^-  canvas-action
::   =/  mesh=(unit hexagons)  (~(get by canvas) '0')
::   ~&  ["innit-load" mesh]
::   [%init ['0' ?~(mesh ~ u.mesh)]]
::
++  subscribe
  |=  [=ship canvas-name=@t]
  ^-  card
  :*  %pass
      /subscribe/(scot %p ship)
      %agent
      [ship %canvas]
      %watch
      /canvas/(scot %tas canvas-name)
  ==
::
++  send-init-canvas
  |=  name=@t
  ^-  (quip card _state)
  ~&  "send-init-canvas"
  ::   send canvas state
  ::
  =/  canvas=(unit canvas)  (~(get by gallery) name)
  ?~  canvas  `state
  :_  state
  [%give %fact ~ %canvas-update !>([%load name u.canvas])]~
::
++  send-canvas-stroke
  |=  [name=@t =stroke]
  ^-  card
  :*  %give
      %fact
      [/canvas/(scot %tas name)]~
      %canvas-update
      !>([%paint name stroke])
  ==
::
++  handle-canvas-action
  |=  act=canvas-action
  ^-  (quip card _state)
  |^
  ?+  -.act  !!
    :: %init    (handle-init +.act)
    :: %load    (handle-load +.act)
    %paint   (handle-paint +.act)
    %join    (handle-join +.act)
    %create  (handle-create +.act)
    %share   (handle-share +.act)
    %save    (handle-save +.act)
  ==
  ::
  :: ++  handle-init
  ::   |=  canvas-list=(list metadata)
  ::   ^-  (quip card _state)
  ::   :: =/  data=json  (canvas-action-to-json [%init id mesh])
  ::   =/  data=json  (canvas-action-to-json [%init canvas-list])
  ::   :_  state
  ::   [%give %fact [/primary]~ %json !>(data)]~
  ::   :: :-  [%give %fact [/primary]~ %json !>(data)]~
  ::   :: state(canvas (~(put by canvas) [id mesh]))
  ::
  :: ++  handle-load
  ::   |=  [name=@t =canvas]
  ::   ^-  (quip card _state)
  ::   :_  state(gallery (~(put by gallery) [name canvas]))
  ::   [%give %fact [/updates]~ %canvas-update !>([%load name canvas])]~
  ::
  ++  handle-paint
    |=  [name=@t =stroke]
    ^-  (quip card _state)
    (process-remote-paint name stroke)
  ::
  :: ++  handle-frontend-load
  ::   |=  [id=@t mesh=hexagons]
  ::   ^-  (quip card _state)
  ::   =/  data=json  (canvas-action-to-json [%init id mesh])
  ::   :-  [%give %fact [/primary]~ %json !>(data)]~
  ::   state(canvas (~(put by canvas) [id mesh]))
  ::
  ++  handle-join
    |=  [=ship name=@t]
    ^-  (quip card _state)
    ~&  "subscribing..."
    :_  state
    [(subscribe ship name)]~
    ::  TODO: do it after confirmation is subs failed?
    ::
    :: state(gallery (~(put by gallery) [name []]))
  ::
  ::
  ++  handle-create
   |=  =canvas
   ^-  (quip card _state)
   :-  ~
   state(gallery (~(put by gallery) [name.metadata.canvas canvas]))
  ::
  ++  handle-share
   |=  name=@t
   ^-  (quip card _state)
   :_  state
   ::  TODO: check if file has been created already?
   ::  disable share on browser if not
   ::
   =/  =path  (weld /~ [(scot %p our.bowl) name ~])
   =/  serial=@uvH  (shaf %msg-uid eny.bowl)
   ::  TODO: request hostname and port to %eyre
   ::
   =/  port=@ud  ?:(=(our.bowl ~fyr) 8.080 8.081)
   =/  =letter
     :-  %url
     %-  crip
     "http://localhost:{(trip (rsh 3 2 (scot %ui port)))}/~canvas/svg/{(trip name)}.png"
   =/  =envelope  [serial *@ our.bowl now.bowl letter]
   :_  ~
   :*  %pass
       ~[%chat %share name]
       %agent
       [our.bowl %chat-hook]
       %poke
       %chat-action
       !>([%message path envelope])
   ==
  ::
  ++  handle-save
    |=  [file=@t svg=@t]
    ^-  (quip card _state)
    =/  =path
      ~[(scot %p our.bowl) %home (scot %da now.bowl) %app %canvas %svg file %svg]
    =/  contents=cage  [%svg !>(svg)]
    :_  state
    [%pass /write-file %arvo %c %info (foal:space:userlib path contents)]~
  --
::
++  handle-canvas-update
  |=  act=canvas-update
  ^-  (quip card _state)
  |^
  ?-  -.act
    :: %init    (handle-init +.act)
    %load    (handle-load +.act)
    %paint   (handle-paint +.act)
  ==
  ::
  ++  handle-load
    |=  [name=@t =canvas]
    ^-  (quip card _state)
    :_  state(gallery (~(put by gallery) [name canvas]))
    [%give %fact [/updates]~ %canvas-view !>([%load name canvas])]~
  ::
  ++  handle-paint
    |=  [name=@t =stroke]
    ^-  (quip card _state)
    (process-remote-paint name stroke)
  --
::
++  process-remote-paint
  |=  [name=@t edit=stroke]
  ^-  (quip card _state)
  =/  target-canvas=(unit canvas)  (~(get by gallery) name)
  ?~  target-canvas  `state
  ?.  =(-.edit -.u.target-canvas)  `state
  |^
  ?-  -.u.target-canvas
    %mesh  (handle-mesh name +.u.target-canvas edit)
  ==
  ::
  ++  handle-mesh
    |=  [name=@t [=mesh =metadata] =stroke]
    ^-  (quip card _state)
    :_  %_  state
            gallery
          %+  ~(put by gallery)  name
          ^-  canvas
          :*  %mesh
            ::
              ?.  filled.arc.stroke
                (~(del by mesh) id.arc.stroke)
              (~(put by mesh) arc.stroke)
            ::
              metadata
          ==
        ==
    ?.  (team:title our.bowl src.bowl)
      ::  foreign
      ::
      ~&  "foreign, udpate my frontend"
      [%give %fact [/updates]~ %canvas-view !>([%paint name stroke])]~
    ::  local
    ::
    ~&  'local, send to subscribers'
    [(send-canvas-stroke name stroke)]~
  --
::
:: ++  poke-handle-http-request
::   |=  [=inbound-request:eyre url=(list @t)]
::   ^-  simple-payload:http
::   |^
::   ?:  ?=([%'~canvas' %svg ^] url)
::     (handle-svg-call i.t.t.url)
::   %+  require-authorization:app  inbound-request
::   handle-auth-call
::   ::
::   ++  handle-svg-call
::     |=  file=@t
::     ^-  simple-payload:http
::     ~&  file
::     =/  svg  (~(get by canvas-svg) file)
::     ?~  svg
::       not-found:gen
::     (svg-response:gen (as-octs:mimes:html u.svg))
::   ::
::   ++  handle-auth-call
::     |=  =inbound-request:eyre
::     ^-  simple-payload:http
::     =/  url=request-line
::       (parse-request-line url.request.inbound-request)
::     ?+  site.url  not-found:gen
::       [%'~canvas' %css %index ~]  (css-response:gen style)
::       [%'~canvas' %js %tile ~]    (js-response:gen tile-js)
::       [%'~canvas' %js %index ~]   (js-response:gen script)
::       [%'~canvas' %img @t *]      (handle-img-call i.t.t.site.url)
::       [%'~canvas' *]              (html-response:gen index)
::     ==
::   ::
::   ++  handle-img-call
::     |=  name=@t
::     ^-  simple-payload:http
::     =/  img  (~(get by canvas-png) name)
::     ?~  img
::       not-found:gen
::     (png-response:gen (as-octs:mimes:html u.img))
::   --
--

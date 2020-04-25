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
      $:  gallery=(map location canvas)
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
      ~&  [src.bowl path]
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
      ?+    path  (on-peek:def path)
          [%x %canvas @t @t ~]
        ``noun+!>((~(got by gallery) (extract-location t.t.path)))
      ::
          [%x %gallery ~]
        ``noun+!>(~(val by gallery))
      ==
    ::
    ++  on-fail   on-fail:def
    --
::
|_  bowl=bowl:gall
++  extract-location
  |=  =path
  ^-  [ship @t]
  ?>  ?=([@t @t ~] path)
  :_  i.t.path
  (rash i.path ;~(pfix sig fed:ag))
::
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
  |=  [=ship name=@t]
  ^-  card
  :*  %pass
      /subscribe/(scot %p ship)/(scot %tas name)
      %agent
      [ship %canvas]
      %watch
      /canvas/(scot %tas name)
  ==
::
++  send-init-canvas
  |=  name=@t
  ^-  (quip card _state)
  ~&  "send-init-canvas"
  ::   send canvas state
  ::
  =/  canvas=(unit canvas)  (~(get by gallery) [our.bowl name])
  ?~  canvas  `state
  :_  state
  [%give %fact ~ %canvas-update !>([%load name u.canvas])]~
::
++  send-canvas-update
  |=  [name=@t =stroke]
  ^-  card
  :*  %give
      %fact
      [/canvas/(scot %tas name)]~
      %canvas-update
      !>([%paint our.bowl name stroke])
  ==
::
++  update-remote-canvas
  |=  [name=@t =stroke location=@p]
  ^-  card
  :*  %pass
      [%paint name ~]
      %agent
      [location %canvas]
      %poke
      %canvas-action
      !>([%paint location name stroke])
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
    |=  [location=@p name=@t =stroke]
    ^-  (quip card _state)
    ~&  "processing remote paint"
    (process-remote-paint location name stroke)
  ::
  ++  handle-join
    |=  [=ship name=@t]
    ^-  (quip card _state)
    ?>  (team:title our.bowl src.bowl)
    ~&  ["subscribing..." ship name]
    [[(subscribe ship name)]~ state]
  ::
  ++  handle-create
   |=  =canvas
   ^-  (quip card _state)
   ?>  (team:title our.bowl src.bowl)
   =/  load=canvas-view  [%load name.metadata.canvas canvas]
   :-  [%give %fact [/updates]~ %canvas-view !>(load)]~
   state(gallery (~(put by gallery) [[our.bowl name.metadata.canvas] canvas]))
  ::
  ++  handle-share
   |=  name=@t
   ^-  (quip card _state)
   ?>  (team:title our.bowl src.bowl)
   :_  state
   ::  TODO: check if file has been created already?
   ::  disable share on browser if not
   ::
   =/  =path  (weld /~ [(scot %p our.bowl) name ~])
   =/  serial=@uvH  (shaf %msg-uid eny.bowl)
   =/  =hart:eyre  .^(hart:eyre %e /(scot %p our.bowl)/host/real)
   =/  port=@ud  (need q.hart)
   =/  domain=tape
     %+  weld
       ?:(p.hart "https://" "http://")
    ?-  -.r.hart
      %.y  (trip (en-turf:html p.r.hart))
      %.n  (slag 1 (scow %if p.r.hart))
    ==
   =/  =letter
     :-  %url
     %-  crip
     "{domain}:{((d-co:co 1) port)}/~canvas/svg/{(trip name)}.png"
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
    ?>  (team:title our.bowl src.bowl)
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
    :_  state(gallery (~(put by gallery) [[src.bowl name] canvas]))
    [%give %fact [/updates]~ %canvas-view !>([%load name canvas])]~
  ::
  ++  handle-paint
    |=  [location=@p name=@t =stroke]
    ^-  (quip card _state)
    (process-remote-paint location name stroke)
  --
::
++  process-remote-paint
  |=  [location=@p name=@t edit=stroke]
  ^-  (quip card _state)
  =/  target-canvas=(unit canvas)  (~(get by gallery) [location name])
  ?~  target-canvas  `state
  ?.  =(-.edit -.u.target-canvas)  `state
  |^
  ?-  -.u.target-canvas
    %mesh  (handle-mesh name +.u.target-canvas edit location)
  ==
  ::
  ++  handle-mesh
    |=  [name=@t [=mesh =metadata] =stroke location=@p]
    ^-  (quip card _state)
    :_  %_  state
            gallery
          %+  ~(put by gallery)  [location name]
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
      ::  stroke from a remote ship
      ::
      ~&  "foreign, udpate my frontend"
      [%give %fact [/updates]~ %canvas-view !>([%paint name location stroke])]~
    ::  stroke from frontend
    ::
    ?:  =(location our.bowl)
      ~&  'local canvas, send to subscribers'
      [(send-canvas-update name stroke)]~
    ~&  'remote canvas, poke owner'
    [(update-remote-canvas name stroke location)]~
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

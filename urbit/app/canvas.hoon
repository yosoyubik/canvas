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
++  leave
  |=  [=ship name=@t]
  ^-  card
  :*  %pass
      /subscribe/(scot %p ship)/(scot %tas name)
      %agent
      [ship %canvas]
      %leave
      ~
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
++  send-paint-update
  |=  strokes=(list [location=@p name=@t =stroke])
  ^-  card
  ?>  ?=(^ strokes)
  :*  %give
      %fact
      [/canvas/(scot %tas name.i.strokes)]~
      %canvas-update
      !>([%paint strokes])
  ==
::
++  update-remote-canvas
  |=  strokes=(list [location=@p name=@t =stroke])
  ^-  card
  ?>  ?=(^ strokes)
  :*  %pass
      [%paint name.i.strokes ~]
      %agent
      [location.i.strokes %canvas]
      %poke
      %canvas-action
      !>([%paint strokes])
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
    %leave   (handle-leave +.act)
    %create  (handle-create +.act)
    %share   (handle-share +.act)
    %save    (handle-save +.act)
  ==
  ::
  ++  handle-paint
    |=  strokes=(list [location=@p name=@t =stroke])
    ^-  (quip card _state)
    ~&  "processing remote paint"
    (process-remote-paint strokes)
  ::
  ++  handle-join
    |=  [=ship name=@t]
    ^-  (quip card _state)
    ?>  (team:title our.bowl src.bowl)
    ~&  ["subscribing..." ship name]
    [[(subscribe ship name)]~ state]
  ::
  ++  handle-leave
    |=  [=ship name=@t]
    ^-  (quip card _state)
    ?>  (team:title our.bowl src.bowl)
    ~&  ["leaving" ship name]
    =/  =canvas  (~(got by gallery) [ship name])
    ::  the canvas becomes local
    ::
    =.  location.metadata.canvas  our.bowl
    :_  state(gallery (~(put by gallery) [ship name] canvas))
    :~  (leave ship name)
        [%give %fact [/updates]~ %canvas-view !>([%load name canvas])]
    ==
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
    |=  strokes=(list [location=@p name=@t =stroke])
    ^-  (quip card _state)
    (process-remote-paint strokes)
  --
::
++  process-remote-paint
  |=  strokes=(list [location=@p name=@t =stroke])
  ^-  (quip card _state)
  ?>  ?=(^ strokes)
  =*  location  location.i.strokes
  =*  name      name.i.strokes
  =/  target-canvas=(unit canvas)  (~(get by gallery) [location name])
  ?~  target-canvas  `state
  ?.  =(-.stroke.i.strokes -.u.target-canvas)  `state
  |^
  ?-  -.u.target-canvas
    %mesh  (handle-mesh u.target-canvas strokes)
  ==
  ::
  ++  handle-mesh
    |=  [=canvas strokes=(list [location=@p name=@t =stroke])]
    ^-  (quip card _state)
    :_  %_    state
            gallery
          %+  ~(put by gallery)
            [location name]
          [%mesh (update-canvas-mesh mesh.canvas strokes) metadata.canvas]
        ==
    ?.  (team:title our.bowl src.bowl)
      ::  stroke from a remote ship
      ::
      ~&  "foreign, udpate my frontend"
      [%give %fact [/updates]~ %canvas-view !>([%paint strokes])]~
    ::  stroke from frontend
    ::
    ?:  =(location our.bowl)
      ~&  'local canvas, send to subscribers'
      [(send-paint-update strokes)]~
    ~&  'remote canvas, poke owner'
    [(update-remote-canvas strokes)]~
  ::
  ++  update-canvas-mesh
    |=  [=mesh strokes=(list [@p @t =stroke])]
    ^-  ^mesh
    |-
    ?~  strokes  mesh
    =*  stroke  stroke.i.strokes
    %_    $
        strokes
      t.strokes
    ::
        mesh
      ?.  filled.arc.stroke
        (~(del by mesh) id.arc.stroke)
      (~(put by mesh) arc.stroke)
    ==
      ::
    ::     metadata
    :: ==
  --
--

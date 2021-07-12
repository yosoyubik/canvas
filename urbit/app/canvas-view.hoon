::  canvas-view: A Canvas app for Urbit
::
::
/-  *canvas,
    *chat-store
/+  *server, default-agent, verb,
    *canvas,
    *canvas-templates
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
      $:  ~
      ==
    --
::
=|  state-zero
=*  state  -
::  Main
::
^-  agent:gall
=<  |_  =bowl:gall
    +*  this  .
        cv    ~(. +> bowl)
        def   ~(. (default-agent this %|) bowl)
    ::
    ++  on-init
      ^-  (quip card _this)
      :_  this
      :~  ::  Subscribe to %canvas
          ::
          [%pass /updates %agent [our.bowl %canvas] %watch /updates]
          ::  Serve Web content
          ::
          :*  %pass  /srv  %agent  [our.bowl %file-server]
              %poke  %file-server-action
              !>([%serve-dir /'~canvas' /app/canvas %.n %.y])
          ==
        ::
          ::  Add tile to %launch
          ::
          :*  %pass
              /launch/canvas-view
              %agent
              [our.bowl %launch]
              %poke
              %launch-action
              !>([%add %canvas-view [[%basic 'canvas-view' '/~canvas/img/tile.png' '/~canvas'] %.y]])
     ==   ==
    ::
    ++  on-save  !>(state)
    ::
    ++  on-load
      |=  old=vase
      [~ this(state !<(state-zero old))]
    ::
    ++  on-poke
      |=  [=mark =vase]
      ^-  (quip card _this)
      ?>  (team:title our.bowl src.bowl)
      ?+    mark  (on-poke:def mark vase)
          %json
        =^  cards  state
          (handle-json:cv !<(json vase))
        [cards this]
      ::
          %canvas-view
        =^  cards  state
          (handle-canvas-view:cv !<(canvas-action vase))
        [cards this]
      ==
    ::
    ++  on-watch
      |=  =path
      ^-  (quip card _this)
      :_  this
      ?+    path  ~|([%peer-canvas-strange path] !!)
          [%canvastile ~]
        [%give %fact ~ %json !>(*json)]~
      ::
          [%primary *]
        =^  cards  state
          (handle-canvas-view:cv [%init ~])
        cards
      ::
          [%http-response *]
        ~
      ==
    ::
    ++  on-agent
      |=  [=wire =sign:agent:gall]
      ^-  (quip card _this)
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
            (handle-view-update:cv !<(canvas-action q.cage.sign))
          ==
        [cards this]
      ==
    ::
    ++  on-arvo
      |=  [=wire =sign-arvo]
      ^-  (quip card _this)
      ?:  ?=(%bound +<.sign-arvo)
        [~ this]
      (on-arvo:def wire sign-arvo)
    ::
    ++  on-leave  on-leave:def
    ++  on-peek   on-peek:def
    ++  on-fail   on-fail:def
    --
::
|_  =bowl:gall
++  gallery-scry
  .^  (list canvas)
    %gx
    (scot %p our.bowl)
    %canvas
    (scot %da now.bowl)
    /gallery/noun
  ==
::
++  canvas-scry
  |=  name=@t
  ^-  canvas-view-response
  :+  %load  name
  .^  canvas
    %gx
    (scot %p our.bowl)
    %canvas
    (scot %da now.bowl)
    ~[%canvas name %noun]
  ==
::
++  chats-scry
  ^-  (list path)
  %~  tap   by
  .^  (set path)
    %gx
    (scot %p our.bowl)
    %chat-store
    (scot %da now.bowl)
    /keys/noun
  ==
::
++  send-canvas-action
  |=  [=wire act=canvas-action]
  ^-  card
  [%pass wire %agent [our.bowl %canvas] %poke %canvas-action !>(act)]
::
++  send-frontend
  |=  =json
  ^-  (list card)
  [%give %fact [/primary]~ %json !>(json)]~
::
++  handle-json
  |=  jon=json
  ^-  (quip card _state)
  ?>  (team:title our.bowl src.bowl)
  ::  Actions originated on the frontend
  ::
  (handle-canvas-view (json-to-canvas-view jon))
::
++  handle-canvas-view
  |=  act=canvas-action
  ^-  (quip card _state)
  :_  state
  |^
  ?+  -.act  !!
    %init    handle-init
    %paint   (handle-paint +.act)
    %join    (handle-join +.act)
    %leave   (handle-leave +.act)
    %create  (handle-create +.act)
    %share   (handle-share +.act)
    %save    (handle-save +.act)
  ==
  ::
  ++  handle-init
    ^-  (list card)
    ~&
      .^  canvas
        %gx
        (scot %p our.bowl)
        %canvas
        (scot %da now.bowl)
        ~[%canvas (scot %p our.bowl) 'welcome' %noun]
      ==
    %-  send-frontend
    (canvas-view-response-to-json %init-frontend gallery-scry ~)
  ::
  ++  handle-paint
    |=  [location=@p name=@t strokes=(list stroke)]
    ^-  (list card)
    [(send-canvas-action [%paint name ~] [%paint +<])]~
  ::
  ++  handle-join
    |=  [=ship canvas-name=@t]
    ^-  (list card)
    :_  ~
    %+  send-canvas-action
      [%join (scot %p ship) canvas-name ~]
    [%join +<]
  ::
  ++  handle-leave
    |=  [=ship canvas-name=@t]
    ^-  (list card)
    :_  ~
    %+  send-canvas-action
      [%leave (scot %p ship) canvas-name ~]
    [%leave +<]
  ::
  ++  handle-create
   |=  =canvas
   ^-  (list card)
   :_  ~
   %+  send-canvas-action
     [%create name.metadata.canvas ~]
   ^-  canvas-action
   :-  %create
   ?-  -.canvas
     %draw  [%draw ~ metadata.canvas]
     %mesh  [%mesh ~ metadata.canvas]
   ==
  ::
  ++  handle-share
   |=  [name=@t =path =image-type]
   ^-  (list card)
   [(send-canvas-action [%share name ~] [%share +<])]~
  ::
  ++  handle-save
    |=  [=ship name=@t file=@t]
    ^-  (list card)
    [(send-canvas-action [%save name ~] [%save +<])]~
  --
::
++  handle-view-update
  |=  act=canvas-action
  ^-  (quip card _state)
  :_  state
  |^
  ?+  -.act  !!
    %paint   (handle-paint +.act)
    %load    (handle-load +.act)
    :: %file    (handle-file +.act)
  ==
  ::
  ++  handle-paint
    |=  [location=@p name=@t strokes=(list stroke)]
    ^-  (list card)
    %-  send-frontend
    (canvas-view-response-to-json [%paint +<])
  ::
  ++  handle-load
    |=  [name=@t =canvas]
    ^-  (list card)
    (send-frontend (canvas-view-response-to-json [%load +<]))
  --
::
--
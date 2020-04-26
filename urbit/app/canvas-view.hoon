::  canvas-view: A Canvas app for Urbit
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
      :~  [%pass /bind/canvas %arvo %e %connect [~ /'~canvas'] %canvas-view]
          [%pass /updates %agent [our.bowl %canvas] %watch /updates]
        ::
          ::  Add tile to %launch
          ::
          :*  %pass
              /launch/canvas
              %agent
              [our.bowl %launch]
              %poke
              %launch-action
              !>([%add %canvas-view /canvastile '/~canvas/js/tile.js'])
     ==   ==
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
          %handle-http-request
        =+  !<([eyre-id=@ta =inbound-request:eyre] vase)
        =+  url=(parse-request-line url.request.inbound-request)
        :_  this
        %+  give-simple-payload:app  eyre-id
        (poke-handle-http-request:cv inbound-request site.url)
      ::
          %canvas-view
        =^  cards  state
          (handle-canvas-view:cv !<(canvas-view vase))
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
        :_  ~
        :*  %give
            %fact
            ~
            %json
            !>((canvas-view-response-to-json gallery-scry:cv))
        ==
      ::
          [%http-response *]
        ~
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
              %canvas-view
            ~&  "handle-view-update"
            (handle-view-update:cv !<(canvas-view q.cage.sign))
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
    ++  on-save   on-save:def
    ++  on-load   on-load:def
    ++  on-leave  on-leave:def
    ++  on-peek   on-peek:def
    ++  on-fail   on-fail:def
    --
::
|_  bowl=bowl:gall
++  gallery-scry
  ~&  "requesting gallery..."
  ^-  canvas-view-response
  :-  %init
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
++  create-poke
  |=  =metadata
  ^-  card
  :*  %pass
      [%create name.metadata ~]
      %agent
      [our.bowl %canvas]
      %poke
      %canvas-action
      !>([%create [%mesh ~ metadata]])
  ==
::
++  paint-poke
  |=  strokes=(list [location=@p name=@t =stroke])
  ^-  card
  ?~  strokes  !!
  :*  %pass
      [%paint name.i.strokes ~]
      %agent
      [our.bowl %canvas]
      %poke
      %canvas-action
      !>([%paint strokes])
  ==
::
++  join-poke
  |=  [ship=@p canvas-name=@t]
  ^-  card
  :*  %pass
      [%join (scot %p ship) canvas-name ~]
      %agent
      [our.bowl %canvas]
      %poke
      %canvas-action
      !>([%join ship canvas-name])
  ==
::
++  leave-poke
  |=  [ship=@p canvas-name=@t]
  ^-  card
  :*  %pass
      [%leave (scot %p ship) canvas-name ~]
      %agent
      [our.bowl %canvas]
      %poke
      %canvas-action
      !>([%leave ship canvas-name])
  ==
::
++  share-poke
  |=  name=@t
  ^-  card
  :*  %pass
      [%share name ~]
      %agent
      [our.bowl %canvas]
      %poke
      %canvas-action
      !>([%share name])
  ==
::
++  save-poke
  |=  [name=@t svg=@t]
  ^-  card
  :*  %pass
      [%save name ~]
      %agent
      [our.bowl %canvas]
      %poke
      %canvas-action
      !>([%save name svg])
  ==
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
  |=  act=canvas-view
  ^-  (quip card _state)
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
    ^-  (quip card _state)
    =/  data=json  (canvas-view-response-to-json gallery-scry)
    :_  state
    [%give %fact [/primary]~ %json !>(data)]~
  ::
  ++  handle-paint
    |=  strokes=(list [location=@p name=@t =stroke])
    ^-  (quip card _state)
    [[(paint-poke strokes)]~ state]
  ::
  ++  handle-join
    |=  [=ship canvas-name=@t]
    ^-  (quip card _state)
    ~&  "subscribing..."
    [[(join-poke ship canvas-name)]~ state]
  ::
  ++  handle-leave
    |=  [=ship canvas-name=@t]
    ^-  (quip card _state)
    ~&  "leaving..."
    [[(leave-poke ship canvas-name)]~ state]
  ::
  ++  handle-create
   |=  =metadata
   ^-  (quip card _state)
   [[(create-poke metadata)]~ state]
  ::
  ++  handle-share
   |=  name=@t
   ^-  (quip card _state)
   [[(share-poke name)]~ state]
  ::
  ++  handle-save
    |=  [name=@t svg=@t]
    ^-  (quip card _state)
    [[(save-poke name svg)]~ state]
  --
::
++  handle-view-update
  |=  act=canvas-view
  ^-  (quip card _state)
  |^
  ?+  -.act  !!
    %paint   (handle-paint +.act)
    %load    (handle-load +.act)
  ==
  ::
  ++  handle-paint
    |=  strokes=(list [location=@p name=@t =stroke])
    ^-  (quip card _state)
    ~&  "update paint"
    =/  data=json  (canvas-view-response-to-json [%paint strokes])
    :_  state
    [%give %fact [/primary]~ %json !>(data)]~
  ::
  ++  handle-load
    |=  [name=@t =canvas]
    ^-  (quip card _state)
    ~&  "update load"
    =/  data=json  (canvas-view-response-to-json [%load name canvas])
    :_  state
    [%give %fact [/primary]~ %json !>(data)]~
  --
::
++  poke-handle-http-request
  |=  [=inbound-request:eyre url=(list @t)]
  ^-  simple-payload:http
  |^
  ?:  ?=([%'~canvas' %svg ^] url)
    (handle-svg-call i.t.t.url)
  %+  require-authorization:app  inbound-request
  handle-auth-call
  ::
  ++  handle-svg-call
    |=  file=@t
    ^-  simple-payload:http
    ~&  file
    =/  svg  (~(get by canvas-svg) file)
    ?~  svg
      not-found:gen
    (svg-response:gen (as-octs:mimes:html u.svg))
  ::
  ++  handle-auth-call
    |=  =inbound-request:eyre
    ^-  simple-payload:http
    =/  url=request-line
      (parse-request-line url.request.inbound-request)
    ?+  site.url  not-found:gen
      [%'~canvas' %css %index ~]  (css-response:gen style)
      [%'~canvas' %js %tile ~]    (js-response:gen tile-js)
      [%'~canvas' %js %index ~]   (js-response:gen script)
      [%'~canvas' %img @t *]      (handle-img-call i.t.t.site.url)
      [%'~canvas' *]              (html-response:gen index)
    ==
  ::
  ++  handle-img-call
    |=  name=@t
    ^-  simple-payload:http
    =/  img  (~(get by canvas-png) name)
    ?~  img
      not-found:gen
    (png-response:gen (as-octs:mimes:html u.img))
  --
--

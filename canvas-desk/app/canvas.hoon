::  canvas: A p2p drawing app
::
::    data:            scry command:
::    ------------    ----------------------------------------------
::    canvas           .^(canvas %gx /=canvas=/canvas/<ship>/<canvas>/noun)
::    gallery          .^((list canvas) %gx /=canvas=/gallery/noun)
::    artists          .^(artists %gx /=canvas=/canvas/artists/noun)
::    contributions    .^(@ud %gx /=canvas=/contributions/~ship/noun)
::
::  State
::
/-  *canvas
/+  *server, default-agent, verb, dbug,
    *canvas,
    *canvas-templates
::
=>  |%
    +$  card  card:agent:gall
    ::
    +$  app-state
      $:  %2
          gallery=(map location canvas)
          artists=(map location (map ship @ud))
          ::  TODO
          :: contributions=(map ship [locs=(set location) total=@ud])
      ==
    --
::
=|  app-state
=*  state  -
::  Main
::
%-  agent:dbug
^-  agent:gall
::  Utilities
::
=>  |%
    ++  extract-location
      |=  =path
      ^-  [ship @t]
      ?>  ?=([@t @t ~] path)
      :_  i.t.path
      (rash i.path ;~(pfix sig fed:ag))
    ::
    ++  can-paint
      |=  [arc=(unit arc) =bowl:gall meta=metadata]
      ^-  ?
      ~&  arc
      ?~  arc  &
      ::  stroke comes from the previous painter
      ::
      ?:  &(?=(^ who.u.arc) =(u.who.u.arc src.bowl))
        &
      ::  if someone else paints, check if >= lockup time
      ::
      ?&  ?=(^ when.u.arc)
          ?=(^ lockup.meta)
          (gte (sub now.bowl u.when.u.arc) u.lockup.meta)
      ==
      :: ?&  ::del.i.strokes
      ::     ?=(^ lockup.meta)
      ::     ?=(^ when.arc)
      ::     (lth (sub now.bowl u.when.arc) u.lockup.meta)
      ::     ::  our is always allow to edit
      ::     ::
      ::     !=(src.bowl our.bowl)
      ::     ::  accounts for owner updates
      ::     ::
      ::     !=(src.bowl host)
      :: ==
    --
::  Cards
::
=>  |%
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
    ++  send-paint-update
      |=  [name=@t our=@p strokes=(list stroke) who=@p]
      ^-  card
      :*  %give
          %fact
          [/canvas/(scot %tas name)]~
          %canvas-update
          !>([%paint our name strokes who])
      ==
    ::
    ++  send-frontend
      |=  =json
      ^-  (list card)
      [%give %fact [/frontend]~ %json !>(json)]~
    ::
    ++  update-remote-canvas
      |=  [location=@p name=@t strokes=(list stroke)]
      ^-  card
      ?>  ?=(^ strokes)
      :*  %pass
          [%paint name ~]
          %agent
          [location %canvas]
          %poke
          %canvas-action
          !>([%paint location name strokes])
      ==
    --
::
=<  |_  =bowl:gall
    +*  this         .
        canvas-core  +>
        cc           ~(. canvas-core bowl)
        def          ~(. (default-agent this %|) bowl)
    ::
    ++  on-init
      ^-  (quip card _this)
      ~&  >  "[ init canvas - / welcome / ]"
      =|  cards=(list card)
      =+  pub=~master-norsyr-torryn
      =/  name=@t  'welcome'
      =/  =canvas  (welcome ~ name our.bowl &)
      =.  gallery.state  (~(put by gallery) [[our.bowl name] canvas])
      :_  this
      ?:  =(our.bowl pub)  ~
      [(subscribe pub 'canvas')]~
    ::
    ++  on-save  !>(state)
    ::
    ++  on-load
      |=  old=vase
      ^-  (quip card _this)
      =|  cards=(list card)
      =+  pub=~master-norsyr-torryn
      |^
      =+  !<(old-state=app-states old)
      =?  cards  &(?=(%0 -.old-state) !=(our.bowl pub))
        [(subscribe pub 'canvas')]~
      =?  old-state  ?=(%0 -.old-state)
        ^-  state-1
        :+  %1
          gallery.old-state
        (gather-artists gallery.old-state)
      =?  old-state  ?=(%1 -.old-state)
        :+  %2
          (add-lockup gallery.old-state)
        artists.old-state
      ?>  ?=(%2 -.old-state)
      [cards this(state old-state)]
      ::
      ++  app-states  $%(state-0 state-1 app-state)
      ++  state-0
        $:  %0
            gallery=(map location canvas-0)
        ==
      ::
      ++  state-1
        $:  %1
            gallery=(map location canvas-0)
            artists=(map location (map ship @ud))
        ==
      ::
      ++  canvas-0
        $%  [%mesh =mesh =metadata-0]
            [%draw =draw =metadata-0]
        ==
      ::
      ++  add-lockup
        |=  gallery=(map location canvas-0)
        %+  roll  ~(tap by gallery)
        |=  [[=location =canvas-0] gallery=(map location canvas)]
        %+  ~(put by gallery)  location
        ^-  canvas
        %=  canvas-0
          metadata-0
          ::  default ~m30 lockup per pixel
          ::
          [`~m30 metadata-0.canvas-0]
        ==
      ::
      ++  gather-artists
        |=  gallery=(map location canvas-0)
        %+  roll  ~(tap by gallery)
        |=  [[loc=location =canvas-0] out=(map location (map ship @ud))]
        ^-  (map location (map ship @ud))
        ?:  ?=([%draw *] canvas-0)  out
        %+  roll  ~(tap by mesh.canvas-0)
        |=  [[* =arc] out=_out]
        ^-  (map location (map ship @ud))
        ?~  who.arc  out
        %+  ~(put by out)  loc
        ?~  ships=(~(get by out) loc)
          (~(put by *(map ship @ud)) u.who.arc 1)
        (~(jab by u.ships) u.who.arc |=(c=@ud +(c)))
      --
    ::
    ++  on-poke
      |=  [=mark =vase]
      ^-  (quip card _this)
      ?+    mark  (on-poke:def mark vase)
          %canvas-action
        =^  cards  state
          (handle-canvas-action:cc !<(canvas-action vase))
        [cards this]
      ::
          %json
        ?>  (team:title our.bowl src.bowl)
        =^  cards  state
          %-  handle-canvas-action:cc
          (json-to-canvas-view !<(json vase))
        [cards this]
      ==
    ::
    ++  on-watch
      |=  =path
      ^-  (quip card _this)
      :_  this
      ?+    path  ~|([%peer-canvas-strange path] !!)
          [%frontend *]
        =^  cards  state
          (handle-canvas-action:cc [%init ~])
        cards
      ::
          [%canvas ^]
        (send-init-data:cc i.t.path)
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
              %canvas-update
            (handle-canvas-update:cc !<(canvas-update vase))
          ==
        [cards this]
      ==
    ::
    ++  on-arvo
      |=  [=wire =sign-arvo]
      ^-  (quip card:agent:gall _this)
      ?:  ?=(%bound +<.sign-arvo)  [~ this]
      (on-arvo:def wire sign-arvo)
    ::
    ++  on-leave  on-leave:def
    ::
    ++  on-peek
      |=  =path
      ^-  (unit (unit cage))
      ?.  (team:title our.bowl src.bowl)  ~
      ?+    path  (on-peek:def path)
          [%x %canvas @t @t ~]
        ``noun+!>((~(got by gallery) (extract-location t.t.path)))
      ::
          [%x %gallery ~]
        ``noun+!>(~(val by gallery))
      ::
          [%x %artists @t @t ~]
        ``noun+!>((~(got by artists) (extract-location t.t.path)))
      ::
          [%x %contributions @t @t @t ~]
        =/  =location  (extract-location i.t.t.path i.t.t.t.path ~)
        =/  =ship  (rash i.t.t.t.path ;~(pfix sig fed:ag))
        :+  ~  ~
        :-  %noun
        =;  count=(unit @ud)
          !>(?~(count 0 u.count))
        %.  ship
        ~(get by (~(got by artists) location))
      ==
    ::
    ++  on-fail   on-fail:def
    --
::
|_  =bowl:gall
::
++  send-init-data
  |=  name=@t
  ^-  (list card)
  =/  =location  [our.bowl name]
  =/  canvas=(unit canvas)           (~(get by gallery) location)
  =/  artists=(unit (map ship @ud))  (~(get by artists) location)
  ?~  canvas  ~
  ~&  >  ['subscribing...' src.bowl private.metadata.u.canvas]
  ?:  private.metadata.u.canvas
    ~|([%subs-not-allowed name] !!)
  [%give %fact ~ %canvas-update !>([%load name u.canvas ?~(artists ~ u.artists)])]~
::
++  handle-canvas-action
  |=  act=canvas-action
  ^-  (quip card _state)
  |^
  ?+  -.act  !!
    %init    [handle-init state]
    %paint   (handle-paint +.act)
    %join    (handle-join +.act)
    %leave   (handle-leave +.act)
    %create  (handle-create +.act)
    %save    (handle-save +.act)
    %unlock  (handle-unlock +.act)
  ==
  ::
  ++  handle-init
    ^-  (list card)
    %-  send-frontend
    (canvas-view-response-to-json %init-frontend ~(val by gallery) ~ ~)
  ::
  ++  handle-paint
    |=  [location=@p name=@t strokes=(list stroke)]
    ^-  (quip card _state)
    (process-remote-paint location name strokes)
  ::
  ++  handle-join
    |=  [=ship name=@t]
    ^-  (quip card _state)
    ?>  (team:title our.bowl src.bowl)
    ~&  >  "[ join ]"
    [[(subscribe ship name)]~ state]
  ::
  ++  handle-leave
    |=  [=ship name=@t]
    ^-  (quip card _state)
    ~&  >>  ["[ leave ]" ship name]
    ?>  (team:title our.bowl src.bowl)
    =/  new-name=@t
      (crip "{(trip name)}-{(trip (scot %da now.bowl))}")
    =/  =canvas  (~(got by gallery) [ship name])
    ::  the canvas becomes local and private
    ::  and it's archived under the old name and the date
    ::
    =.  metadata.canvas
      %_  metadata.canvas
        private   &
        location  our.bowl
        name      new-name
      ==
    =/  load
      ::[%give %fact [/updates]~ %canvas-action !>([%load new-name canvas])]
      (send-frontend (canvas-view-response-to-json %load new-name canvas ~))
    :-  [(leave ship name) load]
    %_    state
        gallery
      (~(put by (~(del by gallery) [ship name])) [our.bowl new-name] canvas)
    ==
  ::
  ++  handle-create
    |=  =canvas
    ^-  (quip card _state)
    ?>  (team:title our.bowl src.bowl)
    =*  name  name.metadata.canvas
    =*  private  private.metadata.canvas
    ~&  >  ["[ create ]" name]
    =.  canvas
      %.  [canvas name our.bowl private]
      ?+  template.metadata.canvas  blank
        %mesh-welcome    welcome
        %mesh-monkey     monkey
        %mesh-homer      homer
        %mesh-dumas      dumas-dutil
        %mesh-hackathon  hackathon
      ==
    ::  TODO: allow users to set up lockup time
    ::
    =.  lockup.metadata.canvas  `~m30
    =/  load=canvas-view-response
      [%load name.metadata.canvas canvas ~]
    :-  (send-frontend (canvas-view-response-to-json load))
    %_    state
        gallery
      (~(put by gallery) [[our.bowl name.metadata.canvas] canvas])
    ==
  ::
  ++  handle-save
    |=  [=ship name=@t file=@t]
    ^-  (quip card _state)
    ?>  (team:title our.bowl src.bowl)
    =/  canvas=(unit canvas)  (~(get by gallery) [ship name])
    :-  ~
    ?~  canvas  state
    =.  file.metadata.u.canvas  `file
    state(gallery (~(put by gallery) [ship name] u.canvas))
  ::
  ++  handle-unlock
    |=  name=@t
    ^-  (quip card _state)
    ?>  (team:title our.bowl src.bowl)
    ~&  >>  "[ unlock ] / TBA"
    ?:  &  `state
    ?>  (team:title our.bowl src.bowl)
    =/  =canvas  (~(got by gallery) [our.bowl name])
    =.  private.metadata.canvas  |
    :-  ~
    state(gallery (~(put by gallery) [our.bowl name] canvas))
  ::
  --
::
++  handle-canvas-update
  |=  act=canvas-update
  ^-  (quip card _state)
  |^
  ?-  -.act
    %load    (handle-load +.act)
    %paint   (handle-paint +.act)
  ==
  ::
  ++  handle-load
    |=  [name=@t =canvas artists=(map ship @ud)]
    ^-  (quip card _state)
    ~&  >  "loading canvas..."
    =/  =location  [src.bowl name]
    =:  gallery.state  (~(put by gallery) [location canvas])
        artists.state  ?~  artists  artists.state
                       (~(put by artists.state) [location artists])
      ==
    :_  state
    (send-frontend (canvas-view-response-to-json %load name canvas artists))
  ::
  ++  handle-paint
    |=  [location=@p name=@t strokes=(list stroke) who=@p]
    ^-  (quip card _state)
    ?:  =(who our.bowl)
      ::  we receive an update for a stroke we originaly sent; discard
      ::
      `state
    (process-remote-paint location name strokes)
  --
::
++  process-remote-paint
  |=  [host=@p name=@t strokes=(list stroke)]
  ^-  (quip card _state)
  ~&  process-remote-paint+strokes
  :: ?>  ?=(^ strokes)
  ?~  strokes  [~ state]
  =/  =location  [host name]
  ?~  canvas=(~(get by gallery) location)
    ~&  "no canvas"
    `state
  ?.  =(-.i.strokes -.u.canvas)
    ~&  "weird types"
    `state
  =*  meta  metadata.u.canvas
  |^
  =/  [new-canvas=^canvas new-artists=_artists]
    ?:  ?=(%draw -.u.canvas)
      :_  ~
      [%draw (update-draw draw.u.canvas strokes) meta]
    =;  [=mesh new-artists=_artists]
      [[%mesh mesh meta] new-artists]
    (parse-strokes strokes mesh.u.canvas artists.state)
  ::
  :_  %_  state
        artists  new-artists
        gallery  (~(put by gallery) location new-canvas)
      ==
  %-  send-effects
  ?:  ?=(%draw -.u.canvas)  strokes
  %+  skim  ^-((list stroke) strokes)  :: ?
  |=  =stroke
  ?:  ?=(%draw -.stroke)  &
  =+  past-arc=(~(get by mesh.u.canvas) id.stroke)
  (can-paint past-arc bowl meta)
  ::
  ++  send-effects
    |=  strokes=(list stroke)
    ^-  (list card)
    ~&  effects+strokes
    ?.  (team:title our.bowl src.bowl)
      ::  stroke from a remote ship
      ::
      :-  [(send-paint-update name our.bowl strokes src.bowl)]
      %-  send-frontend
      %-  canvas-view-response-to-json
      [%paint host name strokes]
    ::  stroke from frontend
    ::
    ?:  =(src.bowl our.bowl)
      [(send-paint-update name our.bowl strokes our.bowl)]~
      :: =/  paint  !>([%paint location name strokes])
      :: :~  [%give %fact [/updates]~ %canvas-view paint]
      ::     [(send-paint-update name strokes src.bowl)]
      :: ==
    [(update-remote-canvas host name strokes)]~
  ::
  ++  parse-strokes
    |=  [strokes=(list stroke) =mesh artists=_artists.state]
    |-  ^+  [mesh artists]
    ?~  strokes  [mesh artists]
    ?>  ?=(%mesh -.i.strokes)
    =*  arc  arc.i.strokes
    =*  id   id.i.strokes
    =+  past-arc=(~(get by mesh) id)
    ?.  (can-paint past-arc bowl meta)
    ::     ?&  del.i.strokes
    ::         ?=(^ lockup.meta)
    ::         ?=(^ when.arc)
    ::         (lth (sub now.bowl u.when.arc) u.lockup.meta)
    ::         !=(src.bowl our.bowl)
    ::         !=(src.bowl host.location)
    ::      ==
      ~&  "still early..."
      $(strokes t.strokes)
    ~&  [i.strokes artists]
    =:  mesh
      ?:  del.i.strokes
        (~(del by mesh) id)
      (~(put by mesh) [id arc])
      ::
        artists
      (update-artists artists del.i.strokes)
      ==
    $(strokes t.strokes)
  ::
  ++  update-draw
    |=  [=draw strokes=(list stroke)]
    |-  ^+  draw
    ?~  strokes  draw
    ?>  ?=([%draw *] i.strokes)
    %_  $
      draw     (snoc draw form.i.strokes)
      strokes  t.strokes
    ==
  ::
  ++  update-artists
    |=  [artists=_artists remove=?]
    ^+  artists
    ~&  location+location
    %+  ~(put by artists)  location
    ?~  ships=(~(get by artists) location)
      (~(put by *(map ship @ud)) src.bowl 1)
    %+  ~(put by u.ships)  src.bowl
    ?~  artist=(~(get by u.ships) src.bowl)
      1
    ?:(remove (dec u.artist) +(u.artist))
    :: %+  ~(jab by u.ships)  src.bowl
    :: |=(c=@ud ?:(remove (dec c) +(c)))
  --
::
--

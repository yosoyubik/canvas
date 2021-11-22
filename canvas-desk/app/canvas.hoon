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
      $:  %5
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
      ?:  &  &  :: XX
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
          /canvas/(scot %p ship)/(scot %tas name)
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
    ++  send-paint-diff
      |=  [=location strokes=(list stroke) who=@p]
      ^-  card
      :*  %give
          %fact
          [/canvas/(scot %p host.location)/(scot %tas name.location)]~
          %canvas-diff
          !>([%paint location strokes who])
      ==
    ::
    ++  send-frontend
      |=  =json
      ^-  (list card)
      [%give %fact [/frontend]~ %json !>(json)]~
    ::
    ++  send-to-host
      |=  [=location strokes=(list stroke)]
      ^-  card
      ?>  ?=(^ strokes)
      :*  %pass
          [%paint name.location ~]
          %agent
          [host.location %canvas]
          %poke
          %canvas-action
          !>([%paint location strokes])
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
      ~&  >  "[ init canvas - / home / ]"
      =|  cards=(list card)
      =/  pub=@p
        =+  ~picsel
        (can 3 2^0x100 2^0x5ef 2^- ~)
      =/  name=@t  'welcome'
      =/  =canvas  (welcome ~ name our.bowl &)
      =.  gallery.state  (~(put by gallery) [our.bowl name]^canvas)
      :_  this
      ?:  =(our.bowl pub)  ~
      [(subscribe pub 'public')]~
    ::
    ++  on-save  !>(state)
    ::
    ++  on-load
      |=  old=vase
      ^-  (quip card _this)
      =|  cards=(list card)
      =/  old-pub=@p
        =+  ~master
        (can 3 2^0x100 2^0x5ef 2^- ~)
      =/  new-pub=@p
        =+  ~picsel
        (can 3 2^0x100 2^0x5ef 2^- ~)
      |^
      =+  !<(old-state=app-states old)
      =?  cards  &(?=(%0 -.old-state) !=(our.bowl old-pub))
        [(subscribe old-pub 'canvas')]~
      =?  cards  ?=(%2 -.old-state)
        :~  (leave old-pub 'canvas')
            (subscribe new-pub 'public')
        ==
     =?  cards  &(?=(%4 -.old-state) =(our.bowl new-pub))
        [(leave new-pub 'public')]~
      =?  old-state  ?=(%0 -.old-state)
        ^-  state-1
        :+  %1
          gallery.old-state
        (gather-artists gallery.old-state)
      =?  old-state  ?=(%1 -.old-state)
        :+  %2
          (add-lockup gallery.old-state)
        artists.old-state
      =?  old-state  ?=(%2 -.old-state)
        [%3 +.old-state]
      =?  old-state  ?=(%3 -.old-state)
        [%4 +.old-state]
      =?  old-state  ?=(%4 -.old-state)
        [%5 +.old-state]
      ?>  ?=(%5 -.old-state)
      [cards this(state old-state)]
      ::
      ++  app-states  $%(state-0 state-1 state-2-3-4 app-state)
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
      ++  state-2-3-4
        $:  ?(%2 %3 %4)
            gallery=(map location canvas)
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
        ^+  out
        ?:  ?=([%draw *] canvas-0)  out
        %+  roll  ~(tap by mesh.canvas-0)
        |=  [[* =arc] out=_out]
        ^+  out
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
        ?>  =(our.bowl src.bowl)
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
          [%canvas @ @ ~]
        (send-init-data:cc i.t.t.path)
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
              %canvas-diff
            (handle-canvas-diff:cc !<(canvas-diff vase))
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
      ?.  =(our.bowl src.bowl)  ~
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
  ~&  >  [src.bowl 'subscribing to' name private+private.metadata.u.canvas]
  ?:  private.metadata.u.canvas
    ~|([%subs-not-allowed name] !!)
  =;  =vase
    [%give %fact ~ %canvas-diff vase]~
  !>([%load name u.canvas ?~(artists ~ u.artists)])
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
    |=  [=location strokes=(list stroke)]
    ^-  (quip card _state)
    (process-paint location strokes)
  ::
  ++  handle-join
    |=  [=ship name=@t]
    ^-  (quip card _state)
    ?>  =(our.bowl src.bowl)
    ~&  >  ["[ join ]" ship name]
    [[(subscribe ship name)]~ state]
  ::
  ++  handle-leave
    |=  [=ship name=@t]
    ^-  (quip card _state)
    ~&  >>  ["[ leave ]" ship name]
    ?>  =(our.bowl src.bowl)
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
      (send-frontend (canvas-view-response-to-json %load new-name canvas ~))
    ::  TODO: do this if /leave is succesful?
    ::
    :-  [(leave ship name) load]
    %_    state
        gallery
      (~(put by (~(del by gallery) [ship name])) [our.bowl new-name] canvas)
    ==
  ::
  ++  handle-create
    |=  =canvas
    ^-  (quip card _state)
    ?>  =(our.bowl src.bowl)
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
    ?>  =(our.bowl src.bowl)
    =/  canvas=(unit canvas)  (~(get by gallery) [ship name])
    :-  ~
    ?~  canvas  state
    =.  file.metadata.u.canvas  `file
    state(gallery (~(put by gallery) [ship name] u.canvas))
  ::
  ++  handle-unlock
    |=  name=@t
    ^-  (quip card _state)
    ?>  =(our.bowl src.bowl)
    ~&  >>  "[ unlock ] / TBA"
    ?:  &  `state
    ?>  =(our.bowl src.bowl)
    =/  =canvas  (~(got by gallery) [our.bowl name])
    =.  private.metadata.canvas  |
    :-  ~
    state(gallery (~(put by gallery) [our.bowl name] canvas))
  ::
  --
::
++  handle-canvas-diff
  |=  act=canvas-diff
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
    =/  =location  [src.bowl name]
    ~&  >  ["loading canvas..." location]
    =:  gallery.state  (~(put by gallery) [location canvas])
        artists.state  ?~  artists  artists.state
                       (~(put by artists.state) [location artists])
      ==
    :_  state
    (send-frontend (canvas-view-response-to-json %load name canvas artists))
  ::
  ++  handle-paint
    |=  [=location strokes=(list stroke) who=@p]
    ^-  (quip card _state)
    ?:  =(who our.bowl)
      ::  we receive an update for a stroke we originaly sent; discard
      ::
      `state
    (process-paint location strokes)
  --
::
++  process-paint
  |=  [=location strokes=(list stroke)]
  ^-  (quip card _state)
  :: ?>  ?=(^ strokes)
  ?~  strokes  [~ state]
  ?~  canvas=(~(get by gallery) location)
    ~&  >>  ["non existent canvas" location]
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
  %-  send-effects  strokes
  :: TODO
  ::
  :: ?:  ?=(%draw -.u.canvas)  strokes
  :: %+  skim  ^-((list stroke) strokes)  :: ?
  :: |=  =stroke
  :: ?>  ?=(%mesh -.stroke)
  :: =+  past-arc=(~(get by mesh.u.canvas) id.stroke)
  :: (can-paint past-arc bowl meta)
  ::
  ++  send-effects
    |=  strokes=(list stroke)
    ^-  (list card)
    ?.  =(our.bowl src.bowl)
      ::  stroke from a remote ship
      ::
      %+  weld
        %-  send-frontend
        ::  TODO: include who and when in every stroke?
        ::
        (canvas-view-response-to-json %paint location strokes)
      ::
      ::  if we are not the host, ignore
      ::
      ?.  =(host.location our.bowl)  ~
      ::  if we are, send diff to subscribers
      ::
      [(send-paint-diff location strokes src.bowl)]~
    ::  stroke from local (e.g. frontend)
    ::
    ?>  =(src.bowl our.bowl)
    ::  if we are not the host, poke with our paint
    ::
    ?.  =(host.location our.bowl)
      [(send-to-host location strokes)]~
    ::  if we are, send diff to subscribers
    ::
    [(send-paint-diff location strokes our.bowl)]~
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
      $(strokes t.strokes)
    =:  mesh
      ?~  arc
        (~(del by mesh) id)
      ::  TODO: check if is is out of canvas' boundaries
      ::
      (~(put by mesh) [id color.u.arc `now.bowl `src.bowl])
      ::
        artists
      (update-artists artists ?=(~ arc))
      ==
    $(strokes t.strokes)
  ::
  ++  update-draw
    |=  [=draw strokes=(list stroke)]
    |-  ^+  draw
    ?~  strokes  draw
    ?>  ?=([%draw *] i.strokes)
    %_  $
      strokes  t.strokes
      draw     (snoc draw form.i.strokes)
    ==
  ::
  ::  TODO: handle removal properly
  ::
  ++  update-artists
    |=  [artists=_artists remove=?]
    ^+  artists
    %+  ~(put by artists)  location
    ?~  ships=(~(get by artists) location)
      (~(put by *(map ship @ud)) src.bowl 1)
    ?~  ship=(~(get by u.ships) src.bowl)
      (~(put by u.ships) src.bowl 1)
    (~(jab by u.ships) src.bowl |=(c=@ud +(c)))
    :: %+  ~(put by u.ships)  src.bowl
    :: ?~  artist=(~(get by u.ships) src.bowl)
    ::   1
    :: ?:(remove (dec u.artist) +(u.artist))
  --
--

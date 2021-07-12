/-  *canvas
|%
++  json-to-canvas-view
  |=  jon=json
  ^-  canvas-action
  =,  dejs:format
  |^  (parse-json jon)
  ::
  ++  parse-json
    %-  of
    :~  [%init ul]
        [%paint paint]
        [%join subscription]
        [%leave subscription]
        [%create create]
        [%share share]
        [%save save]
    ==
  ::
  ++  create
    |^
    %-  of
    :~  [%mesh metadata]
        [%draw metadata]
    ==
    ::
    ++  metadata
      %-  ot
      :~  ['canvas' ul]
        ::
          :-  'metadata'
          %-  ou
          :~  ['name' (un so)]
              ['template' (un (cu template so))]
              ['location' (un (su ;~(pfix sig fed:ag)))]
              ['file' (uf ~ (mu so))]
              ['private' (un bo)]
              ['width' (un ni)]
              ['height' (un ni)]
              ['columns' (un ni)]
              ['mesh' (uf ~ (mu (cu mesh-pixel so)))]
      ==  ==
    ::
    --
  ::
  ++  paint
    |^
    %-  ot
    :~  ['location' (su ;~(pfix sig fed:ag))]
        ['canvas-name' so]
      ::
        :-  'strokes'
        %-  ar
        %-  of
        :~  [%mesh arc-data]
            [%draw form-data]
    ==  ==
    ::
    ++  arc-data
      |=  =json
      ?>  ?=(%o -.json)
      ^-  [@t (unit arc)]
      ?:  =(~(wyt by p.json) 1)
        %.  json
        (ou ~[['id' (un so)] [*@t (uf ~ ul)]])
      :-  ((ou ['id' (un so)]~) json)
      %-  some
      %.  json
      %-  ou
      :~  ['color' (un so)]
          ['when' (uf ~ (mu (cu from-unix-ms:chrono:userlib ni)))]
          ['who' (uf ~ (mu (su fed:ag)))]
      ==
    ::
    ++  form-data
      %-  ot
      :~  =;  coords-parser
            ['coords' (cu coords-parser (ar (ar no)))]
          |=  l=(list (list @t))
          ^-  (list [@t @t])
          %+  turn  l
          |=  coords=(list @t)
          ^-  [@t @t]
          ?>  ?=([@t @t ~] coords)
          [i.coords i.t.coords]
        ::
          ['lineWidth' so]
          ['strokeStyle' so]
      ==
    --
  ::
  ++  subscription
    (ot ~[['ship' (su ;~(pfix sig fed:ag))] ['canvas-name' so]])
  ::
  ++  save
    %-  ot
    :~  ['location' (su ;~(pfix sig fed:ag))]
        ['canvas-name' so]
        ['file' so]
    ==
  ::
  ++  share
    (ot ~[['canvas-name' so] ['chat-path' pa] ['type' (cu image-type so)]])
  --
::
++  canvas-view-response-to-json
  |=  act=canvas-view-response
  ^-  json
  =,  enjs:format
  |^
  %+  frond  -.act
  ?+     -.act  ~|(%action-not-supported !!)
      %init-frontend
    %-  pairs
    %+  weld
      ['chats' a+(turn chats.act path)]~
    :_  ~
    :-  'canvas'
    %-  pairs
    %+  turn
      gallery.act
    |=  =canvas
    ^-  [@t json]
    :-  %-  crip
        ;:  weld
          (trip (scot %p location.metadata.canvas))
          "/"
          (trip name.metadata.canvas)
        ==
    %-  pairs
    %+  weld
      (canvas-to-json canvas)
    ['metadata' (pairs (metadata-to-json metadata.canvas))]~
  ::
      %load
    %-  pairs
    %+  weld
      (canvas-to-json canvas.act)
    (metadata-to-json metadata.canvas.act)
  ::
      %paint
    %-  pairs
    ^-  (list [@t json])
    :~  ['name' s+name.act]
        ['location' s+(scot %p location.act)]
      ::
        =;  pairs-of-strokes
          ['strokes' a+(turn strokes.act pairs-of-strokes)]
        |=  =stroke
        ^-  json
        (pairs (stroke-to-json stroke))
    ==
  ==
  ::
  ++  canvas-to-json
    |=  =canvas
    ^-  (list [@t json])
    =,  enjs:format
    :_  ~
    :-  'data'
    ?-    -.canvas
        %mesh
      %-  pairs
      %-  zing
      (turn ~(tap by mesh.canvas) arc-to-json)
    ::
        %draw
      :-  %a
      %+  turn  draw.canvas
      |=  =form
      ^-  json
      :-  %a
      %+  weld
        (form-strokes-to-json strokes.form)
      :_  ~
      %-  pairs
      :~  ['lineWidth' s+line-width.form]
          ['strokeStyle' s+style-stroke.form]
      ==
    ==
  ::
  ++  metadata-to-json
    |=  metadata
    ^-  (list [@t json])
    :~  ['name' s+name]
        ['location' s+(scot %p location)]
        ['template' s+template]
        ['file' ?~(file ~ s+u.file)]
        ['private' b+private]
        ['width' (numb width)]
        ['height' (numb height)]
        ['columns' (numb columns)]
        ['mesh' ?~(mesh ~ s+u.mesh)]
    ==
  ::
  ++  arc-to-json
    |=  [id=@t =arc]
    ^-  (list [@t json])
    :_  ~
    :-  id
    %-  pairs
    ^-  (list [@t json])
    :~  ['color' s+color.arc]
        ['when' ?~(when.arc ~ (time u.when.arc))]
        ['who' ?~(who.arc ~ (ship u.who.arc))]
    ==
  ::
  ++  stroke-to-json
    |=  =stroke
    ^-  (list [@t json])
    ?-    -.stroke
        %mesh
      ?~  arc.stroke
        ['id' s+id.stroke]~
      =*  arc  u.arc.stroke
      :~  ['id' s+id.stroke]
          ['color' s+color.arc]
          ['when' ?~(when.arc ~ (time u.when.arc))]
          ['who' ?~(who.arc ~ (ship u.who.arc))]
      ==
    ::
        %draw
      :~  ['lineWidth' s+line-width.form.stroke]
          ['styleStroke' s+style-stroke.form.stroke]
          ['strokes' a+(form-strokes-to-json strokes.form.stroke)]
      ==
    ==
  ::
  ++  form-strokes-to-json
    |=  strokes=(list [@t @t])
    ^-  (list json)
    %+  turn  strokes
    |=  [x=@t y=@t]
    ^-  json
    a+~[s+x s+y]
  --
--

















:: /-  *canvas
:: |%
:: ++  json-to-canvas-action
::   |=  jon=json
::   ^-  canvas-action
::   =,  dejs:format
::   |^  (parse-json jon)
::   ::
::   ++  parse-json
::     %-  of
::     :~  [%init ul]
::         [%paint paint]
::         [%join subscription]
::         [%leave subscription]
::         [%create create]
::         [%share share]
::         :: [%save save]
::     ==
::   ::
::   ++  create
::     |^
::     %-  of
::     :~  [%mesh metadata]
::         [%draw metadata]
::     ==
::     ::
::     ++  metadata
::       %-  ot
::       :~  ['canvas' ul]
::         ::
::           :-  'metadata'
::           %-  ot
::           :~  ['name' so]
::               ['template' (cu template so)]
::               ['where' (su ;~(pfix sig fed:ag))]
::               ['saved' bo]
::               ['private' bo]
::               ['width' ni]
::               ['height' ni]
::       ==  ==
::     ::
::     --
::   ::
::   ++  paint
::     ~&  jon
::     |^
::     %-  ot
::     :~  ['where' (su ;~(pfix sig fed:ag))]
::         ['canvas-name' so]
::       ::
::         :-  'strokes'
::         %-  ar
::         %-  of
::         :~  [%mesh arc-data]
::             [%draw form-data]
::     ==  ==
::     ::
::     ++  arc-data
::       %-  ou
::       :~  ['id' (un so)]
::           ['fill' (un bo)]
::           ['color' (un so)]
::           ['when' (uf ~ (mu (cu from-unix-ms:chrono:userlib ni)))]
::           ['who' (uf ~ (mu (su fed:ag)))]
::       ==
::     ::
::     ++  form-data
::       %-  ot
::       :~  =;  coords-parser
::             ['coords' (cu coords-parser (ar (ar no)))]
::           |=  l=(list (list @t))
::           ^-  (list [@t @t])
::           %+  turn  l
::           |=  coords=(list @t)
::           ^-  [@t @t]
::           ?>  ?=([@t @t ~] coords)
::           [i.coords i.t.coords]
::         ::
::           ['lineWidth' so]
::           ['strokeStyle' so]
::       ==
::     --
::   ::
::   ++  subscription
::     (ot ~[['ship' (su ;~(pfix sig fed:ag))] ['canvas-name' so]])
::   :: ::
::   :: ++  save
::   ::   %-  ot
::   ::   :~  ['where' (su ;~(pfix sig fed:ag))]
::   ::       ['canvas-name' so]
::   ::       ['svg' so]
::   ::       ['last' bo]
::   ::       ['type' (cu image-type so)]
::   ::   ==
::   ::
::   ++  share
::     (ot ~[['canvas-name' so] ['chat-path' pa] ['type' (cu image-type so)]])
::   --
:: ::
:: ++  canvas-view-response-to-json
::   |=  act=canvas-view-response
::   ^-  json
::   =,  enjs:format
::   |^
::   %+  frond  -.act
::   ?+     -.act  ~|(%action-not-supported !!)
::       %init-frontend
::     %-  pairs
::     %+  weld
::       ['chats' a+(turn chats.act path)]~
::     :_  ~
::     :-  'canvas'
::     %-  pairs
::     %+  turn
::       gallery.act
::     |=  =canvas
::     ^-  [@t json]
::     :-  ?:  =('welcome' name.metadata.canvas)
::           name.metadata.canvas
::         %-  crip
::         ;:  weld
::           (trip (scot %p where.metadata.canvas))
::           "/"
::           (trip name.metadata.canvas)
::         ==
::     %-  pairs
::     %+  weld
::       (canvas-to-json canvas)
::     ['metadata' (pairs (metadata-to-json metadata.canvas))]~
::   ::
::       %load
::     %-  pairs
::     %+  weld
::       (canvas-to-json canvas.act)
::     (metadata-to-json metadata.canvas.act)
::   ::
::     ::   %file
::     :: :: FIXME: from the failed attempt of watching the image directory
::     :: :: a+(turn files.act path)
::     :: s+file.act
::   ::
::       %paint
::     %-  pairs
::     ^-  (list [@t json])
::     :~  ['name' s+name.act]
::         ['where' s+(scot %p where.act)]
::       ::
::         =;  pairs-of-strokes
::           ['strokes' a+(turn strokes.act pairs-of-strokes)]
::         |=  =stroke
::         ^-  json
::         (pairs (stroke-to-json stroke))
::     ==
::   ==
::   ::
::   ++  canvas-to-json
::     |=  =canvas
::     ^-  (list [@t json])
::     =,  enjs:format
::     :_  ~
::     :-  'data'
::     ?-    -.canvas
::         %mesh
::       %-  pairs
::       %-  zing
::       (turn ~(tap by mesh.canvas) arc-to-json)
::     ::
::         %draw
::       :-  %a
::       %+  turn  draw.canvas
::       |=  =form
::       ^-  json
::       :-  %a
::       %+  weld
::         (form-strokes-to-json strokes.form)
::       :_  ~
::       %-  pairs
::       :~  ['lineWidth' s+line-width.form]
::           ['strokeStyle' s+style-stroke.form]
::       ==
::     ==
::   ::
::   ++  metadata-to-json
::     |=  =metadata
::     ^-  (list [@t json])
::     :~  ['name' s+name.metadata]
::         ['where' s+(scot %p where.metadata)]
::         ['template' s+template.metadata]
::         ['saved' b+saved.metadata]
::         ['private' b+private.metadata]
::         ['width' (numb width.metadata)]
::         ['height' (numb height.metadata)]
::     ==
::   ::
::   ++  arc-to-json
::     |=  [id=@t =arc]
::     ^-  (list [@t json])
::     :_  ~
::     :-  id
::     %-  pairs
::     ^-  (list [@t json])
::     :~  ['fill' b+filled.arc]
::         ['color' s+color.arc]
::         ['when' ?~(when.arc ~ (time u.when.arc))]
::         ['who' ?~(who.arc ~ (ship u.who.arc))]
::     ==
::   ::
::   ++  stroke-to-json
::     |=  =stroke
::     ^-  (list [@t json])
::     ?-    -.stroke
::         %mesh
::       :~  ['id' s+id.stroke]
::           ['fill' b+filled.arc.stroke]
::           ['color' s+color.arc.stroke]
::           ['when' ?~(when.arc.stroke ~ (time u.when.arc.stroke))]
::           ['who' ?~(who.arc.stroke ~ (ship u.who.arc.stroke))]
::       ==
::     ::
::         %draw
::       :~  ['lineWidth' s+line-width.form.stroke]
::           ['styleStroke' s+style-stroke.form.stroke]
::           ['strokes' a+(form-strokes-to-json strokes.form.stroke)]
::       ==
::     ==
::   ::
::   ++  form-strokes-to-json
::     |=  strokes=(list [@t @t])
::     ^-  (list json)
::     %+  turn  strokes
::     |=  [x=@t y=@t]
::     ^-  json
::     a+~[s+x s+y]
::   --
:: --

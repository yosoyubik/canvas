::
::::  /hoon/svg/mar
  ::
/?    310
  ::
::::  compute
  ::
=,  mimes:html
=,  html
|_  svg=@t
::
++  grow                                                ::  convert to
  |%                                                    ::
  ++  mime  [image/'svg+xml' (as-octs svg)]             ::  to %mime
  ++  hymn  (need (de-xml svg))                         ::  to %hymn
  --                                                    ::
++  grab
  |%                                                    ::  convert from
  ++  noun  @t                                          ::  clam from %noun
  ++  mime  |=([p=mite q=octs] q.q)                     ::  retrieve form $mime
  --
--

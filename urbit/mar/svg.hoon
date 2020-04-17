=,  mimes:html
=,  html
|_  svg=@t
::
++  grow                                                ::  convert to
  |%                                                    ::
  ++  mime  [/image/'svg+xml' (as-octs svg)]            ::  to %mime
  --                                                    ::
++  grab
  |%                                                    ::  convert from
  ++  noun  @t                                          ::  clam from %noun
  ++  mime  |=([p=mite q=octs] q.q)                     ::  retrieve form $mime
  --
++  grad  %mime
--

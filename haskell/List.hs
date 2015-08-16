module List where

import Prelude hiding (all, any, either)
import Goal
import Term


fromList :: [a] -> Term a
fromList []       = None
fromList (x : xs) = (v x) <> (fromList xs)

toList :: Term a -> [a]
toList None               = []
toList (Pair (Value x) y) = x : toList y

append :: (Eq a) => Term a -> Term a -> Term a -> Goal a
append x y z =
  either (both (eq x None)
               (eq y z))
         $ with ["first", "xRest", "zRest"] $ \(first : xRest : zRest : _) ->
             all [
               (eq x (first <> xRest)),
               (eq z (first <> zRest)),
               (append xRest y zRest)
             ]

interleave :: (Eq a) => Term a -> Term a -> Term a -> Goal a
interleave x y z =
  either (both (eq x None)
               (eq y z))
         $ with ["first", "xRest", "zRest"] $ \(first : xRest : zRest : _) ->
             all [
               (eq x (first <> xRest)),
               (eq z (first <> zRest)),
               (interleave y xRest zRest)
             ]

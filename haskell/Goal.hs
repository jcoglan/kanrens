module Goal where

import Prelude hiding (all, any, either)
import State
import Term


_interleave :: [a] -> [a] -> [a]
_interleave []       ys = ys
_interleave (x : xs) ys = x : _interleave ys xs


type Goal a = State a -> [State a]

eq :: (Eq a) => Term a -> Term a -> Goal a
eq x y = stream . (unify x y)
  where
    stream :: Maybe a -> [a]
    stream (Just x) = [x]
    stream Nothing  = []

with :: [String] -> ([Term a] -> Goal a) -> Goal a
with names factory state = goal newState
  where
    (newState, vars) = mbind names state
    goal = factory vars

either :: Goal a -> Goal a -> Goal a
either x y state = _interleave (x state) (y state)

any :: [Goal a] -> Goal a
any (g : []) = g
any (g : gs) = either g $ any gs

both :: Goal a -> Goal a -> Goal a
both x y state = inEach y xstates
  where
    xstates           = x state
    inEach y []       = []
    inEach y (s : ss) = _interleave (y s) (inEach y ss)

all :: [Goal a] -> Goal a
all (g : []) = g
all (g : gs) = both g $ all gs

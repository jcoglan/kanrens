module State where

import Data.List
import Identifier
import Term


data State a  = State (Values a)
type Values a = [(Identifier, Term a)]

instance (Show a) => Show (State a) where
  show (State values) = "[" ++ (intercalate ", " (map format values)) ++ "]"
    where
      format (id, term) = (show id) ++ " -> " ++ (show term)

newState :: Values a -> State a
newState list = State list

bind :: String -> State a -> (State a, Identifier)
bind name (State values) =
  (State (values ++ [pair]), id)
  where
    id   = Identifier (length values) name
    pair = (id, Void)

mbind :: [String] -> State a -> (State a, [Identifier])
mbind names state =
  foldl extend (state, []) names
  where
    extend (state, ids) name =
      let (s, id) = bind name state in (s, ids ++ [id])

assign :: Identifier -> Term a -> State a -> State a
assign id@(Identifier index _) value (State values) =
  State (head ++ [mark] ++ tail)
  where
    head = take index values
    mark = (id, value)
    tail = drop (index + 1) values

unify :: (Eq a) => Term a -> Term a -> State a -> Maybe (State a)
unify x y state =
  let wx = walk x state; wy = walk y state in _unify state wx wy
  where
    _unify s (Var id)     y            = Just $ assign id y s
    _unify s x            (Var id)     = Just $ assign id x s
    _unify s (Pair l1 r1) (Pair l2 r2) = unify l1 l2 s >>= unify r1 r2
    _unify s x y  | x == y             = Just s
                  | otherwise          = Nothing

walk :: (Eq a) => Term a -> State a -> Term a
walk Void              _      = Void
walk None              _      = None
walk (Value v)         _      = Value v
walk (Pair left right) state  = Pair (walk left state) (walk right state)
walk var@(Var (Identifier index _)) state@(State values)
  | index < (length values)   = deref values index
  | otherwise                 = var
  where
    deref values index =
      let (id, val) = values !! index in
        if val == Void then Var id else walk val state

result :: (Eq a) => Int -> State a -> Term a
result index state = (results 0 state) !! index

results :: (Eq a) => Int -> State a -> [Term a]
results n s@(State values)
  | n == 0    = results (length values) s
  | otherwise = take n $ map _walk values
                where
                  _walk (var, val) = walk val s

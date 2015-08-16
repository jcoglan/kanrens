module State where

import Data.List
import Term


data State a  = State (Values a)
type Values a = [(Term a, Term a)]

instance (Show a) => Show (State a) where
  show (State values) = "[" ++ (intercalate ", " (map format values)) ++ "]"
    where
      format (var, val) = (show var) ++ " -> " ++ (show val)

newState :: Values a -> State a
newState list = State list

bind :: String -> State a -> (State a, Term a)
bind name (State values) =
  (State (values ++ [pair]), newVar)
  where
    newVar = Var (length values) name
    pair   = (newVar, Void)

mbind :: [String] -> State a -> (State a, [Term a])
mbind names state =
  foldl extend (state, []) names
  where
    extend (state, vars) name =
      let (s, v) = bind name state in (s, vars ++ [v])

assign :: Term a -> Term a -> State a -> State a
assign var@(Var index _) value (State values) =
  State (head ++ [mark] ++ tail)
  where
    head = take index values
    mark = (var, value)
    tail = drop (index + 1) values

unify :: (Eq a) => Term a -> Term a -> State a -> Maybe (State a)
unify x y state =
  let wx = walk x state; wy = walk y state in _unify state wx wy
  where
    _unify s x@(Var _ _)  y            = Just $ assign x y s
    _unify s x            y@(Var _ _)  = Just $ assign y x s
    _unify s (Pair l1 r1) (Pair l2 r2) = unify l1 l2 s >>= unify r1 r2
    _unify s x y  | x == y             = Just s
                  | otherwise          = Nothing

walk :: (Eq a) => Term a -> State a -> Term a
walk Void              _      = Void
walk None              _      = None
walk (Value v)         _      = Value v
walk (Pair left right) state  = Pair (walk left state) (walk right state)
walk var@(Var index _) state@(State values)
  | index < (length values)   = deref values index
  | otherwise                 = var
  where
    deref values index =
      let (var, val) = values !! index in
        if val == Void then var else walk val state

result :: (Eq a) => Int -> State a -> Term a
result index state = (results 0 state) !! index

results :: (Eq a) => Int -> State a -> [Term a]
results n s@(State values)
  | n == 0    = results (length values) s
  | otherwise = take n $ map _walk values
                where
                  _walk (var, val) = walk val s

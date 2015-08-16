module Term where

import Identifier

data Term a = Void
            | None
            | Value a
            | Var Identifier
            | Pair (Term a) (Term a)
            deriving Eq

instance (Show a) => Show (Term a) where
  show Void       = "_"
  show None       = "()"
  show (Value v)  = show v
  show (Var id)   = show id
  show (Pair x y) = "(" ++ (show x) ++ " . " ++ (show y) ++ ")"

(<>) :: Term a -> Term a -> Term a
x <> y = Pair x y

v :: a -> Term a
v x = Value x

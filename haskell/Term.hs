module Term where

data Term a = Void
            | None
            | Value a
            | Var Int String
            | Pair (Term a) (Term a)
            deriving Eq

instance (Show a) => Show (Term a) where
  show Void             = "_"
  show None             = "()"
  show (Value v)        = show v
  show (Var index name) = "{" ++ name ++ "/" ++ (show index) ++ "}"
  show (Pair x y)       = "(" ++ (show x) ++ " . " ++ (show y) ++ ")"

(<>) :: Term a -> Term a -> Term a
x <> y = Pair x y

v :: a -> Term a
v x = Value x

module Identifier where

data Identifier = Identifier Int String deriving (Eq)

instance Show Identifier where
  show (Identifier index name) = "{" ++ name ++ "/" ++ show(index) ++ "}"

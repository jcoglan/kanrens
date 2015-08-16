import Prelude hiding (all, any, either)
import Goal
import List
import State
import Term


puts = putStrLn . show


main = do

  let goal = with ["x", "y", "z"] $ \(x : y : z : _) ->
               all [
                 (eq x $ fromList "hel"),
                 (eq y $ fromList "lo"),
                 (append x y z)
               ];
      res = goal $ newState []
    in
      puts $ map (map toList) $ map (results 3) res


  let goal = with ["x", "y"] $ \(x : y : _) ->
               append x y $ fromList "hello";
      res = goal $ newState []
    in
      puts $ map (map toList) $ map (results 2) res


  let goal = with ["x", "y"] $ \(x : y : _) ->
               interleave x y $ fromList "coglan";
      res = goal $ newState []
    in
      puts $ map (map toList) $ map (results 2) res

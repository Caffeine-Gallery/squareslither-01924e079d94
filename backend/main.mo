import Text "mo:base/Text";

import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Order "mo:base/Order";

actor {
  stable var highScores : [(Text, Nat)] = [];

  public func addHighScore(name : Text, score : Nat) : async () {
    let newScore = (name, score);
    highScores := Array.sort(
      Array.append(highScores, [newScore]),
      func (a : (Text, Nat), b : (Text, Nat)) : Order.Order {
        Nat.compare(b.1, a.1)
      }
    );
    if (highScores.size() > 10) {
      highScores := Array.subArray(highScores, 0, 10);
    };
  };

  public query func getHighScores() : async [(Text, Nat)] {
    highScores
  };
}

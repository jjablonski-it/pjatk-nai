from easyAI.AI import TranspositionTable
from easyAI import solve_with_iterative_deepening
from easyAI import TwoPlayerGame, Human_Player, AI_Player, Negamax


class GameOfBones(TwoPlayerGame):
    """ In turn, the players remove one, two or three bones from a
    pile of bones. The player who removes the last bone loses. """

    def __init__(self, players=None):
        self.players = players
        self.pile = 20  # start with 20 bones in the pile
        self.current_player = 1  # player 1 starts

    def possible_moves(self): return ['1', '2', '3']
    def make_move(self, move): self.pile -= int(move)  # remove bones.
    def win(self): return self.pile <= 0  # opponent took the last bone ?
    def is_over(self): return self.win()  # Game stops when someone wins.
    def show(self): print("%d bones left in the pile" % self.pile)
    def scoring(self): return 100 if self.win() else 0  # For the AI


tt = TranspositionTable()
GameOfBones.ttentry = lambda game: game.pile  # key for the table
r, d, m = solve_with_iterative_deepening(
    game=GameOfBones(),
    ai_depths=range(2, 20),
    win_score=100,
    tt=tt
)

# Start a match (and store the history of moves when it ends)
game = GameOfBones([AI_Player(tt), Human_Player()])
game.play()

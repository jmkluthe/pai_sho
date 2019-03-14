from enum import Enum


class MoveStepTypes(Enum):
    SINGLE = 1
    JUMP = 2
    END_TURN = 3
    REGENERATE_AVATAR = 4


class Position(object):
    __slots__ = ['x', 'y']

    def __init__(self, x, y):
        self.x = x
        self.y = y


class MoveStep(object):
    __slots__ = ['move_type',
                 'step_number',
                 'initial_position',
                 'final_position']

    def __init__(self, move_type, step_number, initial_position, final_position):
        self.move_type = move_type
        self.step_number = step_number
        self.initial_position = initial_position
        self.final_position = final_position


class Move(object):
    __slots__ = ['steps',
                 'total_steps',
                 'player_number',
                 'move_number',
                 'piece']

    # def __init__(self):

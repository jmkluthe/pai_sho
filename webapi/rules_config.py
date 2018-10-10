
move_matrix = [
    {'x': 0, 'y': 2},
    {'x': 0, 'y': -2},
    {'x': 2, 'y': 0},
    {'x': -2, 'y': 0},
    {'x': 1, 'y': 1},
    {'x': 1, 'y': -1},
    {'x': -1, 'y': -1},
    {'x': -1, 'y': 1},
]

take_matrix = dict(
    fire=['air', 'avatar'],
    air=['water', 'avatar'],
    water=['earth', 'avatar'],
    earth=['fire', 'avatar'],
    lotus=[],
    avatar=['air', 'water', 'earth', 'fire', 'avatar']
)


Vue.component('piece', {
    props: ['piece'],
    data: function() {
        return {style: {background: this.piece.element.color}}
    },
    template: '#pieceTemplate'
});

Vue.component('winner', {
    props: ['winner'],
    template: '#winnerTemplate'
});

Vue.component('space', {
    props: ['space', 'piece_selected', 'locked'],
    data: function() {
        var l = (340 + 28.2833*this.space.x) + 'px';
        var t = (340 - 28.2833*this.space.y) + 'px';
        return {style: {top: t, left: l}}
    },
    computed: {overlayClasses: function() {
            var classString = 'overlay';
            if(this.space.selectable === true) classString += ' selectable';
            if(this.space.selected === true) classString += ' selected';
            return classString;
        }
    },
    methods: {
        parse_click: function() {
            if(!this.space.selectable && !this.space.selected) return;
            if(this.space.selected && this.locked) return;

            if(this.piece_selected != null && !this.space.selected) {
                this.move();
            } else {
                this.select();
            }
        },
        move: function() {
            this.$emit('move', {move_to: this.space, piece: this.piece_selected})
        },
        select: function() {
            this.$emit('select', this.space);
        }
    },
    template: '#spaceTemplate'
});

var boardVue = new Vue({
    el: '#board',
    data: { board: null, state: null, moves: null, takes: null, winner: null },
    mounted: function() {

		var move_matrix = [
			{x: 0, y: 2},
			{x: 0, y: -2},
			{x: 2, y: 0},
			{x: -2, y: 0},
			{x: 1, y: 1},
			{x: 1, y: -1},
			{x: -1, y: -1},
			{x: -1, y: 1},
		];
		this.moves = move_matrix;

        var takes = {
            fire: ['air', 'avatar'],
            air: ['water', 'avatar'],
            water: ['earth', 'avatar'],
            earth: ['fire', 'avatar'],
            lotus: [],
            avatar: ['air', 'water', 'earth', 'fire', 'avatar'],
        };
        this.takes = takes;

    	function make_spaces() {
			var spaces = [];
			for(var i = -12; i < 13; i++) {
				for(var j = -12; j < 13; j++) {
					if(i*i + j*j <= 12.5*12.5 && (i + j) % 2 == 0) {
						spaces.push({x: i, y: j, has_piece: false, selectable: false, selected: false});
					}
				}
			}
			return spaces;
    	}

		function make_state(pieces) {
			return {
//				turn: 0, players: [{number: 0, name: 'zero'}, {number: 1, name: 'one'}],
//				player_moving: 1, piece_selected: null, pieces: pieces, locked: false
                turn: 0, players: { 0: { name: 'Computer', type: 0 }, 1: { name: 'Human', type: 1 } },
				player_moving: 1, piece_selected: null, pieces: pieces, locked: false
			};
		}

		function fill_spaces(state, spaces) {
			for(var i = 0; i < state.pieces.length; i++) {
				var space = spaces.find(function(el) {
					return el.x == state.pieces[i].x && el.y == state.pieces[i].y;
				});
				if(space != null) {
					space.has_piece = true;
					space.piece = state.pieces[i];
				}
			}
		}

		var self = this;
		$.get( "http://localhost:5000/api/get-initial-setup", function(data) {
			var spaces = make_spaces();
			var state = make_state(data);
			fill_spaces(state, spaces);
			self.board = spaces;
			self.state = state;
			self.make_pieces_selectable();
		});

    },
    methods: {
        move: function(value) {
            this.state.locked = true;
            value.move_to.selected = true;
            var old_space = this.find_space(value.piece.x, value.piece.y);
            var distance = (value.move_to.x - value.piece.x)*(value.move_to.x - value.piece.x)
                        + (value.move_to.y - value.piece.y)*(value.move_to.y - value.piece.y);
            value.piece.x = value.move_to.x;
            value.piece.y = value.move_to.y;
            value.move_to.has_piece = true;
            value.move_to.piece = value.piece;
            old_space.has_piece = false;
            old_space.piece = null;
            old_space.selected = false;
            if(distance <= 4 || this.state.piece_selected.element.type === 'lotus') {
                this.end_turn();
            } else {
                this.make_jumps_selectable(old_space);
            }
            if(this.board.filter(s => s.selectable === true).length === 0) {
                this.end_turn();
            }
        },
        make_jumps_selectable: function(old_space) {
            for(var i = 0; i < this.board.length; i++) {
                this.board[i].selectable = false;
            }
            var x = this.state.piece_selected.x;
            var y = this.state.piece_selected.y;
            for(var i = 0; i < this.moves.length; i++) {
                var space = this.find_space(x + this.moves[i].x, y + this.moves[i].y);
                if(space != null && space.has_piece && space.piece.player_number === this.state.player_moving) {
                    var jump_space = this.find_space(space.x + this.moves[i].x, space.y + this.moves[i].y);
                    if(jump_space != null && !jump_space.has_piece) {
                        jump_space.selectable = true;
                    }
                }
            }
            old_space.selectable = false;
        },
        get_enemies: function(space) {
            var enemies = [];
            for(var i = 0; i < this.moves.length; i++) {
                var test = this.find_space(space.x + this.moves[i].x, space.y + this.moves[i].y);
                if(test && test.has_piece && test.piece.player_number !== this.state.player_moving) {
                    enemies.push(test.piece);
                }
            }
            return enemies;
        },
        end_turn: function() {
            var oldLotus = this.get_lotus(this.state.player_moving);
            if(oldLotus.x === 0 && oldLotus.y === 0) {
                this.declare_winner(this.state.player_moving);
                return;
            }
            this.take_pieces(this.state.piece_selected);
            this.state.piece_selected = null;
            this.state.locked = false;
            for(var i = 0; i < this.board.length; i++) {
                this.board[i].selected = false;
                this.board[i].selectable = false;
            }
            //var nextPlayer = this.state.players.filter(p => p.number !== this.state.player_moving)[0];
            var nextPlayerNumber = this.swap_player(this.state.player_moving);
            var oldPlayerNumber = this.state.player_moving;
            this.state.player_moving = nextPlayerNumber;

            var lotus = this.get_lotus(this.state.player_moving);
            var lotus_space = this.find_space(lotus.x, lotus.y);
            var enemies = this.get_enemies(lotus_space);
            if(enemies.length > 0) {
                this.state.piece_selected = lotus;
                this.state.locked = true;
                lotus_space.selected = true;
                this.make_moves_selectable();
                var moves = this.board.filter(s => s.selectable);
                if(moves.length === 0) {
                    this.declare_winner(oldPlayerNumber);
                }
            } else {
                this.make_pieces_selectable();
            }
        },
        swap_player: function(player_number) {
            return + !player_number;
        },
        declare_winner: function(player_number) {
            //var player = this.state.players.filter(p => p.number === player_number)[0];
            var player = this.state.players[player_number];
            console.log(player.name);
            for(var i = 0; i < this.board.length; i++) {
                this.board[i].selectable = false;
            }
            this.winner = player;
        },
        take_pieces: function(piece) {
            if(piece === null) return;
            var space = this.find_space(piece.x, piece.y);
            var enemies = this.get_enemies(space);
            for(var i = 0; i < enemies.length; i++) {
                if(this.takes[piece.element.type].includes(enemies[i].element.type)) {
                    var space = this.find_space(enemies[i].x, enemies[i].y);
                    space.has_piece = false;
                    space.piece = null;
                    var index = this.state.pieces.findIndex(function(piece) {
                        piece === enemies[i];
                    });
                    this.state.pieces.splice(index, 1);
                }
            }
        },
        select: function(value) {
            value.selected = !value.selected;
            if(value.selected) {
                this.state.piece_selected = value.piece;
                this.make_moves_selectable(value);
            } else {
                this.state.piece_selected = null;
                this.make_pieces_selectable();
            }
        },
        make_moves_selectable: function() {
            for(var i = 0; i < this.board.length; i++) {
                this.board[i].selectable = false;
            }
            var x = this.state.piece_selected.x;
            var y = this.state.piece_selected.y;
            for(var i = 0; i < this.moves.length; i++) {
                var space = this.find_space(x + this.moves[i].x, y + this.moves[i].y);
                if(space == null) continue;
                if(!space.has_piece) {
                    if(this.state.piece_selected.element.type !== 'lotus') {
                        space.selectable = true;
                    } else {
                        if(this.get_enemies(space).length === 0) {
                            space.selectable = true;
                        }
                    }

                } else if(this.state.piece_selected.element.type !== 'lotus' && space.piece.player_number === this.state.player_moving) {
                    var jump_space = this.find_space(space.x + this.moves[i].x, space.y + this.moves[i].y);
                    if(jump_space != null && !jump_space.has_piece) {
                        jump_space.selectable = true;
                    }
                }
            }
        },
        make_pieces_selectable: function() {
            for(var i = 0; i < this.board.length; i++) {
                this.board[i].selectable =
                    (this.board[i].has_piece &&
                    (this.board[i].piece.player_number === this.state.player_moving));
            }
        },
        find_space: function(x, y) {
            return this.board.find(function(el) {
                return el.x === x && el.y === y;
            });
        },
        get_lotus: function(player_number) {
            return this.state.pieces.find(function(el) {
                return el.player_number === player_number && el.element.type === 'lotus';
            });
        }
    },
    template: '#boardTemplate'
});



var initialUrl = "http://localhost:5000/api/get-initial-setup";
var moveUrl = "http://localhost:5000/api/move";

Vue.component('piece', {
    props: ['piece'],
    computed: {
    	style: function() {
			return {background: this.piece.element.color};
		}
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
    data: { board: null, state: null, move_matrix: null, take_matrix: null, winner: null },
    mounted: function() {

		function make_state(game) {
			return {
                turn_number: game.turn_number, players: game.players, player_moving: game.player_moving,
                piece_selected: null, pieces: game.board.pieces, locked: false,
                moves: game.moves, current_move: game.current_move
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
		$.get(initialUrl, function(game) {
			self.board = game.board.spaces;
			self.state = make_state(game);
			self.take_matrix = game.take_matrix;
			self.move_matrix = game.move_matrix;
			self.winner = game.winner;
			fill_spaces(self.state, self.board);
			self.make_pieces_selectable();
		});

    },
    methods: {
        move: function(value) {
        	if(!this.state.current_move) {
        		this.state.current_move = this.generate_move(value.piece, this.state.player_moving);
        	}
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
            var enemies_taken = this.take_pieces(value.piece);
            this.push_move_step(value.piece, enemies_taken);

            this.restore_avatar();

            if(distance <= 4 || this.state.piece_selected.element.type === 'LOTUS') {
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
            for(var i = 0; i < this.move_matrix.length; i++) {
                var space = this.find_space(x + this.move_matrix[i].x, y + this.move_matrix[i].y);
                if(space != null && space.has_piece && space.piece.player_number === this.state.player_moving) {
                    var jump_space = this.find_space(space.x + this.move_matrix[i].x, space.y + this.move_matrix[i].y);
                    if(jump_space != null && !jump_space.has_piece) {
                        jump_space.selectable = true;
                    }
                }
            }
            old_space.selectable = false;
        },
        get_enemies: function(space) {
            var enemies = [];
            for(var i = 0; i < this.move_matrix.length; i++) {
                var test = this.find_space(space.x + this.move_matrix[i].x, space.y + this.move_matrix[i].y);
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
            this.state.piece_selected = null;
            this.state.locked = false;
            for(var i = 0; i < this.board.length; i++) {
                this.board[i].selected = false;
                this.board[i].selectable = false;
            }
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
            this.state.moves.push(JSON.parse(JSON.stringify(this.state.current_move)));
            this.get_next_move().then(this.play_computer_turn);
            this.state.current_move = null;
            //this.state.turn_number++;
        },
        swap_player: function(player_number) {
            return + !player_number;
        },
        declare_winner: function(player_number) {
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
            var enemies_taken = [];
            for(var i = 0; i < enemies.length; i++) {
                if(this.take_matrix[piece.element.type].includes(enemies[i].element.type)) {
                    var space = this.find_space(enemies[i].x, enemies[i].y);
                    space.has_piece = false;
                    space.piece = null;
					enemies_taken.push(enemies[i]);
					var index = this.state.pieces.findIndex(p => p === enemies[i]);
                    this.state.pieces.splice(index, 1);
                }
            }
            return enemies_taken;
        },
        restore_avatar: function() {
        //TODO: push this as a move step, yeah?
        	var self = this;
        	function has_avatar(player_number) {
        		var test = self.state.pieces.filter(
        			p => p.player_number === player_number && p.element.type === 'AVATAR'
				);
        		return test.length > 0;
        	}
        	$.each(this.state.players, function(player_number) {
        		player_number = parseInt(player_number);
        		if(has_avatar(player_number)) return;
        		var y_pos = player_number === 0 ? 8 : -8;
        		var avatar_space = self.find_space(0, y_pos);
        		if(avatar_space.has_piece === false) {
        			//setTimeout(function() {
						var avatar = {x: 0,
									  y: y_pos,
									  player_number: player_number,
									  element: {type: 'AVATAR', color: 'purple'} };
						avatar_space.piece = avatar;
						avatar_space.has_piece = true;
						self.state.pieces.push(avatar);
        			//}, 1000);
				}
        	});
        },
        play_computer_turn: function(move) {
        	console.log(move);
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
            for(var i = 0; i < this.move_matrix.length; i++) {
                var space = this.find_space(x + this.move_matrix[i].x, y + this.move_matrix[i].y);
                if(space == null) continue;
                if(!space.has_piece) {
                    if(this.state.piece_selected.element.type !== 'LOTUS') {
                        space.selectable = true;
                    } else {
                        if(this.get_enemies(space).length === 0) {
                            space.selectable = true;
                        }
                    }

                } else if(this.state.piece_selected.element.type !== 'LOTUS'
                		  && space.piece.player_number === this.state.player_moving) {
                    var jump_space = this.find_space(
                    	space.x + this.move_matrix[i].x, space.y + this.move_matrix[i].y
                    );
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
                return el.player_number === player_number && el.element.type === 'LOTUS';
            });
        },
        push_move_step: function(space, takes) {
        	this.state.current_move.move_steps.push(
        		{x: space.x, y: space.y, takes: takes.map(t => JSON.parse(JSON.stringify(t)))}
        	);
        },
        get_next_move: function() {
        	//var dat = JSON.stringify(this.generate_game_object());
        	var dat = JSON.stringify(this.generate_game_object());
//        	console.log(dat);
//        	return $.post(moveUrl, {json: dat}, function(data) {
//        		console.log(data);
//        	}, 'application/json');
//


        	return $.ajax({
                url: moveUrl,
                type: "POST",
                data: dat,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(ret) {
                    console.log(ret);
                }
            });


        },
        generate_move: function(piece, player_number) {
        	//make sure turn number has been initialized
        	if(typeof(this.state.turn_number) !== typeof(1)) {
        		this.state.turn_number = 0;
        	}
        	var app = this;
        	return {
        		player_number: player_number,
        		move_number: app.state.turn_number++,
        		total_steps = 0,
        		//copy piece to preserve the initial state of the piece
        		//SHOULD we do this? Could skip the 'from' in addStep ...
        		piece: JSON.parse(JSON.stringify(piece)),
        		steps: [],
        		addStep: function(move_type, from_x, from_y, to_x, to_y) {
        			var move = this;
					move.steps.push({
						move_type: move_type,
						step_number: move.total_steps++,
						initial_position: {x: from_x, y: from_y},
						final_position: {x: to_x, y: to_y}
					});
        		}
        	}
        },
        generate_game_object: function() {
        	return {
        		board: {
        			//spaces: this.board,
        			pieces: this.state.pieces
        		},
        		players: this.state.players,
        		player_moving: this.state.player_moving,
        		turn_number: this.state.turn_number,
        		winner: this.winner,
        		moves: this.state.moves,
        		current_move: this.state.current_move,
        	}
        }
    },
    template: '#boardTemplate'
});







var pieces = [
    {x: 0, y: 0, player: {number: 1, name: 'one'}, piece: {color: 'red'}},
    {x: -2, y: 0, player: {number: 1, name: 'one'},  piece: {color: 'red'}},
    {x: -1, y: 1, player: {number: 1, name: 'one'},  piece: {color: 'blue'}}
];

var STATE = {
    turn: 0, players: [{number: 1, name: 'one'}, {number: 0, name: 'zero'}],
    player_moving: 1, piece_selected: null, pieces: pieces, locked: false
}

var spaces = [];
for(var i = -12; i < 13; i++) {
    for(var j = -12; j < 13; j++) {
        if(i*i + j*j <= 12.5*12.5 && (i + j) % 2 == 0) {
            spaces.push({x: i, y: j, hasPiece: false, selectable: false, selected: false});
        }
    }
}

for(var i = 0; i < STATE.pieces.length; i++) {
    var space = spaces.find(function(el) {
        return el.x == STATE.pieces[i].x && el.y == STATE.pieces[i].y;
    });
    if(space != null) {
        space.hasPiece = true;
        space.selectable = true;
        space.piece = STATE.pieces[i];
    }
}

var move_matrix = [
    {x: 0, y: 2},
    {x: 0, y: -2},
    {x: 2, y: 0},
    {x: -2, y: 0},
    {x: 1, y: 1},
    {x: 1, y: -1},
    {x: -1, y: -1},
    {x: -1, y: 1},
]


Vue.component('piece', {
    props: ['piece'],
    data: function() {
        return {style: {background: this.piece.piece.color}}
    },
    template: '#pieceTemplate'
});

Vue.component('space', {
    props: ['space', 'piece_selected', 'locked'],
    data: function() {
        var l = (335.85 + 28.2833*this.space.x) + 'px';
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
    data: { board: spaces, state: STATE, moves: move_matrix },
    methods: {
        move: function(value) {
            value.move_to.selected = true;
            var old_space = this.find_space(value.piece.x, value.piece.y);
            var distance = (value.move_to.x - value.piece.x)*(value.move_to.x - value.piece.x)
                        + (value.move_to.y - value.piece.y)*(value.move_to.y - value.piece.y);
            value.piece.x = value.move_to.x;
            value.piece.y = value.move_to.y;
            value.move_to.hasPiece = true;
            value.move_to.piece = value.piece;
            old_space.hasPiece = false;
            old_space.piece = null;
            old_space.selected = false;
            if(distance === 4) {
                this.end_turn(this.piece_selected);
            } else {
                this.make_jumps_selected(this.state.piece_selected);
            }

        },
        make_jumps_selected: function(piece) {
            for(var i = 0; i < this.board.length; i++) {
                this.board[i].selectable = false;
            }
            var x = this.state.piece_selected.x;
            var y = this.state.piece_selected.y;
            for(var i = 0; i < this.moves.length; i++) {
                var space = this.find_space(x + this.moves[i].x, y + this.moves[i].y);
                if(space !== null && space.hasPiece) {
                    var jump_space = this.find_space(space.x + this.moves[i].x, space.y + this.moves[i].y);
                    if(jump_space !== null && !jump_space.hasPiece) {
                        jump_space.selectable = true;
                    }

                }
            }
        },
        end_turn: function(piece) {
            console.log('fuckfuck');
            this.state.piece_selected = null;
            for(var i = 0; i < this.board.length; i++) {
                this.board[i].selected = false;
                this.board[i].selectable = false;
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
        make_moves_selectable: function(value) {
            for(var i = 0; i < this.board.length; i++) {
                this.board[i].selectable = false;
            }
            var x = this.state.piece_selected.x;
            var y = this.state.piece_selected.y;
            for(var i = 0; i < this.moves.length; i++) {
                var space = this.find_space(x + this.moves[i].x, y + this.moves[i].y);
                if(space === null) continue;
                if(!space.hasPiece) {
                    space.selectable = true;
                } else {
                    var jump_space = this.find_space(space.x + this.moves[i].x, space.y + this.moves[i].y);
                    if(jump_space !== null && !jump_space.hasPiece) {
                        jump_space.selectable = true;
                    }
                }

            }

        },
        make_pieces_selectable: function() {
            for(var i = 0; i < this.board.length; i++) {
                this.board[i].selectable =
                    (this.board[i].hasPiece &&
                    this.board[i].piece.player.number == this.state.player_moving);
            }
        },
        find_space: function(x, y) {
            return this.board.find(function(el) {
                return el.x == x && el.y == y;
            });
        }
    },
    template: '#boardTemplate'
});


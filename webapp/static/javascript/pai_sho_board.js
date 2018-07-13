


var pieces = [
    {x: 0, y: 0, piece: {color: 'red'}},
    {x: -2, y: 0, piece: {color: 'red'}},
    {x: -1, y: 1, piece: {color: 'blue'}}
];

var spaces = [];
for(var i = -12; i < 13; i++) {
    for(var j = -12; j < 13; j++) {
        if(i*i + j*j <= 12.5*12.5 && (i + j) % 2 == 0) {
            spaces.push({x: i, y: j, hasPiece: false});
        }
    }
}

for(var i = 0; i < pieces.length; i++) {
    var space = spaces.find(function(el) {
        return el.x == pieces[i].x && el.y == pieces[i].y;
    });
    if(space != null) {
        space.hasPiece = true;
        space.piece = pieces[i].piece;
    }
}

/*console.log(spaces);*/

Vue.component('piece', {
    props: ['piece'],
    data: function() {
        return {style: {background: this.piece.color}}
    },
    template: '<div class="piece" v-bind:style="style"></div>'
});

Vue.component('space', {
    props: ['space'],
    data: function() {
        var l = (335.85 + 28.2833*this.space.x) + 'px';
        var t = (340 - 28.2833*this.space.y) + 'px';
        return {style: {top: t, left: l}}
    },
    template: '<div class="diagonal" v-bind:style="style">' +
                '<piece v-bind:piece="space.piece" v-if="space.hasPiece"></piece>' +
                '</div>'
});



var boardVue = new Vue({
    el: '#board',
    data: { board: spaces },
    template: '<div id="board-container">' +
                    '<space v-for="space in board" v-bind:space="space">' +
                    '</space>' +
                '<div id="background-container"></div></div>'
});


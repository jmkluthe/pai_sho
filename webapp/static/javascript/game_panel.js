
Vue.component('gamePanel', {
    props: [],
//    data: function() {
//    },
    methods: {
    	end_turn: function() {
    		this.$emit('end-turn');
    	}
    },
    template: '#gamePanelTemplate'
});
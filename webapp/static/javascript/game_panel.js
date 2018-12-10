
Vue.component('gamePanel', {
    props: ['end_turn_disabled'],
//    data: function() {
//    },
    methods: {
    	end_turn: function() {
    		this.$emit('end-turn');
    	}
    },
    template: '#gamePanelTemplate'
});
import { mapState,mapGetters } from 'vuex'

export default {
	computed:{
		...mapState(['userInfo','roomInfo'])
	},
	methods: {
		
	},
}
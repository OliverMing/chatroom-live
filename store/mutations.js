export default{
    SET_VALUE(state,data){
        let { key,value } = data;
        state[key] = value;
    }
}
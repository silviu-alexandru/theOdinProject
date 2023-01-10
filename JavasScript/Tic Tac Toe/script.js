const playerMaker = (number, name, marker) =>{
    return {number, name, marker}
}

const tableAction = (() =>{
    const lines = {
        row1 : [null, null, null]
    }
    const clear = () => {};
    const mark = () => {};
    const getLength = () => {console.log(lines.row1.length)}
    return {getLength}
})();

const game = (()=>{

})()
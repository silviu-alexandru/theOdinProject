const aFactory = (name) => {
    const sayName = () => console.log(`My name is ${name}.`)
    return {sayName}
}

const bob = aFactory("Bob")

console.log(bob);

const bFactory = (name) =>{
    const { sayName } = aFactory(name)
    return {sayName}
}

const vasea = bFactory('Vasea')

const cFactory = (name, marker, number) => {
    return { name, marker, number }
}
const jimmy = cFactory('jimmy', 'cross', '1')

const constForReal = {
    propA : 8,
    propB :2
}
console.log(constForReal);

const modConst = ((a, b, c)=>{
    constForReal.propA = a;
    constForReal.propB = b;
    constForReal.propC = c;
})
modConst(1, 2, 3)
console.log(constForReal);
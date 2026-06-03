/*
    CCC Circuits
    Proof of Concept
    core/types/integer.js
    Víctor Franco, June 2026
 */

class FloatGate extends Gate {
    constructor(value){
        super(0, 1, null, null);
        this.eval = () => [this];
        this.term_printer = () => [String(this.value[0])];
        if(typeof value !== "number"){
            throw new Error(`${value} is not a number`);
        }
        this.value = new Float32Array(1);
        this.value[0] = value;
    }

    print(context=null){
        return String(this.value[0]);
    }

    binary(other, func){
        if(!(other instanceof FloatGate)){
            throw new Error("Float operations work only amongst floats.")
        }
        return new FloatGate(func(this.value[0], other.value[0]));

    }

    eq(other){
        if(!(other instanceof FloatGate)){
            throw new Error("Float operations work only amongst floats.")
        }
        return new Bool(this.value[0] === other.value[0]);
    }

    add(other){
        return this.binary(other, (a, b) => a + b);
    }

    subtract(other){
        return this.binary(other, (a, b) => a - b);
    }

    multiply(other){
        return this.binary(other, (a, b) => a * b);
    }

    modulo(other){
        return this.binary(other, (a, b) => a % b);
    }

    divide(other){
        return this.binary(other, (a, b) => a / b);
    }

    additiveInverse(){
        return new FloatGate(-this.value[0]);
    }

    multiplicativeInverse(){
        return new FloatGate(1/this.value[0]);
    }
    
    isNaN(){
        return new Bool(isNaN(this.value[0]));
    }
    
    isFinite(){
        return new Bool(isFinite(this.value[0]));
    }
}


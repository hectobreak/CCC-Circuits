/*
    CCC Circuits
    Proof of Concept
    core/types/integer.js
    Víctor Franco, June 2026
 */

class IntegerGate extends Gate {
    constructor(value){
        super(0, 1, () => [this], () => [value]);
        if(typeof value !== "bigint"){
            throw new Error(`${value} is not a bigint`);
        }
        this.value = value;
    }

    print(context=null){
        return String(this.value);
    }

    is_true(){
        return this.value !== 0n;
    }

    binary(other, func){
        if(!(other instanceof IntegerGate)){
            throw new Error("Integer operations work only amongst integers.")
        }
        return new IntegerGate(func(this.value, other.value));

    }

    eq(other){
        if(!(other instanceof IntegerGate)){
            throw new Error("Natural operations work only amongst integers.")
        }
        return new Bool(this.value === other.value);
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
        if(!(other instanceof IntegerGate)){
            throw new Error("Integer operations work only amongst integers.")
        }
        if(other.value === 0n){
            return new Maybe(null);
        } else {
            return new Maybe(new IntegerGate(this.value % other.value));
        }
    }

    divide(other){
        if(!(other instanceof IntegerGate)){
            throw new Error("Integer operations work only amongst integers.")
        }
        if(other.value === 0n){
            return new Maybe(null);
        } else {
            return new Maybe(new IntegerGate(this.value / other.value));
        }
    }

    and(other){
        return this.binary(other, (a, b) => a & b);
    }

    or(other){
        return this.binary(other, (a, b) => a | b);
    }

    xor(other){
        return this.binary(other, (a, b) => a ^ b);
    }

    additiveInverse(){
        return new IntegerGate(-this.value);
    }

    negation(){
        return new IntegerGate(~this.value);
    }
}

/*
    CCC Circuits
    Proof of Concept
    core/types/bool.js
    Víctor Franco, June 2026
 */

class Bool extends Gate {
    constructor(value){
        super(0, 1, () => [this], () => [value]);
        if(typeof value !== "boolean"){
            throw new Error(`${value} is not a boolean`);
        }
        this.value = value;
    }

    print(context=null){
        return String(this.value);
    }

    is_true(){
        return this.value;
    }

    binary(other, func){
        if(!(other instanceof Bool)){
            throw new Error("Boolean operations work only amongst booleans.")
        }
        return new Bool(func(this.value, other.value));

    }

    eq(other){
        return this.binary(other, (a, b) => a === b);
    }

    or(other){
        return this.binary(other, (a, b) => a || b);
    }

    and(other){
        return this.binary(other, (a, b) => a && b);
    }

    xor(other){
        return this.binary(other, (a, b) => a !== b);
    }

    not(){
        return new Bool(!this.value);
    }
}

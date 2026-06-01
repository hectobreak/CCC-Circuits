/*
    CCC Circuits
    Proof of Concept
    core/types/natural.js
    Víctor Franco, June 2026
 */

class Natural extends Gate {
    constructor(value){
        super(0, 1, () => [this], () => [value]);
        if(typeof value !== "bigint"){
            throw new Error(`${value} is not a bigint`);
        } else if(value < 0n){
            throw new Error(`${value} is not a natural number`);
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
        if(!(other instanceof Natural)){
            throw new Error("Natural operations work only amongst naturals.")
        }
        return new Natural(func(this.value, other.value));

    }

    eq(other){
        if(!(other instanceof Natural)){
            throw new Error("Natural operations work only amongst naturals.")
        }
        return new Bool(this.value === other.value);
    }

    add(other){
        return this.binary(other, (a, b) => a + b);
    }

    saturateSubtract(other){
        return this.binary(other, (a, b) => a < b ? 0n : a - b);
    }

    multiply(other){
        return this.binary(other, (a, b) => a * b);
    }

    modulo(other){
        if(!(other instanceof Natural)){
            throw new Error("Natural operations work only amongst naturals.")
        }
        if(other.value === 0n){
            return new Maybe(null);
        } else {
            return new Maybe(new Natural(this.value % other.value));
        }
    }

    divide(other){
        if(!(other instanceof Natural)){
            throw new Error("Natural operations work only amongst naturals.")
        }
        if(other.value === 0n){
            return new Maybe(null);
        } else {
            return new Maybe(new Natural(this.value / other.value));
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
}

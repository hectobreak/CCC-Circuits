/*
    CCC Circuits
    Proof of Concept
    core/types/maybe.js
    Víctor Franco, June 2026
 */

class Maybe extends Gate {
    constructor(base){
        super(1, 1, (input) => [this.base === null ? input : this.base], (context) => [base === null ? "Nothing" : base.print(context)]);
        if(base !== null && !(base instanceof Gate)){
            throw new Error(`${base} is not a Gate or Nothing`);
        }
        this.base = base;
    }
    is_just(){
        return this.base !== null;
    }
    is_nothing(){
        return this.base === null;
    }
}

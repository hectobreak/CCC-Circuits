/*
    CCC Circuits
    Proof of Concept
    core/gates/integer.js
    Víctor Franco, June 2026
 */

{
    function Bin(eq, pretty_printer){
        return function(a, b) {
            if (a.outputs !== b.outputs)
                throw new Error("Output arity mismatch");
            if (a.inputs !== b.inputs)
                throw new Error("Input arity mismatch");

            return new Gate(
                a.inputs,
                a.outputs,
                (...inputs) => {
                    const av = a.run(...inputs);
                    const bv = b.run(...inputs);

                    for(let ax of av){
                        if(!(ax instanceof IntegerGate)){
                            throw new Error("Non-integer operator for arithmetic")
                        }
                    }
                    for(let bx of bv){
                        if(!(bx instanceof IntegerGate)){
                            throw new Error("Non-integer operator for arithmetic")
                        }
                    }

                    return av.map(
                        (x, i) => eq(x, bv[i])
                    );
                },
                (context) => {
                    const av = a.term_printer(context);
                    const bv = b.term_printer(context);
                    return av.map(
                        (x, i) => pretty_printer(x, bv[i])
                    );
                }
            );
        }
    }

    function BinGate(name, eq, pretty_printer){
        return new Gate(
            2,
            1,
            (a, b) => [Bin(eq, pretty_printer)(a, b)],
            (context) => [`${name}(${context.map(c => `X_{${c.join(", ")}}`)})`]
        );
    }

    CCCLIB['EqInteger'] = BinGate('EqInteger', (x, y) => x.eq(y), (a, b) => `${a} === ${b}`);
    CCCLIB['AddInteger'] = BinGate('AddInteger', (x, y) => x.add(y), (a, b) => `${a} + ${b}`);
    CCCLIB['SubtractInteger'] = BinGate('SubtractInteger', (x, y) => x.subtract(y), (a, b) => `${a} - ${b}`);
    CCCLIB['MultiplyInteger'] = BinGate('MultiplyInteger', (x, y) => x.multiply(y), (a, b) => `${a} * ${b}`);
    CCCLIB['DivideInteger'] = BinGate('DivideInteger', (x, y) => x.divide(y), (a, b) => `${a} / ${b}`);
    CCCLIB['ModuloInteger'] = BinGate('ModuloInteger', (x, y) => x.modulo(y), (a, b) => `${a} % ${b}`);
    CCCLIB['AndInteger'] = BinGate('AndInteger', (x, y) => x.and(y), (a, b) => `${a} & ${b}`);
    CCCLIB['OrInteger'] = BinGate('OrInteger', (x, y) => x.or(y), (a, b) => `${a} | ${b}`);
    CCCLIB['XorInteger'] = BinGate('XorInteger', (x, y) => x.xor(y), (a, b) => `${a} ^ ${b}`);

    CCCLIB['NegativeInteger'] = new Gate(
        1,
        1,
        (a) => {
            if(!(a instanceof IntegerGate)) throw new Error("Non-integer operator for arithmetic");
            return [a.additiveInverse()];
        },
        (context) => [`NegativeInteger(${context.map(c => `X_{${c.join(", ")}}`)})`]
    );

    CCCLIB['NegateInteger'] = new Gate(
        1,
        1,
        (a) => {
            if(!(a instanceof IntegerGate)) throw new Error("Non-integer operator for arithmetic");
            return [a.negation()];
        },
        (context) => [`NegateInteger(${context.map(c => `X_{${c.join(", ")}}`)})`]
    );
}

/*
    CCC Circuits
    Proof of Concept
    core/gates/float.js
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
                        if(!(ax instanceof FloatGate)){
                            throw new Error("Non-float operator for arithmetic")
                        }
                    }
                    for(let bx of bv){
                        if(!(bx instanceof FloatGate)){
                            throw new Error("Non-float operator for arithmetic")
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

    CCCLIB['EqFloat'] = BinGate('EqFloat', (x, y) => x.eq(y), (a, b) => `${a} === ${b}`);
    CCCLIB['AddFloat'] = BinGate('AddFloat', (x, y) => x.add(y), (a, b) => `${a} + ${b}`);
    CCCLIB['SubtractFloat'] = BinGate('SubtractFloat', (x, y) => x.subtract(y), (a, b) => `${a} - ${b}`);
    CCCLIB['MultiplyFloat'] = BinGate('MultiplyFloat', (x, y) => x.multiply(y), (a, b) => `${a} * ${b}`);
    CCCLIB['DivideFloat'] = BinGate('DivideFloat', (x, y) => x.divide(y), (a, b) => `${a} / ${b}`);
    CCCLIB['ModuloFloat'] = BinGate('ModuloFloat', (x, y) => x.modulo(y), (a, b) => `${a} % ${b}`);

    CCCLIB['NegativeFloat'] = new Gate(
        1,
        1,
        (a) => {
            if(!(a instanceof FloatGate)) throw new Error("Non-float operator for arithmetic");
            return [a.additiveInverse()];
        },
        (context) => [`NegativeFloat(${context.map(c => `X_{${c.join(", ")}}`)})`]
    );

    CCCLIB['InverseFloat'] = new Gate(
        1,
        1,
        (a) => {
            if(!(a instanceof FloatGate)) throw new Error("Non-float operator for arithmetic");
            return [a.multiplicativeInverse()];
        },
        (context) => [`InverseFloat(${context.map(c => `X_{${c.join(", ")}}`)})`]
    );

    CCCLIB['IsNaNFloat'] = new Gate(
        1,
        1,
        (a) => {
            if(!(a instanceof FloatGate)) throw new Error("Non-float operator for arithmetic");
            return [a.isNaN()];
        },
        (context) => [`IsNaNFloat(${context.map(c => `X_{${c.join(", ")}}`)})`]
    );

    CCCLIB['IsFiniteFloat'] = new Gate(
        1,
        1,
        (a) => {
            if(!(a instanceof FloatGate)) throw new Error("Non-float operator for arithmetic");
            return [a.isFinite()];
        },
        (context) => [`IsFiniteFloat(${context.map(c => `X_{${c.join(", ")}}`)})`]
    );

    CCCLIB['ConstFloat'] = {
        meta_gate: true,
        meta_params: [{"name": "value"}],
        constructor: (value) => new FloatGate(value)
    }
}

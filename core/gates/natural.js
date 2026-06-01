/*
    CCC Circuits
    Proof of Concept
    core/gates/natural.js
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
                        if(!(ax instanceof Natural)){
                            throw new Error("Non-natural operator for arithmetic")
                        }
                    }
                    for(let bx of bv){
                        if(!(bx instanceof Natural)){
                            throw new Error("Non-natural operator for arithmetic")
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

    CCCLIB['EqNatural'] = BinGate('EqNatural', (x, y) => x.eq(y), (a, b) => `${a} === ${b}`);
    CCCLIB['AddNatural'] = BinGate('AddNatural', (x, y) => x.add(y), (a, b) => `${a} + ${b}`);
    CCCLIB['SaturatedSubtractNatural'] = BinGate('SaturatedSubtractNatural', (x, y) => x.saturateSubtract(y), (a, b) => `${a} - ${b}`);
    CCCLIB['MultiplyNatural'] = BinGate('MultiplyNatural', (x, y) => x.multiply(y), (a, b) => `${a} * ${b}`);
    CCCLIB['DivideNatural'] = BinGate('DivideNatural', (x, y) => x.divide(y), (a, b) => `${a} / ${b}`);
    CCCLIB['ModuloNatural'] = BinGate('ModuloNatural', (x, y) => x.modulo(y), (a, b) => `${a} % ${b}`);
    CCCLIB['AndNatural'] = BinGate('AndNatural', (x, y) => x.and(y), (a, b) => `${a} & ${b}`);
    CCCLIB['OrNatural'] = BinGate('OrNatural', (x, y) => x.or(y), (a, b) => `${a} | ${b}`);
    CCCLIB['XorNatural'] = BinGate('XorNatural', (x, y) => x.xor(y), (a, b) => `${a} ^ ${b}`);
}

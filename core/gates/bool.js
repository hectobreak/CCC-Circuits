/*
    CCC Circuits
    Proof of Concept
    core/gates/bool.js
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
                        if(!(ax instanceof Bool)){
                            throw new Error("Non-boolean operator for boolean operation")
                        }
                    }
                    for(let bx of bv){
                        if(!(bx instanceof Bool)){
                            throw new Error("Non-boolean operator for boolean operation")
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

    CCCLIB['If'] = new Gate(
        3,
        1,
        (comp, a, b) => {
            if (comp.outputs !== 1)
                throw new Error(
                    "condition must have exactly one output"
                );
            if(comp.inputs !== a.inputs || comp.inputs !== b.inputs){
                throw new Error(
                    "input mismatch"
                );
            }
            if(a.outputs !== b.outputs){
                throw new Error(
                    "output mismatch"
                );
            }
            return [new Gate(
                comp.inputs,
                a.outputs,
                (...inputs) => {
                    const cond = comp.run(...inputs);
                    if(!(cond[0] instanceof Bool)){
                        throw new Error("Conditional is not a boolean");
                    }
                    return cond[0].is_true()
                        ? a.run(...inputs)
                        : b.run(...inputs);
                },
                (context) => {
                    const cond = comp.term_printer(context);
                    const aterms = a.term_printer(context);
                    const bterms = b.term_printer(context);
                    return aterms.map((x, i) => `If ${cond[0]} Then ${x} Else ${bterms[i]} EndIf`);
                }
            )];
        },
        (context) => [`If(${context.map(c => `X_{${c.join(", ")}}`)})`]
    );

    CCCLIB['EqBool'] = BinGate('EqBool', (x, y) => x.eq(y), (a, b) => `${a} === ${b}`);
    CCCLIB['OrBool'] = BinGate('OrBool', (x, y) => x.or(y), (a, b) => `${a} || ${b}`);
    CCCLIB['AndBool'] = BinGate('AndBool', (x, y) => x.and(y), (a, b) => `${a} && ${b}`);
    CCCLIB['XorBool'] = BinGate('XorBool', (x, y) => x.xor(y), (a, b) => `${a} !== ${b}`);
    CCCLIB['NegBool'] = new Gate(
        1,
        1,
        (gate) => {
            if(!(gate instanceof Bool)){
                throw new Error("")
            }
            return [gate.not()];
        },
        (context) => [`¬(${context.map(c => `X_{${c.join(", ")}}`)})`]
    );


    CCCLIB['ConstBool'] = {
        meta_gate: true,
        meta_params: [{"name": "value"}],
        constructor: (value) => new Bool(value)
    }
}

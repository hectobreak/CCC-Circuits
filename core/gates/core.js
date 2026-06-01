/*
    CCC Circuits
    Proof of Concept
    core/gates/core.js
    Víctor Franco, June 2026
 */

const CCCLIB = {
    Nil: new Gate(
        0,
        1,
        () => [new Gate(
            0,
            0,
            () => [],
            () => []
        )],
        () => ["() => ()"]
    ),

    Wire: new Gate(
        1,
        1,
        (x) => [new Gate(
            x.inputs + 1,
            x.outputs + 1,
            (...inputs) => {
                const n = inputs.length;

                const coreInputs = inputs.slice(0, n - 1);
                const extra = inputs[n - 1];

                const result = x.run(...coreInputs);

                return [...result, extra];
            },
            (context) =>
                x.term_printer(context.slice(0, context.length-1)).concat(
                    `X_{${context[context.length - 1].join(", ")}}`
                )
        )],
        (context) => [`Wire(${context.map(c => `X_{${c.join(", ")}}`)})`]
    ),

    ConstWire: new Gate(
        2,
        1,
        (x, value) => [new Gate(
            x.inputs,
            x.outputs + 1,
            (...inputs) => {
                const result = x.run(...inputs);
                return [...result, value];
            },
            (context) => {
                return x.term_printer(context).concat(value.print(context.concat(x.outputs)))
            },
        )],
        (context) => [`ConstWire(${context.map(c => `X_{${c.join(", ")}}`)})`]
    ),

    Curry: new Gate(
        1,
        1,
        (gate) => {
            if(gate.inputs === 0) throw new Error("Cannot curry zero inputs");
            return [new Gate(
                1,
                1,
                (...inputs_curry) => [
                    new Gate(
                        gate.inputs-1,
                        gate.outputs,
                        (...inputs) => gate.run(inputs_curry[0], ...inputs)
                    )
                ],
                (context) => {
                    let inputs = [];
                    for(let i = 0; i < gate.inputs; i++) {
                        if(i === 0) inputs.push(context.slice());
                        else inputs.push(context.slice(0, context.length - 1).concat(i));
                    }
                    let out = gate.term_printer(inputs);
                    return [`(${inputs.slice(1).map(x => `X_{${x.join(", ")}}`).join(", ")}) => (${out})`]
                }
            )];
        },
        (context) => [`Curry(${context.map(c => `X_{${c.join(", ")}}`)})`]
    ),

    Codomain: new Gate(
        1,
        1,
        (gate) => {
            // Codomain is the only gate that allows you to lose the initial context.
            if(gate.inputs !== 0 || gate.outputs !== 1){
                throw new Error("Codomain only applies to · -> A type circuits.");
            }
            return [gate.run()[0]];
        },
        (context) => [`Codomain(${context.map(c => `X_{${c.join(", ")}}`)})`]
    ),

    GetOutput: {
        meta_gate: true,
        meta_params: [{"name": "out_elems", "type_check": (res) => {
                if(!(res instanceof Array)) return false;
                for(let i of res){
                    if(!Number.isInteger(i)) return false;
                }
                return true;
            }}],
        ins_min: 1,
        constructor: (...is) => new Gate(
            1,
            1,
            function(x) {
                // (A -> B_1 x ... x B_n) -> (A -> B_{i_1} x B_{i_2} x ...)
                for(let i of is){
                    if (!Number.isInteger(i) || i >= x.outputs || i < 0)
                        throw new Error("output index out of range");
                }
                return [new Gate(
                    x.inputs,
                    is.length,
                    (...inputs) => {
                        const result = x.run(...inputs);
                        return is.map(i => result[i]);
                    },
                    (context) => {
                        const terms = x.term_printer(context);
                        return is.map(i => terms[i]);
                    }
                )]
            },
            (context) => [is.map(x => `X_{${context[0].join(", ")}}[${x}]`)]
        )
    },

    Eval: {
        meta_gate: true,
        meta_params: [{"name": "in_arity"}, {"name": "out_arity"}],
        ins_min: 1,
        constructor: (in_arity, out_arity) => new Gate(
            // (A -> (T_1 x ... x T_n -> B^out_arity)) x (A -> T_1) x ... x (A -> T_n) -> (A -> B^out_arity)
            1 + in_arity,
            1,
            function (f, ...params) {
                return [new Gate(
                    f.inputs,
                    out_arity,
                    (...inputs) => {
                        const gates = f.run(...inputs);

                        return gates.flatMap(gate => {
                            const evaluated = params.flatMap(
                                param => param.run(...inputs)
                            );
                            return gate.run(...evaluated);
                        });
                    },
                    (context) => {
                        let ins = params.flatMap(x => x.term_printer(context));
                        return f.term_printer(context).map(x => `${x}(${ins.join(", ")})`);
                    }
                )]
            },
            (context) => [`Eval(${context.map(x => `X_{${x.join(", ")}}`).join(", ")})`]
        )

    },
};

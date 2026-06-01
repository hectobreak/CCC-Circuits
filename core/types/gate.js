/*
    CCC Circuits
    Proof of Concept
    core/types/gate.js
    Víctor Franco, June 2026
 */

class Gate {
    constructor(inputs, outputs, evaluator, term_printer) {
        this.inputs = inputs;
        this.outputs = outputs;
        this.eval = evaluator;
        this.term_printer = term_printer;

        return new Proxy(this, {
            get: (obj, key) => {
                const index = Number(key);
                if (String(index) === key && Number.isInteger(index) && index >= 0) {
                    return CCCLIB["GetOutput"](obj, index)
                }
                return obj[key];
            },
            set: (obj, key, value) => {
                obj[key] = value;
                return true;
            }
        });
    }

    run(...inputs) {
        if (inputs.length !== this.inputs) {
            throw new Error(
                `Expected ${this.inputs} inputs, got ${inputs.length}`
            );
        }

        const result = this.eval(...inputs);

        if (result.length !== this.outputs) {
            throw new Error(
                `Expected ${this.outputs} outputs, got ${result.length}`
            );
        }

        return result;
    }

    print(context=null){
        if(context === null){
            context = [];
        }
        let inputs = [];
        for(let i = 0; i < this.inputs; i++) {
            inputs.push(context.concat(i));
        }
        let outputs = this.term_printer(inputs);
        return `(${
            inputs.map(x => `X_{${x.join(", ")}}`).join(", ")
        }) => (${
            outputs.join(", ")
        })`;
    }
}

/*
    CCC Circuits
    Proof of Concept
    core/json_compiler.js
    Víctor Franco, June 2026
 */

function compile_gates(gates){
    let res = [];
    function add_gate(gate){
        res.push({
            gate: gate,
            output_ref: {}
        });
    }
    function check_in_arity(gate_desc, n=null){
        if(!(gate_desc.inputs instanceof Array) || (n !== null && gate_desc.inputs.length !== n)){
            throw new Error("Wrong arity");
        }
        let ins = [];
        for(let inx of gate_desc.inputs){
            if(!(inx instanceof Array) || (inx.length !== 1 && inx.length !== 2)){
                throw new Error("Malformed input");
            }
            if(res[inx[0]] === undefined){
                throw new Error(`Unknown gate index ${inx[0]}`);
            }
            if(inx.length === 1){
                ins.push(res[inx[0]].gate);
            } else {
                if(res[inx[0]].output_ref[inx[1]] === undefined){
                    res[inx[0]].output_ref[inx[1]] = res[inx[0]].gate[inx[1]];
                }
                ins.push(res[inx[0]].output_ref[inx[1]]);
            }
        }
        return ins;
    }
    for(let i = 0; i < gates.length; ++i){
        let inst = gates[i];
        let ins;
        switch(inst.type){
            case "ConstNatural":
                check_in_arity(inst, 0);
                add_gate(new Natural(inst.value));
                break;
            case "Eval":
                ins = check_in_arity(inst);
                if(ins.length === 0){
                    throw new Error("Wrong arity");
                }
                if(inst.out_arity === undefined){
                    throw new Error("Missing field: Eval out_arity.");
                }
                add_gate(CCCLIB[inst.type](inst.out_arity)(...ins));
                break;
            case "GetOutput":
                ins = check_in_arity(inst);
                if(ins.length === 0){
                    throw new Error("Wrong arity");
                }
                if(inst.out_elems === undefined){
                    throw new Error("Missing field: GetOutput out_elems.");
                }
                add_gate(CCCLIB[inst.type](inst.out_arity)(...ins));
                break;
            default:
                if(inst.type in CCCLIB){
                    ins = check_in_arity(inst, CCCLIB[inst.type].inputs);
                    add_gate(CCCLIB[inst.type].run(...ins)[0]);
                    break;
                } else {
                    throw new Error(`Unknown gate: ${inst.type}`);
                }
        }
    }
    return res;
}
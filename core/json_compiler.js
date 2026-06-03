/*
    CCC Circuits
    Proof of Concept
    core/json_compiler.js
    Víctor Franco, June 2026
 */

function compile_gates(method){
    let gates = method.gates;
    let wires = method.wires;

    let res = [];
    function add_gate(gate){
        res.push({
            gate: gate,
            output_ref: {}
        });
    }
    function check_in_arity(i, gate_desc, n=null){
        if(!(gate_desc.inputs instanceof Array) || (n !== null && gate_desc.inputs.length !== n)){
            console.log(gate_desc, n);
            throw new Error(`Error in gate ${i}: Wrong arity.`);
        }
        let ins = [];
        for(let inx of gate_desc.inputs){
            if(!(inx instanceof Array) || (inx.length !== 1 && inx.length !== 2)){
                throw new Error(`Error in gate ${i}: Malformed input`);
            }
            if(res[inx[0]] === undefined){
                throw new Error(`Error in gate ${i}: Unknown gate index ${inx[0]}`);
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
        gates[i].inputs = [];
    }

    for(let in_gate of Object.keys(wires)){
        let stack = wires[in_gate].map(x => [[Number(in_gate)], x]);
        while(stack.length > 0){
            let [res, wire] = stack.pop();
            if(wire.type === "select"){
                if(res.length !== 1){
                    throw new Error("Double wire selection");
                }
                stack = stack.concat(wire.wires.map(x => [
                    [res[0], wire.index],
                    x
                ]));
            } else if(wire.type === "end"){
                let [gate_end, input_end] = wire.end;
                if(gates[gate_end].inputs[input_end] !== undefined) {
                    throw new Error("Repeat input");
                }
                gates[gate_end].inputs[input_end] = res;
            }
        }
    }

    for(let i = 0; i < gates.length; ++i){
        let inst = gates[i];
        let ins;
        if (inst.type in CCCLIB) {
            if (CCCLIB[inst.type].meta_gate) {
                let inputs = CCCLIB[inst.type].inputs;
                if (inputs === undefined) inputs = null;
                ins = check_in_arity(i, inst, inputs);
                let meta_params = [];
                for (let param of CCCLIB[inst.type].meta_params) {
                    if (inst[param["name"]] === undefined) {
                        throw new Error(`Error in gate ${i}: Missing field: ${param["name"]}`);
                    }
                    meta_params.push(inst[param["name"]]);
                }
                if (CCCLIB[inst.type].ins_min !== undefined && ins.length < CCCLIB[inst.type].ins_min) {
                    throw new Error(`Error in gate ${i}: Wrong arity. Expected >= ${CCCLIB[inst.type].ins_min}, got ${ins.length}`);
                }
                let tmp = CCCLIB[inst.type].constructor(...meta_params);
                if (tmp instanceof Gate) {
                    add_gate(tmp.run(...ins)[0]);
                } else {
                    add_gate(tmp(...ins));
                }
            } else {
                ins = check_in_arity(i, inst, CCCLIB[inst.type].inputs);
                add_gate(CCCLIB[inst.type].run(...ins)[0]);
            }
        } else {
            throw new Error(`Error in gate ${i}: Unknown gate: ${inst.type}`);
        }

    }
    return res;
}

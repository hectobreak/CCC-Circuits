/*
    CCC Circuits
    Proof of Concept
    core/gates/io.js
    Víctor Franco, June 2026
 */

{
    CCCLIB['Print'] = new Gate(
        1,
        0,
        (gate) => {
            console.log(gate.print());
            return [];
        },
        (context) => [`Print(${context.map(c => `X_{${c.join(", ")}}`)})`]
    )
}

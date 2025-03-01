import React, { useState, useEffect } from "react";
import "./App copy.css";

const DiffieHellmanAlgorithm = () => {
  return (
    <div className="algorithm-container">
      <h3 style={{color:"black"}}>Diffie-Hellman Key Exchange Algorithm</h3>
      <div className="algorithm-steps">
        <ol>
          <li>
            <strong>Setup</strong>: Choose a prime number <em>q</em> and a primitive root <em>α</em> of <em>q</em>
          </li>
          <li>
            <strong>Private Key Generation</strong>:
            <ul>
              <li>Alice selects a random private key X<sub>A</sub> (where 1 &lt; X<sub>A</sub> &lt; q-1)</li>
              <li>Bob selects a random private key X<sub>B</sub> (where 1 &lt; X<sub>B</sub> &lt; q-1)</li>
            </ul>
          </li>
          <li>
            <strong>Public Key Calculation</strong>:
            <ul>
              <li>Alice calculates her public key: Y<sub>A</sub> = α<sup>X<sub>A</sub></sup> mod q</li>
              <li>Bob calculates his public key: Y<sub>B</sub> = α<sup>X<sub>B</sub></sup> mod q</li>
            </ul>
          </li>
          <li>
            <strong>Public Key Exchange</strong>:
            <ul>
              <li>Alice sends Y<sub>A</sub> to Bob (over an insecure channel)</li>
              <li>Bob sends Y<sub>B</sub> to Alice (over an insecure channel)</li>
            </ul>
          </li>
          <li>
            <strong>Shared Secret Calculation</strong>:
            <ul>
              <li>Alice calculates the shared secret: K = (Y<sub>B</sub>)<sup>X<sub>A</sub></sup> mod q</li>
              <li>Bob calculates the shared secret: K = (Y<sub>A</sub>)<sup>X<sub>B</sub></sup> mod q</li>
            </ul>
          </li>
          <li>
            <strong>Verification</strong>: Both Alice and Bob now have the same shared secret K because:
            <ul>
              <li>K = (Y<sub>B</sub>)<sup>X<sub>A</sub></sup> mod q = (α<sup>X<sub>B</sub></sup>)<sup>X<sub>A</sub></sup> mod q = α<sup>X<sub>A</sub>X<sub>B</sub></sup> mod q</li>
              <li>K = (Y<sub>A</sub>)<sup>X<sub>B</sub></sup> mod q = (α<sup>X<sub>A</sub></sup>)<sup>X<sub>B</sub></sup> mod q = α<sup>X<sub>A</sub>X<sub>B</sub></sup> mod q</li>
            </ul>
          </li>
        </ol>
        <div className="algorithm-note">
          <p><strong>Security Note:</strong> The security of the algorithm relies on the computational difficulty of the discrete logarithm problem. An attacker who knows q, α, Y<sub>A</sub>, and Y<sub>B</sub> cannot easily determine X<sub>A</sub> or X<sub>B</sub>, and thus cannot compute the shared secret.</p>
        </div>
      </div>
    </div>
  );
};

const DiffieHellmanCalculator = () => {
  const [alpha, setAlpha] = useState(null);
  const [q, setQ] = useState(null);
  const [privateA, setPrivateA] = useState(null); // Default values for better UX
  const [privateB, setPrivateB] = useState(null); // Default values for better UX
  const [publicA, setPublicA] = useState(null);
  const [publicB, setPublicB] = useState(null);
  const [secretKey, setSecretKey] = useState(null);
  const [step, setStep] = useState(null);
  const [primitiveRootTable, setPrimitiveRootTable] = useState([]);
  const [isPrimitiveRoot, setIsPrimitiveRoot] = useState(true);
  const [showAlgorithm, setShowAlgorithm] = useState(false);
  const [calculationSteps, setCalculationSteps] = useState([]);

  // Effect to reset derived values when fundamentals change
  useEffect(() => {
    setPublicA(null);
    setPublicB(null);
    setSecretKey(null);
    setPrimitiveRootTable([]);
    setIsPrimitiveRoot(true);
    setCalculationSteps([]);
  }, [alpha, q]);

  const modExp = (base, exp, mod) => {
    if (exp === 0) return 1;

    let result = 1;
    base = base % mod;

    let currentExp = exp;
    while (currentExp > 0) {
      if (currentExp % 2 === 1) {
        result = (result * base) % mod;
      }
      currentExp = Math.floor(currentExp / 2);
      base = (base * base) % mod;
    }

    return result;
  };

  const calculatePrimitiveRootTable = () => {
    if (q <= 1) {
      setIsPrimitiveRoot(false);
      return;
    }

    let table = [];
    let seen = new Set();

    for (let i = 1; i < q; i++) {
      const result = modExp(alpha, i, q);
      table.push({ exponent: i, result: result });
      seen.add(result);
    }

    setPrimitiveRootTable(table);
    setIsPrimitiveRoot(seen.size === q - 1);
  };

  const calculatePublicKeys = () => {
    if (!privateA || !privateB || !isPrimitiveRoot) return;

    // Calculate public keys
    setPublicA(modExp(alpha, privateA, q));
    setPublicB(modExp(alpha, privateB, q));

    // Generate step explanation
    let steps = [`Public Key Calculation:
1. Alice uses private key XA = ${privateA} to compute:
   YA = α^XA mod q = ${alpha}^${privateA} mod ${q} = ${modExp(alpha, privateA, q)}

2. Bob uses private key XB = ${privateB} to compute:
   YB = α^XB mod q = ${alpha}^${privateB} mod ${q} = ${modExp(alpha, privateB, q)}

3. Alice and Bob exchange public keys YA and YB`];

    setCalculationSteps(steps);
  };

  const calculateSecretKey = () => {
    if (!isPrimitiveRoot) return;

    let steps = [];

    if (privateA !== null && publicB !== null) {
      const result = modExp(publicB, privateA, q);
      setSecretKey(result);

      steps.push(`Secret Key Calculation:
1. Alice uses Bob's public key YB = ${publicB} and her private key XA = ${privateA}:
   K = YB^XA mod q = ${publicB}^${privateA} mod ${q} = ${result}

2. Alice now has the shared secret key K = ${result}`);
    } else if (privateB !== null && publicA !== null) {
      const result = modExp(publicA, privateB, q);
      setSecretKey(result);

      steps.push(`Secret Key Calculation:
1. Bob uses Alice's public key YA = ${publicA} and his private key XB = ${privateB}:
   K = YA^XB mod q = ${publicA}^${privateB} mod ${q} = ${result}

2. Bob now has the shared secret key K = ${result}`);
    }

    setCalculationSteps(steps);
  };

  const calculatePrivateKey = (publicKey) => {
    if (!publicKey || publicKey <= 0 || !isPrimitiveRoot) return null;

    // This is a brute force approach and might be slow for large numbers
    for (let i = 1; i < q; i++) {
      if (modExp(alpha, i, q) === publicKey) {
        let steps = [`Discrete Logarithm Computation:
1. We need to find X where α^X mod q = Y
2. For public key Y = ${publicKey}, we need X where ${alpha}^X mod ${q} = ${publicKey}
3. Using brute force, we try each possible value for X
4. Found X = ${i}, which gives ${alpha}^${i} mod ${q} = ${publicKey}

5. Therefore, the private key X = ${i}`];

        setCalculationSteps(steps);
        return i;
      }
    }

    setCalculationSteps([`No private key found that generates the public key ${publicKey}.`]);
    return null;
  };

  // When algorithm is shown, hide other panels
  const toggleAlgorithm = () => {
    setShowAlgorithm(!showAlgorithm);
    if (!showAlgorithm) {
      // Clear step when showing algorithm
      setStep(null);
    }
  };

  return (
    <div className="container">

      <div className="tp">
        <h1>Diffie-Hellman Key Exchange</h1>
        <div className="top-buttons">
          <button
            className={showAlgorithm ? "toggle-btn active" : "toggle-btn"}
            onClick={toggleAlgorithm}>
            {showAlgorithm ? "Hide Algorithm" : "Show Algorithm"}
          </button>
        </div>
      </div>

      {showAlgorithm && <DiffieHellmanAlgorithm />}

      {!showAlgorithm && (
        <div className="main-content">
          <div className="left-panel">
            <div className="input-group">
              <label>Primitive Root (α): </label>
              <input
                type="number"
                value={alpha}
                onChange={(e) => setAlpha(Number(e.target.value))}
                min="2"
              />
            </div>

            <div className="input-group">
              <label>Prime Number (q): </label>
              <input
                type="number"
                value={q}
                onChange={(e) => setQ(Number(e.target.value))}
                min="3"
              />
            </div>

            <button onClick={calculatePrimitiveRootTable}>Check Primitive Root</button>

            {!isPrimitiveRoot && primitiveRootTable.length > 0 && (
              <p className="error">Error: α is not a primitive root of q</p>
            )}

            <div className="button-group">
              <button
                onClick={() => setStep("public")}
                disabled={!isPrimitiveRoot || primitiveRootTable.length === 0}
              >
                Calculate Public Keys
              </button>
              <button
                onClick={() => setStep("private")}
                disabled={!isPrimitiveRoot || primitiveRootTable.length === 0}
              >
                Calculate Private Keys
              </button>
              <button
                onClick={() => setStep("secret")}
                disabled={!isPrimitiveRoot || primitiveRootTable.length === 0}
              >
                Calculate Secret Key
              </button>
            </div>

            {step === "public" && (
              <div className="step-container">
                <h3>Calculate Public Keys</h3>
                <div className="input-group">
                  <label>Private Key (XA): </label>
                  <input
                    type="number"
                    value={privateA || ''}
                    onChange={(e) => setPrivateA(Number(e.target.value))}
                    min="1"
                    max={q - 1}
                  />
                </div>
                <div className="input-group">
                  <label>Private Key (XB): </label>
                  <input
                    type="number"
                    value={privateB || ''}
                    onChange={(e) => setPrivateB(Number(e.target.value))}
                    min="1"
                    max={q - 1}
                  />
                </div>
                <button onClick={calculatePublicKeys}>Compute Public Keys</button>
              </div>
            )}

            {step === "private" && (
              <div className="step-container">
                <h3>Calculate Private Keys</h3>
                <div className="input-group">
                  <label>Public Key (YA): </label>
                  <input
                    type="number"
                    value={publicA || ''}
                    onChange={(e) => setPublicA(Number(e.target.value))}
                    min="1"
                  />
                </div>
                <div className="input-group">
                  <label>Public Key (YB): </label>
                  <input
                    type="number"
                    value={publicB || ''}
                    onChange={(e) => setPublicB(Number(e.target.value))}
                    min="1"
                  />
                </div>
                <div className="button-group">
                  <button
                    onClick={() => {
                      const privateKey = calculatePrivateKey(publicA);
                      if (privateKey !== null) setPrivateA(privateKey);
                    }}
                    disabled={!publicA}
                  >
                    Compute XA
                  </button>
                  <button
                    onClick={() => {
                      const privateKey = calculatePrivateKey(publicB);
                      if (privateKey !== null) setPrivateB(privateKey);
                    }}
                    disabled={!publicB}
                  >
                    Compute XB
                  </button>
                </div>
              </div>
            )}

            {step === "secret" && (
              <div className="step-container">
                <h3>Calculate Secret Key</h3>
                <div className="input-group">
                  <label>Public Key (YA): </label>
                  <input
                    type="number"
                    value={publicA || ''}
                    onChange={(e) => setPublicA(Number(e.target.value))}
                    min="1"
                  />
                </div>
                <div className="input-group">
                  <label>Public Key (YB): </label>
                  <input
                    type="number"
                    value={publicB || ''}
                    onChange={(e) => setPublicB(Number(e.target.value))}
                    min="1"
                  />
                </div>
                <div className="input-group">
                  <label>Private Key (XA): </label>
                  <input
                    type="number"
                    value={privateA || ''}
                    onChange={(e) => setPrivateA(Number(e.target.value))}
                    min="1"
                    max={q - 1}
                  />
                </div>
                <div className="input-group">
                  <label>Private Key (XB): </label>
                  <input
                    type="number"
                    value={privateB || ''}
                    onChange={(e) => setPrivateB(Number(e.target.value))}
                    min="1"
                    max={q - 1}
                  />
                </div>
                <button
                  onClick={calculateSecretKey}
                  disabled={(!privateA || !publicB) && (!privateB || !publicA)}
                >
                  Compute Secret Key
                </button>
              </div>
            )}


          </div>

          <div className="right-panel">
            {primitiveRootTable.length > 0 && (
              <div className="table-container">
                <h2>Primitive Root Table</h2>
                <div className="horizontal-table">
                  <table>
                    <thead>
                      <tr>
                        <th>i</th>
                        {primitiveRootTable.map((row, index) => (
                          <th key={index}>{row.exponent}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>α<sup>i</sup> mod q</th>
                        {primitiveRootTable.map((row, index) => (
                          <td key={index}>{row.result}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {calculationSteps.length > 0 && (
              <div className="calculation-steps">
                <h3 style={{ color: "black" }}>Calculation Steps</h3>

                <div className="steps-container">
                  {calculationSteps.map((step, index) => (
                    <pre key={index} className="step-line">{step}</pre>
                  ))}
                </div>
              </div>
            )}

            <div className="results">
              <h3 style={{ color: "black" }}>Results</h3>

              <p>Public Key YA: {publicA !== null ? publicA    : 'Not calculated'}</p>
              <p>Public Key YB: {publicB !== null ? publicB    : 'Not calculated'}</p>
              <p>Private Key XA: {privateA !== null ? privateA : 'Not calculated'}</p>
              <p>Private Key XB: {privateB !== null ? privateB : 'Not calculated'}</p>
              <p>Secret Key: {secretKey !== null ? secretKey   : 'Not calculated'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiffieHellmanCalculator;
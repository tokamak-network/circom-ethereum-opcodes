//const {opcodeDictionary} = require('./opcode.js')
const fs = require('fs')

const numOfLinesPerCircuit = 12

fs.readFile('./temp.txt', 'utf8', function(err, data) {
  if (err) throw err;
  
  const subcircuitJson = {'wire-list': []}

  const output = data.split('\n').slice(0, -1)
  for (var i = 0; i < output.length; i += numOfLinesPerCircuit) {
    // circuit id
    const id = Number(output[i].match(/\d+/)[0])

    // circuit name
    let name
    const parts = output[i].split(' = ');
    if (parts.length > 1) {
      //let tempName = parts[1].toUpperCase();
      let tempName = parts[1];
      if (tempName.includes('_')) {
        const index = tempName.indexOf('_');
        name = tempName.substring(0, index) + '-' + tempName.substring(index + 1);
      } else {
        name = tempName;
      }
    } else {
      continue;
    }

    // circuit opcode
    //const opcode = opcodeDictionary[name]

    // num_wires 
    const numWires = output[i + 8].match(/\d+/)[0]

    // public output
    const numOutput = output[i + 6].match(/\d+/)[0]

    // public input
    const numInput = output[i + 4].match(/\d+/)[0]

    const subcircuit = {
      id: id,
      //opcode: '0',
      name: name,
      Nwires: numWires,
      Out_idx: ['0', numOutput],
      In_idx: [`${Number(numOutput)}`, numInput]
    }
    subcircuitJson['wire-list'].push(subcircuit)
  }

  fs.writeFile('../outputs/subcircuit-info.json', JSON.stringify(subcircuitJson, null, "\t"), err => {
    if (err) {
      console.log('Error writing a file', err)
    } else {
      console.log('Successfully wrote a file')
    }
  })
})
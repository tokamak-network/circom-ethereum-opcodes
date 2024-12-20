//const {opcodeDictionary} = require('./opcode.js')
const fs = require('fs')

const numOfLinesPerCircuit = 12

function _buildWireFlattenMap(globalWireList, subcircuitInfos, globalWireIndex, subcircuitId, subcircuitWireId) {
  if ( globalWireList[globalWireIndex] !== undefined ) {
    throw new Error(`parseWireList: The same mapping occurs twice.`)
  }
  if ( subcircuitInfos[subcircuitId].flattenMap !== undefined ) {
    if ( subcircuitInfos[subcircuitId].flattenMap[subcircuitWireId] !== undefined ){
      throw new Error(`parseWireList: The same mapping occurs twice.`)
    }
  }

  globalWireList[globalWireIndex] = [
    subcircuitId,
    subcircuitWireId,
  ]

  if ( subcircuitInfos[subcircuitId].flattenMap === undefined ){
    const newSubcircuitInfo = {...subcircuitInfos[subcircuitId], flattenMap: []}
    newSubcircuitInfo.flattenMap[subcircuitWireId] = globalWireIndex
    subcircuitInfos[subcircuitId] = newSubcircuitInfo
  } else {
    subcircuitInfos[subcircuitId].flattenMap[subcircuitWireId] = globalWireIndex
  }
}

function parseWireList(subcircuitInfos, mode = 0) {
  // mode: 0 (default) = The output wires of KeccakBufferIn and the input wires of KeccakBufferOut are regarded as public wires.
  // mode: 1 = In addition to the public wires for mode 0, the input wires of InterfaceBufferIn and the output wires of InterfaceBufferOut are additionally regarded as public wires.
  if (mode < 0 || mode > 1){
    throw new Error(`parseWireList: Unexpected mode`)
  }

  const listPublicIn = new Map().set('KeccakBufferOut', true)
  const listPublicOut = new Map().set('KeccakBufferIn', true)
  if (mode){
    listPublicIn.set('InterfaceBufferIn', true)
    listPublicOut.set('InterfaceBufferOut', true)
  }
  let numTotalWires = 0
  let numPublicWires = 0
  let numInterfaceWires = 0
  const subcircuitInfoByName = new Map()
  for (const subcircuit of subcircuitInfos) {
    numTotalWires += subcircuit.Nwires

    if ( listPublicIn.has(subcircuit.name) ){
      numPublicWires += subcircuit.In_idx[1]
    } else {
      numInterfaceWires += subcircuit.In_idx[1]
    }

    if ( listPublicOut.has(subcircuit.name) ){
      numPublicWires += subcircuit.Out_idx[1]
    } else {
      numInterfaceWires += subcircuit.Out_idx[1]
    }

    const entryObject = {
      id: subcircuit.id,
      NWires: subcircuit.Nwires,
      NInWires: subcircuit.In_idx[1],
      NOutWires: subcircuit.Out_idx[1],
      inWireIndex: subcircuit.In_idx[0],
      outWireIndex: subcircuit.Out_idx[0],
    }
    subcircuitInfoByName.set(subcircuit.name, entryObject)
  }

  const l = numPublicWires
  const l_D = numInterfaceWires + l
  const m_D = numTotalWires

  const globalWireList = []

  let ind = 0  
  for ( const subcircuitName of subcircuitInfoByName.keys() ){
    if (listPublicOut.has(subcircuitName)){
      const targetSubcircuit = subcircuitInfoByName.get(subcircuitName)
      const _numInterestWires = targetSubcircuit.NOutWires
      for (let i = 0; i < _numInterestWires; i++) {
        _buildWireFlattenMap(
          globalWireList,
          subcircuitInfos,
          ind++,
          targetSubcircuit.id,
          targetSubcircuit.outWireIndex + i,
        )
      }
    }

    if (listPublicIn.has(subcircuitName)){
      const targetSubcircuit = subcircuitInfoByName.get(subcircuitName)
      const _numInterestWires = targetSubcircuit.NInWires
      for (let i = 0; i < _numInterestWires; i++) {
        _buildWireFlattenMap(
          globalWireList,
          subcircuitInfos,
          ind++,
          targetSubcircuit.id,
          targetSubcircuit.inWireIndex + i,
        )
      }
    }
  }

  if (ind !== l) {
    throw new Error(`parseWireList: Error during flattening public wires`)
  }

  for ( const subcircuitName of subcircuitInfoByName.keys() ){
    if (!listPublicOut.has(subcircuitName)){
      const targetSubcircuit = subcircuitInfoByName.get(subcircuitName)
      const _numInterestWires = targetSubcircuit.NOutWires
      for (let i = 0; i < _numInterestWires; i++) {
        _buildWireFlattenMap(
          globalWireList,
          subcircuitInfos,
          ind++,
          targetSubcircuit.id,
          targetSubcircuit.outWireIndex + i,
        )
      }
    }

    if (!listPublicIn.has(subcircuitName)){
      const targetSubcircuit = subcircuitInfoByName.get(subcircuitName)
      const _numInterestWires = targetSubcircuit.NInWires
      for (let i = 0; i < _numInterestWires; i++) {
        _buildWireFlattenMap(
          globalWireList,
          subcircuitInfos,
          ind++,
          targetSubcircuit.id,
          targetSubcircuit.inWireIndex + i,
        )
      }
    }
  }

  if (ind !== l_D) {
    throw new Error(`parseWireList: Error during flattening interface wires`)
  }

  for (const targetSubcircuit of subcircuitInfos) {
    // The first wire is always for constant
    _buildWireFlattenMap(
      globalWireList,
      subcircuitInfos,
      ind++,
      targetSubcircuit.id,
      0,
    )
    const _numInterestWires = targetSubcircuit.Nwires - (targetSubcircuit.Out_idx[1] + targetSubcircuit.In_idx[1]) - 1
    for (let i = 0; i < _numInterestWires; i++) {
      _buildWireFlattenMap(
        globalWireList,
        subcircuitInfos,
        ind++,
        targetSubcircuit.id,
        targetSubcircuit.In_idx[0] + targetSubcircuit.In_idx[1] + i,
      )
    }
  }

  if (ind !== m_D) {
    throw new Error(`parseWireList: Error during flattening internal wires`)
  }

  return {
    l: l,
    l_D: l_D,
    m_D: m_D,
    wireList: globalWireList,
  }
}

// Main script

fs.readFile('./temp.txt', 'utf8', function(err, data) {
  if (err) throw err;
  
  const subcircuits = []

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
      Nwires: Number(numWires),
      Out_idx: [1, Number(numOutput)],
      In_idx: [Number(numOutput)+1, Number(numInput)]
    }
    subcircuits.push(subcircuit)
  }

  const globalWireInfo = parseWireList(subcircuits)

  const tsSubcircuitInfo = `//flattenMap[localWireIndex] = globalWireIndex \n export const subcircuits =\n ${JSON.stringify(subcircuits, null)}`
  fs.writeFile('../outputs/subcircuitInfo.ts', tsSubcircuitInfo, (err) => {
    if (err) {
      console.log('Error writing the TypeScript file', err);
    } else {
      console.log('Successfully wrote the TypeScript file');
    }
  })

  const tsWireInfo = `//wireList[globalWireIndex][0] = subcircuitId \n //wireList[globalWireIndex][1] = localWireIndex \n export const globalWireInfo =\n ${JSON.stringify(globalWireInfo, null)}`
  fs.writeFile('../outputs/globalWireList.ts', tsWireInfo, (err) => {
    if (err) {
      console.log('Error writing the TypeScript file', err);
    } else {
      console.log('Successfully wrote the TypeScript file');
    }
  })
})
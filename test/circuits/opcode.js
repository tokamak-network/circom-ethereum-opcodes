module.exports = {
  opcodeDictionary : {
    'LOAD': 'FFF',
    'ADD': '1',
    'MUL': '2',
    'SUB': '3',
    'DIV': '4',
    'SDIV': '5',
    'MOD': '6',
    'SMOD': '7',
    'ADDMOD': '8',
    'MULMOD': '9',
    'EXP': 'A',
    'SIGNEXTEND': 'B',
    'LT': '10',
    'GT': '11',
    'SLT': '12',
    'SGT': '13',
    'EQ': '14',
    'ISZERO': '15',
    'AND': '16',
    'OR': '17',
    'XOR': '18',
    'NOT': '19',
    'BYTE': '1A',
    'SHL': '1B',
    'SHR': '1C',
    'SHR-L': '1C1',
    'SHR-H': '1C2',
    'SAR': '1D',
    'SHA3': '20',

    // Integrated circuits
    'ALU': 'F0', // Arithmetic Logic Unit
    'MLU': 'F1', // Mixed Logical Unit 
    'IC' : 'F2', // Integrated Circuit
  }
}
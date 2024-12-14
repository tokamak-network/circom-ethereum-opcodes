const add = [
  {
    "in1": BigInt(10),
    "in2": BigInt(10)
  },
  {
    "in1": BigInt(2**254),
    "in2": BigInt(2**254)
  },
  {
    "in1": BigInt(2**255),
    "in2": BigInt(2**255)
  },
  {
    "in1": BigInt(2**256) - 1n,
    "in2": BigInt(2**256) - 1n
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(1)
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(2)
  }
]

const mul = [
  {
    "in1": BigInt(10),
    "in2": BigInt(10)
  },
  {
    "in1": BigInt(2**254),
    "in2": BigInt(2)
  },
  {
    "in1": BigInt(2**255),
    "in2": BigInt(2**255)
  },
  {
    "in1": BigInt(2**256) - 1n,
    "in2": BigInt(2**256) - 1n
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(1)
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(2)
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(0)
  },
  {
    "in1": BigInt(2**128) - BigInt(1),
    "in2": BigInt(2**128)
  }
]

const sub = [
  {
    "in1": BigInt(10),
    "in2": BigInt(10)
  },
  {
    "in1": BigInt(2**255),
    "in2": BigInt(2**255)
  },
  {
    "in1": BigInt(2**254),
    "in2": BigInt(2)
  },
  {
    "in1": BigInt(2),
    "in2": BigInt(2**254)
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(199)
  },
  {
    "in1": BigInt(1),
    "in2": BigInt(2**256) - BigInt(1)
  },
  {
    "in1": BigInt(0),
    "in2": BigInt(1)
  },
  {
    "in1": BigInt(2**128),
    "in2": BigInt(1)
  },
  {
    "in1": BigInt(2**128),
    "in2": BigInt(2**128) - BigInt(1)
  }
]

const div = [
  {
    "in1": BigInt(10),
    "in2": BigInt(2**128) + BigInt(10)
  },
  {
    "in1": BigInt(2**128) - BigInt(1),
    "in2": BigInt(2**128) + BigInt(10)
  },
  {
    "in1": BigInt(2**128) + BigInt(10),
    "in2": BigInt(2**128) + BigInt(10)
  },
  {
    "in1": BigInt(2**250) + BigInt(10),
    "in2": BigInt(2**128) + BigInt(10)
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(2**128) + BigInt(10)
  },
  {
    "in1": BigInt(0),
    "in2": BigInt(3)
  },
  {
    "in1": BigInt(7),
    "in2": BigInt(3)
  },
  {
    "in1": BigInt(7) * BigInt(2**128) + BigInt(2**128) - BigInt(1),
    "in2": BigInt(3)
  },
  {
    "in1": BigInt(7) * BigInt(2**128) + BigInt(1),
    "in2": BigInt(3)
  },
  {
    "in1": BigInt(0),
    "in2": BigInt(0)
  },
  {
    "in1": BigInt(10),
    "in2": BigInt(0)
  },
  {
    "in1": BigInt(0),
    "in2": BigInt(10)
  },
  {
    "in1": BigInt(10) << 128n,
    "in2": BigInt(0)
  },
  {
    "in1": BigInt(0),
    "in2": BigInt(10) << 128n
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(3)
  },
  {
    "in1": BigInt(3*(2**128))+BigInt(6),
    "in2": BigInt((2**128))+BigInt(8)
  },
  {
    "in1": BigInt(3) * BigInt(2**128) + BigInt(6),
    "in2": BigInt(2**128) + BigInt(8)
  },
  {
    "in1": BigInt(3) * BigInt(2**128) + BigInt(6),
    "in2": BigInt(2) * BigInt(2**128) + BigInt(5)
  },
  {
    "in1": (BigInt(2**127) - BigInt(1)) * BigInt(2**128) + BigInt(2**128) - BigInt(1),
    "in2": BigInt(2**128) - BigInt(1)
  },
  {
    "in1": (BigInt(2**128) - BigInt(2)) * BigInt(2**128) + BigInt(2**128) - BigInt(2),
    "in2": BigInt(2**128) - BigInt(1)
  },
  {
    "in1": (BigInt(2**128) - BigInt(2)) * BigInt(2**128) + BigInt(2**128) - BigInt(2),
    "in2": BigInt(2) * BigInt(2**128) - BigInt(1)
  },
  {
    "in1": (BigInt(2**128) - BigInt(2)) * BigInt(2**128) + BigInt(2**128) - BigInt(2),
    "in2": BigInt(3) * BigInt(2**128) - BigInt(2)
  },
  {
    "in1": (BigInt(2**128) - BigInt(2)) * BigInt(2**128) + BigInt(2**128) - BigInt(2),
    "in2": BigInt(3) * BigInt(2**128) - BigInt(5)
  },
  {
    "in1": (BigInt(2**128) - BigInt(2)) * BigInt(2**128) + BigInt(2**128) - BigInt(2),
    "in2": BigInt(2**32) * BigInt(2**128) - BigInt(5)
  },
  {
    "in1": (BigInt(2**128) - BigInt(2)) * BigInt(2**128) + BigInt(2**128) - BigInt(2),
    "in2": BigInt(6) * BigInt(2**128) + BigInt(2**42) + BigInt(1)
  },
  {
    "in1": (BigInt(2**128) - BigInt(2**22)) * BigInt(2**128) + BigInt(2**128) - BigInt(2**81),
    "in2": BigInt(8) * BigInt(2**128) + BigInt(2**111) + BigInt(5)
  },
  {
    "in1": (BigInt(2**128) - BigInt(6666)) * BigInt(2**128) + BigInt(2**128) - BigInt(2),
    "in2": BigInt(1111) * BigInt(2**128) + BigInt(2**88) + BigInt(3333)
  },
  {
    "in1": (BigInt(2**127)) * BigInt(2**128) + BigInt(2**127),
    "in2": BigInt(3) * BigInt(2**128) + BigInt(3)
  },
  {
    "in1": (BigInt(2**127)) * BigInt(2**128) + BigInt(2**127),
    "in2": BigInt(2) * BigInt(2**128)
  },
  {
    "in1": (BigInt(2**127) + BigInt(2**23)) * BigInt(2**128) + BigInt(2**127) + BigInt(2**111),
    "in2": (BigInt(2**54)) * BigInt(2**128) + BigInt(2**127) + BigInt(2**55)
  }
]

const sdiv = [
  {
    "in1": 9n,
    "in2": 20n,
  },
  {
    "in1": 20n,
    "in2": 9n,
  },
  {
    "in1": BigInt(2**256) - 7n,
    "in2": 3n,
  },
  {
    "in1": 7n,
    "in2": BigInt(2**256) - 3n,
  },
  {
    "in1": BigInt(2**256) - 7n,
    "in2": BigInt(2**256) - 3n
  },
  {
    "in1": BigInt(2**256) - 3n,
    "in2": BigInt(2**256) - 7n,
  },
  {
    "in1": 100n,
    "in2": 0n,
  },
  {
    "in1": BigInt(2**128),
    "in2": 0n,
  },
  {
    "in1": BigInt(2**255),
    "in2": 2n**256n - 1n,
  },
]

const mod = [
  {
    "in1": BigInt(10),
    "in2": BigInt(2**128) + BigInt(10)
  },
  {
    "in1": BigInt(2**128) - BigInt(1),
    "in2": BigInt(2**128) + BigInt(10)
  },
  {
    "in1": BigInt(2**128) + BigInt(10),
    "in2": BigInt(2**128) + BigInt(10)
  },
  {
    "in1": BigInt(2**250) + BigInt(10),
    "in2": BigInt(2**128) + BigInt(10)
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(2**128) + BigInt(10)
  },
  {
    "in1": BigInt(0),
    "in2": BigInt(3)
  },
  {
    "in1": BigInt(7),
    "in2": BigInt(3)
  },
  {
    "in1": BigInt(7) * BigInt(2**128) + BigInt(2**128) - BigInt(1),
    "in2": BigInt(3)
  },
  {
    "in1": BigInt(7) * BigInt(2**128) + BigInt(1),
    "in2": BigInt(3)
  },
  {
    "in1": BigInt(0),
    "in2": BigInt(0)
  },
  {
    "in1": BigInt(10),
    "in2": BigInt(0)
  },
  {
    "in1": BigInt(0),
    "in2": BigInt(10)
  },
  {
    "in1": BigInt(10) << 128n,
    "in2": BigInt(0)
  },
  {
    "in1": BigInt(0),
    "in2": BigInt(10) << 128n
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(3)
  },
  {
    "in1": BigInt(3*(2**128))+BigInt(6),
    "in2": BigInt((2**128))+BigInt(8)
  },
  {
    "in1": BigInt(3) * BigInt(2**128) + BigInt(6),
    "in2": BigInt(2**128) + BigInt(8)
  },
  {
    "in1": BigInt(3) * BigInt(2**128) + BigInt(6),
    "in2": BigInt(2) * BigInt(2**128) + BigInt(5)
  },
  {
    "in1": (BigInt(2**127) - BigInt(1)) * BigInt(2**128) + BigInt(2**128) - BigInt(1),
    "in2": BigInt(2**128) - BigInt(1)
  },
  {
    "in1": (BigInt(2**128) - BigInt(2)) * BigInt(2**128) + BigInt(2**128) - BigInt(2),
    "in2": BigInt(2**128) - BigInt(1)
  },
  {
    "in1": (BigInt(2**128) - BigInt(2)) * BigInt(2**128) + BigInt(2**128) - BigInt(2),
    "in2": BigInt(2) * BigInt(2**128) - BigInt(1)
  },
  {
    "in1": (BigInt(2**128) - BigInt(2)) * BigInt(2**128) + BigInt(2**128) - BigInt(2),
    "in2": BigInt(3) * BigInt(2**128) - BigInt(2)
  },
  {
    "in1": (BigInt(2**128) - BigInt(2)) * BigInt(2**128) + BigInt(2**128) - BigInt(2),
    "in2": BigInt(3) * BigInt(2**128) - BigInt(5)
  },
  {
    "in1": (BigInt(2**128) - BigInt(2)) * BigInt(2**128) + BigInt(2**128) - BigInt(2),
    "in2": BigInt(2**32) * BigInt(2**128) - BigInt(5)
  },
  {
    "in1": (BigInt(2**128) - BigInt(2)) * BigInt(2**128) + BigInt(2**128) - BigInt(2),
    "in2": BigInt(6) * BigInt(2**128) + BigInt(2**42) + BigInt(1)
  },
  {
    "in1": (BigInt(2**128) - BigInt(2**22)) * BigInt(2**128) + BigInt(2**128) - BigInt(2**81),
    "in2": BigInt(8) * BigInt(2**128) + BigInt(2**111) + BigInt(5)
  },
  {
    "in1": (BigInt(2**128) - BigInt(6666)) * BigInt(2**128) + BigInt(2**128) - BigInt(2),
    "in2": BigInt(1111) * BigInt(2**128) + BigInt(2**88) + BigInt(3333)
  },
  {
    "in1": (BigInt(2**127)) * BigInt(2**128) + BigInt(2**127),
    "in2": BigInt(3) * BigInt(2**128) + BigInt(3)
  },
  {
    "in1": (BigInt(2**127)) * BigInt(2**128) + BigInt(2**127),
    "in2": BigInt(2) * BigInt(2**128)
  },
  {
    "in1": (BigInt(2**127) + BigInt(2**23)) * BigInt(2**128) + BigInt(2**127) + BigInt(2**111),
    "in2": (BigInt(2**54)) * BigInt(2**128) + BigInt(2**127) + BigInt(2**55)
  }
]

const smod = [
  {
    "in1": 9n,
    "in2": 20n,
  },
  {
    "in1": 20n,
    "in2": 9n,
  },
  {
    "in1": BigInt(2**256) - 7n,
    "in2": 3n,
  },
  {
    "in1": 7n,
    "in2": BigInt(2**256) - 3n,
  },
  {
    "in1": BigInt(2**256) - 7n,
    "in2": BigInt(2**256) - 3n
  },
  {
    "in1": BigInt(2**256) - 3n,
    "in2": BigInt(2**256) - 7n,
  },
  {
    "in1": 100n,
    "in2": 0n,
  },
  {
    "in1": BigInt(2**128),
    "in2": 0n,
  },
  {
    "in1": BigInt(2**255),
    "in2": 2n**256n - 1n,
  },
]

const addmod = [
  {
    "in1": BigInt(10),
    "in2": BigInt(10),
    "in3": BigInt(2**128) + BigInt(10)
  },
  {
    "in1": BigInt(2**128) - BigInt(1),
    "in2": BigInt(2**128) + BigInt(10),
    "in3": BigInt(2**128) + BigInt(10)
  },
  {
    "in1": BigInt(2**128) + BigInt(10),
    "in2": BigInt(2**128) + BigInt(10),
    "in3": BigInt(2**128) + BigInt(10),
  },
  {
    "in1": BigInt(2**250) + BigInt(10),
    "in2": BigInt(2**128) + BigInt(10),
    "in3": BigInt(2**128) + BigInt(10),
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": 0n,
    "in3": BigInt(2**128) + BigInt(10),
  },
  {
    "in1": BigInt(0),
    "in2": BigInt(0),
    "in3": BigInt(3),
  },
  {
    "in1": BigInt(7),
    "in2": BigInt(7),
    "in3": BigInt(3),
  },
  {
    "in1": BigInt(7) * BigInt(2**128) + BigInt(2**128) - BigInt(1),
    "in2": BigInt(7) * BigInt(2**128) + BigInt(2**128) - BigInt(1),
    "in3": BigInt(3)
  },
  {
    "in1": BigInt(7) * BigInt(2**128) + BigInt(1),
    "in2": BigInt(7) * BigInt(2**128) + BigInt(1),
    "in3": BigInt(3)
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(2**256) - BigInt(1),
    "in3": BigInt(3)
  },

  {
    "in1": BigInt(0),
    "in2": BigInt(0),
    "in3": BigInt(0)
  },
  {
    "in1": BigInt(10),
    "in2": BigInt(0),
    "in3": BigInt(0)
  },
  {
    "in1": BigInt(0),
    "in2": BigInt(0),
    "in3": BigInt(10)
  },
  {
    "in1": BigInt(10) * BigInt(2**128),
    "in2": BigInt(10) * BigInt(2**128),
    "in3": BigInt(0)
  },
  {
    "in1": BigInt(0),
    "in2": BigInt(0),
    "in3": BigInt(10) * BigInt(2**128),
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(2),
    "in3": BigInt(10)
  },
  {
    "in1": BigInt(2**256) - BigInt(2**10),
    "in2": BigInt(2**256) - BigInt(1),
    "in3": BigInt(1111)
  },
  {
    "in1": BigInt(2**100),
    "in2": BigInt(2**123),
    "in3": BigInt(2**130) - BigInt(123)
  },
  {
    "in1": BigInt(2**255),
    "in2": BigInt(2**255),
    "in3": BigInt(2**200) - BigInt(11111)
  },
]

const mulmod = [
  {
    "in1": BigInt(10),
    "in2": BigInt(10),
    "in3": BigInt(2**128) + BigInt(10)
  },
  {
    "in1": BigInt(2**128) - BigInt(1),
    "in2": BigInt(2**128) + BigInt(10),
    "in3": BigInt(2**128) + BigInt(10)
  },
  {
    "in1": BigInt(2**128) + BigInt(10),
    "in2": BigInt(2**128) + BigInt(10),
    "in3": BigInt(2**128) + BigInt(10),
  },
  {
    "in1": BigInt(2**250) + BigInt(10),
    "in2": BigInt(2**128) + BigInt(10),
    "in3": BigInt(2**128) + BigInt(10),
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": 0n,
    "in3": BigInt(2**128) + BigInt(10),
  },
  {
    "in1": BigInt(0),
    "in2": BigInt(0),
    "in3": BigInt(3),
  },
  {
    "in1": BigInt(7),
    "in2": BigInt(7),
    "in3": BigInt(3),
  },
  {
    "in1": BigInt(7) * BigInt(2**128) + BigInt(2**128) - BigInt(1),
    "in2": BigInt(7) * BigInt(2**128) + BigInt(2**128) - BigInt(1),
    "in3": BigInt(3)
  },
  {
    "in1": BigInt(7) * BigInt(2**128) + BigInt(1),
    "in2": BigInt(7) * BigInt(2**128) + BigInt(1),
    "in3": BigInt(3)
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(2**256) - BigInt(1),
    "in3": BigInt(3)
  },

  {
    "in1": BigInt(0),
    "in2": BigInt(0),
    "in3": BigInt(0)
  },
  {
    "in1": BigInt(10),
    "in2": BigInt(0),
    "in3": BigInt(0)
  },
  {
    "in1": BigInt(0),
    "in2": BigInt(0),
    "in3": BigInt(10)
  },
  {
    "in1": BigInt(10) * BigInt(2**128),
    "in2": BigInt(10) * BigInt(2**128),
    "in3": BigInt(0)
  },
  {
    "in1": BigInt(0),
    "in2": BigInt(0),
    "in3": BigInt(10) * BigInt(2**128),
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(2),
    "in3": BigInt(10)
  },
  {
    "in1": BigInt(2**256) - BigInt(2**10),
    "in2": BigInt(2**256) - BigInt(1),
    "in3": BigInt(1111)
  },
  {
    "in1": BigInt(2**100),
    "in2": BigInt(2**123),
    "in3": BigInt(2**130) - BigInt(123)
  },
  {
    "in1": BigInt(2**255),
    "in2": BigInt(2**255),
    "in3": BigInt(2**200) - BigInt(11111)
  },
]

const exp = [
  {
    "in1": BigInt(2),
    "in2": BigInt(0)
  },
  {
    "in1": BigInt(2),
    "in2": BigInt(10)
  },
  {
    "in1": BigInt(2),
    "in2": BigInt(100)
  },
  {
    "in1": BigInt(2),
    "in2": BigInt(128)
  },
  {
    "in1": BigInt(2),
    "in2": BigInt(255)
  },
  {
    "in1": BigInt(7),
    "in2": BigInt(0)
  },
  {
    "in1": BigInt(7),
    "in2": BigInt(10)
  },
  {
    "in1": BigInt(7),
    "in2": BigInt(100)
  },
  {
    "in1": BigInt(7),
    "in2": BigInt(110)
  },
  {
    "in1": BigInt(0),
    "in2": BigInt(10)
  },
  {
    "in1": BigInt(2**128),
    "in2": BigInt(0)
  },
  {
    "in1": BigInt(2**128),
    "in2": BigInt(1)
  },
  {
    "in1": BigInt(2**128),
    "in2": BigInt(2)
  },
  {
    "in1": BigInt(2**128),
    "in2": BigInt(100)
  },
  {
    "in1": BigInt(2**128),
    "in2": BigInt(128)
  },
  {
    "in1": BigInt(2**128),
    "in2": BigInt(255)
  },
  {
    "in1": BigInt(2**128) + BigInt(1),
    "in2": BigInt(2)
  },
  {
    "in1": BigInt(0),
    "in2": BigInt(10)
  },
  {
    "in1": BigInt(0),
    "in2": BigInt(0)
  },
]

const subexp = [
  {
    "c_prev": 0n,
    "a_prev": 0n,
    "b": 0n,
  },
  {
    "c_prev": 0n,
    "a_prev": 0n,
    "b": 1n,
  },
  {
    "c_prev": 0n,
    "a_prev": 1n,
    "b": 0n,
  },
  {
    "c_prev": 0n,
    "a_prev": 1n,
    "b": 1n,
  },
  {
    "c_prev": 1n,
    "a_prev": 0n,
    "b": 0n,
  },
  {
    "c_prev": 1n,
    "a_prev": 0n,
    "b": 1n,
  },
  {
    "c_prev": 1n,
    "a_prev": 1n,
    "b": 0n,
  },
  {
    "c_prev": 1n,
    "a_prev": 1n,
    "b": 1n,
  },
  {
    "c_prev": 3n,
    "a_prev": 2n,
    "b": 1n,
  },
  {
    "c_prev": 3n,
    "a_prev": 2n,
    "b": 0n,
  },
  {
    "c_prev": 79307445816451805851365181209357760720539584842636925064515918291782772015283n,
    "a_prev": 68982677485738143007635082075378790226422481181846051008067279080312775283603n,
    "b": 0n,
  },
  {
    "c_prev": 19919471428995712098664454943189411347638626288585453107793261732047004488933n,
    "a_prev": 49541943135053843434197449734201053093077012989071644887563885261448905873522n,
    "b": 1n,
  },
  {
    "c_prev": BigInt(2^256-2),
    "a_prev": BigInt(2^256-2),
    "b": 1n,
  },
  {
    "c_prev": BigInt(2^256-2),
    "a_prev": BigInt(2^256-2),
    "b": 0n,
  }
]

const signextend = [
  {
    "in1": BigInt(0),
    "in2": BigInt(0xf077fF)
  },
  {
    "in1": BigInt(1),
    "in2": BigInt(0xf077fF)
  },
  {
    "in1": BigInt(2),
    "in2": BigInt(0xf077fF)
  },
  {
    "in1": BigInt(15),
    "in2": BigInt(0xf077fF)
  },
  {
    "in1": BigInt(16),
    "in2": BigInt(0xf077fF)
  },
  {
    "in1": BigInt(29),
    "in2": BigInt(0xf077fF)
  },
  {
    "in1": BigInt(30),
    "in2": BigInt(0xf077fF)
  },
  {
    "in1": BigInt(31),
    "in2": BigInt(0xf077fF)
  },
  {
    "in1": BigInt(32),
    "in2": BigInt(0xf077fF)
  },
  {
    "in1": BigInt(200),
    "in2": BigInt(0xf077fF)
  },
  {
    "in1": BigInt(10000),
    "in2": BigInt(0xf077fF)
  },
  {
    "in1": BigInt(0),
    "in2": BigInt(2**255) + BigInt("0xf077fF")
  },
  {
    "in1": BigInt(15),
    "in2": BigInt(2**255) + BigInt("0xf077fF")
  },
  {
    "in1": BigInt(16),
    "in2": BigInt(2**255) + BigInt("0xf077fF")
  },
  {
    "in1": BigInt(29),
    "in2": BigInt(2**255) + BigInt("0xf077fF")
  },
  {
    "in1": BigInt(30),
    "in2": BigInt(2**255) + BigInt("0xf077fF")
  },
  {
    "in1": BigInt(31),
    "in2": BigInt(2**255) + BigInt("0xf077fF")
  },
  {
    "in1": BigInt(0),
    "in2": (BigInt("0xf077fF") << 128n) + BigInt("0xf077fF")
  },
  {
    "in1": BigInt(15),
    "in2": (BigInt("0xf077fF") << 128n) + BigInt("0xf077fF")
  },
  {
    "in1": BigInt(16),
    "in2": (BigInt("0xf077fF") << 128n) + BigInt("0xf077fF")
  },
  {
    "in1": BigInt(17),
    "in2": (BigInt("0xf077fF") << 128n) + BigInt("0xf077fF")
  },
  {
    "in1": BigInt(31),
    "in2": (BigInt("0xf077fF") << 128n) + BigInt("0xf077fF")
  },
  {
    "in1": BigInt(32),
    "in2": (BigInt("0xf077fF") << 128n) + BigInt("0xf077fF")
  },
  {
    "in1": BigInt(100),
    "in2": (BigInt("0xf077fF") << 128n) + BigInt("0xf077fF")
  },
]

const lt = [
  {
    "in1": BigInt(10),
    "in2": BigInt(100)
  },
  {
    "in1": BigInt(2**128),
    "in2": BigInt(2**128) + BigInt(1)
  },
  {
    "in1": BigInt(2**254),
    "in2": BigInt(2**253) + BigInt(1)
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(2**255)
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(1)
  },
]

const gt = [
  {
    "in1": BigInt(10),
    "in2": BigInt(100)
  },
  {
    "in1": BigInt(2**128),
    "in2": BigInt(2**128) + BigInt(1)
  },
  {
    "in1": BigInt(2**254),
    "in2": BigInt(2**253) + BigInt(1)
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(2**255)
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(1)
  },
]

const slt = [
  {
    "in1": BigInt(1),
    "in2": BigInt(200)
  },
  {
    "in1": BigInt(1000),
    "in2": BigInt(200)
  },
  {
    "in1": BigInt(2**254),
    "in2": BigInt(2**256) - BigInt(1)
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(2**254),
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(200)
  },
  {
    "in1": BigInt(200),
    "in2": BigInt(2**256) - BigInt(1),
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(2**256) - BigInt(10)
  },
  {
    "in1": BigInt(2**256) - BigInt(10),
    "in2": BigInt(2**256) - BigInt(1),
  },
]

const sgt = [
  {
    "in1": BigInt(1),
    "in2": BigInt(200)
  },
  {
    "in1": BigInt(1000),
    "in2": BigInt(200)
  },
  {
    "in1": BigInt(2**254),
    "in2": BigInt(2**256) - BigInt(1)
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(2**254),
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(200)
  },
  {
    "in1": BigInt(200),
    "in2": BigInt(2**256) - BigInt(1),
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(2**256) - BigInt(10)
  },
  {
    "in1": BigInt(2**256) - BigInt(10),
    "in2": BigInt(2**256) - BigInt(1),
  },
]

const eq = [
  {
    "in1": BigInt(100),
    "in2": BigInt(100)
  },
  {
    "in1": BigInt(2**128),
    "in2": BigInt(2**128)
  },
  {
    "in1": BigInt(2**254),
    "in2": BigInt(2)
  },
  {
    "in1": BigInt(30),
    "in2": BigInt(30 * 2**128)
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(1)
  },
]

const iszero = [
  {
    "in": BigInt(0)
  },
  {
    "in": BigInt(2**128)
  },
  {
    "in": BigInt(2**254)
  },
  {
    "in": BigInt(2**256) - BigInt(1)
  }
]

const and = [
  {
    "in1": BigInt(100),
    "in2": BigInt(100)
  },
  {
    "in1": BigInt(2**128),
    "in2": BigInt(0)
  },
  {
    "in1": BigInt(2**254),
    "in2": BigInt(2)
  },
  {
    "in1": BigInt(30),
    "in2": BigInt(30 * 2**128)
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(200)
  },
]

const or = [
  {
    "in1": BigInt(100),
    "in2": BigInt(100)
  },
  {
    "in1": BigInt(2**128),
    "in2": BigInt(0)
  },
  {
    "in1": BigInt(2**254),
    "in2": BigInt(2)
  },
  {
    "in1": BigInt(30),
    "in2": BigInt(30 * 2**128)
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(200)
  },
]

const xor = [
  {
    "in1": BigInt(100),
    "in2": BigInt(100)
  },
  {
    "in1": BigInt(2**128),
    "in2": BigInt(0)
  },
  {
    "in1": BigInt(2**254),
    "in2": BigInt(2)
  },
  {
    "in1": BigInt(30),
    "in2": BigInt(30 * 2**128)
  },
  {
    "in1": BigInt(2**256) - BigInt(1),
    "in2": BigInt(200)
  },
]

const not = [
  {
    "in": BigInt(100)
  },
  {
    "in": BigInt(0)
  },
  {
    "in": BigInt(2**254)
  },
  {
    "in": BigInt(30)
  },
  {
    "in": BigInt(2**256) - BigInt(1)
  },
]

const byte = [
  {
    "in1": BigInt(0),
    "in2": BigInt(0x12345678),
  },
  {
    "in1": BigInt(31),
    "in2": BigInt(0x12345678),
  },
  {
    "in1": BigInt(32),
    "in2": BigInt(0x12345678),
  },
  {
    "in1": BigInt(2**256 - 1),
    "in2": BigInt(0x12345678),
  },
  {
    "in1": BigInt(0),
    "in2": BigInt(0x12345678) * BigInt(2**128),
  },
  {
    "in1": BigInt(12),
    "in2": BigInt(0x12345678) * BigInt(2**128),
  },
  {
    "in1": BigInt(15),
    "in2": BigInt(0x12345678) * BigInt(2**128),
  },
  {
    "in1": BigInt(16),
    "in2": BigInt(0x12345678) * BigInt(2**128),
  },
  {
    "in1": BigInt(28),
    "in2":BigInt(0x12345678) * BigInt(2**128),
  },
]

const shl = [
  {
    "in1": BigInt(10),
    "in2": BigInt(2**10),
  },
  {
    "in1": BigInt(1),
    "in2": BigInt(2**128),
  },
  {
    "in1": BigInt(500),
    "in2": BigInt(3**30),
  },
  {
    "in1": BigInt(50),
    "in2": BigInt(7),
  },
  {
    "in1": BigInt(128),
    "in2": BigInt(2**128) - BigInt(1),
  },
  {
    "in1": BigInt(200),
    "in2": BigInt(2**250) - BigInt(1),
  },
]

const shr = [
  {
    "in1": BigInt(10),
    "in2": BigInt(2**10),
  },
  {
    "in1": BigInt(1),
    "in2": BigInt(2**128),
  },
  {
    "in1": BigInt(500),
    "in2": BigInt(3**30),
  },
  {
    "in1": BigInt(50),
    "in2": BigInt(7),
  },
  {
    "in1": BigInt(128),
    "in2": BigInt(2**128) - BigInt(1),
  },
  {
    "in1": BigInt(200),
    "in2": BigInt(2**250) - BigInt(1),
  },
]

const sar = [
  {
    "in1": BigInt(0),
    "in2": BigInt(2**255),
  },
  {
    "in1": BigInt(64),
    "in2": BigInt(2**255),
  },
  {
    "in1": BigInt(128),
    "in2": BigInt(2**255),
  },
  {
    "in1": BigInt(196),
    "in2": BigInt(2**255),
  },
  {
    "in1": BigInt(256),
    "in2": BigInt(2**255),
  },
  {
    "in1": BigInt(1),
    "in2": BigInt(2**128),
  },
  {
    "in1": BigInt(500),
    "in2": BigInt(3**30),
  },
  {
    "in1": BigInt(10),
    "in2": BigInt(2**256) - BigInt(1),
  },
  {
    "in1": BigInt(255),
    "in2": BigInt(2**256) - BigInt(1),
  },
  {
    "in1": BigInt(256),
    "in2": BigInt(2**256) - BigInt(1),
  },
  {
    "in1": BigInt(128),
    "in2": BigInt(2**128) - BigInt(1),
  },
  {
    "in1": BigInt(200),
    "in2": BigInt(2**255) - BigInt(1),
  },
]

module.exports = {
  add,
  mul,
  sub,
  div,
  sdiv,
  mod,
  smod,
  addmod,
  mulmod,
  exp,
  subexp,
  signextend,
  lt,
  gt,
  slt,
  sgt,
  eq,
  iszero,
  and,
  or,
  xor,
  not,
  byte,
  shl,
  shr,
  sar,
}
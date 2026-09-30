/** On-screen Thai copy for the mosquito explainer; narration lives in the design spec. */
export const MOSQUITO_SCRIPT = {
  hook: {
    bitten: 12,
    spared: 0,
    countLabel: 'รอยยุงกัด',
    question: 'เลือดหวาน?',
  },
  myth: {
    belief: 'เลือดหวาน',
    actually: 'ความจริงคือ',
    truth: 'ยุงเลือกก่อนกัด',
    femaleLabel: 'ยุงตัวเมียเท่านั้นที่กัด',
    eggs: 'ใช้เลือดสร้างไข่',
  },
  breath: {
    step: '1',
    title: 'ลมหายใจ',
    lead: 'ยุงได้กลิ่นคาร์บอนไดออกไซด์',
    gas: 'CO₂',
    distance: 'หลายเมตร',
  },
  color: {
    step: '2',
    title: 'สี + ความร้อน',
    attract: 'สนใจ',
    ignore: 'ไม่ค่อยสน',
    skinNote: 'สีผิวคน\nก็อยู่ในกลุ่มนี้',
    heat: 'ไอร้อนจากตัวเรา',
  },
  smell: {
    step: '3',
    title: 'กลิ่นผิว',
    chartCaption: 'อาสาสมัครแต่ละคน',
    magnet: 'แม่เหล็กดูดยุง',
    least: 'น้อยที่สุด',
    ratioLead: 'ดึงดูดยุงต่างกันราว',
    ratio: 100,
    ratioSuffix: '×',
    stable: 'ผลเหมือนเดิมตลอดหลายปี',
    reason: 'ผิวมีกรดไขมันบางชนิดสูงกว่า',
    source: 'ที่มา: De Obaldia et al., Cell (2022) · แผนภูมิเป็นภาพประกอบ',
  },
  matters: {
    name: 'ยุงลาย',
    carrier: '= พาหะไข้เลือดออก',
    daytime: 'กัดกลางวัน',
    morning: 'เช้า',
    afternoon: 'บ่ายแก่ๆ',
  },
  action: {
    lead: 'เปลี่ยนกลิ่นผิวไม่ได้ แต่…',
    headline: 'ป้องกันได้',
    items: [
      {title: 'ยาทากันยุง', detail: 'DEET / พิคาริดิน / IR3535'},
      {title: 'เสื้อผ้าสีอ่อน', detail: 'แขนยาว ขายาว'},
      {title: '3 เก็บ', detail: 'เก็บบ้าน เก็บขยะ เก็บน้ำ'},
    ],
  },
  closing: {
    myth: 'ไม่ใช่เลือดหวาน',
    truth: 'แต่เป็นกลิ่นผิว',
  },
} as const;

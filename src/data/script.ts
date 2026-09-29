/** Every on-screen word, grouped by chapter. Facts follow the Thai DDC and WHO guidance in docs/STORYBOARD.md. */
export const SCRIPT = {
  hook: {
    flood: 'น้ำท่วม',
    beware: 'ระวัง',
    disease: 'โรคฉี่หนู',
  },
  wade: {
    justWading: 'แค่เดินลุยน้ำ',
    alreadyRisky: '…ก็เสี่ยงแล้ว',
  },
  invisible: {
    name: 'เชื้อเลปโตสไปรา',
    latin: 'Leptospira',
    invisible: 'มองไม่เห็น',
    nakedEye: 'ด้วยตาเปล่า',
  },
  source: {
    from: 'มาจาก',
    urine: 'ปัสสาวะ',
    infectedAnimals: 'สัตว์ที่ติดเชื้อ',
    animals: ['หนู', 'สุนัข', 'วัว', 'ควาย', 'สุกร'],
    contaminates: 'ปนเปื้อนใน',
    places: ['น้ำ', 'ดิน', 'โคลน'],
  },
  entry: {
    title: 'เข้าสู่ร่างกายทาง',
    routes: [
      {title: 'บาดแผล', detail: 'รอยขีดข่วน'},
      {title: 'ผิวที่แช่น้ำนาน', detail: 'ผิวเปื่อย ยุ่ย'},
      {title: 'ตา · จมูก · ปาก', detail: 'เยื่อบุ'},
    ],
  },
  incubation: {
    lead: 'อาการเริ่มใน',
    range: '2–30',
    unit: 'วัน',
    after: 'หลังสัมผัสน้ำ',
  },
  symptoms: {
    fever: 'ไข้สูงเฉียบพลัน',
    calf: 'ปวดน่อง',
    calfDetail: 'รุนแรง',
    eyes: 'ตาแดง',
    headache: 'ปวดหัว',
    warningLead: 'ถ้ารักษาช้า',
    warning: ['อาจรุนแรง', 'ถึงชีวิต'],
  },
  prevention: {
    title: 'ป้องกันได้',
    rules: ['สวมรองเท้าบูท', 'เลี่ยงแช่น้ำนาน', 'ล้างตัวด้วยสบู่ทันที', 'มีแผล ปิดกันน้ำ'],
  },
  cta: {
    question: 'มีไข้หลังลุยน้ำ?',
    action: 'รีบพบแพทย์',
    tell: 'บอกประวัติการลุยน้ำ',
    hotlineLabel: 'สายด่วนกรมควบคุมโรค',
    hotline: '1422',
    tagline: 'ลุยน้ำ ต้องป้องกัน',
  },
} as const;

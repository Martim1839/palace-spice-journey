import heroDish from "@/assets/image-4.jpg";
import interior from "@/assets/image.jpg";
import bar from "@/assets/image-2.jpg";
import samosa from "@/assets/image-3.jpg";
import korma from "@/assets/image-5.jpg";
import biryani from "@/assets/image-6.jpg";
import naan from "@/assets/image-7.jpg";
import wine from "@/assets/image-8.jpg";
import thali from "@/assets/thali.jpg";
import cocktail from "@/assets/cocktail.jpg";

export const INFO = {
  name: "Indian Palace",
  address: "Av. 8, 832, 4500-207 Espinho, Portugal",
  phoneDisplay: "+351 22 996 2071",
  phone: "+351229962071",
  whatsapp: "351229962071",
  instagram: "https://www.instagram.com/indianpalace.eu/",
  facebook: "https://www.facebook.com/indianpalaceporto",
  mapsEmbed:
    "https://www.google.com/maps?q=Indian%20Palace%2C%20Av.%208%20832%2C%204500-207%20Espinho%2C%20Portugal&output=embed",
  mapsLink:
    "https://www.google.com/maps/search/?api=1&query=Indian+Palace,+Av.+8+832,+4500-207+Espinho,+Portugal",
  hours: [
    { day: "Segunda", time: "Fechado" },
    { day: "Terça a Quinta", time: "12:00 – 15:00 · 18:00 – 23:00" },
    { day: "Sexta e Sábado", time: "12:00 – 15:00 · 18:00 – 23:30" },
    { day: "Domingo", time: "12:00 – 15:00 · 18:00 – 23:00" },
  ],
};

export const IMAGES = {
  // hero-01.jpg: prato de assinatura
  hero: heroDish,
  // sobre-01.jpg: interior / esplanada
  about: interior,
  gallery: [
    { src: thali, alt: "Mesa completa com curries, biryani e naan", slot: "galeria-01.jpg", span: "wide" },
    { src: heroDish, alt: "Butter Chicken cremoso", slot: "galeria-02.jpg", span: "tall" },
    { src: interior, alt: "Sala de jantar do Indian Palace", slot: "galeria-03.jpg", span: "normal" },
    { src: biryani, alt: "Biryani aromático", slot: "galeria-04.jpg", span: "normal" },
    { src: samosa, alt: "Samosa crocante com salada", slot: "galeria-05.jpg", span: "normal" },
    { src: cocktail, alt: "Cocktail de manga preparado no bar", slot: "galeria-06.jpg", span: "tall" },
    { src: bar, alt: "Bar do restaurante", slot: "galeria-07.jpg", span: "wide" },
    { src: naan, alt: "Naan de alho e coentros", slot: "galeria-08.jpg", span: "normal" },
    { src: korma, alt: "Caril de camarão com côco", slot: "galeria-09.jpg", span: "normal" },
    { src: wine, alt: "Garrafeira e sala vermelha", slot: "galeria-10.jpg", span: "normal" },
  ],
};

export const AREAS = [
  { value: "sala", label: "Sala interior (ar condicionado)" },
  { value: "esplanada", label: "Esplanada exterior" },
  { value: "indiferente", label: "Indiferente" },
];

export const OCCASIONS = [
  "Jantar romântico",
  "Refeição em família",
  "Almoço económico",
  "Aniversário",
  "Grupo / empresa",
  "Outra",
];

/** Horário em minutos (0 = Domingo) usado no indicador "Aberto agora". */
export const OPEN_SLOTS: Record<number, Array<[number, number]>> = {
  0: [
    [720, 900],
    [1080, 1380],
  ],
  1: [],
  2: [
    [720, 900],
    [1080, 1380],
  ],
  3: [
    [720, 900],
    [1080, 1380],
  ],
  4: [
    [720, 900],
    [1080, 1380],
  ],
  5: [
    [720, 900],
    [1080, 1410],
  ],
  6: [
    [720, 900],
    [1080, 1410],
  ],
};

/**
 * Valida se uma data/hora de reserva está dentro do horário de funcionamento.
 * Usa UTC para o cálculo do dia da semana: todos os horários do formulário
 * são entre 12:00 e 22:00, pelo que coincidem sempre com o dia de Lisboa.
 */
export function validateReservationSlot(
  dateStr: string,
  timeStr: string,
): { ok: boolean; error?: string } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const reservationDate = new Date(`${dateStr}T00:00:00.000Z`);
  if (Number.isNaN(reservationDate.getTime())) {
    return { ok: false, error: "Data inválida." };
  }

  const selectedDay = new Date(
    reservationDate.getUTCFullYear(),
    reservationDate.getUTCMonth(),
    reservationDate.getUTCDate(),
  );

  if (selectedDay < today) {
    return { ok: false, error: "A data da reserva não pode estar no passado." };
  }

  const maxDay = new Date(today);
  maxDay.setDate(maxDay.getDate() + 90);
  if (selectedDay > maxDay) {
    return { ok: false, error: "As reservas só podem ser feitas com até 90 dias de antecedência." };
  }

  const day = reservationDate.getUTCDay();
  const slots = OPEN_SLOTS[day];
  if (!slots || slots.length === 0) {
    return { ok: false, error: "O restaurante está fechado neste dia." };
  }

  const parts = timeStr.split(":").map((p) => Number.parseInt(p, 10));
  if (parts.length !== 2 || parts.some((n) => Number.isNaN(n))) {
    return { ok: false, error: "Hora inválida." };
  }
  const hours = parts[0] ?? Number.NaN;
  const minutes = parts[1] ?? Number.NaN;
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return { ok: false, error: "Hora inválida." };
  }
  const slotMinutes = hours * 60 + minutes;

  const inSlot = slots.some(([start, end]) => slotMinutes >= start && slotMinutes < end);
  if (!inSlot) {
    return { ok: false, error: "A hora escolhida está fora do horário de funcionamento." };
  }

  if (selectedDay.getTime() === today.getTime()) {
    const reservationTime = new Date(today);
    reservationTime.setHours(hours, minutes, 0, 0);
    const minAdvance = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    if (reservationTime < minAdvance) {
      return {
        ok: false,
        error: "As reservas para hoje devem ser feitas com pelo menos 2 horas de antecedência.",
      };
    }
  }

  return { ok: true };
}

export const MENU: Array<{
  id: string;
  title: string;
  note?: string;
  items: Array<{
    pt: string;
    orig: string;
    desc: string;
    price: string;
    spice?: 0 | 1 | 2 | 3;
    veg?: boolean;
    signature?: boolean;
  }>;
}> = [
  {
    id: "entradas",
    title: "Entradas",
    items: [
      { pt: "Pastel de legumes", orig: "Vegetable Samosa", desc: "Massa crocante recheada com batata, ervilhas e especiarias.", price: "5,50 €", spice: 1, veg: true },
      { pt: "Frango marinado no forno de barro", orig: "Chicken Tikka", desc: "Cubos de frango marinados em iogurte e garam masala.", price: "7,90 €", spice: 2 },
      { pt: "Bolinhos de cebola", orig: "Onion Bhaji", desc: "Cebola em tempura de grão-de-bico com chutney de menta.", price: "5,20 €", spice: 1, veg: true },
      { pt: "Sopa de lentilhas", orig: "Dal Shorba", desc: "Sopa suave de lentilhas com cominhos e coentros frescos.", price: "4,80 €", spice: 0, veg: true },
    ],
  },
  {
    id: "curries",
    title: "Curries",
    items: [
      { pt: "Frango na manteiga", orig: "Murgh Makhani · Butter Chicken", desc: "O nosso prato-assinatura: frango tandoori em molho de tomate, manteiga e caju, finalizado com nata.", price: "13,90 €", spice: 1, signature: true },
      { pt: "Caril de cordeiro picante", orig: "Lamb Rogan Josh", desc: "Cordeiro estufado lentamente com especiarias de Caxemira.", price: "15,50 €", spice: 3 },
      { pt: "Espinafres com queijo fresco", orig: "Palak Paneer", desc: "Espinafres cremosos com paneer caseiro e alho tostado.", price: "11,90 €", spice: 1, veg: true },
      { pt: "Caril de camarão com côco", orig: "Prawn Malai Curry", desc: "Camarão em leite de côco, açafrão e limão.", price: "16,90 €", spice: 2 },
      { pt: "Grão-de-bico à moda de Punjab", orig: "Chana Masala", desc: "Grão-de-bico em molho de tomate, gengibre e amchur.", price: "10,90 €", spice: 2, veg: true },
    ],
  },
  {
    id: "biryanis",
    title: "Biryanis",
    items: [
      { pt: "Biryani de frango", orig: "Chicken Biryani", desc: "Arroz basmati cozinhado em camadas com frango, açafrão e frutos secos.", price: "13,50 €", spice: 2 },
      { pt: "Biryani de cordeiro", orig: "Lamb Biryani", desc: "Cordeiro tenro, arroz perfumado e cebola caramelizada.", price: "15,90 €", spice: 2 },
      { pt: "Biryani de legumes", orig: "Subz Biryani", desc: "Legumes da estação, castanha de caju e hortelã.", price: "11,50 €", spice: 1, veg: true },
    ],
  },
  {
    id: "tandoori",
    title: "Tandoori",
    note: "Grelhados no autêntico forno de barro tandoor",
    items: [
      { pt: "Frango tandoori", orig: "Tandoori Murgh", desc: "Meio frango marinado 24h em iogurte e especiarias.", price: "14,50 €", spice: 2 },
      { pt: "Espetadas de cordeiro", orig: "Seekh Kebab", desc: "Cordeiro picado com hortelã, gengibre e chili.", price: "15,20 €", spice: 3 },
      { pt: "Queijo fresco tandoori", orig: "Paneer Tikka", desc: "Paneer, pimentos e cebola glaceados no tandoor.", price: "12,50 €", spice: 1, veg: true },
    ],
  },
  {
    id: "paes",
    title: "Pães (Naan)",
    items: [
      { pt: "Naan simples", orig: "Plain Naan", desc: "Pão folhado cozido no tandoor.", price: "2,80 €", spice: 0, veg: true },
      { pt: "Naan de alho e coentros", orig: "Garlic Naan", desc: "Manteiga de alho e coentros frescos.", price: "3,50 €", spice: 0, veg: true },
      { pt: "Naan de queijo", orig: "Cheese Naan", desc: "Recheado com queijo derretido, favorito das crianças.", price: "4,20 €", spice: 0, veg: true },
      { pt: "Pão folhado integral", orig: "Tandoori Roti", desc: "Farinha de trigo integral, leve e crocante.", price: "2,60 €", spice: 0, veg: true },
    ],
  },
  {
    id: "sobremesas",
    title: "Sobremesas",
    items: [
      { pt: "Bolinhos em xarope", orig: "Gulab Jamun", desc: "Servidos tépidos em xarope de cardamomo e água de rosas.", price: "4,90 €", veg: true },
      { pt: "Arroz doce indiano", orig: "Kheer", desc: "Arroz basmati, leite, açafrão e pistácio.", price: "4,50 €", veg: true },
      { pt: "Gelado de manga", orig: "Mango Kulfi", desc: "Gelado tradicional denso de manga alphonso.", price: "4,90 €", veg: true },
    ],
  },
  {
    id: "bebidas",
    title: "Bebidas",
    items: [
      { pt: "Lassi de manga", orig: "Mango Lassi", desc: "Iogurte batido com polpa de manga.", price: "4,20 €", veg: true },
      { pt: "Chá com especiarias", orig: "Masala Chai", desc: "Chá preto com leite, canela e cardamomo.", price: "2,80 €", veg: true },
      { pt: "Cerveja indiana", orig: "Kingfisher 33cl", desc: "Lager leve, perfeita com pratos picantes.", price: "3,90 €" },
      { pt: "Vinho da casa (copo)", orig: "Vinho Português", desc: "Seleção de tinto ou branco do Douro.", price: "3,50 €" },
    ],
  },
];

export const REVIEWS = [
  {
    name: "David Robson",
    origin: "Google · Guia local",
    text: "Viemos por vontade de mudar da comida portuguesa e adorámos. Sendo britânico, boa comida indiana é algo de que sinto falta, e este sítio satisfez esse desejo com distinção.",
  },
  {
    name: "ET",
    origin: "Google",
    text: "Restaurante indiano incrível! A comida é absolutamente delicioso e cheia de sabor. O butter chicken e o cheese naan são obrigatórios. Ótimo ambiente e equipa simpática.",
  },
  {
    name: "Lúcia Araujo",
    origin: "Google · Guia local",
    text: "Experimentem o novo restaurante de comida indiana de Espinho! A minha experiência foi incrível. A comida estava muito boa, o ambiente impecável e a equipa sempre muito simpática.",
  },
  {
    name: "Marta S.",
    origin: "Google",
    text: "Magia da Índia presente nos sabores dos pratos. Ambiente acolhedor e romântico, ideal para um jantar a dois.",
  },
  {
    name: "Rui P.",
    origin: "Google",
    text: "Tudo de muito boa qualidade e bem feito, colaboradores sempre simpáticos. Excelente relação qualidade-preço.",
  },
  {
    name: "Sofia Almeida",
    origin: "Google",
    text: "Fomos jantar em família e saímos todos rendidos. O cordeiro estava tenro e o naan de queijo desapareceu num instante. Já reservámos outra vez.",
  },
];

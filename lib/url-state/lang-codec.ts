export const CANON_V1 = [
  "slk_Latn",
  "pes_Arab",
  "lit_Latn",
  "swh_Latn",
  "cmn_Hans",
  "deu_Latn",
  "smo_Latn",
  "lao_Laoo",
  "bjn_Arab",
  "kmr_Latn",
  "fil_Latn",
  "ind_Latn",
  "sun_Latn",
  "urd_Arab",
  "yor_Latn",
  "spa_Latn",
  "war_Latn",
  "wuu_Hans",
  "taq_Tfng",
  "min_Arab",
  "ron_Latn",
  "ilo_Latn",
  "fin_Latn",
  "khm_Khmr",
  "ita_Latn",
  "zgh_Tfng",
  "vie_Latn",
  "ibo_Latn",
  "gaz_Latn",
  "hin_Deva",
  "nld_Latn",
  "arb_Arab",
  "pol_Latn",
  "ayr_Latn",
  "hye_Armn",
  "bjn_Latn",
  "kor_Hang",
  "som_Latn",
  "zsm_Latn",
  "lvs_Latn",
  "ceb_Latn",
  "jav_Latn",
  "mar_Deva",
  "azj_Latn",
  "fij_Latn",
  "ekk_Latn",
  "jpn_Jpan",
  "zul_Latn",
  "xho_Latn",
  "tha_Thai",
  "mri_Latn",
  "hun_Latn",
  "cmn_Hant",
  "hau_Latn",
  "fra_Latn",
  "kan_Knda",
  "ukr_Cyrl",
  "amh_Ethi",
  "rus_Cyrl",
  "pbt_Arab",
  "srp_Cyrl",
  "min_Latn",
  "azb_Arab",
  "tur_Latn",
  "heb_Hebr",
  "taq_Latn",
  "isl_Latn",
  "ben_Beng",
  "por_Latn",
  "nob_Latn",
  "quy_Latn",
  "tam_Taml",
  "ces_Latn",
  "gug_Latn",
  "swe_Latn",
  "bul_Cyrl",
  "eng_Latn",
  "yue_Hant",
  "tel_Telu",
] as const;

const VERSION = "1";
const CANON = CANON_V1;

const B32_ALPHABET = "abcdefghjkmnpqrstuvwxyz234567";

function bytesToBase32(bytes: Uint8Array): string {
  let bits = 0,
    value = 0,
    output = "";
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += B32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += B32_ALPHABET[(value << (5 - bits)) & 31];
  }
  return output;
}

function base32ToBytes(base32: string): Uint8Array {
  const bytes: number[] = [];
  let bits = 0,
    value = 0;
  for (const char of base32) {
    const index = B32_ALPHABET.indexOf(char);
    if (index === -1) continue;
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return new Uint8Array(bytes);
}

export function encodeLangs(selected: string[]): string {
  const set = new Set(selected);
  const bytes = new Uint8Array(Math.ceil(CANON.length / 8));
  CANON.forEach((code, i) => {
    if (set.has(code)) bytes[i >> 3] |= 1 << (i & 7);
  });
  return `${VERSION}.${bytesToBase32(bytes)}`;
}

export function decodeLangs(encoded: string): string[] {
  const [version, token] = encoded.split(".");
  if (version !== VERSION || !token) return [];
  try {
    const bytes = base32ToBytes(token);
    return CANON.filter((_, i) => bytes[i >> 3] & (1 << (i & 7)));
  } catch {
    return [];
  }
}

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

export function encodeLangs(selected: string[]): string {
  const set = new Set(selected);
  const bytes = new Uint8Array(Math.ceil(CANON.length / 8));
  CANON.forEach((code, i) => {
    if (set.has(code)) {
      bytes[i >> 3] |= 1 << (i & 7);
    }
  });
  let bin = "";
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return (
    `${VERSION}.` +
    btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
  );
}

export function decodeLangs(encoded: string): string[] {
  const [version, b64] = encoded.split(".");
  if (version !== VERSION || !b64) return [];
  try {
    const bin = atob(b64.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return CANON.filter((_, i) => bytes[i >> 3] & (1 << (i & 7)));
  } catch {
    return [];
  }
}

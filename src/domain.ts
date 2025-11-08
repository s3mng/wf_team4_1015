export type Domain =
  | 'FINTECH'
  | 'HEALTHTECH'
  | 'EDUCATION'
  | 'ECOMMERCE'
  | 'FOODTECH'
  | 'MOBILITY'
  | 'CONTENTS'
  | 'B2B'
  | 'OTHERS'

export function domainToKorean(domain: Domain): string {
  switch (domain) {
    case "FINTECH":
      return "핀테크";
    case "HEALTHTECH":
      return "헬스테크";
    case "EDUCATION":
      return "교육";
    case "ECOMMERCE":
      return "이커머스";
    case "FOODTECH":
      return "푸드테크";
    case "MOBILITY":
      return "모빌리티";
    case "CONTENTS":
      return "콘텐츠";
    case "B2B":
      return "B2B";
    case "OTHERS":
      return "기타";
  }
}
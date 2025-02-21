import { getLocales } from "expo-localization";

export const countries = [
    { name: "United States", code: "US", dialCode: "+1" },
    { name: "United Kingdom", code: "GB", dialCode: "+44" },
    { name: "France", code: "FR", dialCode: "+33" },
    { name: "Spain", code: "ES", dialCode: "+34" },
    { name: "Italy", code: "IT", dialCode: "+39" },
    { name: "Germany", code: "DE", dialCode: "+49" },
    { name: "Canada", code: "CA", dialCode: "+1" },
    { name: "Australia", code: "AU", dialCode: "+61" },
    { name: "Japan", code: "JP", dialCode: "+81" },
    { name: "China", code: "CN", dialCode: "+86" },
    { name: "Thailand", code: "TH", dialCode: "+66" },
    { name: "Mexico", code: "MX", dialCode: "+52" },
    { name: "Brazil", code: "BR", dialCode: "+55" },
    { name: "United Arab Emirates", code: "AE", dialCode: "+971" },
    { name: "South Korea", code: "KR", dialCode: "+82" },
    { name: "Greece", code: "GR", dialCode: "+30" },
    { name: "Switzerland", code: "CH", dialCode: "+41" },
    { name: "Portugal", code: "PT", dialCode: "+351" },
    { name: "India", code: "IN", dialCode: "+91" },
    { name: "Indonesia", code: "ID", dialCode: "+62" },
    { name: "Netherlands", code: "NL", dialCode: "+31" },
    { name: "Turkey", code: "TR", dialCode: "+90" },
    { name: "Egypt", code: "EG", dialCode: "+20" },
    { name: "South Africa", code: "ZA", dialCode: "+27" },
    { name: "Vietnam", code: "VN", dialCode: "+84" }
  ]
  
export const getDefaultCountry = () => {
  const localeCountryCode = getLocales()[0].regionCode || "GB"; // Returns country code (e.g., "US", "GB")
  return countries.find((country) => country.code === localeCountryCode) || countries[0];
};